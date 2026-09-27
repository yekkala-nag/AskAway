import React, { useState } from "react";
import {
  MODEL_INTERNALS_KPI,
  TRANSFORMER_PILLARS,
  FORWARD_PASS_STAGES,
  CALCULATE_KV_CACHE,
  PYTORCH_TRANSFORMER_SNIPPET,
  PRODUCTION_PRINCIPLES
} from "./internalsEngine.js";

// Existing Application Light Theme Color Tokens
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

// ── SUBCOMPONENT: Card ──
function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "18px 22px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── SUBCOMPONENT: CodeBlock ──
function CodeBlock({ code, title = "PyTorch Implementation" }) {
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
export default function ModelInternalsTab() {
  const [activeTab, setActiveTab] = useState("overview");
  const [openPillar, setOpenPillar] = useState("attention");
  const [activeStage, setActiveStage] = useState(0);

  // KV Cache Calculator State
  const [calcSeqLen, setCalcSeqLen] = useState(4096);
  const [calcLayers, setCalcLayers] = useState(32);
  const [calcHeads, setCalcHeads] = useState(8);
  const [calcHeadDim, setCalcHeadDim] = useState(128);
  const [calcPrecision, setCalcPrecision] = useState(2); // 2 bytes = FP16, 1 byte = FP8
  const [calcBatch, setCalcBatch] = useState(1);

  // MoE Simulator State
  const [simTokens] = useState(["Quantum", "Compiler", "Optimization", "Gradient", "Backpropagation"]);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(0);

  const kvStats = CALCULATE_KV_CACHE(calcSeqLen, calcLayers, calcHeads, calcHeadDim, calcPrecision, calcBatch);

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "blocks", label: "4 Core Pillars" },
    { id: "forward", label: "Forward Pass Flow" },
    { id: "attention", label: "Attention & KV Cache" },
    { id: "moe", label: "MoE Routing" },
    { id: "code", label: "PyTorch Engine" },
    { id: "calculator", label: "KV Cache Calculator" },
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
      {/* ── HERO BANNER ── */}
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
              Transformer Architecture & Computational Geometry
            </div>
            <h1
              style={{
                margin: "0 0 10px 0",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: COLORS.textHeading,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Model Internals
            </h1>
            <p
              style={{
                color: COLORS.muted,
                fontSize: "0.88rem",
                lineHeight: 1.7,
                maxWidth: 720,
                margin: 0,
              }}
            >
              Deep dive into autoregressive transformer execution. Inspect high-dimensional subword embeddings,
              FlashAttention quadratic scaling, KV cache VRAM footprint dynamics, SwiGLU factual recall, and sparse
              Mixture-of-Experts (MoE) gating.
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
            🧠
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
          {MODEL_INTERNALS_KPI.map((m, i) => (
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
        {TABS.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
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

      {/* ── TAB 1: OVERVIEW ── */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              THE CORE TRANSFORMATION PIPELINE
            </div>
            <p style={{ color: COLORS.text, fontSize: 13, lineHeight: 1.7, margin: "0 0 16px 0" }}>
              Modern generative language models map discrete text tokens to high-dimensional continuous manifolds,
              routing contextual associations across sequential layers before unembedding probabilities for sampling.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {[
                { title: "Prefill Phase", tag: "Compute-Bound", desc: "Processes initial prompt tokens simultaneously. Matrix multiplications (GEMM) saturate GPU Tensor Cores.", color: COLORS.teal },
                { title: "Decode Phase", tag: "Memory-Bound", desc: "Generates one token at a time. Throughput is constrained by GPU memory bandwidth reading KV cache weights.", color: COLORS.amber },
                { title: "Context Scaling", tag: "O(N) with GQA", desc: "Grouped-Query Attention pools key-value heads, allowing 128k+ sequence lengths within physical VRAM limits.", color: COLORS.rose },
                { title: "MoE Gating", tag: "Sub-linear FLOPs", desc: "Top-2 routing decouples total parameter capacity from per-token active FLOP computation cost.", color: COLORS.violet },
              ].map((c, i) => (
                <div key={i} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ color: c.color, fontWeight: 700, fontSize: 12 }}>{c.title}</span>
                    <span style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace", background: COLORS.surface3, padding: "2px 6px", borderRadius: 4 }}>{c.tag}</span>
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ borderLeft: `4px solid ${COLORS.amber}` }}>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              ARCHITECTURAL PRINCIPLE: ATTENTION MIXES, FFN TRANSFORMS
            </div>
            <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7 }}>
              A transformer layer consists of two complementary computational operators:
              <br />
              <strong>1. Self-Attention</strong> acts as a dynamically addressed routing bus: it allows tokens to retrieve information from other tokens across the sequence without updating factual content.
              <br />
              <strong>2. Feed-Forward Networks (SwiGLU)</strong> act as dense key-value memory banks: they transform the internal features of each token independently, retrieving factual knowledge stored directly in the feed-forward weights.
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 2: 4 CORE PILLARS ── */}
      {activeTab === "blocks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {TRANSFORMER_PILLARS.map((p) => {
            const isOpen = openPillar === p.id;
            return (
              <div
                key={p.id}
                style={{
                  background: COLORS.surface,
                  border: `1px solid ${isOpen ? p.color : COLORS.border}`,
                  borderLeft: `4px solid ${p.color}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  onClick={() => setOpenPillar(isOpen ? null : p.id)}
                  style={{
                    padding: "14px 18px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isOpen ? COLORS.surface2 : COLORS.surface,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: "1.4rem" }}>{p.icon}</span>
                    <div>
                      <div style={{ color: p.color, fontFamily: "JetBrains Mono, monospace", fontSize: 13, fontWeight: 700 }}>
                        {p.label}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>{p.tagline}</div>
                    </div>
                  </div>
                  <span style={{ color: COLORS.muted, fontSize: 13, fontFamily: "JetBrains Mono, monospace" }}>
                    {isOpen ? "▲ Collapse" : "▼ Expand"}
                  </span>
                </div>

                {isOpen && (
                  <div style={{ padding: "16px 18px 18px 18px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.surface }}>
                    <p style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7, margin: "0 0 14px 0" }}>
                      {p.summary}
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>MATHEMATICAL FORMULATION</div>
                        <div style={{ color: COLORS.textHeading, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>{p.math}</div>
                      </div>
                      <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 12px" }}>
                        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>TENSOR SHAPE FLOW</div>
                        <div style={{ color: COLORS.textHeading, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 600 }}>{p.tensorShapes}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                      <div style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Key Mechanisms:</div>
                      <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, fontSize: 11, lineHeight: 1.6 }}>
                        {p.keyPoints.map((kp, idx) => (
                          <li key={idx} style={{ marginBottom: 3 }}>{kp}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: "rgba(225, 29, 72, 0.05)", border: `1px solid rgba(225, 29, 72, 0.25)`, borderRadius: 6, padding: "10px 12px" }}>
                      <span style={{ color: COLORS.rose, fontWeight: 700, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>CRITICAL FAILURE MODE: </span>
                      <span style={{ color: COLORS.text, fontSize: 11 }}>{p.failureModes}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: FORWARD PASS FLOW ── */}
      {activeTab === "forward" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              END-TO-END AUTOREGRESSIVE FORWARD PASS
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Step through the 7 sequential stages of a single transformer forward pass, from raw prompt string ingestion to final token sampling.
            </p>

            {/* Stepper bar */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
              {FORWARD_PASS_STAGES.map((s, idx) => {
                const isCur = activeStage === idx;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStage(idx)}
                    style={{
                      flex: 1,
                      minWidth: 120,
                      padding: "8px 10px",
                      background: isCur ? `${s.color}15` : COLORS.surface2,
                      border: `1px solid ${isCur ? s.color : COLORS.border}`,
                      borderRadius: 6,
                      color: isCur ? s.color : COLORS.muted,
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

            {/* Selected stage details */}
            {(() => {
              const cur = FORWARD_PASS_STAGES[activeStage];
              return (
                <div style={{ background: COLORS.surface2, border: `1px solid ${cur.color}55`, borderRadius: 8, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ color: cur.color, fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 800 }}>
                      {cur.title}
                    </div>
                    <span style={{ background: `${cur.color}18`, color: cur.color, padding: "3px 8px", borderRadius: 4, fontSize: 10, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                      {cur.status}
                    </span>
                  </div>

                  <p style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7, marginBottom: 14 }}>
                    {cur.desc}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: COLORS.surface, borderRadius: 6, padding: "8px 12px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>INPUT TENSOR SHAPE</div>
                      <div style={{ color: COLORS.textHeading, fontSize: 11, fontFamily: "JetBrains Mono, monospace", marginTop: 2, fontWeight: 600 }}>{cur.inputShape}</div>
                    </div>
                    <div style={{ background: COLORS.surface, borderRadius: 6, padding: "8px 12px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ color: COLORS.muted, fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}>OUTPUT TENSOR SHAPE</div>
                      <div style={{ color: cur.color, fontSize: 11, fontFamily: "JetBrains Mono, monospace", marginTop: 2, fontWeight: 600 }}>{cur.outputShape}</div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* ── TAB 4: ATTENTION & KV CACHE ── */}
      {activeTab === "attention" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              ATTENTION FLAVORS: MHA vs GQA vs MQA
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 14px 0" }}>
              How Key-Value head sharing slashes KV cache memory bandwidth bottlenecks during autoregressive generation.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
              <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: COLORS.rose, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Multi-Head Attention (MHA)</div>
                <div style={{ fontSize: 11, color: COLORS.textHeading, fontWeight: 600, marginBottom: 6 }}>1 Q Head : 1 KV Head</div>
                <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.5 }}>
                  Every query head possesses its own independent key and value heads. Maximum expressivity, but results in massive KV cache sizes that saturate memory bandwidth during generation.
                </div>
              </div>

              <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.sky}55`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: COLORS.sky, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Grouped-Query Attention (GQA)</div>
                <div style={{ fontSize: 11, color: COLORS.sky, fontWeight: 600, marginBottom: 6 }}>4 or 8 Q Heads : 1 KV Head</div>
                <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.5 }}>
                  Groups of query heads share a single key-value head. Slashes KV cache by 87.5% with virtually identical perplexity. Standard in Llama-3, Mistral, and DeepSeek.
                </div>
              </div>

              <div style={{ background: COLORS.surface2, border: `1px solid ${COLORS.amber}55`, borderRadius: 8, padding: 14 }}>
                <div style={{ color: COLORS.amber, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>Multi-Query Attention (MQA)</div>
                <div style={{ fontSize: 11, color: COLORS.amber, fontWeight: 600, marginBottom: 6 }}>All Q Heads : 1 Single KV Head</div>
                <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.5 }}>
                  Extreme compression where all query heads share one singular KV head across the entire model layer. Maximum memory speed, with slight degradation in complex reasoning tasks.
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ borderLeft: `4px solid ${COLORS.teal}` }}>
            <div style={{ color: COLORS.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
              FLASHATTENTION-2: IO-AWARE HARDWARE ACCELERATION
            </div>
            <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.7 }}>
              Standard attention stores the intermediate <em>N × N</em> attention matrix in GPU High-Bandwidth Memory (HBM). For an 8,192 token prompt, this requires reading and writing 67 million floats per head.
              FlashAttention tiles the computation across GPU on-chip SRAM, computing online softmax without materializing the full attention matrix in HBM, achieving a 2x-4x speedup.
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 5: MOE ROUTING ── */}
      {activeTab === "moe" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              SPARSE MIXTURE-OF-EXPERTS (MoE) ROUTING SIMULATOR
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              In an MoE architecture (e.g. Mixtral 8x7B, DeepSeek-V3), each token is dynamically assigned to Top-2 out of 8 experts by a gating router.
            </p>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>Select an incoming token:</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {simTokens.map((t, idx) => {
                  const isSel = selectedTokenIdx === idx;
                  return (
                    <button
                      key={t}
                      onClick={() => setSelectedTokenIdx(idx)}
                      style={{
                        background: isSel ? `${COLORS.violet}15` : COLORS.surface2,
                        border: `1px solid ${isSel ? COLORS.violet : COLORS.border}`,
                        color: isSel ? COLORS.violet : COLORS.muted,
                        borderRadius: 6,
                        padding: "6px 12px",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: 11,
                        fontWeight: isSel ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      "{t}"
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expert matrix */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 10 }}>
              {[
                { id: 0, name: "Expert 0: Code & Logic", affinity: [0.12, 0.65, 0.45, 0.05, 0.10][selectedTokenIdx] },
                { id: 1, name: "Expert 1: Math & Reasoning", affinity: [0.78, 0.10, 0.20, 0.82, 0.60][selectedTokenIdx] },
                { id: 2, name: "Expert 2: Science & Physics", affinity: [0.65, 0.08, 0.15, 0.22, 0.15][selectedTokenIdx] },
                { id: 3, name: "Expert 3: Systems & OS", affinity: [0.05, 0.72, 0.88, 0.12, 0.08][selectedTokenIdx] },
                { id: 4, name: "Expert 4: Linguistics", affinity: [0.10, 0.05, 0.08, 0.15, 0.12][selectedTokenIdx] },
                { id: 5, name: "Expert 5: Algorithmic Logic", affinity: [0.20, 0.40, 0.75, 0.35, 0.70][selectedTokenIdx] },
                { id: 6, name: "Expert 6: Factual Recall", affinity: [0.08, 0.12, 0.10, 0.20, 0.18][selectedTokenIdx] },
                { id: 7, name: "Expert 7: General Discourse", affinity: [0.02, 0.08, 0.04, 0.09, 0.07][selectedTokenIdx] },
              ].map((exp) => {
                const isActive = exp.affinity > 0.4;
                return (
                  <div
                    key={exp.id}
                    style={{
                      background: isActive ? `${COLORS.violet}0C` : COLORS.surface2,
                      border: `1px solid ${isActive ? COLORS.violet : COLORS.border}`,
                      borderRadius: 8,
                      padding: "10px 12px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: isActive ? COLORS.violet : COLORS.textHeading, fontWeight: 700, fontSize: 11 }}>
                        {exp.name}
                      </span>
                      {isActive && (
                        <span style={{ background: COLORS.violet, color: "#fff", fontSize: 9, fontWeight: 800, padding: "1px 5px", borderRadius: 3 }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <div style={{ color: COLORS.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace", marginTop: 4 }}>
                      Softmax Weight: {(exp.affinity * 100).toFixed(0)}%
                    </div>
                    <div style={{ width: "100%", height: 5, background: COLORS.surface3, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ width: `${exp.affinity * 100}%`, height: "100%", background: isActive ? COLORS.violet : COLORS.muted }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 6: PYTORCH ENGINE ── */}
      {activeTab === "code" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <CodeBlock code={PYTORCH_TRANSFORMER_SNIPPET} title="production_transformer_block.py" />
        </div>
      )}

      {/* ── TAB 7: KV CACHE CALCULATOR ── */}
      {activeTab === "calculator" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>
              INTERACTIVE KV CACHE VRAM FOOTPRINT SIMULATOR
            </div>
            <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Calculate the exact GPU VRAM requirement for caching Key-Value tensors during long-context autoregressive inference:
              <br />
              <code style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", background: COLORS.surface2, padding: "2px 6px", borderRadius: 4, display: "inline-block", marginTop: 4 }}>
                VRAM = 2 × batch_size × layers × kv_heads × seq_len × head_dim × precision_bytes
              </code>
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>
                  Sequence Length (Tokens): {calcSeqLen.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="512"
                  max="131072"
                  step="512"
                  value={calcSeqLen}
                  onChange={(e) => setCalcSeqLen(Number(e.target.value))}
                  style={{ width: "100%", accentColor: COLORS.amber }}
                />
              </div>

              <div>
                <label style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>
                  Layers: {calcLayers}
                </label>
                <input
                  type="range"
                  min="16"
                  max="128"
                  step="8"
                  value={calcLayers}
                  onChange={(e) => setCalcLayers(Number(e.target.value))}
                  style={{ width: "100%", accentColor: COLORS.amber }}
                />
              </div>

              <div>
                <label style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>
                  KV Heads (GQA): {calcHeads}
                </label>
                <input
                  type="range"
                  min="1"
                  max="32"
                  step="1"
                  value={calcHeads}
                  onChange={(e) => setCalcHeads(Number(e.target.value))}
                  style={{ width: "100%", accentColor: COLORS.amber }}
                />
              </div>

              <div>
                <label style={{ color: COLORS.textHeading, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 4 }}>
                  Precision: {calcPrecision === 2 ? "FP16 (2 bytes)" : "FP8 (1 byte)"}
                </label>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => setCalcPrecision(2)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: 4,
                      border: `1px solid ${calcPrecision === 2 ? COLORS.amber : COLORS.border}`,
                      background: calcPrecision === 2 ? `${COLORS.amber}18` : COLORS.surface2,
                      color: calcPrecision === 2 ? COLORS.amber : COLORS.muted,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    FP16
                  </button>
                  <button
                    onClick={() => setCalcPrecision(1)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: 4,
                      border: `1px solid ${calcPrecision === 1 ? COLORS.amber : COLORS.border}`,
                      background: calcPrecision === 1 ? `${COLORS.amber}18` : COLORS.surface2,
                      color: calcPrecision === 1 ? COLORS.amber : COLORS.muted,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    FP8
                  </button>
                </div>
              </div>
            </div>

            {/* Results card */}
            <div style={{ background: "#FFFBEB", border: `1px solid #FDE68A`, borderRadius: 8, padding: 18, textAlign: "center" }}>
              <div style={{ color: "#92400E", fontSize: 11, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
                ESTIMATED KV CACHE SIZE
              </div>
              <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: "2.4rem", fontWeight: 900, margin: "6px 0" }}>
                {kvStats.gb > 1 ? `${kvStats.gb} GB` : `${kvStats.mb} MB`}
              </div>
              <div style={{ color: "#78350F", fontSize: 11 }}>
                At {calcSeqLen.toLocaleString()} context length across {calcLayers} layers and {calcHeads} KV heads.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── FOOTER: PRODUCTION ENGINEERING PRINCIPLES ── */}
      <Card style={{ border: `1px solid ${COLORS.border}` }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
          PRODUCTION MODEL SERVING PRINCIPLES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {PRODUCTION_PRINCIPLES.map((pr, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${pr.color}`, paddingLeft: 10 }}>
              <div style={{ color: pr.color, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{pr.title}</div>
              <div style={{ color: COLORS.muted, fontSize: 11, lineHeight: 1.5 }}>{pr.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
