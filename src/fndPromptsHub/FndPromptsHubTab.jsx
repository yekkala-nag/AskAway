import React, { useState } from "react";
import {
  FND_PROMPTS_KPI,
  CORE_PROMPT_PATTERNS,
  DYNAMIC_PROMPT_CODE,
  PROMPT_FOOTNOTES
} from "./fndPromptsEngine.js";

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

// ── SUBCOMPONENT: CodeBlock ──
function CodeBlock({ code, title = "Python Prompt Engine" }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: COLORS.codeBg, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "#1E293B", borderBottom: "1px solid #334155" }}>
        <span style={{ color: "#5EC4C8", fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700 }}>{title}</span>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "rgba(16, 185, 129, 0.2)" : "#334155",
            border: `1px solid ${copied ? "#10B981" : "#475569"}`,
            color: copied ? "#34D399" : "#F1F5F9",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 10,
            cursor: "pointer",
            fontFamily: "JetBrains Mono, monospace"
          }}
        >
          {copied ? "✓ Copied" : "Copy Code"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: 16, color: COLORS.codeText, fontFamily: "JetBrains Mono, monospace", fontSize: 11, lineHeight: 1.6, overflowX: "auto" }}>
        {code}
      </pre>
    </div>
  );
}

// ── MAIN TAB COMPONENT ──
export default function FndPromptsHubTab({ onSelectTab }) {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [openCardId, setOpenCardId] = useState("card_a_system_prompt");

  // Interactive Assembler State
  const [selectedDomain, setSelectedDomain] = useState("fintech");
  const [useCoT, setUseCoT] = useState(true);
  const [useSandwich, setUseSandwich] = useState(true);

  const SUB_TABS = [
    { id: "overview", label: "Hub Overview" },
    { id: "patterns", label: "Core Patterns (4 Cards)" },
    { id: "template_assembler", label: "Dynamic Prompt Assembly Example" },
    { id: "footnotes", label: "Footnotes & Defenses" },
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
              Foundations & Prompt Engineering · Module Hub
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
              Foundation Prompts Hub
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
              Advanced prompt engineering patterns, system templates, and optimization strategies for LLMs.
            </p>
          </div>
          <div style={{ fontSize: "3.5rem", lineHeight: 1, opacity: 0.25, userSelect: "none" }}>
            🖋️
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
          {FND_PROMPTS_KPI.map((m, i) => (
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
              PROMPT LIFECYCLE & ARCHITECTURAL DISCIPLINE
            </div>
            <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.7, margin: "0 0 16px 0" }}>
              Prompting in production systems is software engineering rather than unstructured natural language.
              High-throughput architectures treat prompts as deterministic interface contracts with typed schema validation,
              few-shot caching, and defensive delimiter isolation.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
              {CORE_PROMPT_PATTERNS.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setOpenCardId(c.id);
                    setActiveSubTab("patterns");
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
                    Inspect Pattern Details →
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard style={{ borderLeft: `4px solid ${COLORS.teal}` }}>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              PRODUCTION DESIGN PRINCIPLE: ANCHOR ONCE, CACHE FOREVER
            </div>
            <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7 }}>
              Prefix caching in modern inference engines (vLLM, TensorRT-LLM) caches the exact KV states of the system prompt and common few-shot examples.
              Ensuring byte-level consistency across system prefixes guarantees a 100% prefix cache hit rate, cutting Time-to-First-Token (TTFT) by up to 80% while saving compute.
            </div>
          </SectionCard>
        </div>
      )}

      {/* ── 2. CORE PATTERNS GRID (CARDS A - D) ── */}
      {activeSubTab === "patterns" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CORE_PROMPT_PATTERNS.map((card) => {
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
                          STRUCTURAL FORMULATION
                        </div>
                        <div style={{ color: COLORS.textHeading, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>
                          {card.math}
                        </div>
                      </div>
                      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                          TOKEN FOOTPRINT BUDGET
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
                        FAILURE MODE & DRIFT:{" "}
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

      {/* ── 3. INTERACTIVE CODE/TEMPLATE SECTION: DYNAMIC PROMPT ASSEMBLY EXAMPLE ── */}
      {activeSubTab === "template_assembler" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SectionCard>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              DYNAMIC PROMPT ASSEMBLY EXAMPLE
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Inspect a production Python prompt assembly engine. Toggle architectural defenses and persona parameters to observe runtime structural contracts.
            </p>

            {/* Interactive Configuration Controls */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.textHeading, display: "block", marginBottom: 4 }}>
                  Domain Template:
                </label>
                <div style={{ display: "flex", gap: 6 }}>
                  {["fintech", "legal", "healthcare"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDomain(d)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: `1px solid ${selectedDomain === d ? COLORS.teal : COLORS.border}`,
                        background: selectedDomain === d ? "rgba(13, 148, 136, 0.1)" : COLORS.surface2,
                        color: selectedDomain === d ? COLORS.teal : COLORS.muted,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "capitalize",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.textHeading, display: "block", marginBottom: 4 }}>
                  Reasoning Strategy:
                </label>
                <button
                  onClick={() => setUseCoT(!useCoT)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${useCoT ? COLORS.violet : COLORS.border}`,
                    background: useCoT ? "rgba(124, 58, 237, 0.1)" : COLORS.surface2,
                    color: useCoT ? COLORS.violet : COLORS.muted,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {useCoT ? "✓ Chain-of-Thought Active" : "Direct Output Mode"}
                </button>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.textHeading, display: "block", marginBottom: 4 }}>
                  Defense Guardrail:
                </label>
                <button
                  onClick={() => setUseSandwich(!useSandwich)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${useSandwich ? COLORS.emerald : COLORS.border}`,
                    background: useSandwich ? "rgba(5, 150, 105, 0.1)" : COLORS.surface2,
                    color: useSandwich ? COLORS.emerald : COLORS.muted,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {useSandwich ? "✓ Delimiter Sandwich Active" : "No Delimiter Isolation"}
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <CodeBlock code={DYNAMIC_PROMPT_CODE} title="prompt_assembly_engine.py" />
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
            {PROMPT_FOOTNOTES.map((fn, i) => (
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
