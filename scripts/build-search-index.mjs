/**
 * build-search-index.mjs — generate/refresh src/search/search-index.json
 *
 * Drafts one record per tab from tabsRegistry.js (id, label, umbrella) plus
 * a heuristic scrape of each tab component (headings + first paragraph) for
 * `summary` and `body`. Safe to re-run: existing hand-edits in the JSON win
 * for any key already present (except title/module/body which refresh).
 * Use --force to regenerate everything from scratch.
 *
 * Usage:  node scripts/build-search-index.mjs [--force]
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'src', 'registry', 'tabsRegistry.js');
const OUT_PATH = path.join(ROOT, 'src', 'search', 'search-index.json');
const FORCE = process.argv.includes('--force');

const MAX_SUMMARY = 220;
const MAX_BODY = 600;

const cleanText = (s) =>
  String(s)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (s, max) => {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const sp = cut.lastIndexOf(' ');
  return (sp > max * 0.6 ? cut.slice(0, sp) : cut).trim() + '…';
};

/** Map tab id -> component source path (+ export name when the module exports several components). */
async function parseComponentPaths() {
  const src = await readFile(REGISTRY_PATH, 'utf8');
  const map = new Map();
  // Only parse inside TABS_REGISTRY (UMBRELLA_TOPICS also has `id:` keys).
  const region = src.slice(src.indexOf('export const TABS_REGISTRY'));
  const ids = [...region.matchAll(/^\s{4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
  const comps = [
    ...region.matchAll(
      /lazy\(\(\)\s*=>\s*import\("([^"]+)"\)(?:\.then\(m\s*=>\s*\(\{\s*default:\s*m\.(\w+)\s*\}\)\))?/g
    ),
  ].map((m) => ({ rel: m[1], exportName: m[2] || null }));
  const n = Math.min(ids.length, comps.length);
  for (let i = 0; i < n; i++) map.set(ids[i], comps[i]);
  return map;
}

/** True when the file actually defines the component (not merely re-exports it). */
function hasDefinition(source, exportName) {
  return new RegExp(`^(export )?(function|const) ${exportName}\\b`, 'm').test(source);
}

/** Pull a window of source lines for an exported function inside a large file. */
function extractFunctionWindow(source, exportName) {
  const lines = source.split('\n');
  let start = -1;
  const patterns = [
    new RegExp(`^export function ${exportName}\\b`),
    new RegExp(`^function ${exportName}\\b`),
    new RegExp(`^export const ${exportName}\\s*=`),
    new RegExp(`^const ${exportName}\\s*=`),
  ];
  for (let i = 0; i < lines.length; i++) {
    if (patterns.some((p) => p.test(lines[i]))) {
      start = i;
      break;
    }
  }
  if (start === -1) return source.slice(0, 20000);
  let end = lines.length;
  for (let i = start + 1; i < Math.min(lines.length, start + 800); i++) {
    if (/^(export )?function [A-Z]/.test(lines[i]) || /^export const [A-Z]/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

/** Heuristic: grab title/sub/heading strings + first paragraph-ish text from JSX source. */
function scrapeContent(windowSrc) {
  const titles = [];
  const paragraphs = [];
  const headingRe = /\b(?:title|heading|headline)\s*=\s*"([^"]{6,160})"/g;
  const subRe = /\b(?:sub|subtitle|description|blurb|tagline|caption)\s*=\s*"([^"]{20,240})"/g;
  const jsxHeadingRe = /<h[1-3][^>]*>\s*\{?["'`]([^"'`]{6,160})["'`]?\}?\s*<\/h[1-3]>/g;
  const pRe = /<p[^>]*>\s*\{?\s*["'`]([^"'`]{40,300})["'`]?\s*\}?\s*<\/p>/g;
  let m;
  while ((m = headingRe.exec(windowSrc)) !== null) {
    const t = cleanText(m[1]);
    if (t && !/^(true|false|null)$/i.test(t)) titles.push(t);
  }
  while ((m = jsxHeadingRe.exec(windowSrc)) !== null) titles.push(cleanText(m[1]));
  while ((m = subRe.exec(windowSrc)) !== null) paragraphs.push(cleanText(m[1]));
  while ((m = pRe.exec(windowSrc)) !== null) paragraphs.push(cleanText(m[1]));
  return { titles: [...new Set(titles)], paragraphs: [...new Set(paragraphs)] };
}

function deriveRelated(a, b) {
  const ka = new Set((a.tags || []).map((t) => t.toLowerCase()));
  const shared = (b.tags || []).filter((t) => ka.has(t.toLowerCase()));
  return shared.length;
}

async function main() {
  const [{ TABS_REGISTRY, UMBRELLA_TOPICS }, componentPaths] = await Promise.all([
    import(pathToFileURL(REGISTRY_PATH).href),
    parseComponentPaths(),
  ]);
  console.log(`Registry: ${TABS_REGISTRY.length} tabs, component paths found: ${componentPaths.size}`);

  let existing = {};
  if (existsSync(OUT_PATH)) {
    try {
      const raw = JSON.parse(await readFile(OUT_PATH, 'utf8'));
      existing = Object.fromEntries((raw.records || Object.values(raw)).map((r) => [r.id, r]));
    } catch {
      existing = {};
    }
  }

  const records = [];
  const newIds = new Set();
  for (const tab of TABS_REGISTRY) {
    const cp = componentPaths.get(tab.id);
    let titles = [];
    let paragraphs = [];
    if (cp) {
      const abs = path.resolve(path.dirname(REGISTRY_PATH), cp.rel);
      if (existsSync(abs)) {
        try {
          let src = await readFile(abs, 'utf8');
          if (cp.exportName && !hasDefinition(src, cp.exportName)) {
            // Re-export barrel (AppContent.jsx) — definitions live in App.jsx
            const appPath = path.join(path.dirname(abs), 'App.jsx');
            if (existsSync(appPath)) src = await readFile(appPath, 'utf8');
          }
          if (cp.exportName) src = extractFunctionWindow(src, cp.exportName);
          ({ titles, paragraphs } = scrapeContent(src));
        } catch {
          /* unreadable component — fall through with empty scrape */
        }
      }
    }

    const keywords = (tab.keywords || []).map((k) => cleanText(k).toLowerCase()).filter(Boolean);
    const parenAcronyms = [...String(tab.label).matchAll(/\(([A-Z0-9/+.\-]{2,})\)/g)].map((m) => m[1].toLowerCase());
    const tags = [...new Set([...keywords, ...parenAcronyms])];

    const summarySrc = paragraphs[0] || titles[1] || titles[0] || '';
    const summary = truncate(summarySrc, MAX_SUMMARY);
    const body = truncate(
      [...new Set([...keywords, ...titles])].join(' · '),
      MAX_BODY
    );

    const auto = {
      id: tab.id,
      title: tab.label,
      module: tab.umbrellaId,
      category: tab.category,
      tags,
      aliases: [],
      summary,
      body,
      related: [],
    };

    const prev = existing[tab.id];
    let rec;
    if (prev && !FORCE) {
      rec = {
        ...auto,
        // Hand-edited keys (present in the file) win; missing keys get auto values.
        ...Object.fromEntries(Object.entries(prev).filter(([k]) => k !== 'id' && k !== 'title' && k !== 'module')),
      };
      rec.id = tab.id;
      rec.title = tab.label;
      rec.module = tab.umbrellaId;
    } else {
      rec = auto;
      newIds.add(tab.id);
    }
    records.push(rec);
  }

  // Auto-draft `related` links for brand-new records only (same-module tabs
  // sharing ≥2 tags). Existing records keep whatever the file says — an
  // intentionally cleared related[] stays cleared.
  for (const rec of records) {
    if (newIds.has(rec.id) && Array.isArray(rec.related) && rec.related.length === 0 && rec.tags.length >= 2) {
      const scored = records
        .filter((o) => o.id !== rec.id && o.module === rec.module)
        .map((o) => ({ id: o.id, score: deriveRelated(rec, o) }))
        .filter((x) => x.score >= 2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.id);
      if (scored.length) rec.related = scored;
    }
  }

  records.sort((a, b) => a.id.localeCompare(b.id));
  const output = {
    _meta: {
      description:
        'AskAway search metadata — one record per tab. Hand-editable; rerun scripts/build-search-index.mjs to add new tabs (existing keys are preserved unless --force).',
      schema:
        '{ id, title, module, category?, tags[], aliases[], summary, body?, related[], rank? } — rank (number, e.g. 1.4) is an optional search score multiplier for canonical tabs',
      count: records.length,
    },
    records,
  };
  await writeFile(OUT_PATH, JSON.stringify(output, null, 2) + '\n');
  const withSummary = records.filter((r) => r.summary).length;
  console.log(`Wrote ${records.length} records → ${path.relative(ROOT, OUT_PATH)} (${withSummary} with summaries)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
