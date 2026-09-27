import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  ENTERPRISE_PILLARS,
  EXECUTIVE_VISUAL_GUIDES,
  SAMPLE_ENTERPRISE_DATASETS,
  RUN_RAG_PIPELINE_SIMULATION,
  PRESET_ROUTER_PROMPTS,
  RUN_DYNAMIC_ROUTER_SIMULATION,
  RUN_MAP_REDUCE_SIMULATION,
  CALCULATE_ENTERPRISE_SAVINGS,
  COST_BENEFIT_MATRIX,
  MODEL_WINDOW_COMPARISON,
  VECTOR_DB_EVALUATION,
  RERANKER_BENCHMARKS,
  SECURITY_COMPLIANCE_PATTERNS,
  RUN_PREFLIGHT_TOKEN_SIMULATION,
  ADVANCED_CHUNKING_STRATEGIES,
  ENTERPRISE_PROMPT_TEMPLATES,
  RAG_ACCURACY_PRO_TIPS,
  FALLBACK_SCENARIOS,
  RUN_FALLBACK_CASCADE_SIMULATION
} from './enterpriseAIOpsEngine.js';
import {
  AdvancedRAGPipelineDiagram,
  MapReducePatternDiagram,
  DynamicModelRoutingDiagram,
  EnterpriseDecisionTreeDiagram,
  PreflightFallbackWorkflowDiagram
} from './EnterpriseDiagrams.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

export default function EnterpriseAIOpsTab() {
  const [activeSubTab, setActiveSubTab] = useState('framework'); 
  // 'framework' | 'pipeline' | 'mapreduce' | 'router' | 'calculator' | 'code'

  // Subtab 2: Pipeline Simulator State
  const [selectedDatasetId, setSelectedDatasetId] = useState('legal_msa');
  const [isCacheHit, setIsCacheHit] = useState(false);
  const [topKCount, setTopKCount] = useState(3);
  const [compressionRatio, setCompressionRatio] = useState(60);

  const ragSimResult = RUN_RAG_PIPELINE_SIMULATION(selectedDatasetId, isCacheHit, topKCount, compressionRatio);

  // Subtab 3: Map-Reduce Simulator State
  const [partitionCount, setPartitionCount] = useState(4);
  const mapReduceResult = RUN_MAP_REDUCE_SIMULATION(partitionCount);

  // Subtab 4: Router Simulator State
  const [selectedPromptId, setSelectedPromptId] = useState('p1');
  const routerResult = RUN_DYNAMIC_ROUTER_SIMULATION(selectedPromptId);

  // Subtab 5: FinOps Calculator State
  const [monthlyRequests, setMonthlyRequests] = useState(500000);
  const [avgRawTokens, setAvgRawTokens] = useState(45000);
  const [cacheHitRate, setCacheHitRate] = useState(38);
  const [smallModelRouteRate, setSmallModelRouteRate] = useState(65);

  const finops = CALCULATE_ENTERPRISE_SAVINGS(monthlyRequests, avgRawTokens, cacheHitRate, smallModelRouteRate);

  // Subtab 6: Advanced RAG Deep Dive State
  const [selectedTemplateId, setSelectedTemplateId] = useState('strict_qa');

  // Subtab 7: Pre-Flight Token Guard & Fallback Simulator State
  const [selectedScenarioId, setSelectedScenarioId] = useState('standard_payload');
  const [manualCircuitTrip, setManualCircuitTrip] = useState(false);
  const fallbackSimResult = RUN_FALLBACK_CASCADE_SIMULATION(selectedScenarioId, manualCircuitTrip);

  const [preflightPrompt, setPreflightPrompt] = useState("Analyze the indemnification clause and identify all uncapped liability risks for data breaches.");
  const [preflightContext, setPreflightContext] = useState("Section 14.2 (Limitation of Liability): In no event shall either party's aggregate liability exceed the total amounts paid under this Agreement in the preceding twelve (12) months. Provided, however, that the foregoing limitation shall NOT apply to breaches of Section 9 (Confidentiality), Section 12 (Data Protection & Privacy), or intentional misconduct. Vendor shall defend, indemnify, and hold harmless Customer against any third-party cyber breach claims with unlimited liability cap.");
  const [maxAllowedTokens, setMaxAllowedTokens] = useState(80);

  const preflightResult = RUN_PREFLIGHT_TOKEN_SIMULATION(preflightPrompt, preflightContext, maxAllowedTokens);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Operations [Enterprise AI Architecture & Token Governance]"
        title="Enterprise AI Architecture & Operations: Beating Token Limits at Scale"
        description="When token limits and latency bottlenecks threaten enterprise AI delivery, the solution shifts from individual prompt engineering to systematic AI architecture and operations. Explore organizational frameworks for AI Gateways, Tier-1 Semantic Caching, Dynamic Model Cascades, Multi-Stage RAG compression, and Map-Reduce document operations."
        metrics={[
          { label: 'Token Reduction', value: '85% - 95% Across Org' },
          { label: 'Annual Cost Savings', value: '$1.2M+ on High Volume' },
          { label: 'Architecture', value: 'Semantic Cache + RAG + Router' },
          { label: 'Processing Pattern', value: 'Parallel Map-Reduce & Cascades' }
        ]}
      />

      <Container size="wide">
        {/* STATUTORY REGULATORY & LEGAL ADVICE DISCLAIMER */}
        <div style={{
          marginTop: 'var(--ds-space-4)',
          marginBottom: 'var(--ds-space-6)',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.08)',
          borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderLeft: '4px solid #EF4444',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12
        }}>
          <span style={{ fontSize: 18 }}>⚖️</span>
          <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', lineHeight: 1.55 }}>
            <strong style={{ color: '#EF4444' }}>LEGAL NOTICE — NOT LEGAL COUNSEL OR STATUTORY CERTIFICATION:</strong>{' '}
            The contract analysis, indemnification review, GDPR adequacy evaluations, Schrems II jurisprudence citations, and regulatory SLA models simulated in this module are for engineering architecture research and technical demonstration only. They do not constitute formal legal advice, representation, or contract enforceability opinions. Consult a qualified, licensed attorney for all binding commercial agreements and statutory compliance determinations.
          </div>
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'framework', icon: '🏛️', label: '1. Strategy Framework', desc: '4 pillars & executive alignment guides' },
            { id: 'pipeline', icon: '⚡', label: '2. Advanced RAG & Token Pipeline', desc: 'Live workflow & token compression simulation' },
            { id: 'mapreduce', icon: '📑', label: '3. Map-Reduce Operations', desc: 'Live parallel document worker simulation' },
            { id: 'router', icon: '🔀', label: '4. Dynamic Model Routing', desc: 'Live complexity classifier & cascade simulator' },
            { id: 'calculator', icon: '💰', label: '5. Token FinOps Calculator', desc: 'ROI, annual cost & quota modeling' },
            { id: 'resources', icon: '📚', label: '6. Playbook & Benchmarks', desc: 'Cost-benefit, Claude vs GPT vs Gemini, DBs & Rerankers' },
            { id: 'code', icon: '🛠️', label: '7. AI Gateway & Python Code', desc: 'LiteLLM, semantic cache & scripts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-frontiers-primary, #5EC4C8)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: STRATEGY FRAMEWORK ─── */}
        {activeSubTab === 'framework' && (
          <Stack gap={6}>
            <Callout variant="info">
              <strong>Enterprise Token Governance Shift:</strong> Moving from ad-hoc prompt tweaks to platform-level infrastructure. Managing token constraints at an organizational level requires standardizing gateway policies, enforcing multi-tier semantic caching, implementing smart routing cascades, and decoupling big document processing from synchronous web requests.
            </Callout>

            <Grid cols={2} gap={4}>
              {ENTERPRISE_PILLARS.map(pillar => (
                <Card key={pillar.id} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                  <Stack gap={3}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{pillar.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{pillar.title}</h4>
                      </div>
                      <Badge variant="success">{pillar.metrics.savings}</Badge>
                    </div>

                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>
                      {pillar.summary}
                    </p>

                    <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '6px' }}>
                        KEY ARCHITECTURAL MECHANISMS:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        {pillar.mechanisms.map((mech, i) => (
                          <li key={i}>{mech}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      <span><strong>Latency:</strong> {pillar.metrics.latency}</span>
                      <span>•</span>
                      <span><strong>Operational Risk:</strong> {pillar.metrics.risk}</span>
                    </div>
                  </Stack>
                </Card>
              ))}
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>📋 Enterprise AI Token Governance Maturity Model</h4>
              <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Maturity Level</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Architecture Pattern</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Token Efficiency</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Cost / 1M Requests</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Organizational Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#ef4444' }}>Level 1: Ad-Hoc</td>
                      <td style={{ padding: '8px' }}>Direct API calls, raw document prompting</td>
                      <td style={{ padding: '8px' }}>0% (Full context overflow)</td>
                      <td style={{ padding: '8px' }}>$15,000 - $35,000</td>
                      <td style={{ padding: '8px', color: '#ef4444' }}>Severe Budget Spikes, Lost in the Middle</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#f59e0b' }}>Level 2: Basic RAG</td>
                      <td style={{ padding: '8px' }}>Fixed chunking (1000 tok) + vector DB</td>
                      <td style={{ padding: '8px' }}>60% reduction</td>
                      <td style={{ padding: '8px' }}>$6,000 - $12,000</td>
                      <td style={{ padding: '8px' }}>Chunk truncation, irrelevant context noise</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#3A9B9F' }}>Level 3: Multi-Stage</td>
                      <td style={{ padding: '8px' }}>Hybrid search + Reranking + LLMLingua</td>
                      <td style={{ padding: '8px' }}>85% reduction</td>
                      <td style={{ padding: '8px' }}>$2,200 - $4,500</td>
                      <td style={{ padding: '8px' }}>Low (High precision grounded answers)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', color: '#3A9B9F' }}>Level 4: Enterprise Ops</td>
                      <td style={{ padding: '8px' }}>AI Gateway + Semantic Cache + Router + Map-Reduce</td>
                      <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>94%+ reduction</td>
                      <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>$650 - $1,400</td>
                      <td style={{ padding: '8px', color: '#3A9B9F' }}>Minimal (Guaranteed SLAs & Cost Predictability)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            {/* EXECUTIVE & STAKEHOLDER ARCHITECTURAL GUIDES */}
            <Card style={{ padding: 'var(--ds-space-5)', background: '#0b1120', border: '1px solid #1e3a8a' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#60a5fa', fontSize: '18px' }}>
                  👥 Executive & Stakeholder Architectural Alignment Guide
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
                  These 3 core blueprints are designed to be easily shared with engineering teams, architects, and business stakeholders to align on the technical approach to scaling AI delivery without hitting context bottlenecks.
                </p>
              </div>

              <Grid cols={3} gap={4}>
                {EXECUTIVE_VISUAL_GUIDES.map(guide => (
                  <div key={guide.id} style={{ background: '#090d16', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{guide.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc' }}>{guide.title}</h4>
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '8px' }}>
                      {guide.audience}
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {guide.description}
                    </p>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', background: 'rgba(56, 189, 248, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong>Takeaway:</strong> {guide.keyTakeaway}
                    </div>
                  </div>
                ))}
              </Grid>
            </Card>

            {/* ENTERPRISE CONTEXT STRATEGY DECISION TREE */}
            <EnterpriseDecisionTreeDiagram />
          </Stack>
        )}

        {/* ─── SUBTAB 2: ADVANCED RAG & TOKEN PIPELINE (LIVE SIMULATION) ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            {/* Architectural Visual Guide Brief */}
            <Callout variant="info">
              <strong>📘 Architectural Guide: Advanced RAG & Token Optimization Pipeline</strong><br />
              This diagram shows the ideal data flow for minimizing token usage while maximizing accuracy. It highlights how a user query is checked against a semantic cache first (saving tokens entirely if there's a match), then passed through hybrid search and a reranker to isolate only the most relevant text, compressed to remove noise, and finally sent to the LLM.
            </Callout>

            {/* Visual Diagram */}
            <AdvancedRAGPipelineDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Live RAG & Token Optimization Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate how real-world enterprise documents are processed through Semantic Cache ➔ Hybrid Search ➔ Cross-Encoder Reranker ➔ LLMLingua.
                  </p>
                </div>
                <Badge variant={ragSimResult.status === 'CACHE_HIT' ? 'success' : 'primary'}>
                  {ragSimResult.stage}
                </Badge>
              </div>

              <Grid cols={3} gap={4} style={{ marginBottom: '20px' }}>
                {/* Control 1: Dataset Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#3A9B9F' }}>
                    1. Select Enterprise Corpus:
                  </label>
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', color: 'white', borderRadius: '6px' }}
                  >
                    {SAMPLE_ENTERPRISE_DATASETS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.rawTokens.toLocaleString()} tokens)</option>
                    ))}
                  </select>
                </div>

                {/* Control 2: Semantic Cache Toggle */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#f59e0b' }}>
                    2. Tier-1 Semantic Cache:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setIsCacheHit(false)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: !isCacheHit ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: !isCacheHit ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                        color: !isCacheHit ? '#5EC4C8' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Miss (Full Pipeline)
                    </button>
                    <button
                      onClick={() => setIsCacheHit(true)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: isCacheHit ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: isCacheHit ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                        color: isCacheHit ? '#5EC4C8' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Hit (Instant 12ms)
                    </button>
                  </div>
                </div>

                {/* Control 3: Reranker Top-K & Compression */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#a855f7' }}>Rerank Top-K Chunks: {topKCount}</span>
                    <span style={{ color: '#3A9B9F' }}>Compress: {compressionRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={topKCount}
                    onChange={(e) => setTopKCount(Number(e.target.value))}
                    disabled={isCacheHit}
                    style={{ width: '100%', accentColor: '#a855f7', opacity: isCacheHit ? 0.3 : 1 }}
                  />
                </div>
              </Grid>

              {/* LIVE SIMULATION TELEMETRY */}
              <div style={{ background: '#090d16', borderRadius: '8px', padding: '18px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#3A9B9F' }}>
                    📊 Live Execution Telemetry & Cost Meter
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span><strong>Total Token Reduction:</strong> <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{ragSimResult.tokenReductionPct}%</span></span>
                    <span><strong>End-to-End Latency:</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{ragSimResult.latencyMs}ms</span></span>
                    <span><strong>Inference Cost:</strong> <span style={{ color: '#a855f7', fontWeight: 'bold' }}>${ragSimResult.costUsd}</span></span>
                  </div>
                </div>

                {/* STEP-BY-STEP TRACE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {ragSimResult.traceSteps.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}>
                      <div style={{ color: '#cbd5e1' }}>
                        <strong style={{ color: '#3A9B9F' }}>{idx + 1}. {t.node}:</strong> {t.detail}
                      </div>
                      <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{t.time}</span>
                    </div>
                  ))}
                </div>

                {/* GROUNDED OUTPUT */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #5EC4C8', borderRadius: '6px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 GENERATED GROUNDED ANSWER:
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.6' }}>
                    {ragSimResult.response}
                  </div>
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: MAP-REDUCE OPERATIONS (LIVE SIMULATION) ─── */}
        {activeSubTab === 'mapreduce' && (
          <Stack gap={6}>
            {/* Architectural Visual Guide Brief */}
            <Callout variant="info">
              <strong>📘 Architectural Guide: Map-Reduce Pattern for Long Documents</strong><br />
              This infographic breaks down how to handle inputs that are simply too large for any single context window. It shows a massive document being split into manageable chunks (Map phase), processed in parallel by the LLM to generate intermediate summaries, and then combined into a single, cohesive final output (Reduce phase).
            </Callout>

            {/* Visual Diagram */}
            <MapReducePatternDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>📑 Live Parallel Map-Reduce Worker Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Observe how a 280,000 token corporate agreement is partitioned across concurrent SLM map workers and synthesized in a single master reduce call.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Partitions:</span>
                  {[2, 3, 4, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setPartitionCount(num)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: partitionCount === num ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: partitionCount === num ? '#5EC4C8' : '#090d16',
                        color: partitionCount === num ? '#000' : 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {num}x Workers
                    </button>
                  ))}
                </div>
              </div>

              {/* MAP WORKERS GRID */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '8px' }}>
                  PARALLEL MAP PHASE WORKERS ({partitionCount} Concurrent SLM Instances):
                </div>
                <Grid cols={2} gap={3}>
                  {mapReduceResult.partitions.map(p => (
                    <div key={p.partitionId} style={{ background: '#090d16', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>{p.title}</span>
                        <Badge variant="neutral">{p.tokenCount.toLocaleString()} tokens</Badge>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                        <div><strong>Worker:</strong> {p.workerModel}</div>
                        <div style={{ color: '#3A9B9F', marginTop: '2px' }}><strong>Extracted:</strong> {p.extractedJson.extractedKeyFact}</div>
                      </div>
                    </div>
                  ))}
                </Grid>
              </div>

              {/* MASTER REDUCE SYNTHESIS */}
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #5EC4C8', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F' }}>
                    MASTER REDUCE SYNTHESIS PHASE ({mapReduceResult.reduceSynthesis.reducerModel})
                  </div>
                  <Badge variant="success">Input to Master: {mapReduceResult.reduceSynthesis.inputTokensToReducer} tokens (99.4% Compression)</Badge>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#f1f5f9', lineHeight: '1.6' }}>
                  {mapReduceResult.reduceSynthesis.summary}
                </p>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong>Risk Assessment:</strong> <span style={{ color: '#f59e0b' }}>{mapReduceResult.reduceSynthesis.overallRisk}</span> • Full 280,000 token corpus analyzed with zero token overflow.
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: DYNAMIC MODEL ROUTING (LIVE SIMULATION) ─── */}
        {activeSubTab === 'router' && (
          <Stack gap={6}>
            {/* Architectural Visual Guide Brief */}
            <Callout variant="info">
              <strong>📘 Architectural Guide: Dynamic Model Routing (The Router Pattern)</strong><br />
              This flowchart illustrates cost and token governance. Instead of sending every request to a massive, expensive model, an "AI Router" evaluates the complexity of the incoming request. Simple tasks are routed to small, fast, low-token models, while complex reasoning tasks are routed to large models. This dramatically reduces overall token consumption across an organization.
            </Callout>

            {/* Visual Diagram */}
            <DynamicModelRoutingDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>🔀 Live Dynamic Model Complexity Router</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Test how the AI router classifies query difficulty and dynamically directs traffic to Small Fast SLMs vs Large Frontier Reasoning Models.
              </p>

              {/* PROMPT SELECTOR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {PRESET_ROUTER_PROMPTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPromptId(p.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: selectedPromptId === p.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedPromptId === p.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--ds-color-bg-surface)',
                      color: 'var(--ds-color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: selectedPromptId === p.id ? '#5EC4C8' : '#f8fafc' }}>
                        {p.label}
                      </span>
                      <Badge variant={p.complexity < 0.5 ? 'success' : 'primary'}>
                        Complexity: {p.complexity}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      "{p.prompt}"
                    </div>
                  </button>
                ))}
              </div>

              {/* ROUTER DECISION TRACE */}
              <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '12px' }}>
                  ROUTING DECISION ENGINE TRACE:
                </div>

                <Grid cols={2} gap={4} style={{ marginBottom: '14px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ROUTED MODEL TARGET</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: routerResult.isHighComplexity ? '#a855f7' : '#5EC4C8', marginTop: '2px' }}>
                      {routerResult.targetModel}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      Latency: <strong>{routerResult.latency}</strong> | Cost: <strong>{routerResult.cost}</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>FINOPS SAVINGS vs DIRECT FRONTIER</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#3A9B9F', marginTop: '2px' }}>
                      {routerResult.savingsPct}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      Baseline Frontier Cost: <del style={{ color: '#ef4444' }}>{routerResult.baselineCost}</del>
                    </div>
                  </div>
                </Grid>

                <div style={{ fontSize: '12px', color: '#e2e8f0', background: 'rgba(56, 189, 248, 0.08)', padding: '10px 14px', borderRadius: '4px', borderLeft: '3px solid #5EC4C8' }}>
                  <strong>Classification Rational:</strong> {routerResult.classificationReason}
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: TOKEN FINOPS CALCULATOR ─── */}
        {activeSubTab === 'calculator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>💰 Enterprise AI Token FinOps & ROI Calculator</h3>
              <p style={{ margin: '0 0 20px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Calculate monthly and annual cost savings when implementing Tier-1 Semantic Caching, Multi-Stage RAG context compression, and SLM Model Routing across organizational workloads.
              </p>

              <Grid cols={2} gap={4}>
                {/* SLIDERS */}
                <Stack gap={4}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Monthly Inbound AI Requests:</span>
                      <strong style={{ color: '#3A9B9F' }}>{monthlyRequests.toLocaleString()} reqs</strong>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="50000"
                      value={monthlyRequests}
                      onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#5EC4C8' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Avg Raw Document Tokens per Request:</span>
                      <strong style={{ color: '#3A9B9F' }}>{avgRawTokens.toLocaleString()} tokens</strong>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="150000"
                      step="5000"
                      value={avgRawTokens}
                      onChange={(e) => setAvgRawTokens(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#5EC4C8' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Tier-1 Semantic Cache Hit Rate:</span>
                      <strong style={{ color: '#f59e0b' }}>{cacheHitRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="2"
                      value={cacheHitRate}
                      onChange={(e) => setCacheHitRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Small/Fast Model Routing Ratio:</span>
                      <strong style={{ color: '#a855f7' }}>{smallModelRouteRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="95"
                      step="5"
                      value={smallModelRouteRate}
                      onChange={(e) => setSmallModelRouteRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#a855f7' }}
                    />
                  </div>
                </Stack>

                {/* RESULTS CARD */}
                <div style={{ background: '#090d16', border: '1px solid #5EC4C8', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    FINANCIAL IMPACT SUMMARY
                  </div>

                  <div style={{ marginTop: '14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ESTIMATED ANNUAL ORGANIZATIONAL SAVINGS</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3A9B9F' }}>{finops.annualSavings}</div>
                    <div style={{ fontSize: '13px', color: '#3A9B9F' }}>{finops.savingsPercent}% Total Token Spend Reduction</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#ef4444' }}>Baseline Monthly Cost (Raw Frontier):</span>
                      <strong>{finops.baselineMonthlyCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#3A9B9F' }}>Optimized Architecture Monthly Cost:</span>
                      <strong>{finops.optimizedMonthlyCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#f59e0b' }}>Net Monthly Cash Savings:</span>
                      <strong>{finops.monthlySavings}</strong>
                    </div>
                  </div>
                </div>
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: PLAYBOOK & BENCHMARKS ─── */}
        {activeSubTab === 'resources' && (
          <Stack gap={6}>
            {/* 1. Cost-Benefit Analysis Matrix */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#3A9B9F' }}>📊 1. Cost-Benefit Analysis Matrix</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Comparing implementation effort, token savings, accuracy impact, capex/opex, and rollout timelines across core optimization strategies.
                </p>
              </div>

              <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Strategy</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Implementation Effort</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Token Savings</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Accuracy Impact</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Time-to-Production</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Key Risk / Trade-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COST_BENEFIT_MATRIX.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#f8fafc' }}>{row.strategy}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <Badge variant={row.effort === 'Low' ? 'success' : row.effort === 'Medium' ? 'primary' : 'warning'}>
                            {row.effort}
                          </Badge>
                        </td>
                        <td style={{ padding: '10px 8px', color: '#3A9B9F', fontWeight: 'bold' }}>{row.tokenSavings}</td>
                        <td style={{ padding: '10px 8px', color: '#3A9B9F' }}>{row.accuracyImpact}</td>
                        <td style={{ padding: '10px 8px', color: '#cbd5e1' }}>{row.timeToProduction}</td>
                        <td style={{ padding: '10px 8px', color: '#f59e0b', fontSize: '11px' }}>{row.keyRisk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* 2. Model Context Window Comparison Guide */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#a855f7' }}>🔍 2. Model Comparison Guide: Claude 200K vs. GPT-4 128K vs. Gemini 1M-2M+</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  When to use massive context windows vs. when multi-stage RAG compression is essential to avoid attention degradation and cost overruns.
                </p>
              </div>

              <Grid cols={2} gap={4}>
                {MODEL_WINDOW_COMPARISON.map((m, idx) => (
                  <div key={idx} style={{ background: '#090d16', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>{m.model}</h4>
                      <Badge variant="primary">{m.windowSize}</Badge>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
                      <span>Input: <strong style={{ color: '#3A9B9F' }}>{m.inputPrice}</strong></span>
                      <span>•</span>
                      <span>Output: <strong style={{ color: '#3A9B9F' }}>{m.outputPrice}</strong></span>
                      <span>•</span>
                      <span>90% Recall: <strong style={{ color: '#f59e0b' }}>{m.recallAt90Depth}</strong></span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '8px' }}>
                      <strong>Best Workloads:</strong> {m.bestWorkload}
                    </div>

                    <div style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong>⚠️ Attention Risk:</strong> {m.degradationWarning}
                    </div>
                  </div>
                ))}
              </Grid>
            </Card>

            {/* 3. Vector Database Vendor Evaluation Checklist */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#3A9B9F' }}>🗄️ 3. Vendor Evaluation Checklist: Qdrant vs. Pinecone vs. Weaviate vs. pgvector</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Evaluating vector infrastructure for enterprise hybrid search, metadata filtering speed, multi-tenancy, and compliance certifications.
                </p>
              </div>

              <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Vector Store</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Hosting Model</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Hybrid Search</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Filtering Speed</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Cost Profile</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#3A9B9F' }}>Enterprise Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VECTOR_DB_EVALUATION.map((v, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 'bold', color: '#f8fafc' }}>{v.vendor}</td>
                        <td style={{ padding: '10px 8px', color: '#cbd5e1' }}>{v.hosting}</td>
                        <td style={{ padding: '10px 8px', color: '#3A9B9F' }}>{v.hybridSearch}</td>
                        <td style={{ padding: '10px 8px', color: '#3A9B9F' }}>{v.filteringSpeed}</td>
                        <td style={{ padding: '10px 8px', color: '#f59e0b' }}>{v.costProfile}</td>
                        <td style={{ padding: '10px 8px', color: '#cbd5e1', fontSize: '11px' }}>{v.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* 4. Performance Benchmarks: Rerankers & Security */}
            <Grid cols={2} gap={4}>
              {/* Reranker Benchmarks */}
              <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#3A9B9F' }}>⚡ 4. Reranking Model Latency & NDCG Benchmarks</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {RERANKER_BENCHMARKS.map((r, idx) => (
                    <div key={idx} style={{ background: '#090d16', padding: '10px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <strong style={{ color: '#f8fafc' }}>{r.model}</strong>
                        <span style={{ color: '#3A9B9F' }}>NDCG@10: {r.ndcg10}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#94a3b8' }}>
                        <span>P50: <strong>{r.latencyP50}</strong></span>
                        <span>•</span>
                        <span>P95: <strong>{r.latencyP95}</strong></span>
                        <span>•</span>
                        <span>{r.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Security & Compliance */}
              <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#f59e0b' }}>🛡️ 5. Security & Compliance Data Handling Patterns</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SECURITY_COMPLIANCE_PATTERNS.map((s, idx) => (
                    <div key={idx} style={{ background: '#090d16', padding: '10px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '2px' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '4px' }}>
                        {s.benefit}
                      </div>
                      <div style={{ fontSize: '10px', color: '#3A9B9F', fontFamily: 'monospace' }}>
                        {s.implementation}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Grid>

            {/* 6. ADVANCED RAG DEEP-DIVE: CHUNKING STRATEGIES */}
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#3A9B9F', fontSize: '18px' }}>
                  🏗️ 6. Advanced Chunking Strategies for Maximum Accuracy
                </h3>
                <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
                  Moving beyond basic character splitting to structural, semantic, and hierarchical parent-child retrieval architectures.
                </p>
              </div>

              <Grid cols={2} gap={4}>
                {ADVANCED_CHUNKING_STRATEGIES.map(c => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc' }}>{c.title}</h4>
                      <Badge variant="success">{c.badge}</Badge>
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', marginBottom: '6px' }}>
                      <strong>Best For:</strong> {c.bestFor}
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <strong>How it works:</strong> {c.howItWorks}
                    </p>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 8px', borderRadius: '4px', marginBottom: '6px' }}>
                      <strong>Why it wins:</strong> {c.whyItWins}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      <strong>Framework Tools:</strong> {c.tools}
                    </div>
                  </div>
                ))}
              </Grid>
            </Card>

            {/* 7. EXACT PROMPT TEMPLATES FOR ENTERPRISE RAG */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ margin: 0, color: '#3A9B9F' }}>📝 7. Exact Prompt Templates for Enterprise RAG</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Battle-tested templates to strictly enforce factual grounding, prevent hallucinations, and resolve conflicting sources.
                </p>
              </div>

              {/* Template Switcher */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {ENTERPRISE_PROMPT_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: selectedTemplateId === t.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedTemplateId === t.id ? 'rgba(56, 189, 248, 0.2)' : '#090d16',
                      color: selectedTemplateId === t.id ? '#5EC4C8' : '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {t.title}
                  </button>
                ))}
              </div>

              {/* Selected Template Display */}
              {(() => {
                const currentTmpl = ENTERPRISE_PROMPT_TEMPLATES.find(t => t.id === selectedTemplateId) || ENTERPRISE_PROMPT_TEMPLATES[0];
                return (
                  <div>
                    <div style={{ fontSize: '12px', color: '#3A9B9F', marginBottom: '8px' }}>
                      <strong>Recommended Use Case:</strong> {currentTmpl.useCase}
                    </div>
                    <pre style={{ margin: 0, padding: '14px', background: '#090d16', borderRadius: '6px', fontSize: '12px', color: '#f8fafc', whiteSpace: 'pre-wrap', fontFamily: 'monospace', border: '1px solid var(--ds-color-border-subtle)' }}>
                      {currentTmpl.promptText}
                    </pre>
                  </div>
                );
              })()}
            </Card>

            {/* 8. RAG ACCURACY OPERATIONAL PRO-TIPS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: '#0c1322', border: '1px solid #5EC4C8' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#3A9B9F', fontSize: '16px' }}>
                🎯 8. Operational Pro-Tips for Maximum Retrieval Accuracy (The Secret Sauce)
              </h3>
              <Grid cols={3} gap={4}>
                {RAG_ACCURACY_PRO_TIPS.map((tip, idx) => (
                  <div key={idx} style={{ background: '#090d16', padding: '14px', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{tip.icon}</span>
                      <h4 style={{ margin: 0, fontSize: '13px', color: '#f8fafc' }}>{tip.title}</h4>
                    </div>
                    <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '6px' }}>
                      <strong>Problem:</strong> {tip.problem}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', lineHeight: '1.4' }}>
                      <strong>Fix:</strong> {tip.solution}
                    </div>
                  </div>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 7: CODE, PRE-FLIGHT & FALLBACKS ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            {/* Visual Architectural Diagram */}
            <PreflightFallbackWorkflowDiagram />

            {/* LIVE FALLBACK CASCADE & CIRCUIT BREAKER SIMULATOR */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>⚡ Live Multi-Tier Fallback Cascade & Circuit Breaker Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Simulate how incoming token bursts, moderate context overflows, and HTTP 429 rate limit outages dynamically trip circuit breakers and fail over seamlessly.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Badge variant={fallbackSimResult.circuitBreakerStatus.includes('TRIPPED') || fallbackSimResult.circuitBreakerStatus.includes('OPEN') ? 'warning' : 'success'}>
                    Breaker: {fallbackSimResult.circuitBreakerStatus}
                  </Badge>
                  <Badge variant="primary">
                    {fallbackSimResult.deliveryStatus}
                  </Badge>
                </div>
              </div>

              {/* Scenario Selectors & Circuit Breaker Switch */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
                  SELECT INCOMING SIMULATION SCENARIO:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {FALLBACK_SCENARIOS.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenarioId(s.id)}
                      style={{
                        flex: 1,
                        minWidth: '220px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: selectedScenarioId === s.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: selectedScenarioId === s.id ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                        color: selectedScenarioId === s.id ? '#5EC4C8' : '#cbd5e1',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{s.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.incomingTokens.toLocaleString()} tokens ➔ {s.expectedPath}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Breaker Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0b1120', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  <strong>Manual Circuit Breaker Trip:</strong> Force-open breaker to test instantaneous Tier-2 failover to AWS Bedrock.
                </div>
                <button
                  onClick={() => setManualCircuitTrip(!manualCircuitTrip)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: 'none',
                    background: manualCircuitTrip ? '#ef4444' : '#5EC4C8',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {manualCircuitTrip ? 'TRIPPED (FORCED OPEN)' : 'CLOSED (HEALTHY)'}
                </button>
              </div>

              {/* Live Fallback Telemetry */}
              <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3A9B9F' }}>📊 Fallback Cascade Execution Trace</span>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
                    <span>Active Provider: <strong style={{ color: '#3A9B9F' }}>{fallbackSimResult.activeProvider}</strong></span>
                    <span>•</span>
                    <span>Latency: <strong style={{ color: '#f59e0b' }}>{fallbackSimResult.latencyMs}ms</strong></span>
                  </div>
                </div>

                {/* Steps Trace */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                  {fallbackSimResult.traceSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}>
                      <div style={{ color: '#cbd5e1' }}>
                        <strong style={{ color: step.status.includes('FAIL') ? '#ef4444' : step.status.includes('AMBER') ? '#f59e0b' : '#5EC4C8' }}>
                          {idx + 1}. {step.node}:
                        </strong> {step.detail}
                      </div>
                      <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{step.time}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #5EC4C8', borderRadius: '6px', padding: '12px', fontSize: '12px', color: '#f8fafc' }}>
                  {fallbackSimResult.simulatedResponse}
                </div>
              </div>
            </Card>

            {/* 1. Interactive Live Pre-Flight Token Guard Sandbox */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>⚡ 2. Live "Pre-Flight" Token Guard & Auto-Truncation Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Test the quickest quick-win pattern to prevent LLM API crashes and massive budget spikes by estimating tokens, calculating overflow, and injecting safe truncation headers.
                  </p>
                </div>
                <Badge variant={preflightResult.truncationApplied ? 'warning' : 'success'}>
                  {preflightResult.safetyStatus}
                </Badge>
              </div>

              {/* Sandbox Controls */}
              <Grid cols={2} gap={4} style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '6px' }}>
                    1. User Prompt:
                  </label>
                  <textarea
                    rows={3}
                    value={preflightPrompt}
                    onChange={(e) => setPreflightPrompt(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', color: '#f8fafc', fontSize: '12px', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}>
                      2. Max Safe Token Limit: {maxAllowedTokens} tokens
                    </label>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Safety Threshold</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={maxAllowedTokens}
                    onChange={(e) => setMaxAllowedTokens(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#f59e0b', marginBottom: '12px' }}
                  />
                  <div style={{ fontSize: '11px', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px' }}>
                    Adjust limit to trigger graceful degradation / auto-truncation logic.
                  </div>
                </div>
              </Grid>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '6px' }}>
                  3. Retrieved Context (Simulated Knowledge Corpus / RAG Chunks):
                </label>
                <textarea
                  rows={4}
                  value={preflightContext}
                  onChange={(e) => setPreflightContext(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', color: '#cbd5e1', fontSize: '12px', resize: 'vertical' }}
                />
              </div>

              {/* Telemetry Meter */}
              <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3A9B9F' }}>📊 Pre-Flight Safety Telemetry</span>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span>Raw Input: <strong>{preflightResult.totalRawTokens} tokens</strong></span>
                    <span>•</span>
                    <span>Safe Payload: <strong style={{ color: '#3A9B9F' }}>{preflightResult.finalTokens} tokens</strong></span>
                    <span>•</span>
                    <span>Truncation: <strong style={{ color: preflightResult.truncationApplied ? '#f59e0b' : '#5EC4C8' }}>{preflightResult.truncationApplied ? `YES (-${preflightResult.tokensTruncated} tokens)` : 'NONE'}</strong></span>
                  </div>
                </div>

                {preflightResult.truncationApplied && (
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#fde68a', marginBottom: '12px' }}>
                    ⚠️ {preflightResult.warningMessage}
                  </div>
                )}

                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>
                    CONSTRUCTED SAFE PAYLOAD SENT TO LLM:
                  </div>
                  <pre style={{ margin: 0, padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {preflightResult.safePayload}
                  </pre>
                </div>
              </div>
            </Card>

            {/* 2. Production Python/FastAPI Pre-Flight Token Guard Code */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#3A9B9F' }}>🐍 2. Production Pre-Flight Token Check (Python / FastAPI)</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Drop-in FastAPI middleware using tiktoken to estimate tokens, auto-truncate oversized context, and emit observability warnings.
              </p>

              <CodeBlock
                language="python"
                code={`import tiktoken
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

app = FastAPI()

# Initialize tokenizer (e.g., for GPT-4 / Claude / Llama)
encoder = tiktoken.get_encoding("cl100k_base")

class AIRequest(BaseModel):
    user_prompt: str
    retrieved_context: str = ""
    max_allowed_tokens: int = 4000  # Set your safe organizational limit here

@app.post("/generate")
async def generate_response(request: AIRequest):
    # 1. Pre-flight Token Estimation
    prompt_tokens = len(encoder.encode(request.user_prompt))
    context_tokens = len(encoder.encode(request.retrieved_context))
    total_tokens = prompt_tokens + context_tokens

    # 2. Graceful Degradation / Auto-Truncation Logic
    warning_message = ""
    final_context = request.retrieved_context

    if total_tokens > request.max_allowed_tokens:
        # Calculate how many tokens we need to cut from the context
        overflow = total_tokens - request.max_allowed_tokens
        context_bytes_to_keep = int(len(request.retrieved_context) * (1 - (overflow / context_tokens)))
        
        # Truncate the context (keeping the end is often better for recent info)
        final_context = request.retrieved_context[-context_bytes_to_keep:]
        warning_message = f"[SYSTEM NOTICE: Input exceeded {request.max_allowed_tokens} token limit. Older context was truncated to ensure delivery.]"
        
        # Optional: Log this to your observability platform (Datadog, LangSmith, etc.)
        print(f"WARNING: Token limit exceeded. Truncated {overflow} tokens.")

    # 3. Construct Final Safe Payload
    safe_prompt = f"{warning_message}\\n\\nContext:\\n{final_context}\\n\\nUser Query:\\n{request.user_prompt}"
    
    # Call your LLM API here with 'safe_prompt'
    # response = await llm_client.generate(safe_prompt)
    
    return {
        "status": "success",
        "tokens_estimated": len(encoder.encode(safe_prompt)),
        "truncation_applied": bool(warning_message),
        "message": "Request processed safely within token limits."
    }`}
              />
            </Card>

            {/* 3. Production Semantic Caching Implementation (Redis + Vector Search Code in Python) */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#3A9B9F' }}>⚡ 3. Production Semantic Caching Implementation (Redis + Vector Search)</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Production-grade semantic caching layer using Redis string hashes for exact matches and Qdrant / Redis vector similarity for semantic matches (saves 20–40% tokens).
              </p>

              <CodeBlock
                language="python"
                code={`import hashlib
import json
import redis
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Distance, VectorParams
from sentence_transformers import SentenceTransformer
import openai

# 1. Initialize Clients & Fast Embedding Model
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
qdrant = QdrantClient(host="localhost", port=6333)
embedder = SentenceTransformer("all-MiniLM-L6-v2")

CACHE_COLLECTION = "enterprise_semantic_cache"
SIMILARITY_THRESHOLD = 0.92  # Cosine threshold for semantic match
CACHE_TTL_SECONDS = 86400    # 24 hour TTL

# Ensure Qdrant collection exists
if not qdrant.collection_exists(CACHE_COLLECTION):
    qdrant.create_collection(
        collection_name=CACHE_COLLECTION,
        vectors_config=VectorParams(size=384, distance=Distance.COSINE)
    )

def get_semantic_cached_response(prompt: str) -> dict | None:
    """
    Tier-1 Exact Match + Tier-2 Vector Semantic Cache Lookup
    """
    # FAST PATH 1: Exact String MD5 Hash Match (Redis O(1) < 1ms)
    prompt_hash = hashlib.md5(prompt.strip().lower().encode()).hexdigest()
    exact_hit = redis_client.get(f"exact_cache:{prompt_hash}")
    if exact_hit:
        return {"response": exact_hit, "source": "EXACT_HASH_CACHE", "latency_ms": 0.8}

    # FAST PATH 2: Vector Semantic Search (< 15ms)
    query_vector = embedder.encode(prompt).tolist()
    search_hits = qdrant.search(
        collection_name=CACHE_COLLECTION,
        query_vector=query_vector,
        limit=1,
        score_threshold=SIMILARITY_THRESHOLD
    )

    if search_hits:
        hit = search_hits[0]
        return {
            "response": hit.payload["response"],
            "source": "SEMANTIC_VECTOR_CACHE",
            "similarity": round(hit.score, 4),
            "latency_ms": 14.2
        }

    return None

def set_semantic_cache(prompt: str, response: str):
    """
    Store response in both exact Redis key and Qdrant semantic vector index
    """
    prompt_hash = hashlib.md5(prompt.strip().lower().encode()).hexdigest()
    
    # Store exact match with TTL
    redis_client.setex(f"exact_cache:{prompt_hash}", CACHE_TTL_SECONDS, response)
    
    # Store vector embedding in Qdrant
    query_vector = embedder.encode(prompt).tolist()
    point_id = int(hashlib.sha256(prompt.encode()).hexdigest()[:15], 16)
    
    qdrant.upsert(
        collection_name=CACHE_COLLECTION,
        points=[
            PointStruct(
                id=point_id,
                vector=query_vector,
                payload={"prompt": prompt, "response": response}
            )
        ]
    )`}
              />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
