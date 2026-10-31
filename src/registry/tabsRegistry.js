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
    tabs: ["fnd_start_hub", "fnd_internals_hub", "fnd_prompts_hub", "fnd_mlsoc_hub", "fnd_multimodal_hub", "airoadmap", "overview", "glossary", "reinforcementlearning", "trpo2grpo", "aimoralagency", "humancentric", "dialoguelamda", "modellandscape", "tokenization", "quantserve", "vramconductor", "promptfundamentals", "lstm", "llmsampling", "grokking", "selfattention", "posencoding", "archconcepts", "system1head", "promptmgmt", "promptdependencygraph", "promptcontracts", "promptregression", "structuredoutputs", "topicmodeling", "workflows", "unhobbling", "aiharness", "promptlearning", "visionlanguage", "diffusionmodels", "speechvoice", "datacentricai", "threesentenceprompt", "slashcommands", "ailearning", "reversalcurse", "aigap", "promptalignment", "dupaudit", "harmcauses", "subjectleak", "mlproblems"]
  },
  {
    id: "data_platform",
    title: "Data & Platform Layers",
    icon: "🏗️",
    color: "#3A9B9F",
    dark: "#1F6B6E",
    tabs: ["data_found_hub", "data_docs_hub", "data_ml_hub", "data_scale_hub", "threelayers", "docstruct", "agenticparsing", "knowledgebase", "vectordbops", "datapipeline", "aidataplat", "medallionarch", "aitestdatabottleneck", "classicalml", "frauddetectionml", "modernioformats", "pythonprofiling", "pythonengineering", "nsquaredpizza", "functools", "pydescriptors", "activelearn", "goaltracker", "vaes", "keras3", "byol", "xlstm", "timeseriesanomaly", "aiusecases", "agenticuiworkflow", "linearregression", "pandasdataframes", "pandasmem", "geopopviz", "datahumanization", "llmfinetuning", "multilingualclassification", "textclusteringhdbscan", "forecasttraps"]
  },
  {
    id: "rag_architecture",
    title: "RAG Architectures & Pipelines",
    icon: "⚡",
    color: "#F0A89A",
    dark: "#C47A6A",
    tabs: ["rag_core_hub", "rag_precision_hub", "rag_advanced_hub", "rag_practice_hub", "rag", "pipeline", "completepipeline", "qparseloop", "filtering", "hierrag", "prodrag", "routercheap", "rerankers", "rageval", "multilingualrag", "multimodalrag", "texttosql", "crossdocjoins", "genpatterns", "fourpdfs", "agentfanout", "hallucbricks", "workflowloop", "proxypointer", "agenticrag", "ragcasestudies", "interviewprep", "raginterview", "rowlevelrag", "tablegridrag", "graphtraversalknowledge", "graphrag_system1", "temporalgraphrag", "ragcorpusshapes", "amplifyexpert", "ragchunking", "zerorag", "textclassificationdata", "capstone1", "capstone3"]
  },
  {
    id: "context_memory",
    title: "Context & Memory Engineering",
    icon: "🧠",
    color: "#C9B8E8",
    dark: "#7A6BA8",
    tabs: ["ctx_craft_hub", "ctx_memory_hub", "ctx_long_hub", "ctxeng", "ctxmeasure", "memhierarchy", "longcontext", "vague", "hallucination", "contextgraph", "companybrain", "validitylayer", "memeng", "contextlimits"]
  },
  {
    id: "agents_frameworks",
    title: "Agent Systems & Frameworks",
    icon: "🤖",
    color: "#F0A89A",
    dark: "#C47A6A",
    tabs: ["agt_found_hub", "agt_safety_hub", "agt_multi_hub", "agt_prod_hub", "fiveassets", "redesign", "projectprepframework", "agentplanner", "agenthitl", "agentcontrolplane", "agentlifecycle", "agenta2a", "agentsandbox", "agentevals", "handoffwatch", "verifiedpipes", "codingevals", "claudecode100", "typedagentgate", "agentpairprogramming", "vibecode", "agentsastools", "toolcalling", "agenttasks", "agentmemory", "cliagent", "codingagentsnonprog", "multiagent", "multiagentcoord", "modelrouting", "decision_layer", "langchain", "langgraph", "frameworkcompare", "agentdebugging", "agentscale", "modeldeploy", "aiproductbuilder", "mcpclient", "agentsdk", "loopengineering", "agenticsoftwarefactory", "finassistproject", "zerocostmultiagent", "capstone2", "functionalscars", "refactorhealth", "agentcreativity", "agentorgchart", "synasyncagent", "agentpatterns", "agentuisupply", "interviewmindset"]
  },
  {
    id: "frontiers_production",
    title: "Production & Frontiers",
    icon: "🔮",
    color: "#9B89C4",
    dark: "#6B5E94",
    tabs: ["fr_eval_hub", "fr_ops_hub", "fr_frontiers_hub", "aigentools", "aiharnessquality", "aiarchdecisions", "firstaiapp", "enterpriseadvancedplaybook", "tokenorchestrationplaybook", "productionragops", "enterpriseaiops", "enterprisegrade", "finops", "observability", "slmedge", "speculativedecoding", "tokenbill", "llmevals", "modelvalidation", "reasoningbench", "practices", "powerfeatures", "ragbeyond", "frontiers", "progress", "guardrails", "agentguardrails", "agentobservability", "costtollbooth", "llmreliability", "evalharness"]
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
    component: lazy(() => import("../aiRoadmap/AIRoadmapTab.jsx"))
  },
  {
    id: "overview",
    label: "Home / Overview",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🏠",
    component: lazy(() => import("../tabs/OverviewTabNew.jsx").then(m => ({ default: m.OverviewTab })))
  },
  {
    id: "glossary",
    label: "AI Glossary",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📖",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIGlossaryTab })))
  },
  {
    id: "firstaiapp",
    label: "Building Your First AI App",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🚀",
    component: lazy(() => import("../firstAIApp/FirstAIAppTab.jsx"))
  },
  {
    id: "reinforcementlearning",
    label: "Reinforcement Learning: 3 Baselines & MDPs",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎮",
    component: lazy(() => import("../reinforcementLearning/ReinforcementLearningTab.jsx"))
  },
  {
    id: "trpo2grpo",
    label: "RL Training: TRPO → PPO → GRPO",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎓",
    component: lazy(() => import("../rlTraining/RLTrainingTab.jsx"))
  },
  {
    id: "aimoralagency",
    label: "AI Alignment & Moral Agency",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚖️",
    component: lazy(() => import("../aiMoralAgency/MoralAgencyTab.jsx"))
  },
  {
    id: "humancentric",
    label: "Human-Centric AI Manifesto",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧡",
    component: lazy(() => import("../humanCentric/HumanCentricTab.jsx"))
  },
  {
    id: "aigap",
    label: "Bridging the AI Gap",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🌉",
    component: lazy(() => import("../aiGap/AiGapTab.jsx"))
  },
  {
    id: "dialoguelamda",
    label: "Open-Domain Dialogue & LaMDA",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "💬",
    component: lazy(() => import("../dialogueLaMDA/DialogueLaMDATab.jsx"))
  },
  {
    id: "modellandscape",
    label: "Model Landscape & Selection",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🏛️",
    component: lazy(() => import("../modelLandscape/ModelLandscapeTab.jsx"))
  },
  {
    id: "tokenization",
    label: "Tokenization & Fertility",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔤",
    component: lazy(() => import("../tokenization/TokenizationTab.jsx"))
  },
  {
    id: "quantserve",
    label: "Quantization & Model Serving",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🗜️",
    component: lazy(() => import("../quantServe/QuantServeTab.jsx"))
  },
  {
    id: "vramconductor",
    label: "VRAM Conductor: 3 Agents, 1 GPU",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎫",
    component: lazy(() => import("../vramConductor/VramConductorTab.jsx"))
  },
  {
    id: "promptfundamentals",
    label: "Prompt Engineering & Cognitive Patterns",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "💡",
    component: lazy(() => import("../promptEngineeringFundamentals/PromptFundamentalsTab.jsx"))
  },
  {
    id: "llmsampling",
    label: "LLM Generation & Sampling",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎛️",
    component: lazy(() => import("../llmSampling/LLMSamplingTab.jsx"))
  },
  {
    id: "grokking",
    label: "Grokking: Delayed Generalization",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧩",
    component: lazy(() => import("../grokking/GrokkingTab.jsx"))
  },
  {
    id: "lstm",
    label: "LSTMs: Foundations & Transformers' Rise",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔁",
    component: lazy(() => import("../lstmFoundations/LSTMTab.jsx"))
  },
  {
    id: "selfattention",
    label: "Transformers & Self-Attention",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "👁️",
    component: lazy(() => import("../selfAttention/SelfAttentionTab.jsx"))
  },
  {
    id: "posencoding",
    label: "Positional Encoding for Time Series",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⏱️",
    component: lazy(() => import("../posEncoding/PosEncodingTab.jsx"))
  },
  {
    id: "archconcepts",
    label: "Architecture Concepts",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔬",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ArchConceptsTab })))
  },
  {
    id: "system1head",
    label: "Single-Pass Decision Head",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚡",
    component: lazy(() => import("../system1Head/System1HeadTab.jsx"))
  },
  {
    id: "promptmgmt",
    label: "Prompt Management",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📝",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PromptMgmtTab })))
  },
  {
    id: "promptcontracts",
    label: "Prompt Contracts & Version Gates",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📜",
    component: lazy(() => import("../promptContracts/PromptContractsTab.jsx"))
  },
  {
    id: "promptregression",
    label: "Prompt Regression Detection",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📡",
    component: lazy(() => import("../promptRegression/PromptRegressionTab.jsx"))
  },
  {
    id: "promptdependencygraph",
    label: "Prompt Dependency Graph",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🕸️",
    component: lazy(() => import("../promptDependencyGraph/PromptDependencyGraphTab.jsx"))
  },
  {
    id: "structuredoutputs",
    label: "Structured Outputs",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📐",
    component: lazy(() => import("../structuredOutputs/StructuredOutputsTab.jsx"))
  },
  {
    id: "topicmodeling",
    label: "Topic Modeling 2026",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🌱",
    component: lazy(() => import("../topicModeling/TopicModelingTab.jsx"))
  },
  {
    id: "workflows",
    label: "Claude Workflows",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🚀",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClaudeWorkflowsTab })))
  },
  {
    id: "unhobbling",
    label: "Unhobbling Claude 5",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔓",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.UnhobblingTab })))
  },
  {
    id: "aiharness",
    label: "AI Harness & Training Loops",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚙️",
    component: lazy(() => import("../aiHarness/AIHarnessTab.jsx"))
  },
  {
    id: "promptlearning",
    label: "Prompt Learning & English Feedback",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧠",
    component: lazy(() => import("../promptLearning/PromptLearningTab.jsx"))
  },

  // ── Umbrella 2 — RAG Architectures & Pipelines ──────────────────────────────
  {
    id: "rag",
    label: "9 RAG Architectures",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGTypesTab })))
  },
  {
    id: "pipeline",
    label: "7-Stage Pipeline Sim",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "▶",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PipelineTab })))
  },
  {
    id: "completepipeline",
    label: "Complete 12-Step RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⛓️",
    component: lazy(() => import("../completePipeline/CompletePipelineTab.jsx"))
  },
  {
    id: "qparseloop",
    label: "Question Parsing Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔂",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.QuestionParsingLoopTab })))
  },
  {
    id: "filtering",
    label: "Retrieval = Filtering",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "✦",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FilteringTab })))
  },
  {
    id: "hierrag",
    label: "Hierarchical Retrieval",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HierarchicalRetrievalTab })))
  },
  {
    id: "prodrag",
    label: "Production RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProductionRAGTab })))
  },
  {
    id: "routercheap",
    label: "Zero-Model Fast Router",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⚡",
    component: lazy(() => import("../zeroModelRouter/ZeroModelRouterTab.jsx"))
  },
  {
    id: "genpatterns",
    label: "7 Generation Patterns",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧬",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.GenPatternsTab })))
  },
  {
    id: "fourpdfs",
    label: "One Pipeline, Four PDFs",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📚",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FourPDFsTab })))
  },
  {
    id: "agentfanout",
    label: "Retrieval Under Agent Fan-Out",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌊",
    component: lazy(() => import("../agentFanout/AgentFanoutTab.jsx"))
  },
  {
    id: "hallucbricks",
    label: "4 Verification Bricks",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧱",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucBricksTab })))
  },
  {
    id: "workflowloop",
    label: "Workflow & Loop Dispatcher",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔀",
    component: lazy(() => import("../workflowLoop/WorkflowLoopTab.jsx"))
  },
  {
    id: "proxypointer",
    label: "Proxy-Pointer RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏷️",
    component: lazy(() => import("../proxyPointer/ProxyPointerTab.jsx"))
  },
  {
    id: "agenticrag",
    label: "Agentic RAG Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔍",
    component: lazy(() => import("../agenticRAG/AgenticRAGTab.jsx"))
  },
  {
    id: "ragcasestudies",
    label: "Enterprise Case Studies & Blueprints",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏢",
    component: lazy(() => import("../tabs/RAGCaseStudiesTab.jsx"))
  },
  {
    id: "interviewprep",
    label: "RAG Interview Prep",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🎯",
    component: lazy(() => import("../tabs/InterviewPrepTab.jsx"))
  },
  {
    id: "raginterview",
    label: "30 Senior RAG Answers",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🎓",
    component: lazy(() => import("../ragInterview/RagInterviewTab.jsx"))
  },
  {
    id: "capstone1",
    label: "Capstone 1: RAG Chatbot",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏁",
    component: lazy(() => import("../capstone1/Capstone1Tab.jsx"))
  },
  {
    id: "rowlevelrag",
    label: "Row-Level Table Chunks for RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📊",
    component: lazy(() => import("../rowLevelRAG/RowLevelRAGTab.jsx"))
  },
  {
    id: "rerankers",
    label: "Rerankers & Late Interaction",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🪜",
    component: lazy(() => import("../rerankers/RerankersTab.jsx"))
  },
  {
    id: "rageval",
    label: "RAG Eval Triad & Ship Gates",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📐",
    component: lazy(() => import("../ragEvals/RagEvalTab.jsx"))
  },
  {
    id: "multilingualrag",
    label: "Multilingual RAG Routing",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌍",
    component: lazy(() => import("../multilingualRAG/MultilingualRAGTab.jsx"))
  },
  {
    id: "multimodalrag",
    label: "Multimodal RAG & Vision",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🖼️",
    component: lazy(() => import("../multimodalRAG/MultimodalRAGTab.jsx"))
  },
  {
    id: "texttosql",
    label: "Text-to-SQL Agent Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔗",
    component: lazy(() => import("../textToSQL/TextToSQLTab.jsx"))
  },
  {
    id: "capstone3",
    label: "Capstone 3: Save the Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🚒",
    component: lazy(() => import("../capstone3/Capstone3Tab.jsx"))
  },
  {
    id: "crossdocjoins",
    label: "Cross-Document Table Joins",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧩",
    component: lazy(() => import("../crossDocJoins/CrossDocJoinsTab.jsx"))
  },
  {
    id: "tablegridrag",
    label: "Tables in PDFs: Don't Flatten the Grid",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "▦",
    component: lazy(() => import("../tableGridRAG/TableGridRAGTab.jsx"))
  },
  {
    id: "graphtraversalknowledge",
    label: "Always-Fused Graph Traversal Knowledge Layer",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌐",
    component: lazy(() => import("../graphTraversalKnowledge/GraphTraversalTab.jsx"))
  },
  {
    id: "graphrag_system1",
    label: "GraphRAG: System 1 Decision Layer",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧠",
    component: lazy(() => import("../graphragSystem1/GraphRagSystem1Tab.jsx"))
  },
  {
    id: "temporalgraphrag",
    label: "Temporal Graph RAG: Facts With Dates",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⏳",
    component: lazy(() => import("../temporalGraphRag/TemporalGraphRagTab.jsx"))
  },
  {
    id: "ragcorpusshapes",
    label: "Three Kinds of RAG Corpus & Selection",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    component: lazy(() => import("../ragCorpusShapes/RAGCorpusShapesTab.jsx"))
  },
  {
    id: "amplifyexpert",
    label: "Amplify the Expert (RAG Manifesto)",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📣",
    component: lazy(() => import("../amplifyExpert/AmplifyExpertTab.jsx"))
  },
  {
    id: "ragchunking",
    label: "RAG Chunking Strategy",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "✂️",
    component: lazy(() => import("../ragChunkingStrategy/RAGChunkingStrategyTab.jsx"))
  },

  // ── Umbrella 3 — Context & Memory Engineering ─────────────────────────
  {
    id: "ctxeng",
    label: "Context Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "✶",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextEngineeringTab })))
  },
  {
    id: "ctxmeasure",
    label: "Measuring Quality",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "📐",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextMeasureTab })))
  },
  {
    id: "vague",
    label: "Vague Questions",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "◉",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.VagueQuestionsTab })))
  },
  {
    id: "hallucination",
    label: "Silent Hallucination Loop",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🚨",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucinationLoopTab })))
  },
  {
    id: "contextgraph",
    label: "Context Graph Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⬡",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextGraphTab })))
  },
  {
    id: "companybrain",
    label: "Company Brain Layer",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompanyBrainTab })))
  },
  {
    id: "validitylayer",
    label: "Validity Layer: What's Still True",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧭",
    component: lazy(() => import("../validityLayer/ValidityLayerTab.jsx"))
  },
  {
    id: "memeng",
    label: "Memory Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⚡",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MemoryEngineeringTab })))
  },
  {
    id: "memhierarchy",
    label: "Memory Hierarchy & Lifecycle",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🗂️",
    component: lazy(() => import("../memHierarchy/MemHierarchyTab.jsx"))
  },
  {
    id: "longcontext",
    label: "Long-Context Tactics",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "📏",
    component: lazy(() => import("../longContext/LongContextTab.jsx"))
  },
  {
    id: "contextlimits",
    label: "1M Context Limits & Working Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    component: lazy(() => import("../contextLimits/ContextLimitsTab.jsx"))
  },

  // ── Umbrella 4 — Agent Systems & Frameworks ──────────────────────
  {
    id: "fiveassets",
    label: "5 Assets for Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📦",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FiveAssetsTab })))
  },
  {
    id: "redesign",
    label: "Redesign Work First",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏗️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RedesignWorkTab })))
  },
  {
    id: "projectprepframework",
    label: "Solve the Right Problem: 6-Doc Prep",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🧭",
    component: lazy(() => import("../projectPrepFramework/ProjectPrepFrameworkTab.jsx"))
  },
  {
    id: "interviewmindset",
    label: "Interview Mindset",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎯",
    component: lazy(() => import("../interviewMindset/InterviewMindsetTab.jsx"))
  },
  {
    id: "agentplanner",
    label: "Agent Planning Patterns",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔁",
    component: lazy(() => import("../agentPlanner/AgentPlannerTab.jsx"))
  },
  {
    id: "agenthitl",
    label: "Human-in-the-Loop Gates",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛂",
    component: lazy(() => import("../agentHITL/AgentHITLTab.jsx"))
  },
  {
    id: "agentcontrolplane",
    label: "The Agent Control Plane",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎛️",
    component: lazy(() => import("../agentControlPlane/AgentControlPlaneTab.jsx"))
  },
  {
    id: "agentlifecycle",
    label: "Agent Development Lifecycle",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔄",
    component: lazy(() => import("../agentLifecycle/AgentLifecycleTab.jsx"))
  },
  {
    id: "agenta2a",
    label: "A2A & Agent Mesh",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📡",
    component: lazy(() => import("../agentA2A/AgentA2ATab.jsx"))
  },
  {
    id: "agentsandbox",
    label: "Agent Sandboxing & Tool Safety",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏰",
    component: lazy(() => import("../agentSandbox/AgentSandboxTab.jsx"))
  },
  {
    id: "agentevals",
    label: "Agent Evals & Red-Teaming",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🧪",
    component: lazy(() => import("../agentEvals/AgentEvalsTab.jsx"))
  },
  {
    id: "handoffwatch",
    label: "Handoff Watchdogs: Seam Evals",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "👻",
    component: lazy(() => import("../handoffWatch/HandoffWatchTab.jsx"))
  },
  {
    id: "verifiedpipes",
    label: "Verified Pipelines vs Human Review",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    component: lazy(() => import("../verifiedPipes/VerifiedPipesTab.jsx"))
  },
  {
    id: "agentuisupply",
    label: "Agentic UI & Supply-Chain Risk",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🕸️",
    component: lazy(() => import("../agentUiSupply/AgentUiSupplyTab.jsx"))
  },
  {
    id: "codingevals",
    label: "Coding-Agent Evals: Evaluate the Work",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    component: lazy(() => import("../codingEvals/CodingEvalsTab.jsx"))
  },
  {
    id: "claudecode100",
    label: "Solving 100+ Tasks with Claude Code",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    component: lazy(() => import("../claudeCode100/ClaudeCode100Tab.jsx"))
  },
  {
    id: "typedagentgate",
    label: "Typed Tools, Hard Bounds & Gates",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    component: lazy(() => import("../typedAgentGate/TypedAgentGateTab.jsx"))
  },
  {
    id: "agentpairprogramming",
    label: "How to Work with AI Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    component: lazy(() => import("../agentPairProgramming/AgentPairTab.jsx"))
  },
  {
    id: "vibecode",
    label: "Vibe-Coding Unit Economics",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎸",
    component: lazy(() => import("../vibeCode/VibeCodeTab.jsx"))
  },
  {
    id: "agentsastools",
    label: "Agents as Tools",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛠️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentsAsToolsTab })))
  },
  {
    id: "toolcalling",
    label: "Function Calling Basics",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📞",
    component: lazy(() => import("../toolCalling/ToolCallingTab.jsx"))
  },
  {
    id: "agenttasks",
    label: "11 Agent Task Archetypes",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📋",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentTasksTab })))
  },
  {
    id: "cliagent",
    label: "Local CLI Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤖",
    component: lazy(() => import("../cliAgents/CliAgentTab.jsx"))
  },
  {
    id: "codingagentsnonprog",
    label: "Non-Prog Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚡",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CodingAgentsNonProgTab })))
  },
  {
    id: "multiagent",
    label: "Multi-Agent Pipelines",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "◈",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MultiAgentTab })))
  },
  {
    id: "multiagentcoord",
    label: "Multi-Agent Coordination",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    component: lazy(() => import("../multiAgentCoordination/MultiAgentCoordinationTab.jsx"))
  },
  {
    id: "modelrouting",
    label: "Adaptive Model Routing",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🎯",
    component: lazy(() => import("../modelRouting/ModelRoutingTab.jsx"))
  },
  {
    id: "decision_layer",
    label: "Decision Layer Routing",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔀",
    component: lazy(() => import("../decisionLayer/DecisionLayerTab.jsx"))
  },
  {
    id: "langchain",
    label: "LangChain Ecosystem",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🦜",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangChainTab })))
  },
  {
    id: "langgraph",
    label: "LangGraph Stateful Graphs",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🕸️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangGraphTab })))
  },
  {
    id: "agentmemory",
    label: "Agent Memory: Short & Long-Term",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "💾",
    component: lazy(() => import("../agentMemory/AgentMemoryTab.jsx"))
  },
  {
    id: "frameworkcompare",
    label: "Agent Framework Comparison",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompareTab })))
  },
  {
    id: "agentdebugging",
    label: "AI Agent Debugging",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🐞",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentDebuggingTab })))
  },
  {
    id: "agentscale",
    label: "High-Scale Agent Systems",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HighScaleAgentsTab })))
  },
  {
    id: "modeldeploy",
    label: "Model Deployment",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📦",
    component: lazy(() => import("../modelDeployment/ModelDeploymentTab.jsx"))
  },
  {
    id: "aiproductbuilder",
    label: "AI Product Builder",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔨",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIProductBuilderTab })))
  },
  {
    id: "capstone2",
    label: "Capstone 2: Research Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏆",
    component: lazy(() => import("../capstone2/Capstone2Tab.jsx"))
  },
  {
    id: "mcpclient",
    label: "MCP: Model Context Protocol",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔌",
    component: lazy(() => import("../mcpClient/MCPClientTab.jsx"))
  },
  {
    id: "agentsdk",
    label: "Agents SDK: Handoffs & Tools",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    component: lazy(() => import("../agentsSDK/AgentsSDKTab.jsx"))
  },
  {
    id: "loopengineering",
    label: "Loop Engineering",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "∞",
    component: lazy(() => import("../loopEngineering/LoopEngineeringTab.jsx"))
  },
  {
    id: "agenticsoftwarefactory",
    label: "Agentic Software Factory",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏭",
    component: lazy(() => import("../agenticSoftwareFactory/AgenticSoftwareFactoryTab.jsx"))
  },

  // ── Umbrella 5 — Data & Platform Layers ─────────────────────
  {
    id: "threelayers",
    label: "3 Engineering Layers",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏗️",
    component: lazy(() => import("../engineeringLayers/ThreeLayersTab.jsx"))
  },
  {
    id: "docstruct",
    label: "Document Structure & Loop",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📐",
    component: lazy(() => import("../documentStructure/DocumentStructureTab.jsx"))
  },
  {
    id: "agenticparsing",
    label: "Agentic Parsing Dispatcher",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "⚡",
    component: lazy(() => import("../agenticParsing/AgenticParsingTab.jsx"))
  },
  {
    id: "knowledgebase",
    label: "Efficient Knowledge Base",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🌱",
    component: lazy(() => import("../knowledgeBase/KnowledgeBaseTab.jsx"))
  },
  {
    id: "vectordbops",
    label: "Vector-DB Ops & Indexing",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🗜️",
    component: lazy(() => import("../vectorDBOps/VectorDBOpsTab.jsx"))
  },
  {
    id: "datapipeline",
    label: "Streaming + Lineage + Versioning",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌊",
    component: lazy(() => import("../dataPipeline/DataPipelineTab.jsx"))
  },
  {
    id: "aidataplat",
    label: "AI-Native Data Platform",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIDataPlatformTab })))
  },
  {
    id: "medallionarch",
    label: "Medallion Architecture",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🥉",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MedallionArchTab })))
  },
  {
    id: "aitestdatabottleneck",
    label: "AI Test Data Bottleneck",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🧪",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AITestDataBottleneckTab })))
  },
  {
    id: "classicalml",
    label: "Classical ML Tools",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📊",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClassicalMLTab })))
  },
  {
    id: "frauddetectionml",
    label: "Production ML: 6 Fraud Models",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "💳",
    component: lazy(() => import("../fraudDetectionML/FraudDetectionTab.jsx"))
  },
  {
    id: "modernioformats",
    label: "Fast Data I/O: Parquet, Arrow & DuckDB",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚡",
    component: lazy(() => import("../modernIOFormats/ModernIOTab.jsx"))
  },
  {
    id: "pythonprofiling",
    label: "Python Performance Profiling",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⏱️",
    component: lazy(() => import("../pythonProfiling/PythonProfilingTab.jsx"))
  },
  {
    id: "pythonengineering",
    label: "5 Python Engineering Simulators",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚙️",
    component: lazy(() => import("../pythonEngineering/PythonEngineeringTab.jsx"))
  },
  {
    id: "functools",
    label: "functools Power Tricks",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🐍",
    component: lazy(() => import("../functools/FunctoolsTab.jsx"))
  },
  {
    id: "pydescriptors",
    label: "Python Descriptors",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🪝",
    component: lazy(() => import("../pyDescriptors/PyDescriptorsTab.jsx"))
  },
  {
    id: "activelearn",
    label: "Active Learning",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🎯",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ActiveLearningTab })))
  },
  {
    id: "goaltracker",
    label: "2026 Goal Tracker Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    component: lazy(() => import("../goalTracker/GoalTrackerTab.jsx"))
  },
  {
    id: "vaes",
    label: "Variational Autoencoders (VAEs)",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    component: lazy(() => import("../vaes/VAETab.jsx"))
  },
  {
    id: "keras3",
    label: "Keras 3.0 Multi-Backend Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚡",
    component: lazy(() => import("../keras3/Keras3Tab.jsx"))
  },
  {
    id: "byol",
    label: "BYOL Self-Supervised Learning",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🧬",
    component: lazy(() => import("../byol/BYOLTab.jsx"))
  },
  {
    id: "xlstm",
    label: "LSTMs & xLSTMs Deep Dive",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    component: lazy(() => import("../xlstm/XLSTMTab.jsx"))
  },
  {
    id: "timeseriesanomaly",
    label: "Time Series Anomaly Autoencoder",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📈",
    component: lazy(() => import("../tsAnomaly/TSAnomalyTab.jsx"))
  },
  {
    id: "aiusecases",
    label: "3 Enterprise AI Use Cases",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🚀",
    component: lazy(() => import("../aiUseCases/AIUseCasesTab.jsx"))
  },
  {
    id: "agenticuiworkflow",
    label: "Agentic UI: Analytics in the Inbox",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📧",
    component: lazy(() => import("../agenticUiWorkflow/AgenticUiWorkflowTab.jsx"))
  },
  {
    id: "linearregression",
    label: "Linear Regression & Gradient Descent",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📐",
    component: lazy(() => import("../linearRegression/LinearRegressionTab.jsx"))
  },
  {
    id: "pandasdataframes",
    label: "Pandas DataFrames Fundamentals",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🐼",
    component: lazy(() => import("../pandasDataframes/PandasDataFrameTab.jsx"))
  },
  {
    id: "pandasmem",
    label: "Pandas Memory Optimization",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🧠",
    component: lazy(() => import("../pandasMem/PandasMemTab.jsx"))
  },
  {
    id: "geopopviz",
    label: "Geospatial Population Viz",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🛰️",
    component: lazy(() => import("../geoPopViz/GeoPopTab.jsx"))
  },
  {
    id: "datahumanization",
    label: "Data Humanization & Storytelling",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "💡",
    component: lazy(() => import("../dataHumanization/DataHumanizationTab.jsx"))
  },
  {
    id: "llmfinetuning",
    label: "LLM Fine-Tuning & QLoRA Guide",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    component: lazy(() => import("../llmFinetuning/LLMFinetuningTab.jsx"))
  },

  // ── Umbrella 6 — Production & Frontiers ─────────────────────
  {
    id: "finops",
    label: "FinOps & Cost Governance",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💸",
    component: lazy(() => import("../finOps/FinOpsTab.jsx"))
  },
  {
    id: "observability",
    label: "AI Observability & Tracing",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📡",
    component: lazy(() => import("../aiObservability/AIObservabilityTab.jsx"))
  },
  {
    id: "slmedge",
    label: "Edge SLMs & Distillation",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📱",
    component: lazy(() => import("../slmEdge/SlmEdgeTab.jsx"))
  },
  {
    id: "speculativedecoding",
    label: "Speculative Decoding",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    component: lazy(() => import("../speculativeDecoding/SpeculativeDecodingTab.jsx"))
  },
  {
    id: "visionlanguage",
    label: "Vision-Language Models (VLM)",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🖼️",
    component: lazy(() => import("../visionLanguageModels/VisionLanguageTab.jsx"))
  },
  {
    id: "diffusionmodels",
    label: "Diffusion Models & DiT",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎨",
    component: lazy(() => import("../diffusionModels/DiffusionTab.jsx"))
  },
  {
    id: "speechvoice",
    label: "Speech AI & Voice Agents",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎙️",
    component: lazy(() => import("../speechVoiceAI/SpeechVoiceTab.jsx"))
  },
  {
    id: "tokenbill",
    label: "3× Token Bill Fix",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💸",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.TokenBillTab })))
  },
  {
    id: "llmevals",
    label: "LLM Evals Quality Gate",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚖️",
    component: lazy(() => import("../llmEvals/LLMEvalLayerTab.jsx"))
  },
  {
    id: "modelvalidation",
    label: "GenAI Validation Playbook (Banking)",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    component: lazy(() => import("../modelValidation/ModelValidationTab.jsx"))
  },
  {
    id: "reasoningbench",
    label: "LLM Reasoning & GSM-Symbolic",
    umbrellaId: "frontiers_production",
    category: "Production & Frontiers",
    icon: "🔬",
    component: lazy(() => import("../reasoningBench/ReasoningBenchTab.jsx"))
  },
  {
    id: "practices",
    label: "Best Practices",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "✓",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PracticesTab })))
  },
  {
    id: "powerfeatures",
    label: "Power Features",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PowerFeaturesTab })))
  },
  {
    id: "ragbeyond",
    label: "Beyond RAG",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔮",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGBeyondTab })))
  },
  {
    id: "frontiers",
    label: "Research Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔬",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ResearchFrontiersTab })))
  },
  {
    id: "progress",
    label: "Progress Tracker",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎯",
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProgressTab })))
  },
  {
    id: "guardrails",
    label: "Responsible AI & Security Guardrails",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🛡️",
    component: lazy(() => import("../guardrails/GuardrailsTab.jsx"))
  },
  {
    id: "agentguardrails",
    label: "Architectural Guardrails for Agents",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🚧",
    component: lazy(() => import("../agentGuardrails/AgentGuardrailsTab.jsx"))
  },
  {
    id: "agentobservability",
    label: "Agent Observability: Traces, Spans, Alerts",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📡",
    component: lazy(() => import("../agentObservability/AgentObservabilityTab.jsx"))
  },
  {
    id: "costtollbooth",
    label: "Token Economics: The Cost Tollbooth",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💰",
    component: lazy(() => import("../costTollBooth/CostTollBoothTab.jsx"))
  },
  {
    id: "llmreliability",
    label: "LLM Reliability & Fault Tolerance",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚙️",
    component: lazy(() => import("../llmReliability/LLMReliabilityTab.jsx"))
  },
  {
    id: "enterpriseaiops",
    label: "Enterprise AI Architecture & Operations",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    component: lazy(() => import("../enterpriseAIOps/EnterpriseAIOpsTab.jsx"))
  },
  {
    id: "enterprisegrade",
    label: "Enterprise-Grade AI: End-to-End",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🏭",
    component: lazy(() => import("../enterpriseGrade/EnterpriseGradeTab.jsx"))
  },
  {
    id: "productionragops",
    label: "Production RAG & AgentOps",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    component: lazy(() => import("../productionRAGOps/ProductionRAGOpsTab.jsx"))
  },
  {
    id: "tokenorchestrationplaybook",
    label: "Enterprise AI Token Management & Orchestration Playbook",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "📖",
    component: lazy(() => import("../tokenOrchestrationPlaybook/TokenPlaybookTab.jsx"))
  },
  {
    id: "enterpriseadvancedplaybook",
    label: "Enterprise AI Playbook: Advanced Topics",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🤖",
    component: lazy(() => import("../enterpriseAdvancedPlaybook/EnterpriseAdvancedPlaybookTab.jsx"))
  },
  // ── Article Tabs ──────────────────────────────────────────────────────
  {
    id: "textclassificationdata",
    label: "How Much Labeled Data Do You Need?",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "📊",
    component: lazy(() => import("../textClassificationData/TextClassificationDataTab.jsx"))
  },
  {
    id: "nsquaredpizza",
    label: "The N² Pizza Problem",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🍕",
    component: lazy(() => import("../nSquaredPizza/NSquaredPizzaTab.jsx"))
  },
  {
    id: "datacentricai",
    label: "Data-Centric AI",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎯",
    component: lazy(() => import("../dataCentricAI/DataCentricAITab.jsx"))
  },
  {
    id: "threesentenceprompt",
    label: "Prompt Framework & Methodology",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "✍️",
    component: lazy(() => import("../threeSentencePrompt/ThreeSentencePromptTab.jsx"))
  },
  {
    id: "slashcommands",
    label: "Slash Commands for Better Answers",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⌨️",
    component: lazy(() => import("../slashCommands/SlashCommandsTab.jsx"))
  },
  {
    id: "promptalignment",
    label: "Alignment & Approval Frameworks",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧾",
    component: lazy(() => import("../promptAlignment/PromptAlignmentTab.jsx"))
  },
  {
    id: "dupaudit",
    label: "Duplicate Content Audit",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧬",
    component: lazy(() => import("../dupaudit/DupAuditTab.jsx"))
  },
  {
    id: "harmcauses",
    label: "AI Harms & Technical Causes",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚖️",
    component: lazy(() => import("../harmcauses/HarmCausesTab.jsx"))
  },
  {
    id: "subjectleak",
    label: "Subject Leakage in Evaluation",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧪",
    component: lazy(() => import("../subjectLeak/SubjectLeakTab.jsx"))
  },
  {
    id: "mlproblems",
    label: "Practical ML Problem Framing",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📐",
    component: lazy(() => import("../mlProblems/MLProblemsTab.jsx"))
  },
  {
    id: "finassistproject",
    label: "FinAssist: Banking AI Project",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏦",
    component: lazy(() => import("../finAssistProject/FinAssistProjectTab.jsx"))
  },
  {
    id: "zerocostmultiagent",
    label: "Zero-Cost Multi-Agent on Aging Hardware",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🥔",
    component: lazy(() => import("../zeroCostMultiAgent/ZeroCostMultiAgentTab.jsx"))
  },
  {
    id: "multilingualclassification",
    label: "Multilingual Text Classification",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌐",
    component: lazy(() => import("../multilingualClassification/MultilingualClassificationTab.jsx"))
  },
  {
    id: "textclusteringhdbscan",
    label: "Text Clustering with HDBSCAN",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🔬",
    component: lazy(() => import("../textClusteringHDBSCAN/TextClusteringHDBSCANTab.jsx"))
  },
  // ── Hub Pages (Phase 1) ───────────────────────────────────────────────────
  {
    id: "fnd_start_hub",
    label: "Start Here",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🚀",
    component: lazy(() => import("../hubPages/FndStartHubTab.jsx"))
  },
  {
    id: "fnd_internals_hub",
    label: "Model Internals",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧠",
    component: lazy(() => import("../hubPages/FndInternalsHubTab.jsx"))
  },
  {
    id: "fnd_prompts_hub",
    label: "Prompt Lifecycle",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "✍️",
    component: lazy(() => import("../hubPages/FndPromptsHubTab.jsx"))
  },
  {
    id: "fnd_mlsoc_hub",
    label: "ML & Society",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚖️",
    component: lazy(() => import("../hubPages/FndMlsocHubTab.jsx"))
  },
  {
    id: "fnd_multimodal_hub",
    label: "Multimodal Models",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎨",
    component: lazy(() => import("../hubPages/FndMultimodalHubTab.jsx"))
  },
  {
    id: "rag_core_hub",
    label: "RAG Core",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🔧",
    component: lazy(() => import("../hubPages/RagCoreHubTab.jsx"))
  },
  {
    id: "rag_precision_hub",
    label: "Retrieval Precision",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🎯",
    component: lazy(() => import("../hubPages/RagPrecisionHubTab.jsx"))
  },
  {
    id: "rag_advanced_hub",
    label: "Advanced RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "🚀",
    component: lazy(() => import("../hubPages/RagAdvancedHubTab.jsx"))
  },
  {
    id: "rag_practice_hub",
    label: "RAG in Practice",
    umbrellaId: "rag_architecture",
    category: "RAG Architectures & Pipelines",
    icon: "📋",
    component: lazy(() => import("../hubPages/RagPracticeHubTab.jsx"))
  },
  {
    id: "ctx_craft_hub",
    label: "Context Craft",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "✂️",
    component: lazy(() => import("../hubPages/CtxCraftHubTab.jsx"))
  },
  {
    id: "ctx_memory_hub",
    label: "Memory Systems",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "🧠",
    component: lazy(() => import("../hubPages/CtxMemoryHubTab.jsx"))
  },
  {
    id: "ctx_long_hub",
    label: "Long Context",
    umbrellaId: "context_memory",
    category: "Context & Memory Engineering",
    icon: "📏",
    component: lazy(() => import("../hubPages/CtxLongHubTab.jsx"))
  },
  {
    id: "agt_found_hub",
    label: "Agent Foundations",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤖",
    component: lazy(() => import("../hubPages/AgtFoundHubTab.jsx"))
  },
  {
    id: "agt_safety_hub",
    label: "Planning & Safety",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛡️",
    component: lazy(() => import("../hubPages/AgtSafetyHubTab.jsx"))
  },
  {
    id: "agt_multi_hub",
    label: "Multi-Agent & Frameworks",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤝",
    component: lazy(() => import("../hubPages/AgtMultiHubTab.jsx"))
  },
  {
    id: "agt_prod_hub",
    label: "Agents in Production",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    component: lazy(() => import("../hubPages/AgtProdHubTab.jsx"))
  },
  {
    id: "data_found_hub",
    label: "Data Foundations",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📊",
    component: lazy(() => import("../hubPages/DataFoundHubTab.jsx"))
  },
  {
    id: "data_docs_hub",
    label: "Document Intelligence",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📄",
    component: lazy(() => import("../hubPages/DataDocsHubTab.jsx"))
  },
  {
    id: "data_ml_hub",
    label: "Classical + Self-Supervised ML",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📈",
    component: lazy(() => import("../hubPages/DataMlHubTab.jsx"))
  },
  {
    id: "data_scale_hub",
    label: "Platform & Scale",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚙️",
    component: lazy(() => import("../hubPages/DataScaleHubTab.jsx"))
  },
  {
    id: "fr_eval_hub",
    label: "Eval & Reliability",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "✅",
    component: lazy(() => import("../hubPages/FrEvalHubTab.jsx"))
  },
  {
    id: "fr_ops_hub",
    label: "Cost & Ops",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💰",
    component: lazy(() => import("../hubPages/FrOpsHubTab.jsx"))
  },
  {
    id: "fr_frontiers_hub",
    label: "Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔮",
    component: lazy(() => import("../hubPages/FrFrontiersHubTab.jsx"))
  },
  {
    id: "aigentools",
    label: "AI Generation Tools",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎨",
    component: lazy(() => import("../aiGenTools/AiGenToolsTab.jsx"))
  },
  {
    id: "aiharnessquality",
    label: "AI Quality & Harnesses",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔒",
    component: lazy(() => import("../aiHarnessQuality/AiHarnessQualityTab.jsx"))
  },
  {
    id: "aiarchdecisions",
    label: "AI Architecture Decisions",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🧭",
    component: lazy(() => import("../aiArchDecisions/AiArchDecisionsTab.jsx"))
  },
  {
    id: "functionalscars",
    label: "Functional Scars: Corrections That Run",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🪝",
    component: lazy(() => import("../functionalScars/FunctionalScarsTab.jsx"))
  },
  {
    id: "refactorhealth",
    label: "Refactoring Health Score",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📏",
    component: lazy(() => import("../refactorHealth/RefactorHealthTab.jsx"))
  },
  {
    id: "agentcreativity",
    label: "Agent Creativity: Novelty + Impact",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "💡",
    component: lazy(() => import("../agentCreativity/AgentCreativityTab.jsx"))
  },
  {
    id: "agentorgchart",
    label: "AI Org Chart: Hire, Don't Prompt",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏢",
    component: lazy(() => import("../agentOrgChart/AgentOrgChartTab.jsx"))
  },
  {
    id: "synasyncagent",
    label: "Sync vs Async Agent Execution",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔀",
    component: lazy(() => import("../syncAsyncAgent/SyncAsyncAgentTab.jsx"))
  },
  {
    id: "forecasttraps",
    label: "Forecasting Traps: Leakage Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🪤",
    component: lazy(() => import("../forecastTraps/ForecastTrapsTab.jsx"))
  },
  {
    id: "ailearning",
    label: "Learn Faster with AI",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🎓",
    component: lazy(() => import("../aiLearning/AiLearningTab.jsx"))
  },
  {
    id: "reversalcurse",
    label: "The Reversal Curse",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "↔️",
    component: lazy(() => import("../reversalCurse/ReversalCurseTab.jsx"))
  },
  {
    id: "zerorag",
    label: "Zero-Infra RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧰",
    component: lazy(() => import("../zeroRag/ZeroRagTab.jsx"))
  },
  {
    id: "evalharness",
    label: "Custom Eval Harness",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🧪",
    component: lazy(() => import("../evalHarness/EvalHarnessTab.jsx"))
  },
  {
    id: "agentpatterns",
    label: "Agent Architecture Patterns",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏗️",
    component: lazy(() => import("../agentPatterns/AgentPatternsTab.jsx"))
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
