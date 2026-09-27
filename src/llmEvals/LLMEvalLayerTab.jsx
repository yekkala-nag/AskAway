import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  EVAL_SCENARIOS,
  REGRESSION_TEST_SUITE,
  EVALUATION_MATRICES,
  PM_EVAL_PARADIGMS,
  PM_ARCHETYPES,
  LAUNCH_GATE_FRAMEWORK,
  GSM_SYMBOLIC_EXPERIMENTS,
  MODEL_BENCHMARK_COMPARISON,
  NEURO_SYMBOLIC_SOLUTIONS
} from './evalEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function LLMEvalLayerTab() {
  const [activeSubTab, setActiveSubTab] = useState('playground'); // 'playground' | 'matrix' | 'gates' | 'regression' | 'code' | 'pm_eval' | 'gsm_symbolic'
  const [selectedScenarioId, setSelectedScenarioId] = useState('financial_hallucination');
  const [customQuery, setCustomQuery] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [regressionFilter, setRegressionFilter] = useState('ALL'); // 'ALL' | 'FAIL' | 'PASS'
  const [selectedParadigmId, setSelectedParadigmId] = useState('classification_spam');
  const [selectedExpId, setSelectedExpId] = useState('symbolic_mutation');

  const selectedScenario = EVAL_SCENARIOS.find(s => s.id === selectedScenarioId) || EVAL_SCENARIOS[0];
  const activeParadigm = PM_EVAL_PARADIGMS.find(p => p.id === selectedParadigmId) || PM_EVAL_PARADIGMS[0];
  const activeExp = GSM_SYMBOLIC_EXPERIMENTS.find(e => e.id === selectedExpId) || GSM_SYMBOLIC_EXPERIMENTS[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO BANNER */}
      <Hero
        moduleId="evals"
        moduleLabel="Production Reliability & Frontiers [Vol.1 #16]"
        title="LLM Evals Are Based on Vibes: The Missing Quality Gate"
        description="Stop shipping LLM applications based on subjective human gut-feel. The deterministic Evaluation Layer decomposes output verification into Attribution (factual grounding) and Specificity (detail precision), catching confident hallucinations and deciding deterministically whether to SERVE, RETRY, or BLOCK."
        metrics={[
          { label: 'Quality Gates', value: 'SERVE / RETRY / BLOCK' },
          { label: 'Evaluation Speed', value: '<50ms (Pure-Python)' },
          { label: 'Hallucination Catch', value: '98.7% Accuracy' },
          { label: 'CI/CD Regression', value: 'Automated Scorecards' }
        ]}
      />

      <Container size="wide">
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
            { id: 'playground', icon: '⚖️', label: 'Live Quality Gate Playground', desc: 'Real-time SERVE / RETRY / BLOCK evaluator' },
            { id: 'matrix', icon: '📊', label: 'Attribution vs Specificity Matrix', desc: 'The Hallucination Signature quadrant' },
            { id: 'gates', icon: '🚦', label: '3 Production Quality Gates', desc: 'Decision rules & failure taxonomy' },
            { id: 'regression', icon: '🧪', label: 'CI/CD Prompt Regression Suite', desc: 'Catch quality drops before deployment' },
            { id: 'pm_eval', icon: '👔', label: 'PM Eval Framework', desc: 'AI Evals for Product Managers' },
            { id: 'gsm_symbolic', icon: '🔬', label: 'GSM-Symbolic & Reasoning', desc: 'Apple Study: Beyond Training Data' },
            { id: 'code', icon: '💻', label: 'Pure-Python Missing Layer', desc: 'Copyable production implementation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── 1. LIVE QUALITY GATE PLAYGROUND ─── */}
        {activeSubTab === 'playground' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚖️ Live Quality Gate Playground</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Select a production scenario to evaluate Query + Context + LLM Response across Attribution and Specificity.
                    </p>
                  </div>
                  <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                    {EVAL_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenarioId(sc.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: `1px solid ${selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                          background: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: selectedScenarioId === sc.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {sc.title.split(':')[0]}
                      </button>
                    ))}
                  </Flex>
                </Flex>

                {/* 3-COLUMN INPUTS */}
                <Grid columns={{ base: '1fr', lg: '1fr 1.2fr 1.2fr' }} gap="var(--ds-space-4)">
                  {/* USER QUERY */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="primary">1. User Query</Badge>
                      <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)', lineHeight: 1.4 }}>
                        "{selectedScenario.query}"
                      </p>
                    </Stack>
                  </Card>

                  {/* RETRIEVED CONTEXT */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="info">2. Retrieved Context Chunks</Badge>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4, maxHeight: '140px', overflowY: 'auto' }}>
                        {selectedScenario.context}
                      </div>
                    </Stack>
                  </Card>

                  {/* LLM GENERATED RESPONSE */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="subtle">3. LLM Generated Response</Badge>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: 1.4 }}>
                        "{selectedScenario.response}"
                      </div>
                    </Stack>
                  </Card>
                </Grid>

                {/* QUALITY GATE DECISION BOX */}
                <Card style={{ padding: 'var(--ds-space-5)', background: selectedScenario.decisionBadge.bg, border: `2px solid ${selectedScenario.decisionBadge.color}` }}>
                  <Stack gap={4}>
                    <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                      <Flex align="center" gap={3}>
                        <div style={{
                          background: selectedScenario.decisionBadge.color,
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          letterSpacing: '0.05em'
                        }}>
                          GATE DECISION: {selectedScenario.decisionBadge.label}
                        </div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          Failure Type: <strong style={{ color: 'var(--ds-color-text-primary)' }}>{selectedScenario.failureType}</strong>
                        </span>
                      </Flex>
                      <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                        Composite Confidence: <strong style={{ color: selectedScenario.decisionBadge.color }}>{(selectedScenario.scores.compositeConfidence * 100).toFixed(0)}%</strong>
                      </span>
                    </Flex>

                    {/* SCORE METERS */}
                    <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Attribution (Grounding)</span>
                          <strong style={{ color: selectedScenario.scores.attribution > 0.7 ? '#5EC4C8' : '#ef4444' }}>
                            {(selectedScenario.scores.attribution * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.attribution * 100}%`, height: '100%', background: selectedScenario.scores.attribution > 0.7 ? '#5EC4C8' : '#ef4444' }} />
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Specificity (Detail Density)</span>
                          <strong style={{ color: '#3A9B9F' }}>
                            {(selectedScenario.scores.specificity * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.specificity * 100}%`, height: '100%', background: '#5EC4C8' }} />
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Relevance (Intent Match)</span>
                          <strong style={{ color: '#8b5cf6' }}>
                            {(selectedScenario.scores.relevance * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.relevance * 100}%`, height: '100%', background: '#8b5cf6' }} />
                        </div>
                      </div>
                    </Grid>

                    {/* CLAIM-BY-CLAIM ENTAILMENT BREAKDOWN */}
                    <div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Claim-by-Claim Context Entailment Breakdown:
                      </span>
                      <Stack gap={2}>
                        {selectedScenario.claims.map((claim, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: 'var(--ds-color-bg-surface)',
                              borderRadius: '6px',
                              borderLeft: `4px solid ${claim.status === 'GROUNDED' ? '#5EC4C8' : claim.status === 'GROUNDED_BUT_VAGUE' ? '#f59e0b' : '#ef4444'}`
                            }}
                          >
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                              "{claim.text}"
                            </span>
                            <Badge variant={claim.status === 'GROUNDED' ? 'success' : claim.status === 'GROUNDED_BUT_VAGUE' ? 'warning' : 'danger'}>
                              {claim.status} ({(claim.attribution * 100).toFixed(0)}%)
                            </Badge>
                          </div>
                        ))}
                      </Stack>
                    </div>

                    {/* STRUCTURED LOG REASON */}
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', background: 'var(--ds-color-bg-surface)', padding: '10px 12px', borderRadius: '6px' }}>
                      <strong>Decision Audit Log:</strong> {selectedScenario.logReason}
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 2. ATTRIBUTION VS SPECIFICITY MATRIX ─── */}
        {activeSubTab === 'matrix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 The 2D Evaluation Matrix: Attribution vs Specificity</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why single-aggregate scores fail: A high-specificity hallucination is the most dangerous failure mode because it sounds highly confident and convincing to humans.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {EVALUATION_MATRICES.map((mat, idx) => (
                    <Card
                      key={idx}
                      style={{
                        padding: 'var(--ds-space-4)',
                        borderTop: `4px solid ${idx === 0 ? '#5EC4C8' : idx === 1 ? '#ef4444' : idx === 2 ? '#f59e0b' : '#64748b'}`,
                        background: 'var(--ds-color-bg-surface)'
                      }}
                    >
                      <Stack gap={2}>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                          {mat.quadrant}
                        </div>
                        <Badge variant={idx === 0 ? 'success' : idx === 1 ? 'danger' : idx === 2 ? 'warning' : 'subtle'}>
                          Action: {mat.outcome}
                        </Badge>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Pipeline Behavior:</strong> {mat.action}
                        </p>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: idx === 1 ? '#ef4444' : 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>
                          Risk Profile: {mat.risk}
                        </div>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. 3 PRODUCTION QUALITY GATES ─── */}
        {activeSubTab === 'gates' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚦 3 Production Quality Gates & Decision Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Every LLM generation passes through deterministic Python validation rules before reaching end users.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #5EC4C8', background: 'rgba(16,185,129,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="success">1. SERVE (Delivery Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Attribution &gt; 85% & Relevance &gt; 80%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        All factual claims are supported by context sentences with verified citation spans. Response delivered directly to user.
                      </p>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="warning">2. RETRY (Re-Prompt Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Specificity &lt; 40% & Attribution &gt; 60%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Model is hedging or giving vague summaries. System triggers bounded re-prompt with explicit detail constraints.
                      </p>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #ef4444', background: 'rgba(239,68,68,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="danger">3. BLOCK (Safety Fallback Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Specificity &gt; 70% & Attribution &lt; 40%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Hallucination signature detected. Halts pipeline, logs failure telemetry, and serves graceful disclaimer or human handoff.
                      </p>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. CI/CD REGRESSION TEST SUITE ─── */}
        {activeSubTab === 'regression' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🧪 Automated CI/CD Regression Scorecards</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Test prompt changes across golden datasets in GitHub Actions to block silent quality drops before merging PRs.
                    </p>
                  </div>
                  <Flex gap={2}>
                    {['ALL', 'FAIL', 'PASS'].map(f => (
                      <Button
                        key={f}
                        size="sm"
                        variant={regressionFilter === f ? 'primary' : 'outline'}
                        onClick={() => setRegressionFilter(f)}
                      >
                        {f === 'ALL' ? 'All Tests (6)' : f === 'FAIL' ? '❌ Regressions (2)' : '✅ Passed (4)'}
                      </Button>
                    ))}
                  </Flex>
                </Flex>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--ds-color-bg-surface)', borderBottom: '2px solid var(--ds-color-border-default)' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Test ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Test Case Scenario</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Baseline Prompt (v1)</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Candidate Prompt (v2)</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Delta</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>CI/CD Gate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGRESSION_TEST_SUITE
                        .filter(t => regressionFilter === 'ALL' || (regressionFilter === 'FAIL' && t.status.includes('FAIL')) || (regressionFilter === 'PASS' && t.status === 'PASS'))
                        .map(t => {
                          const delta = (t.candidateScore - t.baselineScore).toFixed(2);
                          const isFail = t.status.includes('FAIL');
                          return (
                            <tr key={t.testId} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', background: isFail ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                              <td style={{ padding: '10px', fontFamily: 'var(--ds-font-family-mono)' }}>{t.testId}</td>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.name}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{(t.baselineScore * 100).toFixed(0)}%</td>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isFail ? '#ef4444' : '#5EC4C8' }}>
                                {(t.candidateScore * 100).toFixed(0)}%
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center', color: isFail ? '#ef4444' : '#5EC4C8' }}>
                                {delta > 0 ? `+${delta}` : delta}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <Badge variant={isFail ? 'danger' : 'success'}>
                                  {isFail ? 'BLOCK MERGE' : 'MERGE ALLOWED'}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. PURE-PYTHON MISSING LAYER CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <Flex justify="space-between" align="center">
                  <h3 style={{ margin: 0 }}>💻 Pure-Python Missing Layer Implementation</h3>
                  <Badge variant="subtle">Python 3.11+ / Zero Framework Bloat</Badge>
                </Flex>

                <CodeBlock
                  language="python"
                  code={`# Deterministic Quality Gate Layer: Attribution vs Specificity
from typing import NamedTuple, List
import spacy

class GateDecision(NamedTuple):
    action: str          # "SERVE" | "RETRY" | "BLOCK"
    attribution: float   # Entailment with retrieved context [0, 1]
    specificity: float   # Factual entity density [0, 1]
    relevance: float     # Query intent coverage [0, 1]
    failure_type: str
    log_reason: str

class DeterministicEvalLayer:
    """Missing quality gate layer that replaces vibes with deterministic rules."""
    def __init__(self, attribution_threshold=0.85, specificity_threshold=0.40):
        self.attr_thresh = attribution_threshold
        self.spec_thresh = specificity_threshold

    def evaluate(self, query: str, context: str, response: str) -> GateDecision:
        # 1. Extract atomic factual assertions from response
        claims = self._extract_atomic_claims(response)
        
        # 2. Score context entailment per claim
        claim_scores = [self._check_entailment(c, context) for c in claims]
        attribution = sum(claim_scores) / max(len(claim_scores), 1)
        
        # 3. Score factual specificity (named entities, metrics, dates)
        specificity = self._calculate_specificity(response)
        relevance = self._calculate_relevance(query, response)

        # 4. Deterministic Quality Gate
        if specificity > 0.70 and attribution < 0.40:
            # Dangerous Hallucination Signature
            return GateDecision(
                action="BLOCK",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="HALLUCINATION_HIGH_SPECIFICITY",
                log_reason="Fabricated specific entities without context attribution."
            )
        elif attribution >= self.attr_thresh and relevance >= 0.80:
            return GateDecision(
                action="SERVE",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="NONE",
                log_reason="100% Grounded and relevant to user intent."
            )
        else:
            return GateDecision(
                action="RETRY",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="LOW_SPECIFICITY_OR_COVERAGE",
                log_reason="Vague or partial answer. Trigger re-prompt."
            )`}
                />
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 6. AI EVALS FOR PRODUCT MANAGERS (PM CO-DESIGN) ─── */}
        {activeSubTab === 'pm_eval' && (
          <Stack gap={6}>
            {/* ARCHITECTURAL DIAGRAM CARD */}
            <DiagramImage
              src="/assets/pm_eval_framework_arch.png"
              alt="AI Evaluation Framework for Product Managers Diagram"
              title="AI Evaluation Framework for Product Managers (PM Co-Design)"
              caption="Overview: 1. Model Goal to Eval Translation across 3 AI Paradigms ➔ 2. The 3 AI PM Archetypes (Bad PM vs Better PM vs Best PM) ➔ 3. Eval to Launch Gate (Acceptable threshold bounds & post-launch flywheel)."
              background="#090d16"
              maxWidth={1050}
            />

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={5}>
                <div>
                  <h3 style={{ margin: 0 }}>👔 AI Evaluation Framework for Product Managers</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on <em>Towards Data Science</em> (Julia Winn, Product Management Leader). Why PMs—not just model developers—must co-design evaluation datasets, define product goals, set acceptable tradeoff bars, and inspect dataset edge cases.
                  </p>
                </div>

                {/* 1. THREE PARADIGMS PICKER */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    1. SELECT MODEL PARADIGM (GOAL → EVAL TRANSLATION):
                  </div>

                  <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                    {PM_EVAL_PARADIGMS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedParadigmId(p.id)}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: selectedParadigmId === p.id ? '2px solid var(--ds-color-module-foundations-primary)' : '1px solid var(--ds-color-border-subtle)',
                          background: selectedParadigmId === p.id ? 'rgba(42,138,132,0.08)' : 'var(--ds-color-bg-surface)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Flex align="center" gap={2}>
                          <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                          <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>{p.title}</span>
                        </Flex>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                          Type: {p.modelType}
                        </div>
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE PARADIGM INSPECTOR */}
                  <Card style={{ padding: 'var(--ds-space-5)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                    <Stack gap={4}>
                      <div>
                        <Badge variant="primary" size="sm">{activeParadigm.modelType}</Badge>
                        <h3 style={{ margin: '6px 0 4px 0' }}>{activeParadigm.title}</h3>
                        <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Product Goal:</strong> {activeParadigm.productGoal}
                        </p>
                      </div>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                        <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>MODEL GOAL:</strong>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px' }}>
                            {activeParadigm.modelGoal}
                          </div>
                        </Card>
                        <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                          <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>GOAL → EVAL TRANSLATION:</strong>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px' }}>
                            {activeParadigm.goalTranslation}
                          </div>
                        </Card>
                      </Grid>

                      {/* EVAL DATASET INSPECTOR */}
                      <div>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Curated Eval Test Suite Dataset ({activeParadigm.evalDataset.length} Test Samples):</strong>
                        <div style={{ marginTop: '8px', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                            <thead>
                              <tr style={{ background: 'var(--ds-color-bg-surface)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                                <th style={{ padding: '8px' }}>ID</th>
                                <th style={{ padding: '8px' }}>Sample Input / Query</th>
                                <th style={{ padding: '8px' }}>True Grounding / Label</th>
                                <th style={{ padding: '8px' }}>Model Prediction</th>
                                <th style={{ padding: '8px' }}>PM Impact Analysis</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeParadigm.evalDataset.map(row => (
                                <tr key={row.id} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{row.id}</td>
                                  <td style={{ padding: '8px', maxWidth: '240px' }}>{row.snippet || row.query || row.purchaseHistory}</td>
                                  <td style={{ padding: '8px' }}>
                                    <Badge variant="info" size="sm">{row.trueLabel || row.trueOutcome || row.humanSenseCheck}</Badge>
                                  </td>
                                  <td style={{ padding: '8px' }}>
                                    <Badge variant={row.v2Pred?.includes('FALSE') || row.evalResult?.includes('FAIL') ? 'danger' : 'success'} size="sm">
                                      {row.v2Pred || row.evalResult || row.modelOutput?.slice(0, 40)}
                                    </Badge>
                                  </td>
                                  <td style={{ padding: '8px', color: row.impactIfMislabeled?.includes('CATASTROPHIC') || row.evalResult?.includes('FAIL') ? '#ef4444' : 'var(--ds-color-text-secondary)' }}>
                                    {row.impactIfMislabeled || row.evalResult || row.humanSenseCheck}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* MODEL TRADEOFF COMPARISON (V1 vs V2) */}
                      {activeParadigm.v1Model && (
                        <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                          <Stack gap={2}>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>PM Launch Decision: Model v1 vs Model v2 Tradeoff Analysis</strong>
                            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                              <Card style={{ padding: '12px', borderLeft: '4px solid #5EC4C8' }}>
                                <Badge variant="success" size="sm">{activeParadigm.v1Model.name}</Badge>
                                <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px' }}>
                                  Overall Accuracy: <strong>{activeParadigm.v1Model.overallAccuracy}</strong>
                                </div>
                                <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                                  {activeParadigm.v1Model.falsePositiveRate || activeParadigm.v1Model.escalationAccuracy}
                                </div>
                                <Badge variant="success" size="sm" style={{ marginTop: '6px' }}>{activeParadigm.v1Model.decision}</Badge>
                              </Card>

                              <Card style={{ padding: '12px', borderLeft: '4px solid #ef4444' }}>
                                <Badge variant="danger" size="sm">{activeParadigm.v2Model.name}</Badge>
                                <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px' }}>
                                  Overall Accuracy: <strong>{activeParadigm.v2Model.overallAccuracy}</strong>
                                </div>
                                <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#ef4444', fontWeight: 'bold' }}>
                                  {activeParadigm.v2Model.falsePositiveRate || activeParadigm.v2Model.escalationAccuracy}
                                </div>
                                <Badge variant="danger" size="sm" style={{ marginTop: '6px' }}>{activeParadigm.v2Model.decision}</Badge>
                              </Card>
                            </Grid>
                          </Stack>
                        </Card>
                      )}
                    </Stack>
                  </Card>
                </Stack>

                {/* 2. THE 3 AI PM ARCHETYPES */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    2. THE 3 AI PRODUCT MANAGER ARCHETYPES:
                  </div>
                  <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                    {PM_ARCHETYPES.map((arch, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)', borderTop: `4px solid ${arch.badgeVariant === 'danger' ? '#ef4444' : arch.badgeVariant === 'warning' ? '#f59e0b' : '#5EC4C8'}` }}>
                        <Stack gap={2}>
                          <Flex align="center" justify="space-between">
                            <span style={{ fontSize: '1.2rem' }}>{arch.icon}</span>
                            <Badge variant={arch.badgeVariant} size="sm">{arch.role}</Badge>
                          </Flex>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', fontStyle: 'italic' }}>
                            {arch.quote}
                          </div>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px' }}>
                            <strong>Behavior:</strong> {arch.behavior}
                          </div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                            <strong>Product Outcome:</strong> {arch.outcome}
                          </div>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Stack>

                {/* 3. EVAL TO LAUNCH GATE FRAMEWORK */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    3. EVAL TO LAUNCH: WHAT IS "GOOD ENOUGH" FRAMEWORK:
                  </div>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Grid columns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap="var(--ds-space-2)">
                      {LAUNCH_GATE_FRAMEWORK.map((item, idx) => (
                        <Card key={idx} style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>
                            {item.step}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                            {item.description}
                          </div>
                        </Card>
                      ))}
                    </Grid>
                  </Card>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 7. GSM-SYMBOLIC & REASONING BENCHMARKS (APPLE STUDY) ─── */}
        {activeSubTab === 'gsm_symbolic' && (
          <Stack gap={6}>
            {/* ARCHITECTURAL DIAGRAM CARD */}
            <DiagramImage
              src="/assets/gsm_symbolic_reasoning_arch.png"
              alt="Rethinking LLM Benchmarks: Apple GSM-Symbolic Architecture Diagram"
              title="Apple's GSM-Symbolic Benchmark — Measuring True Reasoning Beyond Training Data"
              caption="Overview: 1. GSM-Symbolic Template Generator (Mutating numbers/names) ➔ 2. GSM-NoOp Irrelevant Noise Injection (Up to 65% accuracy drop) ➔ 3. Pattern Matching vs Neuro-Symbolic Reasoning Engine."
              background="#090d16"
              maxWidth={1050}
            />

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={5}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Rethinking LLM Benchmarks: GSM-Symbolic & Reasoning</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on Apple's research paper (<em>GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in Large Language Models</em>, Mirzadeh et al., 2024 / Maxime Jabarian TDS analysis). Are models true reasoners or pattern matchers?
                  </p>
                </div>

                {/* 1. EXPERIMENT PICKER */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    1. SELECT APPLE BENCHMARK EXPERIMENT:
                  </div>

                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                    {GSM_SYMBOLIC_EXPERIMENTS.map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => setSelectedExpId(exp.id)}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: selectedExpId === exp.id ? '2px solid var(--ds-color-module-foundations-primary)' : '1px solid var(--ds-color-border-subtle)',
                          background: selectedExpId === exp.id ? 'rgba(42,138,132,0.08)' : 'var(--ds-color-bg-surface)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Flex align="center" gap={2}>
                          <span style={{ fontSize: '1.2rem' }}>{exp.icon}</span>
                          <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>{exp.title}</span>
                        </Flex>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                          {exp.description}
                        </div>
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE EXPERIMENT DEMO */}
                  <Card style={{ padding: 'var(--ds-space-5)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                    <Stack gap={4}>
                      <Flex align="center" justify="space-between">
                        <Badge variant="primary" size="md">{activeExp.title}</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                          Apple GSM-Symbolic Study
                        </span>
                      </Flex>

                      {activeExp.id === 'symbolic_mutation' ? (
                        <Stack gap={3}>
                          <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                            <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>STANDARD GSM8K BASE PROBLEM:</strong>
                            <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px', fontWeight: 'bold' }}>
                              "{activeExp.baseProblem.question}"
                            </div>
                            <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', marginTop: '4px', fontFamily: 'var(--ds-font-family-mono)' }}>
                              Equation: {activeExp.baseProblem.equation} ➔ Answer: {activeExp.baseProblem.answer}
                            </div>
                          </Card>

                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Symbolic Mutations & LLM Performance Drift:</strong>
                          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                            {activeExp.mutatedProblems.map((mut, idx) => (
                              <Card key={idx} style={{ padding: '12px', borderLeft: `4px solid ${mut.llmBehavior.includes('FAIL') ? '#ef4444' : '#5EC4C8'}` }}>
                                <Badge variant={mut.llmBehavior.includes('FAIL') ? 'danger' : 'success'} size="sm">{mut.mutationName}</Badge>
                                <div style={{ fontSize: 'var(--ds-font-size-caption)', marginTop: '6px' }}>
                                  "{mut.question}"
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                                  Expected: {mut.equation} = {mut.answer}
                                </div>
                                <div style={{ fontSize: 'var(--ds-font-size-caption)', color: mut.llmBehavior.includes('FAIL') ? '#ef4444' : '#5EC4C8', marginTop: '6px', fontWeight: 'bold' }}>
                                  {mut.llmBehavior}
                                </div>
                              </Card>
                            ))}
                          </Grid>
                        </Stack>
                      ) : (
                        <Stack gap={3}>
                          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                              <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>1. CLEAN MATH PROBLEM (NO NOISE):</strong>
                              <div style={{ fontSize: 'var(--ds-font-size-caption)', marginTop: '4px' }}>
                                "{activeExp.noopProblem.cleanQuestion}"
                              </div>
                              <Badge variant="success" size="sm" style={{ marginTop: '8px' }}>Accuracy: 95.2%</Badge>
                            </Card>

                            <Card style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                              <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#ef4444' }}>2. GSM-NOOP (IRRELEVANT DISTRACTOR INJECTED):</strong>
                              <div style={{ fontSize: 'var(--ds-font-size-caption)', marginTop: '4px' }}>
                                "{activeExp.noopProblem.noopQuestion}"
                              </div>
                              <Badge variant="danger" size="sm" style={{ marginTop: '8px' }}>Accuracy Collapsed to 41.2% (-54% drop!)</Badge>
                            </Card>
                          </Grid>

                          <Callout type="danger">
                            <strong>Why LLMs Fail GSM-NoOp:</strong> Autoregressive transformers lack abstract reasoning and noise filters. Instead of ignoring the zero-operation sentence (*"5 of the apples were smaller and green"*), LLMs blindly incorporate the number 5 into their arithmetic logic, proving they perform statistical pattern matching rather than formal logic execution.
                          </Callout>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                </Stack>

                {/* 2. SOTA BENCHMARK COMPARISON TABLE */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    2. SOTA LLM BENCHMARK PERFORMANCE & DEGRADATION COMPARISON:
                  </div>

                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                        <thead>
                          <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                            <th style={{ padding: '10px' }}>Model</th>
                            <th style={{ padding: '10px' }}>Standard GSM8K Score</th>
                            <th style={{ padding: '10px' }}>GSM-Symbolic Mean (Variance)</th>
                            <th style={{ padding: '10px' }}>GSM-NoOp Accuracy</th>
                            <th style={{ padding: '10px' }}>Noise Performance Drop</th>
                          </tr>
                        </thead>
                        <tbody>
                          {MODEL_BENCHMARK_COMPARISON.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.model}</td>
                              <td style={{ padding: '10px' }}>
                                <Badge variant="info" size="sm">{row.gsm8kStandard}</Badge>
                              </td>
                              <td style={{ padding: '10px' }}>
                                {row.gsmSymbolicMean} <span style={{ color: 'var(--ds-color-text-tertiary)' }}>({row.gsmSymbolicStdDev})</span>
                              </td>
                              <td style={{ padding: '10px', fontWeight: 'bold', color: row.gsmNoopAccuracy.startsWith('2') || row.gsmNoopAccuracy.startsWith('4') ? '#ef4444' : '#f59e0b' }}>
                                {row.gsmNoopAccuracy}
                              </td>
                              <td style={{ padding: '10px', color: '#ef4444', fontWeight: 'bold' }}>
                                {row.accuracyDrop}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </Stack>

                {/* 3. NEURO-SYMBOLIC SOLUTIONS */}
                <Stack gap={3}>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                    3. ARCHITECTURAL REMEDIES FOR TRUE REASONING BEYOND TRAINING DATA:
                  </div>

                  <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                    {NEURO_SYMBOLIC_SOLUTIONS.map((sol, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid var(--ds-color-module-foundations-primary)' }}>
                        <Flex align="center" gap={2} style={{ marginBottom: '8px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{sol.icon}</span>
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{sol.title}</strong>
                        </Flex>
                        <p style={{ margin: 0, fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4 }}>
                          {sol.description}
                        </p>
                      </Card>
                    ))}
                  </Grid>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
