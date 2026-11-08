import React, { useState } from "react";
import {
  TRACK_OVERVIEW,
  COORDINATION_STACK,
  BV_PATTERNS,
  BV_COMMANDS,
  AGENT_MAIL_RULES,
  AGENTS_MD_RULES,
  BLOCKED_COMMANDS,
  DCG_ORIGIN,
  FUNGIBILITY,
  POST_COMPACTION_RESET,
} from "./swarmCoordContent.js";

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

function PromptBlock({ text, accent = C.teal }) {
  return (
    <div
      style={{
        background: C.s2,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
        whiteSpace: "pre-wrap",
        color: C.text,
        fontSize: 11.5,
        lineHeight: 1.65,
        ...mono,
      }}
    >
      {text}
    </div>
  );
}

/* ─── Coordination Stack sub-tab ──────────────────────── */
function CoordinationStack() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>THE THREE INTERLOCKING TOOLS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Each tool is essential but insufficient alone. The fastest way to implement is to
          start up a big swarm of agents that coordinate using three interlocking tools.
        </div>
        <DataTable
          headers={["Tool", "Role", "Why It's Necessary"]}
          rows={COORDINATION_STACK.map((c) => [c.tool, c.role, c.why])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>AGENT MAIL: WHY NAIVE COORDINATION FAILS</div>
        <DataTable
          headers={["Aspect", "Detail"]}
          rows={AGENT_MAIL_RULES.map((r) => [r.rule, r.detail])}
          accent={C.lav}
        />
      </div>
    </>
  );
}

/* ─── bv Graph Theory sub-tab ────────────────────────── */
function BvGraphTheory() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>BV: THE GRAPH-THEORY COMPASS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          bv precomputes dependency metrics (PageRank, betweenness, HITS, eigenvector,
          critical path, cycle detection) so agents get deterministic, dependency-aware output.
          When multiple agents each independently query bv for priority, you get emergent
          coordination.
        </div>
        <DataTable
          headers={["Pattern", "Meaning", "Action"]}
          rows={BV_PATTERNS.map((p) => [p.pattern, p.meaning, p.action])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>BV CLI COMMANDS</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
          Use ONLY robot flags. Bare bv launches an interactive TUI that blocks your session.
        </div>
        <DataTable
          headers={["Command", "Description"]}
          rows={BV_COMMANDS.map((c) => [c.cmd, c.desc])}
          accent={C.lav}
        />
      </div>
    </>
  );
}

/* ─── AGENTS.md sub-tab ──────────────────────────────── */
function AgentsMd() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>AGENTS.MD: THE OPERATING MANUAL</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          The AGENTS.md file is the single most critical piece of infrastructure for agent
          coordination. It tells every agent how to behave, what tools exist, what safety
          constraints matter, and what "doing a good job" means in this repo.
        </div>
        <DataTable
          headers={["Rule", "Detail"]}
          rows={AGENTS_MD_RULES.map((r) => [r.rule, r.detail])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>POST-COMPACTION RESET</div>
        <PromptBlock text={POST_COMPACTION_RESET} accent={C.lav} />
      </div>
    </>
  );
}

/* ─── Git Model sub-tab ──────────────────────────────── */
function GitModel() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>SINGLE-BRANCH GIT MODEL</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          All agents commit directly to main. Branch-per-agent creates merge hell with 10+
          agents making frequent commits. Instead of branch isolation, three complementary
          mechanisms prevent conflicts: file reservations, a pre-commit guard, and a
          Destructive Command Guard (DCG).
        </div>
        <DataTable
          headers={["Blocked Command", "Safe Alternative", "Why"]}
          rows={BLOCKED_COMMANDS.map((b) => [b.blocked, b.safe, b.why])}
          accent={C.teal}
        />
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>DCG ORIGIN STORY</div>
        <Callout color={C.coral}>
          {DCG_ORIGIN}
        </Callout>
      </div>
    </>
  );
}

/* ─── Fungibility sub-tab ─────────────────────────────── */
function Fungibility() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>AGENT FUNGIBILITY</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Every agent is a generalist. No role specialization. All agents read the same
          AGENTS.md and can pick up any bead. This is deliberately opposed to "specialist
          agent" architectures where one agent has a special role.
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {FUNGIBILITY.map((f, i) => (
            <div
              key={i}
              style={{
                padding: "10px 14px",
                background: C.s2,
                borderRadius: 8,
                borderLeft: `3px solid ${C.teal}`,
                color: C.text,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function SwarmCoordTab() {
  const [tab, setTab] = useState("coord");

  const tabs = [
    { id: "coord", label: "Coordination Stack" },
    { id: "bv", label: "bv Graph Theory" },
    { id: "agentsmd", label: "AGENTS.md" },
    { id: "git", label: "Git Model" },
    { id: "fungible", label: "Fungibility" },
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

      {tab === "coord" && <CoordinationStack />}
      {tab === "bv" && <BvGraphTheory />}
      {tab === "agentsmd" && <AgentsMd />}
      {tab === "git" && <GitModel />}
      {tab === "fungible" && <Fungibility />}
    </div>
  );
}
