/**
 * api/document/parse — Vercel serverless function for server-side PDF parsing.
 *
 * POST /api/document/parse
 *   Content-Type: application/octet-stream (raw PDF bytes)
 *   Body: PDF file bytes
 *
 * Returns: { line_df: [...], span_df: [...] }
 *
 * No auth required — the PDF is processed in-function and not stored.
 * Per-IP rate limit (same in-memory store as the AI proxy) protects against abuse.
 *
 * Cache-Control: no-store — the result is document-specific and must not be cached.
 *
 * This function intentionally uses pdfjs-dist's legacy Node-compatible build so that
 * pdfjs-dist can be removed from the client bundle entirely (saving ~200 kB vendor gzip).
 */

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { checkIpRateLimit } from '../_lib/rateLimit.js';

// The legacy Node build does not need a worker URL.
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_PAGES = 100;

export const config = {
  runtime: 'nodejs22.x',
  maxDuration: 60,
};

function sendJson(res, status, payload) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
    return;
  }

  // ── Per-IP rate limit (shared store with AI proxy) ──
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? forwarded.split(',')[0] : null)
    || req.socket?.remoteAddress
    || 'unknown';
  const ipLimit = checkIpRateLimit(ip + ':pdf'); // keyed separately from AI proxy
  if (!ipLimit.allowed) {
    sendJson(res, 429, {
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: ipLimit.retryAfter,
    });
    return;
  }

  // ── Read raw body ──
  let raw;
  try {
    raw = await readBody(req);
  } catch {
    sendJson(res, 400, { error: 'Failed to read request body.' });
    return;
  }

  if (raw.length === 0) {
    sendJson(res, 400, { error: 'Empty body. Send a PDF file as application/octet-stream.' });
    return;
  }
  if (raw.length > MAX_PDF_BYTES) {
    sendJson(res, 413, { error: `PDF too large. Maximum size is ${MAX_PDF_BYTES / 1024 / 1024} MB.` });
    return;
  }

  // Basic PDF header check (%PDF-)
  const header = raw.slice(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    sendJson(res, 400, { error: 'Content does not appear to be a valid PDF (missing %PDF- header).' });
    return;
  }

  // ── Parse PDF in-process (Node legacy build, no worker thread needed) ──
  let result;
  try {
    result = await parsePdfBuffer(raw);
  } catch (err) {
    sendJson(res, 422, { error: `PDF parsing failed: ${err.message}` });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(result);
}

async function parsePdfBuffer(buffer) {
  // pdfjs-dist accepts a Uint8Array
  const data = new Uint8Array(buffer);
  const pdf = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
  const pageCount = Math.min(pdf.numPages, MAX_PAGES);

  const lineRows = [];
  const spanRows = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const viewport = page.getViewport({ scale: 1.0 });
    const pageHeight = viewport.height;

    const lines = new Map();

    for (const item of textContent.items) {
      if (!item.str || item.str.trim().length === 0) continue;

      const tx = item.transform;
      const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
      const x = tx[4];
      const y = pageHeight - tx[5];

      const lineKey = `${pageNum}-${Math.round(y)}`;

      if (!lines.has(lineKey)) {
        lines.set(lineKey, {
          page_num: pageNum,
          line_num: lines.size + 1,
          text: '',
          x0: x,
          y0: y,
          width: 0,
          height: fontSize,
          font_size: fontSize,
          font_name: item.fontName || '',
          spans: [],
        });
      }

      const line = lines.get(lineKey);
      line.text += (line.text ? ' ' : '') + item.str;
      line.spans.push({
        text: item.str,
        x,
        y,
        width: item.width || 0,
        height: fontSize,
        font_size: fontSize,
        font_name: item.fontName || '',
        is_bold: /bold|black|heavy/i.test(item.fontName || ''),
        is_italic: /italic|oblique/i.test(item.fontName || ''),
      });
      line.x0 = Math.min(line.x0, x);
      line.width = Math.max(line.width, (x - line.x0) + (item.width || 0));
      line.font_size = weightedAverageFontSize(line.spans);
      line.bold_ratio = computeBoldRatio(line.spans);
      line.is_bold = line.bold_ratio > 0.5;
      line.font_name = mostCommonFont(line.spans);
    }

    const sortedLines = Array.from(lines.values()).sort((a, b) => a.y0 - b.y0);
    sortedLines.forEach((line, idx) => {
      line.line_num = idx + 1;
      lineRows.push(line);
      line.spans.forEach((span, sIdx) => {
        spanRows.push({
          page_num: line.page_num,
          line_num: line.line_num,
          span_idx: sIdx,
          text: span.text,
          x0: span.x,
          y0: span.y,
          width: span.width,
          height: span.height,
          font_size: span.font_size,
          font_name: span.font_name,
          is_bold: span.is_bold,
          is_italic: span.is_italic,
        });
      });
    });
  }

  return { line_df: lineRows, span_df: spanRows };
}

function weightedAverageFontSize(spans) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const s of spans) {
    const w = s.text.length;
    weightedSum += s.font_size * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

function computeBoldRatio(spans) {
  if (spans.length === 0) return 0;
  const boldChars = spans.filter(s => s.is_bold).reduce((sum, s) => sum + s.text.length, 0);
  const totalChars = spans.reduce((sum, s) => sum + s.text.length, 0);
  return totalChars > 0 ? boldChars / totalChars : 0;
}

function mostCommonFont(spans) {
  const counts = {};
  for (const s of spans) {
    counts[s.font_name] = (counts[s.font_name] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}
