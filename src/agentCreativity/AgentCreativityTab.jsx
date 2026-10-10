import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  TEAL, TEAL_DARK, PURPLE, RED, AMBER,
  NOVELTY_RUBRIC, NOVELTY_FLAGS, HUMAN_NOVELTY_PIPELINE, STRATEGIES,
  NOVELTY_IMPACT_ROWS, PYTHON_CREATIVITY_CODE,
  scoreNovelty, normalizedImpact, scoreCreativity, generateEpisodeCurve, rubricLabel,
} from './agentCreativityEngine.js';

const { Container, Stack, Grid } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const MONO = { fontFamily: 'monospace' };

function DecompositionSVG() {
  const box = (x, label, sub, color) => (
    <g key={label}>
      <rect x={x} y={60} width={128} height={74} rx={10} fill="var(--ds-color-bg-surface)" stroke={color} strokeWidth={2} style={{ transition: 'all 0.25s ease' }} />
      <text x={x + 64} y={88} textAnchor="middle" fontSize={12} fontWeight="bold" fill="var(--ds-color-text-primary)">{label}</text>
      <text x={x + 64} y={106} textAnchor="middle" fontSize={10} fill="var(--ds-color-text-secondary)">{sub}</text>
      <text x={x + 64} y={121} textAnchor="middle" fontSize={10} fill={color}>{color === TEAL ? 'originality' : color === PURPLE ? 'originality' : color === AMBER ? 'usefulness' : 'gate'}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 640 230" style={{ width: '100%', height: 'auto', background: 'var(--ds-color-bg-canvas)', borderRadius: 12 }} role="img" aria-label="Creativity decomposition diagram">
      <text x={320} y={24} textAnchor="middle" fontSize={15} fontWeight="bold" fill="var(--ds-color-text-primary)">Creativity = originality + usefulness</text>
      <text x={320} y={42} textAnchor="middle" fontSize={11} fill="var(--ds-color-text-secondary)">Four checks combine; the gate can zero the total</text>
      {box(16, 'Self-novelty', 'vs own history', TEAL)}
      {box(168, 'Human-novelty', 'vs human corpus', PURPLE)}
      {box(320, 'Impact', 'normalized score', AMBER)}
      {box(472, 'Feasibility', 'runs + checks', RED)}
      {[80, 232, 384, 536].map((cx) => (
        <line key={cx} x1={cx} y1={134} x2={320} y2={182} stroke="var(--ds-color-border-subtle)" strokeWidth={1.5} />
      ))}
      <rect x={170} y={168} width={300} height={44} rx={10} fill={TEAL_DARK} opacity={0.18} stroke={TEAL_DARK} strokeWidth={2} />
      <text x={320} y={185} textAnchor="middle" fontSize={12} fontWeight="bold" fill="var(--ds-color-text-primary)">Creativity readout</text>
      <text x={320} y={201} textAnchor="middle" fontSize={10} fill="var(--ds-color-text-secondary)">(novelty / 4 + impact) / 2 — zero if gate fails</text>
    </svg>
  );
}

function CurveSVG({ points }) {
  const W = 560, H = 240, PL = 40, PB = 30;
  const x = (i) => PL + (i * (W - PL - 16)) / Math.max(1, points.length - 1);
  const y = (v) => H - PB - v * (H - 60);
  const line = (key) => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', background: 'var(--ds-color-bg-surface)', borderRadius: 12 }} role="img" aria-label="Episode novelty and impact curves">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <g key={g}><line x1={PL} y1={y(g)} x2={W - 16} y2={y(g)} stroke="var(--ds-color-border-subtle)" strokeWidth={1} /><text x={6} y={y(g) + 4} fontSize={10} fill="var(--ds-color-text-tertiary)">{g.toFixed(2)}</text></g>
      ))}
      <path d={line('novelty')} fill="none" stroke={TEAL} strokeWidth={2.5} style={{ transition: 'd 0.3s ease' }} />
      <path d={line('impact')} fill="none" stroke={PURPLE} strokeWidth={2.5} strokeDasharray="6 4" style={{ transition: 'd 0.3s ease' }} />
      {points.map((p, i) => (
        <g key={i} style={{ transition: 'all 0.3s ease' }}>
          <circle cx={x(i)} cy={y(p.novelty)} r={4} fill={TEAL} />
          <circle cx={x(i)} cy={y(p.impact)} r={4} fill={PURPLE} />
        </g>
      ))}
      {points.map((p, i) => (i % 3 === 2 ? <text key={`e${i}`} x={x(i)} y={H - 10} textAnchor="middle" fontSize={10} fill="var(--ds-color-text-tertiary)">ep {p.episode}</text> : null))}
      <g fontSize={11}>
        <circle cx={PL} cy={14} r={5} fill={TEAL} /><text x={PL + 10} y={18} fill="var(--ds-color-text-secondary)">novelty (declines)</text>
        <circle cx={PL + 160} cy={14} r={5} fill={PURPLE} /><text x={PL + 170} y={18} fill="var(--ds-color-text-secondary)">impact (climbs)</text>
      </g>
    </svg>
  );
}

export default function AgentCreativityTab() {
  const [sub, setSub] = useState('decompose');
  // Scorer simulator state
  const [baseline, setBaseline] = useState(40);
  const [top, setTop] = useState(90);
  const [score, setScore] = useState(72);
  const [flags, setFlags] = useState({ recombines: true, transfers: true, breaksAssumption: false, opensLineage: false });
  const [feasible, setFeasible] = useState(true);
  // Curve simulator state
  const [strategy, setStrategy] = useState('tree-search');

  const novelty = scoreNovelty(flags);
  const impact = normalizedImpact(score, baseline, top);
  const readout = scoreCreativity({ novelty, impact, feasible });
  const curve = useMemo(() => generateEpisodeCurve(strategy, 10), [strategy]);

  const toggle = (k) => setFlags((f) => ({ ...f, [k]: !f[k] }));
  const vc = readout.verdict === 'STANDOUT' ? TEAL_DARK : readout.verdict === 'PROMISING' ? PURPLE : readout.verdict === 'BLOCKED' ? RED : AMBER;

  const SUBTABS = [
    { id: 'decompose', icon: '🧬', label: '1. Original + Useful', desc: 'Decomposition' },
    { id: 'measure', icon: '📏', label: '2. How to Measure', desc: 'Rubric + scorer sim' },
    { id: 'explore', icon: '🌀', label: '3. Explore→Exploit', desc: 'Episode curves' },
    { id: 'gap', icon: '⚖️', label: "4. Novelty ≠ Impact", desc: 'Dual optimization' },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Agent Creativity]"
        title="Creative Agents: Original AND Useful"
        description="A solution counts as creative only when it is both new and good. Track self-novelty, human-novelty, normalized impact, and a feasibility gate — then explore early and exploit late."
        metrics={[{ label: 'Formula', value: '(n/4+i)/2' }, { label: 'Rubric', value: '0–4 scale' }, { label: 'Novelty axes', value: 'self + human' }, { label: 'Gate', value: 'feasible?' }]} />
      <Container size="wide">
        <div style={NAV}>
          {SUBTABS.map((t) => (
            <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease' }}>
              <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {sub === 'decompose' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧬 Creativity = originality + usefulness</h3>
                  <Badge variant="default">4-part split</Badge>
                </div>
                <DecompositionSVG />
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${TEAL}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Self-novelty</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Is this new <em>for this agent</em>? Compare against its own episode history. Cheap to compute, catches loops where the agent repeats itself with new wording.</div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${PURPLE}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Human-novelty</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Is this new <em>for people</em>? Compare against a human reference corpus on ML engineering tasks. Needs retrieval before judging.</div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${AMBER}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Impact</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>How much better than baseline, scaled by the best known score — so tasks with different point ranges stay comparable.</div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${RED}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Feasibility gate</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Does it run and pass checks? A brilliant idea that cannot execute scores zero — novelty without usefulness is not creativity.</div>
                  </Card>
                </Grid>
                <Callout type="info"><strong>Two kinds of new:</strong> self-novelty stops agents from reheating their own outputs; human-novelty stops them from reheating ours. You need both.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'measure' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>📏 The 0–4 novelty rubric</h3>
                <Table sortable={false} columns={[
                  { key: 'level', header: 'Score' },
                  { key: 'label', header: 'Band' },
                  { key: 'desc', header: 'What it means' },
                ]} data={NOVELTY_RUBRIC} />
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🔎 Retrieval-then-judge pipeline</h3>
                <Table sortable={false} columns={[
                  { key: 'step', header: 'Stage' },
                  { key: 'what', header: 'Does what' },
                ]} data={HUMAN_NOVELTY_PIPELINE} />
                <Callout type="tip"><strong>Judge after retrieving:</strong> never ask a judge “is this novel?” with no corpus in context — it will call everything new. Retrieve nearest prior solutions first, then judge overlap.</Callout>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧮 Creativity scorer simulator</h3>
                  <Badge variant="default">sim 1 of 2</Badge>
                </div>
                <div style={MONO} >impact = (score − baseline) / (top − baseline), clamped to 0..1</div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={3}>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>Baseline score: {baseline}
                        <input type="range" min="0" max="100" value={baseline} onChange={(e) => setBaseline(+e.target.value)} style={{ width: '100%' }} /></label>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>Top reference score: {top}
                        <input type="range" min="0" max="100" value={top} onChange={(e) => setTop(+e.target.value)} style={{ width: '100%' }} /></label>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>Agent score: {score}
                        <input type="range" min="0" max="100" value={score} onChange={(e) => setScore(+e.target.value)} style={{ width: '100%' }} /></label>
                      {NOVELTY_FLAGS.map((f) => (
                        <label key={f.key} style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                          <input type="checkbox" checked={!!flags[f.key]} onChange={() => toggle(f.key)} /> {f.label} <span style={{ color: 'var(--ds-color-text-tertiary)' }}>— {f.hint}</span>
                        </label>
                      ))}
                      <label style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={feasible} onChange={() => setFeasible(!feasible)} /> Feasible (runs + passes checks)
                      </label>
                    </Stack>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${vc}` }}>
                    <strong style={{ color: vc, fontSize: '16px' }}>{readout.verdict} · {readout.creativity}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', marginTop: '6px', ...MONO }}>novelty {novelty}/4 ({rubricLabel(novelty)}) · impact {impact}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{readout.note}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>Illustrative numbers only — move the sliders to feel how the gate and the normalization behave.</div>
                  </Card>
                </Grid>
                <CodeBlock language="python" code={PYTHON_CREATIVITY_CODE} />
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'explore' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🌀 Explore first, exploit later</h3>
                  <Badge variant="default">sim 2 of 2</Badge>
                </div>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '13px', margin: 0 }}>Novelty is highest in early episodes and declines as the agent commits; impact climbs as it refines. The strategy preset sets how fast each curve moves — all curves here are deterministic over 10 episodes.</p>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
                  {STRATEGIES.map((s) => (
                    <button key={s.id} onClick={() => setStrategy(s.id)} style={{ padding: '8px 14px', borderRadius: 'var(--ds-radius-md)', border: `1px solid ${strategy === s.id ? TEAL : 'var(--ds-color-border-subtle)'}`, background: strategy === s.id ? 'var(--ds-color-bg-surfaceHover)' : 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', cursor: 'pointer', transition: 'all 0.2s ease' }}>{s.label}</button>
                  ))}
                </div>
                <CurveSVG points={curve} />
                <Table sortable={false} columns={[
                  { key: 'episode', header: 'Episode' },
                  { key: 'novelty', header: 'Novelty' },
                  { key: 'impact', header: 'Impact' },
                ]} data={curve} />
                <Callout type="warning"><strong>Novelty and impact are uncorrelated:</strong> a high-novelty episode is not automatically a high-impact one. Track both curves separately — never use one as a proxy for the other.</Callout>
                <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>{STRATEGIES.find((s) => s.id === strategy).desc}</div>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'gap' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>⚖️ Novelty isn&apos;t impact</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '13px', margin: 0 }}>Agents routinely out-novel top human references while under-scoring them: stranger ideas, weaker execution. That gap is the whole game — creativity needs both axes pushed at once.</p>
                <Table sortable={false} columns={[
                  { key: 'group', header: 'Group' },
                  { key: 'novelty', header: 'Novelty (illustrative)' },
                  { key: 'impact', header: 'Impact (illustrative)' },
                  { key: 'note', header: 'Reading' },
                ]} data={NOVELTY_IMPACT_ROWS} />
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${PURPLE}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Dual-optimization takeaway</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Optimize novelty AND impact as separate objectives. A single blended reward lets the agent trade weirdness for quality — keep two scores and demand both.</div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${RED}` }}>
                    <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>Feasibility-gate rule</strong>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Gate last, gate hard: any solution that cannot run or cannot be checked gets zero creativity regardless of novelty. No exceptions for beautiful ideas.</div>
                  </Card>
                </Grid>
                <Callout type="success"><strong>Ship rule:</strong> keep only ideas that clear the gate, then rank survivors by the (novelty/4 + impact)/2 readout. Explore early for novelty, exploit late for impact.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
