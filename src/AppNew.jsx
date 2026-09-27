/**
 * New App Shell — Apple-level redesign
 * Uses the design system for consistent, premium experience
 */

import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { globalStyles } from './design-system/globalStyles.js';
import { Page, Container, Section } from './components/layout/Primitives.jsx';
import { Sidebar, TopBar, CommandPalette } from './components/ui/Navigation.jsx';
import { AdaptiveWorkflowBar } from './components/ui/AdaptiveWorkflowBar.jsx';
import { ToastProvider, useToast, Skeleton } from './components/ui/Feedback.jsx';
import { TopicFooter } from './components/ui/TopicFooter.jsx';
import { LegalModal } from './components/ui/LegalModal.jsx';
import { StorageNoticeBanner } from './components/ui/StorageNoticeBanner.jsx';
import HubSequenceNav from './components/ui/HubSequenceNav.jsx';
import { UMBRELLA_TOPICS, getUmbrellaForTab, getTabsForUmbrella, getTabById, TABS_REGISTRY } from './registry/tabsRegistry.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import { s as legacyStyles } from './styles/legacyStyles.js';

// Lazy-load all tab components
const TabComponents = {
  overview: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.OverviewTabNew }))),
  airoadmap: lazy(() => import('./aiRoadmap/AIRoadmapTab.jsx')),
  glossary: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIGlossaryTab }))),
  firstaiapp: lazy(() => import('./firstAIApp/FirstAIAppTab.jsx')),
  modellandscape: lazy(() => import('./modelLandscape/ModelLandscapeTab.jsx')),
  tokenization: lazy(() => import('./tokenization/TokenizationTab.jsx')),
  modelinternals: lazy(() => import('./modelInternals/ModelInternalsTab.jsx')),
  quantserve: lazy(() => import('./quantServe/QuantServeTab.jsx')),
  vramconductor: lazy(() => import('./vramConductor/VramConductorTab.jsx')),
  promptfundamentals: lazy(() => import('./promptEngineeringFundamentals/PromptFundamentalsTab.jsx')),
  reinforcementlearning: lazy(() => import('./reinforcementLearning/ReinforcementLearningTab.jsx')),
  aimoralagency: lazy(() => import('./aiMoralAgency/MoralAgencyTab.jsx')),
  humancentric: lazy(() => import('./humanCentric/HumanCentricTab.jsx')),
  dialoguelamda: lazy(() => import('./dialogueLaMDA/DialogueLaMDATab.jsx')),
  llmsampling: lazy(() => import('./llmSampling/LLMSamplingTab.jsx')),
  selfattention: lazy(() => import('./selfAttention/SelfAttentionTab.jsx')),
  posencoding: lazy(() => import('./posEncoding/PosEncodingTab.jsx')),
  trpo2grpo: lazy(() => import('./rlTraining/RLTrainingTab.jsx')),
  archconcepts: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ArchConceptsTab }))),
  workflows: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ClaudeWorkflowsTab }))),
  unhobbling: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.UnhobblingTab }))),
  promptmgmt: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PromptMgmtTab }))),
  promptdependencygraph: lazy(() => import('./promptDependencyGraph/PromptDependencyGraphTab.jsx')),
  promptcontracts: lazy(() => import('./promptContracts/PromptContractsTab.jsx')),
  promptregression: lazy(() => import('./promptRegression/PromptRegressionTab.jsx')),
  structuredoutputs: lazy(() => import('./structuredOutputs/StructuredOutputsTab.jsx')),
  topicmodeling: lazy(() => import('./topicModeling/TopicModelingTab.jsx')),
  aiharness: lazy(() => import('./aiHarness/AIHarnessTab.jsx')),
  promptlearning: lazy(() => import('./promptLearning/PromptLearningTab.jsx')),

  rag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RAGTypesTab }))),
  pipeline: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PipelineTab }))),
  completepipeline: lazy(() => import('./completePipeline/CompletePipelineTab.jsx')),
  filtering: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FilteringTab }))),
  hierrag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HierarchicalRetrievalTab }))),
  qparseloop: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.QuestionParsingLoopTab }))),
  prodrag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ProductionRAGTab }))),
  routercheap: lazy(() => import('./zeroModelRouter/ZeroModelRouterTab.jsx')),
  workflowloop: lazy(() => import('./workflowLoop/WorkflowLoopTab.jsx')),
  genpatterns: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.GenPatternsTab }))),
  fourpdfs: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FourPDFsTab }))),
  hallucbricks: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HallucBricksTab }))),
  proxypointer: lazy(() => import('./proxyPointer/ProxyPointerTab.jsx')),
  agenticrag: lazy(() => import('./agenticRAG/AgenticRAGTab.jsx')),
  ragcasestudies: lazy(() => import('./tabs/RAGCaseStudiesTab.jsx')),
  capstone1: lazy(() => import('./capstone1/Capstone1Tab.jsx')),
  capstone3: lazy(() => import('./capstone3/Capstone3Tab.jsx')),
  interviewprep: lazy(() => import('./tabs/InterviewPrepTab.jsx')),
  rowlevelrag: lazy(() => import('./rowLevelRAG/RowLevelRAGTab.jsx')),
  tablegridrag: lazy(() => import('./tableGridRAG/TableGridRAGTab.jsx')),
  agentfanout: lazy(() => import('./agentFanout/AgentFanoutTab.jsx')),
  rerankers: lazy(() => import('./rerankers/RerankersTab.jsx')),
  rageval: lazy(() => import('./ragEvals/RagEvalTab.jsx')),
  multilingualrag: lazy(() => import('./multilingualRAG/MultilingualRAGTab.jsx')),
  multimodalrag: lazy(() => import('./multimodalRAG/MultimodalRAGTab.jsx')),
  texttosql: lazy(() => import('./textToSQL/TextToSQLTab.jsx')),
  crossdocjoins: lazy(() => import('./crossDocJoins/CrossDocJoinsTab.jsx')),
  graphtraversalknowledge: lazy(() => import('./graphTraversalKnowledge/GraphTraversalTab.jsx')),
  ragcorpusshapes: lazy(() => import('./ragCorpusShapes/RAGCorpusShapesTab.jsx')),
  amplifyexpert: lazy(() => import('./amplifyExpert/AmplifyExpertTab.jsx')),
  ragchunking: lazy(() => import('./ragChunkingStrategy/RAGChunkingStrategyTab.jsx')),

  ctxeng: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextEngineeringTab }))),
  ctxmeasure: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextMeasureTab }))),
  companybrain: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.CompanyBrainTab }))),
  contextgraph: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextGraphTab }))),
  vague: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.VagueQuestionsTab }))),
  hallucination: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HallucinationLoopTab }))),
  memeng: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MemoryEngineeringTab }))),
  contextlimits: lazy(() => import('./contextLimits/ContextLimitsTab.jsx')),
  validitylayer: lazy(() => import('./validityLayer/ValidityLayerTab.jsx')),
  memhierarchy: lazy(() => import('./memHierarchy/MemHierarchyTab.jsx')),
  longcontext: lazy(() => import('./longContext/LongContextTab.jsx')),

  cliagent: lazy(() => import('./cliAgents/CliAgentTab.jsx')),
  claudecode100: lazy(() => import('./claudeCode100/ClaudeCode100Tab.jsx')),
  typedagentgate: lazy(() => import('./typedAgentGate/TypedAgentGateTab.jsx')),
  agentpairprogramming: lazy(() => import('./agentPairProgramming/AgentPairTab.jsx')),
  redesign: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RedesignWorkTab }))),
  projectprepframework: lazy(() => import('./projectPrepFramework/ProjectPrepFrameworkTab.jsx')),
  agentplanner: lazy(() => import('./agentPlanner/AgentPlannerTab.jsx')),
  agenthitl: lazy(() => import('./agentHITL/AgentHITLTab.jsx')),
  agenta2a: lazy(() => import('./agentA2A/AgentA2ATab.jsx')),
  agentsandbox: lazy(() => import('./agentSandbox/AgentSandboxTab.jsx')),
  agentevals: lazy(() => import('./agentEvals/AgentEvalsTab.jsx')),
  handoffwatch: lazy(() => import('./handoffWatch/HandoffWatchTab.jsx')),
  verifiedpipes: lazy(() => import('./verifiedPipes/VerifiedPipesTab.jsx')),
  codingevals: lazy(() => import('./codingEvals/CodingEvalsTab.jsx')),
  vibecode: lazy(() => import('./vibeCode/VibeCodeTab.jsx')),
  fiveassets: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FiveAssetsTab }))),
  multiagent: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MultiAgentTab }))),
  multiagentcoord: lazy(() => import('./multiAgentCoordination/MultiAgentCoordinationTab.jsx')),
  modelrouting: lazy(() => import('./modelRouting/ModelRoutingTab.jsx')),
  agentsastools: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentsAsToolsTab }))),
  codingagentsnonprog: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.NonProgCodingAgentsTab }))),
  langchain: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.LangChainTab }))),
  langgraph: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.LangGraphTab }))),
  frameworkcompare: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.CompareTab }))),
  toolcalling: lazy(() => import('./toolCalling/ToolCallingTab.jsx')),
  agentscale: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HighScaleAgentsTab }))),
  modeldeploy: lazy(() => import('./modelDeployment/ModelDeploymentTab.jsx')),
  agentdebugging: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentDebuggingTab }))),
  agenttasks: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentTasksTab }))),
  aiproductbuilder: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIProductBuilderTab }))),
  capstone2: lazy(() => import('./capstone2/Capstone2Tab.jsx')),
  mcpclient: lazy(() => import('./mcpClient/MCPClientTab.jsx')),
  agentsdk: lazy(() => import('./agentsSDK/AgentsSDKTab.jsx')),
  loopengineering: lazy(() => import('./loopEngineering/LoopEngineeringTab.jsx')),
  finassistproject: lazy(() => import('./finAssistProject/FinAssistProjectTab.jsx')),
  zerocostmultiagent: lazy(() => import('./zeroCostMultiAgent/ZeroCostMultiAgentTab.jsx')),
  multilingualclassification: lazy(() => import('./multilingualClassification/MultilingualClassificationTab.jsx')),
  textclusteringhdbscan: lazy(() => import('./textClusteringHDBSCAN/TextClusteringHDBSCANTab.jsx')),

  threelayers: lazy(() => import('./engineeringLayers/ThreeLayersTab.jsx')),
  docstruct: lazy(() => import('./documentStructure/DocumentStructureTab.jsx')),
  agenticparsing: lazy(() => import('./agenticParsing/AgenticParsingTab.jsx')),
  knowledgebase: lazy(() => import('./knowledgeBase/KnowledgeBaseTab.jsx')),
  vectordbops: lazy(() => import('./vectorDBOps/VectorDBOpsTab.jsx')),
  datapipeline: lazy(() => import('./dataPipeline/DataPipelineTab.jsx')),
  aidataplat: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIDataPlatformTab }))),
  medallionarch: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MedallionArchTab }))),
  aitestdatabottleneck: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AITestDataBottleneckTab }))),
  classicalml: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ClassicalMLTab }))),
  frauddetectionml: lazy(() => import('./fraudDetectionML/FraudDetectionTab.jsx')),
  modernioformats: lazy(() => import('./modernIOFormats/ModernIOTab.jsx')),
  pythonprofiling: lazy(() => import('./pythonProfiling/PythonProfilingTab.jsx')),
  pythonengineering: lazy(() => import('./pythonEngineering/PythonEngineeringTab.jsx')),
  functools: lazy(() => import('./functools/FunctoolsTab.jsx')),
  activelearn: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ActiveLearningTab }))),
  goaltracker: lazy(() => import('./goalTracker/GoalTrackerTab.jsx')),
  vaes: lazy(() => import('./vaes/VAETab.jsx')),
  keras3: lazy(() => import('./keras3/Keras3Tab.jsx')),
  byol: lazy(() => import('./byol/BYOLTab.jsx')),
  xlstm: lazy(() => import('./xlstm/XLSTMTab.jsx')),
  timeseriesanomaly: lazy(() => import('./tsAnomaly/TSAnomalyTab.jsx')),
  aiusecases: lazy(() => import('./aiUseCases/AIUseCasesTab.jsx')),
  linearregression: lazy(() => import('./linearRegression/LinearRegressionTab.jsx')),
  pandasdataframes: lazy(() => import('./pandasDataframes/PandasDataFrameTab.jsx')),
  pandasmem: lazy(() => import('./pandasMem/PandasMemTab.jsx')),
  geopopviz: lazy(() => import('./geoPopViz/GeoPopTab.jsx')),
  datahumanization: lazy(() => import('./dataHumanization/DataHumanizationTab.jsx')),
  llmfinetuning: lazy(() => import('./llmFinetuning/LLMFinetuningTab.jsx')),
  textclassificationdata: lazy(() => import('./textClassificationData/TextClassificationDataTab.jsx')),
  nsquaredpizza: lazy(() => import('./nSquaredPizza/NSquaredPizzaTab.jsx')),
  datacentricai: lazy(() => import('./dataCentricAI/DataCentricAITab.jsx')),
  threesentenceprompt: lazy(() => import('./threeSentencePrompt/ThreeSentencePromptTab.jsx')),

  visionlanguage: lazy(() => import('./visionLanguageModels/VisionLanguageTab.jsx')),
  diffusionmodels: lazy(() => import('./diffusionModels/DiffusionTab.jsx')),
  speechvoice: lazy(() => import('./speechVoiceAI/SpeechVoiceTab.jsx')),
  powerfeatures: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PowerFeaturesTab }))),
  frontiers: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ResearchFrontiersTab }))),
  ragbeyond: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RAGBeyondTab }))),
  practices: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PracticesTab }))),
  tokenbill: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.TokenBillTab }))),
  llmevals: lazy(() => import('./llmEvals/LLMEvalLayerTab.jsx')),
  modelvalidation: lazy(() => import('./modelValidation/ModelValidationTab.jsx')),
  reasoningbench: lazy(() => import('./reasoningBench/ReasoningBenchTab.jsx')),
  progress: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ProgressTab }))),
  guardrails: lazy(() => import('./guardrails/GuardrailsTab.jsx')),
  llmreliability: lazy(() => import('./llmReliability/LLMReliabilityTab.jsx')),
  enterpriseaiops: lazy(() => import('./enterpriseAIOps/EnterpriseAIOpsTab.jsx')),
  enterprisegrade: lazy(() => import('./enterpriseGrade/EnterpriseGradeTab.jsx')),
  finops: lazy(() => import('./finOps/FinOpsTab.jsx')),
  observability: lazy(() => import('./aiObservability/AIObservabilityTab.jsx')),
  slmedge: lazy(() => import('./slmEdge/SlmEdgeTab.jsx')),
  productionragops: lazy(() => import('./productionRAGOps/ProductionRAGOpsTab.jsx')),
  tokenorchestrationplaybook: lazy(() => import('./tokenOrchestrationPlaybook/TokenPlaybookTab.jsx')),
  enterpriseadvancedplaybook: lazy(() => import('./enterpriseAdvancedPlaybook/EnterpriseAdvancedPlaybookTab.jsx')),
  fnd_start_hub: lazy(() => import('./hubPages/FndStartHubTab.jsx')),
  fnd_internals_hub: lazy(() => import('./hubPages/FndInternalsHubTab.jsx')),
  fnd_prompts_hub: lazy(() => import('./hubPages/FndPromptsHubTab.jsx')),
  fnd_mlsoc_hub: lazy(() => import('./hubPages/FndMlsocHubTab.jsx')),
  fnd_multimodal_hub: lazy(() => import('./hubPages/FndMultimodalHubTab.jsx')),
  rag_core_hub: lazy(() => import('./hubPages/RagCoreHubTab.jsx')),
  rag_precision_hub: lazy(() => import('./hubPages/RagPrecisionHubTab.jsx')),
  rag_advanced_hub: lazy(() => import('./hubPages/RagAdvancedHubTab.jsx')),
  rag_practice_hub: lazy(() => import('./hubPages/RagPracticeHubTab.jsx')),
  ctx_craft_hub: lazy(() => import('./hubPages/CtxCraftHubTab.jsx')),
  ctx_memory_hub: lazy(() => import('./hubPages/CtxMemoryHubTab.jsx')),
  ctx_long_hub: lazy(() => import('./hubPages/CtxLongHubTab.jsx')),
  agt_found_hub: lazy(() => import('./hubPages/AgtFoundHubTab.jsx')),
  agt_safety_hub: lazy(() => import('./hubPages/AgtSafetyHubTab.jsx')),
  agt_multi_hub: lazy(() => import('./hubPages/AgtMultiHubTab.jsx')),
  agt_prod_hub: lazy(() => import('./hubPages/AgtProdHubTab.jsx')),
  data_found_hub: lazy(() => import('./hubPages/DataFoundHubTab.jsx')),
  data_docs_hub: lazy(() => import('./hubPages/DataDocsHubTab.jsx')),
  data_ml_hub: lazy(() => import('./hubPages/DataMlHubTab.jsx')),
  data_scale_hub: lazy(() => import('./hubPages/DataScaleHubTab.jsx')),
  fr_eval_hub: lazy(() => import('./hubPages/FrEvalHubTab.jsx')),
  fr_ops_hub: lazy(() => import('./hubPages/FrOpsHubTab.jsx')),
  fr_frontiers_hub: lazy(() => import('./hubPages/FrFrontiersHubTab.jsx')),
  aigentools: lazy(() => import('./aiGenTools/AiGenToolsTab.jsx')),
  aiharnessquality: lazy(() => import('./aiHarnessQuality/AiHarnessQualityTab.jsx')),
  aiarchdecisions: lazy(() => import('./aiArchDecisions/AiArchDecisionsTab.jsx')),
};

function TabLoader({ tabId, onSelectTab }) {
  useEffect(() => {
    if (tabId) {
      import('./services/mastery.js').then(m => m.recordVisit(tabId)).catch(() => {});
    }
  }, [tabId]);
  const Component = TabComponents[tabId];
  if (!Component) return <div style={{ padding: 'var(--ds-space-10)', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>Tab not found: {tabId}</div>;
  return (
    <>
      <Suspense fallback={<TabSkeleton />}>
        <ErrorBoundary key={tabId} fallback={<TabError tabId={tabId} />}>
          <Component s={legacyStyles} onSelectTab={onSelectTab} setActiveTab={onSelectTab} />
        </ErrorBoundary>
      </Suspense>
      {/* Pilot: sequential in-hub nav renders only inside collapsed hubs */}
      <HubSequenceNav tabId={tabId} onSelectTab={onSelectTab} />
      <TopicFooter tabId={tabId} onSelectTab={onSelectTab} />
    </>
  );
}

function TabSkeleton() {
  return (
    <Section variant="bordered" style={{ minHeight: '400px' }}>
      <div style={{ padding: 'var(--ds-space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          <Skeleton variant="title" width="40%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="70%" />
        </div>
      </div>
    </Section>
  );
}

function TabError({ tabId }) {
  const { error } = useToast();
  return (
    <Section variant="bordered" style={{ padding: 'var(--ds-space-10)', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--ds-space-4)' }}>⚠️</div>
      <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>Failed to load tab</h3>
      <p style={{ color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-space-6)' }}>
        Could not load <code style={{ background: 'var(--ds-color-bg-surfaceHover)', padding: '2px 6px', borderRadius: 'var(--ds-radius-sm)' }}>{tabId}</code>
      </p>
      <button onClick={() => window.location.reload()} style={{ padding: 'var(--ds-space-2) var(--ds-space-4)', background: 'var(--ds-color-module-foundations-primary)', color: 'white', border: 'none', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer' }}>
        Reload Page
      </button>
    </Section>
  );
}

// ============================================
// Main App Component
// ============================================
export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    return tab && TABS_REGISTRY.some(t => t.id === tab) ? tab : 'airoadmap';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState('privacy');

  const openLegal = (tab) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Per-topic scroll memory + history handling
  const scrollMemory = useRef(new Map());
  const prevTabRef = useRef(activeTab);
  const isFirstSync = useRef(true);
  const isPopRef = useRef(false);
  const contentScrollRef = useRef(null);

  // Normalize invalid ?tab= on mount so URL and state never diverge
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlTab = params.get('tab');
    if (urlTab && !TABS_REGISTRY.some(t => t.id === urlTab)) {
      params.set('tab', activeTab);
      window.history.replaceState({ tab: activeTab }, '', `${window.location.pathname}?${params}`);
    }
  }, []);

  // URL sync: replace on first mount, push on topic change so Back/Forward works
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === activeTab && isFirstSync.current) {
      window.history.replaceState({ tab: activeTab }, '', `${window.location.pathname}?${params}`);
      isFirstSync.current = false;
      return;
    }
    params.set('tab', activeTab);
    const url = `${window.location.pathname}?${params}`;
    if (isFirstSync.current) {
      window.history.replaceState({ tab: activeTab }, '', url);
      isFirstSync.current = false;
    } else {
      window.history.pushState({ tab: activeTab }, '', url);
    }
  }, [activeTab]);

  // Back/Forward support: sync activeTab from URL / state
  useEffect(() => {
    const onPop = (e) => {
      const tab = e.state?.tab || new URLSearchParams(window.location.search).get('tab');
      if (tab && TABS_REGISTRY.some(t => t.id === tab)) {
        isPopRef.current = true;
        setActiveTab(tab);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Scroll behavior: Back/Forward restores saved offset; fresh jumps start at top
  useEffect(() => {
    const prev = prevTabRef.current;
    if (prev !== activeTab) {
      const el = contentScrollRef.current;
      try { scrollMemory.current.set(prev, el?.scrollTop ?? 0); } catch {}
      if (isPopRef.current) {
        const saved = scrollMemory.current.get(activeTab);
        if (el) el.scrollTop = saved ?? 0;
      } else {
        if (el) el.scrollTop = 0;
      }
      isPopRef.current = false;
      // Move focus to main for keyboard / screen-reader users
      requestAnimationFrame(() => {
        document.getElementById('main-content')?.focus?.({ preventScroll: true });
      });
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setMobileOpen(false);
      }
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [sidebarCollapsed]);

  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(v => !v);
  }, []);

  const handleTabSelect = useCallback((tabId) => {
    setActiveTab(tabId);
    setCommandPaletteOpen(false);
    setMobileOpen(false);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  // Find active module for sidebar highlighting
  const activeModule = getUmbrellaForTab(activeTab)?.id || 'foundations';

  return (
    <ToastProvider>
      <Page
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        header={
          <TopBar
            activeTab={activeTab}
            onSelectTab={handleTabSelect}
            onSearchOpen={handleSearchOpen}
            onToggleSidebar={() => setMobileOpen(!mobileOpen)}
            sidebarCollapsed={!mobileOpen}
          />
        }
        sidebar={
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleTabSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={handleSidebarToggle}
      >
        <div ref={contentScrollRef} style={{ flex: 1 }}>
          <Container size="normal">
            <TabLoader tabId={activeTab} onSelectTab={handleTabSelect} />
            <AdaptiveWorkflowBar activeTab={activeTab} onSelectTab={handleTabSelect} />
            <footer
              className="bottom-nav"
              style={{
                marginTop: 'var(--ds-space-12)',
                paddingTop: 'var(--ds-space-6)',
                paddingBottom: 'calc(var(--ds-space-8) + env(safe-area-inset-bottom, 0px))',
                borderTop: '1px solid var(--ds-color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
                fontSize: '13px',
                color: 'var(--ds-color-text-secondary)'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--ds-color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span>© 2025–2026</span>
                <a
                  href="https://github.com/nyakkala"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dotted var(--ds-color-text-tertiary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5EC4C8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
                  title="View Curator Profile"
                >
                  Nagaraj Y
                </a>
                <span>· All rights reserved.</span>
              </div>
              <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 500 }}>
                Educational Research & Open Knowledge Base · Strictly non-commercial use.
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px', fontSize: '12px' }}>
                <button
                  onClick={() => openLegal('privacy')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ds-color-text-tertiary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5EC4C8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-color-text-tertiary)')}
                >
                  Privacy Policy
                </button>
                <span style={{ color: 'var(--ds-color-border-subtle)' }}>•</span>
                <button
                  onClick={() => openLegal('terms')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ds-color-text-tertiary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5EC4C8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-color-text-tertiary)')}
                >
                  Terms of Service
                </button>
                <span style={{ color: 'var(--ds-color-border-subtle)' }}>•</span>
                <button
                  onClick={() => openLegal('trademarks')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--ds-color-text-tertiary)', textDecoration: 'underline', cursor: 'pointer', fontSize: '12px' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5EC4C8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ds-color-text-tertiary)')}
                >
                  Trademarks & Fair Use
                </button>
              </div>
            </footer>
          </Container>
        </div>

        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          tabs={TABS_REGISTRY}
          onSelectTab={handleTabSelect}
        />

        <LegalModal
          isOpen={legalModalOpen}
          initialTab={legalModalTab}
          onClose={() => setLegalModalOpen(false)}
        />

        <StorageNoticeBanner
          onOpenPrivacy={() => openLegal('privacy')}
        />
      </Page>
    </ToastProvider>
  );
}

// Ensure global styles are injected
globalStyles;