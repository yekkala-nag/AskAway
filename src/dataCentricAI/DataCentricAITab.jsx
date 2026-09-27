import React, { useState } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function ParadigmComparison() {
  const [focus, setFocus] = useState("model");

  const modelCentric = {
    title: "Model-Centric AI",
    desc: "Better architecture, more layers, different loss function. Data stays fixed.",
    improvements: [
      { name: "Architecture search", delta: "+2.1%", color: C.sky },
      { name: "Hyperparameter tuning", delta: "+1.8%", color: C.sky },
      { name: "Loss function modification", delta: "+1.5%", color: C.sky },
    ],
    totalDelta: "+5.4%",
    pros: ["Clear benchmarks", "Academic novelty", "Published SOTA"],
    cons: ["Noisy data limits ceiling", "Diminishing returns", "Hard to deploy complex models"],
    color: C.sky,
  };

  const dataCentric = {
    title: "Data-Centric AI",
    desc: "Clean labels, remove ambiguity, ensure consistency. Model stays fixed.",
    improvements: [
      { name: "Label correction", delta: "+8.2%", color: C.emerald },
      { name: "Consistent annotation guide", delta: "+5.7%", color: C.emerald },
      { name: "Data deduplication", delta: "+3.1%", color: C.emerald },
    ],
    totalDelta: "+17.0%",
    pros: ["Compounds over time", "Applies to all models", "Measurable quality metrics"],
    cons: ["Less glamorous", "Requires annotation expertise", "Manual effort upfront"],
    color: C.emerald,
  };

  const active = focus === "model" ? modelCentric : dataCentric;

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        MODEL-CENTRIC vs DATA-CENTRIC AI
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ v: "model", l: "Model-Centric", c: C.sky }, { v: "data", l: "Data-Centric", c: C.emerald }].map(o => (
          <button key={o.v} onClick={() => setFocus(o.v)} style={{
            flex: 1, padding: "8px 12px", borderRadius: 6,
            background: focus === o.v ? o.c + "22" : C.surface,
            border: `1px solid ${focus === o.v ? o.c : C.border}`,
            color: focus === o.v ? o.c : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
          }}>
            {o.l}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px", background: C.surface, borderRadius: 8, marginBottom: 16, borderLeft: `3px solid ${active.color}` }}>
        <div style={{ color: active.color, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{active.title}</div>
        <div style={{ color: C.muted, fontSize: 12 }}>{active.desc}</div>
      </div>

      {/* Improvement breakdown */}
      <div style={{ background: "#060A14", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>ACCURACY IMPROVEMENT BREAKDOWN</div>
        {active.improvements.map((imp, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 140, color: C.text, fontSize: 11 }}>{imp.name}</div>
            <div style={{ flex: 1, height: 14, background: C.s3, borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                width: `${parseFloat(imp.delta) / 18 * 100}%`, height: "100%", borderRadius: 3,
                background: active.color, transition: "width 0.3s",
              }} />
            </div>
            <div style={{ width: 40, color: active.color, fontSize: 11, fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>
              {imp.delta}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: C.muted, fontSize: 11 }}>Total improvement</span>
          <span style={{ color: active.color, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace" }}>{active.totalDelta}</span>
        </div>
      </div>

      {/* Pros/Cons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Strengths</div>
          {active.pros.map((p, i) => (
            <div key={i} style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>✓ {p}</div>
          ))}
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Weaknesses</div>
          {active.cons.map((c, i) => (
            <div key={i} style={{ color: C.muted, fontSize: 11, marginBottom: 2 }}>✗ {c}</div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AnnotationConsistency() {
  const [samples] = useState([
    { text: "A blue sedan parked on the side of the road", labels: { labeler_a: "vehicle_parked", labeler_b: "vehicle_parked", labeler_c: "vehicle_moving" } },
    { text: "An SUV stopped at a red light", labels: { labeler_a: "vehicle_parked", labeler_b: "vehicle_moving", labeler_c: "vehicle_stopped" } },
    { text: "A truck loading at the dock", labels: { labeler_a: "vehicle_loading", labeler_b: "vehicle_moving", labeler_c: "vehicle_loading" } },
    { text: "A car driving on the highway", labels: { labeler_a: "vehicle_moving", labeler_b: "vehicle_moving", labeler_c: "vehicle_moving" } },
    { text: "A van reversing into a spot", labels: { labeler_a: "vehicle_moving", labeler_b: "vehicle_parked", labeler_c: "vehicle_moving" } },
  ]);

  const getAgreement = (s) => {
    const vals = Object.values(s.labels);
    return vals.filter(v => v === vals[0]).length === vals.length;
  };

  const agreements = samples.map(getAgreement);
  const agreementRate = (agreements.filter(Boolean).length / agreements.length * 100).toFixed(0);

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        LABEL CONSISTENCY CHECKER
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 24, fontWeight: 900, color: agreementRate < 80 ? C.rose : C.emerald }}>{agreementRate}%</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Label Agreement</div>
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, flex: 1, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 24, fontWeight: 900, color: C.sky }}>5</div>
          <div style={{ color: C.muted, fontSize: 11 }}>Samples Tested</div>
        </div>
      </div>

      {/* Samples table */}
      <div style={{ background: "#060A14", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 1, background: C.border }}>
          <div style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 10, fontWeight: 700 }}>SAMPLE</div>
          <div style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 10, fontWeight: 700 }}>A</div>
          <div style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 10, fontWeight: 700 }}>B</div>
          <div style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 10, fontWeight: 700 }}>C</div>
          <div style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 10, fontWeight: 700 }}>STATUS</div>
        </div>
        {samples.map((s, i) => {
          const agreed = getAgreement(s);
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 1, background: C.bg, marginBottom: 1 }}>
              <div style={{ padding: "8px 10px", color: C.muted, fontSize: 11 }}>{s.text}</div>
              {Object.values(s.labels).map((l, j) => (
                <div key={j} style={{
                  padding: "8px 10px", fontSize: 10,
                  background: l === Object.values(s.labels)[0] ? C.emerald + "11" : C.rose + "11",
                  color: l === Object.values(s.labels)[0] ? C.emerald : C.rose,
                  fontFamily: "JetBrains Mono, monospace",
                }}>{l}</div>
              ))}
              <div style={{
                padding: "8px 10px", fontSize: 10, fontWeight: 700,
                color: agreed ? C.emerald : C.rose,
                background: agreed ? C.emerald + "11" : C.rose + "11",
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {agreed ? "AGREED" : "DISAGREE"}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 12, padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.amber}` }}>
        <div style={{ color: C.amber, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>The Fix</div>
        <div style={{ color: C.muted, fontSize: 12 }}>
          Create a concrete annotation guide with boundary cases. "parked = stationary for 5+ seconds" and "stopped = temporarily halted but engine running." Disagreements drop from 60% to 12% with clear definitions.
        </div>
      </div>
    </Card>
  );
}

function DataQualityWorkflow() {
  const [step, setStep] = useState(0);
  const steps = [
    { name: "Audit", desc: "Sample 100 random examples. Have 2+ annotators label independently. Calculate agreement (Cohen's kappa).", color: C.sky, code: "kappa = (P_o - P_e) / (1 - P_e)\n# P_o = observed agreement\n# P_e = expected agreement by chance\n# kappa > 0.8 = excellent\n# kappa 0.6-0.8 = moderate\n# kappa < 0.6 = needs guide" },
    { name: "Guide", desc: "Write 1-page annotation guide with 10 boundary examples. Focus on the cases that cause disagreement.", color: C.violet, code: "# Annotation guide template\n1. Task definition (one sentence)\n2. Label taxonomy (exhaustive)\n3. Boundary examples:\n   - 'A car' → vehicle (clear)\n   - 'A car turned off' → vehicle_parked\n   - 'A car stopped' → ambiguous → vehicle_stopped" },
    { name: "Iterate", desc: "Run labeler calibration rounds. Track agreement per labeler. Retrain model after each data fix.", color: C.amber, code: "# Iteration loop\nfor round in range(5):\n    labels = annotate(batch, guide)\n    kappa = compute_agreement(labels)\n    errors = find_disagreements(labels)\n    guide = update_guide(errors)\n    # Accuracy improvement compounds\n    # Round 1: +3.2%  Round 2: +1.8%\n    # Round 3: +1.1%  Round 4: +0.6%" },
    { name: "Ship", desc: "Deploy with continuous monitoring. Sample predictions weekly. Retrain when accuracy drifts.", color: C.emerald, code: "# Production monitoring\nweekly_sample = sample_predictions(1000)\nhuman_review = annotate(weekly_sample)\naccuracy = (human_review == predictions).mean()\nif accuracy < threshold:\n    log('Retraining triggered')\n    retrain(model, updated_data)" },
  ];

  const s = steps[step];

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        DATA QUALITY WORKFLOW
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, padding: "6px 8px", borderRadius: 6,
            background: step === i ? st.color + "22" : C.surface,
            border: `1px solid ${step === i ? st.color : C.border}`,
            color: step === i ? st.color : C.muted, fontSize: 11, cursor: "pointer", fontWeight: 600,
          }}>
            {i + 1}. {st.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
          <div style={{ color: s.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{s.name}</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
        </div>
        <div style={{ background: "#060A14", borderRadius: 8, padding: 14 }}>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>CODE / TEMPLATE</div>
          <pre style={{ margin: 0, color: C.sky, fontSize: 11, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{s.code}</pre>
        </div>
      </div>
    </Card>
  );
}

export default function DataCentricAITab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>TOWARDS DATA SCIENCE · AUGUST 2021</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Rethinking How We Approach AI Problems</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          The prevailing focus in ML has been model-centric — bigger architectures, more parameters, novel losses. But consistently poor data quality is a silent killer that no architecture can fix.
        </div>
      </div>

      <ParadigmComparison />
      <AnnotationConsistency />
      <DataQualityWorkflow />

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          Before spending weeks on architecture search, audit your data. A simple TF-IDF classifier with clean labels often beats a complex transformer trained on noisy labels. The biggest accuracy gains come from fixing what the model sees, not changing how the model thinks.
        </div>
      </Card>
    </div>
  );
}