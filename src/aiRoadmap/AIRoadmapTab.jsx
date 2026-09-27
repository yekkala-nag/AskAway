import React, { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { ROADMAP_STAGES, ROADMAP_NODE_MAP, BUILD_PLAN, PYTHON_ROADMAP_CODE } from './roadmapEngine.js';
import { getTabById } from '../registry/tabsRegistry.js';
import { getMasteryScore, isMastered } from '../services/mastery.js';
import { subscribeToAdaptiveProgress } from '../services/adaptiveLearning.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '180px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

function stageScore(tabs) {
  if (!tabs.length) return 0;
  return Math.round(tabs.reduce((a, id) => a + getMasteryScore(id), 0) / tabs.length);
}

export default function AIRoadmapTab({ onSelectTab }) {
  const [sub, setSub] = useState('map');
  const [tick, setTick] = useState(0);
  const [bg, setBg] = useState('dev');
  const [goal, setGoal] = useState('rag');
  const [hrs, setHrs] = useState(6);
  useEffect(() => subscribeToAdaptiveProgress(() => setTick(t => t + 1)), []);
  void tick;

  const go = (id) => { if (onSelectTab) onSelectTab(id); };
  const plan = BUILD_PLAN(bg, goal, hrs);
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="foundations"
        moduleLabel="Curriculum Map · AI Engineer Roadmap (roadmap.sh adapted)"
        title="Become an AI Engineer — One Map, Eight Stages"
        description="roadmap.sh's AI Engineer path rebuilt as a living map: every node below opens a real topic, dots fill as you prove mastery, and the planner turns background + goal + pace into your week-by-week schedule."
        metrics={[
          { label: 'Stages', value: '8' },
          { label: 'Mapped Topics', value: '35+' },
          { label: 'Reviews', value: 'Exit-checked' },
          { label: 'Plan', value: 'Auto-built' }
        ]}
        actions={[
          { label: '🧭 Build My Plan', variant: 'primary', onClick: () => { setSub('plan'); document.getElementById('roadmap-planner')?.scrollIntoView({ behavior: 'smooth' }); } },
          { label: '📚 Browse Library', variant: 'ghost', onClick: () => go('overview') }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            moduleId="foundations"
            src="/assets/ai_roadmap.svg"
            alt="AI Engineer Roadmap serpentine"
            title="The Journey: Orient → Ship"
            caption="Animated flow follows the learning order. Below, each stage expands into clickable, mastery-aware topics."
            background="#0F1219"
            maxWidth={1100}
          />
        </div>

        <div style={NAV}>{[
          { id: 'map', icon: '🗺️', label: '1. Interactive Map', desc: '8 stages, live mastery' },
          { id: 'plan', icon: '📅', label: '2. Week Planner', desc: 'Background × goal × pace' },
          { id: 'table', icon: '📊', label: '3. Node Mapping', desc: 'roadmap.sh → our tabs' },
          { id: 'code', icon: '🛠️', label: '4. Workflow + Code', desc: 'How to walk it' }
        ].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
          </button>
        ))}</div>

        {sub === 'map' && (
          <Stack gap={4}>
            {ROADMAP_STAGES.map(s => {
              const score = stageScore(s.tabs);
              const done = s.tabs.filter(isMastered).length;
              return (
                <Card key={s.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${score === 100 ? '#5EC4C8' : '#5EC4C8'}` }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '14px' }}>{s.n}. {s.title}</strong>
                    <Flex gap="var(--ds-space-2)" align="center">
                      <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{done}/{s.tabs.length} proven · {score}</span>
                      <div style={{ width: '90px', height: '6px', borderRadius: '4px', background: '#E8E8EC', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score}%`, background: score === 100 ? '#5EC4C8' : '#5EC4C8', borderRadius: '4px' }} />
                      </div>
                    </Flex>
                  </Flex>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>roadmap.sh: {s.road}</div>
                  <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                    {s.tabs.map(id => {
                      const t = getTabById(id) || { label: id, icon: '📝' };
                      const m = isMastered(id);
                      return (
                        <button
                          key={id}
                          onClick={() => go(id)}
                          title={`${t.label}${m ? ' — proven ✓' : ''}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '5px 10px', borderRadius: '16px', cursor: 'pointer',
                            background: m ? 'rgba(94,196,200,0.14)' : 'var(--ds-color-bg-surface)',
                            border: `1px solid ${m ? '#5EC4C8' : 'var(--ds-color-border-subtle)'}`,
                            color: 'var(--ds-color-text-primary)', fontSize: '12px'
                          }}
                        >
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: m ? '#5EC4C8' : '#B8B8C4', flexShrink: 0 }} />
                          <span>{t.icon} {t.label}</span>
                        </button>
                      );
                    })}
                  </Flex>
                  <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '8px' }}>✓ {s.outcome}</div>
                </Card>
              );
            })}
          </Stack>
        )}

        {sub === 'plan' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }} id="roadmap-planner">
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>📅 Week planner — background × goal × pace</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Devs fast-forward orientation; ML folks skip mechanics; goals re-weight stages. {plan.headline}.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#0F1219', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-inverse)' }}>Background</label>
                    <select value={bg} onChange={e => setBg(e.target.value)} style={sel}>
                      <option value="new">New to code/AI</option>
                      <option value="dev">Developer, new to AI</option>
                      <option value="ml">ML background</option>
                    </select>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-inverse)' }}>Goal</label>
                    <select value={goal} onChange={e => setGoal(e.target.value)} style={sel}>
                      <option value="rag">Ship RAG</option>
                      <option value="agent">Ship agents</option>
                      <option value="chat">Ship chatbot</option>
                      <option value="general">General mastery</option>
                    </select>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-inverse)' }}>Hours/week: {hrs}</label>
                    <input type="range" min={2} max={20} value={hrs} onChange={e => setHrs(+e.target.value)} style={{ width: '100%' }} />
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ color: '#3A9B9F' }}>{plan.headline}</strong>
                    <div style={{ marginTop: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                      {plan.rows.filter(r => !r.skipped).map(r => (
                        <div key={r.n} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', padding: '3px 0', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                          <span style={{ color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>Wk {r.startWeek}{r.weeks > 1 ? `–${r.startWeek + r.weeks - 1}` : ''}</span> · Stage {r.n} {r.title} ({r.topics} topics)
                        </div>
                      ))}
                      {plan.rows.some(r => r.skipped) && (
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>
                          Fast-forwarded on background: {plan.rows.filter(r => r.skipped).map(r => `Stage ${r.n}`).join(', ')} — prove via exit checks anytime.
                        </div>
                      )}
                    </div>
                    <Button variant="primary" size="sm" onClick={() => go(plan.startTab)} style={{ marginTop: '10px' }}>
                      Start week 1 → {((getTabById(plan.startTab) || {}).label) || ''}
                    </Button>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'table' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>📊 roadmap.sh node → our topics (with our extensions marked)</h3></div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                      <th style={{ textAlign: 'left', padding: '8px' }}>roadmap.sh node</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Our topics (click)</th>
                      <th style={{ textAlign: 'left', padding: '8px' }}>Note</th>
                    </tr></thead>
                    <tbody>
                      {ROADMAP_NODE_MAP.map((m, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                          <td style={{ padding: '8px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{m.road}</td>
                          <td style={{ padding: '8px' }}>
                            <Flex gap="6px" style={{ flexWrap: 'wrap' }}>
                              {m.ours.map(id => {
                                const t = getTabById(id) || { label: id, icon: '📝' };
                                return (
                                  <button key={id} onClick={() => go(id)} style={{ background: 'rgba(94,196,200,0.14)', border: '1px solid rgba(94,196,200,0.4)', color: '#3A9B9F', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}>
                                    {t.icon} {t.label}
                                  </button>
                                );
                              })}
                            </Flex>
                          </td>
                          <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{m.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🛠️ The walking workflow + planner code</h3></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {[
                    ['1 · Diagnose', 'Quiz places per-area levels; skips what you prove.'],
                    ['2 · Walk stages', 'Follow the serpentine; chips show live mastery.'],
                    ['3 · Prove', 'Exit checks convert visits into proven mastery.'],
                    ['4 · Review', 'Spaced queue resurfaces proven topics at ~14 days.']
                  ].map(([t, d], i) => (
                    <Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{t}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{d}</div>
                    </Card>
                  ))}
                </Grid>
                <CodeBlock language="python" code={PYTHON_ROADMAP_CODE} />
                <Callout type="success"><strong>Source honesty:</strong> stage order and node names follow roadmap.sh/ai-engineer; validity/memory/grid/watchdog rows are this library's extensions, labeled as such in the mapping table.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
