import React, { useState, useMemo } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { TAB_OVERVIEW, PROJECTS } from "./agentsContent.js";
import {
  C,
  mono,
  Section,
  Callout,
  DataTable,
  StackRow,
  ProjectCard,
  ProgressBar,
  useProgress,
  TabShell,
} from "./projectKit.jsx";

const ACCENT = C.lav;
const allStepIds = PROJECTS.flatMap((p) => p.steps.map((_, i) => `${p.id}-${i}`));

/* ── Interactive: agent run budget ─────────────────────────────────────── */
function BudgetCalculator() {
  const [agents, setAgents] = useState(3);
  const [calls, setCalls] = useState(4);
  const [tokens, setTokens] = useState(1200);
  const [price, setPrice] = useState(0.5);
  const [tps, setTps] = useState(20);

  const r = useMemo(() => {
    const totalCalls = agents * calls;
    const totalTokens = totalCalls * tokens;
    const cost = (totalTokens / 1e6) * price;
    const seconds = totalTokens / Math.max(tps, 1);
    return { totalCalls, totalTokens, cost, seconds };
  }, [agents, calls, tokens, price, tps]);

  const slider = (label, value, setValue, min, max, step, suffix) => (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...mono, fontSize: 10, color: C.muted }}>{label}</span>
        <span style={{ ...mono, fontSize: 11, color: ACCENT }}>
          {value}
          {suffix || ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: "100%", accentColor: ACCENT }}
      />
    </label>
  );

  return (
    <Section label="INTERACTIVE · RUN BUDGET" color={ACCENT}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        A crew of <em>n</em> agents is not one call — it is agents × calls per agent, each
        paying the full prompt again. Drag until the wall-clock number stops feeling free.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          {slider("Agents in the crew", agents, setAgents, 1, 8, 1)}
          {slider("LLM calls per agent", calls, setCalls, 1, 10, 1)}
          {slider("Prompt + output tokens per call", tokens, setTokens, 200, 4000, 100)}
        </div>
        <div>
          {slider("Price per 1M tokens ($)", price, setPrice, 0, 15, 0.25)}
          {slider("Local throughput (tok/s)", tps, setTps, 3, 80, 1)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {[
          ["Calls", r.totalCalls.toLocaleString()],
          ["Tokens", r.totalTokens.toLocaleString()],
          ["Cost", `$${r.cost.toFixed(3)}`],
          ["Wall clock", `${Math.round(r.seconds)} s`],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              background: C.s2,
              borderRadius: 8,
              padding: 12,
              borderLeft: `3px solid ${ACCENT}`,
            }}
          >
            <div style={{ ...mono, color: ACCENT, fontSize: 17, fontWeight: 700 }}>{v}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <Callout
          color={r.seconds > 300 ? C.coral : C.green}
          title={r.seconds > 300 ? "Over five minutes per run" : "Interactive-feeling run"}
        >
          At {tps} tok/s a {r.totalTokens.toLocaleString()}-token run takes about{" "}
          {Math.round(r.seconds)} seconds of pure generation. Retrieval, search calls and tool
          round-trips add more on top — that is why the demos keep the crew to two or three.
        </Callout>
      </div>
    </Section>
  );
}

function Overview() {
  return (
    <>
      <Section label="WHAT THIS TRACK IS" color={ACCENT}>
        <p style={{ marginTop: 0, color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          {TAB_OVERVIEW.subtitle}
        </p>
        <div style={{ marginBottom: 14 }}>
          <DiagramImage
            moduleId="agents_frameworks"
            src="/assets/proj_agent_loop.svg"
            alt="Agent graph: shared state flowing through researcher and writer nodes, versus a sequential crew"
            title="Shared State vs Sequential Crew"
            caption="LangGraph routes through typed state; CrewAI routes through roles and task dependencies. Both are bounds on autonomy."
            background="#090d16"
            maxWidth={1100}
          />
        </div>
        <div style={{ display: "grid", gap: 6, marginBottom: 14 }}>
          {TAB_OVERVIEW.outcomes.map((o) => (
            <div key={o} style={{ color: C.text, fontSize: 12, paddingLeft: 12 }}>
              • {o}
            </div>
          ))}
        </div>
        <div style={{ color: C.muted, fontSize: 12 }}>
          <strong style={{ color: C.lav }}>Audience:</strong> {TAB_OVERVIEW.audience}
        </div>
      </Section>

      <Section label="PROJECTS IN THIS TRACK" color={ACCENT}>
        <DataTable
          headers={["#", "Project", "Steps", "Core stack"]}
          rows={PROJECTS.map((p) => [p.n, p.title, p.steps.length, p.stack.join(" · ")])}
          accent={ACCENT}
        />
      </Section>

      <Section label="WHERE THESE BREAK" color={C.coral}>
        <Callout color={C.coral} title="Autonomy needs a stop condition">
          Every project here is bounded: a fixed graph edge, a fixed pipeline stage, a fixed
          task list. Add a loop and you must add a cap, a stall check and an approval gate for
          irreversible actions — otherwise a retry becomes a bill.
        </Callout>
      </Section>
    </>
  );
}

function Projects({ progress }) {
  return (
    <>
      <Section label="PROGRESS" color={ACCENT}>
        <ProgressBar complete={progress.complete} total={progress.total} accent={ACCENT} />
        <div style={{ marginTop: 12 }}>
          <button
            onClick={progress.reset}
            style={{
              background: "none",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.muted,
              fontSize: 11,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            Reset progress
          </button>
        </div>
      </Section>
      {PROJECTS.map((p) => (
        <ProjectCard key={p.id} project={p} done={progress.done} onToggle={progress.toggle} accent={ACCENT} />
      ))}
    </>
  );
}

export default function AgentsTab() {
  const [tab, setTab] = useState("overview");
  const progress = useProgress("projagents", allStepIds);

  return (
    <TabShell
      accent={ACCENT}
      active={tab}
      onChange={setTab}
      tabs={[
        { id: "overview", label: "Overview" },
        { id: "projects", label: `Projects (${PROJECTS.length})` },
        { id: "interactive", label: "Interactive" },
      ]}
    >
      {tab === "overview" && <Overview />}
      {tab === "projects" && <Projects progress={progress} />}
      {tab === "interactive" && (
        <>
          <BudgetCalculator />
          <Section label="STACK" color={C.teal}>
            <StackRow
              items={["LangGraph", "CrewAI", "llama-cpp-python", "Gemini API", "pandas", "DuckDuckGo"]}
              accent={ACCENT}
            />
          </Section>
        </>
      )}
    </TabShell>
  );
}
