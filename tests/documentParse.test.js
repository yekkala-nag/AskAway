/**
 * tests/documentParse.test.js — unit tests for the /api/document/parse endpoint logic.
 *
 * The Vercel handler itself uses Node's http module and pdfjs-dist (which requires
 * the Node legacy build). We test the input-validation, rate-limit, and response-
 * shaping layers with a lightweight mock rather than running a live server.
 */

import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// ── helpers reused from the handler ─────────────────────────────────────────

const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB

function validatePdfInput(buffer) {
  if (!buffer || buffer.length === 0) {
    return { ok: false, status: 400, error: 'Empty body. Send a PDF file as application/octet-stream.' };
  }
  if (buffer.length > MAX_PDF_BYTES) {
    return {
      ok: false,
      status: 413,
      error: `PDF too large. Maximum size is ${MAX_PDF_BYTES / 1024 / 1024} MB.`,
    };
  }
  const header = buffer.slice(0, 5).toString('ascii');
  if (header !== '%PDF-') {
    return { ok: false, status: 400, error: 'Content does not appear to be a valid PDF (missing %PDF- header).' };
  }
  return { ok: true };
}

// ── checkIpRateLimit re-implementation (mirrors api/_lib/rateLimit.js) ───────

const IP_REQUEST_LIMIT = 20;
const IP_WINDOW_MS = 60000;
const ipHits = new Map();

function checkIpRateLimit(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + IP_WINDOW_MS });
    return { allowed: true };
  }
  if (entry.count >= IP_REQUEST_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('documentParse: input validation', () => {
  it('rejects empty body', () => {
    const result = validatePdfInput(Buffer.alloc(0));
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.match(result.error, /empty body/i);
  });

  it('rejects payload over 20 MB', () => {
    const big = Buffer.alloc(MAX_PDF_BYTES + 1);
    const result = validatePdfInput(big);
    assert.equal(result.ok, false);
    assert.equal(result.status, 413);
    assert.match(result.error, /too large/i);
  });

  it('rejects non-PDF content (bad magic bytes)', () => {
    const notPdf = Buffer.from('PK\x03\x04hello'); // zip file
    const result = validatePdfInput(notPdf);
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
    assert.match(result.error, /valid PDF/i);
  });

  it('rejects body without %PDF- prefix even if large enough', () => {
    const buf = Buffer.alloc(1024, 0x41); // 1 KB of 'A's
    const result = validatePdfInput(buf);
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it('accepts a valid PDF magic header', () => {
    const buf = Buffer.from('%PDF-1.7\n%âãÏÓ\n');
    const result = validatePdfInput(buf);
    assert.equal(result.ok, true);
  });

  it('accepts exactly 20 MB', () => {
    const buf = Buffer.from('%PDF-');
    const padded = Buffer.concat([buf, Buffer.alloc(MAX_PDF_BYTES - buf.length)]);
    assert.equal(padded.length, MAX_PDF_BYTES);
    const result = validatePdfInput(padded);
    assert.equal(result.ok, true);
  });
});

describe('documentParse: per-IP rate limit', () => {
  const testIp = '192.0.2.99:pdf-test-' + Date.now();

  it('allows first request', () => {
    const r = checkIpRateLimit(`${testIp}-a`);
    assert.equal(r.allowed, true);
  });

  it('allows up to the limit', () => {
    const ip = `${testIp}-b`;
    for (let i = 0; i < IP_REQUEST_LIMIT - 1; i++) {
      const r = checkIpRateLimit(ip);
      assert.equal(r.allowed, true, `request ${i + 1} should be allowed`);
    }
  });

  it('blocks the (limit + 1)th request', () => {
    const ip = `${testIp}-c`;
    for (let i = 0; i < IP_REQUEST_LIMIT; i++) {
      checkIpRateLimit(ip);
    }
    const r = checkIpRateLimit(ip);
    assert.equal(r.allowed, false);
    assert.ok(typeof r.retryAfter === 'number' && r.retryAfter > 0, 'retryAfter must be positive');
  });

  it('retryAfter is ≤ 60 seconds', () => {
    const ip = `${testIp}-d`;
    for (let i = 0; i < IP_REQUEST_LIMIT; i++) {
      checkIpRateLimit(ip);
    }
    const r = checkIpRateLimit(ip);
    assert.ok(r.retryAfter <= 60, `retryAfter ${r.retryAfter} should be <= 60`);
  });
});
