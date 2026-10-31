/**
 * lineDfUtils.js — pure helpers for working with line/span data frames.
 *
 * These functions operate on plain JS arrays and objects; they have no
 * dependency on pdfjs-dist and are safe to use in the client bundle.
 * pdfParser.js (which imports pdfjs-dist) re-exports parsePdf only on the
 * server; the client uses /api/document/parse instead.
 */

export function weightedAverageFontSize(spans) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const s of spans) {
    const w = s.text.length;
    weightedSum += s.font_size * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function computeBoldRatio(spans) {
  if (spans.length === 0) return 0;
  const boldChars = spans.filter(s => s.is_bold).reduce((sum, s) => sum + s.text.length, 0);
  const totalChars = spans.reduce((sum, s) => sum + s.text.length, 0);
  return totalChars > 0 ? boldChars / totalChars : 0;
}

export function mostCommonFont(spans) {
  const counts = {};
  for (const s of spans) {
    counts[s.font_name] = (counts[s.font_name] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
}

export function enrichLineDfWithStyle(lineDf, spanDf) {
  const spanMap = new Map();
  for (const span of spanDf) {
    const key = `${span.page_num}-${span.line_num}`;
    if (!spanMap.has(key)) spanMap.set(key, []);
    spanMap.get(key).push(span);
  }

  return lineDf.map(line => {
    const key = `${line.page_num}-${line.line_num}`;
    const spans = spanMap.get(key) || [];
    const enriched = { ...line };
    if (spans.length > 0) {
      enriched.font_size = weightedAverageFontSize(spans);
      enriched.bold_ratio = computeBoldRatio(spans);
      enriched.is_bold = enriched.bold_ratio > 0.5;
      enriched.is_italic = spans.some(s => s.is_italic);
      enriched.dominant_font_name = mostCommonFont(spans);
    }
    return enriched;
  });
}
