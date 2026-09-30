import { useState } from "react";
import { Panel, GlassBar } from "../components/ui/CleanInfographics.jsx";

const LAYERS = [
  {
    id: "prompt",
    name: "Layer 1: Prompt Engineering",
    tagline: "The Call Itself — System Prompt, Role, Constraints & Typed Output Schema",
    color: "#C47A6A",
    icon: "💬",
    timeframe: "2022–2023",
    owns: "What the model reads on a single call: system message, user prompt, and JSON output schema.",
    failureMode: "Noisy Failure — The model ignores constraints or improvises invalid output formats.",
    keyPractices: [
      "Explicit role definition ('You are a precise document retrieval assistant')",
      "Typed output contracts (JSON Schema / Pydantic schemas preventing raw prose)",
      "Few-shot examples for structured extraction guidance"
    ],
    codeSnippet: `{"role": "system", "content": "You are a precise enterprise extraction agent."}`
  },
  {
    id: "context",
    name: "Layer 2: Context Engineering",
    tagline: "What Fills the Window — LangChain's 4 Strategies: Write, Select, Compress, Isolate",
    color: "#3A9B9F",
    icon: "📚",
    timeframe: "2024–2025",
    owns: "Curating what enters and exits the model's finite context window between turns.",
    failureMode: "Silent Failure — Model gives fluent, confident answers based on incorrect/missing retrieved context.",
    keyPractices: [
      "Write: Cached system prompts & static tool definitions",
      "Select: Hybrid dense/sparse retrieval and anchor page detection",
      "Compress: Sentence-level extraction and context compaction",
      "Isolate: Keeping sub-agent outputs out of main prompt context window"
    ],
    codeSnippet: `context = compress(select(query, vector_db), token_limit=2048)`
  },
  {
    id: "loop",
    name: "Layer 3: Loop Engineering",
    tagline: "Around the Call — Triggers, Termination, Recovery & Anthropic's 7 Loop Patterns",
    color: "#7A6BA8",
    icon: "🔄",
    timeframe: "2026+",
    owns: "Orchestrating when the next call fires, when the loop stops, and how failures recover.",
    failureMode: "Expensive Failure — Loop spins endlessly on identical payload, burning token budget.",
    keyPractices: [
      "The Golden Rule: 'Every retry must change something' (payload, tier, or strategy)",
      "Trigger predicates & completion predicates (loop-until-done vs loop-until-budget)",
      "Adversarial verification (Refuter agents challenging answer before commit)"
    ],
    codeSnippet: `while not termination_check(response) and retries < max_budget:
    payload = mutate_payload(payload) # Every retry changes something!
    response = llm(payload)`
  }
];

const LANGCHAIN_STRATEGIES = [
  {
    name: "1. WRITE",
    icon: "✍️",
    desc: "Cache static prompt prefixes across turns.",
    detail: "Prefix caching keeps system prompts, core guidelines, and tool schemas invariant. Saves latency and cost on multi-turn interactions."
  },
  {
    name: "2. SELECT",
    icon: "🎯",
    desc: "Retrieve only highly relevant fragments.",
    detail: "Uses hybrid dense/sparse search, rerankers, and TOC section scoping to select precise candidate chunks from millions of tokens."
  },
  {
    name: "3. COMPRESS",
    icon: "✂️",
    desc: "Strip noise and compact context windows.",
    detail: "Summarizes earlier conversation turns (`/compact`) and removes extraneous document sentences before generation."
  },
  {
    name: "4. ISOLATE",
    icon: "🛡️",
    desc: "Separate sub-agent memory spaces.",
    detail: "Runs sub-agent queries in isolated context windows so intermediate scratchpad output doesn't pollute the main conversation window."
  }
];

const ANTHROPIC_LOOPS = [
  { name: "Fan-Out / Fan-In", icon: "🔱", desc: "Split complex queries into parallel sub-agents and synthesize results." },
  { name: "Evaluator-Optimizer", icon: "⚖️", desc: "Generator creates answer, Evaluator critiques, Generator refines." },
  { name: "Parallel Verification", icon: "🔍", desc: "Multiple independent verifiers check facts concurrently." },
  { name: "Router Cascade", icon: "🔀", desc: "Route easy queries to cheap models and hard queries to flagships." },
  { name: "Loop-Until-Done", icon: "🔁", desc: "Iterate until explicit completion predicate returns true." },
  { name: "Retry-with-Backoff", icon: "⏱️", desc: "Exponential backoff on rate limits and transient network timeouts." },
  { name: "Adversarial Verify", icon: "🛡️", desc: "A refuter agent aggressively attempts to disprove generated claims." }
];

const TRIAGE_TABLE = [
  { symptom: "Model outputs informal prose instead of JSON schema", layer: "Layer 1: Prompt Engineering", debug: "Tighten system instructions, supply few-shot JSON examples, enforce Pydantic validator." },
  { symptom: "Model produces fluent, highly articulate but completely false answer", layer: "Layer 2: Context Engineering", debug: "Audit retrieval chunks. Check if candidate page selection missed target anchors or truncated key table rows." },
  { symptom: "Agent loops 10 times, burning $5 of tokens without finishing", layer: "Layer 3: Loop Engineering", debug: "Enforce Golden Rule: ensure retries mutate search strategy or switch model tiers. Add iteration cap." },
  { symptom: "Agent forgets user preferences established yesterday", layer: "Layer 4+: Memory Engineering", debug: "Bottleneck has moved past loop engineering into persistent long-term cross-session memory." }
];

const FLASHCARDS = [
  { q: "What is the single Golden Rule of Loop Engineering?", a: "Every retry must change something! A loop that retries the exact same payload after a failure is not learning—it is spinning.", cat: "Loop Engineering" },
  { q: "What are the 4 canonical strategies of Context Engineering?", a: "Write (prefix cache), Select (retrieval/recall), Compress (summarize/compact), and Isolate (sub-agent context isolation).", cat: "Context Engineering" },
  { q: "How do prompt engineering, context engineering, and loop engineering differ in failure modes?", a: "Prompt fails noisily (bad format/style), Context fails silently (fluent hallucination), Loop fails expensively (infinite loops/budget burn).", cat: "3-Layer Triage" },
  { q: "Why did the bottleneck shift from Prompt to Context to Loop over time?", a: "Better models reduced prompt pressure, larger context windows shifted pressure to curation, and long multi-turn runs created the need for loop control.", cat: "Industry Evolution" },
  { q: "What is 'Isolate' strategy in context engineering?", a: "Running sub-agents in independent context windows so intermediate tool outputs do not contaminate the main LLM context window.", cat: "Context Engineering" },
  { q: "What is Adversarial Verification in loop engineering?", a: "Deploying a dedicated 'refuter' sub-agent whose sole goal is attempting to disprove or find flaws in a candidate answer before committing.", cat: "Loop Engineering" }
];

/** Native glass companion to the interactive layer selector. */
function EngineeringLayersPanel() {
  return (
    <Panel
      title="Three Engineering Layers of Enterprise RAG"
      sub="Prompt, context, and loop — each layer owns a failure mode and a fix."
    >
      <div style={{ display: "grid", gap: 12 }}>
        <GlassBar color="#E8C558" icon="chat" index="1." title="Prompt Engineering" detail="User query → system prompt (role, constraints) + schema → LLM call → generated response." />
        <GlassBar color="#5EC4C8" icon="search" index="2." title="Context Engineering" detail="Query → semantic search over the vector DB → retrieval pipeline (rewrite, dense/sparse) → select, compress, filter → optimized context." />
        <GlassBar color="#A78BFA" icon="refresh" index="3." title="Loop Engineering" detail="Execution loop: triggers, fan-out/fan-in, adversarial verify, retry with backoff, self-correction, evaluation loop, parallel execution, termination." />
      </div>
    </Panel>
  );
}

export default function ThreeLayersTab() {
  const [selectedLayer, setSelectedLayer] = useState("prompt");
  const [contextSize, setContextSize] = useState(16); // in k tokens
  const [maxRetries, setMaxRetries] = useState(3);
  const [modelTier, setModelTier] = useState("medium"); // cheap, medium, flagship
  const [flashcardFlipped, setFlashcardFlipped] = useState({});

  const toggleFlip = (idx) => {
    setFlashcardFlipped((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Metrics computation for simulator
  const calculatedCost = ((contextSize * 0.000002 * (maxRetries + 1)) * (modelTier === "cheap" ? 0.3 : modelTier === "medium" ? 1 : 4)).toFixed(4);
  const calculatedLatency = (400 + contextSize * 15 + maxRetries * 350) * (modelTier === "cheap" ? 0.6 : modelTier === "medium" ? 1 : 1.8);
  const calculatedRecall = Math.min(98, Math.max(50, 70 + (contextSize > 32 ? -5 : 15) + maxRetries * 4));
  const hallucinationRisk = Math.max(2, 100 - calculatedRecall - (maxRetries > 2 ? 10 : 0));

  return (
    <div style={{ padding: "2rem", maxWidth: 1280, margin: "0 auto" }}>
      {/* HEADER BANNER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", borderRadius: 16, padding: "2.5rem", border: "1px solid #334155", marginBottom: "2.5rem", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(155,127,212,0.15)", border: "1px solid #C9B8E8", padding: "0.3rem 0.8rem", borderRadius: 20, fontSize: "0.75rem", color: "#7A6BA8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
              <span>🏗️ Enterprise RAG Architecture</span> · <span>3 Engineering Layers</span>
            </div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", fontWeight: 900, color: "#f8fafc", margin: 0, lineHeight: 1.1 }}>
              Prompt, Context, Loop: The 3 Engineering Layers
            </h1>
            <p style={{ color: "#E2E8F0", fontSize: "0.95rem", maxWidth: 740, marginTop: "0.8rem", lineHeight: 1.6 }}>
              Every RAG system is built in three engineering layers stacked on a single LLM call. Knowing which layer you are standing on is half of building and debugging enterprise AI.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ background: "#0f172a", padding: "1rem 1.5rem", borderRadius: 12, border: "1px solid #334155", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#C47A6A" }}>Layer 1</div>
              <div style={{ fontSize: "0.7rem", color: "#CBD5E1", textTransform: "uppercase" }}>Prompt</div>
            </div>
            <div style={{ background: "#0f172a", padding: "1rem 1.5rem", borderRadius: 12, border: "1px solid #334155", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3A9B9F" }}>Layer 2</div>
              <div style={{ fontSize: "0.7rem", color: "#CBD5E1", textTransform: "uppercase" }}>Context</div>
            </div>
            <div style={{ background: "#0f172a", padding: "1rem 1.5rem", borderRadius: 12, border: "1px solid #334155", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#7A6BA8" }}>Layer 3</div>
              <div style={{ fontSize: "0.7rem", color: "#CBD5E1", textTransform: "uppercase" }}>Loop</div>
            </div>
          </div>
        </div>
      </div>

      {/* ARCHITECTURE STACK DIAGRAM */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span>🖼️</span> 3D Stacked Architecture Overview
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          Visualizing the three layers built on top of the underlying LLM call. Prompt engineering controls output shape, Context engineering curates window contents, and Loop engineering governs turn execution.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", alignItems: "center" }}>
          <div style={{ background: "transparent", borderRadius: 12, overflow: "hidden", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", width: "100%" }}>
            <EngineeringLayersPanel />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {LAYERS.map((lyr) => (
              <div
                key={lyr.id}
                onClick={() => setSelectedLayer(lyr.id)}
                style={{
                  background: selectedLayer === lyr.id ? "rgba(255,255,255,0.05)" : "#11111b",
                  padding: "1.2rem",
                  borderRadius: 10,
                  borderLeft: `4px solid ${lyr.color}`,
                  border: selectedLayer === lyr.id ? `1px solid ${lyr.color}` : "1px solid #262636",
                  borderLeftWidth: 4,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 800, color: lyr.color, fontSize: "0.95rem" }}>
                    {lyr.icon} {lyr.name}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#6b7280", background: "#0d0d15", padding: "0.2rem 0.5rem", borderRadius: 12 }}>
                    {lyr.timeframe}
                  </span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#d1d5db", marginTop: "0.4rem" }}>
                  {lyr.tagline}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAILED LAYER EXPANDER */}
      {(() => {
        const cur = LAYERS.find(l => l.id === selectedLayer);
        return (
          <div style={{ background: "#0d0d15", borderRadius: 16, border: `1px solid ${cur.color}`, padding: "2rem", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>{cur.icon}</span>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: cur.color, margin: 0 }}>
                  {cur.name}
                </h3>
                <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Dominant Bottleneck Era: {cur.timeframe}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#14141f", padding: "1.2rem", borderRadius: 10, border: "1px solid #28283b" }}>
                <div style={{ fontSize: "0.75rem", color: cur.color, fontWeight: 700, textTransform: "uppercase" }}>What it owns</div>
                <div style={{ fontSize: "0.85rem", color: "#f3f4f6", marginTop: "0.4rem", lineHeight: 1.5 }}>{cur.owns}</div>
              </div>

              <div style={{ background: "#14141f", padding: "1.2rem", borderRadius: 10, border: "1px solid #28283b" }}>
                <div style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: 700, textTransform: "uppercase" }}>Primary Failure Mode</div>
                <div style={{ fontSize: "0.85rem", color: "#fca5a5", marginTop: "0.4rem", lineHeight: 1.5 }}>{cur.failureMode}</div>
              </div>
            </div>

            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.6rem" }}>Key Engineering Practices</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.6rem" }}>
                {cur.keyPractices.map((p, i) => (
                  <div key={i} style={{ background: "#181825", padding: "0.7rem 1rem", borderRadius: 8, fontSize: "0.82rem", color: "#d1d5db", borderLeft: `3px solid ${cur.color}` }}>
                    ✓ {p}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#050508", padding: "1rem 1.2rem", borderRadius: 8, border: "1px solid #262636", fontFamily: "DM Mono, monospace", fontSize: "0.82rem", color: "#60a5fa" }}>
              <div style={{ color: "#6b7280", fontSize: "0.7rem", marginBottom: "0.3rem" }}>Representative Pattern Code</div>
              {cur.codeSnippet}
            </div>
          </div>
        );
      })()}

      {/* INTERACTIVE 3-LAYER RAG METRIC SIMULATOR */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🎛️</span> Interactive 3-Layer RAG Dynamic Simulator
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Tune Prompt, Context, and Loop parameters to observe real-time trade-offs between Token Cost, Latency, Retrieval Recall, and Hallucination Risk.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          {/* CONTROL PANEL */}
          <div style={{ background: "#0d0d15", padding: "1.5rem", borderRadius: 12, border: "1px solid #2b2b3d", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#3A9B9F", fontWeight: 700, marginBottom: "0.4rem" }}>
                <span>Layer 2: Context Window Size</span>
                <span>{contextSize}k Tokens</span>
              </div>
              <input
                type="range" min={4} max={128} step={4}
                value={contextSize} onChange={e => setContextSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#5EC4C8" }}
              />
              <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.2rem" }}>Small (4k) → Massively Curated (128k)</div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#7A6BA8", fontWeight: 700, marginBottom: "0.4rem" }}>
                <span>Layer 3: Max Retry Loop Budget</span>
                <span>{maxRetries} Iterations</span>
              </div>
              <input
                type="range" min={0} max={8} step={1}
                value={maxRetries} onChange={e => setMaxRetries(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#C9B8E8" }}
              />
              <div style={{ fontSize: "0.7rem", color: "#6b7280", marginTop: "0.2rem" }}>0 (Single pass) → 8 (Deep verification loop)</div>
            </div>

            <div>
              <div style={{ fontSize: "0.8rem", color: "#C47A6A", fontWeight: 700, marginBottom: "0.4rem" }}>
                Layer 1: Model Tier
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["cheap", "medium", "flagship"].map(tier => (
                  <button
                    key={tier}
                    onClick={() => setModelTier(tier)}
                    style={{
                      flex: 1,
                      background: modelTier === tier ? "#F0A89A" : "#181825",
                      color: modelTier === tier ? "#000000" : "#d1d5db",
                      border: "1px solid #374151",
                      padding: "0.5rem",
                      borderRadius: 8,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIMULATED METRICS DASHBOARD */}
          <div style={{ background: "#09090e", padding: "1.5rem", borderRadius: 12, border: "1px solid #2b2b3d", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ background: "#11111b", padding: "1rem", borderRadius: 10, border: "1px solid #262636" }}>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Estimated Turn Cost</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#C47A6A", marginTop: "0.2rem" }}>${calculatedCost}</div>
              <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Per query execution</div>
            </div>

            <div style={{ background: "#11111b", padding: "1rem", borderRadius: 10, border: "1px solid #262636" }}>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Estimated Latency</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#60a5fa", marginTop: "0.2rem" }}>{Math.round(calculatedLatency)} ms</div>
              <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Total roundtrip time</div>
            </div>

            <div style={{ background: "#11111b", padding: "1rem", borderRadius: 10, border: "1px solid #262636" }}>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Retrieval Recall</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#3A9B9F", marginTop: "0.2rem" }}>{calculatedRecall}%</div>
              <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Context quality score</div>
            </div>

            <div style={{ background: "#11111b", padding: "1rem", borderRadius: 10, border: "1px solid #262636" }}>
              <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Hallucination Risk</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: hallucinationRisk > 20 ? "#ef4444" : "#5EC4C8", marginTop: "0.2rem" }}>{hallucinationRisk}%</div>
              <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>Likelihood of error</div>
            </div>
          </div>
        </div>
      </div>

      {/* LANGCHAIN 4 CONTEXT STRATEGIES EXPLORER */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🧱</span> Layer 2: LangChain's 4 Context Strategies
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Anthropic and LangChain codified context engineering into four fundamental strategies for managing LLM context windows.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem" }}>
          {LANGCHAIN_STRATEGIES.map((st, idx) => (
            <div key={idx} style={{ background: "#0d0d15", padding: "1.5rem", borderRadius: 12, border: "1px solid #2b2b3d", borderTop: "4px solid #5EC4C8" }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{st.icon}</div>
              <div style={{ fontWeight: 800, color: "#3A9B9F", fontSize: "1.05rem" }}>{st.name}</div>
              <div style={{ fontWeight: 600, color: "#f9fafb", fontSize: "0.85rem", margin: "0.4rem 0" }}>{st.desc}</div>
              <div style={{ fontSize: "0.8rem", color: "#9ca3af", lineHeight: 1.5 }}>{st.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ANTHROPIC 7 LOOP PATTERNS */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🔁</span> Layer 3: Anthropic's 7 Loop Patterns
            </h2>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.2rem" }}>
              Dynamic workflow primitives for production agentic loops.
            </div>
          </div>

          <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid #F0A89A", color: "#C47A6A", padding: "0.4rem 0.8rem", borderRadius: 8, fontSize: "0.75rem", fontWeight: 700 }}>
            ⭐ Golden Rule: Every retry MUST change something!
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
          {ANTHROPIC_LOOPS.map((lp, idx) => (
            <div key={idx} style={{ background: "#0d0d15", padding: "1.2rem", borderRadius: 10, border: "1px solid #2b2b3d", display: "flex", alignItems: "flex-start", gap: "0.8rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{lp.icon}</span>
              <div>
                <div style={{ fontWeight: 800, color: "#7A6BA8", fontSize: "0.9rem" }}>{lp.name}</div>
                <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.2rem", lineHeight: 1.4 }}>{lp.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TRIAGE & DEBUGGING MATRIX */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🩺</span> RAG Production Failure Mode Triage Matrix
        </h2>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#11111b", borderBottom: "2px solid #374151", color: "#C47A6A" }}>
                <th style={{ padding: "0.9rem 1rem" }}>Observed Production Symptom</th>
                <th style={{ padding: "0.9rem 1rem" }}>Culprit Layer</th>
                <th style={{ padding: "0.9rem 1rem" }}>Actionable Debugging Steps</th>
              </tr>
            </thead>
            <tbody>
              {TRIAGE_TABLE.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #262636", background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <td style={{ padding: "1rem", color: "#ef4444", fontWeight: 600 }}>{row.symptom}</td>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#f9fafb" }}>{row.layer}</td>
                  <td style={{ padding: "1rem", color: "#a7f3d0", fontSize: "0.82rem" }}>{row.debug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLASHCARDS STUDY MODE */}
      <div style={{ background: "#181825", borderRadius: 16, border: "1px solid #2b2b3d", padding: "2rem" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f9fafb", marginTop: 0, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span>🎴</span> 3 Engineering Layers Study Flashcards
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Master key concepts from Angela Shi's Towards Data Science manifesto. Click to flip cards.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem" }}>
          {FLASHCARDS.map((card, idx) => {
            const isFlipped = flashcardFlipped[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleFlip(idx)}
                style={{
                  background: isFlipped ? "#1e1b4b" : "#0d0d15",
                  border: `1px solid ${isFlipped ? "#C9B8E8" : "#374151"}`,
                  borderRadius: 12,
                  padding: "1.5rem",
                  cursor: "pointer",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <span style={{ fontSize: "0.7rem", color: "#C47A6A", fontWeight: 700, textTransform: "uppercase" }}>{card.cat}</span>
                    <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>{isFlipped ? "Answer" : "Question"}</span>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: isFlipped ? "#c084fc" : "#f9fafb", fontWeight: isFlipped ? 500 : 700, lineHeight: 1.5 }}>
                    {isFlipped ? card.a : card.q}
                  </div>
                </div>

                <div style={{ fontSize: "0.72rem", color: "#9ca3af", textAlign: "right", marginTop: "1rem" }}>
                  {isFlipped ? "↩ Click to view Question" : "💡 Click to reveal Answer"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
