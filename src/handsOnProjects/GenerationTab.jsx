import React, { useState, useMemo } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { TAB_OVERVIEW, PROJECTS } from "./generationContent.js";
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

const ACCENT = C.green;
const allStepIds = PROJECTS.flatMap((p) => p.steps.map((_, i) => `${p.id}-${i}`));

// Coarse cost model: one denoise step costs roughly 0.09 s per megapixel on a modern GPU.
const DEVICES = [
  { id: "gpu", label: "CUDA GPU", factor: 1 },
  { id: "mps", label: "Apple Silicon", factor: 2.4 },
  { id: "cpu", label: "CPU", factor: 26 },
];

function SamplerExplorer() {
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [mp, setMp] = useState(1);
  const [device, setDevice] = useState("mps");

  const r = useMemo(() => {
    const factor = DEVICES.find((d) => d.id === device).factor;
    const seconds = steps * 0.09 * mp * factor;
    const quality =
      steps < 15
        ? "Under-resolved, visible artefacts"
        : steps < 25
        ? "Usable drafts"
        : steps < 45
        ? "Good detail"
        : "Diminishing returns";
    const adherence =
      guidance < 4
        ? "Loose — prompt may be ignored"
        : guidance <= 9
        ? "Balanced"
        : "Rigid — contrast and colour crush";
    return { seconds, quality, adherence };
  }, [steps, mp, device]);

  const slider = (label, value, setValue, min, max, step, display) => (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...mono, fontSize: 10, color: C.muted }}>{label}</span>
        <span style={{ ...mono, fontSize: 11, color: ACCENT }}>
          {display ? display(value) : value}
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
    <Section label="INTERACTIVE · SAMPLER EXPLORER" color={ACCENT}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        Step count is linear cost; resolution is quadratic. Guidance does not change runtime at
        all — it only changes how hard the model chases the prompt.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          {slider("Inference steps", steps, setSteps, 5, 80, 1)}
          {slider("Guidance scale", guidance, setGuidance, 1, 20, 0.5, (v) => v.toFixed(1))}
        </div>
        <div>
          {slider("Resolution (MP)", mp, setMp, 0.25, 4, 0.25, (v) => `${v.toFixed(2)} MP`)}
          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ ...mono, fontSize: 10, color: C.muted, marginBottom: 4 }}>Device</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDevice(d.id)}
                  style={{
                    background: device === d.id ? ACCENT + "22" : C.s2,
                    border: `1px solid ${device === d.id ? ACCENT : C.border}`,
                    borderRadius: 6,
                    color: device === d.id ? ACCENT : C.muted,
                    fontSize: 11,
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          ["Estimated time", r.seconds < 90 ? `${Math.round(r.seconds)} s` : `${(r.seconds / 60).toFixed(1)} min`],
          ["Detail", r.quality],
          ["Prompt adherence", r.adherence],
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
            <div style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>{v}</div>
            <div style={{ ...mono, color: C.muted, fontSize: 10, marginTop: 4 }}>{k}</div>
          </div>
        ))}
      </div>

      {device === "cpu" && (
        <Callout color={C.coral} title="CPU is not a fallback, it is a punishment">
          At this step count on CPU the same image takes minutes rather than seconds. The
          pipeline loads, but project 19 is only practical on a GPU or Apple Silicon.
        </Callout>
      )}
    </Section>
  );
}

// djb2 — deterministic prompt → seed, so the same prompt reproduces the same run.
function seedFor(prompt) {
  let h = 5381;
  for (let i = 0; i < prompt.length; i++) h = ((h << 5) + h + prompt.charCodeAt(i)) >>> 0;
  return h % 2147483647;
}

function SeedDemo() {
  const [prompt, setPrompt] = useState("a cozy cabin in snowy mountains, warm lighting");
  const seed = seedFor(prompt);
  return (
    <Section label="INTERACTIVE · DETERMINISTIC SEED" color={C.teal}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        Fixing the seed is what makes two prompts comparable. Hash the prompt to a stable seed
        and the same text always lands on the same initial noise.
      </p>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%",
          background: C.s2,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          padding: "8px 10px",
          fontSize: 12,
          marginBottom: 10,
          ...mono,
        }}
      />
      <div style={{ ...mono, fontSize: 12, color: C.text }}>
        seed = <span style={{ color: C.teal, fontWeight: 700 }}>{seed}</span>
      </div>
      <div style={{ ...mono, fontSize: 10, color: C.muted, marginTop: 6 }}>
        Same text → same seed. One character changed → a completely different image.
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
            src="/assets/proj_generation.svg"
            alt="Two generation pipelines: transcript to chunked notes, and prompt to iterative denoising"
            title="Transcript → Notes · Prompt → Denoise → Image"
            caption="Summarisation compresses many chunks into one artifact; diffusion refines noise into one image. Both are bounded by a cost per step."
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

      <Section label="COST OF GENERATION" color={C.gold}>
        <Callout color={C.gold} title="Both projects are paid per unit of output">
          Notes cost one LLM call per 3,000-character chunk; images cost time proportional to
          steps × megapixels. Neither gets cheaper by asking for more at once — they get
          cheaper by bounding the output.
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

export default function GenerationTab() {
  const [tab, setTab] = useState("overview");
  const progress = useProgress("projgeneration", allStepIds);

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
          <SamplerExplorer />
          <SeedDemo />
          <Section label="STACK" color={C.lav}>
            <StackRow
              items={["youtube-transcript-api", "Ollama", "diffusers", "PyTorch", "Stable Diffusion 1.5"]}
              accent={ACCENT}
            />
          </Section>
        </>
      )}
    </TabShell>
  );
}
