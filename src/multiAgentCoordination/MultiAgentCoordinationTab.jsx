import React, { useState, useEffect, useRef } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

const SPECIALISTS = [
  { id: "inference", name: "Inference Agent", model: "Codex", task: "Flow log analysis over 90 days", color: C.sky, verdict: "ok", confidence: 0.94, freshness: 1 },
  { id: "extraction", name: "Extraction Agent", model: "Claude Skills", task: "Runbook structured reads", color: C.violet, verdict: "hold", confidence: 0.88, freshness: 1095 },
  { id: "capacity", name: "Capacity Agent", model: "Codex", task: "P90 utilization forecast", color: C.amber, verdict: "ok", confidence: 0.91, freshness: 3 },
  { id: "sequencing", name: "Sequencing Agent", model: "Claude Code", task: "Wave ordering across signals", color: C.emerald, verdict: "warn", confidence: 0.82, freshness: 2 },
  { id: "watch", name: "Watch Agent", model: "Codex + Sonnet", task: "Real-time anomaly detection", color: C.rose, verdict: "ok", confidence: 0.96, freshness: 0 },
];

function AgentSimulator() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [findings, setFindings] = useState([]);
  const [coordinatorOutput, setCoordinatorOutput] = useState(null);
  const timerRef = useRef(null);

  const runSimulation = () => {
    setRunning(true);
    setPhase("fanning");
    setFindings([]);
    setCoordinatorOutput(null);

    let idx = 0;
    timerRef.current = setInterval(() => {
      if (idx < SPECIALISTS.length) {
        setFindings(prev => [...prev, { ...SPECIALISTS[idx], status: "complete" }]);
        idx++;
      } else {
        clearInterval(timerRef.current);
        setPhase("coordinating");
        setTimeout(() => {
          const hasContradiction = true;
          setCoordinatorOutput({
            verdict: "hold",
            contradictions: hasContradiction ? [{
              kind: "graph_vs_runbook",
              note: "Inference (1d fresh) says OK, Extraction (1095d fresh) says HOLD — freshness gap means graph may capture subset of real behavior"
            }] : [],
            riskSignals: { graph_vs_runbook_conflict: true, capacity_below_policy: false, manual_steps: 4, specialist_missing: false },
          });
          setPhase("done");
          setRunning(false);
        }, 1200);
      }
    }, 600);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em" }}>
          INTERACTIVE: SINGLE MODEL vs MULTI-AGENT TEAM
        </div>
        <button onClick={runSimulation} disabled={running} style={{
          background: running ? C.s3 : C.sky + "22", border: `1px solid ${C.sky}44`, borderRadius: 6,
          color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700,
          padding: "6px 16px", cursor: running ? "not-allowed" : "pointer",
        }}>
          {running ? `Running... ${phase}` : "Run Simulation"}
        </button>
      </div>

      {/* Single Model Path */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ border: `1px solid ${C.rose}44` }}>
          <div style={{ color: C.rose, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Monolithic Single Model</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            One strong reasoning model fed ALL evidence across 5 different task types. Averages contradictions between flow graphs and runbooks.
          </div>
          <div style={{ padding: "10px", background: C.surface, borderRadius: 6, border: `1px solid ${C.rose}33` }}>
            <div style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>FAILURE MODE</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>
              {phase === "done" ? (
                <>Synthesizes beautiful report that <strong>quietly averages away contradictions</strong>. Returns "probably OK" — wave ships, monthly job wakes up on 21st, latency jumps from 10→60 min.</>
              ) : (
                <>When evidence gets long, drops tasks and confidently answers on remaining ones. Both failure modes produce output that <em>looks correct</em>.</>
              )}
            </div>
          </div>
        </Card>

        <Card style={{ border: `1px solid ${C.sky}44` }}>
          <div style={{ color: C.sky, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Multi-Agent Team + Coordinator</div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            5 specialist agents, each seeing only evidence for its own question. Coordinator names contradictions instead of averaging them.
          </div>
          <div style={{ padding: "10px", background: C.surface, borderRadius: 6, border: `1px solid ${C.sky}33` }}>
            <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>CORRECT BEHAVIOR</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>
              {phase === "done" ? (
                <>Coordinator sees inference OK (1d fresh) vs extraction HOLD (1095d fresh). <strong>Names the contradiction</strong> and returns a decision brief, not an average.</>
              ) : (
                <>Each specialist returns typed findings: claim, evidence, confidence, freshness, verdict. Coordinator compares — never averages.</>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Agent Pipeline Visualization */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          AGENT PIPELINE — FAN OUT → COLLECT → COORDINATE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ padding: "8px 14px", borderRadius: 8, background: C.s3, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontWeight: 600 }}>
            Host Pair
          </div>
          <span style={{ color: C.border, fontSize: 16 }}>→</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SPECIALISTS.map(s => {
              const found = findings.find(f => f.id === s.id);
              return (
                <div key={s.id} style={{
                  padding: "6px 10px", borderRadius: 6,
                  background: found ? s.color + "22" : C.surface,
                  border: `1px solid ${found ? s.color : C.border}`,
                  color: found ? s.color : C.muted,
                  fontSize: 10, fontWeight: 600, fontFamily: "JetBrains Mono, monospace",
                  transition: "all 0.3s",
                }}>
                  {found ? "✓ " : ""}{s.name.split(" ")[0]}
                </div>
              );
            })}
          </div>
          <span style={{ color: C.border, fontSize: 16 }}>→</span>
          <div style={{
            padding: "8px 14px", borderRadius: 8,
            background: phase === "coordinating" || phase === "done" ? C.amber + "22" : C.surface,
            border: `1px solid ${phase === "coordinating" || phase === "done" ? C.amber : C.border}`,
            color: phase === "coordinating" || phase === "done" ? C.amber : C.muted,
            fontSize: 12, fontWeight: 600,
          }}>
            Coordinator
          </div>
          <span style={{ color: C.border, fontSize: 16 }}>→</span>
          <div style={{
            padding: "8px 14px", borderRadius: 8,
            background: phase === "done" ? C.rose + "22" : C.surface,
            border: `1px solid ${phase === "done" ? C.rose : C.border}`,
            color: phase === "done" ? C.rose : C.muted,
            fontSize: 12, fontWeight: 600,
          }}>
            {phase === "done" ? "HOLD — Decision Brief" : "Decision"}
          </div>
        </div>

        {/* Findings */}
        {findings.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 12 }}>
            {findings.map(f => (
              <div key={f.id} style={{ padding: "8px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${f.color}` }}>
                <div style={{ color: f.color, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{f.model}</div>
                <div style={{ color: C.text, fontSize: 11, marginTop: 2 }}>{f.task}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ color: f.verdict === "ok" ? C.sky : f.verdict === "warn" ? C.amber : C.rose, fontSize: 10, fontWeight: 700 }}>{f.verdict.toUpperCase()}</span>
                  <span style={{ color: C.muted, fontSize: 10 }}>{(f.confidence * 100).toFixed(0)}%</span>
                  <span style={{ color: C.muted, fontSize: 10 }}>{f.freshness}d</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coordinator Output */}
        {coordinatorOutput && (
          <div style={{ padding: "14px", background: "#060A14", borderRadius: 8, border: `1px solid ${C.rose}44` }}>
            <div style={{ color: C.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
              COORDINATOR OUTPUT — VERDICT: HOLD
            </div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>
              <strong>Contradiction detected:</strong> {coordinatorOutput.contradictions?.[0]?.note || "Contradiction detected across specialist models"}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(coordinatorOutput.riskSignals || {}).map(([k, v]) => (
                <span key={k} style={{
                  padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                  background: v ? C.rose + "22" : C.sky + "11",
                  color: v ? C.rose : C.muted,
                  border: `1px solid ${v ? C.rose + "44" : C.border}`,
                }}>
                  {k.replace(/_/g, " ")}: {v ? "TRUE" : "false"}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ModelEvalTable() {
  const [selected, setSelected] = useState(null);
  const tasks = [
    { task: "Flow inference over 90d logs", codex: 9, claude: 7, winner: "Codex", shape: "Single track quantitative" },
    { task: "Capacity P90 with backtest", codex: 8, claude: 7, winner: "Codex", shape: "Statistical calibration" },
    { task: "Watch detector maintenance", codex: 9, claude: 7, winner: "Codex", shape: "Deterministic rolling z-score" },
    { task: "Sequencing across 5 signals", codex: 6, claude: 9, winner: "Claude Code", shape: "Orchestration across subtasks" },
    { task: "Coordinator reconciliation", codex: 6, claude: 9, winner: "Claude Code", shape: "Fan out + reconcile" },
    { task: "Runbook extraction to schema", codex: 7, claude: 9, winner: "Claude Skills", shape: "Structured reads" },
    { task: "3 a.m. one-sentence explanation", codex: 7, claude: 9, winner: "Claude Sonnet", shape: "Concise human-facing output" },
  ];

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODEL SELECTION: WHICH MODEL BEHIND WHICH SPECIALIST
      </div>
      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
        Codex excels at single-track quantitative tasks driven to completion. Claude Code excels at orchestrating smaller subtasks. Shape determines model choice — not the other way around.
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              <th style={{ textAlign: "left", padding: "8px", color: C.muted }}>Task</th>
              <th style={{ textAlign: "center", padding: "8px", color: C.sky }}>Codex</th>
              <th style={{ textAlign: "center", padding: "8px", color: C.violet }}>Claude</th>
              <th style={{ textAlign: "center", padding: "8px", color: C.amber }}>Winner</th>
              <th style={{ textAlign: "left", padding: "8px", color: C.muted }}>Task Shape</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, cursor: "pointer", background: selected === i ? C.s3 : "transparent" }}
                onClick={() => setSelected(selected === i ? null : i)}>
                <td style={{ padding: "8px", color: C.text }}>{t.task}</td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 40, height: 6, background: C.s3, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${t.codex * 10}%`, height: "100%", background: C.sky, borderRadius: 3 }} />
                    </div>
                    <span style={{ color: C.sky, fontSize: 10, fontWeight: 700 }}>{t.codex}</span>
                  </div>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 40, height: 6, background: C.s3, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${t.claude * 10}%`, height: "100%", background: C.violet, borderRadius: 3 }} />
                    </div>
                    <span style={{ color: C.violet, fontSize: 10, fontWeight: 700 }}>{t.claude}</span>
                  </div>
                </td>
                <td style={{ padding: "8px", textAlign: "center" }}>
                  <span style={{ color: t.winner.includes("Codex") ? C.sky : C.violet, fontWeight: 700, fontSize: 10 }}>{t.winner}</span>
                </td>
                <td style={{ padding: "8px", color: C.muted, fontSize: 10 }}>{t.shape}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CoordinatorCode() {
  return (
    <Card>
      <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        COORDINATOR — NAMES CONTRADICTIONS, NEVER AVERAGES
      </div>
      <div style={{ padding: "14px", background: "#060A14", borderRadius: 8 }}>
        <pre style={{ margin: 0, color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 11, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{`# Each specialist returns a typed Finding
@dataclass
class Finding:
    agent: str
    claim: str
    confidence: float
    freshness_days: int
    verdict: Literal["ok", "warn", "hold"]

# Coordinator logic — the key insight
def coordinate(findings):
    contradictions = []

    # Name contradictions, never average
    for pair in itertools.combinations(findings, 2):
        if pair[0].verdict != pair[1].verdict:
            contradictions.append({
                "kind": f"{pair[0].agent}_vs_{pair[1].agent}",
                "note": f"Freshness gap: {pair[0].freshness_days}d vs {pair[1].freshness_days}d",
            })

    # Fail-closed verdict: hold beats warn beats ok
    verdict = "ok"
    if any(f.verdict == "hold" for f in findings):
        verdict = "hold"
    elif any(f.verdict == "warn" for f in findings):
        verdict = "warn"

    return {
        "verdict": verdict,
        "contradictions": contradictions,
        "risk_signals": compute_risk_signals(findings),
        "decision_owner": on_call_rotation,  # human name, not model
    }`}</pre>
      </div>
    </Card>
  );
}

function RiskRoutingFlow() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Coordinator Output", desc: "4 risk signals + contradictions", color: C.amber },
    { label: "Risk Score Router", desc: "Score signals against policy threshold", color: C.sky },
    { label: "Below Threshold", desc: "Log to audit trail, no human needed", color: C.muted },
    { label: "Above Threshold", desc: "Route to on-call human for decision", color: C.rose },
    { label: "Decision Owner", desc: "120s SLA: rollback / resume / extend", color: C.violet },
  ];

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        RISK-BASED ROUTING FOR HUMANS
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div
              onClick={() => setStep(i)}
              style={{
                padding: "10px 14px", borderRadius: 8, cursor: "pointer",
                background: step === i ? s.color + "22" : C.surface,
                border: `2px solid ${step === i ? s.color : C.border}`,
                transition: "all 0.2s",
              }}
            >
              <div style={{ color: step === i ? s.color : C.muted, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>
                Step {i + 1}
              </div>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
            {i < steps.length - 1 && <span style={{ color: C.border, fontSize: 16, padding: "0 4px" }}>→</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${steps[step]?.color || C.amber}` }}>
        <div style={{ color: steps[step]?.color || C.amber, fontWeight: 600, fontSize: 13 }}>{steps[step]?.label || "Step"}</div>
        <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{steps[step]?.desc || ""}</div>
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: C.s2, borderRadius: 8, border: `1px solid ${C.amber}33` }}>
        <div style={{ color: C.amber, fontSize: 12, fontWeight: 600 }}>
          Key insight: Over 90 days, humans overrode the sequencing agent 71 times. ~1/3 caught real periodic dependencies. ~2/3 were the human being wrong, and flow data quietly winning.
        </div>
      </div>
    </Card>
  );
}

class LocalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("MultiAgentCoordinationTab error caught:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "3rem 1.5rem", textAlign: "center", background: "#0F1629", borderRadius: 12, border: "1px solid #243358", color: "#E2E8F0" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️</div>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Component temporarily unavailable</h3>
          <p style={{ color: "#7A8BA8", fontSize: "0.85rem", maxWidth: 450, margin: "0 auto" }}>
            The multi-agent coordination simulation encountered an issue and was gracefully paused.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function MultiAgentCoordinationContent() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>TOWARDS DATA SCIENCE · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>When to Use One Model and When to Use a Team of Agents</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          5 specialist agents feeding a coordinator. The coordinator names contradictions instead of averaging them — and writes down one human name before the cutover window opens.
        </div>
      </div>

      <AgentSimulator />
      <ModelEvalTable />
      <CoordinatorCode />
      <RiskRoutingFlow />

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          KEY TAKEAWAY: GET THE SHAPE RIGHT FIRST
        </div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          Split the problem into specialists whose outputs a coordinator can compare. Make each return a typed finding with freshness and confidence. Put a coordinator in front that refuses to average contradictions. Route humans by risk, not by operation type. Write down one human name in <code style={{ color: C.sky }}>decision_owner</code> before the cutover window opens. Which model sits behind which specialist is the last decision, not the first.
        </div>
      </Card>
    </div>
  );
}

export default function MultiAgentCoordinationTab(props) {
  return (
    <LocalErrorBoundary>
      <MultiAgentCoordinationContent {...props} />
    </LocalErrorBoundary>
  );
}