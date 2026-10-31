/**
 * pdfParser.js — browser-side PDF parsing with pdfjs-dist.
 *
 * NOTE: This file imports pdfjs-dist and is intentionally NOT imported by the
 * main client bundle after Phase 5. The DocumentStructureTab now uses
 * /api/document/parse (server-side, Node legacy build) instead of this module.
 *
 * This file is kept for:
 *   - Capacitor / offline deployments that cannot reach the API endpoint.
 *   - Direct imports by other client-side code that may need client-side parsing.
 *
 * enrichLineDfWithStyle has been extracted to lineDfUtils.js (no pdfjs dep).
 */
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

import {
  weightedAverageFontSize,
  computeBoldRatio,
  mostCommonFont,
  enrichLineDfWithStyle,
} from './lineDfUtils.js';

export { enrichLineDfWithStyle } from './lineDfUtils.js';

export async function parsePdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages;

  const lineRows = [];
  const spanRows = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const viewport = page.getViewport({ scale: 1.0 });
    const pageHeight = viewport.height;

    const lines = new Map();

    for (const item of textContent.items) {
      if (item.str.trim().length === 0) continue;

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
