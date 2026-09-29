/**
 * Design Tokens — Single source of truth for the visual language
 * All values as CSS custom properties for runtime theming
 *
 * MASTER PALETTE (v5.0 — EdTech Redesign)
 * ─────────────────────────────────────────
 * Primary Teal:      #3A9B9F  — Headers, buttons, active nav, links
 * Secondary Coral:   #E8836A  — Primary CTA buttons, highlights
 * Tertiary Lavender: #C9B8E8  — Info tags, tertiary accents
 * Base White:        #F7F8FA  — Page bg
 * Surface White:     #FFFFFF  — Card fills, sidebar
 * Dark Text/Icon:    #1A1D26  — All body text, headings, icons
 * Muted Gray:        #9CA3AF  — Dividers, placeholders, inactive borders
 */

export const tokens = {
  // Color — Semantic, module-coded, accessible
  color: {
    // Base surfaces (light mode) — EdTech palette
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

    // Module accents — trio-mapped, all pairs contrast-verified.
    module: {
      foundations: { primary: '#3A9B9F', light: 'rgba(58,155,159,0.10)', dark: '#1A6B6E' },
      rag: { primary: '#E8836A', light: 'rgba(232,131,106,0.10)', dark: '#B85A42' },
      context: { primary: '#9B89C4', light: 'rgba(155,137,196,0.10)', dark: '#6B5E94' },
      agents: { primary: '#E8836A', light: 'rgba(232,131,106,0.10)', dark: '#B85A42' },
      platform: { primary: '#3A9B9F', light: 'rgba(58,155,159,0.10)', dark: '#1A6B6E' },
      frontiers: { primary: '#9B89C4', light: 'rgba(155,137,196,0.10)', dark: '#6B5E94' },
    },

    // Brand palette — EdTech language
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

    // AskAway chrome (v5.1) — floating header, light index sidebar, CTAs, showcase
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

    // Semantic states
    state: {
      success: { light: '#059669', dark: '#10B981' },
      warning: { light: '#D97706', dark: '#F59E0B' },
      error: { light: '#DC2626', dark: '#EF4444' },
      info: { light: '#2563EB', dark: '#3B82F6' },
    },

    // Overlay
    overlay: {
      backdrop: 'rgba(0, 0, 0, 0.3)',
      modal: 'rgba(0, 0, 0, 0.5)',
    },
  },

  // Typography — System font stack
  font: {
    family: {
      sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
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
      tight: 1.1,
      snug: 1.25,
      normal: 1.35,
      relaxed: 1.6,
      loose: 1.7,
    },
    letterSpacing: {
      tight: '-0.02em',
      snug: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
  },

  // Spacing — 4px base unit
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

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows — Layered
  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.03)',
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 12px 28px rgba(0,0,0,0.08)',
    xl: '0 20px 40px rgba(0,0,0,0.10)',
  },

  // Motion — Respectful
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

  // Breakpoints
  breakpoint: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1440px',
  },

  // Container widths
  container: {
    narrow: '640px',
    normal: '960px',
    wide: '1280px',
  },

  // Z-index scale
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
};

// CSS custom property generator
export function generateCSSVariables(tokens, prefix = 'ds') {
  const lines = [];

  function flatten(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...path, key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, newPath);
      } else {
        lines.push(`  --${prefix}-${newPath.join('-')}: ${value};`);
      }
    }
  }

  flatten(tokens);
  return `:root {\n${lines.join('\n')}\n}`;
}

// Module color getter
export function getModuleColors(moduleId) {
  const map = {
    foundations: tokens.color.module.foundations,
    rag: tokens.color.module.rag,
    rag_architecture: tokens.color.module.rag,
    context: tokens.color.module.context,
    context_memory: tokens.color.module.context,
    agents: tokens.color.module.agents,
    agents_frameworks: tokens.color.module.agents,
    platform: tokens.color.module.platform,
    data_platform: tokens.color.module.platform,
    frontiers: tokens.color.module.frontiers,
    frontiers_production: tokens.color.module.frontiers,
  };
  return map[moduleId] || tokens.color.module.foundations;
}

// Semantic color getter
export function getStateColor(state) {
  return tokens.color.state[state] || tokens.color.state.info;
}
