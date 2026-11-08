import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  KEY_CHARACTERISTICS,
  ARCHITECTURE_COMPONENTS,
  THINK_ACT_OBSERVE,
  FRAMEWORKS,
  FRAMEWORK_SELECTION,
  SELECTION_CRITERIA,
  SPECIALIZED_FRAMEWORKS,
  FUTURE_TRENDS,
  FUTURE_IMPACT,
} from "./aiAgentFoundationsContent.js";

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

/* ─── Understanding Agents sub-tab ────────────────────── */
function UnderstandingAgents() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WHAT ARE AI AGENTS?</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          AI agents are autonomous software programs that can perceive their environment,
          process information, and take actions to achieve goals without constant human
          intervention. Unlike traditional software that follows predefined rules, AI agents
          leverage large language models (LLMs) to understand context, reason through problems,
          and adapt their behavior based on feedback.
        </div>
        <div style={labelStyle(C.lav)}>KEY CHARACTERISTICS</div>
        <DataTable
          headers={["Characteristic", "Description"]}
          rows={KEY_CHARACTERISTICS.map((k) => [k.characteristic, k.description])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>CORE ARCHITECTURE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          An AI agent consists of three core components working together:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { name: "AI Brain", desc: "The core LLM that processes information and makes decisions", color: C.teal },
            { name: "Memory", desc: "Stores context, past interactions, and learned information", color: C.lav },
            { name: "Tools", desc: "External APIs and functions the agent can use to take actions", color: C.gold },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${c.color}`,
              }}
            >
              <div style={{ color: c.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.name}</div>
              <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <DataTable
          headers={["Component", "Description"]}
          rows={ARCHITECTURE_COMPONENTS.map((a) => [a.component, a.description])}
          accent={C.teal}
        />
      </div>
    </>
  );
}

/* ─── Think-Act-Observe sub-tab ───────────────────────── */
function ThinkActObserve() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THE THINK-ACT-OBSERVE WORKFLOW</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          AI agents operate using a continuous cycle that mirrors human problem-solving
          approaches. This workflow ensures agents can adapt and respond effectively to
          changing conditions.
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {THINK_ACT_OBSERVE.map((s, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                {i + 1}. {s.step}
              </div>
              <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
                {s.description}
              </div>
              <div style={{ display: "grid", gap: 4 }}>
                {s.details.map((d, j) => (
                  <div key={j} style={{ color: C.muted, fontSize: 11, paddingLeft: 12 }}>
                    • {d}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>MARKET IMPACT</div>
        <Callout color={C.gold}>
          The AI agent market is projected to surge from $5.1 billion in 2024 to $47.1 billion
          by 2030, representing unprecedented growth in autonomous AI systems. Understanding how
          to build and deploy these systems has become essential for developers and organizations
          looking to stay competitive.
        </Callout>
      </div>
    </>
  );
}

/* ─── Frameworks sub-tab ──────────────────────────────── */
function Frameworks() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>FRAMEWORK SELECTION CRITERIA</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {SELECTION_CRITERIA.map((c, i) => (
            <span
              key={i}
              style={{
                padding: "4px 12px",
                background: C.s2,
                borderRadius: 999,
                border: `1px solid ${C.border}`,
                color: C.teal,
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>POPULAR FRAMEWORKS</div>
        <div style={{ display: "grid", gap: 16 }}>
          {FRAMEWORKS.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.name}</div>
              <div style={{ color: C.gold, fontSize: 11, ...mono, marginBottom: 8 }}>{f.tagline}</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{f.description}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>FEATURES</div>
                  {f.features.map((feat, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {feat}</div>
                  ))}
                </div>
                <div>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>STRENGTHS</div>
                  {f.strengths.map((s, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {s}</div>
                  ))}
                </div>
                <div>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>BEST FOR</div>
                  {f.bestFor.map((b, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {b}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>FRAMEWORK SELECTION GUIDE</div>
        <DataTable
          headers={["Audience", "Recommendation"]}
          rows={FRAMEWORK_SELECTION.map((f) => [f.audience, f.recommendation])}
          accent={C.gold}
        />
      </div>
    </>
  );
}

/* ─── Specialized sub-tab ─────────────────────────────── */
function Specialized() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>SPECIALIZED FRAMEWORKS & EMERGING PROTOCOLS</div>
        <div style={{ display: "grid", gap: 16 }}>
          {SPECIALIZED_FRAMEWORKS.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.name}</div>
              <div style={{ color: C.gold, fontSize: 11, ...mono, marginBottom: 8 }}>{f.tagline}</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{f.description}</div>
              {f.highlights && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>HIGHLIGHTS</div>
                  {f.highlights.map((h, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {h}</div>
                  ))}
                </div>
              )}
              {f.features && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>FEATURES</div>
                  {f.features.map((feat, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {feat}</div>
                  ))}
                </div>
              )}
              {f.useCases && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>USE CASES</div>
                  {f.useCases.map((u, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {u}</div>
                  ))}
                </div>
              )}
              {f.coreCapabilities && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>CORE CAPABILITIES</div>
                  {f.coreCapabilities.map((c, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {c}</div>
                  ))}
                </div>
              )}
              {f.benefits && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>BENEFITS</div>
                  {f.benefits.map((b, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {b}</div>
                  ))}
                </div>
              )}
              {f.applications && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>APPLICATIONS</div>
                  {f.applications.map((a, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {a}</div>
                  ))}
                </div>
              )}
              {f.monitoring && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>MONITORING & ANALYTICS</div>
                  {f.monitoring.map((m, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {m}</div>
                  ))}
                </div>
              )}
              {f.operations && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>OPERATIONS MANAGEMENT</div>
                  {f.operations.map((o, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {o}</div>
                  ))}
                </div>
              )}
              {f.enterprise && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>ENTERPRISE FEATURES</div>
                  {f.enterprise.map((e, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {e}</div>
                  ))}
                </div>
              )}
              {f.perfectFor && (
                <div style={{ color: C.gold, fontSize: 11, marginTop: 6, fontStyle: "italic" }}>
                  Perfect for: {f.perfectFor}
                </div>
              )}
              {f.benefits && !f.highlights && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ color: C.lav, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>KEY BENEFITS</div>
                  {f.benefits.map((b, j) => (
                    <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {b}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>FUTURE TRENDS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Key Trends</div>
            {FUTURE_TRENDS.map((t, i) => (
              <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 4 }}>• {t}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.coral, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Impact</div>
            {FUTURE_IMPACT.map((imp, i) => (
              <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 4 }}>• {imp}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function AiAgentFoundationsTab() {
  const [tab, setTab] = useState("understanding");

  const tabs = [
    { id: "understanding", label: "Understanding Agents" },
    { id: "workflow", label: "Think-Act-Observe" },
    { id: "frameworks", label: "Frameworks" },
    { id: "specialized", label: "Specialized" },
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

      {tab === "understanding" && <UnderstandingAgents />}
      {tab === "workflow" && <ThinkActObserve />}
      {tab === "frameworks" && <Frameworks />}
      {tab === "specialized" && <Specialized />}
    </div>
  );
}
