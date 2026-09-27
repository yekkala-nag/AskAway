/**
 * Redesigned Overview Tab — Adaptive Learning Hub
 * 
 * Replaces the RAG-only entry point with an adaptive, diagnostic-driven learning hub:
 * 1. Adaptive Hero with intelligent "Start Learning" (defaults to Foundations: firstaiapp)
 * 2. 3-Step Interactive Diagnostic Assessment with instant roadmap recommendation
 * 3. 4 Curated Adaptive Learning Tracks with progress counters and track activation
 * 4. 4 Balanced AI Engineering Pillars (Foundations, RAG, Agents, Enterprise AI Ops)
 * 5. Architecture Concepts, Pipeline Explorer, and Key Resources
 */

import { useState, useEffect } from 'react';
import { TABS_REGISTRY, UMBRELLA_TOPICS } from '../registry/tabsRegistry.js';
import { Container, Section, Grid, Flex, Stack } from '../components/layout/Primitives.jsx';
import { Hero, Diagram, CodeBlock, Accordion, Tabs, Stepper } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  ADAPTIVE_TRACKS,
  JOURNEY_TRACKS,
  getCurrentTrackId,
  setCurrentTrackId,
  getTrackById,
  getTrackProgress,
  diagnoseTrack,
  getPlacement,
  subscribeToAdaptiveProgress
} from '../services/adaptiveLearning.js';
import { isMastered, getEvidence } from '../services/mastery.js';
import { DiagnosticQuiz } from '../components/ui/DiagnosticQuiz.jsx';
import { TestOutGate } from '../components/ui/TestOutGate.jsx';
import { SkillTree } from '../components/ui/SkillTree.jsx';
import { ExitCheck } from '../components/ui/ExitCheck.jsx';
import {
  getNextBest,
  getReviewQueue,
  getUmbrellaMastery,
  hasAnyEvidence
} from '../services/recommend.js';

const FOUR_PILLARS = [
  {
    id: 'foundations',
    title: 'Foundations & Attention Mechanisms',
    icon: '🌱',
    color: '#3A9B9F',
    summary: 'Core LLM internals: building your first app, token sampling temperature/top-p, self-attention QKV, and structured outputs.',
    tabs: [
      { id: 'firstaiapp', label: 'First AI App', icon: '🚀', tag: 'Start Here' },
      { id: 'promptfundamentals', label: 'Prompt Fundamentals', icon: '📝', tag: 'Core' },
      { id: 'llmsampling', label: 'Sampling & Temp', icon: '🎲', tag: 'Internals' },
      { id: 'selfattention', label: 'Self-Attention (QKV)', icon: '🔍', tag: 'Deep Dive' },
      { id: 'structuredoutputs', label: 'Structured Outputs', icon: '📋', tag: 'Reliability' },
      { id: 'archconcepts', label: 'MLA & MoE', icon: '🧠', tag: 'Cutting Edge' },
    ]
  },
  {
    id: 'rag',
    title: 'RAG & Retrieval Architectures',
    icon: '⚡',
    color: '#3A9B9F',
    summary: 'Vector embeddings, chunking strategies, question parsing loops, hierarchical retrieval, and production RAG pipelines.',
    tabs: [
      { id: 'rag', label: 'RAG Architectures', icon: '📄', tag: 'Overview' },
      { id: 'ragchunking', label: 'Chunking Strategy', icon: '🧩', tag: 'Data Prep' },
      { id: 'filtering', label: 'Metadata Filtering', icon: '🎯', tag: 'Precision' },
      { id: 'hierrag', label: 'Hierarchical RAG', icon: '🌲', tag: 'Multi-level' },
      { id: 'prodrag', label: 'Production RAG', icon: '🏭', tag: 'Enterprise' },
      { id: 'workflowloop', label: 'Workflow Loops', icon: '🔄', tag: 'Verification' },
    ]
  },
  {
    id: 'agents',
    title: 'Autonomous Agent Systems',
    icon: '🤖',
    color: '#6B5E94',
    summary: 'ReAct agent loops, CLI agents, multi-agent collaboration, LangChain/LangGraph graphs, and stateful human-in-the-loop.',
    tabs: [
      { id: 'fiveassets', label: 'Five Agent Assets', icon: '🏛️', tag: 'Core Theory' },
      { id: 'cliagent', label: 'CLI Coding Agents', icon: '💻', tag: 'Practical' },
      { id: 'agentpairprogramming', label: 'Agent Pair Coding', icon: '👥', tag: 'Workflow' },
      { id: 'agentsastools', label: 'Agents as Tools', icon: '🛠️', tag: 'Composition' },
      { id: 'multiagent', label: 'Multi-Agent Swarms', icon: '🐝', tag: 'Coordination' },
      { id: 'langgraph', label: 'LangGraph States', icon: '📊', tag: 'State Machine' },
    ]
  },
  {
    id: 'enterprise_ops',
    title: 'Production Ops & Token FinOps',
    icon: '🏢',
    color: '#3A9B9F',
    summary: 'Zero-model routers, token orchestration playbooks, LLM evaluations, high-concurrency guardrails, and enterprise SLA ops.',
    tabs: [
      { id: 'tokenorchestrationplaybook', label: 'Token Playbook', icon: '🪙', tag: 'FinOps' },
      { id: 'routercheap', label: 'Zero-Model Router', icon: '🔀', tag: 'Cost / Latency' },
      { id: 'llmevals', label: 'LLM Eval Harness', icon: '🧪', tag: 'Quality' },
      { id: 'productionragops', label: 'RAG Ops & Observability', icon: '📡', tag: 'Telemetry' },
      { id: 'enterpriseaiops', label: 'Enterprise AI Ops', icon: '🛡️', tag: 'Governance' },
      { id: 'guardrails', label: 'Guardrails & Safety', icon: '🚦', tag: 'Defense' },
    ]
  }
];

const RAG_TYPES = [
  { id: 'naive', label: 'Naive RAG', level: 'Foundational', icon: '📄', color: '#3A9B9F', tagline: 'Chunk → embed → retrieve → generate' },
  { id: 'advanced', label: 'Advanced RAG', level: 'Intermediate', icon: '⚙️', color: '#C47A6A', tagline: 'HyDE + rerank + compression' },
  { id: 'hybrid', label: 'Hybrid RAG', level: 'Production Standard', icon: '🔀', color: '#C47A6A', tagline: 'Dense + sparse via RRF' },
  { id: 'selfrag', label: 'Self-RAG', level: 'Advanced', icon: '🪞', color: '#C47A6A', tagline: 'Model decides when to retrieve' },
  { id: 'crag', label: 'Corrective RAG', level: 'Advanced', icon: '🩺', color: '#C47A6A', tagline: 'Web fallback when local retrieval fails' },
  { id: 'graphrag', label: 'Graph RAG', level: 'Cutting Edge', icon: '🕸️', color: '#6B5E94', tagline: 'Knowledge graphs for multi-hop reasoning' },
  { id: 'agentic', label: 'Agentic RAG', level: 'Advanced', icon: '🤖', color: '#C47A6A', tagline: 'Multi-step ReAct retrieval loops' },
  { id: 'multimodal', label: 'Multimodal RAG', level: 'Cutting Edge', icon: '🖼️', color: '#6B5E94', tagline: 'Text + images + tables together' },
  { id: 'raptor', label: 'RAPTOR', level: 'Cutting Edge', icon: '🌲', color: '#6B5E94', tagline: 'Recursive tree of summaries' },
];

export function OverviewTab({ onSelectTab, setActiveTab: setGlobalActiveTab }) {
  const [activeTrackId, setActiveTrackId] = useState(() => getCurrentTrackId());
  const [progressMap, setProgressMap] = useState({});
  const [activeSubTab, setActiveSubTab] = useState('pillars');

  // Diagnostic state
  const [diagExperience, setDiagExperience] = useState('beginner');
  const [diagGoal, setDiagGoal] = useState('foundations');
  const [diagRecommendation, setDiagRecommendation] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [placement, setPlacement] = useState(() => getPlacement());
  const [recapTab, setRecapTab] = useState(null);
  const [testOutUmb, setTestOutUmb] = useState(null);
  const [dashTick, setDashTick] = useState(0);

  const handleNavigate = (tabId) => {
    if (onSelectTab) onSelectTab(tabId);
    else if (setGlobalActiveTab) setGlobalActiveTab(tabId);
  };

  const handleSelectTrack = (trackId, autoNavigate = false) => {
    setCurrentTrackId(trackId);
    setActiveTrackId(trackId);
    if (autoNavigate) {
      const track = getTrackById(trackId);
      handleNavigate(track.startingTab || track.tabs[0]);
    }
  };

  const handleStartLearning = () => {
    // Adaptive entry: foundations track, starting at the first topic the
    // learner hasn't proven (placement-aware). Fresh users orient first
    // (glossary), never dropped mid-sequence into a build tutorial.
    const rec = diagnoseTrack({ experience: 'beginner', goal: 'foundations', placement: getPlacement() });
    setCurrentTrackId(rec.trackId);
    setActiveTrackId(rec.trackId);
    setDiagRecommendation(rec);
    handleNavigate(rec.startingTab);
  };

  const runDiagnostic = () => {
    const result = diagnoseTrack({
      experience: diagExperience,
      goal: diagGoal,
      placement: getPlacement()
    });
    setPlacement(getPlacement());
    setDiagRecommendation(result);
  };

  // Sync track progress + dashboard snapshot
  useEffect(() => {
    const refresh = () => {
      const current = getCurrentTrackId();
      setActiveTrackId(current);
      const p = {};
      ADAPTIVE_TRACKS.forEach(t => {
        p[t.id] = getTrackProgress(t.id);
      });
      setProgressMap(p);
      setDashTick(t => t + 1);
    };

    refresh();
    const unsubscribe = subscribeToAdaptiveProgress(refresh);
    return unsubscribe;
  }, []);

  const activeTrackObj = getTrackById(activeTrackId);

  return (
    <>
      <Hero
        moduleId="foundations"
        moduleLabel="Adaptive Learning Engine"
        title="Modern AI Systems & Engineering"
        description="A tailored, interactive architecture curriculum. Diagnostic assessments evaluate your goals and chart an adaptive path from foundational AI principles to production RAG, autonomous agents, and enterprise FinOps."
        metrics={[
          { label: 'Active Track', value: activeTrackObj.title.split(' ')[0] },
          { label: 'Progress', value: `${progressMap[activeTrackId]?.percent || 0}%` },
          { label: 'Curated Tracks', value: `${ADAPTIVE_TRACKS.length - 1}+1` },
          { label: 'Topics', value: `${TABS_REGISTRY.length}` },
        ]}
        actions={[
          { label: '🚀 Start Learning (Foundations First)', variant: 'primary', onClick: handleStartLearning },
          { label: '🎯 Take 30s Diagnostic', variant: 'secondary', onClick: () => {
            const diagEl = document.getElementById('adaptive-diagnostic-section');
            diagEl?.scrollIntoView({ behavior: 'smooth' });
          }},
          { label: '📊 View Progress', variant: 'ghost', onClick: () => handleNavigate('progress') },
        ]}
      />

      <Container size="normal">
        {/* ============================================================ */}
        {/* SECTION 1: INTERACTIVE ADAPTIVE DIAGNOSTIC */}
        {/* ============================================================ */}
        <div id="adaptive-diagnostic-section" style={{ scrollMarginTop: '80px' }}>
          <Section variant="bordered">
            <Section.Header>
              <Flex justify="space-between" align="center" wrap gap="sm">
                <div>
                  <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
                    🎯 Adaptive Pathway Diagnostic
                  </h2>
                  <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                    Diagnose your background and engineering objective to generate your personalized learning sequence.
                  </p>
                </div>
                <Badge variant="module" moduleId="foundations" size="md">Adaptive AI Engine</Badge>
              </Flex>
            </Section.Header>
            <Section.Body>
              <Grid columns={{ base: 1, md: 2 }} gap="lg">
                {/* Left: Interactive Questions */}
                <div style={{
                  padding: '20px',
                  background: 'var(--ds-color-bg-canvas)',
                  borderRadius: 'var(--ds-radius-lg)',
                  border: '1px solid var(--ds-color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', display: 'block', marginBottom: '8px' }}>
                      1. What is your LLM engineering experience level?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { id: 'beginner', label: 'Beginner', sub: 'New to internals' },
                        { id: 'intermediate', label: 'Practitioner', sub: 'Uses APIs / SDKs' },
                        { id: 'advanced', label: 'Architect', sub: 'Production systems' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setDiagExperience(opt.id); setDiagRecommendation(null); }}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: `1px solid ${diagExperience === opt.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-default)'}`,
                            background: diagExperience === opt.id ? 'rgba(94,196,200,0.14)' : 'var(--ds-color-bg-surface)',
                            color: 'var(--ds-color-text-primary)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{opt.label}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', display: 'block', marginBottom: '8px' }}>
                      2. What is your primary engineering objective?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { id: 'foundations', icon: '🌱', label: 'AI Foundations', desc: 'Prompts, sampling & QKV' },
                        { id: 'rag', icon: '⚡', label: 'Production RAG', desc: 'Hybrid retrieval & chunking' },
                        { id: 'agents', icon: '🤖', label: 'Autonomous Agents', desc: 'ReAct, swarms & LangGraph' },
                        { id: 'enterprise', icon: '🏢', label: 'Enterprise FinOps', desc: 'Routing, latency & evals' },
                        { id: 'data', icon: '🗄️', label: 'Data Engineering', desc: 'Parsing, vectors & lineage' },
                      ].map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => { setDiagGoal(opt.id); setDiagRecommendation(null); }}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: `1px solid ${diagGoal === opt.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-default)'}`,
                            background: diagGoal === opt.id ? 'rgba(94,196,200,0.14)' : 'var(--ds-color-bg-surface)',
                            color: 'var(--ds-color-text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}
                        >
                          <span style={{ fontSize: '1.2rem' }}>{opt.icon}</span>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{opt.label}</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--ds-color-text-secondary)' }}>{opt.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={runDiagnostic}
                    style={{ marginTop: '4px', width: '100%', justifyContent: 'center' }}
                  >
                    ⚡ Calculate Recommended Pathway
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setQuizOpen(true)}
                    style={{ marginTop: '4px', width: '100%', justifyContent: 'center' }}
                  >
                    🎯 Take 3-min Knowledge Quiz {placement ? '(retake)' : ''}
                  </Button>
                  {placement && placement.levels && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)', textAlign: 'center' }}>
                      Placed: {Object.entries(placement.levels).map(([u, l]) => `${u.split('_')[0]}→L${l}`).join(' · ')}
                    </div>
                  )}
                </div>

                {/* Right: Recommendation Result Card */}
                <div style={{
                  padding: '20px',
                  background: 'var(--ds-color-bg-canvas)',
                  borderRadius: 'var(--ds-radius-lg)',
                  border: '1px solid var(--ds-color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '260px'
                }}>
                  {diagRecommendation ? (
                    <div>
                      {(() => {
                        const recTrack = getTrackById(diagRecommendation.trackId);
                        const startTabObj = TABS_REGISTRY.find(t => t.id === diagRecommendation.startingTab) || { label: 'First Topic', icon: '🚀' };
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Badge variant="default" size="sm">Recommended For You</Badge>
                              <span style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>Estimated {recTrack.duration}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '2.2rem' }}>{recTrack.icon}</span>
                              <div>
                                <h3 style={{ fontSize: '1.15rem', color: 'var(--ds-color-text-primary)', margin: 0 }}>
                                  {recTrack.title}
                                </h3>
                                <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                                  {recTrack.tagline}
                                </div>
                              </div>
                            </div>

                            <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5 }}>
                              {diagRecommendation.rationale}
                            </p>

                            <div style={{
                              padding: '10px 12px',
                              background: 'var(--ds-color-bg-surface)',
                              borderRadius: '8px',
                              border: '1px solid var(--ds-color-border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1rem' }}>{startTabObj.icon}</span>
                                <div>
                                  <div style={{ fontSize: '0.68rem', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>Starting Topic</div>
                                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>{startTabObj.label}</div>
                                </div>
                              </div>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  handleSelectTrack(recTrack.id);
                                  handleNavigate(diagRecommendation.startingTab);
                                }}
                              >
                                Launch Pathway →
                              </Button>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  document.getElementById('adaptive-dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)', textDecoration: 'underline' }}
                              >
                                or review your full dashboard below ↓
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--ds-color-text-tertiary)' }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🧭</div>
                      <div style={{ fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '4px' }}>
                        Ready to Personalize Your Learning?
                      </div>
                      <p style={{ fontSize: '0.82rem', maxWidth: '300px', margin: '0 auto' }}>
                        Select your experience level and primary objective on the left, then click "Calculate Recommended Pathway".
                      </p>
                    </div>
                  )}
                </div>
              </Grid>
            </Section.Body>
          </Section>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1.5: ADAPTIVE DASHBOARD — rings, next-best, review */}
        {/* The single ongoing home for "where next". Diagnostic hands off here. */}
        {/* ============================================================ */}
        <div id="adaptive-dashboard-section" style={{ scrollMarginTop: '80px' }} />
        <Section variant="bordered">
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="sm">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
                  📊 Your Adaptive Dashboard
                </h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                  Evidence-based mastery per umbrella, what to learn next and why, plus spaced review before you forget.
                </p>
              </div>
              <Badge variant="module" moduleId="foundations" size="md">Live from your evidence</Badge>
            </Flex>
          </Section.Header>
          <Section.Body>
            {(() => {
              void dashTick;
              if (!hasAnyEvidence()) {
                return (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--ds-color-text-tertiary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</div>
                    <div style={{ fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '4px' }}>No learning evidence yet</div>
                    <p style={{ fontSize: '0.82rem', maxWidth: '420px', margin: '0 auto 12px auto' }}>
                      Take the placement quiz or start any topic — visit, prove, and review signals will build your dashboard here.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setQuizOpen(true)}>Take the Quiz →</Button>
                  </div>
                );
              }
              const rings = getUmbrellaMastery();
              const nextBest = getNextBest(activeTrackId, 3);
              const queue = getReviewQueue(5);
              const Ring = ({ value, color, size = 64 }) => {
                const r = (size - 10) / 2, c = 2 * Math.PI * r;
                return (
                  <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E8EC" strokeWidth="7" />
                    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
                      strokeDasharray={`${(value / 100) * c} ${c}`} style={{ transition: 'stroke-dasharray 0.4s ease' }} />
                  </svg>
                );
              };
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* mastery rings */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                    {rings.map(u => (
                      <div key={u.id} style={{ textAlign: 'center', padding: '12px 6px', background: 'var(--ds-color-bg-canvas)', borderRadius: '10px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <Ring value={u.avg} color={u.color} />
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', color: 'var(--ds-color-text-primary)' }}>{u.avg}</div>
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', marginTop: '6px' }}>{u.icon} {u.title.split(' ')[0]}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--ds-color-text-tertiary)' }}>{u.proven}/{u.total} proven</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ds-color-text-primary)', marginBottom: '8px' }}>
                      🛫 Test out of a pillar — prove foundations, skip ahead
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {UMBRELLA_TOPICS.map(u => (
                        <button
                          key={u.id}
                          onClick={() => setTestOutUmb(u.id)}
                          title={`Pre-flight check for ${u.title}`}
                          style={{
                            padding: '6px 12px', borderRadius: '16px', cursor: 'pointer',
                            fontSize: '0.75rem', fontWeight: 600,
                            background: 'transparent',
                            border: `1px solid ${u.dark || u.color}`,
                            color: u.dark || u.color
                          }}
                        >
                          {u.icon} Test out: {u.title.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Grid columns={{ base: 1, md: 2 }} gap="lg">
                    {/* next best */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ds-color-text-primary)', marginBottom: '8px' }}>
                        ✨ Up next in {getTrackById(activeTrackId).title} — and why
                      </div>
                      {nextBest.length === 0 ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>🏆 Track fully proven. Pick another track or review below.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {nextBest.map(n => {
                            const t = TABS_REGISTRY.find(x => x.id === n.id) || { label: n.id, icon: '📝' };
                            return (
                              <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--ds-color-bg-canvas)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                                <span style={{ fontSize: '1.2rem' }}>{t.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>{t.label}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)' }}>{n.reasons.join(' · ')}</div>
                                </div>
                                <Button variant="secondary" size="sm" onClick={() => handleNavigate(n.id)}>Go →</Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {/* review queue */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ds-color-text-primary)', marginBottom: '8px' }}>
                        🔁 Spaced review — prove it again before it fades
                      </div>
                      {queue.length === 0 ? (
                        <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>Nothing due. Proven topics resurface ~14 days after proof.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {queue.map(q => (
                            <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'var(--ds-color-bg-canvas)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                              <span style={{ fontSize: '1.2rem' }}>{q.icon}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>{q.label}</div>
                                <div style={{ fontSize: '0.7rem', color: '#C47A6A' }}>{q.overdueDays === 0 ? 'due today' : `${q.overdueDays}d overdue`}</div>
                              </div>
                              <Button variant="secondary" size="sm" onClick={() => setRecapTab(q.id)}>Recap →</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Grid>
                </div>
              );
            })()}
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 1.6: SKILL TREE — the dependency graph as a map */}
        {/* ============================================================ */}
        <Section variant="bordered">
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="sm">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
                  🕸️ Skill Tree — See What Each Topic Unlocks
                </h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                  The curriculum's prerequisite graph, colored by your mastery. Glowing nodes are ready now — completing one lights up everything downstream of it.
                </p>
              </div>
              <Badge variant="module" moduleId="foundations" size="md">Meta-learning map</Badge>
            </Flex>
          </Section.Header>
          <Section.Body>
            <SkillTree onSelectTab={handleNavigate} />
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 1.7: THE JOURNEY — three loops, whole map each time */}
        {/* ============================================================ */}
        <Section variant="bordered">
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="sm">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
                  🥾 The Journey: GenAI → RAG → Agents, Three Times
                </h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                  Each loop crosses all three pillars end-to-end — Trail ships firsts, Practitioner goes deep, Summits take the peaks. Placement drops you in the right loop.
                </p>
              </div>
              <Badge variant="module" moduleId="foundations" size="md">Default path</Badge>
            </Flex>
          </Section.Header>
          <Section.Body>
            {(() => {
              const allDone = JOURNEY_TRACKS.every(l => {
                const pp = getTrackProgress(l.id);
                return pp.total > 0 && pp.completed === pp.total;
              });
              return allDone ? (
                <div style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '12px', background: 'rgba(42,181,176,0.1)', border: '1px solid rgba(42,181,176,0.4)', fontSize: '0.85rem', color: 'var(--ds-color-text-primary)', textAlign: 'center' }}>
                  🏆 <strong>Journey complete</strong> — all three loops proven. Review any loop below, or take on full mastery.
                </div>
              ) : null;
            })()}
            <Grid columns={{ base: 1, md: 3 }} gap="md">
              {JOURNEY_TRACKS.map((loop, i) => {
                const p = getTrackProgress(loop.id);
                const isActive = activeTrackId === loop.id;
                const continueId = loop.tabs.find(t => !isMastered(t)) || loop.tabs[0];
                const done = p.completed === p.total && p.total > 0;
                // Started = any evidence (visit or attempt), not just proven topics.
                // The old check (p.completed > 0) kept saying "Start" to learners
                // already underway with visits/partial scores but zero proofs.
                const started = loop.tabs.some(id => {
                  const e = getEvidence(id);
                  return e.visit || (e.quizBest || 0) > 0;
                });
                const nextLoop = JOURNEY_TRACKS[i + 1] || null;
                const nextContinue = nextLoop ? (nextLoop.tabs.find(t => !isMastered(t)) || nextLoop.tabs[0]) : null;
                return (
                  <Card
                    key={loop.id}
                    variant={isActive ? 'elevated' : 'bordered'}
                    padding="md"
                    style={{
                      border: isActive ? `2px solid ${loop.color}` : '1px solid var(--ds-color-border-subtle)',
                      display: 'flex', flexDirection: 'column', gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.8rem' }}>{loop.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>{loop.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-secondary)' }}>{loop.tagline}</div>
                      </div>
                      {i < JOURNEY_TRACKS.length - 1 && (
                        <span style={{ marginLeft: 'auto', color: 'var(--ds-color-text-tertiary)' }}>→</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>
                      {loop.tabs.length} topics · {loop.duration} · {p.completed}/{p.total} proven
                    </div>
                    <div style={{ height: '6px', borderRadius: '4px', background: '#E8E8EC', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.percent}%`, background: loop.color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
                    </div>
                    {done && nextLoop ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => {
                            handleSelectTrack(nextLoop.id);
                            handleNavigate(nextContinue);
                          }}
                        >
                          Next: {nextLoop.title.split('·')[0].trim()} →
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            handleSelectTrack(loop.id);
                            handleNavigate(loop.tabs[0]);
                          }}
                        >
                          Review ↻
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant={isActive ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => {
                          handleSelectTrack(loop.id);
                          handleNavigate(continueId);
                        }}
                      >
                        {done ? 'Review loop ↻' : started ? `Continue →` : `Start ${loop.title.split('·')[0].trim()} →`}
                      </Button>
                    )}
                  </Card>
                );
              })}
            </Grid>
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 2: CURATED ADAPTIVE TRACKS */}
        {/* ============================================================ */}
        <Section variant="bordered">
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="sm">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
                  Browse All Paths
                </h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                  Prefer exploring? Every role path is browsable — your dashboard above always knows the next best step. Switch tracks anytime; progress persists.
                </p>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-tertiary)' }}>
                Active: <strong style={{ color: 'var(--ds-color-text-primary)' }}>{activeTrackObj.title}</strong>
              </div>
            </Flex>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="md">
              {ADAPTIVE_TRACKS.filter(t => t.id !== 'full_mastery').map(track => {
                const isActive = activeTrackId === track.id;
                const p = progressMap[track.id] || { completed: 0, total: track.tabs.length, percent: 0 };
                return (
                  <Card
                    key={track.id}
                    variant={isActive ? 'elevated' : 'bordered'}
                    padding="md"
                    style={{
                      border: isActive ? `2px solid ${track.color}` : '1px solid var(--ds-color-border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: track.dark || track.color,
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}>
                        ACTIVE
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{track.icon}</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '4px' }}>
                        {track.title}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: track.dark || track.color, fontWeight: 600, marginBottom: '8px' }}>
                        {track.level} • {track.duration}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
                        {track.description}
                      </p>
                    </div>

                    <div>
                      {/* Mini progress bar */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                          <span>Mastery</span>
                          <span>{p.completed}/{p.total} ({p.percent}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'var(--ds-color-bg-canvas)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ width: `${p.percent}%`, height: '100%', background: track.color, transition: 'width 0.3s ease' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant={isActive ? 'primary' : 'outline'}
                          size="sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => handleSelectTrack(track.id, true)}
                        >
                          {isActive ? 'Continue Track →' : 'Set as Active'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </Grid>

            {/* Comprehensive Track Card Banner */}
            {(() => {
              const fullTrack = getTrackById('full_mastery');
              const isActive = activeTrackId === 'full_mastery';
              const p = progressMap.full_mastery || { completed: 0, total: fullTrack.tabs.length, percent: 0 };
              return (
                <div style={{
                  marginTop: 'var(--ds-space-4)',
                  padding: '16px 20px',
                  borderRadius: 'var(--ds-radius-lg)',
                  background: 'var(--ds-color-bg-canvas)',
                  border: `1px solid ${isActive ? '#F0A89A' : 'var(--ds-color-border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '2rem' }}>👑</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>Full Systems Mastery</span>
                        <Badge variant="default" size="sm">Comprehensive 33 Modules</Badge>
                        {isActive && <Badge variant="module" moduleId="foundations" size="sm">ACTIVE</Badge>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                        The ultimate end-to-end curriculum: foundations, RAG, agents, context engineering, platform data layers, and token ops.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
                        {p.completed} / {p.total} Mastered
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)' }}>
                        {p.percent}% Overall Curriculum
                      </div>
                    </div>
                    <Button
                      variant={isActive ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleSelectTrack('full_mastery', true)}
                    >
                      {isActive ? 'Resume Journey →' : 'Start Full Track'}
                    </Button>
                  </div>
                </div>
              );
            })()}
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 3: 4 BALANCED AI ENGINEERING PILLARS */}
        {/* ============================================================ */}
        <Section>
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="md">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>Core Architecture Pillars</h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>
                  A balanced modern AI curriculum spanning fundamentals, retrieval, agent orchestration, and enterprise operations.
                </p>
              </div>
            </Flex>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 2 }} gap="lg">
              {FOUR_PILLARS.map(pillar => (
                <Card key={pillar.id} variant="bordered" padding="lg">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: `${pillar.color}18`, border: `1px solid ${pillar.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', margin: 0 }}>
                        {pillar.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {pillar.summary}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {pillar.tabs.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleNavigate(t.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: 'var(--ds-color-bg-canvas)',
                          border: '1px solid var(--ds-color-border-subtle)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = pillar.color}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--ds-color-border-subtle)'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <span style={{ fontSize: '0.95rem' }}>{t.icon}</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--ds-color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.label}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--ds-color-text-tertiary)', background: 'var(--ds-color-bg-surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--ds-color-border-subtle)' }}>
                          {t.tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </Card>
              ))}
            </Grid>
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 4: ARCHITECTURE HIGHLIGHTS */}
        {/* ============================================================ */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>Frontier Architecture Concepts</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>The three techniques powering the most efficient frontier models in 2025–2026.</p>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 3 }} gap="md">
              {[
                { id: 'mla', icon: '🧠', label: 'Multi-Head Latent Attention', color: '#3A9B9F', metric: '2.7–4.7×', sub: 'KV cache reduction', desc: 'Compresses KV cache by projecting to low-dimensional latent, up-projecting at inference.' },
                { id: 'moe', icon: '🎯', label: 'Mixture of Experts', color: '#C47A6A', metric: '5.5%', sub: 'Params active per token', desc: 'Routes each token to top-k experts; 671B total, 37B active — dense quality at sparse cost.' },
                { id: 'spec', icon: '⚡', label: 'Speculative Decoding', color: '#6B5E94', metric: '2–4×', sub: 'Throughput gain', desc: 'Small draft model proposes tokens; large model verifies in parallel. Lossless speedup.' },
              ].map(item => (
                <Card key={item.id} variant="elevated" padding="lg" hover onClick={() => handleNavigate('archconcepts')} style={{ cursor: 'pointer' }}>
                  <Flex gap="md" align="flex-start" style={{ marginBottom: 'var(--ds-space-4)' }}>
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'var(--ds-font-weight-semibold)', fontSize: 'var(--ds-font-size-body)' }}>{item.label}</div>
                      <Badge variant="module" moduleId="foundations" size="sm">DeepSeek / Llama 4 / Qwen3</Badge>
                    </div>
                  </Flex>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--ds-space-3)', marginBottom: 'var(--ds-space-3)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'var(--ds-font-weight-bold)', color: item.color, fontFamily: 'var(--ds-font-family-display)', lineHeight: 1 }}>{item.metric}</div>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{item.sub}</div>
                  </div>
                  <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 'var(--ds-font-lineHeight-relaxed)' }}>{item.desc}</p>
                  <Button variant="ghost" size="sm" style={{ marginTop: 'var(--ds-space-3)' }} onClick={(e) => { e.stopPropagation(); handleNavigate('archconcepts'); }}>Explore →</Button>
                </Card>
              ))}
            </Grid>
          </Section.Body>
        </Section>

        {/* ============================================================ */}
        {/* SECTION 5: KEY RESOURCES & PROGRESS */}
        {/* ============================================================ */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>System Exploration Resources</h2>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 3 }} gap="md">
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>📖 AI Glossary</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>Essential terms across Models, Attention, RAG, Agents & Production Ops.</p>
                <Button variant="ghost" size="sm" onClick={() => handleNavigate('glossary')}>Open Glossary</Button>
              </Card>
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>🎯 Best Practices</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>Production patterns from real-world high-throughput AI engineering.</p>
                <Button variant="ghost" size="sm" onClick={() => handleNavigate('practices')}>View Practices</Button>
              </Card>
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>📊 Progress Tracker</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>Track your completion checkpoints across all 6 umbrellas.</p>
                <Button variant="ghost" size="sm" onClick={() => handleNavigate('progress')}>View Progress</Button>
              </Card>
            </Grid>
          </Section.Body>
        </Section>
      </Container>
      <ExitCheck
        open={!!recapTab}
        tabId={recapTab || 'overview'}
        onSelectTab={handleNavigate}
        onClose={() => { setRecapTab(null); setDashTick(t => t + 1); }}
      />
      <TestOutGate
        open={!!testOutUmb}
        umbrellaId={testOutUmb || 'foundations'}
        onSelectTab={handleNavigate}
        onClose={() => { setTestOutUmb(null); setDashTick(t => t + 1); }}
      />
      <DiagnosticQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        initialGoal={diagGoal}
        onComplete={(done) => {
          setPlacement(getPlacement());
          setDiagRecommendation({ trackId: done.rec.trackId, startingTab: done.rec.startingTab, rationale: done.rec.rationale });
          handleSelectTrack(done.rec.trackId);
          handleNavigate(done.rec.startingTab);
        }}
      />
    </>
  );
}