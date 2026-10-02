import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  FRAMEWORK_STEPS, WHEN_TO_USE_TRIGGERS, REVERSIBILITY_GUIDE,
  RACI_EXAMPLE, CASE_WALKTHROUGH, SCORE_READINESS,
  ESTIMATE_REVERSAL, PYTHON_PREP_CODE
} from './prepEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ProjectPrepFrameworkTab() {
  const [activeSubTab, setActiveSubTab] = useState('framework');
  const [triggers, setTriggers] = useState(['ambig', 'parallel', 'irreversible']);
  const [fleet, setFleet] = useState(6);
  const [people, setPeople] = useState(4);
  const [revKind, setRevKind] = useState('contract');
  const [revStage, setRevStage] = useState('production');

  const toggle = (id) => setTriggers(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  const readiness = SCORE_READINESS(triggers, fleet, people);
  const reversal = ESTIMATE_REVERSAL(revKind, revStage);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [Solve the Right Problem]"
        title="Solve the Right Problem Before Agents Build the Wrong One Fast"
        description="Agentic AI makes implementation cheap — so problem definition becomes the bottleneck. 6 short docs that make decisions explicit, durable and usable by humans + agents."
        metrics={[
          { label: 'Framework', value: '6 Docs, Sequential' },
          { label: 'Core Rule', value: 'Scrutiny ∝ Reversal Cost' },
          { label: 'Fleet Risk', value: '1 Wrong × N Agents' },
          { label: 'Cheapest Fix', value: 'Blueprint 1x vs Prod 10x' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage moduleId="agents_frameworks" src="/assets/project_prep_framework.svg" alt="Project Preparation Framework workflow" title="6-Doc Prep Framework + Cost-of-Change Curve" caption="Left→right: PID → discovery → functional → technical → governance → roadmap. Cost curve 1x→4x→10x. Fleet amplifies wrong direction." background="#090d16" maxWidth={1100} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {[
            { id: 'framework', icon: '📋', label: '1. 6-Step Framework', desc: 'Docs, war stories, lessons' },
            { id: 'when', icon: '🎯', label: '2. When + Readiness Sim', desc: 'Score your project live' },
            { id: 'govern', icon: '⚖️', label: '3. Reversibility + RACI', desc: 'Where scrutiny belongs' },
            { id: 'code', icon: '🛠️', label: '4. Case + Python Code', desc: 'Walkthrough + scaffold' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ flex: 1, minWidth: '210px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}><span>{tab.icon}</span><span>{tab.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'framework' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>📋 The 6 Documents — each kills one uncertainty class</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Sequential but not waterfall: later discovery may invalidate earlier docs — go back, update explicitly. Never allow unacknowledged change.</p></div>
                <Stack gap={3}>
                  {FRAMEWORK_STEPS.map(s => (
                    <Card key={s.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '4px' }}>
                        <strong style={{ color: '#3A9B9F' }}>{s.n}. {s.title} — <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.doc}</span></strong>
                        <Badge variant="subtle" style={{ background: 'rgba(56,189,248,0.15)', color: '#3A9B9F', fontSize: '9px' }}>{s.question}</Badge>
                      </Flex>
                      <p style={{ margin: '4px 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{s.purpose}</p>
                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '8px' }}>
                        <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>War story: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.warStory}</span></div>
                        <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Lesson: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.lesson}</span></div>
                        <div><span style={{ color: '#ef4444', fontWeight: 'bold' }}>Agent risk: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.agentRisk}</span></div>
                      </Grid>
                      <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Produces: {s.produces.join(' · ')}</div>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'when' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🎯 Readiness Simulator — is the full framework justified?</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Not every change needs 6 docs. Tick what is true; fleet size amplifies the cost of being wrong.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '10px' }}>PROJECT TRIGGERS (weight in brackets):</strong>
                    <Stack gap={2}>
                      {WHEN_TO_USE_TRIGGERS.map(t => (
                        <label key={t.id} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'white', cursor: 'pointer' }}>
                          <input type="checkbox" checked={triggers.includes(t.id)} onChange={() => toggle(t.id)} />
                          {t.label} <span style={{ color: '#64748b' }}>[{t.weight}]</span>
                        </label>
                      ))}
                    </Stack>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ marginTop: '12px' }}>
                      <div><label style={{ fontSize: '11px', color: 'white' }}>Agent fleet size: {fleet}</label>
                        <input type="range" min="1" max="10" value={fleet} onChange={e => setFleet(+e.target.value)} style={{ width: '100%' }} /></div>
                      <div><label style={{ fontSize: '11px', color: 'white' }}>People in parallel: {people}</label>
                        <input type="range" min="1" max="8" value={people} onChange={e => setPeople(+e.target.value)} style={{ width: '100%' }} /></div>
                    </Grid>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${readiness.score >= 65 ? '#ef4444' : readiness.score >= 35 ? '#F5A623' : '#5EC4C8'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>READINESS SCORE: {readiness.score}/100</strong>
                      <Badge variant="subtle" style={{ background: 'rgba(56,189,248,0.15)', color: '#3A9B9F', fontSize: '9px' }}>{readiness.triggersHit} triggers</Badge>
                    </Flex>
                    <div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold', marginBottom: '4px' }}>{readiness.verdict}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>{readiness.depth}</div>
                    <div style={{ fontSize: '11px', color: '#ef4444' }}>{readiness.fleetAmplification}</div>
                  </Card>
                </Grid>
                <Callout type="success"><strong>Rule from article:</strong> spend effort where reversal is expensive. Button label → decide fast. Data contract / autonomy → eliminate uncertainty first.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'govern' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>⚖️ Reversibility Estimator + RACI</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Pick a decision class and where the mistake is found. Blueprint fix ≈ 1x; production ≈ 10x.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>Decision class</label>
                    <select value={revKind} onChange={e => setRevKind(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '10px' }}>
                      <option value="copy">Button label / copy</option>
                      <option value="prompt">Single-agent prompt wording</option>
                      <option value="retrieval">Chunking / retrieval defaults</option>
                      <option value="contract">Data contract / system boundary</option>
                      <option value="autonomy">Autonomous decision authority</option>
                    </select>
                    <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>Stage where mistake is found</label>
                    <select value={revStage} onChange={e => setRevStage(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px' }}>
                      <option value="blueprint">Blueprint (doc review)</option>
                      <option value="build">Mid-build</option>
                      <option value="production">Production</option>
                    </select>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#F5A623', fontWeight: 'bold' }}>{reversal.message}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{reversal.advice}</div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>RACI EXAMPLE (governance.md):</strong>
                    <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                        <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '6px' }}>Decision</th><th style={{ padding: '6px' }}>R</th><th style={{ padding: '6px' }}>A</th><th style={{ padding: '6px' }}>C</th><th style={{ padding: '6px' }}>I</th>
                        </tr></thead>
                        <tbody>{RACI_EXAMPLE.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                            <td style={{ padding: '6px', color: 'white' }}>{r.decision}</td><td style={{ padding: '6px' }}>{r.R}</td><td style={{ padding: '6px' }}>{r.A}</td><td style={{ padding: '6px' }}>{r.C}</td><td style={{ padding: '6px' }}>{r.I}</td>
                          </tr>))}</tbody>
                      </table>
                    </div>
                  </Card>
                </Grid>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Decision</th><th style={{ padding: '8px' }}>Reverse cost</th><th style={{ padding: '8px' }}>Scrutiny</th>
                    </tr></thead>
                    <tbody>{REVERSIBILITY_GUIDE.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                        <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r.decision}</td>
                        <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.reverseCost}</td>
                        <td style={{ padding: '8px', color: r.scrutiny.includes('Deep') ? '#ef4444' : r.scrutiny === 'Minimal' ? '#5EC4C8' : '#F5A623' }}>{r.scrutiny}</td>
                      </tr>))}</tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🛠️ Article Case Walkthrough + Scaffold Code</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>AI case-intake request: "read docs, extract, auto-decide". Framework reroutes it before build.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {CASE_WALKTHROUGH.map((c, i) => (
                    <Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>{c.step} → {c.doc}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{c.surprise}</div>
                    </Card>
                  ))}
                </Grid>
                <CodeBlock language="python" code={PYTHON_PREP_CODE} />
                <Callout type="success"><strong>Templates:</strong> Each document ships with a ready-to-fill template. Contribute war stories upstream.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
