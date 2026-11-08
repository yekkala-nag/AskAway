import React, { useState } from "react";
import DiagramImage from "../components/ui/DiagramImage.jsx";
import { C, mono, Section, DataTable } from "./projectKit.jsx";
import InfrastructureTab from "./InfrastructureTab.jsx";
import RagTab from "./RagTab.jsx";
import AgentsTab from "./AgentsTab.jsx";
import MultimodalTab from "./MultimodalTab.jsx";
import GenerationTab from "./GenerationTab.jsx";

// Landing tab for the Hands-On Projects umbrella. The sidebar only lists
// *_hub tabs, so this page is the entry point; picking a track mounts it inline.
const TRACKS = [
  {
    id: "infra",
    title: "Infrastructure",
    icon: "🧱",
    accent: C.teal,
    projects: [1, 2, 4, 5],
    blurb: "Parse documents, chunk and embed, wrap a model in a streaming API.",
    Component: InfrastructureTab,
  },
  {
    id: "rag",
    title: "RAG",
    icon: "🔎",
    accent: C.coral,
    projects: [3, 6, 7, 9],
    blurb: "Build retrieval from the maths up, then across collections and graphs.",
    Component: RagTab,
  },
  {
    id: "agents",
    title: "Agents",
    icon: "🤖",
    accent: C.lav,
    projects: [12, 14, 15, 17, 18, 20],
    blurb: "Graph orchestration, data access, internet tools and multi-agent crews.",
    Component: AgentsTab,
  },
  {
    id: "multimodal",
    title: "Multimodal",
    icon: "🎙️",
    accent: C.gold,
    projects: [13, 16],
    blurb: "A voice loop and a vision loop — two entry points that replace typing.",
    Component: MultimodalTab,
  },
  {
    id: "generation",
    title: "Generation",
    icon: "🎨",
    accent: C.green,
    projects: [8, 19],
    blurb: "Transcripts into structured notes; prompts into images.",
    Component: GenerationTab,
  },
];

const OVERVIEW_ROWS = [
  ["Parse & inspect documents", "Infrastructure", "1", "LangChain loaders, FAISS, flan-t5"],
  ["Serve a model over HTTP", "Infrastructure", "2", "FastAPI, Ollama, Docker"],
  ["Batch-score structured output", "Infrastructure", "4", "PyPDF, Llama 3, JSON"],
  ["Force and verify reasoning", "Infrastructure", "5", "Chain-of-thought, self-check"],
  ["Retrieval without a framework", "RAG", "3", "sentence-transformers, NumPy"],
  ["Multi-collection retrieval", "RAG", "6", "Chroma, metadata filters"],
  ["Graph-augmented retrieval", "RAG", "7", "Entity extraction, relations"],
  ["Conversational retrieval", "RAG", "9", "LangChain memory, streaming"],
  ["State-graph orchestration", "Agents", "12", "LangGraph, DuckDuckGo"],
  ["Code-writing analysis agent", "Agents", "14", "pandas, exec sandbox caveat"],
  ["Automated research reports", "Agents", "15", "Search, summarise, compile"],
  ["Agent with internet tools", "Agents", "17", "DDGS, BeautifulSoup"],
  ["Multi-agent content pipeline", "Agents", "18", "Gemini API, role agents"],
  ["Local crew of agents", "Agents", "20", "CrewAI, llama-cpp, Mistral 7B"],
  ["Voice assistant loop", "Multimodal", "13", "SpeechRecognition, pyttsx3"],
  ["Visual question answering", "Multimodal", "16", "LLaVA, batch templates"],
  ["Transcript to study notes", "Generation", "8", "youtube-transcript-api, Ollama"],
  ["Local image generation", "Generation", "19", "diffusers, Stable Diffusion 1.5"],
];

function Landing({ onPick }) {
  return (
    <div
      style={{
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      <Section label="HANDS-ON PROJECTS" color={C.green}>
        <h1 style={{ margin: "0 0 8px", fontSize: 24, color: C.text, fontWeight: 800 }}>
          Eighteen builds, five tracks
        </h1>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Every project is a runnable local pipeline with the Python reproduced verbatim. Pick a
          track, work the steps, tick them off — progress saves per track in this browser.
        </p>
        <DiagramImage
          moduleId="agents_frameworks"
          src="/assets/proj_infra_pipeline.svg"
          alt="Shared ingestion spine across all project tracks"
          title="One Spine, Five Directions"
          caption="Infrastructure feeds retrieval; retrieval feeds agents; multimodal and generation are different entry and exit points on the same stack."
          background="#090d16"
          maxWidth={1100}
        />
      </Section>

      <Section label="TRACKS" color={C.gold}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => onPick(t.id)}
              style={{
                textAlign: "left",
                background: C.s2,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${t.accent}`,
                borderRadius: 10,
                padding: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <div style={{ color: t.accent, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {t.icon} {t.title}
              </div>
              <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, marginBottom: 6 }}>
                {t.blurb}
              </div>
              <div style={{ ...mono, fontSize: 10, color: C.muted }}>
                {t.projects.length} projects · {t.projects.map((n) => String(n).padStart(2, "0")).join(" · ")}
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section label="ALL PROJECTS" color={C.teal}>
        <DataTable
          headers={["Project", "Track", "#", "Core stack"]}
          rows={OVERVIEW_ROWS}
          accent={C.teal}
        />
      </Section>

      <Section label="BEFORE YOU START" color={C.coral}>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.8 }}>
          Ollama on <code style={mono}>localhost:11434</code> with{" "}
          <code style={mono}>llama3</code> pulled, Python 3.10+, and one virtualenv per track.
          Image generation wants a GPU; everything else runs on CPU, slowly. Code that calls{" "}
          <code style={mono}>exec</code> or a paid API is flagged in its step note — read those
          before running.
        </div>
      </Section>
    </div>
  );
}

export default function ProjectsHubTab() {
  const [picked, setPicked] = useState(null);
  const track = TRACKS.find((t) => t.id === picked);

  if (!track) return <Landing onPick={setPicked} />;

  const Component = track.Component;
  return (
    <div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 32px 0" }}>
        <button
          onClick={() => setPicked(null)}
          style={{
            background: "none",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.muted,
            fontSize: 11,
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          ← All tracks
        </button>
      </div>
      <Component />
    </div>
  );
}
