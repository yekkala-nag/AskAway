import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SPECTRUM,
  SPECTRUM_STEPS,
  PALETTE,
  SHOWCASE,
  withAlpha,
  spectrumColor,
  spectrumVariant,
  frameStyles,
} from '../src/design-system/spectrum.js';

import {
  DIAGRAM_ACCENTS,
  DIAGRAM_BG,
  DIAGRAM_SPECTRUM_STEP,
  normalizeModuleId,
  spectrumStepForModule,
  spectrumAccentForModule,
  diagramAccentForModule,
} from '../src/design-system/diagramTokens.js';

const APPROVED_RAMP = [
  '#C96A5A', // 1 Classical AI
  '#E08A4C', // 2 Machine Learning
  '#E8C558', // 3 Neural Networks
  '#7FB069', // 4 Deep Learning
  '#5EC4C8', // 5 Generative AI (current frontier)
  '#6A9BD8', // 6 Agentic AI
  '#A78BFA', // 7 General Intelligence
];

test('spectrum ramp is the approved 7-step warm→cool sequence', () => {
  assert.deepEqual(SPECTRUM, APPROVED_RAMP);
  assert.equal(SPECTRUM_STEPS.length, 7);
  assert.deepEqual(SPECTRUM_STEPS.map((s) => s.n), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(SPECTRUM_STEPS.map((s) => s.color), APPROVED_RAMP);
});

test('every spectrum color is a 6-digit hex (safe for alpha concatenation)', () => {
  for (const hex of SPECTRUM) assert.match(hex, /^#[0-9a-fA-F]{6}$/);
});

test('spectrum steps carry name + icon, and step 5 owns the frontier flag', () => {
  const names = SPECTRUM_STEPS.map((s) => s.name);
  assert.deepEqual(names, [
    'Classical AI',
    'Machine Learning',
    'Neural Networks',
    'Deep Learning',
    'Generative AI',
    'Agentic AI',
    'General Intelligence',
  ]);
  for (const s of SPECTRUM_STEPS) assert.ok(s.icon, `${s.name} needs an icon`);
  assert.equal(SPECTRUM_STEPS[4].flag, 'current frontier');
  assert.equal(SPECTRUM_STEPS.filter((s) => s.flag).length, 1);
});

test('PALETTE is the cool→warm ordering of the same ramp', () => {
  assert.deepEqual(PALETTE, [...SPECTRUM].reverse());
  assert.equal(new Set(PALETTE).size, 7);
});

test('spectrumColor clamps out-of-range and non-numeric steps', () => {
  assert.equal(spectrumColor(1), '#C96A5A');
  assert.equal(spectrumColor(7), '#A78BFA');
  assert.equal(spectrumColor(0), '#C96A5A');
  assert.equal(spectrumColor(99), '#A78BFA');
  assert.equal(spectrumColor('nope'), '#C96A5A');
});

test('withAlpha pads, rounds and clamps', () => {
  assert.equal(withAlpha('#5EC4C8', 1), '#5EC4C8ff');
  assert.equal(withAlpha('#5EC4C8', 0), '#5EC4C800');
  assert.equal(withAlpha('#5EC4C8', 0.4), '#5EC4C866');
  assert.equal(withAlpha('#5EC4C8', -5), '#5EC4C800');
  assert.equal(withAlpha('#5EC4C8', 99), '#5EC4C8ff');
});

test('spectrumVariant derives a coherent alpha family for one color', () => {
  const v = spectrumVariant('#5EC4C8');
  assert.equal(v.color, '#5EC4C8');
  for (const key of ['wash', 'tint', 'edge', 'line', 'glow', 'glowHover', 'chip', 'pill']) {
    assert.ok(v[key].startsWith('#5EC4C8'), `${key} must be built from the base color`);
    assert.equal(v[key].length, 9);
  }
  const alphaOf = (s) => parseInt(s.slice(7), 16);
  assert.ok(alphaOf(v.edge) > alphaOf(v.line), 'border reads stronger than the divider');
  assert.ok(alphaOf(v.glowHover) > alphaOf(v.glow), 'hover glow intensifies');
  assert.equal(v.onColor, SHOWCASE.onColor);
});

test('frameStyles paints the showcase ground with a spectrum-tinted chrome', () => {
  const c = '#C96A5A';
  const f = frameStyles(c);
  assert.equal(f.figure.background, SHOWCASE.bg);
  assert.equal(f.figure.border, `1px solid ${spectrumVariant(c).edge}`);
  assert.equal(f.figure.borderRadius, 14);
  assert.equal(f.figure.overflow, 'hidden');
  assert.ok(f.figure.boxShadow.includes(spectrumVariant(c).glow));
  assert.ok(f.figureHover.includes(spectrumVariant(c).glowHover));
  assert.ok(f.header.background.includes('linear-gradient'));
  assert.ok(f.header.background.includes(c));
  assert.equal(f.caption.color, SHOWCASE.sub);
  assert.equal(f.variant.color, c);
});

test('showcase ground matches the panel / chrome token it mirrors', () => {
  assert.equal(SHOWCASE.bg, '#0A1430');
  assert.equal(SHOWCASE.text, '#FFFFFF');
  assert.equal(DIAGRAM_BG.from, '#090d16');
});

test('module aliases normalize to full umbrella ids', () => {
  assert.equal(normalizeModuleId('rag'), 'rag_architecture');
  assert.equal(normalizeModuleId('context'), 'context_memory');
  assert.equal(normalizeModuleId('agents'), 'agents_frameworks');
  assert.equal(normalizeModuleId('platform'), 'data_platform');
  assert.equal(normalizeModuleId('frontiers'), 'frontiers_production');
  assert.equal(normalizeModuleId('foundations'), 'foundations');
  assert.equal(normalizeModuleId('unknown-thing'), 'unknown-thing');
});

test('every umbrella maps to a spectrum step and returns a spectrum color', () => {
  const expected = {
    rag_architecture: 1,
    agents_frameworks: 2,
    data_platform: 4,
    foundations: 5,
    frontiers_production: 6,
    context_memory: 7,
  };
  assert.deepEqual(DIAGRAM_SPECTRUM_STEP, expected);
  for (const [moduleId, step] of Object.entries(expected)) {
    assert.equal(spectrumStepForModule(moduleId), step, moduleId);
    const accent = diagramAccentForModule(moduleId);
    assert.ok(SPECTRUM.includes(accent), `${moduleId} accent must come from the ramp`);
    assert.equal(accent, APPROVED_RAMP[step - 1]);
    assert.equal(spectrumAccentForModule(moduleId), accent);
  }
});

test('short aliases resolve through the same mapping', () => {
  assert.equal(diagramAccentForModule('rag'), diagramAccentForModule('rag_architecture'));
  assert.equal(diagramAccentForModule('context'), diagramAccentForModule('context_memory'));
  assert.equal(diagramAccentForModule('frontiers'), diagramAccentForModule('frontiers_production'));
});

test('unknown or missing module falls back to the teal step', () => {
  assert.equal(spectrumStepForModule(undefined), 5);
  assert.equal(spectrumStepForModule('made-up'), 5);
  assert.equal(diagramAccentForModule('made-up'), '#5EC4C8');
});

test('legacy DIAGRAM_ACCENTS stay intact for backward compatibility', () => {
  assert.deepEqual(DIAGRAM_ACCENTS, {
    foundations: { primary: '#5EC4C8', soft: 'rgba(42,181,176,0.14)' },
    rag_architecture: { primary: '#F0A89A', soft: 'rgba(255,138,107,0.14)' },
    context_memory: { primary: '#9B89C4', soft: 'rgba(139,123,216,0.14)' },
    agents_frameworks: { primary: '#F0A89A', soft: 'rgba(255,138,107,0.14)' },
    data_platform: { primary: '#5EC4C8', soft: 'rgba(42,181,176,0.14)' },
    frontiers_production: { primary: '#9B89C4', soft: 'rgba(139,123,216,0.14)' },
  });
});

test('the ramp uses all 7 slots across umbrellas except the grid-only yellow', () => {
  const used = new Set(Object.values(DIAGRAM_SPECTRUM_STEP));
  assert.deepEqual([...used].sort((a, b) => a - b), [1, 2, 4, 5, 6, 7]);
  assert.ok(!used.has(3), 'step 3 (yellow) is reserved for cycling card palettes');
  assert.ok(PALETTE.includes(APPROVED_RAMP[2]), 'yellow still reachable via PALETTE');
});
