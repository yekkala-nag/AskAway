import React, { useState } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function PizzaVisualizer() {
  const [radius, setRadius] = useState(6);
  const areas = [
    { r: 4, label: '8"', color: C.sky },
    { r: 6, label: '12"', color: C.amber },
    { r: 8, label: '16"', color: C.rose },
  ];

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        THE PIZZA PROBLEM: AREA GROWS AS R²
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 16 }}>
        <svg viewBox="0 0 300 160" style={{ width: 300, height: 160 }}>
          {areas.map((a, i) => (
            <g key={i}>
              <circle cx={60 + i * 100} cy={90} r={a.r * 8} fill={a.color + "33"} stroke={a.color} strokeWidth="2" />
              <text x={60 + i * 100} y={90 - a.r * 8 - 8} textAnchor="middle" fill={a.color}
                fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {a.label}
              </text>
              <text x={60 + i * 100} y={90 + 4} textAnchor="middle" fill={C.text}
                fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {(Math.PI * a.r * a.r).toFixed(0)} sq in
              </text>
            </g>
          ))}
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.amber, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>A 12" pizza is 2.25× an 8"</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
            8" = 201 sq in. 12" = 452 sq in. That's 2.25× the pizza, not 1.5×. People buy pizzas they can't finish because pizzerias price by diameter.
          </div>
        </div>
      </div>
    </Card>
  );
}

function MemoryBlowupSimulator() {
  const [clusterSize, setClusterSize] = useState(1000);
  const [approach, setApproach] = useState("unbounded");

  const approaches = {
    unbounded: { label: "Unbounded N×N", factor: 1, timeFactor: 1, color: C.rose },
    decimation: { label: "Shrink Input", factor: 0.05, timeFactor: 0.15, color: C.sky },
    sampling: { label: "Strided Sample", factor: 0.08, timeFactor: 0.12, color: C.violet },
    blockwalk: { label: "Block Walk", factor: 0.2, timeFactor: 0.75, color: C.amber },
    kdtree: { label: "KD-Tree", factor: 0.027, timeFactor: 1.2, color: C.emerald },
  };

  const bytesPerEntry = 8;
  const unboundedMem = clusterSize * clusterSize * bytesPerEntry;
  const boundedMem = unboundedMem * approaches[approach].factor;

  const formatBytes = (b) => {
    if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
    if (b >= 1e6) return `${(b / 1e6).toFixed(1)} MB`;
    if (b >= 1e3) return `${(b / 1e3).toFixed(1)} KB`;
    return `${b} B`;
  };

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: N² MEMORY BLOWUP
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Cluster size (N normals)</div>
          <input type="range" min={100} max={50000} step={100} value={clusterSize}
            onChange={e => setClusterSize(Number(e.target.value))} style={{ width: "100%", accentColor: C.amber }} />
          <div style={{ color: C.amber, fontSize: 16, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>
            N = {clusterSize.toLocaleString()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(approaches).map(([key, a]) => (
            <button key={key} onClick={() => setApproach(key)} style={{
              padding: "6px 10px", borderRadius: 4,
              background: approach === key ? a.color + "22" : C.surface,
              border: `1px solid ${approach === key ? a.color : C.border}`,
              color: approach === key ? a.color : C.muted,
              fontSize: 11, cursor: "pointer", textAlign: "left",
            }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memory bar chart */}
      <div style={{ background: "#060A14", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>PEAK MEMORY COMPARISON</div>
        {Object.entries(approaches).map(([key, a]) => {
          const mem = unboundedMem * a.factor;
          const maxMem = unboundedMem;
          const pct = (mem / maxMem) * 100;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 100, color: approach === key ? a.color : C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace", textAlign: "right" }}>
                {a.label}
              </div>
              <div style={{ flex: 1, height: 16, background: C.s3, borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  width: `${pct}%`, height: "100%", borderRadius: 3,
                  background: approach === key ? a.color : a.color + "66",
                  transition: "width 0.3s",
                }} />
              </div>
              <div style={{ width: 60, color: approach === key ? a.color : C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>
                {formatBytes(mem)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Production incident */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontWeight: 600, fontSize: 12 }}>Production Impact</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            At N=50,000: <strong style={{ color: C.rose }}>{formatBytes(unboundedMem)}</strong> peak. Every worker provisioned for worst case = 2× typical job. Half the fleet capacity wasted.
          </div>
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12 }}>After Fix</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
            Block walk: <strong style={{ color: C.emerald }}>{formatBytes(boundedMem)}</strong> peak. Same accuracy, same precision. 80%+ memory reduction. Shipped because it's exact.
          </div>
        </div>
      </div>
    </Card>
  );
}

function FourSolutions() {
  const [selected, setSelected] = useState(0);
  const solutions = [
    { name: "Shrink Input", desc: "Decimate mesh at top of scorer. One gate bounds every quadratic site.", tradeoff: "Fidelity — geometry changes", timeFactor: "6-10× faster", memFactor: "~1/19th", color: C.sky },
    { name: "Strided Sample", desc: "Take every k-th normal to fixed budget. Reproducible, no RNG.", tradeoff: "Approximation — boundary labels wrong", timeFactor: "6-10× faster", memFactor: "~1/11th", color: C.violet },
    { name: "Block Walk", desc: "Walk N×N in fixed-size blocks. Accumulate running totals. Never all resident.", tradeoff: "Time — same work, different order", timeFactor: "~0.75× (slower)", memFactor: "~1/5th", color: C.amber },
    { name: "KD-Tree", desc: "Spatial index for bounded neighborhood queries. Exact cluster labels.", tradeoff: "Worst-case time on dense graphs", timeFactor: "~1.2× (slower)", memFactor: "~1/37th", color: C.emerald },
  ];

  const s = solutions[selected];

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        FOUR WAYS TO BOUND A SQUARE
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {solutions.map((sol, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "6px 12px", borderRadius: 6,
            background: selected === i ? sol.color + "22" : C.surface,
            border: `1px solid ${selected === i ? sol.color : C.border}`,
            color: selected === i ? sol.color : C.muted,
            fontSize: 11, cursor: "pointer",
          }}>
            {sol.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
          <div style={{ color: s.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{s.name}</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
          <div style={{ padding: "6px 10px", background: C.s3, borderRadius: 4, display: "inline-block" }}>
            <span style={{ color: C.muted, fontSize: 10 }}>Tradeoff: </span>
            <span style={{ color: C.rose, fontSize: 10, fontWeight: 600 }}>{s.tradeoff}</span>
          </div>
        </div>

        <div style={{ padding: "14px", background: C.surface, borderRadius: 8 }}>
          <div style={{ color: C.muted, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>COMPARISON</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div>
              <div style={{ color: C.muted, fontSize: 10 }}>Time factor</div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>{s.timeFactor}</div>
            </div>
            <div>
              <div style={{ color: C.muted, fontSize: 10 }}>Memory reduction</div>
              <div style={{ color: C.emerald, fontSize: 13, fontWeight: 700 }}>{s.memFactor}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function DetectionMethods() {
  return (
    <Card>
      <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        HOW WE FOUND IT: 10-HZ SAMPLING
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Kubernetes Metrics FAILED</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
            <li>kubelet scrapes every 30s</li>
            <li>Spike lives for seconds, between scrapes</li>
            <li>"Pod peaked at 15GB at 14:32" = hundreds of candidates</li>
            <li>No attribution to pipeline stage</li>
          </ul>
        </div>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Stage-Level Sampler WORKED</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: C.muted, fontSize: 12, lineHeight: 1.8 }}>
            <li>Background thread reads cgroup every 100ms</li>
            <li>GC pass before each stage = clean baseline</li>
            <li>Records peak, mean, delta per stage</li>
            <li>Attributed to job ID, not pod or timestamp</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function NSquaredPizzaTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>AI FIELD NOTES · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>The N² Pizza Problem</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          What ordering and not eating a large pizza tells us about ML memory management.
        </div>
      </div>

      <PizzaVisualizer />
      <MemoryBlowupSimulator />
      <FourSolutions />
      <DetectionMethods />

      <Card style={{ border: `1px solid ${C.amber}33` }}>
        <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>WHERE ELSE THIS SURFACES</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { name: "Feature Matching", desc: "Descriptor×descriptor distance table. Higher resolution = quadratic." },
            { name: "Embedding Clustering", desc: "Full distance matrix for re-ID, dedup. Tuned on one gallery size, fails when it grows." },
            { name: "Vision Transformer", desc: "Double image side → 4× patches → 16× attention memory." },
          ].map((item, i) => (
            <div key={i} style={{ padding: "10px", background: C.surface, borderRadius: 6 }}>
              <div style={{ color: C.sky, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{item.name}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          Pay attention to any output with more dimensions than its input. A function that takes N things and returns N×N things is a quadratic site. Everyone read the scorer's signature and saw a list — the square was in plain view for a year because nobody checked the memory profile against the worst N.
        </div>
      </Card>
    </div>
  );
}