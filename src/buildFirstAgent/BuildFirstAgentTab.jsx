import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  SYSTEM_REQUIREMENTS,
  AGENT_CODE,
  AGENT_KEY_COMPONENTS,
  AGENT_BEST_PRACTICES,
  KNOWLEDGE_BASE_CODE,
  NEXT_STEPS_ENHANCE,
  NEXT_STEPS_PRODUCTION,
  WHAT_YOU_BUILD,
} from "./buildFirstAgentContent.js";

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

/* ─── Overview sub-tab ────────────────────────────────── */
function Overview() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WHAT YOU'LL BUILD</div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          In this tutorial, you'll create a customer service AI agent that can handle common
          inquiries, access a knowledge base, and escalate complex issues to human agents.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {WHAT_YOU_BUILD.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: C.s2,
                borderRadius: 6,
                borderLeft: `3px solid ${C.teal}`,
                color: C.text,
                fontSize: 12,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>SYSTEM REQUIREMENTS</div>
        <div style={{ display: "grid", gap: 12 }}>
          {SYSTEM_REQUIREMENTS.map((req, i) => (
            <div key={i}>
              <div style={{ color: C.lav, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{req.category}</div>
              {req.items.map((item, j) => (
                <div key={j} style={{ color: C.text, fontSize: 11, marginBottom: 2, paddingLeft: 12 }}>• {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>NEXT STEPS AFTER BUILDING</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Enhance Your Agent</div>
            {NEXT_STEPS_ENHANCE.map((s, i) => (
              <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {s}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.coral, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>Production Readiness</div>
            {NEXT_STEPS_PRODUCTION.map((s, i) => (
              <div key={i} style={{ color: C.text, fontSize: 11, marginBottom: 2 }}>• {s}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Agent Code sub-tab ──────────────────────────────── */
function AgentCode() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>AGENT ARCHITECTURE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          The agent is built with a customer service architecture using LangChain's
          create_openai_functions_agent pattern.
        </div>
        <CodeBlock text={AGENT_CODE} accent={C.teal} />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>KEY COMPONENTS</div>
        <DataTable
          headers={["Component", "Detail"]}
          rows={AGENT_KEY_COMPONENTS.map((c) => [c.component, c.detail])}
          accent={C.lav}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>BEST PRACTICES</div>
        <div style={{ display: "grid", gap: 6 }}>
          {AGENT_BEST_PRACTICES.map((bp, i) => (
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
              {bp}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Knowledge Base sub-tab ──────────────────────────── */
function KnowledgeBase() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>ADVANCED TOOL IMPLEMENTATION</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Connect your agent to external APIs and services using a vector-based knowledge base
          with Chroma and OpenAI embeddings.
        </div>
        <CodeBlock text={KNOWLEDGE_BASE_CODE} accent={C.teal} />
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function BuildFirstAgentTab() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "agentcode", label: "Agent Code" },
    { id: "knowledgebase", label: "Knowledge Base" },
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
      {tab === "agentcode" && <AgentCode />}
      {tab === "knowledgebase" && <KnowledgeBase />}
    </div>
  );
}
