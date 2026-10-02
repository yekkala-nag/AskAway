import React, { useState, useEffect } from "react";
import { COLORS } from "./MCPTab.jsx";

const mono = "var(--ds-font-family-mono)";

const btn = (active) => ({
  background: active ? "var(--ds-color-module-agents-light)" : "var(--ds-color-bg-surface)",
  color: active ? "var(--ds-color-module-agents-dark)" : "var(--ds-color-text-secondary)",
  border: `1px solid ${active ? "var(--ds-color-module-agents-primary)" : "var(--ds-color-border-subtle)"}`,
  borderRadius: "var(--ds-radius-md)",
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: active ? 600 : 500,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all var(--ds-motion-duration-fast)",
});

export function JumpNav({ sections }) {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 20,
      display: "flex", gap: 6, overflowX: "auto",
      background: "var(--ds-color-bg-surface)",
      border: "1px solid var(--ds-color-border-subtle)",
      borderRadius: "var(--ds-radius-lg)",
      padding: "8px 10px",
      WebkitOverflowScrolling: "touch",
    }}>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          style={{
            ...btn(active === s.id),
            padding: "5px 10px",
            fontSize: 11,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}

export const COURSE_SECTIONS = [
  { id: "mcp-sec-1", label: "1 · What MCP Is" },
  { id: "mcp-sec-2", label: "2 · Architecture" },
  { id: "mcp-sec-3", label: "3 · Primitives" },
  { id: "mcp-sec-4", label: "4 · Protocol" },
  { id: "mcp-sec-5", label: "5 · Build a Server" },
  { id: "mcp-sec-6", label: "6 · Connect & Loop" },
  { id: "mcp-sec-7", label: "7 · Security" },
  { id: "mcp-sec-8", label: "8 · Production" },
  { id: "mcp-sec-9", label: "9 · Comparisons" },
  { id: "mcp-sec-10", label: "10 · Quiz" },
];

const FLOW = [
  { text: <>The host connects its client to a server and discovers its tools (<span style={{ fontFamily: mono, color: "var(--ds-color-text-link)" }}>tools/list</span>).</>, travel: true },
  { text: <>Tool names, descriptions and JSON schemas are placed in the model's context.</>, travel: true },
  { text: <>The user asks: "What is open in my issue tracker?"</>, travel: false },
  { text: <>The model replies with a tool call (for example <span style={{ fontFamily: mono, color: "var(--ds-color-text-link)" }}>list_issues</span>).</>, travel: false },
  { text: <>The host shows or auto-approves the call, then the client sends <span style={{ fontFamily: mono, color: "var(--ds-color-text-link)" }}>tools/call</span> to the server.</>, travel: true },
  { text: <>The server runs the work and returns content (text, JSON, images, links).</>, travel: true },
  { text: <>The host feeds the result back to the model, which writes the final answer.</>, travel: false },
];

const PATHS = {
  stdio: { out: "M174,232 C360,232 400,104 560,104", back: "M560,104 C400,104 360,232 174,232", start: [174, 232], end: [560, 104] },
  http: { out: "M336,234 C420,234 470,244 560,244", back: "M560,244 C470,244 420,234 336,234", start: [336, 234], end: [560, 244] },
};

export function ArchitectureSim({ onHover }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState("stdio");
  const [hover, setHover] = useState(null);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setStep((s) => {
        if (s >= FLOW.length) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [playing, step]);

  const play = () => {
    if (step >= FLOW.length) setStep(0);
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const reset = () => { setPlaying(false); setStep(0); };

  const active = step >= 1 && step <= FLOW.length;
  const travel = active && FLOW[step - 1].travel;
  const p = PATHS[mode];
  const [dx, dy] = step === 1 || step === 5 ? p.end : p.start;

  const setRole = (r) => { setHover(r); onHover?.(r); };

  const flashLLM = active && !travel;

  return (
    <div style={{ background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-color-module-agents-dark)" }}>LIVE TOPOLOGY</span>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <button style={btn(mode === "stdio")} onClick={() => setMode("stdio")}>stdio (local)</button>
          <button style={btn(mode === "http")} onClick={() => setMode("http")}>Streamable HTTP</button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {!playing && <button style={btn(step > 0 && step < FLOW.length)} onClick={play}>{step > 0 && step < FLOW.length ? "Resume" : "▶ Run request"}</button>}
          {playing && <button style={btn(true)} onClick={pause}>❚❚ Pause</button>}
          <button style={btn(false)} onClick={reset}>↺ Reset</button>
        </div>
      </div>

      <svg viewBox="0 0 840 330" style={{ width: "100%", height: "auto", display: "block" }}>
        <rect x="16" y="36" width="360" height="264" rx="14"
          style={{ fill: "var(--ds-color-bg-canvas)", stroke: hover === "host" ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-border-default)", strokeWidth: hover === "host" ? 2 : 1 }}
          onMouseEnter={() => setRole("host")} onMouseLeave={() => setRole(null)} />
        <text x="30" y="26" style={{ fill: "var(--ds-color-text-tertiary)", fontSize: 11, fontFamily: mono, fontWeight: 700, letterSpacing: "0.08em" }}>HOST — AskAway (chat app / IDE / agent)</text>

        <rect x="44" y="72" width="130" height="46" rx="9"
          style={{ fill: flashLLM ? "var(--ds-color-module-agents-light)" : "var(--ds-color-bg-surface)", stroke: flashLLM ? "var(--ds-color-module-agents-primary)" : "var(--ds-color-border-default)", transition: "fill 400ms, stroke 400ms" }} />
        <text x="109" y="100" textAnchor="middle" style={{ fill: "var(--ds-color-text-primary)", fontSize: 13, fontWeight: 600 }}>LLM</text>

        <rect x="196" y="72" width="156" height="46" rx="9"
          style={{ fill: flashLLM ? "var(--ds-color-module-agents-light)" : "var(--ds-color-bg-surface)", stroke: flashLLM ? "var(--ds-color-module-agents-primary)" : "var(--ds-color-border-default)", transition: "fill 400ms, stroke 400ms" }} />
        <text x="274" y="100" textAnchor="middle" style={{ fill: "var(--ds-color-text-primary)", fontSize: 13, fontWeight: 600 }}>Agent loop</text>

        <rect x="44" y="212" width="130" height="40" rx="9"
          style={{ fill: "var(--ds-color-bg-surface)", stroke: hover === "client" ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-border-default)", strokeWidth: hover === "client" ? 2 : 1 }}
          onMouseEnter={() => setRole("client")} onMouseLeave={() => setRole(null)} />
        <text x="109" y="237" textAnchor="middle" style={{ fill: "var(--ds-color-text-primary)", fontSize: 12, fontWeight: 600 }}>Client 1</text>

        <rect x="196" y="212" width="156" height="40" rx="9"
          style={{ fill: "var(--ds-color-bg-surface)", stroke: hover === "client" ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-border-default)", strokeWidth: hover === "client" ? 2 : 1 }}
          onMouseEnter={() => setRole("client")} onMouseLeave={() => setRole(null)} />
        <text x="274" y="237" textAnchor="middle" style={{ fill: "var(--ds-color-text-primary)", fontSize: 12, fontWeight: 600 }}>Client 2</text>

        <path d="M109,118 L109,212" style={{ stroke: "var(--ds-color-border-default)", strokeWidth: 1.5, fill: "none" }} />
        <path d="M274,118 L274,212" style={{ stroke: "var(--ds-color-border-default)", strokeWidth: 1.5, fill: "none" }} />

        <path d={PATHS.stdio.out} style={{ stroke: "var(--ds-color-module-foundations-primary)", strokeWidth: 2, fill: "none", opacity: mode === "stdio" ? 1 : 0.15, transition: "opacity 300ms" }} />
        <path d={PATHS.http.out} style={{ stroke: "var(--ds-color-module-context-primary)", strokeWidth: 2, fill: "none", opacity: mode === "http" ? 1 : 0.15, transition: "opacity 300ms" }} />
        <path d="M336,268 C440,300 500,306 620,306" style={{ stroke: "var(--ds-color-text-tertiary)", strokeWidth: 1.5, fill: "none", strokeDasharray: "5 5", opacity: 0.5 }} />
        <text x="470" y="322" textAnchor="middle" style={{ fill: "var(--ds-color-text-tertiary)", fontSize: 10, textDecoration: "line-through" }}>HTTP + SSE — deprecated</text>

        <rect x="560" y="56" width="250" height="96" rx="12"
          style={{ fill: "var(--ds-color-bg-surface)", stroke: hover === "server" ? "var(--ds-color-module-foundations-primary)" : (mode === "stdio" ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-border-default)"), strokeWidth: mode === "stdio" || hover === "server" ? 2 : 1, opacity: mode === "stdio" ? 1 : 0.45, transition: "opacity 300ms" }}
          onMouseEnter={() => setRole("server")} onMouseLeave={() => setRole(null)} />
        <text x="580" y="88" style={{ fill: "var(--ds-color-text-primary)", fontSize: 14, fontWeight: 700 }}>Server A</text>
        <text x="580" y="110" style={{ fill: "var(--ds-color-text-secondary)", fontSize: 11 }}>Local · stdio · subprocess</text>
        <text x="580" y="130" style={{ fill: "var(--ds-color-text-tertiary)", fontSize: 10, fontFamily: mono }}>files · dev tools · personal data</text>

        <rect x="560" y="196" width="250" height="96" rx="12"
          style={{ fill: "var(--ds-color-bg-surface)", stroke: hover === "server" ? "var(--ds-color-module-context-primary)" : (mode === "http" ? "var(--ds-color-module-context-primary)" : "var(--ds-color-border-default)"), strokeWidth: mode === "http" || hover === "server" ? 2 : 1, opacity: mode === "http" ? 1 : 0.45, transition: "opacity 300ms" }}
          onMouseEnter={() => setRole("server")} onMouseLeave={() => setRole(null)} />
        <text x="580" y="228" style={{ fill: "var(--ds-color-text-primary)", fontSize: 14, fontWeight: 700 }}>Server B</text>
        <text x="580" y="250" style={{ fill: "var(--ds-color-text-secondary)", fontSize: 11 }}>Remote · Streamable HTTP · OAuth</text>
        <text x="580" y="270" style={{ fill: "var(--ds-color-text-tertiary)", fontSize: 10, fontFamily: mono }}>SaaS · team services</text>

        <text x={mode === "stdio" ? 380 : 450} y={mode === "stdio" ? 140 : 214}
          style={{ fill: mode === "stdio" ? "var(--ds-color-module-foundations-dark)" : "var(--ds-color-module-context-dark)", fontSize: 10, fontFamily: mono, fontWeight: 700 }}>
          {mode === "stdio" ? "stdio" : "streamable http"}
        </text>

        <circle cx="0" cy="0" r="7" style={{
          fill: "var(--ds-color-module-agents-primary)",
          stroke: "var(--ds-color-bg-surface)",
          strokeWidth: 2,
          transform: `translate(${dx}px, ${dy}px)`,
          opacity: travel ? 1 : 0,
          transition: "transform 700ms ease-in-out, opacity 300ms",
        }} />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
        <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-color-module-agents-dark)", marginBottom: 2 }}>
          ONE REQUEST, END TO END
        </div>
        {FLOW.map((f, i) => {
          const n = i + 1;
          const on = step === n;
          const done = step > n;
          return (
            <button
              key={i}
              onClick={() => { setPlaying(false); setStep(n); }}
              style={{
                display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left",
                background: on ? "var(--ds-color-module-agents-light)" : "transparent",
                border: `1px solid ${on ? "var(--ds-color-module-agents-primary)" : "transparent"}`,
                borderRadius: "var(--ds-radius-md)",
                padding: "7px 10px", cursor: "pointer", fontFamily: "inherit",
                transition: "all var(--ds-motion-duration-fast)",
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 10, color: done ? "var(--ds-color-state-success-light)" : on ? "var(--ds-color-module-agents-dark)" : "var(--ds-color-text-tertiary)", minWidth: 14, paddingTop: 3 }}>
                {done ? "✓" : n}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.6, color: on ? "var(--ds-color-text-primary)" : "var(--ds-color-text-secondary)" }}>
                {f.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function NmCalculator() {
  const [apps, setApps] = useState(5);
  const [tools, setTools] = useState(8);
  const [withMcp, setWithMcp] = useState(false);

  const connectors = apps * tools;
  const impl = apps + tools;
  const W = 760, H = 250;
  const yOf = (i, n) => 30 + (i * (H - 60)) / Math.max(n - 1, 1);

  const appY = Array.from({ length: apps }, (_, i) => yOf(i, apps));
  const toolY = Array.from({ length: tools }, (_, i) => yOf(i, tools));

  return (
    <div style={{ background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "var(--ds-color-text-tertiary)" }}>Apps</label>
          <input type="range" min="2" max="10" value={apps} onChange={(e) => setApps(+e.target.value)} style={{ accentColor: "var(--ds-color-module-agents-primary)", width: 110 }} />
          <span style={{ fontFamily: mono, fontSize: 12, color: "var(--ds-color-text-primary)", minWidth: 16 }}>{apps}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "var(--ds-color-text-tertiary)" }}>Tools</label>
          <input type="range" min="2" max="12" value={tools} onChange={(e) => setTools(+e.target.value)} style={{ accentColor: "var(--ds-color-module-agents-primary)", width: 110 }} />
          <span style={{ fontFamily: mono, fontSize: 12, color: "var(--ds-color-text-primary)", minWidth: 16 }}>{tools}</span>
        </div>
        <button style={{ ...btn(withMcp), marginLeft: "auto" }} onClick={() => setWithMcp(!withMcp)}>
          {withMcp ? "✓ With MCP" : "Before MCP"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, background: withMcp ? "var(--ds-color-bg-canvas)" : "var(--ds-color-module-agents-light)", border: `1px solid ${withMcp ? "var(--ds-color-border-subtle)" : "var(--ds-color-module-agents-primary)"}`, borderRadius: "var(--ds-radius-md)", padding: "10px 14px", opacity: withMcp ? 0.55 : 1, transition: "all 300ms" }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", letterSpacing: "0.08em" }}>BEFORE MCP</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: withMcp ? "var(--ds-color-text-secondary)" : "var(--ds-color-module-agents-dark)" }}>{connectors} custom connectors</div>
          <div style={{ fontSize: 11, color: "var(--ds-color-text-tertiary)" }}>N × M bespoke integrations</div>
        </div>
        <div style={{ flex: 1, background: withMcp ? "var(--ds-color-module-foundations-light)" : "var(--ds-color-bg-canvas)", border: `1px solid ${withMcp ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-border-subtle)"}`, borderRadius: "var(--ds-radius-md)", padding: "10px 14px", opacity: withMcp ? 1 : 0.55, transition: "all 300ms" }}>
          <div style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", letterSpacing: "0.08em" }}>WITH MCP</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: withMcp ? "var(--ds-color-module-foundations-dark)" : "var(--ds-color-text-secondary)" }}>{impl} implementations</div>
          <div style={{ fontSize: 11, color: "var(--ds-color-text-tertiary)" }}>N clients + M servers</div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {!withMcp && appY.map((y, i) => toolY.map((ty, j) => (
          <line key={`${i}-${j}`} x1="90" y1={y} x2={W - 90} y2={ty}
            style={{ stroke: "var(--ds-color-module-agents-primary)", strokeWidth: 1, opacity: 0.35 }} />
        )))}
        {withMcp && (
          <>
            <line x1={W / 2} y1="20" x2={W / 2} y2={H - 20}
              style={{ stroke: "var(--ds-color-module-foundations-primary)", strokeWidth: 3 }} />
            {appY.map((y, i) => (
              <line key={`a${i}`} x1="90" y1={y} x2={W / 2} y2={y}
                style={{ stroke: "var(--ds-color-module-foundations-primary)", strokeWidth: 1.5 }} />
            ))}
            {toolY.map((ty, j) => (
              <line key={`t${j}`} x1={W / 2} y1={ty} x2={W - 90} y2={ty}
                style={{ stroke: "var(--ds-color-module-foundations-primary)", strokeWidth: 1.5 }} />
            ))}
            <rect x={W / 2 - 34} y={H / 2 - 14} width="68" height="28" rx="14"
              style={{ fill: "var(--ds-color-module-foundations-primary)" }} />
            <text x={W / 2} y={H / 2 + 5} textAnchor="middle"
              style={{ fill: "#fff", fontSize: 12, fontWeight: 700, fontFamily: mono }}>MCP</text>
          </>
        )}
        {appY.map((y, i) => (
          <g key={`app${i}`}>
            <circle cx="80" cy={y} r="8" style={{ fill: withMcp ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-module-agents-primary)" }} />
            <text x="66" y={y + 4} textAnchor="end" style={{ fill: "var(--ds-color-text-secondary)", fontSize: 11 }}>App</text>
          </g>
        ))}
        {toolY.map((ty, j) => (
          <g key={`tool${j}`}>
            <circle cx={W - 80} cy={ty} r="8" style={{ fill: withMcp ? "var(--ds-color-module-foundations-primary)" : "var(--ds-color-module-agents-primary)" }} />
            <text x={W - 66} y={ty + 4} style={{ fill: "var(--ds-color-text-secondary)", fontSize: 11 }}>Tool</text>
          </g>
        ))}
      </svg>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--ds-color-text-secondary)", lineHeight: 1.6 }}>
        {withMcp
          ? `Each app implements the client side once and each tool the server side once: ${apps} + ${tools} = ${impl} implementations. Everyone agrees on one protocol — message format, discovery, and invocation.`
          : `Every app needs custom code for every tool: ${apps} × ${tools} = ${connectors} connectors, each with its own auth, schema and error handling. Toggle to "With MCP" to see the cost collapse.`}
      </div>
    </div>
  );
}

const WALK = [
  {
    title: "initialize",
    dir: "c→s",
    req: `{ "jsonrpc": "2.0", "id": 1, "method": "initialize",
  "params": { "protocolVersion": "2025-11-25",
    "capabilities": { "roots": {}, "sampling": {} },
    "clientInfo": { "name": "AskAway", "version": "1.0.0" } } }`,
    res: `{ "jsonrpc": "2.0", "id": 1,
  "result": { "protocolVersion": "2025-11-25",
    "capabilities": { "tools": {}, "resources": {} },
    "serverInfo": { "name": "notes", "version": "0.1.0" } } }`,
  },
  {
    title: "tools/list",
    dir: "c→s",
    req: `{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }`,
    res: `{ "jsonrpc": "2.0", "id": 2,
  "result": { "tools": [
    { "name": "add_note", "description": "Save a note." },
    { "name": "search_notes", "description": "Search notes by keyword." } ] } }`,
  },
  {
    title: "tools/call",
    dir: "c→s",
    req: `{ "jsonrpc": "2.0", "id": 7, "method": "tools/call",
  "params": { "name": "search_notes", "arguments": { "query": "mcp" } } }`,
    res: `{ "jsonrpc": "2.0", "id": 7,
  "result": { "content": [ { "type": "text",
    "text": "2 matches: mcp-notes, mcp-quiz" } ] } }`,
  },
  {
    title: "notifications/progress",
    dir: "s→c",
    req: `{ "jsonrpc": "2.0", "method": "notifications/progress",
  "params": { "progressToken": 7, "progress": 3, "total": 10 } }`,
    res: `// one-way notification — no response, no id`,
  },
  {
    title: "sampling/createMessage",
    dir: "s→c",
    req: `{ "jsonrpc": "2.0", "id": 9, "method": "sampling/createMessage",
  "params": { "messages": [ { "role": "user",
    "content": { "type": "text", "text": "Summarize the log" } } ],
    "maxTokens": 200 } }`,
    res: `{ "jsonrpc": "2.0", "id": 9,
  "result": { "role": "assistant",
    "content": { "type": "text", "text": "3 errors, all in…" },
    "model": "host-llm" } }`,
  },
];

export function ProtocolWalk() {
  const [i, setI] = useState(0);
  const step = WALK[i];

  return (
    <div style={{ background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-color-module-agents-dark)" }}>PROTOCOL WALKTHROUGH</span>
        <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
          <button style={btn(false)} disabled={i === 0} onClick={() => setI(Math.max(0, i - 1))}>← Prev</button>
          <button style={btn(false)} disabled={i === WALK.length - 1} onClick={() => setI(Math.min(WALK.length - 1, i + 1))}>Next →</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {WALK.map((w, j) => (
            <button key={w.title} onClick={() => setI(j)} style={{
              ...btn(i === j), textAlign: "left", display: "flex", gap: 8, alignItems: "center",
            }}>
              <span style={{ fontFamily: mono, fontSize: 10, color: i === j ? "var(--ds-color-module-agents-dark)" : "var(--ds-color-text-tertiary)" }}>
                {w.dir === "c→s" ? "→" : "←"}
              </span>
              <span style={{ fontFamily: mono, fontSize: 11 }}>{w.title}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", marginBottom: 4, letterSpacing: "0.06em" }}>
              {step.dir === "c→s" ? "CLIENT → SERVER" : "SERVER → CLIENT"} · REQUEST
            </div>
            <pre style={{ margin: 0, background: "var(--ds-color-brand-editor)", color: "#E7E5E4", padding: "12px 14px", borderRadius: "var(--ds-radius-md)", fontFamily: mono, fontSize: 11.5, lineHeight: 1.6, overflowX: "auto" }}>
              {step.req}
            </pre>
          </div>
          <div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", marginBottom: 4, letterSpacing: "0.06em" }}>
              RESPONSE
            </div>
            <pre style={{ margin: 0, background: "var(--ds-color-brand-editor)", color: "#B7E3DB", padding: "12px 14px", borderRadius: "var(--ds-radius-md)", fontFamily: mono, fontSize: 11.5, lineHeight: 1.6, overflowX: "auto" }}>
              {step.res}
            </pre>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: "var(--ds-color-text-secondary)" }}>
        Step {i + 1} of {WALK.length} — {step.dir === "c→s" ? "client-initiated request" : "server-initiated or one-way message"}.
      </div>
    </div>
  );
}

const MATCH_ITEMS = [
  { name: "Tool", hint: "create_issue, run_query", answer: "The model" },
  { name: "Resource", hint: "file://, notes://, a schema", answer: "The application" },
  { name: "Prompt", hint: "/summarize-pr template", answer: "The user" },
];
const MATCH_OPTIONS = ["The model", "The application", "The user"];

export function PrimitivesMatcher() {
  const [state, setState] = useState({});
  const [wrong, setWrong] = useState(null);

  const pick = (name, option) => {
    const item = MATCH_ITEMS.find((m) => m.name === name);
    if (option === item.answer) {
      setState((s) => ({ ...s, [name]: option }));
    } else {
      setWrong(name);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const done = MATCH_ITEMS.every((m) => state[m.name]);

  return (
    <div style={{ background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-color-module-agents-dark)" }}>WHO CONTROLS WHAT? — MATCH IT</span>
        {done && <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ds-color-state-success-light)" }}>✓ 3/3 — primitives locked in</span>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {MATCH_ITEMS.map((m) => {
          const ok = state[m.name];
          return (
            <div key={m.name} style={{
              border: `1px solid ${ok ? "var(--ds-color-state-success-light)" : wrong === m.name ? "var(--ds-color-state-error-light)" : "var(--ds-color-border-subtle)"}`,
              borderRadius: "var(--ds-radius-md)",
              padding: 14,
              background: ok ? "rgba(5,150,105,0.06)" : "var(--ds-color-bg-canvas)",
              transition: "all 200ms",
            }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ds-color-text-primary)" }}>{m.name}</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", margin: "4px 0 10px" }}>{m.hint}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {MATCH_OPTIONS.map((o) => (
                  <button key={o} disabled={!!ok} onClick={() => pick(m.name, o)} style={{
                    ...btn(ok === o),
                    borderColor: ok === o ? "var(--ds-color-state-success-light)" : undefined,
                    background: ok === o ? "rgba(5,150,105,0.10)" : undefined,
                    color: ok === o ? "var(--ds-color-state-success-light)" : undefined,
                    opacity: ok && ok !== o ? 0.4 : 1,
                    textAlign: "left",
                    fontSize: 12,
                  }}>
                    {ok === o ? "✓ " : ""}{o}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProductionChecklist() {
  const ITEMS = [
    "Least-privilege credentials per server",
    "Approval flow for destructive tools",
    "Tracing and audit logging enabled",
    "Rate limits and timeouts set",
    "Pinned versions and a rollback plan",
    "Tool descriptions reviewed and covered by evals",
  ];
  const [checked, setChecked] = useState(ITEMS.map(() => false));
  const done = checked.filter(Boolean).length;
  const pct = Math.round((done / ITEMS.length) * 100);

  return (
    <div style={{ background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)", borderRadius: "var(--ds-radius-lg)", padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 8, background: "var(--ds-color-bg-surfaceHover)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "var(--ds-color-state-success-light)" : "var(--ds-color-module-agents-primary)", transition: "width 300ms" }} />
        </div>
        <span style={{ fontFamily: mono, fontSize: 11, color: pct === 100 ? "var(--ds-color-state-success-light)" : "var(--ds-color-text-secondary)", whiteSpace: "nowrap" }}>
          {done}/{ITEMS.length} {pct === 100 ? "— production ready ✓" : `— ${pct}%`}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ITEMS.map((t, i) => (
          <label key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 13, lineHeight: 1.6 }}>
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              style={{ marginTop: 3, accentColor: "var(--ds-color-module-agents-primary)", width: 15, height: 15, cursor: "pointer" }}
            />
            <span style={{ color: checked[i] ? "var(--ds-color-text-tertiary)" : "var(--ds-color-text-secondary)", textDecoration: checked[i] ? "line-through" : "none" }}>
              {t}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

const QUIZ = [
  { q: "What problem does MCP solve, and how does it change N × M into N + M?", a: "Apps and tools no longer need pairwise connectors; each app implements the client once and each tool the server once." },
  { q: "Name the three roles in an MCP system and say which one runs the LLM.", a: "Host (runs the LLM and UI), client (one per server connection), server. The host runs the LLM." },
  { q: "Match each to its controller: tools, resources, prompts (model, application, user).", a: "Tools: model. Resources: application. Prompts: user." },
  { q: "Why must stdio servers write logs to stderr?", a: "stdout carries the protocol messages, so extra text corrupts them." },
  { q: "Which transport is deprecated, and which two are current?", a: "HTTP + SSE is deprecated; stdio and Streamable HTTP are current." },
  { q: "Give two attacks that exploit MCP tool descriptions or results, and one mitigation for each.", a: "Prompt injection via results (confirm sensitive actions, treat results as data) and tool poisoning (vet servers, review descriptions, pin versions)." },
  { q: "What did the 2026-07-28 revision change about sessions and tracing?", a: "Protocol-level sessions and Mcp-Session-Id were removed, with version and capabilities carried in each request's _meta; OpenTelemetry trace context conventions were documented for _meta." },
];

export function CourseQuiz() {
  const [revealed, setRevealed] = useState({});
  const [marks, setMarks] = useState({});
  const known = Object.values(marks).filter((m) => m === "knew").length;
  const answered = Object.keys(marks).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--ds-color-module-agents-light)", border: "1px solid var(--ds-color-module-agents-primary)", borderRadius: "var(--ds-radius-lg)", padding: "10px 14px" }}>
        <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ds-color-module-agents-dark)" }}>SELF-SCORED QUIZ</span>
        <span style={{ fontSize: 12, color: "var(--ds-color-text-secondary)" }}>
          {answered === 0 ? "Reveal each answer, then mark whether you knew it." : `You knew ${known} of ${answered} answered${answered === QUIZ.length ? ` · ${QUIZ.length} total` : ""}`}
        </span>
      </div>

      {QUIZ.map((item, i) => {
        const open = !!revealed[i];
        const mark = marks[i];
        return (
          <div key={i} style={{
            background: "var(--ds-color-bg-surface)",
            border: `1px solid ${mark === "knew" ? "var(--ds-color-state-success-light)" : mark === "missed" ? "var(--ds-color-state-error-light)" : "var(--ds-color-border-subtle)"}`,
            borderRadius: "var(--ds-radius-md)",
            padding: 14,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: mono, fontSize: 10, color: "var(--ds-color-text-tertiary)", paddingTop: 3 }}>{i + 1}.</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ds-color-text-primary)" }}>{item.q}</div>
                {open && (
                  <div style={{ marginTop: 8, padding: "8px 12px", background: "var(--ds-color-bg-canvas)", borderLeft: "3px solid var(--ds-color-module-foundations-primary)", borderRadius: 4, fontSize: 13, lineHeight: 1.65, color: "var(--ds-color-text-secondary)" }}>
                    {item.a}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button style={btn(false)} onClick={() => setRevealed((r) => ({ ...r, [i]: !r[i] }))}>
                    {open ? "Hide answer" : "Reveal answer"}
                  </button>
                  {open && (
                    <>
                      <button style={{
                        ...btn(mark === "knew"),
                        borderColor: mark === "knew" ? "var(--ds-color-state-success-light)" : undefined,
                        color: mark === "knew" ? "var(--ds-color-state-success-light)" : undefined,
                        background: mark === "knew" ? "rgba(5,150,105,0.10)" : undefined,
                      }} onClick={() => setMarks((m) => ({ ...m, [i]: m[i] === "knew" ? undefined : "knew" }))}>
                        I knew it
                      </button>
                      <button style={{
                        ...btn(mark === "missed"),
                        borderColor: mark === "missed" ? "var(--ds-color-state-error-light)" : undefined,
                        color: mark === "missed" ? "var(--ds-color-state-error-light)" : undefined,
                        background: mark === "missed" ? "rgba(220,38,38,0.08)" : undefined,
                      }} onClick={() => setMarks((m) => ({ ...m, [i]: m[i] === "missed" ? undefined : "missed" }))}>
                        I missed it
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
