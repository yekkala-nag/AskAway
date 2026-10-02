#!/usr/bin/env node
/**
 * restyle-legacy-svg.mjs — one-time migration of the legacy LIGHT-canvas
 * diagrams in public/assets to the navy showcase ground + spectrum ramp.
 *
 * Rules (mirrors src/design-system/diagramTokens.js):
 *   1. canvas  #f7f5f0 / #f8fafc            -> DIAGRAM_BG gradient #090d16 -> #101a30
 *   2. light card fills (#fff/#ffffff/#f0ede6/#e0dcd4) -> family-A card #0f172a
 *   3. dark text (#1a1a2e …)                 -> #F1F5F9
 *   4. muted text (#6a6a7a …)                -> #94A3B8
 *   5. accents                                -> nearest SPECTRUM_STEPS color
 *   6. alpha tints (#xxxxxx14)               -> withAlpha(mapped, 0x21)
 *   7. hairlines (#e0dcd4 strokes)           -> #334155
 * repairs: fill="#rrggbb nn", font-size="<text>", undefined markers
 *
 * Unreferenced assets (inventory as of this migration — left in place by
 * decision, do NOT assume they are dead code without checking):
 *   SVG duplicates of inline App.jsx diagrams (stale):
 *     arch_mla.svg, arch_moe.svg, arch_speculative.svg, workflows_hierarchy.svg
 *   PNG infographics, no lesson references (≈5.7 MB):
 *     context_engineering_infographic.png, context_graph_multi_agent_memory_infographic.png,
 *     hybrid_retrieval_fusion_pipeline.png, langchain_pipeline.png,
 *     langgraph_framework_infographic.png, memory_engineering_architecture.png,
 *     multi_agent_systems_architecture.png, rag_indexing_retrieval_architecture.png,
 *     realtime_market_event_processing.png
 *   (askaway_logo.svg is referenced; the 4 referenced *_arch.png files are
 *    dark-ground and match the showcase frame.)
 *
 * usage: node scripts/restyle-legacy-svg.mjs [--write] [file …]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'public', 'assets');

const BG_FROM = '#090d16';
const BG_TO = '#101a30';
const CARD = '#0f172a';
const HAIRLINE = '#334155';
const TEXT_STRONG = '#F1F5F9';
const TEXT_MUTED = '#94A3B8';
const TINT_ALPHA = '21'; // 0x21 = 13% — matches spectrumVariant().tint

const RAMP = [
  '#C96A5A', '#E08A4C', '#E8C558', '#7FB069', '#5EC4C8', '#6A9BD8', '#A78BFA',
];

const toRgb = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};

const nearestRamp = (hex) => {
  const [r, g, b] = toRgb(hex);
  let best = RAMP[0];
  let bestD = Infinity;
  for (const c of RAMP) {
    const [cr, cg, cb] = toRgb(c);
    const d = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
};

/** legacy accent -> explicit ramp pick (semantic overrides over RGB nearest) */
const ACCENT_MAP = {
  '#c4572a': '#C96A5A', // rust   -> step 1 coral
  '#c9a84c': '#E8C558', // gold   -> step 3 yellow
  '#4a9a4a': '#7FB069', // green  -> step 4 green
  '#2a8a84': '#5EC4C8', // teal   -> step 5 teal
  '#9b7fd4': '#A78BFA', // violet -> step 7 violet
  '#5c3d8f': '#A78BFA', // deep violet -> step 7
  '#eab308': '#E8C558', '#facc15': '#E8C558', // category yellow -> step 3
};

const MUTED_TEXT = new Set(['#6a6a7a', '#4a5568', '#64748b', '#718096', '#475569']);
const DARK_TEXT = new Set(['#1a1a2e', '#0f172a', '#111827', '#1e293b', '#334155', '#2d3748']);
const LIGHT_FILL = new Set(['#fff', '#ffffff', '#f0ede6', '#e0dcd4', '#f7f5f0', '#eef2f6', '#f8fafc', '#eef2f7']);
/** light text is already correct on navy — never map it down to a hairline */
const NEAR_WHITE = new Set(['#fff', '#ffffff', '#f0ede6', '#e0dcd4', '#f1f5f9', '#cbd5e1', '#e2e8f0', '#f8fafc', '#eef2f7']);

/** pastel category chips (complete_rag_pipeline): fill -> dark card, stroke/text -> ramp */

const PASTEL_CHIP_FILL = new Set([
  '#e0f7ff', '#ede9fe', '#fefce8', '#fce7f3', '#f1f5f9',
  '#a5e3f5', '#c4b5fd', '#fde047', '#fef9c3', '#f9a8d4',
]);
const PASTEL_MAP = {
  '#e0f7ff': '#5EC4C8', '#a5e3f5': '#5EC4C8', '#7dd3fc': '#5EC4C8',
  '#ede9fe': '#A78BFA', '#c4b5fd': '#A78BFA', '#a78bfa': '#A78BFA',
  '#fefce8': '#E8C558', '#fef9c3': '#E8C558', '#fde047': '#E8C558',
  '#fce7f3': '#C96A5A', '#f9a8d4': '#C96A5A', '#f472b6': '#C96A5A',
};

/** neutral card borders — readable slate on the navy ground */
const NEUTRAL_STROKE = new Set(['#cbd5e1', '#e0dcd4', '#f1f5f9', '#e2e8f0']);
const NEUTRAL_STROKE_TO = '#475569';

/** status colors are global (diagramTokens.DIAGRAM_STATUS), text role only */
const STATUS_MAP = {
  '#059669': '#5EC4C8', '#16a34a': '#5EC4C8', '#22c55e': '#5EC4C8', '#4ade80': '#5EC4C8',
  '#b91c1c': '#ef4444', '#dc2626': '#ef4444', '#ef4444': '#ef4444', '#f87171': '#ef4444',
  '#eab308': '#F5A623', '#f59e0b': '#F5A623', '#a16207': '#F5A623', '#d97706': '#F5A623',
};

/** colors this script itself emits — never remap them (keeps re-runs idempotent) */
const CANONICAL = new Set([
  BG_FROM, BG_TO, CARD, HAIRLINE, NEUTRAL_STROKE_TO, TEXT_STRONG, TEXT_MUTED,
  ...RAMP, '#ef4444', '#F5A623',
].map((c) => c.toLowerCase()));

const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const WRITE = process.argv.includes('--write');
const files = (targets.length ? targets : [
  'agentic_rag', 'arch_mla', 'arch_moe', 'arch_speculative', 'context_engineering',
  'hallucination_loop', 'pipeline_flow', 'rag_types_spectrum', 'workflows_hierarchy',
  'overview_architecture', 'complete_rag_pipeline',
]).map((n) => (n.endsWith('.svg') ? n : `${n}.svg`));

const audit = new Map();
const note = (from, to, role) => {
  const k = `${from} -> ${to} [${role}]`;
  audit.set(k, (audit.get(k) || 0) + 1);
};

const mapAccent = (hex) => {
  const h = hex.toLowerCase();
  return ACCENT_MAP[h] || nearestRamp(h);
};

/** map one color token with role awareness */
const mapColor = (hexRaw, role) => {
  const hex = hexRaw.toLowerCase();
  const bare = hex.slice(0, 7);
  const hasAlpha = hex.length === 9;

  // already on-pattern — but a dark canonical color used as *text* must flip light
  if (CANONICAL.has(bare) && !(role === 'text' && DARK_TEXT.has(bare))) return null;

  // alpha tints of accents -> ramp tint
  if (hasAlpha) {
    const base = mapAccent(bare);
    return base.toLowerCase() === bare ? null : `${base}${TINT_ALPHA}`;
  }

  // pastel category chip: dark card + ramp accent
  if (role === 'fill-element' && PASTEL_CHIP_FILL.has(hex)) return CARD;
  if (PASTEL_MAP[hex]) return PASTEL_MAP[hex];

  // light text is already correct on navy
  if (role === 'text' && NEAR_WHITE.has(bare)) return null;

  if (LIGHT_FILL.has(bare)) return role === 'fill-element' ? CARD : NEUTRAL_STROKE_TO;
  if (NEUTRAL_STROKE.has(bare)) return role === 'fill-element' ? CARD : NEUTRAL_STROKE_TO;

  if (MUTED_TEXT.has(bare)) return role === 'text' ? TEXT_MUTED : NEUTRAL_STROKE_TO;
  if (DARK_TEXT.has(bare)) {
    if (role === 'text') return TEXT_STRONG;
    if (role === 'stroke') return HAIRLINE;
    return null; // dark card fills stay dark
  }

  if (role === 'text' && STATUS_MAP[hex]) return STATUS_MAP[hex];

  // any remaining unknown color: explicit accent pick, else nearest ramp
  if (ACCENT_MAP[hex]) return ACCENT_MAP[hex];
  return nearestRamp(hex);
};

/** attribute-level pass over one element tag */
const mapTag = (tag) => {
  let out = tag;

  const isText = tag.startsWith('<text');

  // repair: fill="#rrggbb nn" -> #rrggbbnn
  out = out.replace(/fill="(#[0-9a-fA-F]{6}) ([0-9a-fA-F]{1,2})"/g, (m, h, a) => {
    note(`${h} ${a}`, `${h}${a}`, 'repair-tint');
    return `fill="${h}${a.padStart(2, '0')}"`;
  });

  // repair: font-size="<non numeric>" (invalid -> browsers fall back to 16px)
  out = out.replace(/ font-size="[^0-9.][^"]*"/g, () => {
    note('font-size="<text>"', '(removed)', 'repair-font-size');
    return '';
  });

  for (const attr of ['fill', 'stroke']) {
    out = out.replace(new RegExp(`${attr}="(#[0-9a-fA-F]{3,8})"`, 'g'), (m, hex) => {
      const role = isText && attr === 'fill' ? 'text' : attr === 'fill' ? 'fill-element' : 'stroke';
      const mapped = mapColor(hex, role);
      if (!mapped) return m;
      if (mapped.toLowerCase() === hex.toLowerCase()) return m;
      note(hex, mapped, role);
      return `${attr}="${mapped}"`;
    });
  }
  return out;
};

for (const file of files) {
  const path = join(ASSETS, file);
  let svg = readFileSync(path, 'utf8');
  const original = svg;

  // 1. canvas rect -> navy gradient (inject def once)
  const canvasRect = /<rect width="(\d+)" height="(\d+)" fill="#f7f5f0"\/>/;
  if (canvasRect.test(svg)) {
    svg = svg.replace(canvasRect, (m, w, h) => {
      note('#f7f5f0', `url(#lbg) ${BG_FROM}->${BG_TO}`, 'canvas');
      return `<defs><linearGradient id="lbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${BG_FROM}"/><stop offset="1" stop-color="${BG_TO}"/></linearGradient></defs>\n<rect width="${w}" height="${h}" fill="url(#lbg)"/>`;
    });
  }

  // 1b. existing canvas gradients -> recolor stops
  svg = svg.replace(/stop-color="(#[0-9a-fA-F]{6})"/g, (m, hex) => {
    const h = hex.toLowerCase();
    if (['#f7f5f0', '#eef2f6', '#f8fafc', '#eef2f7'].includes(h)) {
      const to = ['#f7f5f0', '#eef2f6', '#f8fafc'].includes(h) ? BG_FROM : BG_TO;
      note(hex, to, 'canvas-stop');
      return `stop-color="${to}"`;
    }
    return m;
  });

  // 2. per-element attribute mapping
  svg = svg.replace(/<[a-zA-Z][^>]*>/g, mapTag);

  // 3. undefined marker refs
  const refs = [...svg.matchAll(/url\(#([A-Za-z0-9_-]+)\)/g)].map((m) => m[1]);
  const defs = [...svg.matchAll(/<(?:marker|linearGradient|radialGradient|filter|clipPath) id="([^"]+)"/g)].map((m) => m[1]);
  const missing = [...new Set(refs.filter((r) => !defs.includes(r)))];
  for (const id of missing) {
    const uses = svg.match(new RegExp(`stroke="(#[0-9A-Fa-f]{6})"[^>]*marker-end="url\\(#${id}\\)"`, 'g')) || [];
    const accent = (uses[0] || '').match(/stroke="(#[0-9A-Fa-f]{6})"/)?.[1] || RAMP[6];
    note(`marker #${id} (fill ${accent})`, mapAccent(accent), 'repair-marker');
    const marker = `<marker id="${id}" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6 Z" fill="${mapAccent(accent)}"/></marker>`;
    svg = svg.includes('</defs>')
      ? svg.replace(/<\/defs>/, `${marker}</defs>`)
      : svg.replace('</svg>', `<defs>${marker}</defs></svg>`);
  }

  if (svg !== original) {
    if (WRITE) writeFileSync(path, svg);
    console.log(`${WRITE ? 'wrote' : 'would write'} ${file} (${original.length} -> ${svg.length} bytes)`);
  } else {
    console.log(`unchanged ${file}`);
  }
}

console.log('\n--- audit ---');
for (const [k, v] of [...audit].sort()) console.log(`${String(v).padStart(4)}  ${k}`);
