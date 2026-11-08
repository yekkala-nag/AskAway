import React, { useState, useMemo } from "react";
import {
  TRACK_OVERVIEW,
  PROMPT_STATS,
  CATEGORY_LABELS,
  PROMPTS,
  WEAK_STRONG_PAIRS,
  CONFIG_ROWS,
} from "./agenticPromptsContent.js";

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

/* ─── Small shared pieces ─────────────────────────────── */

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

function CopyBlock({ text, accent = C.teal }) {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(text).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  });
  return (
    <div
      style={{
        position: "relative",
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 14,
      }}
    >
      <button
        onClick={copy}
        aria-label="Copy prompt"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "4px 10px",
          borderRadius: 4,
          background: copied ? accent + "33" : accent + "22",
          border: `1px solid ${accent}`,
          color: accent,
          fontSize: 10,
          cursor: "pointer",
          fontWeight: 600,
          fontFamily: "inherit",
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre
        style={{
          margin: 0,
          whiteSpace: "pre-wrap",
          color: C.text,
          fontSize: 11.5,
          lineHeight: 1.65,
          ...mono,
        }}
      >
        {text}
      </pre>
    </div>
  );
}

const toolChip = (t) => {
  const map = { "claude-code": "CLI agent", codex: "Codex", cursor: "Cursor" };
  return map[t] || t;
};

/* ─── Overview sub-tab ────────────────────────────────── */
function Overview() {
  const cats = useMemo(() => {
    const counts = {};
    for (const p of PROMPTS) counts[p.category] = (counts[p.category] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <>
      <div style={sectionStyle}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>🗂️</span>
          <div>
            <div style={{ ...labelStyle(C.teal), marginBottom: 4 }}>
              PROMPT LIBRARY · {PROMPT_STATS.curated} CURATED FROM {PROMPT_STATS.total}
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>
              Agentic Coding Prompts
            </h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Ready-to-run prompts for AI coding agents, organized by task. Each entry gives you
          three layers: the <strong style={{ color: C.text }}>one-line query</strong> you can
          copy verbatim, the <strong style={{ color: C.text }}>reason it works</strong>, and a{" "}
          <strong style={{ color: C.text }}>fill-in template</strong> with
          <span style={{ color: C.gold, ...mono }}>&nbsp;&lt;angle-bracket slots&gt;</span> you
          adapt to your own codebase.
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <Callout color={C.lav} title="WHO IT IS FOR">
            {TRACK_OVERVIEW.audience}
          </Callout>
          <Callout color={C.teal} title="HOW THE THREE LAYERS STACK">
            One line is easy to remember. The “why” tells you when the shape matters. The
            template is what you use on the second-and-later runs of a real task. Copy a
            verbatim line today; grow into the templates as tasks get specific.
          </Callout>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>{PROMPT_STATS.curated} PROMPTS ACROSS {cats.length} TASK GROUPS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
          {cats.map(([cat, n]) => {
            const meta = CATEGORY_LABELS[cat] || { label: cat, color: C.teal, icon: "·", desc: "" };
            return (
              <div
                key={cat}
                style={{
                  padding: 14,
                  background: C.s2,
                  borderRadius: 8,
                  borderLeft: `3px solid ${meta.color}`,
                }}
              >
                <div style={{ color: meta.color, fontWeight: 700, fontSize: 12 }}>
                  {meta.icon} {meta.label} <span style={{ ...mono, fontSize: 10 }}>{n}</span>
                </div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
                  {meta.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── Browse sub-tab ──────────────────────────────────── */
function Browse() {
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [view, setView] = useState({}); // id -> "template" | "one-liner"

  const cats = useMemo(() => ["all", ...new Set(PROMPTS.map((p) => p.category))], []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PROMPTS.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        (!needle ||
          p.title.toLowerCase().includes(needle) ||
          p.prompt.toLowerCase().includes(needle) ||
          p.why.toLowerCase().includes(needle))
    );
  }, [cat, q]);

  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>BROWSE {PROMPTS.length} PROMPTS BY TASK</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search prompts…"
          aria-label="Search prompts"
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.s2,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "10px 14px",
            color: C.text,
            fontSize: 12,
            marginBottom: 12,
          }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {cats.map((c) => {
            const meta = CATEGORY_LABELS[c] || { label: c, color: C.teal };
            const active = c === cat;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                aria-pressed={active}
                style={{
                  padding: "5px 12px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 600,
                  background: active ? meta.color + "33" : C.s2,
                  border: `1px solid ${active ? meta.color : C.border}`,
                  color: active ? meta.color : C.muted,
                  fontFamily: "inherit",
                }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          {filtered.map((p) => {
            const meta = CATEGORY_LABELS[p.category] || { label: p.category, color: C.teal };
            const showTemplate = view[p.id] !== "oneliner";
            return (
              <div
                key={p.id}
                style={{ background: C.s2, borderRadius: 10, border: `1px solid ${C.border}`, padding: 16 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 10,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ color: meta.color, fontWeight: 700, fontSize: 13 }}>
                    {meta.icon} {p.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ ...mono, color: C.muted, fontSize: 10 }}>{meta.label}</span>
                    <span style={{ ...mono, color: C.gold, fontSize: 10 }}>
                      {p.tools.map(toolChip).join(" · ")}
                    </span>
                  </div>
                </div>

                <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.6, marginBottom: 10 }}>
                  <strong style={{ color: C.lav }}>Why it works:</strong> {p.why}
                </div>

                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <button
                    onClick={() => setView((v) => ({ ...v, [p.id]: "oneliner" }))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: 600,
                      background: !showTemplate ? C.teal + "33" : "transparent",
                      border: `1px solid ${!showTemplate ? C.teal : C.border}`,
                      color: !showTemplate ? C.teal : C.muted,
                      fontFamily: "inherit",
                    }}
                  >
                    One-liner
                  </button>
                  <button
                    onClick={() => setView((v) => ({ ...v, [p.id]: "template" }))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      cursor: "pointer",
                      fontSize: 10,
                      fontWeight: 600,
                      background: showTemplate ? C.gold + "33" : "transparent",
                      border: `1px solid ${showTemplate ? C.gold : C.border}`,
                      color: showTemplate ? C.gold : C.muted,
                      fontFamily: "inherit",
                    }}
                  >
                    Fill-in template
                  </button>
                </div>

                <CopyBlock
                  key={showTemplate ? p.id + "t" : p.id + "o"}
                  text={showTemplate ? p.template : p.prompt}
                  accent={showTemplate ? C.gold : C.teal}
                />
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ color: C.muted, fontSize: 12 }}>No prompts match that filter.</div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── Weak → Strong sub-tab ───────────────────────────── */
function WeakStrong() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>THE SAME TASK, ASKED TWICE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
          The single highest-leverage habit with coding agents: go from naming an outcome to
          handing over criteria the agent can check itself. Each pair below shows a weak ask
          and the strong version that gets the job done in one pass.
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          {WEAK_STRONG_PAIRS.map((pair, i) => (
            <div key={pair.id}>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
                {i + 1}. {pair.title}
              </div>
              <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.6, marginBottom: 10 }}>
                <strong style={{ color: C.lav }}>Why:</strong> {pair.why}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                <div style={{ padding: "10px 14px", background: C.coral + "11", borderRadius: 8 }}>
                  <div style={{ ...mono, color: C.coral, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>✗ WEAK</div>
                  <div style={{ ...mono, color: C.text, fontSize: 12 }}>{pair.weak}</div>
                </div>
                <div style={{ padding: "10px 14px", background: C.teal + "11", borderRadius: 8 }}>
                  <div style={{ ...mono, color: C.teal, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>✓ STRONG</div>
                  <div style={{ ...mono, color: C.text, fontSize: 12 }}>{pair.strong}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>PATTERN BEHIND THE PAIRS</div>
        <DataTable
          headers={["Move", "Weak ask", "Strong ask adds"]}
          rows={[
            ["Verification criteria", "Outcomes only", "Test cases, screenshots or a build check the agent runs itself"],
            ["Reproduction", "Error name", "The exact failing symptom plus the files to inspect"],
            ["Scope lock", "'fix the bug'", "A failing test first, then the fix — nothing else touched"],
            ["Reference pattern", "'add a widget'", "A named file to imitate and the constraint to use existing libraries only"],
          ]}
          accent={C.gold}
        />
      </div>
    </>
  );
}

/* ─── Config sub-tab ──────────────────────────────────── */
function Config() {
  return (
    <>
      <div style={sectionStyle}>
        <div style={labelStyle(C.teal)}>WHERE PERSISTENT INSTRUCTIONS LIVE</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Prompts fade; conventions stay. Every agent reads standing instructions from
          well-known files. Put your working agreements there once and stop re-typing them
          into every prompt.
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {CONFIG_ROWS.map((r, i) => (
            <div
              key={i}
              style={{ background: C.s2, borderRadius: 8, padding: 14, borderLeft: `3px solid ${C.lav}` }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ ...mono, color: C.lav, fontSize: 12, fontWeight: 700 }}>{r.file}</span>
                <span style={{ color: C.muted, fontSize: 11 }}>{r.scope}</span>
              </div>
              <pre
                style={{
                  margin: 0,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "10px 12px",
                  whiteSpace: "pre-wrap",
                  color: C.text,
                  fontSize: 11,
                  lineHeight: 1.6,
                  ...mono,
                }}
              >
                {r.example}
              </pre>
            </div>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.gold)}>CHOOSING THE RIGHT HOME FOR A RULE</div>
        <DataTable
          headers={["Rule type", "Where it belongs"]}
          rows={[
            ["How you work everywhere (deps, test runner)", "Global file: ~/.codex/AGENTS.md"],
            ["Repo conventions (linting, PR checks)", "Repo-root override file: AGENTS.md"],
            ["Subsystem-specific commands or safety", "Nested override in that service's directory"],
            ["Component/style conventions", "Auto-attached rule keyed by file globs"],
            ["Task-shaped conventions (RPC, migrations)", "Rule with a description the agent matches"],
            ["Automated follow-ups after each response", "A hook file (e.g. stop hook)"],
          ]}
          accent={C.gold}
        />
        <div style={{ marginTop: 12 }}>
          <Callout color={C.coral} title="WHAT DOES NOT BELONG IN ANY FILE">
            Secrets, credentials, or anything you would not paste into a public repository.
            Agents read these files wholesale — and send them as context.
          </Callout>
        </div>
      </div>
    </>
  );
}

/* ─── Main Export ─────────────────────────────────────── */
export default function AgenticCodingPromptsTab() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "browse", label: "Browse Prompts" },
    { id: "weakstrong", label: "Weak → Strong" },
    { id: "config", label: "Config Files" },
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
      {tab === "browse" && <Browse />}
      {tab === "weakstrong" && <WeakStrong />}
      {tab === "config" && <Config />}
    </div>
  );
}
