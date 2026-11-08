import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  NINE_STEPS,
  GLOSSARY,
  THREE_SPACES,
  COST_ARCHITECTURE,
  KEY_STATS,
  INSIGHTS,
} from "./agentFlywheelContent.js";

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

/* ─── Overview sub-tab ────────────────────────────────── */
function Overview() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🔄</span>
          <div>
            <div style={{ ...labelStyle(C.teal), marginBottom: 4 }}>AGENTIC CODING METHODOLOGY</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>
              The Agentic Coding Flywheel
            </h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          A comprehensive methodology for creating extraordinary software by orchestrating swarms
          of AI agents using exhaustive markdown plans, beads-based task management, and the
          Agent Flywheel coordination stack. The core insight: move the hardest thinking into
          representations that still fit into model context windows.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {KEY_STATS.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.s2,
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ ...mono, color: C.gold, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.text, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              <div style={{ color: C.muted, fontSize: 9, marginTop: 2 }}>{s.detail}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <Callout color={C.lav} title="WHO IT IS FOR">
            {TRACK_OVERVIEW.audience}
          </Callout>
          <Callout color={C.teal} title="CORE INSIGHT">
            The plan is still the best artifact for whole-system thought. But once a swarm is
            involved, what you need is not a beautiful essay — it is a task graph that carries
            enough local context for agents to act correctly without repeatedly loading the
            whole project back into memory.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>THE NINE STEPS</div>
        <div style={{ display: "grid", gap: 10 }}>
          {NINE_STEPS.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <span
                style={{
                  ...mono,
                  color: C.teal,
                  fontWeight: 700,
                  fontSize: 16,
                  minWidth: 28,
                  textAlign: "center",
                }}
              >
                {s.n}
              </span>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>KEY INSIGHTS</div>
        <div style={{ display: "grid", gap: 8 }}>
          {INSIGHTS.map((ins, i) => (
            <Callout key={i} color={C.lav}>
              {ins}
            </Callout>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Glossary sub-tab ────────────────────────────────── */
function Glossary() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>GLOSSARY — AGENT FLYWHEEL TERMS</div>
        <DataTable
          headers={["Term", "Meaning", "Why It Matters"]}
          rows={GLOSSARY.map((g) => [g.term, g.meaning, g.why])}
          accent={C.teal}
        />
      </div>
    </>
  );
}

/* ─── Three Spaces sub-tab ────────────────────────────── */
function ThreeSpaces() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>THREE REASONING SPACES</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          The methodology separates work into three spaces, each with a different artifact
          and a different question it answers.
        </div>
        <DataTable
          headers={["Space", "Primary Artifact", "What You Decide There"]}
          rows={THREE_SPACES.map((s) => [s.space, s.artifact, s.decides])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>COST ARCHITECTURE — WHERE YOU CATCH THE BUG</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Where you catch the bug determines the rework bill. The deeper a mistake lands,
          the more downstream structure has already hardened around it.
        </div>
        <DataTable
          headers={["Layer", "Rework Cost", "Character"]}
          rows={COST_ARCHITECTURE.map((c) => [c.layer, c.cost, c.character])}
          accent={C.gold}
        />
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function AgentFlywheelTab() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "glossary", label: "Glossary" },
    { id: "spaces", label: "Three Spaces" },
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
      {tab === "glossary" && <Glossary />}
      {tab === "spaces" && <ThreeSpaces />}
    </div>
  );
}
