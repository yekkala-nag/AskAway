/**
 * Legacy Styles — Shared styles object for legacy App.jsx tab components
 */

export const s = {
  main: { padding: "clamp(12px, 3vw, 2rem) clamp(12px, 3vw, 2.5rem)", maxWidth: 1380, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  section: { marginBottom: "2rem" },
  sectionLabel: (color = "#F0A89A") => ({ fontFamily: "Syne, sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color, borderLeft: `3px solid ${color}`, paddingLeft: "0.7rem", marginBottom: "1rem" }),
  card: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "clamp(12px, 2.5vw, 1.5rem)", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", boxSizing: "border-box", maxWidth: "100%" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "1.2rem" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "1.2rem" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1.2rem" },
};