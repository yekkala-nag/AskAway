import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { GsmSymbolicPanel } from '../components/ui/CleanInfographics.jsx';
import {
  GSM_SYMBOLIC_MUTATIONS,
  GSM_NOOP_DISTRACTORS,
  SOTA_REASONING_LEADERBOARD,
  NEURO_SYMBOLIC_CODE_SOLUTIONS
} from './reasoningEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function ReasoningBenchTab() {
  const [activeSubTab, setActiveSubTab] = useState('symbolic'); // 'symbolic' | 'noop' | 'leaderboard' | 'solutions'
  const [selectedMutationId, setSelectedMutationId] = useState('oliver_apples');
  const [satVal, setSatVal] = useState(44);
  const [sunVal, setSunVal] = useState(28);
  const [eatenVal, setEatenVal] = useState(15);
  const [priceVal, setPriceVal] = useState(2);

  const [selectedNoopId, setSelectedNoopId] = useState('noop_apples');
  const [includeNoise, setIncludeNoise] = useState(true);

  const activeMutation = GSM_SYMBOLIC_MUTATIONS.find(m => m.id === selectedMutationId) || GSM_SYMBOLIC_MUTATIONS[0];
  const activeNoop = GSM_NOOP_DISTRACTORS.find(n => n.id === selectedNoopId) || GSM_NOOP_DISTRACTORS[0];

  // Dynamic formula calculation
  const calculatedAnswer = (satVal + sunVal - eatenVal) * priceVal;

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Apple Research Lab]"
        title="Rethinking LLM Benchmarks: Measuring True Reasoning Beyond Training Data"
        description="Are models like GPT-4o, Claude 3.5, and Llama 3 genuine abstract reasoners or sophisticated statistical pattern matchers? Based on Apple's landmark GSM-Symbolic research study (Mirzadeh et al., 2024 / Maxime Jabarian TDS analysis)."
        metrics={[
          { label: 'Benchmark Suite', value: 'GSM-Symbolic' },
          { label: 'Noise Sensitivity', value: 'GSM-NoOp Test' },
          { label: 'Accuracy Drop', value: 'Up to 65% Noise Collapse' },
          { label: 'Solution Engine', value: 'Neuro-Symbolic & Code' }
        ]}
      />

      <Container size="wide">
        {/* NATIVE GLASS RECREATION */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <GsmSymbolicPanel />
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
            { id: 'symbolic', icon: '🔀', label: '1. Symbolic Mutation Sandbox', desc: 'Mutate numbers & entities interactively' },
            { id: 'noop', icon: '🚫', label: '2. GSM-NoOp Noise Lab', desc: 'Observe distractor noise accuracy collapse' },
            { id: 'leaderboard', icon: '📊', label: '3. SOTA Model Leaderboard', desc: 'Compare GPT-4o, Claude, Llama & Gemma' },
            { id: 'solutions', icon: '🐍', label: '4. Neuro-Symbolic & Code Lab', desc: 'Code interpreter & noise filtering' }
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

        {/* ─── SUBTAB 1: SYMBOLIC MUTATION SANDBOX ─── */}
        {activeSubTab === 'symbolic' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔀 GSM-Symbolic Variable Mutation Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Apple generated dynamic problem variations by mutating numbers and entity names across symbolic templates. True reasoning models produce 100% stable outputs; autoregressive LLMs show high variance.
                  </p>
                </div>

                {/* DYNAMIC VARIABLE MUTATION SLIDERS */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Mutate Problem Symbolic Variables:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Saturday Pick ({satVal} apples):
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="150"
                          value={satVal}
                          onChange={(e) => setSatVal(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Sunday Pick ({sunVal} apples):
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="150"
                          value={sunVal}
                          onChange={(e) => setSunVal(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Apples Eaten ({eatenVal} apples):
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={eatenVal}
                          onChange={(e) => setEatenVal(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Price per Apple (${priceVal}):
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="20"
                          value={priceVal}
                          onChange={(e) => setPriceVal(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </Grid>

                    {/* DYNAMIC GENERATED PROMPT */}
                    <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>MUTATED SYMBOLIC PROMPT:</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '4px', fontWeight: 'bold' }}>
                        "Oliver picks {satVal} apples on Saturday and {sunVal} apples on Sunday. He eats {eatenVal} apples and sells the rest at ${priceVal} each. How much money did Oliver make?"
                      </div>
                      <div style={{ marginTop: '8px', fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontFamily: 'var(--ds-font-family-mono)' }}>
                        Deterministic Ground Truth Equation: ({satVal} + {sunVal} - {eatenVal}) * ${priceVal} = <strong>${calculatedAnswer}</strong>
                      </div>
                    </Card>
                  </Stack>
                </Card>

                {/* SOTA MODEL VARIANCE COMPARISON */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {activeMutation.llmBehaviors.map((beh, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${beh.status.includes('FAIL') ? '#ef4444' : '#5EC4C8'}` }}>
                      <Flex align="center" justify="space-between">
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{beh.model}</strong>
                        <Badge variant={beh.status.includes('FAIL') ? 'danger' : 'success'} size="sm">{beh.status}</Badge>
                      </Flex>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '8px', marginBottom: 0 }}>
                        {beh.output}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>
                        Symbolic Accuracy: {beh.accuracy}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: GSM-NOOP NOISE LAB ─── */}
        {activeSubTab === 'noop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚫 GSM-NoOp Irrelevant Noise Injection Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Apple introduced "GSM-NoOp" by injecting semantically irrelevant distractor clauses. Autoregressive LLMs suffered performance drops up to 65% because transformers lack abstract reasoning noise filters.
                  </p>
                </div>

                <Flex gap={3} align="center">
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Simulate Distractor Noise:</span>
                  <Button
                    variant={includeNoise ? 'danger' : 'subtle'}
                    size="sm"
                    onClick={() => setIncludeNoise(!includeNoise)}
                  >
                    {includeNoise ? '🚫 Distractor Noise INJECTED' : '✅ Clean Prompt (No Noise)'}
                  </Button>
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>CURRENT EVALUATION PROMPT:</strong>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '6px', lineHeight: 1.5 }}>
                      {includeNoise ? activeNoop.noopPrompt : activeNoop.cleanPrompt}
                    </div>
                    {includeNoise && (
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px', borderRadius: 'var(--ds-radius-sm)', marginTop: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                        Injected Noise: "{activeNoop.distractorClause}"
                      </div>
                    )}
                  </Card>

                  <Card style={{ padding: '14px', background: includeNoise ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', border: `1px solid ${includeNoise ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: includeNoise ? '#ef4444' : '#5EC4C8' }}>
                      {includeNoise ? '🔴 LLM Distractor Collapse Output:' : '🟢 Clean LLM Reasoning Output:'}
                    </strong>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', marginTop: '6px', color: 'var(--ds-color-text-primary)' }}>
                      {includeNoise ? activeNoop.llmErrorOutput : `Equation: ${activeNoop.cleanEquation} ➔ Correct Output: ${activeNoop.cleanAnswer}`}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>
                      {includeNoise ? activeNoop.llmErrorAnalysis : "Human-like reasoning correctly isolates relevant variables."}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: SOTA MODEL LEADERBOARD ─── */}
        {activeSubTab === 'leaderboard' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 SOTA Model Benchmark Leaderboard & Degradation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Empirical performance comparison across frontier models on Standard GSM8K vs GSM-Symbolic vs GSM-NoOp.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                          <th style={{ padding: '10px' }}>Model</th>
                          <th style={{ padding: '10px' }}>Standard GSM8K Score</th>
                          <th style={{ padding: '10px' }}>GSM-Symbolic Mean</th>
                          <th style={{ padding: '10px' }}>GSM-NoOp Accuracy</th>
                          <th style={{ padding: '10px' }}>Noise Performance Drop</th>
                          <th style={{ padding: '10px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SOTA_REASONING_LEADERBOARD.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.model}</td>
                            <td style={{ padding: '10px' }}>
                              <Badge variant="info" size="sm">{row.standardGSM8K}</Badge>
                            </td>
                            <td style={{ padding: '10px' }}>
                              {row.symbolicMean} <span style={{ color: 'var(--ds-color-text-tertiary)' }}>({row.symbolicStdDev})</span>
                            </td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: row.noopAccuracy.startsWith('2') || row.noopAccuracy.startsWith('4') ? '#ef4444' : '#f59e0b' }}>
                              {row.noopAccuracy}
                            </td>
                            <td style={{ padding: '10px', color: '#ef4444', fontWeight: 'bold' }}>
                              {row.noopDrop}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <Badge variant={row.status.includes('Collapse') ? 'danger' : row.status.includes('Best') ? 'success' : 'warning'} size="sm">
                                {row.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: NEURO-SYMBOLIC & CODE LAB ─── */}
        {activeSubTab === 'solutions' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Neuro-Symbolic & Code Interpreter Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copyable production Python implementation combining semantic noise filtering and Python code sandbox execution for 100% mathematical precision.
                  </p>
                </div>

                <CodeBlock language="python" code={NEURO_SYMBOLIC_CODE_SOLUTIONS} />

                <Callout type="success">
                  <strong>Key Takeaway for AI Engineers:</strong> Don't rely solely on autoregressive token generation for multi-step math or logic problems in production. Combine LLMs with deterministic execution sandboxes (Python code execution, symbolic solvers) to eliminate pattern-matching drift.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
