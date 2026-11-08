import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  MULTI_AGENT_PATTERNS,
  ADAPTIVE_MODEL_SELECTOR,
  HIERARCHICAL_MEMORY,
  PROMPT_OPTIMIZATION,
  SMART_CACHING,
  PERFORMANCE_METRICS,
  OPTIMIZATION_TARGETS,
  AB_TESTING,
  FUTURE_TRENDS,
  RESEARCH_FRONTIERS,
  OPEN_CHALLENGES,
  STRATEGIC_RECOMMENDATIONS,
  KEY_TAKEAWAYS,
  STRATEGIC_LESSONS,
  NEXT_STEPS,
  ACCOMPLISHMENTS,
  MARKET_STATS,
  FUTURE_OPPORTUNITIES,
} from "./advancedAgentTopicsContent.js";

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

function CodeBlock({ text, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
        whiteSpace: "pre-wrap",
        color: C.text,
        fontSize: 11,
        lineHeight: 1.6,
        ...mono,
        overflowX: "auto",
      }}
    >
      {text}
    </div>
  );
}

/* ─── Multi-Agent sub-tab ─────────────────────────────── */
function MultiAgent() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>MULTI-AGENT ARCHITECTURE PATTERNS</div>
        <div style={{ display: "grid", gap: 16 }}>
          {MULTI_AGENT_PATTERNS.map((p, i) => (
            <div
              key={i}
              style={{
                padding: 16,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{p.name}</div>
              <CodeBlock text={p.code} accent={C.teal} />
              <div style={{ marginTop: 10, display: "grid", gap: 2 }}>
                {p.characteristics.map((ch, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {ch}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Performance sub-tab ─────────────────────────────── */
function Performance() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>ADAPTIVE MODEL SELECTOR</div>
        <CodeBlock text={ADAPTIVE_MODEL_SELECTOR} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PROMPT OPTIMIZATION</div>
        <div style={{ display: "grid", gap: 4 }}>
          {PROMPT_OPTIMIZATION.map((p, i) => (
            <div key={i} style={{ color: C.text, fontSize: 12, paddingLeft: 12 }}>• {p}</div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>HIERARCHICAL MEMORY SYSTEM</div>
        <CodeBlock text={HIERARCHICAL_MEMORY} accent={C.gold} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>SMART CACHING</div>
        <div style={{ display: "grid", gap: 4 }}>
          {SMART_CACHING.map((s, i) => (
            <div key={i} style={{ color: C.text, fontSize: 12, paddingLeft: 12 }}>• {s}</div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>PERFORMANCE METRICS & TARGETS</div>
        <DataTable
          headers={["Metric", "Detail"]}
          rows={PERFORMANCE_METRICS.map((m) => [m.metric, m.detail])}
          accent={C.lav}
        />
        <div style={{ marginTop: 12 }}>
          <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>Optimization Targets</div>
          {OPTIMIZATION_TARGETS.map((t, i) => (
            <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {t}</div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ color: C.coral, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>A/B Testing</div>
          {AB_TESTING.map((a, i) => (
            <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {a}</div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Future sub-tab ──────────────────────────────────── */
function Future() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>FUTURE DIRECTIONS</div>
        <div style={{ display: "grid", gap: 16 }}>
          {FUTURE_TRENDS.map((t, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t.category}</div>
              <div style={{ display: "grid", gap: 2 }}>
                {t.items.map((item, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>RESEARCH FRONTIERS</div>
        <DataTable
          headers={["Area", "Description"]}
          rows={RESEARCH_FRONTIERS.map((r) => [r.area, r.description])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>OPEN CHALLENGES</div>
        <DataTable
          headers={["Challenge", "Description"]}
          rows={OPEN_CHALLENGES.map((o) => [o.challenge, o.description])}
          accent={C.coral}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>STRATEGIC RECOMMENDATIONS</div>
        <div style={{ display: "grid", gap: 6 }}>
          {STRATEGIC_RECOMMENDATIONS.map((r, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.gold}`,
                color: C.text,
                fontSize: 12,
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Conclusion sub-tab ──────────────────────────────── */
function Conclusion() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WHAT YOU'VE ACCOMPLISHED</div>
        <div style={{ display: "grid", gap: 12 }}>
          {ACCOMPLISHMENTS.map((a, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{a.category}</div>
              <div style={{ display: "grid", gap: 2 }}>
                {a.items.map((item, j) => (
                  <div key={j} style={{ color: C.text, fontSize: 11 }}>• {item}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>KEY TECHNICAL INSIGHTS</div>
        <div style={{ display: "grid", gap: 10 }}>
          {KEY_TAKEAWAYS.map((k, i) => (
            <Callout key={i} color={C.lav} title={k.insight}>
              {k.detail}
            </Callout>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>STRATEGIC LESSONS</div>
        <div style={{ display: "grid", gap: 10 }}>
          {STRATEGIC_LESSONS.map((s, i) => (
            <Callout key={i} color={C.gold} title={s.lesson}>
              {s.detail}
            </Callout>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>YOUR NEXT STEPS</div>
        <div style={{ display: "grid", gap: 10 }}>
          {NEXT_STEPS.map((s) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
              }}
            >
              <span style={{ ...mono, color: C.teal, fontWeight: 700, fontSize: 14, minWidth: 24 }}>
                {s.step}
              </span>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>MARKET OPPORTUNITY</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
          {MARKET_STATS.map((s, i) => (
            <div
              key={i}
              style={{
                background: C.s2,
                borderRadius: 8,
                padding: 12,
                textAlign: "center",
                borderLeft: `3px solid ${C.gold}`,
              }}
            >
              <div style={{ ...mono, color: C.gold, fontSize: 20, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.text, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gap: 4 }}>
          {FUTURE_OPPORTUNITIES.map((o, i) => (
            <div key={i} style={{ color: C.text, fontSize: 11, paddingLeft: 12 }}>• {o}</div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function AdvancedAgentTopicsTab() {
  const [tab, setTab] = useState("multiagent");

  const tabs = [
    { id: "multiagent", label: "Multi-Agent Systems" },
    { id: "performance", label: "Performance" },
    { id: "future", label: "Future Directions" },
    { id: "conclusion", label: "Conclusion" },
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

      {tab === "multiagent" && <MultiAgent />}
      {tab === "performance" && <Performance />}
      {tab === "future" && <Future />}
      {tab === "conclusion" && <Conclusion />}
    </div>
  );
}
