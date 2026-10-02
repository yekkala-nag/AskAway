import { lazy } from "react";

export const CATEGORIES = [
  "All",
  "Foundations",
  "RAG Systems",
  "Context & Memory",
  "Agents & Frameworks",
  "Advanced & Frontiers"
];

// Umbrella order mirrors the AI Engineer Roadmap flow (stages 1–8):
// orient/models → embeddings/vectors → RAG → memory → agents → ship.
export const UMBRELLA_TOPICS = [
  {
    id: "foundations",
    title: "Foundations & Architecture",
    icon: "📚",
    color: "#5EC4C8",
    dark: "#1F6B6E",
    description: "Roadmap stages 1–4: orientation, how LLMs work, prompting, models — home of the AI Engineer Roadmap",
    tabs: ["fnd_start_hub", "fnd_internals_hub", "fnd_prompts_hub", "fnd_mlsoc_hub", "fnd_multimodal_hub", "airoadmap", "overview", "glossary", "reinforcementlearning", "trpo2grpo", "aimoralagency", "humancentric", "dialoguelamda", "modellandscape", "tokenization", "quantserve", "vramconductor", "promptfundamentals", "lstm", "llmsampling", "selfattention", "posencoding", "archconcepts", "promptmgmt", "promptdependencygraph", "promptcontracts", "promptregression", "structuredoutputs", "topicmodeling", "workflows", "unhobbling", "aiharness", "promptlearning", "visionlanguage", "diffusionmodels", "speechvoice", "datacentricai", "prompt_studio", "prompt_frameworks", "prompt_methodologies", "threesentenceprompt"]
  },
  {
    id: "data_platform",
    title: "Data & Platform Layers",
    icon: "🏗️",
    color: "#3A9B9F",
    dark: "#1F6B6E",
    description: "Roadmap stage 5: embeddings, vector search and document pipelines that feed retrieval",
    tabs: ["data_found_hub", "data_docs_hub", "data_ml_hub", "data_scale_hub", "threelayers", "docstruct", "agenticparsing", "knowledgebase", "vectordbops", "datapipeline", "aidataplat", "medallionarch", "aitestdatabottleneck", "classicalml", "frauddetectionml", "modernioformats", "pythonprofiling", "pythonengineering", "nsquaredpizza", "functools", "activelearn", "goaltracker", "vaes", "keras3", "byol", "xlstm", "timeseriesanomaly", "aiusecases", "linearregression", "pandasdataframes", "pandasmem", "geopopviz", "datahumanization", "llmfinetuning", "multilingualclassification", "textclusteringhdbscan"]
  },
  {
    id: "rag_architecture",
    title: "RAG Architectures & Pipelines",
    icon: "⚡",
    color: "#F0A89A",
    dark: "#C47A6A",
    description: "Roadmap stage 6: RAG systems end to end",
    tabs: ["rag_core_hub", "rag_precision_hub", "rag_advanced_hub", "rag_practice_hub", "rag", "pipeline", "completepipeline", "qparseloop", "filtering", "hierrag", "prodrag", "routercheap", "rerankers", "rageval", "multilingualrag", "multimodalrag", "texttosql", "crossdocjoins", "genpatterns", "fourpdfs", "agentfanout", "hallucbricks", "workflowloop", "proxypointer", "agenticrag", "ragcasestudies", "interviewprep", "rowlevelrag", "tablegridrag", "graphtraversalknowledge", "ragcorpusshapes", "amplifyexpert", "ragchunking", "textclassificationdata", "capstone1", "capstone3"]
  },
  {
    id: "context_memory",
    title: "Context & Memory Engineering",
    icon: "🧠",
    color: "#C9B8E8",
    dark: "#7A6BA8",
    description: "Memory layer behind stages 6–7: context craft, memory systems, long context",
    tabs: ["ctx_craft_hub", "ctx_memory_hub", "ctx_long_hub", "ctxeng", "ctxmeasure", "memhierarchy", "longcontext", "vague", "hallucination", "contextgraph", "companybrain", "validitylayer", "memeng", "contextlimits"]
  },
  {
    id: "agents_frameworks",
    title: "Agent Systems & Frameworks",
    icon: "🤖",
    color: "#F0A89A",
    dark: "#C47A6A",
    description: "Roadmap stage 7: agents, MCP and production deployment",
    tabs: ["agt_found_hub", "agt_safety_hub", "agt_multi_hub", "agt_prod_hub", "fiveassets", "redesign", "projectprepframework", "agentplanner", "agenthitl", "agenta2a", "agentsandbox", "agentevals", "handoffwatch", "verifiedpipes", "codingevals", "claudecode100", "typedagentgate", "agentpairprogramming", "vibecode", "agentsastools", "toolcalling", "agenttasks", "agentmemory", "cliagent", "codingagentsnonprog", "multiagent", "multiagentcoord", "modelrouting", "langchain", "langgraph", "frameworkcompare", "agentdebugging", "agentscale", "modeldeploy", "aiproductbuilder", "mcpclient", "agentsdk", "loopengineering", "finassistproject", "zerocostmultiagent", "capstone2"]
  },
  {
    id: "frontiers_production",
    title: "Production & Frontiers",
    icon: "🔮",
    color: "#9B89C4",
    dark: "#6B5E94",
    description: "Roadmap stage 8: evals, cost, observability — ship and stay reliable",
    tabs: ["fr_eval_hub", "fr_ops_hub", "fr_frontiers_hub", "aigentools", "aiharnessquality", "aiarchdecisions", "firstaiapp", "enterpriseadvancedplaybook", "tokenorchestrationplaybook", "productionragops", "enterpriseaiops", "enterprisegrade", "finops", "observability", "slmedge", "tokenbill", "llmevals", "modelvalidation", "reasoningbench", "practices", "powerfeatures", "ragbeyond", "frontiers", "progress", "guardrails", "llmreliability"]
  }
];

export const TABS_REGISTRY = [
  // ── Umbrella 1 — Foundations & Architecture ──────────────────────────────
  {
    id: "airoadmap",
    label: "AI Engineer Roadmap",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧭",
    keywords: ["ai engineer roadmap", "roadmap.sh", "learning path", "stages", "week planner", "home", "start here", "career path"],
    component: lazy(() => import("../aiRoadmap/AIRoadmapTab.jsx"))
  },
  {
    id: "overview",
    label: "Home / Overview",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🏠",
    keywords: ["overview", "home", "introduction", "dashboard"],
    component: lazy(() => import("../tabs/OverviewTabNew.jsx").then(m => ({ default: m.OverviewTab })))
  },
  {
    id: "glossary",
    label: "AI Glossary",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📖",
    keywords: ["glossary", "terms", "definitions", "concepts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIGlossaryTab })))
  },
  {
    id: "firstaiapp",
    label: "Building Your First AI App",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🚀",
    keywords: ["first ai app", "ai app", "api keys", "environment variables", "ibrahim salami", "summarizer", "json response", "error triaging", "map reduce chunking", "openai", "towards data science", "shipping", "production app"],
    component: lazy(() => import("../firstAIApp/FirstAIAppTab.jsx"))
  },
  {
    id: "reinforcementlearning",
    label: "Reinforcement Learning: 3 Baselines & MDPs",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎮",
    keywords: ["reinforcement learning", "rl", "baselines", "markov decision process", "mdp", "ppo", "dqn", "dynamic pricing", "consumer rl", "next-best-action", "ltv", "wouter van heeswijk", "raj", "gymnasium", "towards data science"],
    component: lazy(() => import("../reinforcementLearning/ReinforcementLearningTab.jsx"))
  },
  {
    id: "trpo2grpo",
    label: "RL Training: TRPO → PPO → GRPO",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎓",
    keywords: ["trpo", "ppo", "grpo", "rlhf", "reward model", "value model", "deepseek", "kl divergence", "policy gradient", "maxime wolf", "towards data science"],
    component: lazy(() => import("../rlTraining/RLTrainingTab.jsx"))
  },
  {
    id: "aimoralagency",
    label: "AI Alignment & Moral Agency",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚖️",
    keywords: ["moral agency", "ai alignment", "caring", "functional caring", "experiential caring", "constitutional ai", "qualia", "consciousness", "javier marin valenzuela", "ethics", "towards data science"],
    component: lazy(() => import("../aiMoralAgency/MoralAgencyTab.jsx"))
  },
  {
    id: "humancentric",
    label: "Human-Centric AI Manifesto",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧡",
    keywords: ["human-centric", "manifesto", "do no harm", "value-sensitive design", "filter bubble", "facct", "compliance", "mark graus", "towards data science"],
    component: lazy(() => import("../humanCentric/HumanCentricTab.jsx"))
  },
  {
    id: "dialoguelamda",
    label: "Open-Domain Dialogue & LaMDA",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "💬",
    keywords: ["dialogue", "lamda", "google lamda", "ssi", "sensibleness", "specificity", "interestingness", "alberto romero", "gemini", "chatbots", "tool grounding", "towards data science"],
    component: lazy(() => import("../dialogueLaMDA/DialogueLaMDATab.jsx"))
  },
  {
    id: "modellandscape",
    label: "Model Landscape & Selection",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🏛️",
    keywords: ["model landscape", "model selection", "decision engine", "open weights", "closed api", "deepseek-v3", "deepseek-r1", "llama 3.3", "claude 3.5", "gpt-4o", "slms", "small language models", "phi-4", "smollm", "test-time compute", "reasoning models", "litellm"],
    component: lazy(() => import("../modelLandscape/ModelLandscapeTab.jsx"))
  },
  {
    id: "tokenization",
    label: "Tokenization & Fertility",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔤",
    keywords: ["tokenization", "bpe", "unigram", "wordpiece", "fertility", "multilingual tokens", "tiktoken"],
    component: lazy(() => import("../tokenization/TokenizationTab.jsx"))
  },
  {
    id: "quantserve",
    label: "Quantization & Model Serving",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🗜️",
    keywords: ["quantization", "awq", "gptq", "gguf", "vllm", "tensorrt", "vram", "serving", "pagedattention"],
    component: lazy(() => import("../quantServe/QuantServeTab.jsx"))
  },
  {
    id: "vramconductor",
    label: "VRAM Conductor: 3 Agents, 1 GPU",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎫",
    keywords: ["vram", "cuda", "admission control", "kv cache", "layer streaming", "llama.cpp", "bare metal", "anubhab banerjee", "towards data science"],
    component: lazy(() => import("../vramConductor/VramConductorTab.jsx"))
  },
  {
    id: "promptfundamentals",
    label: "Prompt Engineering & Cognitive Patterns",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "💡",
    keywords: ["prompt engineering", "zero-shot", "few-shot", "in-context learning", "chain-of-thought", "cot", "tree-of-thoughts", "tot", "directional stimulus", "delimiters", "system prompt", "dspy", "declarative prompts"],
    component: lazy(() => import("../promptEngineeringFundamentals/PromptFundamentalsTab.jsx"))
  },
  {
    id: "llmsampling",
    label: "LLM Generation & Sampling",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎛️",
    keywords: ["logits", "sampling", "temperature", "top-p", "top-k", "min-p", "nucleus sampling", "greedy decoding", "repetition penalty", "softmax", "beam search", "autoregressive", "generation mechanics", "llm generation"],
    component: lazy(() => import("../llmSampling/LLMSamplingTab.jsx"))
  },
  {
    id: "lstm",
    label: "LSTMs: Foundations & Transformers' Rise",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔁",
    keywords: ["lstm", "gru", "rnn", "vanishing gradient", "exploding gradient", "gates", "forget gate", "cell state", "sequence model", "recurrent network", "transformers won"],
    component: lazy(() => import("../lstmFoundations/LSTMTab.jsx"))
  },
  {
    id: "selfattention",
    label: "Transformers & Self-Attention",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "👁️",
    keywords: ["self-attention", "transformer", "query key value", "qkv", "scaled dot product", "mha", "gqa", "mqa", "mla", "multi-head attention", "grouped query attention", "rope", "rotary embeddings", "attention weights", "attention heatmap"],
    component: lazy(() => import("../selfAttention/SelfAttentionTab.jsx"))
  },
  {
    id: "posencoding",
    label: "Positional Encoding for Time Series",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⏱️",
    keywords: ["positional encoding", "sinusoidal", "time series", "self-attention order", "qkv", "rope", "lags", "gurjinder kaur", "towards data science"],
    component: lazy(() => import("../posEncoding/PosEncodingTab.jsx"))
  },
  {
    id: "archconcepts",
    label: "Architecture Concepts",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔬",
    keywords: ["architecture", "transformer", "attention", "foundations", "latent space", "embeddings"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ArchConceptsTab })))
  },
  {
    id: "promptmgmt",
    label: "Prompt Management",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📝",
    keywords: ["prompts", "prompt management", "versioning", "prompt engineering", "templates"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PromptMgmtTab })))
  },
  {
    id: "promptcontracts",
    label: "Prompt Contracts & Version Gates",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📜",
    keywords: ["prompt contracts", "contract validation", "version pin", "breaking change", "section manifest", "capability flags", "prompt management"],
    component: lazy(() => import("../promptContracts/PromptContractsTab.jsx"))
  },
  {
    id: "promptregression",
    label: "Prompt Regression Detection",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📡",
    keywords: ["prompt regression", "golden set", "behavioural diff", "canary", "rollback", "quiet failure", "evals"],
    component: lazy(() => import("../promptRegression/PromptRegressionTab.jsx"))
  },
  {
    id: "promptdependencygraph",
    label: "Prompt Dependency Graph",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🕸️",
    keywords: ["prompt dependency graph", "blast radius", "reachable vs candidate", "change impact analysis", "section dependents", "composable prompts", "retesting", "emmimal alexander", "towards data science"],
    component: lazy(() => import("../promptDependencyGraph/PromptDependencyGraphTab.jsx"))
  },
  {
    id: "structuredoutputs",
    label: "Structured Outputs",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📐",
    keywords: ["structured outputs", "json schema", "constrained decoding", "fsm", "outlines", "pydantic", "instructor", "grammars", "logit masking"],
    component: lazy(() => import("../structuredOutputs/StructuredOutputsTab.jsx"))
  },
  {
    id: "topicmodeling",
    label: "Topic Modeling 2026",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🌱",
    keywords: ["topic modeling", "keynmf", "seeded topic modeling", "turftopic", "llm summarization", "trend tracking", "ecb speeches", "lda"],
    component: lazy(() => import("../topicModeling/TopicModelingTab.jsx"))
  },
  {
    id: "workflows",
    label: "Claude Workflows",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🚀",
    keywords: ["workflows", "claude", "prompt engineering", "chaining"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClaudeWorkflowsTab })))
  },
  {
    id: "unhobbling",
    label: "Unhobbling Claude 5",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔓",
    keywords: ["unhobbling", "claude 5", "capabilities", "reasoning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.UnhobblingTab })))
  },
  {
    id: "aiharness",
    label: "AI Harness & Training Loops",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚙️",
    keywords: ["ai harness", "training loops", "transformer architecture", "kv cache", "gqa", "rlhf", "dpo", "gradient descent", "chinchilla", "flash attention", "evals", "failure modes"],
    component: lazy(() => import("../aiHarness/AIHarnessTab.jsx"))
  },
  {
    id: "promptlearning",
    label: "Prompt Learning & English Feedback",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧠",
    keywords: ["prompt learning", "english feedback", "voyager", "karpathy", "meta-prompt", "instruction management", "online optimization", "critique", "evals"],
    component: lazy(() => import("../promptLearning/PromptLearningTab.jsx"))
  },

  // ── Umbrella 2 — RAG Architectures & Pipelines ──────────────────────────────
  {
    id: "rag",
    label: "9 RAG Architectures",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["rag", "naive", "advanced", "hybrid", "self-rag", "crag", "graphrag"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGTypesTab })))
  },
  {
    id: "pipeline",
    label: "7-Stage Pipeline Sim",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "▶",
    keywords: ["pipeline", "vector db", "embedding", "chunking"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PipelineTab })))
  },
  {
    id: "completepipeline",
    label: "Complete 12-Step RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⛓️",
    keywords: ["complete pipeline", "12 steps", "ingestion", "indexing", "retrieval", "generation", "live simulation", "infographic", "toggle steps"],
    component: lazy(() => import("../completePipeline/CompletePipelineTab.jsx"))
  },
  {
    id: "qparseloop",
    label: "Question Parsing Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔂",
    keywords: ["question parsing", "query rewrite", "intent"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.QuestionParsingLoopTab })))
  },
  {
    id: "filtering",
    label: "Retrieval = Filtering",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "✦",
    keywords: ["retrieval", "filtering", "anchor detection", "bm25"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FilteringTab })))
  },
  {
    id: "hierrag",
    label: "Hierarchical Retrieval",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    keywords: ["hierarchical", "table of contents", "toc", "tree"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HierarchicalRetrievalTab })))
  },
  {
    id: "prodrag",
    label: "Production RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["production rag", "pdf", "extraction", "tables"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProductionRAGTab })))
  },
  {
    id: "routercheap",
    label: "Zero-Model Fast Router",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⚡",
    keywords: ["zero-model router", "fast-path", "calling the llm less", "latency", "cost", "line_df", "co_occurrence_score", "margin", "09ter", "frugalgpt", "router", "fast router"],
    component: lazy(() => import("../zeroModelRouter/ZeroModelRouterTab.jsx"))
  },
  {
    id: "genpatterns",
    label: "7 Generation Patterns",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧬",
    keywords: ["generation patterns", "contracts", "pydantic"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.GenPatternsTab })))
  },
  {
    id: "fourpdfs",
    label: "One Pipeline, Four PDFs",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📚",
    keywords: ["four pdfs", "benchmarks", "evaluation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FourPDFsTab })))
  },
  {
    id: "agentfanout",
    label: "Retrieval Under Agent Fan-Out",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌊",
    keywords: ["agent fan-out", "retrieval load", "latency stacking", "stale context", "relevance drift", "unified retrieval", "vespa", "concurrency"],
    component: lazy(() => import("../agentFanout/AgentFanoutTab.jsx"))
  },
  {
    id: "hallucbricks",
    label: "4 Verification Bricks",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧱",
    keywords: ["hallucinations", "bricks", "verification"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucBricksTab })))
  },
  {
    id: "workflowloop",
    label: "Workflow & Loop Dispatcher",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔀",
    keywords: ["workflow loop", "dispatcher", "when to loop", "when to stop", "should_continue", "pdf_qa_loop", "iterate_with_bound", "decide.py", "13", "drift", "audit"],
    component: lazy(() => import("../workflowLoop/WorkflowLoopTab.jsx"))
  },
  {
    id: "proxypointer",
    label: "Proxy-Pointer RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏷️",
    keywords: ["proxy pointer", "proxy pointer rag", "structure meets scale", "skeleton tree", "breadcrumb injection", "faiss pointer map", "gemini flash lite noise filter", "15"],
    component: lazy(() => import("../proxyPointer/ProxyPointerTab.jsx"))
  },
  {
    id: "agenticrag",
    label: "Agentic RAG Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔍",
    keywords: ["agentic rag", "react loop", "multi-step search", "let the agent search", "openai agents sdk", "14", "tools", "trace"],
    component: lazy(() => import("../agenticRAG/AgenticRAGTab.jsx"))
  },
  {
    id: "ragcasestudies",
    label: "Enterprise Case Studies & Blueprints",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏢",
    keywords: ["case study", "sdlc rag", "financial rag", "devcontext", "system design", "pseudocode", "architecture", "blueprints"],
    component: lazy(() => import("../tabs/RAGCaseStudiesTab.jsx"))
  },
  {
    id: "interviewprep",
    label: "RAG Interview Prep",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🎯",
    keywords: ["interview", "questions", "rag interview", "q&a", "study plan"],
    component: lazy(() => import("../tabs/InterviewPrepTab.jsx"))
  },
  {
    id: "capstone1",
    label: "Capstone 1: RAG Chatbot",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏁",
    keywords: ["capstone", "boss fight", "rag chatbot", "portfolio", "loop 1", "synthesis"],
    component: lazy(() => import("../capstone1/Capstone1Tab.jsx"))
  },
  {
    id: "rowlevelrag",
    label: "Row-Level Table Chunks for RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📊",
    keywords: ["row level chunks", "table rag", "tabular retrieval", "serialize_table_rows", "pipe parser", "docling", "dual scale index"],
    component: lazy(() => import("../rowLevelRAG/RowLevelRAGTab.jsx"))
  },
  {
    id: "rerankers",
    label: "Rerankers & Late Interaction",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🪜",
    keywords: ["reranker", "cross-encoder", "cohere rerank", "rankgpt", "colbert", "late interaction", "hyde", "query expansion", "bge-reranker"],
    component: lazy(() => import("../rerankers/RerankersTab.jsx"))
  },
  {
    id: "rageval",
    label: "RAG Eval Triad & Ship Gates",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📐",
    keywords: ["rag eval", "ragas", "faithfulness", "context precision", "context recall", "answer relevance", "ship gate", "evals"],
    component: lazy(() => import("../ragEvals/RagEvalTab.jsx"))
  },
  {
    id: "multilingualrag",
    label: "Multilingual RAG Routing",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌍",
    keywords: ["multilingual rag", "cross-lingual", "translate query", "mE5", "bge-m3", "fertility", "entity drift"],
    component: lazy(() => import("../multilingualRAG/MultilingualRAGTab.jsx"))
  },
  {
    id: "multimodalrag",
    label: "Multimodal RAG & Vision",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🖼️",
    keywords: ["multimodal rag", "vision rag", "clip", "siglip", "deplot", "chart qa", "vqa", "layout", "ocr"],
    component: lazy(() => import("../multimodalRAG/MultimodalRAGTab.jsx"))
  },
  {
    id: "texttosql",
    label: "Text-to-SQL Agent Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔗",
    keywords: ["text to sql", "sql agent", "schema linking", "guarded sql", "aggregate", "validity join", "read-only"],
    component: lazy(() => import("../textToSQL/TextToSQLTab.jsx"))
  },
  {
    id: "capstone3",
    label: "Capstone 3: Save the Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🚒",
    keywords: ["capstone", "boss fight", "rescue", "sla", "postmortem", "loop 3", "synthesis"],
    component: lazy(() => import("../capstone3/Capstone3Tab.jsx"))
  },
  {
    id: "crossdocjoins",
    label: "Cross-Document Table Joins",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧩",
    keywords: ["cross-doc joins", "schema alignment", "column mapping", "unified schedule", "validity join", "corpus aggregate"],
    component: lazy(() => import("../crossDocJoins/CrossDocJoinsTab.jsx"))
  },
  {
    id: "tablegridrag",
    label: "Tables in PDFs: Don't Flatten the Grid",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "▦",
    keywords: ["tables in pdfs", "table_df_meta", "table grid", "O1 O2 O3 O4 O5", "header propagation", "multi-page concat", "question projection", "columnar extraction", "vision fallback", "dispatcher", "kezhan shi", "towards data science"],
    component: lazy(() => import("../tableGridRAG/TableGridRAGTab.jsx"))
  },
  {
    id: "graphtraversalknowledge",
    label: "Always-Fused Graph Traversal Knowledge Layer",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌐",
    keywords: ["graph traversal", "always fused pipeline", "bitemporal edges", "entity resolution", "two threshold", "valid_from", "valid_to", "discovered contradictions"],
    component: lazy(() => import("../graphTraversalKnowledge/GraphTraversalTab.jsx"))
  },
  {
    id: "ragcorpusshapes",
    label: "Three Kinds of RAG Corpus & Selection",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    keywords: ["rag corpus shapes", "flat pile failure modes", "unrelated pdfs", "homogeneous typed corpus", "case file bundles", "metadata table indexing", "baseline waste"],
    component: lazy(() => import("../ragCorpusShapes/RAGCorpusShapesTab.jsx"))
  },
  {
    id: "amplifyexpert",
    label: "Amplify the Expert (RAG Manifesto)",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📣",
    keywords: ["amplify the expert", "manifesto", "enterprise rag", "two camps", "deterministic dispatch", "relational", "shi", "towards data science"],
    component: lazy(() => import("../amplifyExpert/AmplifyExpertTab.jsx"))
  },
  {
    id: "ragchunking",
    label: "RAG Chunking Strategy",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "✂️",
    keywords: ["chunking", "text splitting", "late chunking", "recursive character splitter", "semantic chunking", "sentence boundaries", "overlap", "parent child", "contextual retrieval", "fixed size"],
    component: lazy(() => import("../ragChunkingStrategy/RAGChunkingStrategyTab.jsx"))
  },

  // ── Umbrella 3 — Context & Memory Engineering ─────────────────────────
  {
    id: "ctxeng",
    label: "Context Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "✶",
    keywords: ["context engineering", "write", "select", "compress", "isolate"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextEngineeringTab })))
  },
  {
    id: "ctxmeasure",
    label: "Measuring Quality",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "📐",
    keywords: ["context quality", "evals", "metrics", "recall"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextMeasureTab })))
  },
  {
    id: "vague",
    label: "Vague Questions",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "◉",
    keywords: ["vague questions", "clarification", "ambiguity"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.VagueQuestionsTab })))
  },
  {
    id: "hallucination",
    label: "Silent Hallucination Loop",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🚨",
    keywords: ["hallucination loop", "silent failure", "detection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucinationLoopTab })))
  },
  {
    id: "contextgraph",
    label: "Context Graph Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⬡",
    keywords: ["context graph", "memory", "state"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextGraphTab })))
  },
  {
    id: "companybrain",
    label: "Company Brain Layer",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    keywords: ["company brain", "knowledge graph", "enterprise"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompanyBrainTab })))
  },
  {
    id: "validitylayer",
    label: "Validity Layer: What's Still True",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧭",
    keywords: ["validity layer", "stale context", "active stale superseded unknown", "pre-failure work", "baseline vs aware", "bitemporal", "emmimal alexander", "towards data science"],
    component: lazy(() => import("../validityLayer/ValidityLayerTab.jsx"))
  },
  {
    id: "memeng",
    label: "Memory Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⚡",
    keywords: ["memory engineering", "persistent memory", "long-term"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MemoryEngineeringTab })))
  },
  {
    id: "memhierarchy",
    label: "Memory Hierarchy & Lifecycle",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🗂️",
    keywords: ["memory hierarchy", "working episodic semantic", "memgpt", "forgetting", "salience", "PII quarantine", "personalization", "cold archive"],
    component: lazy(() => import("../memHierarchy/MemHierarchyTab.jsx"))
  },
  {
    id: "longcontext",
    label: "Long-Context Tactics",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "📏",
    keywords: ["long context", "lost in the middle", "needle haystack", "context compression", "compaction", "retrieve then read", "anchors"],
    component: lazy(() => import("../longContext/LongContextTab.jsx"))
  },
  {
    id: "contextlimits",
    label: "1M Context Limits & Working Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    keywords: ["1m context window", "working memory", "bapo model", "tobias schnabel", "microsoft research", "variable tracking", "bapo hard", "bapo easy"],
    component: lazy(() => import("../contextLimits/ContextLimitsTab.jsx"))
  },

  // ── Umbrella 4 — Agent Systems & Frameworks ──────────────────────
  {
    id: "fiveassets",
    label: "5 Assets for Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📦",
    keywords: ["five assets", "tools", "evals", "prompts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FiveAssetsTab })))
  },
  {
    id: "redesign",
    label: "Redesign Work First",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏗️",
    keywords: ["redesign work", "process", "automation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RedesignWorkTab })))
  },
  {
    id: "projectprepframework",
    label: "Solve the Right Problem: 6-Doc Prep",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🧭",
    keywords: ["solve the right problem", "project preparation framework", "agentic ai", "PID", "discovery report", "functional requirements", "technical requirements", "governance RACI", "roadmap", "reversibility", "mike huls", "towards data science"],
    component: lazy(() => import("../projectPrepFramework/ProjectPrepFrameworkTab.jsx"))
  },
  {
    id: "agentplanner",
    label: "Agent Planning Patterns",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔁",
    keywords: ["planner", "react", "plan execute", "reflexion", "tree of thoughts", "step cap", "stall detection", "verifier"],
    component: lazy(() => import("../agentPlanner/AgentPlannerTab.jsx"))
  },
  {
    id: "agenthitl",
    label: "Human-in-the-Loop Gates",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛂",
    keywords: ["human in the loop", "hitl", "approval gate", "autonomy ladder", "escalation", "audit", "risk score"],
    component: lazy(() => import("../agentHITL/AgentHITLTab.jsx"))
  },
  {
    id: "agenta2a",
    label: "A2A & Agent Mesh",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📡",
    keywords: ["a2a", "agent to agent", "supervisor", "mesh", "handoff chain", "mcp", "blackboard", "registry"],
    component: lazy(() => import("../agentA2A/AgentA2ATab.jsx"))
  },
  {
    id: "agentsandbox",
    label: "Agent Sandboxing & Tool Safety",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏰",
    keywords: ["sandbox", "tool safety", "deny by default", "confused deputy", "idempotency", "secrets broker", "gvisor", "firecracker"],
    component: lazy(() => import("../agentSandbox/AgentSandboxTab.jsx"))
  },
  {
    id: "agentevals",
    label: "Agent Evals & Red-Teaming",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🧪",
    keywords: ["agent evals", "tau bench", "pass^k", "red team", "prompt injection", "jailbreak", "goal drift", "refusal"],
    component: lazy(() => import("../agentEvals/AgentEvalsTab.jsx"))
  },
  {
    id: "handoffwatch",
    label: "Handoff Watchdogs: Seam Evals",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "👻",
    keywords: ["handoff watchdog", "intermediate state eval", "silent failure", "empty 200", "plausible but wrong", "confidence floor", "benjamin nweke", "towards data science"],
    component: lazy(() => import("../handoffWatch/HandoffWatchTab.jsx"))
  },
  {
    id: "verifiedpipes",
    label: "Verified Pipelines vs Human Review",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    keywords: ["verified pipelines", "human review", "policy as code", "ai code bugs", "dora", "review theater", "octopus", "farcic"],
    component: lazy(() => import("../verifiedPipes/VerifiedPipesTab.jsx"))
  },
  {
    id: "codingevals",
    label: "Coding-Agent Evals: Evaluate the Work",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    keywords: ["coding agents", "executable contracts", "six layers", "trial statistics", "swe-bench", "terminal-bench", "hidden tests", "pete hampton", "anthropic evals"],
    component: lazy(() => import("../codingEvals/CodingEvalsTab.jsx"))
  },
  {
    id: "claudecode100",
    label: "Solving 100+ Tasks with Claude Code",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["claude code", "100 tasks", "sub-agents", "worktree", "git worktree", "task triage", "task bifurcation", "html report", "verification report", "linear", "slack bot", "towards data science", "autonomous coding"],
    component: lazy(() => import("../claudeCode100/ClaudeCode100Tab.jsx"))
  },
  {
    id: "typedagentgate",
    label: "Typed Tools, Hard Bounds & Gates",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    keywords: ["typed tools", "hard bounds", "composer gate", "agent governance", "search box", "miodrag cekikj", "8 tools", "80-line loop", "contradiction refusal", "escalation architecture", "graph traversal", "time-valid edges", "towards data science"],
    component: lazy(() => import("../typedAgentGate/TypedAgentGateTab.jsx"))
  },
  {
    id: "agentpairprogramming",
    label: "How to Work with AI Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    keywords: ["ai coding agents", "pair programming", "sara metwalli", "task decomposition", "test-driven", "context injection", "vibe coding", "human in the loop", "token optimization", "token savings", "/compact", "cache read", "input output tokens", "batch commands", "scoped prompts", "towards data science"],
    component: lazy(() => import("../agentPairProgramming/AgentPairTab.jsx"))
  },
  {
    id: "vibecode",
    label: "Vibe-Coding Unit Economics",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎸",
    keywords: ["vibe coding", "unit economics", "ukuflow", "minimum viable offer", "static first", "thuwarakesh", "towards data science"],
    component: lazy(() => import("../vibeCode/VibeCodeTab.jsx"))
  },
  {
    id: "agentsastools",
    label: "Agents as Tools",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛠️",
    keywords: ["agents as tools", "sub-agents", "tool calling"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentsAsToolsTab })))
  },
  {
    id: "toolcalling",
    label: "Function Calling Basics",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📞",
    keywords: ["function calling", "tool calling", "json schema", "parallel calls", "openai tools", "anthropic tool use", "bridge", "data to agents"],
    component: lazy(() => import("../toolCalling/ToolCallingTab.jsx"))
  },
  {
    id: "agenttasks",
    label: "11 Agent Task Archetypes",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📋",
    keywords: ["agent tasks", "archetypes", "worktree", "evaluation", "task planning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentTasksTab })))
  },
  {
    id: "cliagent",
    label: "Local CLI Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤖",
    keywords: ["cli agent", "ollama", "python", "subprocess", "qwen"],
    component: lazy(() => import("../cliAgents/CliAgentTab.jsx"))
  },
  {
    id: "codingagentsnonprog",
    label: "Non-Prog Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚡",
    keywords: ["coding agents", "non-programmers", "no-code"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CodingAgentsNonProgTab })))
  },
  {
    id: "multiagent",
    label: "Multi-Agent Pipelines",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "◈",
    keywords: ["multi-agent", "orchestration", "handoffs"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MultiAgentTab })))
  },
  {
    id: "multiagentcoord",
    label: "Multi-Agent Coordination",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    keywords: ["multi-agent coordination", "specialist agents", "coordinator", "typed findings", "contradiction detection", "risk routing", "model selection", "naveen goel", "towards data science"],
    component: lazy(() => import("../multiAgentCoordination/MultiAgentCoordinationTab.jsx"))
  },
  {
    id: "modelrouting",
    label: "Adaptive Model Routing",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎯",
    keywords: ["model routing", "adaptive router", "tiers", "jit planning", "inference cost", "fast balanced powerful", "partha sarkar", "towards data science"],
    component: lazy(() => import("../modelRouting/ModelRoutingTab.jsx"))
  },
  {
    id: "langchain",
    label: "LangChain Ecosystem",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🦜",
    keywords: ["langchain", "framework", "chains", "lcel", "pipeline", "prompts", "models", "parsers", "lang chain"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangChainTab })))
  },
  {
    id: "langgraph",
    label: "LangGraph Stateful Graphs",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🕸️",
    keywords: ["langgraph", "state graph", "nodes", "edges", "hitl", "human in the loop", "checkpointing", "cyclic", "multi-agent", "lang graph"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangGraphTab })))
  },
  {
    id: "agentmemory",
    label: "Agent Memory: Short & Long-Term",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "💾",
    keywords: ["agent memory", "short-term memory", "long-term memory", "conversation buffer", "summarization", "vector store memory", "episodic", "semantic", "procedural", "memory poisoning", "memory lifecycle", "forgetting"],
    component: lazy(() => import("../agentMemory/AgentMemoryTab.jsx"))
  },
  {
    id: "frameworkcompare",
    label: "Agent Framework Comparison",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    keywords: ["compare", "langchain vs langgraph", "comparison", "evaluation", "frameworks", "langchain", "langgraph"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompareTab })))
  },
  {
    id: "agentdebugging",
    label: "AI Agent Debugging",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🐞",
    keywords: ["debugging", "tool errors", "traces", "inspection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentDebuggingTab })))
  },
  {
    id: "agentscale",
    label: "High-Scale Agent Systems",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["high-scale", "millions requests", "production"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HighScaleAgentsTab })))
  },
  {
    id: "modeldeploy",
    label: "Model Deployment",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📦",
    keywords: ["model deployment", "docker", "fastapi", "ec2", "containerization", "ml deployment", "ibrahim salami", "towards data science"],
    component: lazy(() => import("../modelDeployment/ModelDeploymentTab.jsx"))
  },
  {
    id: "aiproductbuilder",
    label: "AI Product Builder",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔨",
    keywords: ["product builder", "prd", "cursorrules", "architecture", "system spec"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIProductBuilderTab })))
  },
  {
    id: "capstone2",
    label: "Capstone 2: Research Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏆",
    keywords: ["capstone", "boss fight", "multi-agent report", "token dashboard", "kill drill", "loop 2", "synthesis"],
    component: lazy(() => import("../capstone2/Capstone2Tab.jsx"))
  },
  {
    id: "mcpclient",
    label: "MCP: Model Context Protocol",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔌",
    keywords: ["mcp", "model context protocol", "mcp server", "mcp client", "tools", "resources", "prompts", "streamlit", "remote mcp server", "deepwiki", "huggingface", "json-rpc 2.0", "stdio", "streamable http", "tool calling"],
    component: lazy(() => import("../mcpClient/MCPClientTab.jsx"))
  },
  {
    id: "agentsdk",
    label: "Agents SDK: Handoffs & Tools",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    keywords: ["agents sdk", "handoff", "triage", "agents as tools", "orchestrator", "openai agents", "streamlit", "iqbal rahmadhan", "towards data science"],
    component: lazy(() => import("../agentsSDK/AgentsSDKTab.jsx"))
  },
  {
    id: "loopengineering",
    label: "Loop Engineering",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "∞",
    keywords: ["loop engineering", "ralph loop", "ralf", "ralphex", "boris cherny", "peter steinberger", "goal loop", "loop library", "69 loops", "claude basics", "cross-model review", "autonomous agent loops"],
    component: lazy(() => import("../loopEngineering/LoopEngineeringTab.jsx"))
  },

  // ── Umbrella 5 — Data & Platform Layers ─────────────────────
  {
    id: "threelayers",
    label: "3 Engineering Layers",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏗️",
    keywords: ["3 layers", "prompt", "context", "loop", "anthropic"],
    component: lazy(() => import("../engineeringLayers/ThreeLayersTab.jsx"))
  },
  {
    id: "docstruct",
    label: "Document Structure & Loop",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📐",
    keywords: ["document structure", "pdf parsing", "toc", "loop"],
    component: lazy(() => import("../documentStructure/DocumentStructureTab.jsx"))
  },
  {
    id: "agenticparsing",
    label: "Agentic Parsing Dispatcher",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["agentic parsing", "dispatcher", "pdf nature", "docling", "fitz", "easyocr", "pick richer", "brick 1"],
    component: lazy(() => import("../agenticParsing/AgenticParsingTab.jsx"))
  },
  {
    id: "knowledgebase",
    label: "Efficient Knowledge Base",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🌱",
    keywords: ["knowledge base", "efficient knowledge base", "top 10 questions", "cleansing", "deduplication", "hnsw", "ivf", "flat", "rbac", "freshness ttl", "17"],
    component: lazy(() => import("../knowledgeBase/KnowledgeBaseTab.jsx"))
  },
  {
    id: "vectordbops",
    label: "Vector-DB Ops & Indexing",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🗜️",
    keywords: ["vector db", "hnsw", "ivf", "pq", "flat index", "qdrant", "milvus", "pgvector", "recall@k", "ram sizing"],
    component: lazy(() => import("../vectorDBOps/VectorDBOpsTab.jsx"))
  },
  {
    id: "datapipeline",
    label: "Streaming + Lineage + Versioning",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌊",
    keywords: ["streaming", "kafka", "flink", "lineage", "openlineage", "dvc", "lakefs", "partitions", "schema registry"],
    component: lazy(() => import("../dataPipeline/DataPipelineTab.jsx"))
  },
  {
    id: "aidataplat",
    label: "AI-Native Data Platform",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    keywords: ["data platform", "ai-native", "bigquery"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIDataPlatformTab })))
  },
  {
    id: "medallionarch",
    label: "Medallion Architecture",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🥉",
    keywords: ["medallion", "bronze", "silver", "gold", "data lakehouse"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MedallionArchTab })))
  },
  {
    id: "aitestdatabottleneck",
    label: "AI Test Data Bottleneck",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🧪",
    keywords: ["test data", "synthetic data", "bottleneck"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AITestDataBottleneckTab })))
  },
  {
    id: "classicalml",
    label: "Classical ML Tools",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📊",
    keywords: ["classical ml", "scikit-learn", "xgboost"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClassicalMLTab })))
  },
  {
    id: "frauddetectionml",
    label: "Production ML: 6 Fraud Models",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "💳",
    keywords: ["fraud detection", "production ml", "benjamin nweke", "nairashield", "lightgbm", "xgboost", "catboost", "latency sla", "cost matrix", "treeshap", "explainability", "towards data science"],
    component: lazy(() => import("../fraudDetectionML/FraudDetectionTab.jsx"))
  },
  {
    id: "modernioformats",
    label: "Fast Data I/O: Parquet, Arrow & DuckDB",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚡",
    keywords: ["parquet", "arrow", "feather", "duckdb", "polars", "pd.read_csv", "csv", "data io", "avi chawla", "columnar", "predicate pushdown", "zero-copy", "towards data science"],
    component: lazy(() => import("../modernIOFormats/ModernIOTab.jsx"))
  },
  {
    id: "pythonprofiling",
    label: "Python Performance Profiling",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⏱️",
    keywords: ["python profiling", "cprofile", "snakeviz", "line_profiler", "scalene", "performance", "vectorization", "thomas reid", "tottime", "cumtime", "towards data science"],
    component: lazy(() => import("../pythonProfiling/PythonProfilingTab.jsx"))
  },
  {
    id: "pythonengineering",
    label: "5 Python Engineering Simulators",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚙️",
    keywords: ["computational engineering", "fea", "finite element", "pid controller", "harmonic oscillator", "rankine cycle", "andrew joseph davies", "scipy", "solve_ivp", "towards data science"],
    component: lazy(() => import("../pythonEngineering/PythonEngineeringTab.jsx"))
  },
  {
    id: "functools",
    label: "functools Power Tricks",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🐍",
    keywords: ["functools", "total_ordering", "partial", "singledispatch", "lru_cache", "decorators", "python tricks", "christopher tao", "towards data science"],
    component: lazy(() => import("../functools/FunctoolsTab.jsx"))
  },
  {
    id: "activelearn",
    label: "Active Learning",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["active learning", "annotation", "uncertainty"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ActiveLearningTab })))
  },
  {
    id: "goaltracker",
    label: "2026 Goal Tracker Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    keywords: ["goal tracker", "vision board", "streamlit", "neon", "postgres", "sabrine bendimerad", "practical lab", "habits", "2026", "metrics"],
    component: lazy(() => import("../goalTracker/GoalTrackerTab.jsx"))
  },
  {
    id: "vaes",
    label: "Variational Autoencoders (VAEs)",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    keywords: ["variational autoencoders", "vaes", "elbo", "reparameterization trick", "kl divergence", "latent space", "slava efimov", "generative ai"],
    component: lazy(() => import("../vaes/VAETab.jsx"))
  },
  {
    id: "keras3",
    label: "Keras 3.0 Multi-Backend Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚡",
    keywords: ["keras 3.0", "pytorch backend", "jax backend", "tensorflow", "nmt", "encoder decoder", "peng qian", "multi-backend"],
    component: lazy(() => import("../keras3/Keras3Tab.jsx"))
  },
  {
    id: "byol",
    label: "BYOL Self-Supervised Learning",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🧬",
    keywords: ["bootstrap your own latent", "byol", "self-supervised learning", "grill et al", "deepmind", "ema", "no negative pairs", "online target network"],
    component: lazy(() => import("../byol/BYOLTab.jsx"))
  },
  {
    id: "xlstm",
    label: "LSTMs & xLSTMs Deep Dive",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    keywords: ["lstm", "xlstm", "slstm", "mlstm", "exponential gating", "matrix memory", "hochreiter", "hand calculation", "recurrent neural networks"],
    component: lazy(() => import("../xlstm/XLSTMTab.jsx"))
  },
  {
    id: "timeseriesanomaly",
    label: "Time Series Anomaly Autoencoder",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📈",
    keywords: ["time series anomaly", "autoencoders", "reconstruction error", "mse loss", "1d cnn", "percentile threshold", "unsupervised anomaly detection"],
    component: lazy(() => import("../tsAnomaly/TSAnomalyTab.jsx"))
  },
  {
    id: "aiusecases",
    label: "3 Enterprise AI Use Cases",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🚀",
    keywords: ["3 ai use cases", "beyond chatbot", "feature engineering", "text embeddings", "lead scoring", "unstructured data", "enterprise ai"],
    component: lazy(() => import("../aiUseCases/AIUseCasesTab.jsx"))
  },
  {
    id: "linearregression",
    label: "Linear Regression & Gradient Descent",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📐",
    keywords: ["linear regression", "cost function", "gradient descent", "mse", "mae", "house pricing", "weight update", "optimization"],
    component: lazy(() => import("../linearRegression/LinearRegressionTab.jsx"))
  },
  {
    id: "pandasdataframes",
    label: "Pandas DataFrames Fundamentals",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🐼",
    keywords: ["pandas dataframes", "numpy arrays", "ndarrays", "dataframe initialization", "read_csv", "dictionaries", "in-memory analytics"],
    component: lazy(() => import("../pandasDataframes/PandasDataFrameTab.jsx"))
  },
  {
    id: "pandasmem",
    label: "Pandas Memory Optimization",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🧠",
    keywords: ["pandas memory", "usecols", "dtype", "category", "sparse", "chunksize", "inplace", "avi chawla", "towards data science"],
    component: lazy(() => import("../pandasMem/PandasMemTab.jsx"))
  },
  {
    id: "geopopviz",
    label: "Geospatial Population Viz",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🛰️",
    keywords: ["geospatial", "worldpop", "facebook hrsl", "gadm", "raster", "choropleth", "geopandas", "plotly", "parvathy krishnan", "towards data science"],
    component: lazy(() => import("../geoPopViz/GeoPopTab.jsx"))
  },
  {
    id: "datahumanization",
    label: "Data Humanization & Storytelling",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "💡",
    keywords: ["data humanization", "data storytelling", "scintillating grid", "data artisan", "aida", "scqa", "symptom kpi", "humanized insight", "roi", "data-rich action-poor"],
    component: lazy(() => import("../dataHumanization/DataHumanizationTab.jsx"))
  },
  {
    id: "llmfinetuning",
    label: "LLM Fine-Tuning & QLoRA Guide",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    keywords: ["model fine tuning", "fine-tuning", "fine tuning", "llm fine tuning", "qlora", "lora", "peft", "4-bit nf4", "double quantization", "paged optimizers", "instruction backtranslation", "sfttrainer", "single gpu", "dpo", "rlhf", "unsloth", "axolotl", "merge_and_unload"],
    component: lazy(() => import("../llmFinetuning/LLMFinetuningTab.jsx"))
  },

  // ── Umbrella 6 — Production & Frontiers ─────────────────────
  {
    id: "finops",
    label: "FinOps & Cost Governance",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💸",
    keywords: ["finops", "cost governance", "token bill", "semantic cache", "model routing", "budgets", "savings"],
    component: lazy(() => import("../finOps/FinOpsTab.jsx"))
  },
  {
    id: "observability",
    label: "AI Observability & Tracing",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📡",
    keywords: ["observability", "tracing", "opentelemetry", "langsmith", "langfuse", "spans", "sampling", "monitoring"],
    component: lazy(() => import("../aiObservability/AIObservabilityTab.jsx"))
  },
  {
    id: "slmedge",
    label: "Edge SLMs & Distillation",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📱",
    keywords: ["slm", "small language models", "distillation", "phi", "smollm", "qwen", "edge inference", "gguf", "speculative decoding"],
    component: lazy(() => import("../slmEdge/SlmEdgeTab.jsx"))
  },
  {
    id: "visionlanguage",
    label: "Vision-Language Models (VLM)",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🖼️",
    keywords: ["vlm", "vision language models", "multimodal", "vit", "vision transformer", "llava", "paligemma", "clip", "siglip", "patches", "cross-modal connector", "q-former", "vqa", "visual question answering", "multimodal rag"],
    component: lazy(() => import("../visionLanguageModels/VisionLanguageTab.jsx"))
  },
  {
    id: "diffusionmodels",
    label: "Diffusion Models & DiT",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎨",
    keywords: ["diffusion", "diffusion models", "dit", "diffusion transformers", "stable diffusion", "flux", "sora", "cfg", "classifier free guidance", "latent diffusion", "ddpm", "ddim", "score matching", "flow matching", "denoising"],
    component: lazy(() => import("../diffusionModels/DiffusionTab.jsx"))
  },
  {
    id: "speechvoice",
    label: "Speech AI & Voice Agents",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎙️",
    keywords: ["speech", "voice", "whisper", "asr", "tts", "speech-to-speech", "voice agent", "mel-spectrogram", "encodec", "rvq", "audio codec", "silero vad", "audio tokenization"],
    component: lazy(() => import("../speechVoiceAI/SpeechVoiceTab.jsx"))
  },
  {
    id: "tokenbill",
    label: "3× Token Bill Fix",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💸",
    keywords: ["token bill", "cost optimization", "pricing"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.TokenBillTab })))
  },
  {
    id: "llmevals",
    label: "LLM Evals Quality Gate",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚖️",
    keywords: ["llm evals", "evals based on vibes", "missing layer", "attribution", "specificity", "quality gate", "serve retry block", "regression", "product manager", "pm eval", "julia winn", "spam filter", "tax chatbot", "recsys", "eval to launch", "gsm-symbolic", "gsm-noop", "apple benchmark", "true reasoning", "maxime jabarian", "benchmark contamination"],
    component: lazy(() => import("../llmEvals/LLMEvalLayerTab.jsx"))
  },
  {
    id: "modelvalidation",
    label: "GenAI Validation Playbook (Banking)",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    keywords: ["model validation", "sr 11-7", "banking", "risk tiering", "conceptual soundness", "outcomes analysis", "monitoring", "judge the judge", "robustness", "ananya", "towards data science"],
    component: lazy(() => import("../modelValidation/ModelValidationTab.jsx"))
  },
  {
    id: "reasoningbench",
    label: "LLM Reasoning & GSM-Symbolic",
    umbrellaId: "frontiers_production",
    category: "Production & Frontiers",
    icon: "🔬",
    keywords: ["gsm-symbolic", "gsm-noop", "apple benchmark", "true reasoning", "maxime jabarian", "benchmark contamination", "llm reasoning", "symbolic mutation", "noise collapse"],
    component: lazy(() => import("../reasoningBench/ReasoningBenchTab.jsx"))
  },
  {
    id: "practices",
    label: "Best Practices",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "✓",
    keywords: ["best practices", "guidelines", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PracticesTab })))
  },
  {
    id: "powerfeatures",
    label: "Power Features",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["power features", "advanced", "optimizations"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PowerFeaturesTab })))
  },
  {
    id: "ragbeyond",
    label: "Beyond RAG",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔮",
    keywords: ["beyond rag", "future architectures", "agents"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGBeyondTab })))
  },
  {
    id: "frontiers",
    label: "Research Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔬",
    keywords: ["research frontiers", "state of art", "future"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ResearchFrontiersTab })))
  },
  {
    id: "progress",
    label: "Progress Tracker",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["progress", "tracking", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProgressTab })))
  },
  {
    id: "guardrails",
    label: "Responsible AI & Security Guardrails",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🛡️",
    keywords: ["responsible ai", "guardrails", "pii redaction", "author redaction", "copyright protection", "ip leak defense", "prompt injection", "jailbreak defense", "llama guard", "nemo guardrails"],
    component: lazy(() => import("../guardrails/GuardrailsTab.jsx"))
  },
  {
    id: "llmreliability",
    label: "LLM Reliability & Fault Tolerance",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚙️",
    keywords: ["llm reliability", "fault tolerance", "xml tags", "markup tags", "pydantic validation", "exponential backoff", "multi-provider fallback", "fallback chain", "stochastic"],
    component: lazy(() => import("../llmReliability/LLMReliabilityTab.jsx"))
  },
  {
    id: "enterpriseaiops",
    label: "Enterprise AI Architecture & Operations",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    keywords: ["enterprise ai", "ai architecture", "ai operations", "token limits", "token governance", "ai gateway", "semantic cache", "model routing", "map reduce", "reranker", "token compression", "finops", "lost in the middle"],
    component: lazy(() => import("../enterpriseAIOps/EnterpriseAIOpsTab.jsx"))
  },
  {
    id: "enterprisegrade",
    label: "Enterprise-Grade AI: End-to-End",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏭",
    keywords: ["enterprise grade", "end to end", "mlops", "drift", "bias", "crisp-dm", "readiness", "buy-in", "caroline zaborowski", "towards data science"],
    component: lazy(() => import("../enterpriseGrade/EnterpriseGradeTab.jsx"))
  },
  {
    id: "productionragops",
    label: "Production RAG & AgentOps",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["agentops", "mlops", "earned complexity", "rag complexity", "faq as rag", "semantic cache", "noisy text", "ocr", "typos", "levenshtein", "symspell", "pass^k", "tau-bench", "compounding errors", "hard loop cap", "opentelemetry", "towards data science"],
    component: lazy(() => import("../productionRAGOps/ProductionRAGOpsTab.jsx"))
  },
  {
    id: "tokenorchestrationplaybook",
    label: "Enterprise AI Token Management & Orchestration Playbook",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📖",
    keywords: ["token playbook", "enterprise ai playbook", "docker", "kubernetes", "langsmith", "ragas", "pytest", "asyncio", "ainvoke", "abatch", "redis stack", "qdrant", "token governance", "concurrency", "nagaraj y"],
    component: lazy(() => import("../tokenOrchestrationPlaybook/TokenPlaybookTab.jsx"))
  },
  {
    id: "enterpriseadvancedplaybook",
    label: "Enterprise AI Playbook: Advanced Topics",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🤖",
    keywords: ["agentic patterns", "react", "plan and execute", "multi-agent", "supervisor agent", "agent memory", "tools", "opentelemetry", "prometheus", "elk", "grafana", "celery", "ray", "kafka", "consistent hashing", "rate limiting", "redis cluster", "nagaraj y"],
    component: lazy(() => import("../enterpriseAdvancedPlaybook/EnterpriseAdvancedPlaybookTab.jsx"))
  },
  // ── TDS Article Tabs ──────────────────────────────────────────────────────
  {
    id: "textclassificationdata",
    label: "How Much Labeled Data Do You Need?",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "📊",
    keywords: ["text classification", "labeled data", "TF-IDF", "learning curves", "data efficiency", "zero-shot", "LLM vs classical", "towards data science"],
    component: lazy(() => import("../textClassificationData/TextClassificationDataTab.jsx"))
  },
  {
    id: "nsquaredpizza",
    label: "The N² Pizza Problem",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🍕",
    keywords: ["quadratic memory", "N squared", "ML memory", "pizza problem", "cluster matching", "bounding", "decimation", "KD-tree", "towards data science"],
    component: lazy(() => import("../nSquaredPizza/NSquaredPizzaTab.jsx"))
  },
  {
    id: "datacentricai",
    label: "Data-Centric AI",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎯",
    keywords: ["data-centric AI", "model-centric", "label quality", "annotation consistency", "data governance", "towards data science"],
    component: lazy(() => import("../dataCentricAI/DataCentricAITab.jsx"))
  },
  {
    id: "threesentenceprompt",
    label: "Prompt Framework & Methodology",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "✍️",
    keywords: ["prompt engineering", "3 sentences", "plan-first", "better prompts", "AI productivity", "brain dump", "messy prompts", "course correction", "framework", "methodology", "prompt patterns", "prompt framework", "prompt methodology", "quality controller", "prompt optimizer"],
    component: lazy(() => import("../threeSentencePrompt/ThreeSentencePromptTab.jsx"))
  },
  {
    id: "prompt_studio",
    label: "Prompt Studio",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧪",
    keywords: ["prompt studio", "combine prompts", "compose prompt", "build prompt", "prompt builder", "framework + methodology", "generate prompt", "prompt composition", "prompt testing", "prompt evaluation"],
    component: lazy(() => import("../promptStudio/PromptStudioTab.jsx"))
  },
  {
    id: "prompt_frameworks",
    label: "Prompt Frameworks",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📐",
    keywords: ["prompt frameworks", "structure a prompt", "blueprint", "RTCO", "role task context output", "goal context constraints format", "input process output", "problem options decision action", "understand plan execute validate", "prompt template", "prompt structure"],
    component: lazy(() => import("../promptStudio/PromptFrameworksTab.jsx"))
  },
  {
    id: "prompt_methodologies",
    label: "Prompt Methodologies",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧩",
    keywords: ["prompt methodologies", "prompting techniques", "few-shot", "zero-shot", "decomposition", "retrieval-grounded", "self-critique", "constraint-based", "structured-output", "tool-assisted", "iterative prompting", "chain of thought"],
    component: lazy(() => import("../promptStudio/PromptMethodologiesTab.jsx"))
  },
  {
    id: "finassistproject",
    label: "FinAssist: Banking AI Project",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏦",
    keywords: ["banking AI", "MCP", "LangGraph", "compliance", "PII redaction", "RAG", "agentic workflow", "realtime project", "portfolio", "FinAssist"],
    component: lazy(() => import("../finAssistProject/FinAssistProjectTab.jsx"))
  },
  {
    id: "zerocostmultiagent",
    label: "Zero-Cost Multi-Agent on Aging Hardware",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🥔",
    keywords: ["multi-agent", "zero-cost", "aging hardware", "quantized models", "C++ daemons", "Win32", "SwarmForge", "O.D.I.N.", "lazy loading", "hacker noon"],
    component: lazy(() => import("../zeroCostMultiAgent/ZeroCostMultiAgentTab.jsx"))
  },
  {
    id: "multilingualclassification",
    label: "Multilingual Text Classification",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌐",
    keywords: ["multilingual", "BGE-M3", "scikit-llm", "Ollama", "text classification", "embeddings", "logistic regression", "machine learning mastery"],
    component: lazy(() => import("../multilingualClassification/MultilingualClassificationTab.jsx"))
  },
  {
    id: "textclusteringhdbscan",
    label: "Text Clustering with HDBSCAN",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🔬",
    keywords: ["clustering", "HDBSCAN", "UMAP", "sentence-transformers", "topic discovery", "density-based", "unsupervised", "machine learning mastery"],
    component: lazy(() => import("../textClusteringHDBSCAN/TextClusteringHDBSCANTab.jsx"))
  },
  // ── Hub Pages (Phase 1) ───────────────────────────────────────────────────
  {
    id: "fnd_start_hub",
    label: "Start Here",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🚀",
    keywords: ["start", "orientation", "glossary", "first build"],
    component: lazy(() => import("../hubPages/FndStartHubTab.jsx"))
  },
  {
    id: "fnd_internals_hub",
    label: "Model Internals",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧠",
    keywords: ["architecture", "attention", "sampling", "tokens", "serving"],
    component: lazy(() => import("../hubPages/FndInternalsHubTab.jsx"))
  },
  {
    id: "fnd_prompts_hub",
    label: "Prompt Lifecycle",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "✍️",
    keywords: ["prompt engineering", "contracts", "regression", "management"],
    component: lazy(() => import("../hubPages/FndPromptsHubTab.jsx"))
  },
  {
    id: "fnd_mlsoc_hub",
    label: "ML & Society",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚖️",
    keywords: ["alignment", "RL", "dialogue", "topic modeling", "ethics"],
    component: lazy(() => import("../hubPages/FndMlsocHubTab.jsx"))
  },
  {
    id: "fnd_multimodal_hub",
    label: "Multimodal Models",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎨",
    keywords: ["vision", "diffusion", "speech", "multimodal"],
    component: lazy(() => import("../hubPages/FndMultimodalHubTab.jsx"))
  },
  {
    id: "rag_core_hub",
    label: "RAG Core",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🔧",
    keywords: ["pipeline", "chunking", "parsing", "retrieval"],
    component: lazy(() => import("../hubPages/RagCoreHubTab.jsx"))
  },
  {
    id: "rag_precision_hub",
    label: "Retrieval Precision",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🎯",
    keywords: ["rerank", "eval", "tables", "multilingual"],
    component: lazy(() => import("../hubPages/RagPrecisionHubTab.jsx"))
  },
  {
    id: "rag_advanced_hub",
    label: "Advanced RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🚀",
    keywords: ["production", "agents", "graphs", "SQL", "verification"],
    component: lazy(() => import("../hubPages/RagAdvancedHubTab.jsx"))
  },
  {
    id: "rag_practice_hub",
    label: "RAG in Practice",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "📋",
    keywords: ["case studies", "interview prep", "capstone"],
    component: lazy(() => import("../hubPages/RagPracticeHubTab.jsx"))
  },
  {
    id: "ctx_craft_hub",
    label: "Context Craft",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "✂️",
    keywords: ["curation", "hallucination", "measurement", "vagueness"],
    component: lazy(() => import("../hubPages/CtxCraftHubTab.jsx"))
  },
  {
    id: "ctx_memory_hub",
    label: "Memory Systems",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "🧠",
    keywords: ["tiers", "graphs", "company brain", "hierarchy"],
    component: lazy(() => import("../hubPages/CtxMemoryHubTab.jsx"))
  },
  {
    id: "ctx_long_hub",
    label: "Long Context",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "📏",
    keywords: ["limits", "compression", "tactics", "long context"],
    component: lazy(() => import("../hubPages/CtxLongHubTab.jsx"))
  },
  {
    id: "agt_found_hub",
    label: "Agent Foundations",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤖",
    keywords: ["assets", "tools", "prep", "process"],
    component: lazy(() => import("../hubPages/AgtFoundHubTab.jsx"))
  },
  {
    id: "agt_safety_hub",
    label: "Planning & Safety",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    keywords: ["planners", "HITL", "sandboxes", "evals", "gates"],
    component: lazy(() => import("../hubPages/AgtSafetyHubTab.jsx"))
  },
  {
    id: "agt_multi_hub",
    label: "Multi-Agent & Frameworks",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    keywords: ["orchestration", "A2A", "LangChain", "LangGraph", "MCP"],
    component: lazy(() => import("../hubPages/AgtMultiHubTab.jsx"))
  },
  {
    id: "agt_prod_hub",
    label: "Agents in Production",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["CLI", "pair programming", "scale", "product"],
    component: lazy(() => import("../hubPages/AgtProdHubTab.jsx"))
  },
  {
    id: "data_found_hub",
    label: "Data Foundations",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📊",
    keywords: ["pandas", "regression", "I/O", "storytelling"],
    component: lazy(() => import("../hubPages/DataFoundHubTab.jsx"))
  },
  {
    id: "data_docs_hub",
    label: "Document Intelligence",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📄",
    keywords: ["parsing", "KBs", "vector search", "pipelines"],
    component: lazy(() => import("../hubPages/DataDocsHubTab.jsx"))
  },
  {
    id: "data_ml_hub",
    label: "Classical + Self-Supervised ML",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📈",
    keywords: ["ML tools", "fraud", "VAEs", "BYOL", "LSTMs"],
    component: lazy(() => import("../hubPages/DataMlHubTab.jsx"))
  },
  {
    id: "data_scale_hub",
    label: "Platform & Scale",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚙️",
    keywords: ["lakehouse", "profiling", "finetuning", "use cases"],
    component: lazy(() => import("../hubPages/DataScaleHubTab.jsx"))
  },
  {
    id: "fr_eval_hub",
    label: "Eval & Reliability",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "✅",
    keywords: ["evals", "reasoning", "guardrails", "fault tolerance"],
    component: lazy(() => import("../hubPages/FrEvalHubTab.jsx"))
  },
  {
    id: "fr_ops_hub",
    label: "Cost & Ops",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💰",
    keywords: ["FinOps", "tracing", "AgentOps", "playbooks"],
    component: lazy(() => import("../hubPages/FrOpsHubTab.jsx"))
  },
  {
    id: "fr_frontiers_hub",
    label: "Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔮",
    keywords: ["vision", "diffusion", "speech", "edge SLMs"],
    component: lazy(() => import("../hubPages/FrFrontiersHubTab.jsx"))
  },
  {
    id: "aigentools",
    label: "AI Generation Tools",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎨",
    keywords: ["image generation", "text to image", "AI workflows", "simulators", "animations", "tables", "DALL-E", "Midjourney", "Stable Diffusion", "Runway", "context engineering", "JEV", "world models"],
    component: lazy(() => import("../aiGenTools/AiGenToolsTab.jsx"))
  },
  {
    id: "aiharnessquality",
    label: "AI Quality & Harnesses",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔒",
    keywords: ["AI harnesses", "null returns", "coding agents", "guardrails", "pipeline returns", "output verification", "truthful AI", "abstention", "confidence scoring"],
    component: lazy(() => import("../aiHarnessQuality/AiHarnessQualityTab.jsx"))
  },
  {
    id: "aiarchdecisions",
    label: "AI Architecture Decisions",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🧭",
    keywords: ["RAG vs fine-tuning", "agent vs workflow", "tool calling", "code execution", "MCP", "embedding drift", "typesafe AI", "JEV", "architecture decisions"],
    component: lazy(() => import("../aiArchDecisions/AiArchDecisionsTab.jsx"))
  }
];

export const getUmbrellaForTab = (tabId) => {
  const tab = TABS_REGISTRY.find(t => t.id === tabId);
  if (tab && tab.umbrellaId) {
    return UMBRELLA_TOPICS.find(u => u.id === tab.umbrellaId) || null;
  }
  return UMBRELLA_TOPICS.find(u => u.tabs.includes(tabId)) || null;
};

export const getTabById = (tabId) => {
  return TABS_REGISTRY.find(t => t.id === tabId);
};

export const getTabsForUmbrella = (umbrellaId) => {
  const umbrella = UMBRELLA_TOPICS.find(u => u.id === umbrellaId);
  if (!umbrella) return [];
  return umbrella.tabs.map(id => TABS_REGISTRY.find(t => t.id === id)).filter(Boolean);
};
