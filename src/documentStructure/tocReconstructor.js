import { enrichLineDfWithStyle } from './lineDfUtils.js';
import { mergeSplitHeadings, detectBodyHeadings } from './typography.js';
import { scoreHasNumericPrefix } from './typography.js';

const HEADING_VALIDATION_PROMPT = `
You are a document structure analyst. Your task is to validate heading candidates extracted from a PDF body text.

A heading candidate is a short line that might be a section title. False positives include:
- Figure captions (e.g., "Figure 3: architecture")
- Table row labels or cell values
- In-body emphasis (bold text used for emphasis, not titles)
- Enumerated list items
- BLEU scores or other numeric results
- Page numbers

Real headings typically:
- Have a numeric prefix (e.g., "1.", "1.2", "1.2.3", "I.", "A.")
- Are short (under 90 characters)
- Start at the left margin
- Have visual isolation (blank line above)
- Are bold or larger font

You will be given candidates in reading order with page number and surrounding context.
Return ONLY a JSON array of objects with these exact fields: title, page, level, source.
- title: the exact heading text
- page: the page number (1-indexed)
- level: integer hierarchy level (1 for top-level, 2 for subsection, etc.)
- source: always "body_structure"

You may also add missed headings you see in the context.
Do NOT include any explanation or text outside the JSON array.
`;

const HEADING_VALIDATION_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'page', 'level', 'source'],
    properties: {
      title: { type: 'string' },
      page: { type: 'integer' },
      level: { type: 'integer' },
      source: { type: 'string' },
    },
  },
};

export async function reconstructTocFromBody(lineDf, spanDf = null, options = {}) {
  let {
    mode = 'auto',
    existingTocDf = null,
    maxPasses = 3,
    llmParse = null,
    threshold = 3.0,
    weights = null,
    onPassLog = null,
  } = options;

  let processedLineDf = lineDf;

  if (spanDf && spanDf.length > 0) {
    processedLineDf = enrichLineDfWithStyle(lineDf, spanDf);
  }

  processedLineDf = mergeSplitHeadings(processedLineDf);
  let candidates = detectBodyHeadings(processedLineDf, threshold, weights);

  if (mode === 'auto') {
    if (existingTocDf && existingTocDf.length > 0) {
      const maxLevel = Math.max(...existingTocDf.map(t => t.level || 1));
      mode = maxLevel <= 2 ? 'extend_native' : 'no_toc';
    } else {
      mode = 'no_toc';
    }
  }

  if (mode === 'extend_native' && existingTocDf) {
    candidates = filterExisting(candidates, existingTocDf);
  }

  let tocEntries = candidates.map(c => ({
    title: c.text.trim(),
    page: c.page_num,
    level: c.candidate_level || inferLevel(c.text),
    source: 'body_structure',
    heading_score: c.heading_score,
  }));

  const validationLogs = [];

  if (llmParse) {
    const { finalEntries, logs } = await llmValidationLoop(
      tocEntries,
      processedLineDf,
      llmParse,
      maxPasses
    );
    tocEntries = finalEntries;
    validationLogs.push(...logs);
  } else {
    // Deterministic Mock Rule-based Validator (When AI key is absent)
    const { finalEntries, logs } = mockRuleValidationLoop(
      tocEntries,
      processedLineDf,
      maxPasses
    );
    tocEntries = finalEntries;
    validationLogs.push(...logs);
  }

  if (mode === 'extend_native' && existingTocDf) {
    const nativeSet = new Set(existingTocDf.map(t => `${t.title.toLowerCase()}-${t.page}`));
    const newEntries = tocEntries.filter(e => !nativeSet.has(`${e.title.toLowerCase()}-${e.page}`));
    tocEntries = [...existingTocDf, ...newEntries];
  }

  if (mode === 'composite') {
    const boundaries = detectDocumentBoundaries(processedLineDf);
    if (boundaries.length > 0) {
      tocEntries = rerouteCompositeToc(tocEntries, boundaries);
    }
  }

  tocEntries.sort((a, b) => a.page - b.page || a.level - b.level);

  if (onPassLog && typeof onPassLog === 'function') {
    onPassLog(validationLogs);
  }

  tocEntries.validationLogs = validationLogs;
  return tocEntries;
}

function filterExisting(candidates, existingTocDf) {
  const existingKeys = new Set(existingTocDf.map(t => `${t.title.toLowerCase()}-${t.page}`));
  return candidates.filter(c => {
    const key = `${c.text.toLowerCase()}-${c.page_num}`;
    return !existingKeys.has(key);
  });
}

function inferLevel(text) {
  const match = (text || '').trim().match(/^(\d+(?:\.\d+)*\.?|[IVXLCDM]+\.|[A-Z]\.)/);
  if (match) {
    const parts = match[1].replace(/\.$/, '').split('.').filter(Boolean);
    return parts.length > 0 ? parts.length : 1;
  }
  return 1;
}

async function llmValidationLoop(currentEntries, lineDf, llmParse, maxPasses) {
  let converged = false;
  let pass = 0;
  const logs = [];

  while (!converged && pass < maxPasses) {
    pass += 1;
    const context = buildContext(currentEntries, lineDf);
    let result = null;
    let errorMsg = null;

    try {
      result = await llmParse(HEADING_VALIDATION_PROMPT, context, HEADING_VALIDATION_SCHEMA);
    } catch (err) {
      errorMsg = err.message;
    }

    if (!result || !Array.isArray(result)) {
      logs.push({
        pass,
        keptCount: currentEntries.length,
        droppedCount: 0,
        addedCount: 0,
        status: errorMsg ? `Error: ${errorMsg}` : 'Invalid LLM response format',
        entries: [...currentEntries],
      });
      break;
    }

    const newEntries = result.map(r => ({
      title: r.title,
      page: r.page,
      level: r.level || inferLevel(r.title),
      source: r.source || 'body_structure',
      heading_score: r.heading_score || 3.5,
    }));

    const keptSet = new Set(newEntries.map(e => `${e.title.toLowerCase()}-${e.page}`));
    const droppedCount = currentEntries.filter(e => !keptSet.has(`${e.title.toLowerCase()}-${e.page}`)).length;
    const prevSet = new Set(currentEntries.map(e => `${e.title.toLowerCase()}-${e.page}`));
    const addedCount = newEntries.filter(e => !prevSet.has(`${e.title.toLowerCase()}-${e.page}`)).length;

    const isSame = JSON.stringify(currentEntries) === JSON.stringify(newEntries);

    logs.push({
      pass,
      keptCount: newEntries.length,
      droppedCount,
      addedCount,
      status: isSame ? 'Converged (No changes)' : `Updated (-${droppedCount}, +${addedCount})`,
      entries: [...newEntries],
    });

    if (isSame) {
      converged = true;
    } else {
      currentEntries = newEntries;
    }
  }

  return { finalEntries: currentEntries, logs };
}

function mockRuleValidationLoop(currentEntries, lineDf, maxPasses) {
  const logs = [];
  let pass = 0;
  let entries = [...currentEntries];

  while (pass < Math.min(2, maxPasses)) {
    pass += 1;

    // Filter out common false positives deterministically
    const filtered = entries.filter(e => {
      const t = e.title.trim();
      // Drop single numbers or table cell digits (e.g. BLEU scores 28.4, 4.33)
      if (/^\d+(\.\d+)?$/.test(t)) return false;
      // Drop figure captions
      if (/^(figure|fig\.|table|tab\.)\s*\d+/i.test(t)) return false;
      // Drop dot leader lines
      if (/\.{4,}/.test(t)) return false;
      // Drop excessively long strings
      if (t.length > 90) return false;
      return true;
    });

    const droppedCount = entries.length - filtered.length;

    logs.push({
      pass,
      keptCount: filtered.length,
      droppedCount,
      addedCount: 0,
      status: pass === 1 ? `Deterministic Rule Filter (-${droppedCount} false positives)` : 'Converged (Mock Pass)',
      entries: [...filtered],
    });

    entries = filtered;
    if (droppedCount === 0) break;
  }

  return { finalEntries: entries, logs };
}

function buildContext(currentEntries, lineDf) {
  const linesByPage = new Map();
  for (const l of lineDf) {
    if (!linesByPage.has(l.page_num)) linesByPage.set(l.page_num, []);
    linesByPage.get(l.page_num).push(l);
  }

  const context = [];
  context.push('HEADING CANDIDATES (current state):');
  if (currentEntries.length === 0) {
    context.push('None found yet.');
  } else {
    for (const entry of currentEntries) {
      context.push(`- Page ${entry.page}, Level ${entry.level}: "${entry.title}" (score: ${entry.heading_score?.toFixed(2)})`);
    }
  }

  context.push('\nSAMPLE BODY CONTEXT (first 5 pages):');
  const samplePages = Array.from(linesByPage.keys()).slice(0, 5);
  for (const page of samplePages) {
    const lines = linesByPage.get(page) || [];
    context.push(`\n--- Page ${page} ---`);
    for (const l of lines.slice(0, 30)) {
      context.push(`${l.text}`);
    }
  }

  context.push('\nINSTRUCTIONS: Return JSON array of kept headings. Include any missed headings you see in the context.');
  return context.join('\n');
}

export function detectDocumentBoundaries(lineDf) {
  const boundaries = [];
  const pages = new Map();
  for (const l of lineDf) {
    if (!pages.has(l.page_num)) pages.set(l.page_num, []);
    pages.get(l.page_num).push(l);
  }

  let prevMaxNumber = -1;
  let prevFontMedian = -1;

  for (const [pageNum, lines] of pages) {
    // Signal 1: Numbering Re-initialization
    const pageNumbers = lines.filter(l => /^\s*\d+\s*$/.test(l.text.trim())).map(l => parseInt(l.text.trim()));
    const maxPageNumber = pageNumbers.length > 0 ? Math.max(...pageNumbers) : -1;

    if (prevMaxNumber >= 0 && maxPageNumber > 0 && maxPageNumber < prevMaxNumber * 0.5) {
      boundaries.push({
        type: 'numbering_reinit',
        page: pageNum,
        confidence: 0.85,
        reason: `Page numbers re-initialized from ${prevMaxNumber} to ${maxPageNumber}`,
      });
    }

    // Signal 2: Font Style Rupture
    const fontSizes = lines.map(l => l.font_size).filter(s => s > 0);
    const medianSize = fontSizes.length > 0 ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length : 10;
    if (prevFontMedian > 0 && Math.abs(medianSize - prevFontMedian) > 3.0) {
      boundaries.push({
        type: 'style_rupture',
        page: pageNum,
        confidence: 0.75,
        reason: `Median font size changed significantly (${prevFontMedian.toFixed(1)}pt -> ${medianSize.toFixed(1)}pt)`,
      });
    }

    // Signal 3: Cover Page Detection
    if (lines.length <= 8 && lines.some(l => l.font_size > 18)) {
      boundaries.push({
        type: 'cover_page',
        page: pageNum,
        confidence: 0.9,
        reason: `Cover page detected (large title ${Math.max(...lines.map(l=>l.font_size))}pt with low line count)`,
      });
    }

    if (maxPageNumber > 0) prevMaxNumber = maxPageNumber;
    prevFontMedian = medianSize;
  }

  return boundaries;
}

function rerouteCompositeToc(tocEntries, boundaries) {
  const boundaryPages = new Set(boundaries.map(b => b.page));
  let currentDocIndex = 1;

  return tocEntries.map(entry => {
    if (boundaryPages.has(entry.page)) {
      currentDocIndex += 1;
    }
    return {
      ...entry,
      document_group: `Document ${currentDocIndex}`,
      level: entry.level + 1,
    };
  });
}

export function tagParagraphsWithDualLayer(lineDf, tocDf, customTaxonomy = null) {
  const defaultTaxonomy = [
    { tag: 'garantie', keywords: ['garantie', 'guarantee', 'coverage', 'covered'] },
    { tag: 'garantie:collision', keywords: ['collision', 'crash', 'accident'] },
    { tag: 'exclusion', keywords: ['exclusion', 'excluded', 'not covered', 'except'] },
    { tag: 'exclusion:vitesse', keywords: ['speed', 'vitesse', 'racing', 'race'] },
    { tag: 'plafond', keywords: ['limit', 'plafond', 'maximum', 'deductible'] },
  ];

  const taxonomy = customTaxonomy || defaultTaxonomy;

  // Group lines by page into paragraphs
  const paragraphs = [];
  const sortedToc = [...tocDf].sort((a, b) => a.page - b.page);

  let currentParagraph = [];

  for (let i = 0; i < lineDf.length; i++) {
    const line = lineDf[i];
    currentParagraph.push(line);

    // End paragraph on blank gap or end of line array
    const isLast = i === lineDf.length - 1;
    const isGap = !isLast && (lineDf[i + 1].page_num !== line.page_num || lineDf[i + 1].y0 - line.y0 > 20);

    if (isGap || isLast) {
      const pText = currentParagraph.map(l => l.text).join(' ');
      const pPage = currentParagraph[0].page_num;

      // Find Layer 1 Section Anchor
      const matchingSection = sortedToc.filter(t => t.page <= pPage).pop() || { title: 'Preamble', level: 1 };

      // Compute Layer 2 Business Tags
      const lowerText = pText.toLowerCase();
      const tags = [];
      for (const item of taxonomy) {
        if (item.keywords.some(kw => lowerText.includes(kw))) {
          tags.push(item.tag);
        }
      }

      paragraphs.push({
        id: `p-${paragraphs.length + 1}`,
        page: pPage,
        text: pText,
        layer1_section: matchingSection.title,
        layer1_level: matchingSection.level,
        layer2_tags: tags.length > 0 ? tags : ['general'],
      });

      currentParagraph = [];
    }
  }

  return paragraphs;
}

export function reconstructTocFromBodyWithFallback(lineDf, spanDf = null, options = {}) {
  const result = reconstructTocFromBody(lineDf, spanDf, options);
  if (result.length > 0) return result;

  const relaxedThreshold = options.threshold ? options.threshold - 1.0 : 2.0;
  return reconstructTocFromBody(lineDf, spanDf, { ...options, threshold: relaxedThreshold });
}

