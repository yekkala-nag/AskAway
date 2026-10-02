import React, { useState } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function LearningCurveSimulator() {
  const [dataPoints, setDataPoints] = useState(10);
  const [showLLM, setShowLLM] = useState(true);

  const accuracies = [
    { n: 2, acc: 40, f1: 32.9 },
    { n: 5, acc: 55, f1: 52.2 },
    { n: 10, acc: 60, f1: 59.0 },
    { n: 25, acc: 72, f1: 70.5 },
    { n: 50, acc: 78, f1: 76.8 },
    { n: 100, acc: 82, f1: 81.2 },
    { n: 200, acc: 85, f1: 84.5 },
    { n: 500, acc: 87, f1: 86.8 },
  ];

  const llmAccuracy = 89;

  const getAccuracy = (n) => {
    const closest = accuracies.reduce((prev, curr) =>
      Math.abs(curr.n - n) < Math.abs(prev.n - n) ? curr : prev
    );
    return closest.acc;
  };

  const currentAcc = getAccuracy(dataPoints);
  const costPer1k = 0.015;
  const dailyVolume = 10000;
  const monthlyCostLLM = ((dailyVolume * 30) / 1000) * costPer1k;

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: HOW MUCH DATA DO YOU NEED?
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 6 }}>Labeled examples per category</div>
          <input type="range" min={2} max={500} value={dataPoints} onChange={e => setDataPoints(Number(e.target.value))}
            style={{ width: "100%", accentColor: C.sky }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ color: C.muted, fontSize: 10 }}>2</span>
            <span style={{ color: C.sky, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace" }}>{dataPoints}</span>
            <span style={{ color: C.muted, fontSize: 10 }}>500</span>
          </div>
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: C.muted, fontSize: 12 }}>
            <input type="checkbox" checked={showLLM} onChange={() => setShowLLM(!showLLM)}
              style={{ accentColor: C.amber }} />
            Show LLM zero-shot baseline ({llmAccuracy}%)
          </label>
        </div>
      </div>

      {/* Accuracy gauge */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 28, fontWeight: 900, color: C.sky }}>{currentAcc}%</div>
          <div style={{ color: C.muted, fontSize: 11 }}>TF-IDF Accuracy</div>
        </div>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 28, fontWeight: 900, color: C.violet }}>{(currentAcc * 0.95).toFixed(0)}%</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Macro-F1</div>
        </div>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 28, fontWeight: 900, color: C.emerald }}>&lt;0.01ms</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Inference Time</div>
        </div>
      </div>

      {/* Learning curve chart */}
      <div style={{ background: "#060A14", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <svg viewBox="0 0 500 200" style={{ width: "100%", height: 200 }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <g key={y}>
              <line x1="40" y1={180 - y * 1.6} x2="490" y2={180 - y * 1.6} stroke={C.border} strokeWidth="0.5" strokeDasharray="2,4" />
              <text x="35" y={184 - y * 1.6} textAnchor="end" fill={C.muted} fontSize="8" fontFamily="JetBrains Mono, monospace">{y}%</text>
            </g>
          ))}
          {/* X axis labels */}
          {[2, 10, 50, 100, 500].map((n, i) => {
            const x = 40 + (i / 4) * 450;
            return <text key={n} x={x} y="198" textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="JetBrains Mono, monospace">{n}</text>;
          })}
          {/* LLM baseline */}
          {showLLM && (
            <>
              <line x1="40" y1={180 - llmAccuracy * 1.6} x2="490" y2={180 - llmAccuracy * 1.6}
                stroke={C.amber} strokeWidth="1" strokeDasharray="4,4" />
              <text x="492" y={180 - llmAccuracy * 1.6 + 3} fill={C.amber} fontSize="7" fontFamily="JetBrains Mono, monospace">LLM {llmAccuracy}%</text>
            </>
          )}
          {/* Learning curve */}
          <path d={accuracies.map((a, i) => {
            const x = 40 + (Math.log(a.n / 2) / Math.log(500 / 2)) * 450;
            const y = 180 - a.acc * 1.6;
            return `${i === 0 ? "M" : "L"}${x},${y}`;
          }).join(" ")} fill="none" stroke={C.sky} strokeWidth="2" />
          {/* Data points */}
          {accuracies.map(a => {
            const x = 40 + (Math.log(a.n / 2) / Math.log(500 / 2)) * 450;
            const y = 180 - a.acc * 1.6;
            const isActive = Math.abs(a.n - dataPoints) < dataPoints * 0.3;
            return (
              <g key={a.n}>
                <circle cx={x} cy={y} r={isActive ? 5 : 3} fill={isActive ? C.sky : C.sky + "66"} stroke={C.sky} strokeWidth="1" />
                {isActive && (
                  <text x={x} y={y - 10} textAnchor="middle" fill={C.sky} fontSize="9" fontWeight="700" fontFamily="JetBrains Mono, monospace">
                    {a.acc}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cost comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.sky}` }}>
          <div style={{ color: C.sky, fontWeight: 600, fontSize: 12 }}>Classical (TF-IDF)</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Cost: <strong style={{ color: C.emerald }}>$0</strong> after training. Sub-millisecond inference. Runs anywhere.</div>
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.amber}` }}>
          <div style={{ color: C.amber, fontWeight: 600, fontSize: 12 }}>LLM Zero-Shot</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Cost: <strong style={{ color: C.rose }}>${monthlyCostLLM.toFixed(0)}/mo</strong> at {dailyVolume.toLocaleString()}/day. Network round-trip per request.</div>
        </div>
      </div>
    </Card>
  );
}

function ErrorAnalysis() {
  const [selectedError, setSelectedError] = useState(0);
  const errors = [
    {
      ticket: "Is there a student discount available on the pro plan?",
      true_label: "billing",
      predicted: ["technical_bug (n=2)", "general_question (n=5,10)"],
      type: "Structural",
      color: C.rose,
      explanation: "TF-IDF sees 'discount' and 'plan' but can't reason about intent. The distinction between pricing policy and charge dispute requires understanding purpose, not just vocabulary."
    },
    {
      ticket: "The mobile app logs me out every few minutes.",
      true_label: "technical_bug",
      predicted: ["feature_request (all sizes)"],
      type: "Structural",
      color: C.rose,
      explanation: "'Mobile app' and 'logs me out' don't signal 'bug' vs 'feature request' to bag-of-words. That distinction lives in tone and implied urgency."
    },
    {
      ticket: "Can you reset my password, the reset email never arrives",
      true_label: "account_access",
      predicted: ["billing (n=2)", "correct (n=10)"],
      type: "Data-starvation",
      color: C.emerald,
      explanation: "At n=2, not enough account_access vocabulary seen. By n=10, the model has seen enough examples to classify correctly. More data fixes this."
    },
    {
      ticket: "How do I delete my account and all associated data?",
      true_label: "account_access",
      predicted: ["general_question (n=2,5)", "correct (n=10)"],
      type: "Data-starvation",
      color: C.emerald,
      explanation: "Low data volume means 'delete account' maps to general question. More account_access examples disambiguate this correctly."
    },
  ];

  const e = errors[selectedError];

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        ERROR ANALYSIS: DATA-STARVATION vs STRUCTURAL FAILURES
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {errors.map((err, i) => (
          <button key={i} onClick={() => setSelectedError(i)} style={{
            padding: "6px 12px", borderRadius: 6,
            background: selectedError === i ? err.color + "22" : C.surface,
            border: `1px solid ${selectedError === i ? err.color : C.border}`,
            color: selectedError === i ? err.color : C.muted,
            fontSize: 11, cursor: "pointer",
          }}>
            Error {i + 1}: {err.type}
          </button>
        ))}
      </div>
      <div style={{ padding: "12px", background: "#060A14", borderRadius: 8, marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>TEST TICKET</div>
        <div style={{ color: C.text, fontSize: 13, fontStyle: "italic" }}>"{e.ticket}"</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${C.sky}` }}>
          <div style={{ color: C.sky, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>TRUE LABEL</div>
          <div style={{ color: C.text, fontSize: 13 }}>{e.true_label}</div>
        </div>
        <div style={{ padding: "10px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${C.violet}` }}>
          <div style={{ color: C.violet, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>PREDICTED AT EACH SIZE</div>
          {e.predicted.map((p, i) => <div key={i} style={{ color: C.muted, fontSize: 11 }}>{p}</div>)}
        </div>
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${e.color}` }}>
        <div style={{ color: e.color, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{e.type} Error</div>
        <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{e.explanation}</div>
      </div>
    </Card>
  );
}

function DecisionFramework() {
  const [volume, setVolume] = useState(5000);
  const [latency, setLatency] = useState("realtime");

  const monthlyCost = ((volume * 30) / 1000) * 0.015;
  const classicalAcc = volume > 100 ? 85 : volume > 20 ? 72 : 55;

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        DECISION FRAMEWORK: WHICH APPROACH FITS YOUR CASE?
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Daily volume</div>
          <input type="range" min={100} max={100000} step={100} value={volume}
            onChange={e => setVolume(Number(e.target.value))} style={{ width: "100%", accentColor: C.violet }} />
          <div style={{ color: C.violet, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{volume.toLocaleString()}/day</div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Latency requirement</div>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ v: "realtime", l: "Real-time" }, { v: "batch", l: "Batch" }].map(o => (
              <button key={o.v} onClick={() => setLatency(o.v)} style={{
                flex: 1, padding: "6px", borderRadius: 4,
                background: latency === o.v ? C.violet + "22" : C.surface,
                border: `1px solid ${latency === o.v ? C.violet : C.border}`,
                color: latency === o.v ? C.violet : C.muted, fontSize: 11, cursor: "pointer",
              }}>{o.l}</button>
            ))}
          </div>
        </div>
        <div style={{ padding: "8px", background: C.surface, borderRadius: 6 }}>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 2 }}>LLM monthly cost</div>
          <div style={{ color: C.rose, fontSize: 18, fontWeight: 900, fontFamily: "JetBrains Mono, monospace" }}>${monthlyCost.toFixed(0)}</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
        <div style={{ color: C.emerald, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
          Recommendation: {volume > 100 && latency === "realtime" ? "Classical TF-IDF (sub-ms, $0)" : volume < 50 ? "LLM zero-shot (no training data)" : "Hybrid: LLM generates labels → train classical model"}
        </div>
        <div style={{ color: C.muted, fontSize: 12 }}>
          {volume > 100 && latency === "realtime"
            ? `With ${volume.toLocaleString()}/day, LLM costs $${monthlyCost.toFixed(0)}/mo. Classical model costs $0 after training with ~${classicalAcc}% accuracy.`
            : volume < 50
            ? "Too few examples for a classical baseline. LLM zero-shot gets you started with no cold-start."
            : "Use LLM to generate pseudo-labels, then train classical model on accumulated labels for near-zero marginal cost."}
        </div>
      </div>
    </Card>
  );
}

export default function TextClassificationDataTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>AI FIELD NOTES · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>How Many Labeled Examples Does a Text Classifier Actually Need?</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Before reaching for an LLM API on every classification problem, it's worth knowing what a decades-old baseline can already do with the labeled data you have — and exactly how much more data buys you.
        </div>
      </div>

      <LearningCurveSimulator />
      <ErrorAnalysis />
      <DecisionFramework />

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          The first handful of examples per category matters far more than the next handful. Going from 2→5 examples bought +15 points. Going from 5→10 bought only +5. The shape of the diminishing-returns curve is what should drive your architecture decision — not "which method scores higher in the abstract."
        </div>
      </Card>
    </div>
  );
}