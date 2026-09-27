import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  CONTAINER_SERVICES,
  K8S_PRODUCTION_RULES,
  LANGSMITH_SCENARIOS,
  EVALUATE_RAGAS_BENCHMARK,
  PYTEST_CODE_SAMPLE,
  PERFORMANCE_MODES,
  FOUR_PHASE_ROADMAP
} from './playbookEngine.js';
import {
  ContainerStackTopologyDiagram,
  LangSmithTraceWaterfallDiagram,
  LangGraphParallelBranchingDiagram
} from './PlaybookDiagrams.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

export default function TokenPlaybookTab() {
  const [activeSubTab, setActiveSubTab] = useState('deployment');

  // Subtab 1: Deployment code toggle
  const [deploymentView, setDeploymentView] = useState('compose');

  // Subtab 2: LangSmith scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState('cache_hit');
  const activeScenario = LANGSMITH_SCENARIOS.find(s => s.id === selectedScenarioId) || LANGSMITH_SCENARIOS[0];

  // Subtab 3: RAGAS sliders
  const [faithfulness, setFaithfulness] = useState(0.85);
  const [relevancy, setRelevancy] = useState(0.82);
  const [precision, setPrecision] = useState(0.78);
  const ragasEval = EVALUATE_RAGAS_BENCHMARK(faithfulness, relevancy, precision);

  // Subtab 4: Performance mode
  const [selectedPerfModeId, setSelectedPerfModeId] = useState('async_ainvoke');
  const activePerfMode = PERFORMANCE_MODES.find(m => m.id === selectedPerfModeId) || PERFORMANCE_MODES[1];

  // Subtab 5: Checklist state
  const [roadmap, setRoadmap] = useState(FOUR_PHASE_ROADMAP);

  const toggleTask = (phaseIdx, taskId) => {
    setRoadmap(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const task = next[phaseIdx].tasks.find(t => t.id === taskId);
      if (task) task.done = !task.done;
      return next;
    });
  };

  const allTasks = roadmap.flatMap(p => p.tasks);
  const completedTasks = allTasks.filter(t => t.done).length;
  const progressPct = Math.round((completedTasks / allTasks.length) * 100);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Enterprise AI Playbook [Production, Observability & Testing]"
        title="Enterprise AI Token Management & Orchestration Playbook"
        description="A complete, end-to-end production architecture blueprint for managing LLM context limits, token costs, and multi-service orchestration. Covering Docker/K8s deployment, LangSmith token governance, RAGAS accuracy evaluation, async parallelism, and a 4-phase enterprise rollout."
      />

      <Container style={{ marginTop: 'var(--ds-space-6)' }}>
        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--ds-color-border-subtle)',
          paddingBottom: '12px',
          marginBottom: '24px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'deployment', label: '1. Production Deployment (Docker & K8s)', icon: '🐳' },
            { id: 'observability', label: '2. Observability & Governance (LangSmith)', icon: '📊' },
            { id: 'testing', label: '3. Testing & Evaluation (RAGAS & pytest)', icon: '🔬' },
            { id: 'asyncparallel', label: '4. Performance (Async & Parallelism)', icon: '⚡' },
            { id: 'checklist', label: '5. 4-Phase Enterprise Checklist', icon: '🏁' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: activeSubTab === tab.id ? '1px solid #5EC4C8' : '1px solid transparent',
                background: activeSubTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: activeSubTab === tab.id ? '#5EC4C8' : 'var(--ds-color-text-secondary)',
                fontWeight: activeSubTab === tab.id ? 'bold' : 'normal',
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: DEPLOYMENT ARCHITECTURE ─── */}
        {activeSubTab === 'deployment' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Containerized Microservices Architecture & Kubernetes Production</h3>
              </div>
              <img
                src="/Users/nyakkala/.gemini/antigravity-ide/brain/eab4e01b-fd32-4d53-8d7e-adc771847745/enterprise_ai_production_stack_1788449465917.jpg"
                alt="Enterprise AI Production Stack"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}
              />
            </Card>

            <ContainerStackTopologyDiagram />

            {/* Container Topology Service Cards */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 14px 0', color: '#3A9B9F' }}>📦 Containerized Stack Services & Port Visualizer</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {CONTAINER_SERVICES.map(srv => (
                  <div key={srv.id} style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{srv.name}</strong>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#3A9B9F', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                        ● {srv.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginBottom: '6px' }}>
                      Port: {srv.port}
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {srv.description}
                    </p>
                    <div style={{ fontSize: '10px', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      Image: <code>{srv.image}</code>
                    </div>
                  </div>
                ))}
              </div>

              {/* Code Toggle Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  onClick={() => setDeploymentView('compose')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: deploymentView === 'compose' ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                    background: deploymentView === 'compose' ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                    color: deploymentView === 'compose' ? '#5EC4C8' : '#cbd5e1',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📄 1.1 docker-compose.yml
                </button>
                <button
                  onClick={() => setDeploymentView('dockerfile')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: deploymentView === 'dockerfile' ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                    background: deploymentView === 'dockerfile' ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                    color: deploymentView === 'dockerfile' ? '#5EC4C8' : '#cbd5e1',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  🐳 1.2 Dockerfile
                </button>
                <button
                  onClick={() => setDeploymentView('k8s')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: deploymentView === 'k8s' ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                    background: deploymentView === 'k8s' ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                    color: deploymentView === 'k8s' ? '#5EC4C8' : '#cbd5e1',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ☸️ 1.3 Kubernetes (Production) Rules
                </button>
              </div>

              {deploymentView === 'compose' && (
                <CodeBlock
                  language="yaml"
                  code={`# docker-compose.yml
version: '3.8'

services:
  # 1. Enterprise AI API (LangChain/LangGraph)
  ai-api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6334
      - LANGCHAIN_TRACING_V2=true
      - LANGCHAIN_API_KEY=\${LANGCHAIN_API_KEY}
    depends_on:
      - redis
      - qdrant
    restart: unless-stopped

  # 2. Redis (Semantic Caching & Rate Limiting)
  redis:
    image: redis/redis-stack:latest # Includes vector search capabilities
    ports:
      - "6379:6379"
      - "8001:8001" # RedisInsight UI
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # 3. Qdrant (Vector Database for RAG)
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6334:6334"
      - "6333:6333" # REST API
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

volumes:
  redis_data:
  qdrant_data:`}
                />
              )}

              {deploymentView === 'dockerfile' && (
                <CodeBlock
                  language="dockerfile"
                  code={`# Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port and run
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]`}
                />
              )}

              {deploymentView === 'k8s' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {K8S_PRODUCTION_RULES.map((rule, idx) => (
                    <div key={idx} style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ color: '#f8fafc', fontSize: '13px' }}>{rule.category}: {rule.principle}</strong>
                        <span style={{ fontSize: '10px', color: rule.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b', fontWeight: 'bold' }}>
                          [{rule.severity}]
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        {rule.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: OBSERVABILITY & LANGSMITH ─── */}
        {activeSubTab === 'observability' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>LangSmith Token Governance & Executive ROI Tracking</h3>
              </div>
              <img
                src="/Users/nyakkala/.gemini/antigravity-ide/brain/eab4e01b-fd32-4d53-8d7e-adc771847745/langsmith_token_governance_trace_1788449496006.jpg"
                alt="LangSmith Token Governance Trace"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              />
            </Card>

            <LangSmithTraceWaterfallDiagram />

            {/* Interactive Trace & ROI Simulator */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>⚡ Interactive LangSmith Run-Tree Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Select an inquiry scenario to observe how custom metadata tags track cache hits and token savings in real time.
                  </p>
                </div>
                <Badge variant={activeScenario.cacheHit ? 'success' : 'primary'}>
                  {activeScenario.cacheHit ? 'Cache Hit' : 'Model Routing'}
                </Badge>
              </div>

              {/* Scenario Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {LANGSMITH_SCENARIOS.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: selectedScenarioId === sc.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedScenarioId === sc.id ? 'rgba(16, 185, 129, 0.15)' : '#090d16',
                      color: selectedScenarioId === sc.id ? '#5EC4C8' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{sc.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>"{sc.query}"</div>
                  </button>
                ))}
              </div>

              {/* Live Run Tree Viewer */}
              <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '12px', fontSize: '12px' }}>
                  <span>ACTIVE SPAN TREE: <strong>{activeScenario.routingModel}</strong></span>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span>Latency: <strong style={{ color: '#f59e0b' }}>{activeScenario.latencyMs}ms</strong></span>
                    <span>•</span>
                    <span>Tokens Saved: <strong style={{ color: '#3A9B9F' }}>{activeScenario.tokensSaved}</strong></span>
                    <span>•</span>
                    <span>Cost Avoided: <strong style={{ color: '#3A9B9F' }}>{activeScenario.costAvoided}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeScenario.spans.map((sp, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      borderLeft: `4px solid ${sp.type === 'chain' ? '#5EC4C8' : sp.type === 'tool' ? '#5EC4C8' : '#a855f7'}`
                    }}>
                      <div>
                        <span style={{ color: '#94a3b8', marginRight: '6px' }}>[{sp.type}]</span>
                        <strong style={{ color: '#f8fafc' }}>{sp.name}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontFamily: 'monospace', fontSize: '11px' }}>
                        <span style={{ color: '#cbd5e1' }}>{sp.status}</span>
                        <span style={{ color: '#64748b' }}>{sp.latency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Snippet for Metadata Injection */}
              <CodeBlock
                language="python"
                code={`from langsmith import traceable
from langsmith.run_helpers import get_current_run_tree

@traceable(name="Enterprise RAG Pipeline")
def process_enterprise_query(query: str):
    # ... your LangGraph/LangChain logic ...
    
    # Attach custom business metrics to LangSmith run tree
    run_tree = get_current_run_tree()
    if run_tree:
        run_tree.metadata["cache_hit"] = True # or False
        run_tree.metadata["tokens_saved"] = 450 # Calculate based on cache hit
        run_tree.metadata["routing_model"] = "gpt-4o-mini"
        
    return response`}
              />
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: TESTING & RAGAS EVALUATION ─── */}
        {activeSubTab === 'testing' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #f59e0b' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>RAGAS Accuracy & Token Governance Evaluation Framework</h3>
              </div>
              <img
                src="/Users/nyakkala/.gemini/antigravity-ide/brain/eab4e01b-fd32-4d53-8d7e-adc771847745/ragas_evaluation_pipeline_1788449524458.jpg"
                alt="RAGAS Evaluation Framework"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}
              />
            </Card>

            {/* Interactive RAGAS Gauge Sandbox */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#f59e0b' }}>🔬 Interactive RAGAS Metric Evaluator & Safety Boundary</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Adjust metrics to simulate CI/CD evaluation. Watch what happens if aggressive token compression causes Faithfulness to drop below 0.80!
                  </p>
                </div>
                <Badge variant={ragasEval.isFaithfulnessCritical ? 'danger' : 'success'}>
                  {ragasEval.isFaithfulnessCritical ? 'CRITICAL FAILURE' : 'PASSED GATES'}
                </Badge>
              </div>

              {/* Sliders */}
              <Grid cols={3} gap={4} style={{ marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: faithfulness < 0.80 ? '#ef4444' : '#5EC4C8' }}>1. Faithfulness: {faithfulness.toFixed(2)}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Gate: ≥ 0.80</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="1.00"
                    step="0.01"
                    value={faithfulness}
                    onChange={(e) => setFaithfulness(Number(e.target.value))}
                    style={{ width: '100%', accentColor: faithfulness < 0.80 ? '#ef4444' : '#5EC4C8' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Measures hallucination vs retrieved context
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: '#3A9B9F' }}>2. Answer Relevancy: {relevancy.toFixed(2)}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Gate: ≥ 0.75</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="1.00"
                    step="0.01"
                    value={relevancy}
                    onChange={(e) => setRelevancy(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#5EC4C8' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Evaluates how well answer addresses question
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: '#a855f7' }}>3. Context Precision: {precision.toFixed(2)}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Gate: ≥ 0.70</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="1.00"
                    step="0.01"
                    value={precision}
                    onChange={(e) => setPrecision(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#a855f7' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Ratio of relevant chunks in retrieved top-k
                  </div>
                </div>
              </Grid>

              {/* Live Diagnostic Callout */}
              <div style={{
                background: ragasEval.isFaithfulnessCritical ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${ragasEval.isFaithfulnessCritical ? '#ef4444' : '#5EC4C8'}`,
                borderRadius: '8px',
                padding: '14px',
                marginBottom: '16px',
                color: '#f8fafc',
                fontSize: '12px'
              }}>
                <strong>EVALUATION REPORT:</strong> {ragasEval.diagnostic}
              </div>

              {/* Pytest Unit Test Code Block */}
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#f8fafc' }}>Unit Testing LangGraph State Transitions (pytest)</h4>
              <CodeBlock language="python" code={PYTEST_CODE_SAMPLE} />
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PERFORMANCE & ASYNC ─── */}
        {activeSubTab === 'asyncparallel' && (
          <Stack gap={6}>
            <LangGraphParallelBranchingDiagram />

            {/* Interactive Benchmark Sandbox */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#f59e0b' }}>⚡ Head-to-Head Concurrency & Latency Benchmark</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Never use synchronous .invoke() in production FastAPI endpoints. Compare throughput, blocking behavior, and parallel gains.
                </p>
              </div>

              {/* Mode Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {PERFORMANCE_MODES.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedPerfModeId(mode.id)}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: selectedPerfModeId === mode.id ? '1px solid #f59e0b' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedPerfModeId === mode.id ? 'rgba(245, 158, 11, 0.15)' : '#090d16',
                      color: selectedPerfModeId === mode.id ? '#f59e0b' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>

              {/* Metric Card */}
              <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc' }}>{activePerfMode.name}</h4>
                  <Badge variant={activePerfMode.eventLoopStatus.includes('BLOCKED') ? 'danger' : 'success'}>
                    {activePerfMode.eventLoopStatus}
                  </Badge>
                </div>

                <Grid cols={3} gap={4} style={{ marginBottom: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>LATENCY</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3A9B9F' }}>{activePerfMode.latency}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>CONCURRENCY</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3A9B9F' }}>{activePerfMode.concurrency}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>SERVER THROUGHPUT</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>{activePerfMode.throughput}</div>
                  </div>
                </Grid>

                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  <strong>ARCHITECTURAL VERDICT:</strong> {activePerfMode.verdict}
                </div>
              </div>

              {/* Code Snippets */}
              <Grid cols={2} gap={4}>
                <div>
                  <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>4.1 Async FastAPI (.ainvoke)</span>
                  <CodeBlock
                    language="python"
                    code={`@app.post("/query")
async def query_endpoint(query: str):
    # Non-blocking async execution
    response = await rag_chain.ainvoke(query)
    return {"response": response.content}`}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold' }}>4.3 Concurrent Batching (.abatch)</span>
                  <CodeBlock
                    language="python"
                    code={`# Concurrent Map-Reduce chunks with rate limit cap
responses = await llm.abatch(
    [{"input": chunk.page_content} for chunk in document_chunks],
    config={"max_concurrency": 10}
)`}
                  />
                </div>
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: 4-PHASE CHECKLIST ─── */}
        {activeSubTab === 'checklist' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>🏁 Enterprise Implementation Roadmap & Execution Checklist</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Step-by-step 2-month execution plan for establishing token governance and production reliability.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#3A9B9F' }}>{progressPct}% Complete</div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{completedTasks} of {allTasks.length} Milestones</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '8px', width: '100%', background: '#090d16', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #5EC4C8, #5EC4C8)', transition: 'width 0.3s ease' }} />
              </div>

              {/* Phase Columns */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {roadmap.map((phase, pIdx) => (
                  <div key={phase.phase} style={{ background: '#090d16', borderLeft: `4px solid ${phase.color}`, borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#f8fafc' }}>{phase.title}</span>
                        <span style={{ fontSize: '11px', background: `${phase.color}22`, color: phase.color, padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {phase.timeframe}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {phase.tasks.filter(t => t.done).length} / {phase.tasks.length} done
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {phase.tasks.map(task => (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(pIdx, task.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background 0.1s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => {}}
                            style={{ accentColor: '#5EC4C8', cursor: 'pointer' }}
                          />
                          <span style={{
                            fontSize: '12px',
                            color: task.done ? '#94a3b8' : '#f8fafc',
                            textDecoration: task.done ? 'line-through' : 'none'
                          }}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
