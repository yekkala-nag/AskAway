import { useState } from "react";
import { diagramAccentForModule } from "../../design-system/diagramTokens.js";

// Renders a self-contained SVG diagram (in /assets/*.svg) inside a clean,
// themeable figure card with an optional caption. Click opens it in the
// fullscreen ZoomableFigure-style lightbox (reusing the same zoom/pan pattern).
//
// P2: loading shimmer (no layout shift), fade-in on load, error fallback
// with retry, and an `accent` prop (umbrella color) tinting the figure
// chrome. `moduleId` is shorthand for the canonical accent.
const DiagramImage = ({
  src,
  alt = "Diagram",
  caption,
  title,
  maxWidth = 1100,
  background = "#ffffff",
  accent,
  moduleId,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const tint = accent || (moduleId ? diagramAccentForModule(moduleId) : "#5EC4C8");

  const open = () => { if (!failed) { setScale(1); setZoomed(true); } };
  const close = () => setZoomed(false);
  const zoomIn = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.min(+(s + 0.25).toFixed(2), 3)); };
  const zoomOut = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.max(+(s - 0.25).toFixed(2), 0.5)); };
  const reset = (e) => { if (e) e.stopPropagation(); setScale(1); };
  const retry = (e) => {
    if (e) e.stopPropagation();
    setFailed(false);
    setLoaded(false);
    setRetryCount(c => c + 1);
    setRetryKey(k => k + 1);
  };

  return (
    <>
      <figure
        onClick={open}
        title={failed ? alt : "Click to view fullscreen"}
        style={{
          margin: 0,
          background,
          border: "1px solid #E8E8EC",
          borderRadius: 8,
          overflow: "hidden",
          cursor: failed ? "default" : "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)"; }}
      >
        {(title || caption) && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.55rem 0.9rem", background: "#F5F5F7", borderBottom: "1px solid #E8E8EC",
            fontFamily: "Syne, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#2D2D3A",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ color: tint }}>🖼️</span>
              {title || "Figure"}
            </span>
            {!failed && <span style={{ color: tint, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>⤢ Fullscreen</span>}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.25rem", position: "relative", minHeight: 200 }}>
          {!loaded && !failed && (
            <div aria-hidden="true" style={{ position: "absolute", inset: "1.25rem", borderRadius: 6, overflow: "hidden", background: "rgba(0,0,0,0.06)" }}>
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(100deg, transparent 30%, ${tint}22 50%, transparent 70%)`,
                animation: "diagramShimmer 1.4s infinite",
              }} />
              <style>{`@keyframes diagramShimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } } @media (prefers-reduced-motion: reduce) { @keyframes diagramShimmer { from { transform: none; } to { transform: none; } } }`}</style>
            </div>
          )}
          {failed ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#4A4A5A" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "6px" }}>⚠️</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", marginBottom: "4px" }}>
                {retryCount > 0 ? "Asset malformed. Retry failed." : "Diagram failed to load"}
              </div>
              <div style={{ fontSize: "0.72rem", opacity: 0.8, marginBottom: "12px", maxWidth: 400, margin: "0 auto 12px" }}>
                {retryCount > 0
                  ? `Unable to parse image data from source (${src.split('/').pop()}). Retry attempt ${retryCount} did not resolve.`
                  : (title || alt || "Diagram asset could not be loaded")}
              </div>
              <button
                type="button"
                onClick={retry}
                style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid #E8E8EC", background: "#F5F5F7", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#1E293B" }}
              >
                Retry
              </button>
            </div>
          ) : (
            <img
              key={retryKey}
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              style={{
                width: "100%", maxWidth, height: "auto", display: "block",
                objectFit: "contain",
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            />
          )}
        </div>
        {caption && (
          <figcaption style={{
            padding: "0.5rem 0.9rem", borderTop: "1px solid #E8E8EC", background: "#F5F5F7",
            fontSize: "0.62rem", color: "#4A4A5A", fontStyle: "italic", lineHeight: 1.5,
          }}>
            {caption}
          </figcaption>
        )}
      </figure>

      {zoomed && (
        <div
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(10,12,18,0.94)", backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.75rem 1.5rem", background: "#0F1219", borderBottom: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#F5F5F7", letterSpacing: "0.03em" }}>
              {title || alt}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={zoomOut} title="Zoom Out" style={lb(36)}>➖</button>
              <button onClick={reset} title="Reset" style={{ ...lb(64), fontFamily: "DM Mono, monospace", fontSize: "0.8rem", color: scale !== 1 ? "#C47A6A" : "#B8B8C4" }}>{Math.round(scale * 100)}%</button>
              <button onClick={zoomIn} title="Zoom In" style={lb(36)}>➕</button>
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.15)", margin: "0 6px" }} />
              <button onClick={close} title="Close" style={{ ...lb(80), background: "#C47A6A", border: "none", color: "#FFFFFF", fontWeight: 800 }}>✕ Close</button>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, overflow: "auto", background: "#0F1219", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "1.5rem", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zoom: scale, width: "100%", maxWidth: 1600, display: "flex", justifyContent: "center" }}>
              <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width: "100%", maxWidth: "100%", height: "auto", objectFit: "contain", display: "block" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const lb = (w) => ({
  width: w, height: 36, borderRadius: 6, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
  color: "#F5F5F7", cursor: "pointer", fontWeight: 800, fontSize: "1rem", display: "flex",
  alignItems: "center", justifyContent: "center",
});

export default DiagramImage;
