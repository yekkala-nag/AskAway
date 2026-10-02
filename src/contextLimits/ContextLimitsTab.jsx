import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  BAPO_THEORY_STEPS,
  BAPO_TASK_TAXONOMY,
  SIMULATE_VARIABLE_TRACKING,
  PYTHON_WORKING_MEMORY_CODE
} from './contextLimitsEngine.js';
import ZoomableImage from '../components/ui/ZoomableImage.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: giant windows, tiny working memory, and the fixes. */
function BapoPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  return (
    <Panel
      title="Working Memory Bottlenecks vs 1M+ Context Windows"
      sub="A million-token window with a handful of working variables: hard tasks decay to guessing unless engineered around."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#5EC4C8" icon="file" title="1. Input & Capacity">
          <ul style={pts}>
            <li>1M+ token context window in</li>
            <li>Effective working memory: N variables (roughly 5–10)</li>
          </ul>
        </GlassCard>
        <GlassCard color="#6A9BD8" icon="cpu" title="2. Two Bandwidths">
          <ul style={pts}>
            <li>Prefix bandwidth “a” — forward embedding compression</li>
            <li>Attention bandwidth “b” — backward token lookup</li>
            <li>Constraint: b ≤ min(N, a)</li>
          </ul>
        </GlassCard>
        <GlassCard color="#E8836A" icon="chart" title="3. Hard Tasks Decay" badge="→ 50% baseline">
          <ul style={pts}>
            <li>Variable tracking, graph reachability, majority aggregation</li>
            <li>Accuracy slides to random-guessing baseline</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="wrench" title="4. Engineering Fixes">
          <ul style={pts}>
            <li>Test-time reasoning tokens — deliberate longer</li>
            <li>Tool outsourcing — compute outside the window</li>
            <li>Context compactness — compress inputs to fit</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function ContextLimitsTab() {
  const [activeSubTab, setActiveSubTab] = useState('theory'); // 'theory' | 'tracking' | 'taxonomy' | 'code'
  const [numVarsInput, setNumVarsInput] = useState(8);
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);

  const trackingResult = SIMULATE_VARIABLE_TRACKING(numVarsInput);
  const activeTask = BAPO_TASK_TAXONOMY[selectedTaskIdx];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="context_memory"
        moduleLabel="Context & Memory Engineering [Microsoft Research]"
        title="Your 1M+ Context Window LLM Is Less Powerful Than You Think"
        description="A Microsoft Research framework introducing the Bounded Attention Prefix Oracle (BAPO) model. Discover why effective LLM working memory collapses long before hitting 1M-2M token context window limits, and how to fix it."
        metrics={[
          { label: 'Raw Context', value: '1M – 2M Tokens' },
          { label: 'Working Memory', value: 'N = 5 to 10 Vars' },
          { label: 'Theoretical Model', value: 'BAPO (a, b)' },
          { label: 'Hard Tasks', value: 'Decays to 50%' }
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
            { id: 'theory', icon: '🧠', label: '1. Working Memory Theory', desc: 'BAPO model & capacity bottlenecks' },
            { id: 'tracking', icon: '📉', label: '2. Variable Tracking & Decay Lab', desc: '50% random guessing simulator' },
            { id: 'taxonomy', icon: '🔍', label: '3. BAPO Task Taxonomy Engine', desc: 'BAPO-Hard vs BAPO-Easy evaluator' },
            { id: 'code', icon: '🛠️', label: '4. Engineering Solutions & Code', desc: 'Python tool outsourcing & reasoning' }
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

        {/* ─── SUBTAB 1: THEORY ─── */}
        {activeSubTab === 'theory' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧠 Working Memory Capacity vs. 1M+ Context Windows</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Having a 1M-2M token context window does NOT mean an LLM can reason over 1M tokens of active variables. Microsoft Research's <strong>BAPO model</strong> proves that effective working memory is severely limited (N = 5 to 10 variables), causing LLMs to fail on complex reasoning tasks long before context limits are reached.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {BAPO_THEORY_STEPS.map(step => (
                    <Card key={step.step} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                        Step {step.step}: {step.title}
                      </strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '6px 0 0 0' }}>
                        {step.description}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: VARIABLE TRACKING SIMULATOR ─── */}
        {activeSubTab === 'tracking' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📉 Variable Tracking & Accuracy Collapse Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Test how LLMs resolve variable assignment chains ($x_6 = 'a', x_4 = 'b', x_0 = x_6, x_7 = x_3$). As the number of active variables $N$ increases beyond 5-10, accuracy rapidly collapses to a 50% random guessing baseline.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                        Number of Active Variables to Track (N = {numVarsInput}):
                      </label>
                      <input type="range" min="3" max="20" value={numVarsInput} onChange={e => setNumVarsInput(Number(e.target.value))} style={{ width: '100%' }} />
                    </div>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                      <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>GENERATED CODE SNIPPET (N = {numVarsInput}):</strong>
                        <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: '4px', marginTop: '8px', fontFamily: 'monospace', fontSize: '11px', maxHeight: '160px', overflowY: 'auto' }}>
                          {trackingResult.lines.map((line, lIdx) => (
                            <div key={lIdx}>{line}</div>
                          ))}
                          <div style={{ marginTop: '8px', color: '#F5A623' }}># Question: What is value of {trackingResult.targetVar}?</div>
                        </div>
                      </Card>

                      <Stack gap={3}>
                        <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${trackingResult.isRandomGuessing ? '#ef4444' : '#5EC4C8'}` }}>
                          <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>ESTIMATED LLM REASONING ACCURACY:</strong>
                          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: trackingResult.isRandomGuessing ? '#ef4444' : '#5EC4C8' }}>
                            {trackingResult.accuracy}%
                          </div>
                          {trackingResult.isRandomGuessing && (
                            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>
                              🚨 WORKING MEMORY OVERLOADED! Model regresses to 50% random guessing!
                            </div>
                          )}
                        </Card>

                        <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                          <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>GROUND TRUTH VALUE:</strong>
                          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                            "{trackingResult.currentVal}"
                          </div>
                        </Card>
                      </Stack>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: TASK TAXONOMY ─── */}
        {activeSubTab === 'taxonomy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 BAPO Task Taxonomy Engine (BAPO-Hard vs BAPO-Easy)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Evaluate your prompts to determine if they are <strong>BAPO-Hard</strong> (require heavy working memory) or <strong>BAPO-Easy</strong> (low working memory demand).
                  </p>
                </div>

                <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                  {BAPO_TASK_TAXONOMY.map((task, tIdx) => (
                    <Button
                      key={tIdx}
                      variant={selectedTaskIdx === tIdx ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedTaskIdx(tIdx)}
                    >
                      {task.name}
                    </Button>
                  ))}
                </Flex>

                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${activeTask.type === 'BAPO-Hard' ? '#ef4444' : '#5EC4C8'}` }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-primary)' }}>{activeTask.name}</strong>
                    <Badge variant="subtle" style={{ background: activeTask.type === 'BAPO-Hard' ? 'rgba(255,77,77,0.15)' : 'rgba(46,204,140,0.15)', color: activeTask.type === 'BAPO-Hard' ? '#ef4444' : '#5EC4C8' }}>
                      {activeTask.type}
                    </Badge>
                  </Flex>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                    Memory Demand: {activeTask.memoryDemand}
                  </div>
                  <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: '0 0 12px 0' }}>
                    {activeTask.description}
                  </p>
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '3px solid #F5A623', fontSize: 'var(--ds-font-size-caption)' }}>
                    <strong style={{ color: '#F5A623' }}>Architectural Solution:</strong> {activeTask.recommendation}
                  </Card>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: CODE & SOLUTIONS ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Engineering Solutions & Python Tool Outsourcing</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    When a task exceeds working memory limits, offload BAPO-Hard operations (variable tracking, majority counting) to external Python code or leverage test-time reasoning tokens.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_WORKING_MEMORY_CODE} />

                <Callout type="success">
                  <strong>Key Architectural Takeaway:</strong> Never rely on LLM long-context windows alone for high-variable logic. Decompose BAPO-hard problems into individual BAPO-easy prompts or outsource tracking to external code interpreters.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: IMAGE + WORKFLOW + TABLE + ANIMATION ─── */}
      <BapoPanel />

      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🧠 Interactive Working-Memory Lab</h3>
            <Badge variant="module" moduleId="context">Image · Workflow · Table</Badge>
          </div>
          <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Tap the numbered hotspots on the architecture diagram, walk the BAPO theory steps, and query the task taxonomy.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <ZoomableImage
            src="/assets/1m_context_limits_working_memory_arch.png"
            title="1M+ Context Window & Working Memory Architecture"
            caption="Click numbered hotspots to reveal how raw context capacity differs from effective working memory; click the figure for a zoomable fullscreen view."
            accent="context"
            hotspots={[
              { x: 18, y: 28, label: 'Context Window (1M–2M tokens)', title: 'Raw Capacity', body: 'Frontier LLMs advertise 200k–2M token windows. This is storage, not usable memory.' },
              { x: 50, y: 45, label: 'Prefix Bandwidth (a)', title: 'Compression While Reading', body: 'Bits of information compressed into contextual embeddings while ingesting text.' },
              { x: 74, y: 38, label: 'Attention Bandwidth (b)', title: 'Look-Back Range', body: 'How many past token locations can be attended at the query token.' },
              { x: 52, y: 74, label: 'Working Memory Boundary (N≈5–10)', title: 'Collapse Threshold', body: 'Beyond ~5–10 active variables, BAPO-Hard performance regresses toward random (50%).' },
            ]}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <Workflow
            accent="context"
            accentLabel="BAPO Theory"
            title="Why Big Context ≠ Good Memory"
            description="Four steps from raw capacity to the working-memory boundary. Hit ▶ Play."
            steps={BAPO_THEORY_STEPS.map((s) => ({
              title: s.title, description: s.description, icon: '🔢',
            }))}
          />
        </Reveal>

        <Reveal variant="rise" delay={180}>
          <DataTable
            caption="BAPO Task Taxonomy — Memory Demand & Recommended Offload"
            columns={[
              { key: 'name', label: 'Task', sortable: false },
              { key: 'type', label: 'Class', sortable: false, render: (v) => (
                <span style={{ fontWeight: 700, color: v === 'BAPO-Hard' ? 'var(--ds-color-state-error-light)' : 'var(--ds-color-state-success-light)' }}>{v}</span>
              ) },
              { key: 'memoryDemand', label: 'Memory Demand', sortable: false },
              { key: 'description', label: 'Description', sortable: false },
              { key: 'recommendation', label: 'Recommendation', sortable: false },
            ]}
            rows={BAPO_TASK_TAXONOMY}
            rowKey={(r) => r.name}
          />
        </Reveal>

        <Reveal variant="scale" delay={240}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Working Memory Ceiling</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-context-primary)' }}>
                N ≈ <AnimatedNumber value={10} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Once active-variable complexity exceeds <strong>5–10</strong>, even a 1M-token context collapses toward
              random guessing on BAPO-Hard tasks — outsource tracking to Python or reasoning tokens.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
