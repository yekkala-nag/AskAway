import { useState, useEffect, useCallback } from "react";

/**
 * ZoomableImage — interactive figure with a zoom/pan lightbox AND optional
 * clickable annotation hotspots overlaid on the image.
 *
 * Props:
 *  - src, alt, title, caption, maxWidth, background
 *  - hotspots: [{ x: number(0-100), y: number(0-100), label, title, body, color? }]
 *      x/y are percentage positions of the marker on the image.
 *  - accent: module primary color used for hotspot markers/lightbox chrome.
 */

let keyframesInjected = false;
function ensureKeyframes() {
  if (keyframesInjected || typeof document === "undefined") return;
  keyframesInjected = true;
  const style = document.createElement("style");
  style.id = "zi-keyframes";
  style.textContent = `
    @keyframes ziFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ziPop { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes ziPing {
      0% { transform: scale(1); opacity: 0.55; }
      75%, 100% { transform: scale(2.4); opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .zi-reduce * { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);
}

const ACCENTS = {
  rag: "#C47A6A",
  foundations: "#3A9B9F",
  context: "#9B89C4",
  agents: "#DC2626",
  platform: "#5EC4C8",
  frontiers: "#5EC4C8",
};

const lbBtn = (w, h = 36) => ({
  width: w,
  height: h,
  borderRadius: 6,
  background: "#222533",
  border: "1px solid #3a3e54",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function ZoomableImage({
  src,
  alt = "Interactive diagram",
  title,
  caption,
  maxWidth = 1100,
  background = "#ffffff",
  hotspots = [],
  accent = "#3A9B9F",
  reduceMotion = false,
}) {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => ensureKeyframes(), []);

  const accentColor = ACCENTS[accent] || accent;
  const open = useCallback(() => { setScale(1); setZoomed(true); }, []);
  const close = useCallback(() => setZoomed(false), []);
  const zoomIn = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.min(+(s + 0.25).toFixed(2), 4)); };
  const zoomOut = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.max(+(s - 0.25).toFixed(2), 0.5)); };
  const reset = (e) => { if (e) e.stopPropagation(); setScale(1); };

  const hasHotspots = hotspots && hotspots.length > 0;
  const selected = active != null ? hotspots[active] : null;

  return (
    <>
      <figure
        className={reduceMotion ? "zi-reduce" : undefined}
        onClick={open}
        title="Click to view fullscreen"
        style={{
          margin: 0,
          background,
          border: "1px solid #e0dcd4",
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          transition: "box-shadow 0.2s, transform 0.2s",
          position: "relative",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)"; }}
      >
        {(title || caption) && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.55rem 0.9rem", background: "#f7f5f0", borderBottom: "1px solid #e0dcd4",
            fontFamily: "Syne, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#1a1a2e",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ color: accentColor }}>🖼️</span>
              {title || "Interactive Figure"}
            </span>
            <span style={{ color: "#7A6BA8", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {hasHotspots ? "⠿ Hotspots · ⤢ Fullscreen" : "⤢ Fullscreen"}
            </span>
          </div>
        )}

        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", padding: "1.25rem", background }}>
          {src ? (
            <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width: "100%", maxWidth, height: "auto", objectFit: "contain", display: "block" }} />
          ) : (
            <div style={{ width: "100%", maxWidth, aspectRatio: "16 / 9", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0f17", color: "#94a3b8", borderRadius: 8, fontSize: "0.8rem" }}>
              (no image — use hotspots to annotate)
            </div>
          )}

          {hasHotspots && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              {hotspots.map((h, i) => {
                const isActive = active === i;
                const isHover = hovered === i;
                const color = h.color || accentColor;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "auto",
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive(isActive ? null : i); }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(i)}
                      onBlur={() => setHovered(null)}
                      aria-label={h.label || `Hotspot ${i + 1}`}
                      style={{
                        position: "relative",
                        width: 22, height: 22, borderRadius: "50%",
                        border: "2px solid #fff", background: color,
                        cursor: "pointer", padding: 0,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", color: "#fff", fontWeight: 800,
                      }}
                    >
                      {i + 1}
                      <span style={{ position: "absolute", inset: -2, borderRadius: "50%", border: `2px solid ${color}`, animation: reduceMotion ? "none" : "ziPing 1.8s cubic-bezier(0,0,0.2,1) infinite" }} />
                    </button>
                    {(isHover && !isActive) && (
                      <div style={{
                        position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                        background: "#14161f", color: "#fff", padding: "6px 9px", borderRadius: 6,
                        fontSize: "0.7rem", whiteSpace: "nowrap", fontFamily: "var(--ds-font-family-sans)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.35)", animation: reduceMotion ? "none" : "ziPop 0.18s ease",
                      }}>
                        {h.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {caption && (
          <figcaption style={{
            padding: "0.5rem 0.9rem", borderTop: "1px solid #e0dcd4", background: "#f7f5f0",
            fontSize: "0.62rem", color: "#334155", fontStyle: "italic", lineHeight: 1.5,
          }}>
            {caption}
          </figcaption>
        )}
      </figure>

      {hasHotspots && (
        <div style={{
          marginTop: "0.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "0.5rem",
        }}>
          {hotspots.map((h, i) => {
            const isActive = active === i;
            const color = h.color || accentColor;
            return (
              <button
                key={i}
                onClick={() => setActive(isActive ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textAlign: "left", cursor: "pointer", fontFamily: "var(--ds-font-family-sans)",
                  background: isActive ? `${color}12` : "var(--ds-color-bg-surface)",
                  border: `1px solid ${isActive ? color : "var(--ds-color-border-subtle)"}`,
                  borderRadius: 8, padding: "0.5rem 0.6rem",
                  display: "flex", gap: "0.5rem", alignItems: "flex-start",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                <span>
                  <span style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--ds-color-text-primary)" }}>{h.label}</span>
                  {isActive && h.body && <span style={{ display: "block", fontSize: "0.72rem", color: "var(--ds-color-text-secondary)", marginTop: 2, lineHeight: 1.4 }}>{h.body}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <div style={{
          marginTop: "0.6rem", padding: "0.9rem 1rem",
          background: "var(--ds-color-bg-surface)", border: `1px solid ${accentColor}`, borderLeft: `4px solid ${accentColor}`,
          borderRadius: 8, animation: reduceMotion ? "none" : "ziPop 0.2s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <strong style={{ color: accentColor, fontSize: "0.9rem" }}>{selected.title || selected.label}</strong>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "var(--ds-color-text-tertiary)" }} aria-label="Close annotation">×</button>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--ds-color-text-secondary)", lineHeight: 1.55 }}>{selected.body}</div>
        </div>
      )}

      {zoomed && (
        <div
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(10,12,18,0.94)", backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column", animation: reduceMotion ? "none" : "ziFadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.75rem 1.5rem", background: "#14161f", borderBottom: "1px solid #2a2d3d",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>
              {title || alt}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={zoomOut} title="Zoom Out" style={lbBtn(36)}>➖</button>
              <button onClick={reset} title="Reset" style={{ ...lbBtn(64), fontFamily: "DM Mono, monospace", fontSize: "0.8rem", color: scale !== 1 ? "#F0A89A" : "#a0a5ba" }}>{Math.round(scale * 100)}%</button>
              <button onClick={zoomIn} title="Zoom In" style={lbBtn(36)}>➕</button>
              <div style={{ width: 1, height: 24, background: "#3a3e54", margin: "0 6px" }} />
              <button onClick={close} title="Close" style={{ ...lbBtn(80), background: "#F0A89A", border: "none", color: "#fff", fontWeight: 800 }}>✕ Close</button>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, overflow: "auto", background: "#0d0f17", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", position: "relative" }}
          >
            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zoom: scale, width: "100%", maxWidth: 1600, display: "flex", justifyContent: "center", position: "relative" }}>
              {src ? <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width: "100%", maxWidth: "100%", height: "auto", objectFit: "contain", display: "block" }} /> : null}
              {hasHotspots && src && hotspots.map((h, i) => (
                <span key={i} title={h.label} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", border: "2px solid #fff", background: h.color || accentColor, color: "#fff", fontSize: "10px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
