/**
 * Progress tab — overall learning progress tracker.
 * Extracted from legacy App.jsx (bridge) into a standalone module so the
 * bridge chunk (`App-*.js`, 324 kB gzip) is not loaded for this tab.
 */

import { useState } from 'react';

const ProgressTracker = () => {
  const items = [
    { id: "rag_basics", label: "RAG Fundamentals", group: "RAG" },
    { id: "hybrid", label: "Hybrid Search + RRF", group: "RAG" },
    { id: "rerank", label: "Cross-encoder Re-ranking", group: "RAG" },
    { id: "eval_rag", label: "RAG Evaluation (RAGAS)", group: "RAG" },
    { id: "react", label: "ReAct Agent Loop", group: "Agents" },
    { id: "multiagent", label: "Multi-Agent Orchestration", group: "Agents" },
    { id: "memory", label: "Agent Memory Systems", group: "Agents" },
    { id: "guardrails", label: "Safety Guardrails", group: "Agents" },
    { id: "lc_basics", label: "LangChain + LCEL", group: "Frameworks" },
    { id: "lg_graph", label: "LangGraph State Graphs", group: "Frameworks" },
    { id: "lg_hitl", label: "Human-in-the-Loop", group: "Frameworks" },
    { id: "observability", label: "Observability + Tracing", group: "Production" },
    { id: "cost_opt", label: "Cost Optimization", group: "Production" },
    { id: "deploy", label: "Async Deployment", group: "Production" },
    { id: "capstone", label: "Capstone Project", group: "Production" },
  ];
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ai_progress") || "{}"); } catch { return {}; }
  });
  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    try { localStorage.setItem("ai_progress", JSON.stringify(next)); } catch {}
  };
  const groups = [...new Set(items.map(i => i.group))];
  const groupColors = { RAG: "#5EC4C8", Agents: "#F0A89A", Frameworks: "#C9B8E8", Production: "#F0A89A" };
  const total = items.length;
  const done = items.filter(i => checked[i.id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div>
      <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 6, padding: "1.5rem", marginBottom: "1.2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#334155" }}>Overall Progress</div>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 900, color: "#C47A6A" }}>{pct}%</div>
        </div>
        <div style={{ background: "#e8e4dc", borderRadius: 4, height: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, #5EC4C8, #F0A89A, #F0A89A)`, borderRadius: 4, transition: "width 0.5s ease" }} />
        </div>
        <div style={{ marginTop: "0.5rem", fontSize: "0.62rem", color: "#334155", textAlign: "right" }}>{done} / {total} concepts</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
        {groups.map(g => {
          const gItems = items.filter(i => i.group === g);
          const gDone = gItems.filter(i => checked[i.id]).length;
          return (
            <div key={g} style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "0.8rem 1rem", borderBottom: "1px solid #e0dcd4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.65rem", color: groupColors[g], letterSpacing: "0.1em" }}>{g}</span>
                <span style={{ fontSize: "0.6rem", color: "#334155" }}>{gDone}/{gItems.length}</span>
              </div>
              {gItems.map(item => (
                <div key={item.id} onClick={() => toggle(item.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.6rem 1rem", cursor: "pointer", borderBottom: "1px solid rgba(42,42,56,0.4)", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f0ede6"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${checked[item.id] ? groupColors[g] : "#3a3a48"}`, background: checked[item.id] ? groupColors[g] + "20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                    {checked[item.id] && <span style={{ color: groupColors[g], fontSize: "0.6rem", lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: checked[item.id] ? "#334155" : "#1E293B", textDecoration: checked[item.id] ? "line-through" : "none", transition: "all 0.2s" }}>{item.label}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function ProgressTab({ s }) {
  return <ProgressTracker />;
}
