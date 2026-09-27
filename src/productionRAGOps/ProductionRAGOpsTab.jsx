import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  MLOPS_BROKEN_ASSUMPTIONS,
  CALCULATE_COMPOUNDING_RELIABILITY,
  CALCULATE_PASS_AT_K,
  SIMULATE_AGENT_TRAJECTORY,
  RAG_COMPLEXITY_LEVELS,
  SAMPLE_COMPLEXITY_QUERIES,
  FOUR_QUADRANTS_MATRIX,
  SYNTHETIC_FAQ_CORPUS,
  CLASSIFY_FAQ_QUERY,
  FAQ_CLUSTER_MISSES,
  NOISE_FAILURE_MODES,
  BENCHMARK_NOISY_RETRIEVAL,
  ABSENCE_EVIDENCE_CASES,
  STRUCTURED_FAILURE_MODES,
  CALCULATE_DISTRIBUTION_ENTROPY
} from './ragProductionOpsEngine.js';
import {
  AgentOpsTrajectoryDiagram,
  EarnedComplexityLadderDiagram,
  FAQAsRAGInvertedFlowDiagram,
  NoisyTextStrategyForkDiagram,
  AbsenceEvidenceChainDiagram,
  ThreeLayerDefenseDiagram
} from './ProductionRAGOpsDiagrams.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ProductionRAGOpsTab() {
  const [activeSubTab, setActiveSubTab] = useState('agentops');

  // Subtab 1: AgentOps Simulator State
  const [perStepReliability, setPerStepReliability] = useState(85);
  const [stepCount, setStepCount] = useState(10);
  const [passKAttempt, setPassKAttempt] = useState(8);
  const [trajectoryScenario, setTrajectoryScenario] = useState('infinite_loop');

  const compounding = CALCULATE_COMPOUNDING_RELIABILITY(perStepReliability, stepCount);
  const passAtK = CALCULATE_PASS_AT_K(perStepReliability / 100, passKAttempt);
  const trajSim = SIMULATE_AGENT_TRAJECTORY(trajectoryScenario);

  // Subtab 2: RAG Complexity Escalator State
  const [selectedQueryId, setSelectedQueryId] = useState('exact_code');
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(2);

  // Subtab 3: FAQ as RAG State
  const [faqInputQuery, setFaqInputQuery] = useState("Does my policy cover water damage from burst pipes?");
  const [directThreshold, setDirectThreshold] = useState(0.92);
  const [adjacentThreshold, setAdjacentThreshold] = useState(0.78);

  const faqClassification = CLASSIFY_FAQ_QUERY(faqInputQuery, directThreshold, adjacentThreshold);

  // Subtab 4: Noisy Text State
  const [noisyScenario, setNoisyScenario] = useState('ocr_glitch');
  const noisyBenchmark = BENCHMARK_NOISY_RETRIEVAL(noisyScenario);

  // Subtab 5: Absence Evidence State
  const [selectedAbsenceCaseId, setSelectedAbsenceCaseId] = useState('cmo_ai_electricity');
  const activeAbsenceCase = ABSENCE_EVIDENCE_CASES.find(c => c.id === selectedAbsenceCaseId) || ABSENCE_EVIDENCE_CASES[0];

  // Subtab 6: Structured Failure Modes State
  const [selectedFailureModeId, setSelectedFailureModeId] = useState('confident_fabrication');
  const activeFailureMode = STRUCTURED_FAILURE_MODES.find(m => m.id === selectedFailureModeId) || STRUCTURED_FAILURE_MODES[0];
  const [flatlineConfidence, setFlatlineConfidence] = useState(0.98);
  const simulatedEntropy = CALCULATE_DISTRIBUTION_ENTROPY([flatlineConfidence, flatlineConfidence, flatlineConfidence, flatlineConfidence, flatlineConfidence]);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production RAG & AgentOps [Failure-Driven Architecture]"
        title="Production RAG & AgentOps: Earned Complexity, FAQ Caching & Noisy Text"
        description="Moving beyond academic tutorials to battle-tested enterprise architectures. Discover why green MLOps dashboards fail in agentic loops, how to earn RAG complexity against measured failure modes, inverting pipelines with FAQ-as-RAG caching, conquering OCR & noisy text, proving document absence with 4-brick evidence, and defeating silent structured output failures."
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
            { id: 'agentops', label: '1. AgentOps vs MLOps (Trajectories)', icon: '⛓️' },
            { id: 'ragcomplexity', label: '2. Earned RAG Complexity (8 Levels)', icon: '🪜' },
            { id: 'faqasrag', label: '3. FAQ as RAG (Inverted Cache)', icon: '🔄' },
            { id: 'noisytext', label: '4. Noisy Text & OCR Gaps', icon: '🔤' },
            { id: 'absenceevidence', label: '5. Defensible Absence (4 Evidences)', icon: '🛡️' },
            { id: 'structuredfailures', label: '6. Valid JSON, Wrong Data (5 Failures)', icon: '⚠️' },
            { id: 'playbook', label: '7. Production Code & Playbook', icon: '📖' }
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

        {/* ─── SUBTAB 1: AGENTOPS VS MLOPS ─── */}
        {activeSubTab === 'agentops' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Traditional MLOps Monitoring vs. Modern AgentOps Trajectories</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/agentops_vs_mlops_monitoring_1788446473776.jpg"
                  alt="Traditional MLOps Monitoring vs. Modern AgentOps Trajectories"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <AgentOpsTrajectoryDiagram />

            {/* Interactive Compounding Step Calculator */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#ef4444' }}>📉 The Compounding Failure & pass^k Calculator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    See why single-step metrics lie. When probabilities multiply across an autonomous loop (p^N), an 85% green dashboard masks an 80% user failure rate!
                  </p>
                </div>
                <Badge variant={compounding.endToEndSuccessPct > 60 ? 'success' : 'danger'}>
                  End-to-End Success: {compounding.endToEndSuccessPct}%
                </Badge>
              </div>

              <Grid cols={3} gap={4} style={{ marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: '#3A9B9F' }}>Per-Step Reliability: {perStepReliability}%</span>
                  </div>
                  <input
                    type="range"
                    min="65"
                    max="99"
                    value={perStepReliability}
                    onChange={(e) => setPerStepReliability(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#5EC4C8' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Status quo MLOps dashboard number
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: '#3A9B9F' }}>Trajectory Length: {stepCount} steps</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={stepCount}
                    onChange={(e) => setStepCount(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#5EC4C8' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Number of autonomous tool/reasoning steps
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span style={{ color: '#f59e0b' }}>Tau-Bench Trials (k): {passKAttempt} runs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={passKAttempt}
                    onChange={(e) => setPassKAttempt(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#f59e0b' }}
                  />
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    pass^k: probability that all k attempts succeed
                  </div>
                </div>
              </Grid>

              <Grid cols={3} gap={4} style={{ marginBottom: '16px' }}>
                <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>MLOPS PER-STEP REPORT</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3A9B9F' }}>{perStepReliability}% (Healthy)</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>What conventional dashboards show</div>
                </div>

                <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>TRUE TRAJECTORY COMPLETION (p^{stepCount})</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: compounding.endToEndSuccessPct < 50 ? '#ef4444' : '#f59e0b' }}>
                    {compounding.endToEndSuccessPct}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '2px' }}>
                    {compounding.failureRatePct}% of customer runs fail
                  </div>
                </div>

                <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>TAU-BENCH pass^{passKAttempt} CONSISTENCY</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {passAtK.allSucceedPassKPct}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>
                    Odds of passing {passKAttempt} identical runs
                  </div>
                </div>
              </Grid>

              <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '8px' }}>
                  📉 Step Decay Curve: How Quality Deteriorates Along the Path
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '90px', gap: '8px', paddingTop: '10px' }}>
                  {compounding.curve.map(c => (
                    <div key={c.step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${c.successRate}%`,
                          background: c.successRate > 70 ? '#5EC4C8' : c.successRate > 40 ? '#f59e0b' : '#ef4444',
                          borderRadius: '3px 3px 0 0',
                          minHeight: '4px'
                        }}
                      />
                      <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px' }}>S{c.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Interactive Trajectory Replay & Hard Loop Cap Tester */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>⚡ Interactive Agent Trajectory Replay & Hard Loop Cap</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Simulate how autonomous tool calling encounters deterministic lockouts and why hard loop caps (3-5 retries) prevent $10+ token drain.
                  </p>
                </div>
                <Badge variant={trajSim.badgeVariant}>
                  Status: {trajSim.status}
                </Badge>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'clean_run', label: '1. Clean 4-Step Run', desc: 'All tools succeed' },
                  { id: 'infinite_loop', label: '2. Deterministic Retry Loop (Hard Cap)', desc: 'Schema lock caught after 3 retries' },
                  { id: 'silent_defect', label: '3. The Green Trace Fallacy', desc: 'Spans 200 OK, wrong customer refunded' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setTrajectoryScenario(s.id)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: trajectoryScenario === s.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                      background: trajectoryScenario === s.id ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                      color: trajectoryScenario === s.id ? '#5EC4C8' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '12px' }}>
                  <span>TRAJECTORY WATERFALL SPANS</span>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <span>Total Tokens: <strong>{trajSim.totalTokens.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Cost: <strong style={{ color: '#3A9B9F' }}>${trajSim.costEstimate.toFixed(3)}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  {trajSim.steps.map((st, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      borderLeft: `4px solid ${st.status.includes('RED') ? '#ef4444' : st.status.includes('AMBER') ? '#f59e0b' : '#5EC4C8'}`,
                      borderRadius: '4px',
                      padding: '8px 12px',
                      fontSize: '12px'
                    }}>
                      <div>
                        <strong style={{ color: '#f8fafc', marginRight: '8px' }}>Step {st.step} [{st.action}]:</strong>
                        <span style={{ color: '#cbd5e1' }}>{st.detail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', fontSize: '11px' }}>
                        <span style={{ color: '#64748b' }}>{st.latency}</span>
                        <span style={{ color: st.status.includes('RED') ? '#ef4444' : st.status.includes('AMBER') ? '#f59e0b' : '#5EC4C8' }}>
                          ● {st.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: trajSim.hardCapTripped ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${trajSim.hardCapTripped ? '#f59e0b' : '#5EC4C8'}`, borderRadius: '6px', padding: '10px', fontSize: '12px', color: '#f8fafc' }}>
                  <strong>VERDICT:</strong> {trajSim.verdict}
                </div>
              </div>
            </Card>

            {/* 5 Broken Assumptions Table */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 14px 0', color: '#3A9B9F' }}>📋 The 5 Broken MLOps Assumptions vs. AgentOps Instrumentation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {MLOPS_BROKEN_ASSUMPTIONS.map(item => (
                  <div key={item.id} style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>{item.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '14px', color: '#f8fafc' }}>{item.assumption}</h4>
                      </div>
                      <span style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                        Old Signal: {item.mlopsSignal}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#fca5a5', marginBottom: '6px' }}>
                      <strong>The Blind Spot:</strong> {item.blindSpot}
                    </div>
                    <div style={{ fontSize: '12px', color: '#3A9B9F', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 10px', borderRadius: '4px' }}>
                      <strong>✅ AgentOps Instrumentation:</strong> {item.agentOpsFix}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: WHY RAG COMPLEXITY SHOULD BE EARNED ─── */}
        {activeSubTab === 'ragcomplexity' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Earned RAG Complexity Escalation Ladder (Levels 0 to 8)</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/earned_rag_complexity_ladder_1788446534429.jpg"
                  alt="Earned RAG Complexity Ladder"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <EarnedComplexityLadderDiagram />

            {/* Interactive RAG Complexity Escalator Sandbox */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#3A9B9F' }}>🪜 Interactive RAG Complexity Escalator & Failure Mode Diagnostic</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Select a real production query archetype, step through the 8 complexity levels, and observe how latency, token costs, and Recall@5 scale.
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px' }}>
                  1. SELECT PRODUCTION QUERY ARCHETYPE:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {SAMPLE_COMPLEXITY_QUERIES.map(q => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setSelectedQueryId(q.id);
                        setSelectedLevelIndex(q.bestLevel);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: selectedQueryId === q.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: selectedQueryId === q.id ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                        color: selectedQueryId === q.id ? '#5EC4C8' : '#cbd5e1',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{q.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>"{q.query}"</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F' }}>
                    2. ESCALATION LEVEL: {RAG_COMPLEXITY_LEVELS[selectedLevelIndex].name}
                  </label>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Step 0 to 8</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {RAG_COMPLEXITY_LEVELS.map((lvl, idx) => (
                    <button
                      key={lvl.level}
                      onClick={() => setSelectedLevelIndex(idx)}
                      style={{
                        flex: 1,
                        padding: '8px 4px',
                        borderRadius: '4px',
                        border: selectedLevelIndex === idx ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                        background: selectedLevelIndex === idx ? '#5EC4C8' : '#090d16',
                        color: selectedLevelIndex === idx ? '#000' : '#94a3b8',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      L{lvl.level}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const cur = RAG_COMPLEXITY_LEVELS[selectedLevelIndex];
                const activeQuery = SAMPLE_COMPLEXITY_QUERIES.find(q => q.id === selectedQueryId);
                const isOptimal = cur.level === activeQuery.bestLevel;
                return (
                  <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>{cur.name}</h4>
                        <span style={{ fontSize: '11px', color: '#3A9B9F' }}>{cur.subtitle}</span>
                      </div>
                      <Badge variant={isOptimal ? 'success' : cur.level > activeQuery.bestLevel ? 'warning' : 'danger'}>
                        {isOptimal ? '🎯 OPTIMAL EARNED LEVEL' : cur.level > activeQuery.bestLevel ? '⚠️ OVER-ENGINEERED (EXCESS COST)' : '❌ INSUFFICIENT (RETRIEVAL MISS)'}
                      </Badge>
                    </div>

                    <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                      {cur.description}
                    </p>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
                      <strong style={{ color: '#ef4444' }}>Target Failure Mode Solved:</strong> {cur.targetFailure}
                    </div>

                    <Grid cols={4} gap={4}>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>RECALL@5</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3A9B9F' }}>{cur.recall5}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>NDCG@10</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3A9B9F' }}>{cur.ndcg10}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>LATENCY (P50)</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>{cur.latencyMs}ms</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>COST / 1K QUERIES</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>${cur.costPer1k.toFixed(2)}</div>
                      </div>
                    </Grid>
                  </div>
                );
              })()}
            </Card>

            {/* The 4 Diagnostic Quadrants */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#f59e0b' }}>🧭 The 4 Diagnostic Quadrants: Separating Retrieval from Generation</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                Never evaluate RAG only by end-to-end output. An answer may be right because of pre-trained parametric luck even when retrieval failed completely.
              </p>
              <Grid cols={2} gap={4}>
                {FOUR_QUADRANTS_MATRIX.map((q, idx) => (
                  <div key={idx} style={{ background: '#090d16', borderLeft: `4px solid ${q.color}`, borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px', color: '#f8fafc' }}>{q.quadrant}</strong>
                      <span style={{ fontSize: '11px', color: q.color, fontWeight: 'bold' }}>{q.status}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {q.description}
                    </p>
                  </div>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: FAQ AS RAG ─── */}
        {activeSubTab === 'faqasrag' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>FAQ as RAG: Inverted Architecture & Semantic Cache Router</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/faq_as_rag_architecture_1788446566695.jpg"
                  alt="FAQ as RAG Architecture"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <FAQAsRAGInvertedFlowDiagram />

            {/* Interactive FAQ-as-RAG Router Sandbox */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>🔄 Live FAQ-as-RAG Classification & Dispatch Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Type or click a question to test the 3 outcomes: Direct Match (0 tokens, 2ms), Adjacent Match (Dynamic Few-Shot), or Miss (Expert Escalation).
                  </p>
                </div>
                <Badge variant={faqClassification.outcome === 'direct' ? 'success' : faqClassification.outcome === 'adjacent' ? 'primary' : 'warning'}>
                  Outcome: {faqClassification.outcome.toUpperCase()}
                </Badge>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {[
                  { q: "Does my home insurance policy cover water damage from burst pipes?", tag: "Direct Match (100% Exact)" },
                  { q: "Can I cancel my coverage early and get money back?", tag: "Adjacent (Paraphrase)" },
                  { q: "What is my deductible for roof storm claims?", tag: "Adjacent (Near Match)" },
                  { q: "Does policy pay for foundation wall water seepage after rain?", tag: "Miss (Unanswered Gap)" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFaqInputQuery(item.q)}
                    style={{
                      padding: '6px 12px',
                      background: '#090d16',
                      border: '1px solid var(--ds-color-border-subtle)',
                      borderRadius: '4px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    "{item.q}" <span style={{ color: '#3A9B9F' }}>[{item.tag}]</span>
                  </button>
                ))}
              </div>

              <Grid cols={2} gap={4} style={{ marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '6px' }}>
                    User Query:
                  </label>
                  <input
                    type="text"
                    value={faqInputQuery}
                    onChange={(e) => setFaqInputQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', color: '#f8fafc', fontSize: '13px' }}
                  />
                </div>

                <Grid cols={2} gap={2}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '4px' }}>
                      Direct Threshold: {directThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.85"
                      max="0.98"
                      step="0.01"
                      value={directThreshold}
                      onChange={(e) => setDirectThreshold(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#5EC4C8' }}
                    />
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Short-circuit cache threshold</div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#3A9B9F', marginBottom: '4px' }}>
                      Adjacent Threshold: {adjacentThreshold}
                    </label>
                    <input
                      type="range"
                      min="0.70"
                      max="0.84"
                      step="0.01"
                      value={adjacentThreshold}
                      onChange={(e) => setAdjacentThreshold(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#5EC4C8' }}
                    />
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Dynamic few-shot threshold</div>
                  </div>
                </Grid>
              </Grid>

              <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span>Cosine Similarity: <strong style={{ color: '#3A9B9F' }}>{faqClassification.highestSim}</strong></span>
                    <span>•</span>
                    <span>Matched Canonical: <strong style={{ color: '#f8fafc' }}>{faqClassification.bestMatch.qid} ({faqClassification.bestMatch.tag})</strong></span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                    <span>Tokens: <strong style={{ color: '#3A9B9F' }}>{faqClassification.tokensConsumed}</strong></span>
                    <span>•</span>
                    <span>Latency: <strong style={{ color: '#f59e0b' }}>{faqClassification.latencyMs}ms</strong></span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1', marginBottom: '12px' }}>
                  <strong>PIPELINE ACTION:</strong> {faqClassification.actionTaken}
                </div>

                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}>
                  DELIVERED USER RESPONSE:
                </div>
                <div style={{ background: '#060a12', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.08)', lineHeight: '1.5' }}>
                  {faqClassification.deliveredAnswer}
                </div>
              </div>
            </Card>

            {/* The Continuous Flywheel: Clustered Misses */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 6px 0', color: '#3A9B9F' }}>🔄 The FAQ Feedback Flywheel: Promoting High-Frequency Misses</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                A weekly job clusters unanswered queries by embedding proximity. Human experts write 1 canonical answer for top clusters, turning yesterday's misses into tomorrow's instant cache hits.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {FAQ_CLUSTER_MISSES.map(cl => (
                  <div key={cl.clusterId} style={{ background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f8fafc' }}>{cl.theme}</span>
                        <Badge variant="warning">{cl.count} Misses This Week</Badge>
                      </div>
                      <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>{cl.status}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>
                      Sample Queries: {cl.sampleQueries.map((sq, idx) => <span key={idx}>"{sq}"{idx < cl.sampleQueries.length - 1 ? ', ' : ''}</span>)}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 10px', borderRadius: '4px' }}>
                      <strong>Suggested Action:</strong> {cl.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: NOISY TEXT & OCR GAPS ─── */}
        {activeSubTab === 'noisytext' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #f59e0b' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Noisy Text in RAG: Typos, OCR Visual Glitches & Solution Architectures</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/noisy_text_rag_pipeline_1788446676392.jpg"
                  alt="Noisy Text in RAG Pipeline"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <NoisyTextStrategyForkDiagram />

            {/* Interactive Noisy Text & OCR Benchmark */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#f59e0b' }}>🔬 Head-to-Head Benchmark: Classical Spell-Check vs. N-Grams vs. Embeddings</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Compare how classical Levenshtein/Soundex and exact BM25 fail when real-world OCR visual substitutions ('rn' ➔ 'm') and real-word typos appear.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'ocr_glitch', label: '1. OCR Character Visual Glitch', desc: '"rnodern d0cument inte11igence"' },
                  { id: 'real_word_typo', label: '2. Real-Word Typo (Dictionary Valid)', desc: '"relief form negligence" (from vs form)' },
                  { id: 'keyboard_transposition', label: '3. Fast Typing Transposition', desc: '"wat is teh covarge for fyre damge"' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setNoisyScenario(s.id)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: noisyScenario === s.id ? '1px solid #f59e0b' : '1px solid var(--ds-color-border-subtle)',
                      background: noisyScenario === s.id ? 'rgba(245, 158, 11, 0.15)' : '#090d16',
                      color: noisyScenario === s.id ? '#f59e0b' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.desc}</div>
                  </button>
                ))}
              </div>

              <div style={{ background: '#090d16', padding: '16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#ef4444' }}>
                    <strong>Corrupted Input:</strong> <code>"{noisyBenchmark.query}"</code>
                  </div>
                  <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '2px' }}>
                    <strong>Clean Reference Target:</strong> <code>"{noisyBenchmark.cleanTarget}"</code>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {noisyBenchmark.algorithms.map((algo, idx) => (
                    <div key={idx} style={{
                      display: 'grid',
                      gridTemplateColumns: '240px 100px 90px 1fr',
                      gap: '12px',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      <strong style={{ color: '#f8fafc' }}>{algo.name}</strong>
                      <span style={{ color: Number(algo.recall.replace('%','')) > 70 ? '#5EC4C8' : Number(algo.recall.replace('%','')) > 30 ? '#f59e0b' : '#ef4444', fontWeight: 'bold' }}>
                        Recall: {algo.recall}
                      </span>
                      <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{algo.latency}</span>
                      <span style={{ color: '#94a3b8' }}>{algo.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 4 Noise Failure Modes */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#3A9B9F' }}>⚠️ The 4 Noisy Text Failure Modes in Enterprise Documents</h3>
              <Grid cols={2} gap={4}>
                {NOISE_FAILURE_MODES.map(mode => (
                  <div key={mode.id} style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>
                      {mode.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginBottom: '6px' }}>
                      Ex: {mode.example}
                    </div>
                    <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '4px' }}>
                      <strong>Classical Result:</strong> {mode.classicalResult}
                    </div>
                    <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {mode.impact}
                    </p>
                  </div>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: DEFENSIBLE ABSENCE (4 EVIDENCE BRICKS) ─── */}
        {activeSubTab === 'absenceevidence' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #5EC4C8' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Defensible "Not in This Document" RAG: The 4-Brick Evidence Chain</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/rag_absence_four_evidences_1788447761773.jpg"
                  alt="Defensible Absence RAG 4 Bricks"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <AbsenceEvidenceChainDiagram />

            {/* Interactive Document Absence Verifier */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#3A9B9F' }}>🛡️ Interactive Absence Verification Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    Select an inquiry case where the answer does not exist. Inspect the 4 distinct proofs produced across the pipeline.
                  </p>
                </div>
                <Badge variant="success">Verdict: {activeAbsenceCase.structuredResponse.verdict}</Badge>
              </div>

              {/* Case Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                {ABSENCE_EVIDENCE_CASES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedAbsenceCaseId(c.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: selectedAbsenceCaseId === c.id ? '1px solid #5EC4C8' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedAbsenceCaseId === c.id ? 'rgba(56, 189, 248, 0.15)' : '#090d16',
                      color: selectedAbsenceCaseId === c.id ? '#5EC4C8' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Doc: {c.documentName}</div>
                  </button>
                ))}
              </div>

              {/* 4 Bricks Live Inspection Container */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Brick 1 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#3A9B9F', fontSize: '13px' }}>BRICK 1: RELATIONAL PARSE COVERAGE PROOF</strong>
                    <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>● {activeAbsenceCase.parseCoverage.evidenceStatus}</span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#cbd5e1' }}>
                    {activeAbsenceCase.parseCoverage.summary}
                  </p>
                  <Grid cols={4} gap={2}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px', fontSize: '11px' }}>
                      <span style={{ color: '#94a3b8' }}>Pages Parsed:</span> <strong style={{ color: '#f8fafc' }}>{activeAbsenceCase.parseCoverage.totalPages} / {activeAbsenceCase.parseCoverage.pagesWithText}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px', fontSize: '11px' }}>
                      <span style={{ color: '#94a3b8' }}>OCR Dropouts:</span> <strong style={{ color: '#3A9B9F' }}>{activeAbsenceCase.parseCoverage.ocrDropouts}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px', fontSize: '11px' }}>
                      <span style={{ color: '#94a3b8' }}>Lines Indexed:</span> <strong style={{ color: '#f8fafc' }}>{activeAbsenceCase.parseCoverage.extractedLines.toLocaleString()}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: '4px', fontSize: '11px' }}>
                      <span style={{ color: '#94a3b8' }}>Blank Dropouts:</span> <strong style={{ color: '#3A9B9F' }}>{activeAbsenceCase.parseCoverage.blankPages}</strong>
                    </div>
                  </Grid>
                </div>

                {/* Brick 2 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '14px' }}>
                  <strong style={{ color: '#3A9B9F', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                    BRICK 2: VALIDATED DOMAIN CONCEPT VOCABULARY
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeAbsenceCase.conceptVocabulary.map((cv, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', fontSize: '11px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>{cv.concept}</span>
                          <span style={{ color: '#3A9B9F' }}>Source: {cv.source}</span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>
                          Exhaustive Variant Synonyms: {cv.synonyms.map((s, si) => <code key={si} style={{ color: '#cbd5e1', marginRight: '4px' }}>"{s}"</code>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brick 3 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#f59e0b', fontSize: '13px' }}>BRICK 3: FULL DOCUMENT SWEEP (NOT TOP-K!)</strong>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Sweep Method: <code>{activeAbsenceCase.documentSweep.sweepMethod}</code></span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '10px', fontSize: '12px' }}>
                    <span>Target Concept A Hits: <strong style={{ color: '#ef4444' }}>{activeAbsenceCase.documentSweep.conceptAHits}</strong></span>
                    <span>•</span>
                    <span>Concept B Hits: <strong style={{ color: '#f59e0b' }}>{activeAbsenceCase.documentSweep.conceptBHits}</strong></span>
                    <span>•</span>
                    <span>Joint Co-occurrences: <strong style={{ color: '#ef4444' }}>{activeAbsenceCase.documentSweep.jointCoOccurrences}</strong></span>
                  </div>
                  <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', padding: '10px', fontSize: '11px' }}>
                    <strong style={{ color: '#fca5a5' }}>Nearest Distractor Passage (Page {activeAbsenceCase.documentSweep.distractorPassage.page}, Line {activeAbsenceCase.documentSweep.distractorPassage.line}):</strong>
                    <div style={{ fontStyle: 'italic', color: '#cbd5e1', margin: '4px 0' }}>
                      "{activeAbsenceCase.documentSweep.distractorPassage.snippet}"
                    </div>
                    <div style={{ color: '#fca5a5' }}>
                      <strong>Audit Note:</strong> {activeAbsenceCase.documentSweep.distractorPassage.whyNotAnswer}
                    </div>
                  </div>
                </div>

                {/* Brick 4 */}
                <div style={{ background: '#090d16', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#a855f7', fontSize: '13px' }}>BRICK 4: STRUCTURED JUSTIFICATION OUTPUT (AnswerWithAbsenceEvidence)</strong>
                    <Badge variant="primary">Defensible Refusal</Badge>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#f8fafc', lineHeight: '1.5' }}>
                    "{activeAbsenceCase.structuredResponse.justification}"
                  </p>
                  <pre style={{ margin: 0, padding: '10px', background: '#060a12', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1', fontFamily: 'monospace' }}>
{`{
  "verdict": "NOT_IN_THIS_DOCUMENT",
  "confidence": 1.0,
  "parse_coverage_verified": true,
  "pages_swept": ${activeAbsenceCase.parseCoverage.totalPages},
  "total_lines_swept": ${activeAbsenceCase.structuredResponse.sweepCount},
  "joint_co_occurrence_count": 0,
  "closest_distractor_page": ${activeAbsenceCase.documentSweep.distractorPassage.page}
}`}
                  </pre>
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: VALID JSON, WRONG DATA (5 FAILURE MODES) ─── */}
        {activeSubTab === 'structuredfailures' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid #ef4444' }}>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>AI ARCHITECTURAL INFOGRAPHIC</span>
                <h3 style={{ margin: '4px 0 0 0', color: '#f8fafc' }}>Valid JSON, Wrong Data: Five Failure Modes LLM Structured Outputs Won't Catch</h3>
              </div>
              <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', overflow: 'hidden', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', background: '#05070e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src="/assets/structured_outputs_five_failures_1788447786725.jpg"
                  alt="Valid JSON Wrong Data 5 Failure Modes"
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }}
                />
              </div>
            </Card>

            <ThreeLayerDefenseDiagram />

            {/* Interactive Failure Mode Inspector */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#ef4444' }}>🔬 Interactive Sandbox: The 5 Failure Modes That Survive Your Schema</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                  Constrained decoding guarantees that a string is a string and a number is a number. See why schema validators are blind to these 5 semantic bugs.
                </p>
              </div>

              {/* Mode Selector Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {STRUCTURED_FAILURE_MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedFailureModeId(m.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: selectedFailureModeId === m.id ? '1px solid #ef4444' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedFailureModeId === m.id ? 'rgba(239, 68, 68, 0.15)' : '#090d16',
                      color: selectedFailureModeId === m.id ? '#fca5a5' : '#cbd5e1',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  >
                    {m.name.split('.')[1] || m.name}
                  </button>
                ))}
              </div>

              {/* Selected Failure Mode Inspection Card */}
              <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#f8fafc' }}>{activeFailureMode.name}</h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{activeFailureMode.subtitle}</span>
                  </div>
                  <Badge variant="danger">{activeFailureMode.layer1Status}</Badge>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>RAW INPUT PROVIDED TO MODEL:</span>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '12px', color: '#f8fafc', margin: '4px 0' }}>
                    {activeFailureMode.rawInput}
                  </div>
                </div>

                <Grid cols={2} gap={4} style={{ marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>CONSTRAINED JSON SCHEMA:</span>
                    <pre style={{ margin: '4px 0 0 0', padding: '10px', background: '#060a12', borderRadius: '4px', fontSize: '11px', color: '#7dd3fc', fontFamily: 'monospace' }}>
                      {activeFailureMode.validSchema}
                    </pre>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>GENERATED JSON (VALID BUT WRONG!):</span>
                    <pre style={{ margin: '4px 0 0 0', padding: '10px', background: '#060a12', borderRadius: '4px', fontSize: '11px', color: '#fca5a5', fontFamily: 'monospace' }}>
                      {activeFailureMode.generatedJson}
                    </pre>
                  </div>
                </Grid>

                <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid #ef4444', padding: '10px 14px', borderRadius: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  <strong style={{ color: '#fca5a5' }}>The Semantic Blind Spot:</strong>
                  <div style={{ color: '#cbd5e1', marginTop: '2px' }}>{activeFailureMode.semanticViolation}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid #5EC4C8', padding: '10px 14px', borderRadius: '4px', fontSize: '12px' }}>
                  <strong style={{ color: '#6ee7b7' }}>✅ Layer 2/3 Defense Solution:</strong>
                  <div style={{ color: '#cbd5e1', marginTop: '2px' }}>{activeFailureMode.layer2Fix}</div>
                </div>
              </div>
            </Card>

            {/* Statistical Warning Signals: Distributional Collapse Simulator */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#f59e0b' }}>📊 Statistical Warning Signal: Entropy Collapse Detector</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                    You cannot catch these failures by looking at individual JSON records. Track Shannon entropy of confidence scores over time.
                  </p>
                </div>
                <Badge variant={simulatedEntropy < 0.2 ? 'danger' : 'success'}>
                  Entropy: {simulatedEntropy} bits
                </Badge>
              </div>

              <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '10px' }}>
                  When an LLM suffers from <strong>Distributional Collapse</strong>, every single output—including gibberish inputs—flatlines at 0.98 or 0.99. Entropy collapses to 0.00.
                </div>
                <Grid cols={3} gap={4}>
                  <div style={{ background: '#060a12', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>CONFIDENCE SPREAD</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>0.98 (Zero Variance)</div>
                    <div style={{ fontSize: '10px', color: '#fca5a5' }}>Signal 1: Flatlining values</div>
                  </div>
                  <div style={{ background: '#060a12', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>REFUSAL RATE</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>0.0% (Zero Refusals)</div>
                    <div style={{ fontSize: '10px', color: '#fca5a5' }}>Signal 2: Always fills required fields</div>
                  </div>
                  <div style={{ background: '#060a12', padding: '10px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>SHANNON ENTROPY</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>{simulatedEntropy} bits</div>
                    <div style={{ fontSize: '10px', color: '#fca5a5' }}>Alarm tripped: Threshold &lt; 0.50</div>
                  </div>
                </Grid>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 7: PRODUCTION CODE & PLAYBOOK ─── */}
        {activeSubTab === 'playbook' && (
          <Stack gap={6}>
            {/* Python Code 1: OpenTelemetry GenAI Agent Spans */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#3A9B9F' }}>🐍 1. OpenTelemetry GenAI Agent Spans & Hard Loop Cap</h3>
              <p style={{ margin: '0 0 14px 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                Instrumenting vendor-neutral agent tracing using OpenTelemetry GenAI semantic conventions, catching non-progress loops after 3 retries.
              </p>
              <CodeBlock
                language="python"
                code={`from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode

tracer = trace.get_tracer("enterprise.agentops")

class AgentExecutionError(Exception):
    pass

def execute_agent_trajectory(user_prompt: str, max_identical_retries: int = 3):
    """
    Executes an autonomous agent with OpenTelemetry GenAI semantic spans
    and an automated Hard Loop Cap to prevent recursive token burning.
    """
    with tracer.start_as_current_span("invoke_agent") as agent_span:
        agent_span.set_attribute("gen_ai.agent.name", "billing_reconciler")
        agent_span.set_attribute("gen_ai.prompt", user_prompt)

        retry_history = []
        step_count = 0

        while step_count < 15:
            step_count += 1
            # Step A: Decide next tool call
            with tracer.start_as_current_span("plan") as plan_span:
                next_action = agent_brain.decide(user_prompt, history=retry_history)
                plan_span.set_attribute("gen_ai.plan.step", step_count)

            if next_action.is_complete:
                agent_span.set_status(Status(StatusCode.OK))
                return next_action.final_result

            # Step B: Check Hard Loop Cap
            tool_signature = f"{next_action.tool_name}:{str(next_action.tool_args)}"
            if retry_history.count(tool_signature) >= max_identical_retries:
                # Trip Hard Cap
                agent_span.set_status(Status(StatusCode.ERROR, "HARD_CAP_TRIPPED"))
                agent_span.set_attribute("agentops.abort_reason", "deterministic_tool_retry_storm")
                raise AgentExecutionError(
                    f"Aborted: {next_action.tool_name} failed {max_identical_retries} identical times."
                )

            # Step C: Execute tool with pre-action side effect validation
            with tracer.start_as_current_span("execute_tool") as tool_span:
                tool_span.set_attribute("gen_ai.tool.name", next_action.tool_name)
                if next_action.is_mutation:
                    # Pre-action security gate
                    validate_side_effect_permission(next_action)

                result = run_tool(next_action.tool_name, next_action.tool_args)
                tool_span.set_attribute("gen_ai.tool.result_status", "SUCCESS" if result.ok else "FAILED")
                retry_history.append(tool_signature)`}
              />
            </Card>

            {/* Python Code 2: Defensible Absence Schema */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#a855f7' }}>🛡️ 2. Defensible "Not in Document" Schema (AnswerWithAbsenceEvidence)</h3>
              <p style={{ margin: '0 0 14px 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                Structured Pydantic response enforcing the 4-brick evidence chain before permitting an absence refusal claim.
              </p>
              <CodeBlock
                language="python"
                code={`from pydantic import BaseModel, Field
from typing import List, Optional

class ParseCoverageAudit(BaseModel):
    total_pages: int
    pages_with_text: int
    ocr_dropouts: int
    extracted_lines_count: int

class ConceptVocabularyAudit(BaseModel):
    concept_name: str
    enumerated_synonyms: List[str]
    cluster_expansion_applied: bool

class DistractorPassage(BaseModel):
    page: int
    line: int
    snippet: str
    rejection_rationale: str

class AnswerWithAbsenceEvidence(BaseModel):
    verdict: str = Field(..., regex="^(ANSWERED|NOT_IN_THIS_DOCUMENT)$")
    parse_audit: ParseCoverageAudit
    concept_audit: List[ConceptVocabularyAudit]
    joint_hits_across_full_sweep: int
    closest_distractor: Optional[DistractorPassage] = None
    structured_justification: str

    @classmethod
    def create_absence_proof(cls, doc_tables, concept_lexicon, sweep_results):
        # Enforce all 4 bricks before returning
        assert doc_tables.ocr_dropouts == 0, "Cannot declare absence with unparsed OCR dropouts!"
        assert sweep_results.joint_hits == 0, "Cannot declare absence when co-occurrences exist!"
        return cls(...)`}
              />
            </Card>

            {/* Python Code 3: Layer 2 Pydantic Semantic & Cross-Field Validators */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0', color: '#3A9B9F' }}>🏗️ 3. Layer 2 Semantic & Cross-Field Pydantic Validators</h3>
              <p style={{ margin: '0 0 14px 0', color: 'var(--ds-color-text-secondary)', fontSize: '13px' }}>
                Catching cross-field contradictions, enum hallucinations, and distributional collapse beyond Layer 1 JSON syntax.
              </p>
              <CodeBlock
                language="python"
                code={`from datetime import date
from pydantic import BaseModel, model_validator, Field

class ContractMetadataRecord(BaseModel):
    # Layer 1: Schema (Types & Enums)
    start_date: date
    end_date: date
    priority: str = Field(..., regex="^(low|normal|high|urgent)$")
    sentiment: str = Field(..., regex="^(positive|neutral|negative)$")
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    source_citation_span: str  # Required exact offset to defeat phantom extractions

    # Layer 2: Semantic Cross-Field Validators
    @model_validator(mode="after")
    def validate_cross_field_semantics(self):
        # Rule 1: Temporal logic
        if self.end_date < self.start_date:
            raise ValueError(
                f"Cross-Field Contradiction: end_date ({self.end_date}) "
                f"cannot precede start_date ({self.start_date})"
            )

        # Rule 2: Sentiment-score concordance
        if self.sentiment == "positive" and self.confidence_score < 0.5:
            raise ValueError(
                f"Cross-Field Contradiction: positive sentiment cannot have "
                f"confidence score < 0.5 (got {self.confidence_score})"
            )

        return self`}
              />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
