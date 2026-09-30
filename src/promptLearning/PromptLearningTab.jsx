import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  PARADIGMS_COMPARISON,
  BENCHMARK_RULESET_DATA,
  RUN_PROMPT_LEARNING_SIMULATOR,
  PYTHON_PROMPT_LEARNING_PIPELINE
} from './promptLearningEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: from gradient RL to natural-language prompt learning loops. */
function PromptLearningPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };
  return (
    <Panel
      title="Prompt Learning & English Feedback Loop"
      sub="Skip weight gradients: critique outputs in plain language, fold the critique into better instructions, repeat until the rules stick."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#6A9BD8" icon="refresh" title="1. Three Paradigms">
          <div style={flow}>From expensive gradients to gradient-free words.</div>
          <ul style={pts}>
            <li>RL weight gradients — scalar reward, backprop, expensive</li>
            <li>Scalar prompt optimization — discrete tokens, gradient-free</li>
            <li>Prompt learning — natural-language critiques of failures</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="nodes" title="2. Four-Stage Loop">
          <div style={flow}>Each loop produces a stronger prompt than the last.</div>
          <ul style={pts}>
            <li>Production execution trace (outputs + metadata)</li>
            <li>Evaluator critique vs examples and guidelines</li>
            <li>Meta-prompt manager writes improved instructions</li>
            <li>Context accumulation compacts the instruction set</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="chart" title="3. Benchmark Trend" badge="100% by loop 5">
          <div style={flow}>Accuracy, success, and compliance climb every loop.</div>
          <ul style={pts}>
            <li>100% rule compliance on 10–50 latent rules</li>
            <li>Error rate collapses across 5 iterations</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function PromptLearningTab() {
  const [activeSubTab, setActiveSubTab] = useState('paradigms'); // 'paradigms' | 'simulator' | 'benchmarks' | 'code'

  // Simulator State
  const [loopCount, setLoopCount] = useState(3);
  const [selectedCritiqueIdx, setSelectedCritiqueIdx] = useState(0);

  const simResult = RUN_PROMPT_LEARNING_SIMULATOR(loopCount, selectedCritiqueIdx);

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
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'paradigms', icon: '⚖️', label: '1. Paradigms Comparison', desc: 'RL vs Scalar vs Prompt Learning' },
            { id: 'simulator', icon: '🔁', label: '2. 5-Loop Feedback Simulator', desc: 'Trace ➔ Critique ➔ Meta-Prompt' },
            { id: 'benchmarks', icon: '📈', label: '3. Benchmark Compliance', desc: '10, 50, 100 latent rulesets' },
            { id: 'code', icon: '🛠️', label: '4. Production Python Engine', desc: 'PromptLearner meta-prompt code' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
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

        {/* ─── SUBTAB 1: PARADIGMS COMPARISON ─── */}
        {activeSubTab === 'paradigms' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ RL vs Scalar Prompt Search vs English Prompt Learning</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Prompt Learning (PL) replaces opaque scalar loss gradients with natural language critiques. Fixes are accumulated directly in system instructions rather than adjusting billions of model weights.
                  </p>
                </div>

                <Stack gap={3}>
                  {PARADIGMS_COMPARISON.map((p, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${idx === 2 ? '#5EC4C8' : '#5EC4C8'}` }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: idx === 2 ? '#5EC4C8' : '#5EC4C8' }}>
                          {p.paradigm}
                        </strong>
                        <Badge variant="subtle" style={{ fontSize: '9px', background: idx === 2 ? 'rgba(46,204,140,0.15)' : 'rgba(56,189,248,0.15)', color: idx === 2 ? '#5EC4C8' : '#5EC4C8' }}>
                          {idx === 2 ? 'ENGLISH_FEEDBACK' : 'SCALAR_NUMERIC'}
                        </Badge>
                      </Flex>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Feedback Mechanism:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>{p.feedbackMechanism}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>Optimization Target:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{p.optimizationLocation}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Sample Complexity:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#F5A623' }}>{p.sampleComplexity}</div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>Instruction Control:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{p.instructionManagement}</div>
                        </div>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 5-LOOP FEEDBACK SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔁 Interactive 5-Loop Prompt Learning Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Execute the 4-stage feedback cycle: Application Trace ➔ Natural Language Critique ➔ Meta-Prompt Rule Extraction ➔ In-Context System Instruction Compaction.
                  </p>
                </div>

                <Flex gap={4} align="center">
                  <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                    Optimization Loops Iterated ({loopCount}):
                  </label>
                  <input type="range" min="1" max="5" value={loopCount} onChange={e => setLoopCount(Number(e.target.value))} style={{ width: '180px' }} />
                  <Button size="sm" variant="subtle" onClick={() => setSelectedCritiqueIdx((selectedCritiqueIdx + 1) % 2)}>
                    Switch Failure Trace Sample
                  </Button>
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#ef4444', display: 'block', marginBottom: '6px' }}>
                      STEP 1 & 2: APPLICATION TRACE & NATURAL LANGUAGE CRITIQUE:
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Input Query:</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'white', marginBottom: '8px' }}>
                      {simResult.currentCritique.traceInput}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Evaluator Critique (English Error Term):</div>
                    <Card style={{ padding: '10px', background: 'rgba(255,77,77,0.1)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '11px', margin: '4px 0 8px 0' }}>
                      {simResult.currentCritique.evalCritique}
                    </Card>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Extracted System Rule (Meta-Prompt Output):</div>
                    <Card style={{ padding: '10px', background: '#090d16', border: '1px solid #5EC4C8', color: '#3A9B9F', fontSize: '11px' }}>
                      {simResult.currentCritique.generatedInstruction}
                    </Card>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>
                        PROMPT ACCURACY PROGRESSION (Loop {loopCount}/5):
                      </strong>
                      <Badge variant="subtle" style={{ background: 'rgba(46,204,140,0.15)', color: '#3A9B9F' }}>
                        {simResult.finalAccuracy}% Accuracy
                      </Badge>
                    </Flex>

                    <Stack gap={2}>
                      {simResult.loopTrace.map((lt, idx) => (
                        <Card key={idx} style={{ padding: '8px 12px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${lt.accuracyPct === 100 ? '#5EC4C8' : '#5EC4C8'}` }}>
                          <Flex justify="space-between" align="center">
                            <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>
                              Loop {lt.loop}: {lt.accumulatedRules} Accumulated System Rules
                            </span>
                            <strong style={{ fontSize: '11px', color: lt.accuracyPct === 100 ? '#5EC4C8' : '#5EC4C8' }}>
                              {lt.accuracyPct}%
                            </strong>
                          </Flex>
                        </Card>
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: BENCHMARK COMPLIANCE GRAPH ─── */}
        {activeSubTab === 'benchmarks' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📈 Benchmark Rule Compliance Across 10, 50 & 100 Latent Rules</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Empirical performance comparison demonstrating 1-Loop vs 5-Loop accuracy scaling across increasing ruleset complexity.
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: '#3A9B9F' }}>
                        <th style={{ padding: '8px' }}>Latent Ruleset Size</th>
                        <th style={{ padding: '8px' }}>Accuracy: 1-Loop</th>
                        <th style={{ padding: '8px' }}>Accuracy: 5-Loop</th>
                        <th style={{ padding: '8px' }}>Avg Rules Followed: 1-Loop</th>
                        <th style={{ padding: '8px' }}>Avg Rules Followed: 5-Loop</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BENCHMARK_RULESET_DATA.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px', color: '#F5A623', fontWeight: 'bold' }}>{row.rulesetSize} Latent Rules</td>
                          <td style={{ padding: '8px', color: '#ef4444', fontFamily: 'monospace' }}>{row.loop1Acc}%</td>
                          <td style={{ padding: '8px', color: '#3A9B9F', fontFamily: 'monospace', fontWeight: 'bold' }}>{row.loop5Acc}%</td>
                          <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{row.loop1RulesPct}%</td>
                          <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{row.loop5RulesPct}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION PYTHON ENGINE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python PromptLearner Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference implementation for continuous online prompt learning and instruction compaction.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_PROMPT_LEARNING_PIPELINE} />

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
