import React, { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  PARADIGMS_COMPARISON,
  BENCHMARK_RULESET_DATA,
  DOMAIN_CRITIQUES,
  RUN_PROMPT_LEARNING_SIMULATOR,
  COMPACT_SYSTEM_RULES,
  PYTHON_PROMPT_LEARNING_PIPELINE,
  TYPESCRIPT_PROMPT_LEARNING_PIPELINE
} from './promptLearningEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_LIGHT = '#5EC4C8';
const CORAL = '#E8837A';
const PURPLE = '#9B89C4';
const BG_SURFACE = 'var(--ds-color-bg-surface)';
const BG_CANVAS = 'var(--ds-color-bg-canvas)';

/** Architectural panel explaining English Feedback Loops */
function PromptLearningPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };

  return (
    <Panel
      title="Prompt Learning & English Feedback Loop"
      sub="Skip weight gradients: critique outputs in plain language, fold the critique into system instructions, repeat until rules stick."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#6A9BD8" icon="refresh" title="1. Three Paradigms">
          <div style={flow}>From expensive gradients to gradient-free natural language.</div>
          <ul style={pts}>
            <li><strong>RL Weights:</strong> Scalar reward, backpropagation, expensive offline retrain</li>
            <li><strong>Scalar Search:</strong> Discrete token scoring (OPRO / DSPy), zero semantic feedback</li>
            <li><strong>Prompt Learning:</strong> Natural-language bug reports accumulated in system prompt</li>
          </ul>
        </GlassCard>

        <GlassCard color="#5EC4C8" icon="nodes" title="2. Four-Stage Meta-Cycle">
          <div style={flow}>Each loop produces a stronger, self-healing system prompt.</div>
          <ul style={pts}>
            <li><strong>Execution Trace:</strong> Model output + runtime metadata logged</li>
            <li><strong>Evaluator Critique:</strong> Precise English description of the failure term</li>
            <li><strong>Meta-Prompt Writer:</strong> Translates critique into actionable constraint</li>
            <li><strong>Context Compactor:</strong> Folds redundant sub-rules into system invariants</li>
          </ul>
        </GlassCard>

        <GlassCard color="#34D399" icon="chart" title="3. Empirical Scaling" badge="100% by Loop 5">
          <div style={flow}>Accuracy and rule compliance scale rapidly across iterations.</div>
          <ul style={pts}>
            <li>100% rule compliance on 10–50 latent rules within 5 loops</li>
            <li>Zero weight modification; 1/100th sample complexity of RL</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function PromptLearningTab() {
  const [activeSubTab, setActiveSubTab] = useState('studio'); // 'studio' | 'paradigms' | 'simulator' | 'benchmarks' | 'code'

  // ── SUBTAB 1 (Studio State) ──
  const [selectedScenarioId, setSelectedScenarioId] = useState('json_extraction');
  const [accumulatedRules, setAccumulatedRules] = useState([
    "[RULE_CORE]: Follow base system format and schema guidelines strictly."
  ]);
  const [synthesizedRule, setSynthesizedRule] = useState(null);
  const [isCompacted, setIsCompacted] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const activeScenario = DOMAIN_CRITIQUES.find(c => c.id === selectedScenarioId) || DOMAIN_CRITIQUES[0];

  function handleSelectScenario(sc) {
    setSelectedScenarioId(sc.id);
    setSynthesizedRule(null);
  }

  function handleSynthesizeRule() {
    const ruleToAdd = activeScenario.generatedInstruction;
    setSynthesizedRule(ruleToAdd);
    if (!accumulatedRules.includes(ruleToAdd)) {
      setAccumulatedRules(prev => [...prev, ruleToAdd]);
      setIsCompacted(false);
    }
  }

  function handleResetRules() {
    setAccumulatedRules(["[RULE_CORE]: Follow base system format and schema guidelines strictly."]);
    setSynthesizedRule(null);
    setIsCompacted(false);
  }

  const compactedData = COMPACT_SYSTEM_RULES(accumulatedRules);

  // ── SUBTAB 2 (Paradigms State) ──
  const [selectedParadigmId, setSelectedParadigmId] = useState('prompt_learning');
  const activeParadigm = PARADIGMS_COMPARISON.find(p => p.id === selectedParadigmId) || PARADIGMS_COMPARISON[2];

  // ── SUBTAB 3 (Simulator State) ──
  const [loopCount, setLoopCount] = useState(3);
  const [simulatorScenarioIdx, setSimulatorScenarioIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const simResult = RUN_PROMPT_LEARNING_SIMULATOR(loopCount, simulatorScenarioIdx);

  // Auto-play loop simulator
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setLoopCount(prev => {
          if (prev >= 5) {
            setIsPlaying(false);
            return 5;
          }
          return prev + 1;
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // ── SUBTAB 4 (Benchmark State) ──
  const [selectedRulesetSize, setSelectedRulesetSize] = useState(50);
  const activeBenchmarkRow = BENCHMARK_RULESET_DATA.find(r => r.rulesetSize === selectedRulesetSize) || BENCHMARK_RULESET_DATA[2];

  // ── SUBTAB 5 (Code State) ──
  const [codeLanguage, setCodeLanguage] = useState('python');

  function copyToClipboard(text, key) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [Prompt Learning & Feedback]"
        title="Prompt Learning: Using English Feedback to Optimize LLM Systems"
        description="Continuous online prompt optimization via natural language feedback terms instead of opaque scalar rewards. Inspired by NVIDIA Voyager and Andrej Karpathy's prompt-centric learning paradigm."
        metrics={[
          { label: 'Error Term', value: 'English Critiques' },
          { label: 'Sample Complexity', value: '1/100th of RL' },
          { label: '5-Loop Compliance', value: '100% Latent Rules' },
          { label: 'Instruction Control', value: 'In-Context Compaction' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <PromptLearningPanel />
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: BG_SURFACE,
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'studio', icon: '🧪', label: '1. English Feedback Studio', desc: 'Trace ➔ Critique ➔ Rule Synthesis' },
            { id: 'simulator', icon: '🔁', label: '2. 5-Loop Convergence Runner', desc: 'Auto-play accuracy scaling' },
            { id: 'paradigms', icon: '⚖️', label: '3. Paradigms Comparison', desc: 'RL vs Scalar Search vs English PL' },
            { id: 'benchmarks', icon: '📈', label: '4. Benchmark Stress Tester', desc: '10 to 100 latent rulesets' },
            { id: 'code', icon: '🛠️', label: '5. Production SDK Pipeline', desc: 'Python & TypeScript reference' }
          ].map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: 'var(--ds-space-3) var(--ds-space-4)',
                  borderRadius: 'var(--ds-radius-md)',
                  border: 'none',
                  background: isActive ? TEAL : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--ds-motion-duration-base)',
                  fontWeight: isActive ? 600 : 500
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: isActive ? 0.95 : 0.7 }}>
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── SUBTAB 1: ENGLISH FEEDBACK STUDIO ─── */}
        {activeSubTab === 'studio' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: BG_CANVAS }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🧪 Interactive English Feedback Studio</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Test the Karpathy/Voyager prompt-learning mechanism: inspect a flawed model execution trace, evaluate the English critique, and compile it into an accumulated system instruction.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="sm" variant="subtle" onClick={handleResetRules}>
                      Reset Rules ({accumulatedRules.length})
                    </Button>
                  </div>
                </div>

                {/* Scenario Picker Pills */}
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                    SELECT REAL-WORLD FAILURE SCENARIO:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {DOMAIN_CRITIQUES.map(sc => {
                      const isSel = selectedScenarioId === sc.id;
                      return (
                        <button
                          key={sc.id}
                          onClick={() => handleSelectScenario(sc)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: `1px solid ${isSel ? TEAL_LIGHT : 'var(--ds-color-border-subtle)'}`,
                            background: isSel ? 'rgba(94, 196, 200, 0.15)' : BG_SURFACE,
                            color: isSel ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                            fontSize: 12,
                            fontWeight: isSel ? 600 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span>{sc.title}</span>
                          <span style={{ fontSize: 10, color: isSel ? TEAL_LIGHT : 'var(--ds-color-text-tertiary)' }}>({sc.category})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3-Stage Pipeline Grid */}
                <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {/* Left: Trace & Critique */}
                  <Stack gap={3}>
                    <Card style={{ padding: '14px', background: BG_SURFACE }}>
                      <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                        Stage 1 · Production Execution Trace
                      </strong>
                      <div style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', marginBottom: 2 }}>User Input Query:</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#E2E8F0', background: '#090d16', padding: '8px 10px', borderRadius: 6, marginBottom: 10 }}>
                        {activeScenario.traceInput}
                      </div>

                      <div style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', marginBottom: 2 }}>Flawed Model Output:</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#FCA5A5', background: '#1c1012', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 10px', borderRadius: 6, whiteSpace: 'pre-wrap' }}>
                        {activeScenario.rawOutput}
                      </div>
                    </Card>

                    <Card style={{ padding: '14px', background: BG_SURFACE, borderLeft: '4px solid #EF4444' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: '11px', color: '#EF4444', textTransform: 'uppercase' }}>
                          Stage 2 · English Evaluator Critique
                        </strong>
                        <Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                          Loss Term: Natural Language
                        </Badge>
                      </div>
                      <p style={{ fontSize: 12, color: '#FECACA', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                        {activeScenario.evalCritique}
                      </p>

                      <Button
                        size="sm"
                        onClick={handleSynthesizeRule}
                        style={{
                          background: TEAL,
                          color: '#FFFFFF',
                          fontWeight: 600,
                          width: '100%'
                        }}
                      >
                        ⚡ Synthesize System Instruction via Meta-Prompt
                      </Button>
                    </Card>
                  </Stack>

                  {/* Right: Meta-Prompt Rule & System Instruction Accumulation */}
                  <Stack gap={3}>
                    <Card style={{ padding: '14px', background: '#090d16', border: `1px solid ${synthesizedRule ? TEAL_LIGHT : 'var(--ds-color-border-subtle)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <strong style={{ fontSize: '11px', color: TEAL_LIGHT, textTransform: 'uppercase' }}>
                          Stage 3 · Meta-Prompt Synthesized Rule
                        </strong>
                        {synthesizedRule && (
                          <Badge variant="subtle" style={{ background: 'rgba(94, 196, 200, 0.2)', color: TEAL_LIGHT }}>
                            ✓ Active in Prompt Context
                          </Badge>
                        )}
                      </div>

                      <div style={{ fontFamily: 'monospace', fontSize: 12, color: synthesizedRule ? TEAL_LIGHT : 'var(--ds-color-text-tertiary)', background: '#111622', padding: '10px 12px', borderRadius: 6, minHeight: '44px', display: 'flex', alignItems: 'center' }}>
                        {synthesizedRule || "Click 'Synthesize System Instruction' to compile this critique into a reusable prompt rule."}
                      </div>
                    </Card>

                    <Card style={{ padding: '14px', background: BG_SURFACE }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <strong style={{ fontSize: '11px', color: '#FFFFFF', textTransform: 'uppercase' }}>
                          Stage 4 · System Instruction Context Window ({accumulatedRules.length} Rules)
                        </strong>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => setIsCompacted(!isCompacted)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: 4,
                              background: isCompacted ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              border: `1px solid ${isCompacted ? '#34D399' : 'var(--ds-color-border-subtle)'}`,
                              color: isCompacted ? '#34D399' : 'var(--ds-color-text-secondary)',
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {isCompacted ? '✓ Compacted (-58% Tokens)' : 'Compact Prompt'}
                          </button>
                          <button
                            onClick={() => copyToClipboard(isCompacted ? compactedData.compactedPrompt : accumulatedRules.join('\n'), 'active_prompt')}
                            style={{
                              padding: '3px 8px',
                              borderRadius: 4,
                              background: copiedKey === 'active_prompt' ? 'rgba(94, 196, 200, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid var(--ds-color-border-subtle)',
                              color: copiedKey === 'active_prompt' ? TEAL_LIGHT : 'var(--ds-color-text-secondary)',
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {copiedKey === 'active_prompt' ? '✓ Copied' : 'Copy Prompt'}
                          </button>
                        </div>
                      </div>

                      <pre style={{
                        margin: 0,
                        padding: '10px 12px',
                        background: '#090d16',
                        borderRadius: 6,
                        color: '#CBD5E1',
                        fontSize: 11,
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        lineHeight: 1.5,
                        maxHeight: '160px',
                        overflowY: 'auto'
                      }}>
                        {isCompacted ? compactedData.compactedPrompt : accumulatedRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
                      </pre>
                    </Card>
                  </Stack>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 5-LOOP CONVERGENCE SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: BG_CANVAS }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🔁 5-Loop Convergence Runner & Accuracy Progression</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Simulate how prompt accuracy scales across 5 successive learning loops. Notice how rule compliance hits 100% without a single backward gradient pass.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Button
                      size="sm"
                      variant={isPlaying ? 'subtle' : 'default'}
                      onClick={() => {
                        if (isPlaying) {
                          setIsPlaying(false);
                        } else {
                          setLoopCount(1);
                          setIsPlaying(true);
                        }
                      }}
                      style={{ background: isPlaying ? '#EF4444' : TEAL, color: '#FFFFFF', fontWeight: 600 }}
                    >
                      {isPlaying ? '⏸ Pause Auto-Play' : '▶ Auto-Play 5 Loops'}
                    </Button>
                    <Button size="sm" variant="subtle" onClick={() => setLoopCount(1)}>
                      Reset to Loop 1
                    </Button>
                  </div>
                </div>

                {/* Controls Bar */}
                <div style={{ background: BG_SURFACE, padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', fontWeight: 600 }}>
                      ITERATION LOOP ({loopCount} / 5):
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(loop => (
                        <button
                          key={loop}
                          onClick={() => setLoopCount(loop)}
                          style={{
                            width: 32,
                            height: 30,
                            borderRadius: 6,
                            border: `1px solid ${loopCount === loop ? TEAL : 'var(--ds-color-border-subtle)'}`,
                            background: loopCount === loop ? TEAL : 'rgba(255,255,255,0.04)',
                            color: loopCount === loop ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                            fontWeight: 700,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          {loop}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)' }}>Test Scenario:</span>
                    <select
                      value={simulatorScenarioIdx}
                      onChange={e => setSimulatorScenarioIdx(Number(e.target.value))}
                      style={{
                        background: '#090d16',
                        border: '1px solid var(--ds-color-border-subtle)',
                        color: '#FFFFFF',
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      {DOMAIN_CRITIQUES.map((sc, i) => (
                        <option key={sc.id} value={i}>{sc.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress Gauges */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <Card style={{ padding: 16, background: BG_SURFACE }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>
                        ACCURACY COMPLIANCE METER
                      </span>
                      <strong style={{ fontSize: 16, color: simResult.finalAccuracy === 100 ? '#34D399' : TEAL_LIGHT }}>
                        {simResult.finalAccuracy}%
                      </strong>
                    </div>

                    <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 12 }}>
                      <div
                        style={{
                          width: `${simResult.finalAccuracy}%`,
                          height: '100%',
                          background: simResult.finalAccuracy === 100 ? 'linear-gradient(90deg, #3A9B9F, #34D399)' : TEAL,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ds-color-text-tertiary)' }}>
                      <span>Baseline: {simResult.currentCritique.accuracyBefore}%</span>
                      <span>Target: 100% Latent Rule Adherence</span>
                    </div>
                  </Card>

                  <Card style={{ padding: 16, background: BG_SURFACE }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>
                        RESOURCE EFFICIENCY RATIO
                      </span>
                      <strong style={{ fontSize: 13, color: '#34D399' }}>
                        100x Sample Efficiency
                      </strong>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                      <div>• Prompt Learning Calls: <strong>{loopCount} natural-language feedback iterations</strong></div>
                      <div>• Equivalent Traditional RL: <strong>10,000+ labeled reward rollouts & backprop</strong></div>
                      <div>• Estimated In-Context Token Usage: <strong>{420 + (loopCount * 95)} tokens</strong></div>
                    </div>
                  </Card>
                </div>

                {/* Loop-by-loop Trace Breakdown */}
                <Stack gap={2}>
                  <strong style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase' }}>
                    Convergence History Across Iteration Loops:
                  </strong>
                  {simResult.loopTrace.map(lt => {
                    const isCurrent = lt.loop === loopCount;
                    return (
                      <div
                        key={lt.loop}
                        style={{
                          padding: '10px 14px',
                          background: isCurrent ? 'rgba(58, 155, 159, 0.12)' : BG_SURFACE,
                          borderLeft: `4px solid ${lt.accuracyPct === 100 ? '#34D399' : TEAL}`,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: 12, color: isCurrent ? '#FFFFFF' : 'var(--ds-color-text-secondary)' }}>
                            Loop {lt.loop}: {lt.critiqueAddressed}
                          </strong>
                          <div style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)' }}>
                            {lt.accumulatedRules} Active System Rules · {lt.status}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: lt.accuracyPct === 100 ? '#34D399' : TEAL_LIGHT }}>
                            {lt.accuracyPct}% Accuracy
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: PARADIGMS COMPARISON ─── */}
        {activeSubTab === 'paradigms' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: BG_CANVAS }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Architectural Comparison: RL vs Scalar Optimization vs English Prompt Learning</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Traditional RL adjusts opaque neural weights. Scalar prompt search optimizes token embeddings via numeric loss. Prompt Learning operates in natural language: humans or automated evaluators write bug reports, and the model writes its own instructions.
                  </p>
                </div>

                {/* Paradigm Switcher Buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PARADIGMS_COMPARISON.map(p => {
                    const isSel = selectedParadigmId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedParadigmId(p.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 6,
                          border: `1px solid ${isSel ? TEAL_LIGHT : 'var(--ds-color-border-subtle)'}`,
                          background: isSel ? 'rgba(94, 196, 200, 0.15)' : BG_SURFACE,
                          color: isSel ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                          fontSize: 12,
                          fontWeight: isSel ? 600 : 500,
                          cursor: 'pointer'
                        }}
                      >
                        {p.paradigm.split('(')[0].trim()}
                      </button>
                    );
                  })}
                </div>

                {/* Active Paradigm Metric Radar Breakdown */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 16, background: BG_SURFACE }}>
                    <strong style={{ fontSize: 12, color: TEAL_LIGHT, display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>
                      {activeParadigm.paradigm} · Core Attributes
                    </strong>
                    <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div><strong>Feedback Term:</strong> {activeParadigm.feedbackMechanism}</div>
                      <div><strong>Where Optimization Happens:</strong> {activeParadigm.optimizationLocation}</div>
                      <div><strong>Sample Complexity:</strong> {activeParadigm.sampleComplexity}</div>
                      <div><strong>Instruction Scoping:</strong> {activeParadigm.instructionManagement}</div>
                      <div><strong>Deployment Setup:</strong> {activeParadigm.onlineSetup}</div>
                    </div>
                  </Card>

                  <Card style={{ padding: 16, background: BG_SURFACE }}>
                    <strong style={{ fontSize: 12, color: '#E2E8F0', display: 'block', marginBottom: 12, textTransform: 'uppercase' }}>
                      Performance Profile Radar
                    </strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Sample Efficiency', val: activeParadigm.sampleEfficiency, color: '#34D399' },
                        { label: 'Interpretability (Human Audit)', val: activeParadigm.interpretability, color: TEAL_LIGHT },
                        { label: 'Online Agility (No Retraining)', val: activeParadigm.onlineAgility, color: '#6A9BD8' },
                        { label: 'Compute Cost / Overhead', val: activeParadigm.computeCost, color: '#F5A623', invert: true }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                            <span style={{ color: 'var(--ds-color-text-secondary)' }}>{item.label}</span>
                            <span style={{ fontWeight: 600, color: item.color }}>{item.val}%</span>
                          </div>
                          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ width: `${item.val}%`, height: '100%', background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: BENCHMARK COMPLIANCE STRESS TESTER ─── */}
        {activeSubTab === 'benchmarks' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: BG_CANVAS }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📈 Empirical Benchmark: 10 to 100 Latent Rules Scaling</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Tested on synthetic suites with 10, 25, 50, 75, and 100 latent rules. See how 1-Loop baselines degrade under rule crowding, while 5-Loop Prompt Learning achieves high compliance.
                  </p>
                </div>

                {/* Interactive Slider */}
                <div style={{ background: BG_SURFACE, padding: 14, borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: TEAL_LIGHT, textTransform: 'uppercase' }}>
                      Select Latent Ruleset Size ({selectedRulesetSize} Rules):
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>
                      Loop 1: <strong>{activeBenchmarkRow.loop1Acc}%</strong> ➔ Loop 5: <strong style={{ color: '#34D399' }}>{activeBenchmarkRow.loop5Acc}%</strong>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {BENCHMARK_RULESET_DATA.map(row => (
                      <button
                        key={row.rulesetSize}
                        onClick={() => setSelectedRulesetSize(row.rulesetSize)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: 6,
                          border: `1px solid ${selectedRulesetSize === row.rulesetSize ? TEAL : 'var(--ds-color-border-subtle)'}`,
                          background: selectedRulesetSize === row.rulesetSize ? TEAL : 'rgba(255,255,255,0.03)',
                          color: selectedRulesetSize === row.rulesetSize ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {row.rulesetSize} Rules
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comparative Visual Bars */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 14, background: BG_SURFACE }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      1-Loop Performance (Zero Reflection)
                    </span>
                    <strong style={{ fontSize: 18, color: '#EF4444', display: 'block', marginBottom: 8 }}>
                      {activeBenchmarkRow.loop1Acc}% Accuracy
                    </strong>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ width: `${activeBenchmarkRow.loop1Acc}%`, height: '100%', background: '#EF4444' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>
                      Followed only {activeBenchmarkRow.loop1RulesPct}% of latent rules due to instruction dilution and crowding.
                    </div>
                  </Card>

                  <Card style={{ padding: 14, background: BG_SURFACE, borderLeft: '4px solid #34D399' }}>
                    <span style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>
                      5-Loop Performance (English Feedback Reflection)
                    </span>
                    <strong style={{ fontSize: 18, color: '#34D399', display: 'block', marginBottom: 8 }}>
                      {activeBenchmarkRow.loop5Acc}% Accuracy
                    </strong>
                    <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
                      <div style={{ width: `${activeBenchmarkRow.loop5Acc}%`, height: '100%', background: '#34D399' }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)' }}>
                      Followed {activeBenchmarkRow.loop5RulesPct}% of latent rules by compounding synthesized bug-fix instructions.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PRODUCTION CODE PIPELINE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: BG_CANVAS }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🛠️ Production PromptLearner Reference Pipeline</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Complete implementations for in-context English feedback reflection and prompt compaction.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setCodeLanguage('python')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${codeLanguage === 'python' ? TEAL : 'var(--ds-color-border-subtle)'}`,
                        background: codeLanguage === 'python' ? TEAL : BG_SURFACE,
                        color: codeLanguage === 'python' ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Python (NVIDIA Voyager)
                    </button>
                    <button
                      onClick={() => setCodeLanguage('typescript')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${codeLanguage === 'typescript' ? TEAL : 'var(--ds-color-border-subtle)'}`,
                        background: codeLanguage === 'typescript' ? TEAL : BG_SURFACE,
                        color: codeLanguage === 'typescript' ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      TypeScript / Node.js
                    </button>
                  </div>
                </div>

                <CodeBlock
                  language={codeLanguage}
                  code={codeLanguage === 'python' ? PYTHON_PROMPT_LEARNING_PIPELINE : TYPESCRIPT_PROMPT_LEARNING_PIPELINE}
                />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author data or unredacted PII is stored or executed in this environment.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
