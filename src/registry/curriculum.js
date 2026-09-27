/**
 * Curriculum Registry — Phase 1 of adaptive learning
 * Hierarchy: umbrella topic → child umbrella → topics
 * Each topic carries: child, level (1 Core / 2 Practitioner / 3 Advanced),
 * prerequisites (topic ids). Pure data + helpers; no UI behavior change.
 */

import { JOURNEY_LOOPS as _JOURNEY } from './diagnostics.js';

export const LEVELS = {
  1: { label: 'L1 · Core', short: 'L1', color: '#5EC4C8', text: '#3A9B9F', blurb: 'Entry points. No prerequisites.' },
  2: { label: 'L2 · Practitioner', short: 'L2', color: '#9B89C4', text: '#7A6BA8', blurb: 'Builds on L1. Hands-on patterns.' },
  3: { label: 'L3 · Advanced', short: 'L3', color: '#F0A89A', text: '#C47A6A', blurb: 'Deep / high-stakes. Needs L2.' }
};

export const CHILD_UMBRELLAS = [
  // ── Foundations & Architecture ──
  { id: 'fnd_start', umbrellaId: 'foundations', title: 'Start Here', blurb: 'First builds, glossary, orientation', order: 1 },
  { id: 'fnd_internals', umbrellaId: 'foundations', title: 'Model Internals', blurb: 'Sampling, attention, models, tokens, serving', order: 2 },
  { id: 'fnd_prompts', umbrellaId: 'foundations', title: 'Prompt Lifecycle', blurb: 'From first prompt to contracts & regression', order: 3 },
  { id: 'fnd_mlsoc', umbrellaId: 'foundations', title: 'ML & Society', blurb: 'RL, alignment, dialogue, topic modeling', order: 4 },
  { id: 'fnd_multimodal', umbrellaId: 'foundations', title: 'Multimodal Models', blurb: 'Vision, diffusion, speech — core modalities, not ops', order: 5 },
  // ── RAG Architectures & Pipelines ──
  { id: 'rag_core', umbrellaId: 'rag_architecture', title: 'RAG Core', blurb: 'Architectures, pipeline, chunking, parsing', order: 1 },
  { id: 'rag_precision', umbrellaId: 'rag_architecture', title: 'Retrieval Precision', blurb: 'Rerank, eval, tables, multilingual, vision', order: 2 },
  { id: 'rag_advanced', umbrellaId: 'rag_architecture', title: 'Advanced RAG', blurb: 'Production, agents, graphs, SQL, verification', order: 3 },
  { id: 'rag_practice', umbrellaId: 'rag_architecture', title: 'RAG in Practice', blurb: 'Case studies, interview prep', order: 4 },
  // ── Context & Memory Engineering ──
  { id: 'ctx_craft', umbrellaId: 'context_memory', title: 'Context Craft', blurb: 'Curation, vagueness, hallucinations, measurement', order: 1 },
  { id: 'ctx_memory', umbrellaId: 'context_memory', title: 'Memory Systems', blurb: 'Tiers, graphs, company brain', order: 2 },
  { id: 'ctx_long', umbrellaId: 'context_memory', title: 'Long Context', blurb: 'Limits, tactics, compression', order: 3 },
  // ── Agent Systems & Frameworks ──
  { id: 'agt_found', umbrellaId: 'agents_frameworks', title: 'Agent Foundations', blurb: 'Assets, assets-first process, prep, tools', order: 1 },
  { id: 'agt_safety', umbrellaId: 'agents_frameworks', title: 'Planning & Safety', blurb: 'Planners, HITL, sandboxes, evals, gates', order: 2 },
  { id: 'agt_multi', umbrellaId: 'agents_frameworks', title: 'Multi-Agent & Frameworks', blurb: 'Orchestration, A2A, LangChain/Graph, MCP', order: 3 },
  { id: 'agt_prod', umbrellaId: 'agents_frameworks', title: 'Agents in Production', blurb: 'CLI, pair programming, scale, product', order: 4 },
  // ── Data & Platform Layers ──
  { id: 'data_found', umbrellaId: 'data_platform', title: 'Data Foundations', blurb: 'Frames, regression, I/O, storytelling', order: 1 },
  { id: 'data_docs', umbrellaId: 'data_platform', title: 'Document Intelligence', blurb: 'Parsing, KBs, vector search, pipelines', order: 2 },
  { id: 'data_ml', umbrellaId: 'data_platform', title: 'Classical + Self-Supervised ML', blurb: 'ML tools, fraud, VAEs, BYOL, LSTMs', order: 3 },
  { id: 'data_scale', umbrellaId: 'data_platform', title: 'Platform & Scale', blurb: 'Lakehouse, profiling, finetuning, use cases', order: 4 },
  // ── Production & Frontiers ──
  { id: 'fr_eval', umbrellaId: 'frontiers_production', title: 'Eval & Reliability', blurb: 'Evals, reasoning, guardrails, fault tolerance', order: 1 },
  { id: 'fr_ops', umbrellaId: 'frontiers_production', title: 'Cost & Ops', blurb: 'FinOps, tracing, AgentOps, playbooks', order: 2 },
  { id: 'fr_frontiers', umbrellaId: 'frontiers_production', title: 'Frontiers', blurb: 'Vision, diffusion, speech, edge SLMs', order: 3 }
];

// TOPIC_META: tabId → { c: childId, l: level 1|2|3, p: [prerequisite tabIds] }
export const TOPIC_META = {
  // ── Hub Pages (Phase 1) ───────────────────────────────────────────────────
  fnd_start_hub: { c: 'fnd_start', l: 1, p: [] },
  fnd_internals_hub: { c: 'fnd_internals', l: 1, p: [] },
  fnd_prompts_hub: { c: 'fnd_prompts', l: 1, p: [] },
  fnd_mlsoc_hub: { c: 'fnd_mlsoc', l: 1, p: [] },
  fnd_multimodal_hub: { c: 'fnd_multimodal', l: 1, p: [] },
  rag_core_hub: { c: 'rag_core', l: 1, p: [] },
  rag_precision_hub: { c: 'rag_precision', l: 1, p: [] },
  rag_advanced_hub: { c: 'rag_advanced', l: 1, p: [] },
  rag_practice_hub: { c: 'rag_practice', l: 1, p: [] },
  ctx_craft_hub: { c: 'ctx_craft', l: 1, p: [] },
  ctx_memory_hub: { c: 'ctx_memory', l: 1, p: [] },
  ctx_long_hub: { c: 'ctx_long', l: 1, p: [] },
  agt_found_hub: { c: 'agt_found', l: 1, p: [] },
  agt_safety_hub: { c: 'agt_safety', l: 1, p: [] },
  agt_multi_hub: { c: 'agt_multi', l: 1, p: [] },
  agt_prod_hub: { c: 'agt_prod', l: 1, p: [] },
  data_found_hub: { c: 'data_found', l: 1, p: [] },
  data_docs_hub: { c: 'data_docs', l: 1, p: [] },
  data_ml_hub: { c: 'data_ml', l: 1, p: [] },
  data_scale_hub: { c: 'data_scale', l: 1, p: [] },
  fr_eval_hub: { c: 'fr_eval', l: 1, p: [] },
  fr_ops_hub: { c: 'fr_ops', l: 1, p: [] },
  fr_frontiers_hub: { c: 'fr_frontiers', l: 1, p: [] },

  // ── Foundations (23) ──
  overview: { c: 'fnd_start', l: 1, p: [] },
  airoadmap: { c: 'fnd_start', l: 1, p: [] },
  glossary: { c: 'fnd_start', l: 1, p: [] },
  firstaiapp: { c: 'fr_ops', l: 1, p: ['promptfundamentals', 'tokenization'] },
  promptfundamentals: { c: 'fnd_prompts', l: 1, p: [] },
  llmsampling: { c: 'fnd_internals', l: 1, p: [] },
  selfattention: { c: 'fnd_internals', l: 1, p: ['llmsampling'] },
  posencoding: { c: 'fnd_internals', l: 2, p: ['selfattention'] },
  trpo2grpo: { c: 'fnd_mlsoc', l: 2, p: ['reinforcementlearning'], deep: true },
  archconcepts: { c: 'fnd_internals', l: 1, p: ['selfattention'] },
  tokenization: { c: 'fnd_internals', l: 1, p: [] },
  modelinternals: { c: 'fnd_internals', l: 1, p: ['archconcepts'] },
  modellandscape: { c: 'fnd_internals', l: 2, p: ['archconcepts'] },
  quantserve: { c: 'fnd_internals', l: 2, p: ['modellandscape'] },
  vramconductor: { c: 'fnd_internals', l: 3, p: ['quantserve'] },
  aiharness: { c: 'fnd_internals', l: 2, p: ['archconcepts'] },
  promptmgmt: { c: 'fnd_prompts', l: 1, p: ['promptfundamentals'] },
  structuredoutputs: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  workflows: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  unhobbling: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  promptlearning: { c: 'fnd_prompts', l: 2, p: ['promptmgmt'] },
  promptdependencygraph: { c: 'fnd_prompts', l: 2, p: ['promptmgmt'] },
  promptcontracts: { c: 'fnd_prompts', l: 3, p: ['promptdependencygraph'] },
  promptregression: { c: 'fnd_prompts', l: 3, p: ['promptdependencygraph'] },
  topicmodeling: { c: 'fnd_mlsoc', l: 2, p: ['firstaiapp'] },
  reinforcementlearning: { c: 'fnd_mlsoc', l: 2, p: ['firstaiapp'] },
  datacentricai: { c: 'fnd_mlsoc', l: 2, p: [] },
  threesentenceprompt: { c: 'fnd_prompts', l: 1, p: ['promptfundamentals'] },
  aimoralagency: { c: 'fnd_mlsoc', l: 2, p: ['reinforcementlearning'] },
  humancentric: { c: 'fnd_mlsoc', l: 2, p: ['aimoralagency'] },
  dialoguelamda: { c: 'fnd_mlsoc', l: 2, p: ['selfattention'] },
  // ── RAG (26) ──
  rag: { c: 'rag_core', l: 1, p: [] },
  pipeline: { c: 'rag_core', l: 1, p: ['rag'] },
  completepipeline: { c: 'rag_core', l: 1, p: ['pipeline'] },
  ragchunking: { c: 'rag_core', l: 1, p: ['rag'] },
  qparseloop: { c: 'rag_core', l: 1, p: ['rag'] },
  filtering: { c: 'rag_core', l: 1, p: ['rag'] },
  ragcorpusshapes: { c: 'rag_core', l: 2, p: ['rag'] },
  amplifyexpert: { c: 'rag_advanced', l: 2, p: ['ragcorpusshapes'] },
  hierrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  rerankers: { c: 'rag_precision', l: 2, p: ['filtering'] },
  rageval: { c: 'rag_precision', l: 2, p: ['filtering'] },
  rowlevelrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  tablegridrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  crossdocjoins: { c: 'rag_precision', l: 2, p: ['tablegridrag'] },
  multilingualrag: { c: 'rag_precision', l: 2, p: ['filtering'] },
  multimodalrag: { c: 'rag_precision', l: 2, p: ['tablegridrag'] },
  textclassificationdata: { c: 'rag_precision', l: 2, p: ['rageval'] },
  prodrag: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  routercheap: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  genpatterns: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  fourpdfs: { c: 'rag_advanced', l: 2, p: ['prodrag'] },
  agentfanout: { c: 'rag_advanced', l: 2, p: ['prodrag'] },
  hallucbricks: { c: 'rag_advanced', l: 3, p: ['rageval'] },
  workflowloop: { c: 'rag_advanced', l: 3, p: ['prodrag'] },
  proxypointer: { c: 'rag_advanced', l: 3, p: ['hierrag'] },
  agenticrag: { c: 'rag_advanced', l: 3, p: ['workflowloop'] },
  graphtraversalknowledge: { c: 'rag_advanced', l: 3, p: ['hierrag'] },
  texttosql: { c: 'rag_advanced', l: 3, p: ['tablegridrag'] },
  capstone3: { c: 'rag_advanced', l: 3, p: ['agenticrag'] },
  ragcasestudies: { c: 'rag_practice', l: 2, p: ['prodrag'] },
  interviewprep: { c: 'rag_practice', l: 2, p: ['rag'] },
  capstone1: { c: 'rag_practice', l: 1, p: ['pipeline'] },
  // ── Context & Memory (10) ──
  ctxeng: { c: 'ctx_craft', l: 1, p: [] },
  vague: { c: 'ctx_craft', l: 1, p: ['ctxeng'] },
  hallucination: { c: 'ctx_craft', l: 2, p: ['ctxeng'] },
  ctxmeasure: { c: 'ctx_craft', l: 2, p: ['ctxeng'] },
  memeng: { c: 'ctx_memory', l: 1, p: ['ctxeng'] },
  memhierarchy: { c: 'ctx_memory', l: 2, p: ['memeng'] },
  contextgraph: { c: 'ctx_memory', l: 2, p: ['memeng'] },
  companybrain: { c: 'ctx_memory', l: 2, p: ['contextgraph'] },
  validitylayer: { c: 'ctx_memory', l: 2, p: ['memhierarchy'] },
  contextlimits: { c: 'ctx_long', l: 1, p: ['ctxeng'] },
  longcontext: { c: 'ctx_long', l: 2, p: ['contextlimits'] },
  // ── Agents & Frameworks (24) ──
  fiveassets: { c: 'agt_found', l: 1, p: [] },
  redesign: { c: 'agt_found', l: 1, p: [] },
  projectprepframework: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  agentsastools: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  toolcalling: { c: 'agt_found', l: 1, p: ['agentsastools'] },
  agenttasks: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  codingagentsnonprog: { c: 'agt_found', l: 1, p: [] },
  agentplanner: { c: 'agt_safety', l: 2, p: ['fiveassets'] },
  agenthitl: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  agentsandbox: { c: 'agt_safety', l: 2, p: ['agenthitl'] },
  agentevals: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  handoffwatch: { c: 'agt_safety', l: 2, p: ['agentevals'] },
  verifiedpipes: { c: 'agt_safety', l: 2, p: ['agentevals'] },
  codingevals: { c: 'agt_safety', l: 2, p: ['agentevals'] },
  agentdebugging: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  typedagentgate: { c: 'agt_safety', l: 2, p: ['agentsandbox'] },
  multiagent: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  multiagentcoord: { c: 'agt_multi', l: 2, p: ['multiagent'] },
  modelrouting: { c: 'agt_multi', l: 2, p: ['multiagent'] },
  agenta2a: { c: 'agt_multi', l: 3, p: ['multiagent'] },
  langchain: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  langgraph: { c: 'agt_multi', l: 3, p: ['langchain'] },
  frameworkcompare: { c: 'agt_multi', l: 2, p: ['langchain'] },
  mcpclient: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  agentsdk: { c: 'agt_multi', l: 2, p: ['multiagent'] },
  loopengineering: { c: 'agt_multi', l: 3, p: ['agentplanner'] },
  finassistproject: { c: 'agt_prod', l: 2, p: ['agentplanner'] },
  zerocostmultiagent: { c: 'agt_prod', l: 2, p: ['agentscale'] },
  multilingualclassification: { c: 'data_ml', l: 2, p: ['classicalml'] },
  textclusteringhdbscan: { c: 'data_ml', l: 2, p: ['classicalml'] },
  cliagent: { c: 'agt_prod', l: 2, p: ['fiveassets'] },
  agentpairprogramming: { c: 'agt_prod', l: 2, p: ['cliagent'] },
  vibecode: { c: 'agt_prod', l: 2, p: ['agentpairprogramming'] },
  claudecode100: { c: 'agt_prod', l: 3, p: ['agentpairprogramming'] },
  agentscale: { c: 'agt_prod', l: 3, p: ['multiagent'] },
  modeldeploy: { c: 'agt_prod', l: 2, p: ['agentscale'] },
  aiproductbuilder: { c: 'agt_prod', l: 2, p: ['projectprepframework'] },
  capstone2: { c: 'agt_prod', l: 2, p: ['multiagent'] },
  // ── Data & Platform (26) ──
  pandasdataframes: { c: 'data_found', l: 1, p: [] },
  pandasmem: { c: 'data_found', l: 1, p: ['pandasdataframes'] },
  geopopviz: { c: 'data_found', l: 1, p: ['pandasdataframes'] },
  linearregression: { c: 'data_found', l: 1, p: [] },
  modernioformats: { c: 'data_found', l: 1, p: ['pandasdataframes'] },
  activelearn: { c: 'data_found', l: 1, p: ['linearregression'] },
  datahumanization: { c: 'data_found', l: 1, p: [] },
  aiusecases: { c: 'data_found', l: 1, p: [] },
  goaltracker: { c: 'data_found', l: 1, p: [] },
  docstruct: { c: 'data_docs', l: 2, p: ['modernioformats'] },
  agenticparsing: { c: 'data_docs', l: 2, p: ['docstruct'] },
  knowledgebase: { c: 'data_docs', l: 2, p: ['docstruct'] },
  vectordbops: { c: 'data_docs', l: 2, p: ['knowledgebase'] },
  datapipeline: { c: 'data_docs', l: 2, p: ['modernioformats'] },
  threelayers: { c: 'data_docs', l: 2, p: ['docstruct'] },
  classicalml: { c: 'data_ml', l: 1, p: ['linearregression'] },
  frauddetectionml: { c: 'data_ml', l: 2, p: ['classicalml'] },
  timeseriesanomaly: { c: 'data_ml', l: 2, p: ['classicalml'] },
  vaes: { c: 'data_ml', l: 2, p: ['linearregression'] },
  byol: { c: 'data_ml', l: 2, p: ['vaes'], deep: true },
  xlstm: { c: 'data_ml', l: 2, p: ['classicalml'], deep: true },
  keras3: { c: 'data_ml', l: 2, p: ['classicalml'] },
  aidataplat: { c: 'data_scale', l: 2, p: ['datapipeline'] },
  medallionarch: { c: 'data_scale', l: 2, p: ['datapipeline'] },
  aitestdatabottleneck: { c: 'data_scale', l: 2, p: ['classicalml'] },
  pythonprofiling: { c: 'data_scale', l: 2, p: ['pandasdataframes'] },
  pythonengineering: { c: 'data_scale', l: 2, p: ['pythonprofiling'] },
  nsquaredpizza: { c: 'data_scale', l: 2, p: ['pythonengineering'] },
  functools: { c: 'data_scale', l: 2, p: [] },
  llmfinetuning: { c: 'data_scale', l: 3, p: ['quantserve'] },
  // ── Production & Frontiers (20) ──
  practices: { c: 'fr_eval', l: 1, p: [] },
  powerfeatures: { c: 'fr_frontiers', l: 1, p: [] },
  progress: { c: 'fr_frontiers', l: 1, p: [] },
  llmevals: { c: 'fr_eval', l: 2, p: ['practices'] },
  modelvalidation: { c: 'fr_eval', l: 2, p: ['llmevals'] },
  reasoningbench: { c: 'fr_eval', l: 2, p: ['llmevals'] },
  guardrails: { c: 'fr_eval', l: 2, p: ['practices'] },
  llmreliability: { c: 'fr_eval', l: 2, p: ['guardrails'] },
  tokenbill: { c: 'fr_ops', l: 1, p: [] },
  finops: { c: 'fr_ops', l: 2, p: ['tokenbill'] },
  productionragops: { c: 'fr_ops', l: 2, p: ['practices'] },
  enterpriseaiops: { c: 'fr_ops', l: 2, p: ['productionragops'] },
  enterprisegrade: { c: 'fr_ops', l: 2, p: ['productionragops'] },
  observability: { c: 'fr_ops', l: 2, p: ['enterpriseaiops'] },
  tokenorchestrationplaybook: { c: 'fr_ops', l: 3, p: ['finops'] },
  enterpriseadvancedplaybook: { c: 'fr_ops', l: 3, p: ['enterpriseaiops'] },
  visionlanguage: { c: 'fnd_multimodal', l: 2, p: [] },
  diffusionmodels: { c: 'fnd_multimodal', l: 2, p: [] },
  speechvoice: { c: 'fnd_multimodal', l: 2, p: [] },
  slmedge: { c: 'fr_frontiers', l: 2, p: ['quantserve'] },
  ragbeyond: { c: 'fr_frontiers', l: 2, p: ['prodrag'] },
  frontiers: { c: 'fr_frontiers', l: 3, p: ['ragbeyond'] },
  aigentools: { c: 'fr_frontiers', l: 1, p: [] },
  aiharnessquality: { c: 'fr_frontiers', l: 1, p: [] },
  aiarchdecisions: { c: 'fr_frontiers', l: 1, p: [] }
};

// ── Helpers ────────────────────────────────────────────────────────────────
export function getChildById(childId) {
  return CHILD_UMBRELLAS.find(c => c.id === childId) || null;
}

export function getChildrenForUmbrella(umbrellaId) {
  return CHILD_UMBRELLAS.filter(c => c.umbrellaId === umbrellaId).sort((a, b) => a.order - b.order);
}

export function getTopicMeta(tabId) {
  return TOPIC_META[tabId] || { c: null, l: 1, p: [] };
}

export function getLevelInfo(level) {
  return LEVELS[level] || LEVELS[1];
}

/** Journey position map: tabId → { loop, index }. Built once, lazily. */
let _journeyPos = null;
function journeyPos() {
  if (!_journeyPos) {
    _journeyPos = new Map();
    ['journey_loop1', 'journey_loop2', 'journey_loop3'].forEach((loopId, loop) => {
      const order = (_JOURNEY[loopId] && _JOURNEY[loopId].order) || [];
      order.forEach((id, index) => {
        if (!_journeyPos.has(id)) _journeyPos.set(id, { loop, index });
      });
    });
  }
  return _journeyPos;
}

/**
 * Single display-order rule used by EVERY surface (sidebar, TopBar,
 * role-track builder): journey loop first, position inside loop second,
 * level as tiebreak, registry order as final fallback.
 */
export function sortTopicsLikeJourney(tabs) {
  const pos = journeyPos();
  const fallback = new Map((tabs || []).map((t, i) => [t.id, i]));
  return [...(tabs || [])].sort((a, b) => {
    const pa = pos.get(a.id) || { loop: 99, index: 999 };
    const pb = pos.get(b.id) || { loop: 99, index: 999 };
    if (pa.loop !== pb.loop) return pa.loop - pb.loop;
    if (pa.index !== pb.index) return pa.index - pb.index;
    const la = getTopicMeta(a.id).l, lb = getTopicMeta(b.id).l;
    if (la !== lb) return la - lb;
    return (fallback.get(a.id) || 0) - (fallback.get(b.id) || 0);
  });
}

/** Tabs of an umbrella grouped by child, journey-ordered within each child. */
export function getGroupedTabsForUmbrella(umbrellaId, tabsInUmbrella) {
  const children = getChildrenForUmbrella(umbrellaId);
  const byChild = new Map(children.map(c => [c.id, []]));
  const ungrouped = [];
  for (const t of sortTopicsLikeJourney(tabsInUmbrella)) {
    const meta = getTopicMeta(t.id);
    if (meta.c && byChild.has(meta.c)) byChild.get(meta.c).push(t);
    else ungrouped.push(t);
  }
  const groups = children
    .map(c => ({ child: c, tabs: byChild.get(c.id) }))
    .filter(g => g.tabs.length > 0);
  if (ungrouped.length) groups.push({ child: null, tabs: ungrouped });
  return groups;
}

/** Level span of a child, e.g. "L1–L3". */
export function getChildLevelSpan(childId, tabsInUmbrella) {
  const levels = (tabsInUmbrella || [])
    .filter(t => getTopicMeta(t.id).c === childId)
    .map(t => getTopicMeta(t.id).l);
  if (!levels.length) return '';
  const min = Math.min(...levels), max = Math.max(...levels);
  return min === max ? `L${min}` : `L${min}–L${max}`;
}

/** Per-level composition, e.g. "L1×2 · L2×5 · L3×2" (nonzero levels only). */
export function getChildLevelCounts(childId, tabsInUmbrella) {
  const counts = { 1: 0, 2: 0, 3: 0 };
  for (const t of (tabsInUmbrella || [])) {
    if (getTopicMeta(t.id).c !== childId) continue;
    const l = getTopicMeta(t.id).l;
    if (counts[l] !== undefined) counts[l]++;
  }
  return [1, 2, 3].filter(l => counts[l] > 0).map(l => `L${l}×${counts[l]}`).join(' · ');
}

/** Prerequisite tab ids for a topic (may cross umbrellas). */
export function getPrereqIds(tabId) {
  return getTopicMeta(tabId).p || [];
}

/**
 * Pilot gate: child umbrellas collapsed to a single sidebar row with a
 * sequential in-hub experience (overview page 0 + ordered subtopics).
 * Roll out hub-by-hub by appending child ids here.
 */
export const PILOT_COLLAPSED_CHILDREN = ['fnd_prompts', 'fnd_internals', 'fnd_start', 'fnd_mlsoc', 'fnd_multimodal', 'rag_core', 'rag_precision', 'rag_advanced', 'rag_practice', 'ctx_craft', 'ctx_memory', 'ctx_long', 'agt_found', 'agt_safety', 'agt_multi', 'agt_prod', 'data_found', 'data_docs', 'data_ml', 'data_scale', 'fr_eval', 'fr_ops', 'fr_frontiers'];

/** Convention: a child's overview page id is `<childId>_hub`. */
export function getHubPageId(childId) {
  return `${childId}_hub`;
}

/**
 * Canonical in-hub learning sequence: non-hub topics of a child ordered by
 * level (L1 → L2 → L3), journey order as tiebreak, registry order as final
 * fallback. Every surface (sidebar row, TopBar position bar, sequence footer)
 * must use this — never a competing order.
 */
export function getChildSequence(childId) {
  const ids = Object.keys(TOPIC_META).filter(id =>
    TOPIC_META[id].c === childId && id !== getHubPageId(childId));
  return [1, 2, 3].map(l =>
    sortTopicsLikeJourney(
      ids.filter(id => (TOPIC_META[id].l || 1) === l).map(id => ({ id }))
    ).map(t => t.id)
  ).flat();
}
