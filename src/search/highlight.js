/**
 * Text highlighting helper — pure, no dependencies (safe for the main bundle).
 */

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Split text into segments for highlighting: [{ text, match }].
 * `terms` are matched case-insensitively as whole words or prefixes.
 */
export function highlightSegments(text, terms) {
  if (!text) return [];
  const cleaned = (terms || []).map((t) => t.toLowerCase()).filter((t) => t.length > 1);
  if (cleaned.length === 0) return [{ text, match: false }];
  const pattern = new RegExp(
    `\\b(${cleaned.map(escapeRegExp).sort((a, b) => b.length - a.length).join('|')})`,
    'gi'
  );
  const segments = [];
  let last = 0;
  let m;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), match: false });
    segments.push({ text: m[0], match: true });
    last = m.index + m[0].length;
    if (pattern.lastIndex === m.index) pattern.lastIndex++;
  }
  if (last < text.length) segments.push({ text: text.slice(last), match: false });
  return segments.length ? segments : [{ text, match: false }];
}
