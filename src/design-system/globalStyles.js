/**
 * Global styles — CSS reset + design token injection
 * EdTech Redesign — Clean, minimal, card-based
 */

import { generateCSSVariables } from './tokens.js';

export const globalStyles = `
${generateCSSVariables({
  color: {
    bg: {
      canvas: '#F7F8FA',
      surface: '#FFFFFF',
      surfaceHover: '#F1F3F5',
      elevated: '#FFFFFF',
    },
    border: {
      subtle: '#E5E7EB',
      default: '#D1D5DB',
      strong: '#9CA3AF',
      focus: '#3A9B9F',
    },
    text: {
      primary: '#1A1D26',
      secondary: '#4B5563',
      tertiary: '#9CA3AF',
      inverse: '#FFFFFF',
      link: '#3A9B9F',
      linkHover: '#2E7D80',
    },
    module: {
      foundations: { primary: '#3A9B9F', light: 'rgba(58,155,159,0.10)', dark: '#1A6B6E' },
      rag: { primary: '#E8836A', light: 'rgba(232,131,106,0.10)', dark: '#B85A42' },
      context: { primary: '#9B89C4', light: 'rgba(155,137,196,0.10)', dark: '#6B5E94' },
      agents: { primary: '#E8836A', light: 'rgba(232,131,106,0.10)', dark: '#B85A42' },
      platform: { primary: '#3A9B9F', light: 'rgba(58,155,159,0.10)', dark: '#1A6B6E' },
      frontiers: { primary: '#9B89C4', light: 'rgba(155,137,196,0.10)', dark: '#6B5E94' },
    },
    brand: {
      teal: '#3A9B9F',
      tealDark: '#2E7D80',
      tealInk: '#1A6B6E',
      tealSoft: 'rgba(58,155,159,0.08)',
      coral: '#E8836A',
      coralDeep: '#B85A42',
      coralSoft: 'rgba(232,131,106,0.10)',
      lav: '#C9B8E8',
      lavDeep: '#9B89C4',
      lavInk: '#6B5E94',
      lavSoft: 'rgba(155,137,196,0.10)',
      ink: '#1A1D26',
      muted: '#9CA3AF',
      line: '#E5E7EB',
      editor: '#0F1219',
    },
    chrome: {
      headerBg: '#FFFFFF',
      headerBorder: '#E7EDF3',
      headerShadow: '0 10px 30px rgba(22, 40, 63, 0.08)',
      sidebarBg: '#EDF1F6',
      sidebarCard: '#FFFFFF',
      ctaFrom: '#14B8A6',
      ctaTo: '#0E9F8A',
      ctaShadow: '0 8px 20px rgba(20, 184, 166, 0.35)',
      showcaseBg: '#0A1430',
      showcaseEdge: 'rgba(94, 196, 200, 0.25)',
      proBadge: '#E5484D',
      searchPill: '#F1F4F8',
      searchKbd: '#E2E8F0',
    },
    state: {
      success: { light: '#059669', dark: '#10B981' },
      warning: { light: '#D97706', dark: '#F59E0B' },
      error: { light: '#DC2626', dark: '#EF4444' },
      info: { light: '#2563EB', dark: '#3B82F6' },
    },
    overlay: {
      backdrop: 'rgba(0, 0, 0, 0.3)',
      modal: 'rgba(0, 0, 0, 0.5)',
    },
  },
  font: {
    family: {
      sans: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Text", "Segoe UI", system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      display: '-apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", system-ui, sans-serif',
    },
    size: {
      display: '36px',
      h1: '28px',
      h2: '22px',
      h3: '18px',
      h4: '15px',
      bodyLg: '16px',
      body: '14px',
      bodySm: '13px',
      caption: '11px',
      code: '13px',
      codeSm: '12px',
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.15,
      snug: 1.3,
      normal: 1.5,
      relaxed: 1.65,
      loose: 1.75,
    },
    letterSpacing: {
      tight: '-0.02em',
      snug: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.04)',
    sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
    lg: '0 10px 15px rgba(0,0,0,0.06), 0 4px 6px rgba(0,0,0,0.04)',
    xl: '0 20px 25px rgba(0,0,0,0.08), 0 8px 10px rgba(0,0,0,0.04)',
  },
  motion: {
    duration: {
      instant: '0ms',
      fast: '120ms',
      base: '200ms',
      slow: '320ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  zIndex: {
    base: 0,
    dropdown: 30,
    sticky: 40,
    sidebar: 50,
    modal: 60,
    popover: 70,
    toast: 80,
    tooltip: 90,
  },
})}

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-body);
  line-height: var(--ds-font-lineHeight-relaxed);
  color: var(--ds-color-text-primary);
  background: var(--ds-color-bg-canvas);
  min-height: 100vh;
  min-height: 100dvh;
}

/* Typography — Clean hierarchy */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--ds-font-family-display);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-font-lineHeight-tight);
  color: var(--ds-color-text-primary);
  letter-spacing: -0.01em;
}

h1 { font-size: var(--ds-font-size-h1); }
h2 { font-size: var(--ds-font-size-h2); font-weight: var(--ds-font-weight-semibold); }
h3 { font-size: var(--ds-font-size-h3); font-weight: var(--ds-font-weight-semibold); }
h4 { font-size: var(--ds-font-size-h4); font-weight: var(--ds-font-weight-medium); }

p { margin-bottom: var(--ds-space-4); line-height: var(--ds-font-lineHeight-relaxed); }

a {
  color: var(--ds-color-text-link);
  text-decoration: none;
  transition: color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
}
a:hover { color: var(--ds-color-text-linkHover); }
a:focus-visible { outline: 2px solid var(--ds-color-border-focus); outline-offset: 2px; border-radius: var(--ds-radius-sm); }

code, pre {
  font-family: var(--ds-font-family-mono);
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

img, video, iframe, canvas, svg {
  max-width: 100%;
  height: auto;
}

/* Selection */
::selection { background: rgba(58,155,159,0.15); color: #1A6B6E; }

/* Focus visible — high-contrast, smooth-transitioning ring for keyboard users.
   :focus-visible only matches on keyboard/AT focus, so mouse & touch users
   never see the ring (WCAG 2.4.7 / 2.4.11 Focus Appearance). */
:where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ds-color-border-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(58, 155, 159, 0.28);
  transition: outline-color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard),
              box-shadow var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
}
/* Programmatic focus targets (skip-link destinations) must not flash a ring */
#main-content:focus,
#main-content:focus-visible { outline: none; box-shadow: none; }

/* Skip link — visually hidden until focused (WCAG 2.4.1 Bypass Blocks) */
.ds-skip-link {
  position: fixed;
  top: -100px;
  left: 12px;
  z-index: 200;
  padding: 12px 20px;
  background: var(--ds-color-bg-surface);
  color: var(--ds-color-text-link);
  font-weight: var(--ds-font-weight-semibold);
  font-size: var(--ds-font-size-body);
  border: 2px solid var(--ds-color-border-focus);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-lg);
  text-decoration: none;
  transition: top var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
}
.ds-skip-link:focus {
  top: 12px;
}

/* Scroll regions: fluid anchor/in-page scrolling, contained overscroll
   (no scroll-chaining jank back to the page behind the region) */
[data-scroll] {
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
@media (prefers-reduced-motion: reduce) {
  [data-scroll] { scroll-behavior: auto; }
}

/* App shell height — dvh keeps layout steady when the iOS/Android
   virtual keyboard or URL bar changes viewport height */
.app-page {
  height: 100vh;
  height: 100dvh;
}

/* Hover styles only where a real hover-capable, fine pointer exists —
   prevents "stuck" hover states on iOS/Android touch (WCAG 1.4.13-ish hygiene) */
@media not (hover: hover) and (pointer: coarse) {
  .aw-chip:hover,
  .aw-search-pill:hover {
    transform: none;
    box-shadow: none;
  }
}
/* Class-based hover replacement for inline onMouseEnter color flips */
@media (hover: hover) and (pointer: fine) {
  .ds-hoverable:hover { color: #5EC4C8 !important; }
}

/* Keyboard focus ring for composite input wrappers (search fields).
   :has(:focus-visible) keeps the ring keyboard-only — mouse/tap focus
   on the field does not paint it. */
.ds-field-focus {
  transition: box-shadow var(--ds-motion-duration-fast) var(--ds-motion-easing-standard),
              border-color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
}
.ds-field-focus:has(:focus-visible) {
  border-color: var(--ds-color-border-focus) !important;
  box-shadow: 0 0 0 3px rgba(58, 155, 159, 0.28);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Responsive Mobile & Tablet Styles */
@media (max-width: 768px) {
  html { font-size: 14px; }
  h1 { font-size: 22px !important; }
  h2 { font-size: 18px !important; }
  h3 { font-size: 16px !important; }
  h4 { font-size: 14px !important; }
  
  button, select, input {
    touch-action: manipulation;
  }
}

/* Touch targets (coarse pointers: phones & tablets)
   - WCAG 2.2 AA Target Size (Minimum) floor: 24×24 for everything
   - Chrome/navigation surfaces: full 44×44 per the mobile brief.
     Layout only — never intercepts pointer events, so native touch
     scrolling and taps keep working exactly as before. */
@media (pointer: coarse) {
  button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"] {
    min-height: 24px;
    min-width: 24px;
    touch-action: manipulation;
  }
  header button,
  aside button,
  aside a[href],
  .bottom-nav button,
  footer button,
  footer a[href],
  .command-palette button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* Scrollbar — Clean, minimal */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
::-webkit-scrollbar-corner { background: transparent; }

/* Utility classes */
.ds-container-narrow { max-width: 640px; margin: 0 auto; }
.ds-container-normal { max-width: 960px; margin: 0 auto; }
.ds-container-wide { max-width: 1280px; margin: 0 auto; }
.ds-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Safe Area Insets for Mobile Notches and Home Indicator Bar */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
.command-palette {
  padding-bottom: env(safe-area-inset-bottom);
}
`;

// Inject styles on import
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = globalStyles;
  document.head.appendChild(styleEl);
}

export default globalStyles;