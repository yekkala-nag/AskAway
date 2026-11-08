import React, { useState, useMemo } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { TAB_OVERVIEW, PROJECTS } from "./multimodalContent.js";
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

const ACCENT = C.gold;
const allStepIds = PROJECTS.flatMap((p) => p.steps.map((_, i) => `${p.id}-${i}`));

function VoiceLoop() {
  const [stt, setStt] = useState(900);
  const [tokens, setTokens] = useState(120);
  const [tps, setTps] = useState(20);
  const [tts, setTts] = useState(700);

  const gen = (tokens / Math.max(tps, 1)) * 1000;
  const total = stt + gen + tts;
  const verdict =
    total < 800
      ? { color: C.green, text: "Feels conversational" }
      : total < 2000
      ? { color: C.gold, text: "Noticeable pause, tolerable" }
      : { color: C.coral, text: "Feels broken in conversation" };

  const slider = (label, value, setValue, min, max, step) => (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...mono, fontSize: 10, color: C.muted }}>{label}</span>
        <span style={{ ...mono, fontSize: 11, color: ACCENT }}>{value}</span>
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
    <Section label="INTERACTIVE · VOICE ROUND-TRIP" color={ACCENT}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        The loop in project 13 is strictly sequential: nothing starts until the previous stage
        finishes. Sum the three stages to see why it feels sluggish.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          {slider("Speech-to-text (ms)", stt, setStt, 100, 4000, 50)}
          {slider("Response tokens", tokens, setTokens, 20, 600, 10)}
        </div>
        <div>
          {slider("Local throughput (tok/s)", tps, setTps, 3, 80, 1)}
          {slider("Text-to-speech (ms)", tts, setTts, 100, 4000, 50)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {[
          ["STT", `${stt} ms`],
          ["Generation", `${Math.round(gen)} ms`],
          ["TTS", `${tts} ms`],
          ["Round trip", `${(total / 1000).toFixed(2)} s`],
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
            <div style={{ ...mono, color: ACCENT, fontSize: 16, fontWeight: 700 }}>{v}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{k}</div>
          </div>
        ))}
      </div>

      <Callout color={verdict.color} title={verdict.text}>
        Generation is {Math.round((gen / total) * 100)}% of the wait. Cut tokens before you
        hunt for a faster model — a shorter answer is the cheapest latency win.
      </Callout>
    </Section>
  );
}

function ImageTokenEstimator() {
  const [px, setPx] = useState(336);
  const patch = 14;
  const side = Math.ceil(px / patch);
  const patches = side * side;
  return (
    <Section label="INTERACTIVE · IMAGE TOKEN COST" color={C.teal}>
      <label style={{ display: "block", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ ...mono, fontSize: 10, color: C.muted }}>Image resolution (px, square)</span>
          <span style={{ ...mono, fontSize: 11, color: C.teal }}>{px}×{px}</span>
        </div>
        <input
          type="range"
          min={112}
          max={672}
          step={56}
          value={px}
          onChange={(e) => setPx(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.teal }}
        />
      </label>
      <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7 }}>
        At 14-pixel patches a {px}×{px} image is a {side}×{side} grid —{" "}
        <strong style={{ ...mono, color: C.teal }}>{patches}</strong> visual tokens before any
        text. One image therefore costs roughly{" "}
        {Math.round(patches / 3.75).toLocaleString()} words of context budget, which is why
        batch analysis in project 16 is capped by memory, not by disk.
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
            src="/assets/proj_multimodal.svg"
            alt="Multimodal pipelines: audio to text to LLM to speech, and image to vision encoder to answer"
            title="Audio Loop & Vision Loop"
            caption="Both replace the text entry point, not the rest of the stack: the model still needs a prompt and still returns text."
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

      <Section label="TWO HONEST CAVEATS" color={C.coral}>
        <div style={{ display: "grid", gap: 10 }}>
          <Callout color={C.coral} title="Half-duplex voice">
            Project 13 cannot be interrupted: the microphone is closed while speech plays. Real
            assistants run the two directions concurrently and need echo cancellation to do it.
          </Callout>
          <Callout color={C.coral} title="Small vision models">
            LLaVA handles object lists and coarse trends. Counting, reading fine text and
            precise chart values are where it quietly invents an answer.
          </Callout>
        </div>
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

export default function MultimodalTab() {
  const [tab, setTab] = useState("overview");
  const progress = useProgress("projmultimodal", allStepIds);

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
          <VoiceLoop />
          <ImageTokenEstimator />
          <Section label="STACK" color={C.lav}>
            <StackRow
              items={["SpeechRecognition", "pyttsx3", "Ollama", "LLaVA"]}
              accent={ACCENT}
            />
          </Section>
        </>
      )}
    </TabShell>
  );
}
