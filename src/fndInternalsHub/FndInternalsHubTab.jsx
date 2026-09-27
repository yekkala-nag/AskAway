import React, { useState } from "react";
import {
  FND_INTERNALS_KPI,
  CORE_MECHANICS,
  FORWARD_PASS_EXECUTION_FLOW,
  ARCHITECTURAL_FOOTNOTES
} from "./fndInternalsEngine.js";

// Exact Application Light Theme Design Tokens
const COLORS = {
  bg: "#F7F8FA",
  surface: "#FFFFFF",
  surface2: "#F8FAFC",
  surface3: "#EDF2F7",
  border: "#E2E8F0",
  borderSubtle: "#EEF2F6",
  text: "#1E293B",
  textHeading: "#0F172A",
  muted: "#64748B",
  teal: "#0D9488",
  amber: "#D97706",
  sky: "#0284C7",
  emerald: "#059669",
  rose: "#E11D48",
  violet: "#7C3AED",
  codeBg: "#0F172A",
  codeText: "#E2E8F0",
};

// ── SUBCOMPONENT: SectionCard ──
function SectionCard({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── MAIN TAB COMPONENT ──
export default function FndInternalsHubTab({ onSelectTab }) {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [openCardId, setOpenCardId] = useState("card_a_tokens");
  const [activeStep, setActiveStep] = useState(0);

  const SUB_TABS = [
    { id: "overview", label: "Hub Overview" },
    { id: "mechanics", label: "Core Mechanics (4 Pillars)" },
    { id: "execution_flow", label: "Forward Pass Execution Flow" },
    { id: "footnotes", label: "Architectural Footnotes" },
  ];

  return (
    <div
      style={{
        background: COLORS.bg,
        minHeight: "100%",
        fontFamily: "'Inter', -apple-system, sans-serif",
        color: COLORS.text,
        borderRadius: "14px",
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {/* ── 1. HERO SECTION ── */}
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "26px 28px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Multi-color gradient accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${COLORS.teal}, ${COLORS.sky}, ${COLORS.violet}, ${COLORS.amber})`,
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div
              style={{
                color: COLORS.teal,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Foundations & Architecture · Module Hub
            </div>
            <h1
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.85rem",
                fontWeight: 800,
                color: COLORS.textHeading,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Foundation Model Internals Hub
            </h1>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "0.92rem",
                lineHeight: 1.7,
                maxWidth: 740,
                margin: 0,
              }}
            >
              Deep dive into the architectural mechanics of modern LLMs, from tokenization to generation.
            </p>
          </div>
          <div
            style={{
              fontSize: "3.5rem",
              lineHeight: 1,
              opacity: 0.25,
              userSelect: "none",
            }}
          >
            🏛️
          </div>
        </div>

        {/* 4 KPI METRIC COUNTERS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
            marginTop: 22,
          }}
        >
          {FND_INTERNALS_KPI.map((m, i) => (
            <div
              key={i}
              style={{
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <div style={{ color: m.color, fontFamily: "JetBrains Mono, monospace", fontSize: "1.3rem", fontWeight: 800, lineHeight: 1 }}>
                {m.val}
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.textHeading, marginTop: 4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: "0.68rem", color: COLORS.muted, marginTop: 2 }}>
                {m.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUBTAB NAVIGATION BAR ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 4,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        {SUB_TABS.map((t) => {
          const isActive = activeSubTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${isActive ? COLORS.teal : "transparent"}`,
                background: isActive ? "rgba(13, 148, 136, 0.1)" : "transparent",
                color: isActive ? COLORS.teal : COLORS.muted,
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── SUBTAB 1: HUB OVERVIEW ── */}
      {activeSubTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <SectionCard>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              ARCHITECTURAL PIPELINE OVERVIEW
            </div>
            <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.7, margin: "0 0 16px 0" }}>
              Every modern generative foundation model executes a sequential mathematical pipeline transforming discrete vocabulary tokens into contextual latent vectors.
              The four foundational components work in concert across alternating attention and transformation layers.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
              {CORE_MECHANICS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setOpenCardId(c.id);
                    setActiveSubTab("mechanics");
                  }}
                  style={{
                    background: COLORS.surface2,
                    border: `1px solid ${COLORS.border}`,
                    borderTop: `3px solid ${c.color}`,
                    borderRadius: 8,
                    padding: 14,
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: "1.2rem" }}>{c.icon}</span>
                    <span style={{ color: c.color, fontWeight: 700, fontSize: 12 }}>{c.title}</span>
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>
                    {c.subtitle}
                  </div>
                  <div style={{ color: c.color, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    Inspect Mechanics →
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard style={{ borderLeft: `4px solid ${COLORS.amber}` }}>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              EXECUTION DUALITY: PREFILL VS DECODE
            </div>
            <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7 }}>
              <strong>Prefill Phase (Prompt Processing):</strong> All prompt tokens are processed simultaneously in parallel. Dense General Matrix Multiplications (GEMM) saturate GPU Tensor Core compute capacity, making prefill strictly <em>compute-bound</em>.
              <br />
              <strong>Decode Phase (Token Generation):</strong> Tokens are generated autoregressively one by one. The model must stream past Key and Value matrices across the memory bus for every single step, making decode strictly <em>memory bandwidth-bound</em>.
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 2. CORE MECHANICS GRID (REPLICATING CARDS A - D) ── */}
      {activeSubTab === "mechanics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CORE_MECHANICS.map((card) => {
            const isOpen = openCardId === card.id;
            return (
              <div
                key={card.id}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${isOpen ? card.color : COLORS.border}`,
                  borderLeft: `4px solid ${card.color}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  onClick={() => setOpenCardId(isOpen ? null : card.id)}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isOpen ? COLORS.surface2 : COLORS.surface,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "1.4rem" }}>{card.icon}</span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: card.color, fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 700 }}>
                          {card.title}
                        </span>
                        <span style={{ background: COLORS.surface3, color: COLORS.muted, fontSize: 9, padding: "2px 6px", borderRadius: 4, fontFamily: "JetBrains Mono, monospace" }}>
                          {card.code}
                        </span>
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{card.subtitle}</div>
                    </div>
                  </div>
                  <span style={{ color: COLORS.muted, fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>
                    {isOpen ? "▲ Collapse" : "▼ Expand"}
                  </span>
                </div>

                {isOpen && (
                  <div style={{ padding: "16px 20px 20px 20px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
                    <p style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7, margin: "0 0 14px 0" }}>
                      {card.summary}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ color: card.color, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                          MATHEMATICAL FORMULATION
                        </div>
                        <div style={{ color: COLORS.textHeading, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>
                          {card.math}
                        </div>
                      </div>
                      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                          TENSOR DIMENSIONS
                        </div>
                        <div style={{ color: COLORS.textHeading, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>
                          {card.tensorShape}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
                        Key Architectural Mechanics:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, fontSize: 11, lineHeight: 1.6 }}>
                        {card.keyPoints.map((kp, idx) => (
                          <li key={idx} style={{ marginBottom: 3 }}>{kp}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: "rgba(225, 29, 72, 0.05)", border: `1px solid rgba(225, 29, 72, 0.25)`, borderRadius: 6, padding: "10px 12px" }}>
                      <span style={{ color: COLORS.rose, fontWeight: 700, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>
                        FAILURE MODE & BOUNDS:{" "}
                      </span>
                      <span style={{ color: COLORS.text, fontSize: 11 }}>{card.failureMode}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── 3. INTERACTIVE VISUALIZATION SECTION: FORWARD PASS EXECUTION FLOW ── */}
      {activeSubTab === "execution_flow" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionCard>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              FORWARD PASS EXECUTION FLOW
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Explore the 7 sequential stages of forward pass execution. Click any step to inspect the tensor lifecycle and transformation state.
            </p>

            {/* Stepper buttons */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
              {FORWARD_PASS_EXECUTION_FLOW.map((s, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      flex: 1,
                      minWidth: 125,
                      padding: "8px 10px",
                      background: isSelected ? `${s.color}15` : COLORS.surface2,
                      border: `1px solid ${isSelected ? s.color : COLORS.border}`,
                      borderRadius: 6,
                      color: isSelected ? s.color : COLORS.muted,
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Step {s.step}
                  </button>
                );
              })}
            </div>

            {/* Active Stage Details */}
            {(() => {
              const cur = FORWARD_PASS_EXECUTION_FLOW[activeStep];
              return (
                <div style={{ background: COLORS.surface2, border: `1px solid ${cur.color}55`, borderRadius: 8, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: cur.color, fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800 }}>
                      {cur.title}
                    </div>
                    <span style={{ background: `${cur.color}18`, color: cur.color, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                      {cur.stage}
                    </span>
                  </div>

                  <p style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>
                    {cur.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: COLORS.surface, borderRadius: 6, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>INPUT STATE / TENSOR</div>
                      <div style={{ color: COLORS.textHeading, fontSize: 11, fontFamily: "JetBrains Mono, monospace", marginTop: 2, fontWeight: 600 }}>
                        {cur.input}
                      </div>
                    </div>
                    <div style={{ background: COLORS.surface, borderRadius: 6, padding: "10px 12px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>OUTPUT STATE / TENSOR</div>
                      <div style={{ color: cur.color, fontSize: 11, fontFamily: "JetBrains Mono, monospace", marginTop: 2, fontWeight: 600 }}>
                        {cur.output}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </SectionCard>
        </div>
      )}

      {/* ── 4. FOOTNOTES & REFERENCES SECTION ── */}
      {(activeSubTab === "footnotes" || activeSubTab === "overview") && (
        <SectionCard style={{ border: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
            ARCHITECTURAL PRINCIPLES & FOOTNOTES
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 }}>
            {ARCHITECTURAL_FOOTNOTES.map((fn, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${COLORS.emerald}`, paddingLeft: 10 }}>
                <div style={{ color: COLORS.emerald, fontWeight: 700, fontSize: 11, marginBottom: 2 }}>
                  {fn.principle}
                </div>
                <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace", marginBottom: 4 }}>
                  {fn.category}
                </div>
                <div style={{ color: COLORS.text, fontSize: 11, lineHeight: 1.5 }}>
                  {fn.detail}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
