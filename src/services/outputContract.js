/**
 * Output contract builder + validator.
 *
 * Validates STRUCTURE only: parseability, required fields, types, section
 * presence, length limits. It never verifies factual correctness — that is
 * explicitly a human check (see CONTRACT_NOTICE).
 */
export const CONTRACT_NOTICE =
  'Structure validation only — checks that the response matches the declared shape (fields, types, limits). It does not verify factual correctness.';

export const CONTRACT_TEMPLATES = {
  bullets: { format: 'bullets', sections: [], minItems: 1, maxItems: null },
  table: { format: 'table', columns: [], minRows: 1, maxRows: null },
  json_object: { format: 'json', requiredKeys: [], types: {} },
  numbered_steps: { format: 'numbered', minItems: 1, maxItems: null },
  paragraphs: { format: 'paragraphs', minParagraphs: 1, maxParagraphs: null },
};

export function buildContract(spec) {
  const s = spec || {};
  return {
    format: String(s.format || 'bullets'),
    requiredKeys: Array.isArray(s.requiredKeys) ? s.requiredKeys : [],
    types: s.types && typeof s.types === 'object' ? { ...s.types } : {},
    columns: Array.isArray(s.columns) ? s.columns : [],
    sections: Array.isArray(s.sections) ? s.sections : [],
    minItems: Number.isFinite(s.minItems) ? s.minItems : null,
    maxItems: Number.isFinite(s.maxItems) ? s.maxItems : null,
    pattern: typeof s.pattern === 'string' && s.pattern ? s.pattern : null,
    notice: CONTRACT_NOTICE,
  };
}

function countItems(format, text) {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (format === 'bullets') return lines.filter((l) => /^[-*•]\s/.test(l)).length;
  if (format === 'numbered') return lines.filter((l) => /^\d+[.)]\s/.test(l)).length;
  if (format === 'paragraphs') return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).length;
  return 0;
}

export function validateAgainstContract(rawOutput, contract) {
  const c = contract || buildContract({});
  const checks = [];
  const text = typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput ?? '');
  let parsed = null;

  if (c.format === 'json') {
    try { parsed = typeof rawOutput === 'string' ? JSON.parse(rawOutput) : rawOutput; checks.push({ id: 'parses', label: 'Response parses as JSON', pass: !!parsed && typeof parsed === 'object' }); }
    catch (e) { checks.push({ id: 'parses', label: 'Response parses as JSON', pass: false, detail: String(e.message).slice(0, 120) }); }
    if (parsed && typeof parsed === 'object') {
      for (const key of c.requiredKeys) {
        const present = Object.prototype.hasOwnProperty.call(parsed, key);
        checks.push({ id: `key:${key}`, label: `Required key "${key}" present`, pass: present });
        if (present && c.types[key]) {
          const t = c.types[key];
          const actual = Array.isArray(parsed[key]) ? 'array' : parsed[key] === null ? 'null' : typeof parsed[key];
          checks.push({ id: `type:${key}`, label: `"${key}" is ${t}`, pass: t === 'array' ? actual === 'array' : actual === t, detail: actual === t ? undefined : `got ${actual}` });
        }
      }
    }
  } else if (c.format === 'table') {
    const rows = text.split(/\n/).filter((l) => l.trim().startsWith('|'));
    checks.push({ id: 'table-rows', label: 'Markdown table rows present', pass: rows.length >= 2, detail: rows.length < 2 ? 'need header + ≥1 data row' : undefined });
    if (c.columns.length) {
      const header = rows[0] || '';
      const missing = c.columns.filter((col) => !header.includes(col));
      checks.push({ id: 'table-cols', label: `Columns: ${c.columns.join(', ')}`, pass: missing.length === 0, detail: missing.length ? `missing ${missing.join(', ')}` : undefined });
    }
  } else {
    const n = countItems(c.format, text);
    if (c.minItems !== null) checks.push({ id: 'min-items', label: `≥ ${c.minItems} item(s)`, pass: n >= c.minItems, detail: `found ${n}` });
    if (c.maxItems !== null) checks.push({ id: 'max-items', label: `≤ ${c.maxItems} item(s)`, pass: n <= c.maxItems, detail: `found ${n}` });
    if (c.minItems === null && c.maxItems === null) checks.push({ id: 'non-empty', label: 'Non-empty response', pass: text.trim().length > 0 });
  }

  for (const sec of c.sections) {
    checks.push({ id: `section:${sec}`, label: `Section "${sec}" present`, pass: text.toLowerCase().includes(String(sec).toLowerCase()) });
  }
  if (c.pattern) {
    let re = null;
    try { re = new RegExp(c.pattern); } catch (e) { re = null; }
    if (re) checks.push({ id: 'pattern', label: `Matches pattern`, pass: re.test(text), detail: c.pattern });
  }

  const pass = checks.length > 0 && checks.every((ch) => ch.pass);
  return { pass, checks, notice: CONTRACT_NOTICE, checkedCount: checks.length, failed: checks.filter((ch) => !ch.pass).length };
}
