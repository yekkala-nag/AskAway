import React, { useState, useMemo } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { TAB_OVERVIEW, PROJECTS } from "./infrastructureContent.js";
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

const ACCENT = C.teal;

const allStepIds = PROJECTS.flatMap((p) => p.steps.map((_, i) => `${p.id}-${i}`));

/* ── Interactive: chunking calculator ─────────────────────────────────── */
function ChunkCalculator() {
  const [length, setLength] = useState(10000);
  const [size, setSize] = useState(500);
  const [overlap, setOverlap] = useState(80);

  const result = useMemo(() => {
    if (size <= 0 || overlap < 0 || overlap >= size) return null;
    const chunks = [];
    let start = 0;
    while (start < length && chunks.length < 5000) {
      const end = Math.min(start + size, length);
      chunks.push({ start, end, size: end - start });
      start += size - overlap;
    }
    const covered = chunks.reduce((acc, c) => acc + c.size, 0);
    const unique = Math.min(length, chunks.length ? chunks[chunks.length - 1].end : 0);
    return {
      count: chunks.length,
      covered,
      unique,
      redundancy: unique ? covered / unique : 0,
      lastChunk: chunks.length ? chunks[chunks.length - 1].size : 0,
    };
  }, [length, size, overlap]);

  const invalid = overlap >= size || size <= 0 || overlap < 0;

  const field = (label, value, setValue, min, max, step) => (
    <label style={{ display: "block", marginBottom: 12 }}>
      <div style={{ ...mono, fontSize: 10, color: C.muted, marginBottom: 4 }}>
        {label}
      </div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{
          width: "100%",
          background: C.s2,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          padding: "6px 8px",
          fontSize: 12,
          ...mono,
        }}
      />
    </label>
  );

  return (
    <Section label="INTERACTIVE · CHUNKING CALCULATOR" color={ACCENT}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        Same loop as the code: advance by <code>size − overlap</code> each step. Watch
        redundancy climb as overlap grows.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {field("Document length (chars)", length, setLength, 1, 1000000, 100)}
        {field("Chunk size", size, setSize, 1, 5000, 10)}
        {field("Overlap", overlap, setOverlap, 0, 4999, 10)}
      </div>

      {invalid ? (
        <Callout color={C.coral} title="Invalid configuration">
          Overlap must be smaller than chunk size, otherwise the cursor never advances and
          the loop runs forever.
        </Callout>
      ) : (
        result && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {[
                ["Chunks", result.count],
                ["Total chars read", result.covered.toLocaleString()],
                ["Redundancy", `${result.redundancy.toFixed(2)}×`],
                ["Final chunk", `${result.lastChunk} ch`],
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
                  <div style={{ ...mono, color: ACCENT, fontSize: 18, fontWeight: 700 }}>{v}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{k}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", background: C.s3 }}>
              <div
                style={{
                  width: `${Math.min(100, (result.unique / result.covered) * 100)}%`,
                  background: ACCENT,
                }}
              />
              <div style={{ flex: 1, background: C.gold + "88" }} />
            </div>
            <div style={{ ...mono, fontSize: 10, color: C.muted, marginTop: 6 }}>
              teal = unique text · gold = re-read by overlap
            </div>
          </>
        )
      )}
    </Section>
  );
}

/* ── Overview ─────────────────────────────────────────────────────────── */
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
            src="/assets/proj_infra_pipeline.svg"
            alt="Document pipeline: load, parse, chunk, embed, store, serve"
            title="Ingestion → Parse → Chunk → Embed → Serve"
            caption="Every later track reuses this spine: the loader decides what text exists, the chunker decides what can be retrieved."
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

      <Section label="RUN ORDER" color={C.gold}>
        <Callout color={C.gold} title="Two toolchains, one directory">
          Project 1 uses LangChain loaders; projects 2–5 drop to plain HTTP and CSV. Install
          a single virtualenv with <code style={mono}>langchain-community</code>,{" "}
          <code style={mono}>sentence-transformers</code>, <code style={mono}>fastapi</code>{" "}
          and <code style={mono}>ollama</code>, and run Ollama separately on port 11434.
        </Callout>
      </Section>
    </>
  );
}

/* ── Projects ─────────────────────────────────────────────────────────── */
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

export default function InfrastructureTab() {
  const [tab, setTab] = useState("overview");
  const progress = useProgress("projinfra", allStepIds);

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
          <ChunkCalculator />
          <Section label="STACK" color={C.lav}>
            <StackRow items={["Python 3.10+", "Ollama", "LangChain", "FastAPI", "Docker"]} accent={ACCENT} />
          </Section>
        </>
      )}
    </TabShell>
  );
}
