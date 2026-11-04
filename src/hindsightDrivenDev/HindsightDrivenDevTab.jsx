import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  LESSON_MAP,
  HDD_LOOP_STAGES,
  COMPARISON_TABLE,
  SUPPORT_CHATBOT_EXAMPLE,
  QUICK_CHECK_QUESTIONS,
} from "./hindsightDrivenDevContent.js";
import { callAIProxy } from "../lib/aiProxy.js";

const C = {
  bg: "#0F1219",
  surface: "#161B26",
  s2: "#1C2433",
  s3: "#243044",
  border: "#2A3548",
  text: "#E2E8F0",
  muted: "#B8B8C4",
  teal: "#5EC4C8",
  tealDark: "#3A9B9F",
  coral: "#E8837A",
  lav: "#C9B8E8",
  gold: "#F0C674",
};

const sectionStyle = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 24,
};

const mono = { fontFamily: "JetBrains Mono, monospace" };

const labelStyle = (color) => ({
  ...mono,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color,
  marginBottom: 12,
});

function DataTable({ headers, rows, accent = C.teal }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, ...mono }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "8px 10px",
                  borderBottom: `1px solid ${C.border}`,
                  color: accent,
                  fontWeight: 600,
                  fontSize: 10,
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? C.s2 + "55" : "transparent" }}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: "8px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    color: j === 0 ? C.text : C.muted,
                    fontWeight: j === 0 ? 600 : 400,
                    lineHeight: 1.6,
                    verticalAlign: "top",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({ color, title, children }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        background: color + "11",
        borderRadius: 8,
        borderLeft: `3px solid ${color}`,
      }}
    >
      {title && (
        <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{title}</div>
      )}
      <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* ─── Overview Sub-tab ────────────────────────────────── */
function Overview() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🔮</span>
          <div>
            <div style={{ ...labelStyle(C.teal), marginBottom: 4 }}>FOUNDATIONS & ARCHITECTURE · LESSON</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>
              Hindsight-Driven Development (HDD)
            </h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Traditional methods ask you to <strong style={{ color: C.text }}>foresee</strong>: decide behavior, UX, and architecture before anything exists. HDD asks you to use <strong style={{ color: C.text }}>hindsight</strong>: build a rough version, watch what happens, and let the results shape the spec.
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <Callout color={C.gold} title="CORE INSIGHT">
            &quot;Predicting what's right is hard. Recognizing what's wrong is easy.&quot; AI-assisted coding makes trying cheaper than guessing.
          </Callout>
          <Callout color={C.lav} title="LEARNING OBJECTIVES">
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {TRACK_OVERVIEW.outcomes.map((o, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{o}</li>
              ))}
            </ul>
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>LESSON MAP</div>
        <DataTable
          headers={["#", "Lesson", "Core Idea"]}
          rows={LESSON_MAP.map((l) => [l.n, l.lesson, l.core])}
        />
      </div>
    </>
  );
}

/* ─── The Loop Sub-tab ────────────────────────────────── */
function TheLoopSubTab() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THE 5-STEP HDD LOOP</div>
        <div style={{ display: "grid", gap: 14 }}>
          {HDD_LOOP_STAGES.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.s2,
                borderRadius: 8,
                padding: 16,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.teal, fontWeight: 700, fontSize: 12, ...mono }}>STEP {s.step}</span>
                <span style={{ color: C.gold, fontSize: 11, ...mono }}>{s.name}</span>
              </div>
              <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
              <div style={{ background: C.surface, padding: "8px 12px", borderRadius: 6, color: C.muted, fontSize: 11, ...mono }}>
                💡 <strong>Example:</strong> {s.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Comparison Sub-tab ──────────────────────────────── */
function ComparisonSubTab() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>HOW HDD COMPARES</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
          Understanding where HDD differs from traditional software engineering paradigms:
        </div>
        <DataTable
          headers={["Approach", "When Are Specs/Tests Written?", "Key Difference"]}
          rows={COMPARISON_TABLE.map((r) => [r.approach, r.timing, r.difference])}
          accent={C.lav}
        />
      </div>
    </>
  );
}

/* ─── Worked Example Sub-tab ──────────────────────────── */
function WorkedExampleSubTab() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>WORKED EXAMPLE: SUPPORT CHATBOT</div>
        <div style={{ display: "grid", gap: 12 }}>
          <Callout color={C.teal} title="1. INTENT">
            {SUPPORT_CHATBOT_EXAMPLE.intent}
          </Callout>
          <Callout color={C.lav} title="2. ROUGH BUILD">
            {SUPPORT_CHATBOT_EXAMPLE.roughBuild}
          </Callout>
          <div style={{ background: C.s2, padding: 16, borderRadius: 8, borderLeft: `3px solid ${C.coral}` }}>
            <div style={{ color: C.coral, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>3. OBSERVE & 4. CODIFY</div>
            {SUPPORT_CHATBOT_EXAMPLE.observations.map((obs, i) => (
              <div key={i} style={{ marginBottom: 10, fontSize: 12, lineHeight: 1.6 }}>
                <div style={{ color: C.text }}>💬 &quot;{obs.feedback}&quot;</div>
                <div style={{ color: obs.type === "checkable" ? C.teal : C.gold, marginTop: 4, ...mono }}>
                  → {obs.type === "checkable" ? "Testable Correction" : "Spec Note"}: {obs.action}
                </div>
              </div>
            ))}
          </div>
          <Callout color={C.gold} title="5. FINAL SPEC">
            {SUPPORT_CHATBOT_EXAMPLE.finalSpec}
          </Callout>
        </div>
      </div>
    </>
  );
}

/* ─── AI Simulator Sub-tab ────────────────────────────── */
function AISimulatorSubTab() {
  const [intent, setIntent] = useState("A minimalist markdown notes app with local storage sync");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `You are an expert in Hindsight-Driven Development (HDD).
The user wants to build a feature with this intent: "${intent}".
Provide:
1. Rough Prototype Draft (bullet points of what a quick AI prototype would include)
2. Two Sample Observations (one checkable/testable, one vague note)
3. Codified Outcomes (the resulting test and spec note)
4. Resulting Spec Summary.

Format clearly with headings.`;

      const response = await callAIProxy({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Failed to run simulation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>AI HDD SIMULATOR & WORKFLOW GENERATOR</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Enter a feature intent below. Let AI simulate the HDD loop: generating a rapid prototype concept, mock stakeholder feedback, codified tests, and final spec.
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            style={{
              flex: 1,
              background: C.s2,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: "10px 14px",
              color: C.text,
              fontSize: 12,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={runSimulation}
            disabled={loading}
            style={{
              background: C.teal,
              color: C.bg,
              border: "none",
              borderRadius: 6,
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {loading ? "Simulating..." : "Run HDD Loop"}
          </button>
        </div>
        {error && <div style={{ color: C.coral, fontSize: 12, marginBottom: 12 }}>{error}</div>}
        {result && (
          <div
            style={{
              background: C.s2,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: 16,
              color: C.text,
              fontSize: 12,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              ...mono,
            }}
          >
            {result}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Quick Check Quiz Sub-tab ────────────────────────── */
function QuickCheckSubTab() {
  const [revealed, setRevealed] = useState({});

  const toggle = (i) => {
    setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>QUICK CHECK & KNOWLEDGE VALIDATION</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
          Test your mastery of Hindsight-Driven Development. Click each question to reveal the answer.
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {QUICK_CHECK_QUESTIONS.map((item, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              style={{
                background: C.s2,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 14,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ color: C.text, fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{item.q}</div>
              {revealed[i] ? (
                <div style={{ color: C.teal, fontSize: 12, marginTop: 8, ...mono }}>
                  ✓ <strong>Answer:</strong> {item.answer}
                </div>
              ) : (
                <div style={{ color: C.muted, fontSize: 11, fontStyle: "italic" }}>Click to reveal answer...</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function HindsightDrivenDevTab() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "loop", label: "The HDD Loop" },
    { id: "comparison", label: "Comparison" },
    { id: "example", label: "Worked Example" },
    { id: "simulator", label: "AI Simulator" },
    { id: "quiz", label: "Quick Check" },
  ];

  return (
    <div
      style={{
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
        maxWidth: 880,
        margin: "0 auto",
      }}
    >
      {/* Sub-tab bar */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: "0 12px",
          margin: 0,
        }}
      >
        <div style={{ display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                borderBottom: `2px solid ${tab === t.id ? C.teal : "transparent"}`,
                color: tab === t.id ? C.teal : C.muted,
                padding: "10px 12px",
                fontSize: 12,
                fontWeight: tab === t.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && <Overview />}
      {tab === "loop" && <TheLoopSubTab />}
      {tab === "comparison" && <ComparisonSubTab />}
      {tab === "example" && <WorkedExampleSubTab />}
      {tab === "simulator" && <AISimulatorSubTab />}
      {tab === "quiz" && <QuickCheckSubTab />}
    </div>
  );
}
