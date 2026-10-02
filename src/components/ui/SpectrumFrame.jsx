import { SHOWCASE, spectrumVariant, frameStyles } from '../../design-system/spectrum.js';
import { spectrumStepForModule } from '../../design-system/diagramTokens.js';

/**
 * Shared showcase chrome for every figure wrapper in the app
 * (DiagramImage, ZoomableImage, Content.Diagram).
 *
 * Look: navy ground, color-tinted gradient header, soft glowing border,
 * rounded-square chip with a unique white line-art icon, pill badge.
 * Pattern source of truth: the 7-Layers showcase (GlassBar / LayersShowcasePanel).
 */

const GLYPHS = {
  branch: (<><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></>),
  chart: (<><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>),
  nodes: (<><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>),
  layers: (<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>),
  zap: (<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>),
  cpu: (<><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" /></>),
  star: (<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>),
  image: (<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><polyline points="21 16 16 11 7 20" /></>),
};

export function Glyph({ name, size = 16, color = '#FFFFFF' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, display: 'block' }}
    >
      {GLYPHS[name] || GLYPHS.image}
    </svg>
  );
}

/** Spectrum-step icon for an umbrella (falls back to a generic figure glyph). */
export function iconForModule(moduleId) {
  if (!moduleId) return 'image';
  const step = spectrumStepForModule(moduleId);
  const icons = ['branch', 'chart', 'nodes', 'layers', 'zap', 'cpu', 'star'];
  return icons[step - 1] || 'image';
}

/** Rounded-square icon box — colored border, unique white line-art icon. */
export function FrameChip({ color = '#5EC4C8', icon = 'image', size = 30 }) {
  const v = spectrumVariant(color);
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.3),
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: SHOWCASE.surfaceStrong,
        border: `1px solid ${v.chip}`,
        boxShadow: `0 0 10px ${v.glow}`,
      }}
    >
      <Glyph name={icon} size={Math.round(size * 0.55)} color="#FFFFFF" />
    </span>
  );
}

/** Uppercase pill badge (e.g. "current frontier" / "fullscreen"). */
export function FramePill({ color = '#5EC4C8', children }) {
  const v = spectrumVariant(color);
  return (
    <span
      style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        color: v.onColor,
        background: v.pill,
        borderRadius: 20,
        padding: '3px 9px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}

/** Header row shared by all figure frames. */
export function FrameHeader({ color, icon, title, hint, right }) {
  const f = frameStyles(color);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0.55rem 0.9rem',
        ...f.header,
      }}
    >
      <FrameChip color={color} icon={icon} size={28} />
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'Syne, sans-serif',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: SHOWCASE.text,
          letterSpacing: '0.01em',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </span>
      {right}
      {!right && hint ? (
        <span
          style={{
            color: color,
            fontSize: '0.58rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/** Caption row shared by all figure frames. */
export function FrameCaption({ color, children }) {
  const f = frameStyles(color);
  return (
    <figcaption
      style={{
        padding: '0.5rem 0.9rem',
        fontSize: '0.64rem',
        fontStyle: 'italic',
        lineHeight: 1.55,
        ...f.caption,
      }}
    >
      {children}
    </figcaption>
  );
}

export { SHOWCASE, spectrumVariant, frameStyles };
