/**
 * SPECTRUM — single source of truth for the 7-step warm→cool ramp
 * and the showcase frame chrome derived from it.
 *
 * Scope: chrome/frame only. Asset files (/public/assets/*) and inline
 * SVG internals are NOT recolored by this module.
 *
 * Color progression (bottom → top, warm → cool):
 *   1 Classical AI → 7 General Intelligence
 */

export const SPECTRUM_STEPS = [
  { n: 1, key: 'classical', name: 'Classical AI', color: '#C96A5A', icon: 'branch' },
  { n: 2, key: 'ml', name: 'Machine Learning', color: '#E08A4C', icon: 'chart' },
  { n: 3, key: 'nn', name: 'Neural Networks', color: '#E8C558', icon: 'nodes' },
  { n: 4, key: 'dl', name: 'Deep Learning', color: '#7FB069', icon: 'layers' },
  { n: 5, key: 'genai', name: 'Generative AI', color: '#5EC4C8', icon: 'zap', flag: 'current frontier' },
  { n: 6, key: 'agentic', name: 'Agentic AI', color: '#6A9BD8', icon: 'cpu' },
  { n: 7, key: 'agi', name: 'General Intelligence', color: '#A78BFA', icon: 'star' },
];

/** Flat ramp: ['#C96A5A', '#E08A4C', ..., '#A78BFA'] */
export const SPECTRUM = SPECTRUM_STEPS.map((s) => s.color);

/** Cool→warm ordering of the same ramp — used for cycling card/grid palettes. */
export const PALETTE = [...SPECTRUM].reverse();

export const spectrumColor = (step) =>
  SPECTRUM[(Math.min(Math.max(Number(step) || 1, 1), 7) - 1)];

/** Showcase ground — matches Panel / LayersShowcasePanel / chrome.showcaseBg. */
export const SHOWCASE = {
  bg: '#0A1430',
  edge: 'rgba(94, 196, 200, 0.25)',
  shadow: '0 20px 50px rgba(10, 20, 48, 0.35)',
  text: '#FFFFFF',
  sub: '#CBD5E1',
  muted: '#94A3B8',
  surface: 'rgba(255,255,255,0.04)',
  surfaceStrong: 'rgba(255,255,255,0.08)',
  onColor: '#0A1430',
};

/** '#RRGGBB' + 0..1 → '#RRGGBBAA' */
export function withAlpha(hex, alpha) {
  const a = Math.round(Math.min(Math.max(alpha, 0), 1) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

/** Derived alpha tokens for one spectrum color. */
export function spectrumVariant(color) {
  return {
    color,
    wash: withAlpha(color, 0.33),
    tint: withAlpha(color, 0.13),
    edge: withAlpha(color, 0.4),
    line: withAlpha(color, 0.27),
    glow: withAlpha(color, 0.2),
    glowHover: withAlpha(color, 0.36),
    chip: withAlpha(color, 0.53),
    pill: withAlpha(color, 0.9),
    onColor: SHOWCASE.onColor,
  };
}

/** Frame chrome style objects for one spectrum color. */
export function frameStyles(color) {
  const v = spectrumVariant(color);
  return {
    figure: {
      background: SHOWCASE.bg,
      border: `1px solid ${v.edge}`,
      borderRadius: 14,
      boxShadow: `0 0 24px ${v.glow}, ${SHOWCASE.shadow}`,
      overflow: 'hidden',
    },
    figureHover: `0 0 36px ${v.glowHover}, 0 20px 50px rgba(10, 20, 48, 0.45)`,
    figureRest: `0 0 24px ${v.glow}, ${SHOWCASE.shadow}`,
    header: {
      background: `linear-gradient(90deg, ${v.edge} 0%, ${v.tint} 55%, transparent 100%)`,
      borderBottom: `1px solid ${v.line}`,
    },
    caption: {
      background: 'rgba(255,255,255,0.03)',
      borderTop: `1px solid ${v.line}`,
      color: SHOWCASE.sub,
    },
    body: {
      background: SHOWCASE.bg,
    },
    variant: v,
  };
}
