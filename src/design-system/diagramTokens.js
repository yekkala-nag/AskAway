/**
 * Diagram style guide — P2 UI pass
 * One accent family per umbrella. All NEW diagrams and figure chrome
 * use these values; legacy SVGs with bespoke gradients are grandfathered
 * (migrated opportunistically, never in bulk).
 *
 * Rules for new diagrams:
 * 1. Background: deep navy `#090d16 → #101a30` (dark) — never light gray.
 * 2. Exactly ONE umbrella accent + white/gray text. No rainbow gradients.
 * 3. Status colors are global, not per-diagram: ok #5EC4C8, warn #F5A623,
 *    bad #ef4444, info #5EC4C8.
 * 4. Room to breathe: ≥40px margins, ≥11px type, one idea per panel.
 */

import { SPECTRUM_STEPS, spectrumColor, withAlpha } from './spectrum.js';

export const DIAGRAM_ACCENTS = {
  foundations: { primary: '#5EC4C8', soft: 'rgba(42,181,176,0.14)' },
  rag_architecture: { primary: '#F0A89A', soft: 'rgba(255,138,107,0.14)' },
  context_memory: { primary: '#9B89C4', soft: 'rgba(139,123,216,0.14)' },
  agents_frameworks: { primary: '#F0A89A', soft: 'rgba(255,138,107,0.14)' },
  data_platform: { primary: '#5EC4C8', soft: 'rgba(42,181,176,0.14)' },
  frontiers_production: { primary: '#9B89C4', soft: 'rgba(139,123,216,0.14)' }
};

/**
 * Umbrella → spectrum step (hue-preserving, warm→cool).
 * 1 coral · 2 orange · 3 yellow (inline palettes only) · 4 green
 * 5 teal · 6 blue · 7 purple
 */
export const DIAGRAM_SPECTRUM_STEP = {
  rag_architecture: 1,
  agents_frameworks: 2,
  data_platform: 4,
  foundations: 5,
  frontiers_production: 6,
  context_memory: 7,
};

const MODULE_ALIAS = {
  rag: 'rag_architecture',
  context: 'context_memory',
  agents: 'agents_frameworks',
  platform: 'data_platform',
  frontiers: 'frontiers_production',
};

export function normalizeModuleId(moduleId) {
  return MODULE_ALIAS[moduleId] || moduleId;
}

export function spectrumStepForModule(moduleId) {
  return DIAGRAM_SPECTRUM_STEP[normalizeModuleId(moduleId)] || 5;
}

export function spectrumAccentForModule(moduleId) {
  return spectrumColor(spectrumStepForModule(moduleId));
}

export const DIAGRAM_STATUS = {
  ok: '#5EC4C8',
  warn: '#F5A623',
  bad: '#ef4444',
  info: '#5EC4C8',
  muted: '#64748b'
};

export const DIAGRAM_BG = { from: '#090d16', to: '#101a30' };

/** Canonical accent for a figure frame — spectrum color for the umbrella. */
export function diagramAccentForModule(moduleId) {
  return spectrumAccentForModule(moduleId);
}

/** Soft shimmer/gradient fill for an accent (back-compat shape). */
export function diagramSoftForModule(moduleId) {
  return withAlpha(diagramAccentForModule(moduleId), 0.14);
}

export { SPECTRUM_STEPS, spectrumColor };
