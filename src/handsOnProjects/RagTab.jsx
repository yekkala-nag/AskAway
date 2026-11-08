import React, { useState, useMemo } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { TAB_OVERVIEW, PROJECTS } from "./ragContent.js";
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

const ACCENT = C.coral;
const allStepIds = PROJECTS.flatMap((p) => p.steps.map((_, i) => `${p.id}-${i}`));

// Demo corpus for the scorer. Deliberately short so the ranking is easy to audit.
const DEMO_CHUNKS = [
  "Machine learning trains a model on examples so it can generalise to new inputs instead of following hand-written rules.",
  "Cosine similarity compares two vectors by the angle between them, ignoring their magnitude entirely.",
  "Chunk overlap repeats text between neighbouring chunks so an answer is not cut in half at a boundary.",
  "A knowledge graph stores entities and the named relations between them, which vector search alone cannot express.",
  "Conversation memory keeps recent turns so a follow-up question can be rewritten into a standalone query.",
];

const tokenize = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);

const termVector = (tokens) => {
  const tf = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  return tf;
};

// Cosine over term-frequency vectors — same shape as the embedding version, different features.
const cosine = (a, b) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const k in a) na += a[k] ** 2;
  for (const k in b) nb += b[k] ** 2;
  for (const k in a) if (b[k]) dot += a[k] * b[k];
  return !na || !nb ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb));
};

function RetrievalScorer() {
  const [query, setQuery] = useState("how does cosine similarity ignore magnitude?");
  const [topK, setTopK] = useState(3);

  const ranked = useMemo(() => {
    const q = termVector(tokenize(query));
    return DEMO_CHUNKS.map((text, i) => ({
      i,
      text,
      score: cosine(q, termVector(tokenize(text))),
    })).sort((a, b) => b.score - a.score);
  }, [query]);

  const max = ranked[0]?.score || 1;

  return (
    <Section label="INTERACTIVE · RETRIEVAL RANKER" color={ACCENT}>
      <p style={{ marginTop: 0, color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
        Term-frequency cosine over five chunks. The real pipeline swaps these counts for
        sentence embeddings, but the ranking step — dot product, sort, take top-k — is
        identical.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask something about the corpus"
        style={{
          width: "100%",
          background: C.s2,
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          color: C.text,
          padding: "8px 10px",
          fontSize: 12,
          marginBottom: 12,
          ...mono,
        }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ ...mono, fontSize: 10, color: C.muted }}>top_k</span>
        <input
          type="range"
          min={1}
          max={5}
          value={topK}
          onChange={(e) => setTopK(Number(e.target.value))}
          style={{ accentColor: ACCENT }}
        />
        <span style={{ ...mono, fontSize: 11, color: ACCENT }}>{topK}</span>
      </label>

      <div style={{ display: "grid", gap: 8 }}>
        {ranked.slice(0, topK).map((r, idx) => (
          <div
            key={r.i}
            style={{
              background: C.s2,
              borderRadius: 8,
              padding: 10,
              borderLeft: `3px solid ${idx === 0 ? ACCENT : C.border}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ ...mono, fontSize: 10, color: C.muted }}>
                chunk {r.i + 1} · rank {idx + 1}
              </span>
              <span style={{ ...mono, fontSize: 10, color: ACCENT }}>
                {r.score.toFixed(3)}
              </span>
            </div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, margin: "4px 0 6px" }}>
              {r.text}
            </div>
            <div style={{ height: 4, background: C.s3, borderRadius: 999 }}>
              <div
                style={{
                  width: `${max ? (r.score / max) * 100 : 0}%`,
                  height: "100%",
                  background: ACCENT,
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...mono, fontSize: 10, color: C.muted, marginTop: 10 }}>
        Zero score means no shared terms — with embeddings, that is rare; with words, common.
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
            moduleId="rag_architecture"
            src="/assets/proj_rag_loop.svg"
            alt="RAG loop: chunk, embed, search, merge, generate, cite"
            title="Chunk → Embed → Search → Merge → Generate"
            caption="Build the loop by hand first; the frameworks only hide these steps, they do not remove them."
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

      <Section label="THE ONE BUG THAT BITES EVERYONE" color={C.gold}>
        <Callout color={C.gold} title="Distance is not similarity">
          Chroma returns a distance (lower is better); cosine returns a similarity (higher is
          better). Sorting merged results without normalising the direction silently returns
          your worst chunks. Projects 3 and 6 rank in opposite directions on purpose — read
          both sorts carefully.
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

export default function RagTab() {
  const [tab, setTab] = useState("overview");
  const progress = useProgress("projrag", allStepIds);

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
          <RetrievalScorer />
          <Section label="STACK" color={C.lav}>
            <StackRow
              items={["sentence-transformers", "FAISS", "Chroma", "Ollama", "NumPy"]}
              accent={ACCENT}
            />
          </Section>
        </>
      )}
    </TabShell>
  );
}
