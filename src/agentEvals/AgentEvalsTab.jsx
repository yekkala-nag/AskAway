import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { EVAL_TASKS, ATTACK_CATALOG, SCORE_AGENT, PYTHON_AGENT_EVAL_CODE, classifyQuadrant, QUADRANT_GUIDE, TEMPERATURE_TRAJECTORY, ZERO_TEMP_NOTE, UNRUNNABLE_RULE } from './agentEvalEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function AgentEvalsTab() {
  const [sub, setSub] = useState('tasks');
  const [p, setP] = useState(0.8);
  const [k, setK] = useState(3);
  const [blk, setBlk] = useState(3);
  const [thr, setThr] = useState(0.8);
  const [nSamp, setNSamp] = useState(12);
  const [spread, setSpread] = useState(35);
  const quadRng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const QDOTS = { Q1: '#B4553A', Q2: '#3A9B9F', Q3: '#B9821F', Q4: '#1A6B6E' };
  const qDots = (() => {
    const rng = quadRng(nSamp * 1000 + spread * 7 + 11);
    const sMean = 0.92 - spread * 0.005;
    const oMean = 0.96 - spread * 0.007;
    const rad = 0.10 + spread * 0.0012;
    const pts = [];
    for (let i = 0; i < nSamp; i++) {
      const jx = (rng() + rng() + rng()) / 3 - 0.5;
      const jy = (rng() + rng() + rng()) / 3 - 0.5;
      const sx = Math.max(0.02, Math.min(0.98, sMean + jx * 2 * rad));
      const ox = Math.max(0.02, Math.min(0.98, oMean + jy * 2 * rad));
      pts.push({ s: sx, o: ox, q: classifyQuadrant(sx, ox, thr) });
    }
    return pts;
  })();
  const qMeanS = Math.round((qDots.reduce((t, d) => t + d.s, 0) / qDots.length) * 10000) / 10000;
  const qMeanO = Math.round((qDots.reduce((t, d) => t + d.o, 0) / qDots.length) * 10000) / 10000;
  const qVerdict = classifyQuadrant(qMeanS, qMeanO, thr);
  const qGuide = QUADRANT_GUIDE.filter((g) => g.id === qVerdict)[0];
  const qCounts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  qDots.forEach((d) => { qCounts[d.q]++; });
  const qx = (v) => 46 + v * 404;
  const qy = (v) => 296 - v * 282;
  const tx = (t) => 46 + (t / 1.5) * 404;
  const sy = (v) => 200 - v * 180;
  const outLine = (pts) => pts.map((pt) => tx(pt.temp).toFixed(1) + ',' + sy(pt.output).toFixed(1)).join(' ');
  const synLine = (pts) => pts.map((pt) => tx(pt.temp).toFixed(1) + ',' + sy(pt.syntax).toFixed(1)).join(' ');
  const TRAJ_COLORS = ['#3A9B9F', '#5B4B8A', '#B9821F'];
  const r = SCORE_AGENT(p, k, blk, 4);
  const rc = r.verdict === 'SHIP' ? '#5EC4C8' : r.verdict === 'GATE' ? '#F5A623' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Agent Evals & Red-Team]"
        title="Flaky Agents Fail pass^k — Porous Ones Fail Red-Team"
        description="Single-run pass rates lie: p=0.8 becomes 0.51 at k=3. Four attacks probe injection, exfiltration, drift and jailbreak. Ship needs consistency AND hardness."
        metrics={[{ label: 'Consistency', value: 'pass^k' }, { label: 'Attacks', value: '4-Vector Battery' }, { label: 'Ship', value: 'k≥0.7 + s≥0.9' }, { label: 'Cost Lens', value: '$/Success' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agent_evals.svg" alt="Agent evals" title="Task Battery + Red-Team → Ship/Gate/Rebuild" caption="pass^k punishes flakiness; the battery punishes porosity." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'tasks', icon: '🧪', label: '1. Tasks + Attacks', desc: 'Battery & catalog' },
          { id: 'sim', icon: '🔬', label: '2. Ship-Gate Sim', desc: 'p × k × attacks' },
          { id: 'code', icon: '🛠️', label: '3. Harness Code', desc: 'pass^k + battery' },
          { id: 'quadrant', icon: '🧭', label: '4. Consistency Quadrant', desc: 'syntax × output map' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tasks' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div><h3 style={{ margin: 0 }}>🧪 τ-style task battery</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{EVAL_TASKS.map((t, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{t.task}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{t.checks}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{t.metric}</div></Card>))}</Grid>
          <div><h3 style={{ margin: 0 }}>🔴 Red-team attack catalog</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Attack</th><th style={{ textAlign: 'left', padding: '8px' }}>Vector</th><th style={{ textAlign: 'left', padding: '8px' }}>Defence</th><th style={{ textAlign: 'left', padding: '8px' }}>Detect</th></tr></thead>
            <tbody>{ATTACK_CATALOG.map((a, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: '#ef4444', fontWeight: 'bold' }}>{a.attack}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.vector}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{a.defence}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{a.detect}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Ship-gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Single-run pass p: {p.toFixed(2)}</label>
              <input type="range" min="30" max="100" value={p * 100} onChange={e => setP(+e.target.value / 100)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Repetitions k: {k}</label>
              <input type="range" min="1" max="5" value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Attacks blocked: {blk}/4</label>
              <input type="range" min="0" max="4" value={blk} onChange={e => setBlk(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <strong style={{ color: rc, fontSize: '16px' }}>{r.verdict}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px', fontFamily: 'monospace' }}>pass^{k} = {r.passk} · security = {r.security}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{r.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Eval harness code</h3></div>
          <CodeBlock language="python" code={PYTHON_AGENT_EVAL_CODE} />
          <Callout type="success"><strong>Gate both axes:</strong> flaky-but-secure → planner caps + verifier. Consistent-but-porous → hardening drills. Never trade one for the other.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'quadrant' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🧭 Consistency quadrant — syntax × output</h3>
          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Reliability without ground truth = multi-sample consistency. Syntax: how similar repeats look (canonicalize, then edit distance). Output: how similar their behaviors are (fingerprint clusters + normalized entropy).</div></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)' }}>Threshold T: {thr.toFixed(2)} (on-threshold counts as high)</label>
              <input type="range" min="50" max="95" value={thr * 100} onChange={e => setThr(+e.target.value / 100)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)' }}>Samples per cloud: {nSamp}</label>
              <input type="range" min="4" max="24" value={nSamp} onChange={e => setNSamp(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)' }}>Behavior spread: {spread} (seeded, deterministic)</label>
              <input type="range" min="0" max="100" value={spread} onChange={e => setSpread(+e.target.value)} style={{ width: '100%' }} />
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px', fontFamily: 'monospace' }}>cloud mean → syntax {qMeanS.toFixed(2)}, output {qMeanO.toFixed(2)}</div>
              <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px', fontFamily: 'monospace' }}>syntax = 1 − mean pairwise edit distance (canonicalized)</div>
              <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>output = 1 − normalized entropy of behavior clusters</div>
              <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>1 cluster → 1 · all singletons → 0</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid ' + qGuide.color }}>
              <strong style={{ color: qGuide.color, fontSize: '16px' }}>{qGuide.id} · {qGuide.title}</strong>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', marginTop: '6px' }}>{qGuide.meaning}</div>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', marginTop: '6px', fontWeight: 'bold' }}>{qGuide.verdict}</div>
              <div style={{ fontSize: '11px', color: qGuide.color, marginTop: '6px', fontFamily: 'monospace' }}>illustrated by {qGuide.example}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px', fontFamily: 'monospace' }}>dots in view: Q1 ×{qCounts.Q1} · Q2 ×{qCounts.Q2} · Q3 ×{qCounts.Q3} · Q4 ×{qCounts.Q4}</div>
            </Card>
          </Grid>
          <svg viewBox="0 0 460 340" style={{ width: '100%', background: '#090d16', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }} role="img" aria-label="Consistency quadrant scatter">
            <rect x="46" y={qy(thr)} width={qx(thr) - 46} height={296 - qy(thr)} fill="#B9821F" opacity="0.14" />
            <rect x={qx(thr)} y={qy(thr)} width={450 - qx(thr)} height={296 - qy(thr)} fill="#B4553A" opacity="0.16" />
            <rect x="46" y="14" width={qx(thr) - 46} height={qy(thr) - 14} fill="#1A6B6E" opacity="0.30" />
            <rect x={qx(thr)} y="14" width={450 - qx(thr)} height={qy(thr) - 14} fill="#3A9B9F" opacity="0.16" />
            <line x1={qx(thr)} y1="14" x2={qx(thr)} y2="296" stroke="#8a93a6" strokeDasharray="5 4" />
            <line x1="46" y1={qy(thr)} x2="450" y2={qy(thr)} stroke="#8a93a6" strokeDasharray="5 4" />
            <text x="54" y="32" fontSize="12" fontWeight="bold" fill="var(--ds-color-text-secondary)">Q4 · trustworthy</text>
            <text x="442" y="32" fontSize="12" fontWeight="bold" textAnchor="end" fill="var(--ds-color-text-secondary)">Q2 · steady</text>
            <text x="54" y={qy(thr) + 22} fontSize="12" fontWeight="bold" fill="var(--ds-color-text-secondary)">Q3 · scattershot</text>
            <text x="442" y={qy(thr) + 22} fontSize="12" fontWeight="bold" textAnchor="end" fill="var(--ds-color-text-secondary)">Q1 · dangerous</text>
            <text x="46" y="312" fontSize="10" fill="var(--ds-color-text-tertiary)">0</text>
            <text x={qx(thr) - 12} y="312" fontSize="10" fill="var(--ds-color-text-tertiary)">{thr.toFixed(2)}</text>
            <text x="444" y="312" fontSize="10" fill="var(--ds-color-text-tertiary)">1</text>
            <text x="36" y={qy(0) + 3} fontSize="10" fill="var(--ds-color-text-tertiary)">0</text>
            <text x="28" y={qy(thr) + 3} fontSize="10" fill="var(--ds-color-text-tertiary)">{thr.toFixed(2)}</text>
            <text x="36" y={qy(1) + 3} fontSize="10" fill="var(--ds-color-text-tertiary)">1</text>
            <text x="248" y="330" fontSize="11" textAnchor="middle" fill="var(--ds-color-text-secondary)">syntax consistency →</text>
            <text x="14" y="155" fontSize="11" textAnchor="middle" transform="rotate(-90 14 155)" fill="var(--ds-color-text-secondary)">output consistency →</text>
            {qDots.map((d, i) => (<circle key={i} cx={qx(d.s)} cy={qy(d.o)} r="6" fill={QDOTS[d.q]} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />))}
            <circle cx={qx(qMeanS)} cy={qy(qMeanO)} r="11" fill="none" stroke="white" strokeWidth="1.5" />
            <circle cx={qx(qMeanS)} cy={qy(qMeanO)} r="3.5" fill="white" />
          </svg>
        </Stack></Card>
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🌡️ Temperature trajectory across the quadrant</h3>
          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Solid = output consistency, dashed = syntax consistency. Rings mark each problem's sweet spot — the optimum moves per problem.</div></div>
          <svg viewBox="0 0 460 240" style={{ width: '100%', background: '#090d16', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }} role="img" aria-label="Temperature trajectory mini-chart">
            <line x1="46" y1="200" x2="450" y2="200" stroke="var(--ds-color-border-subtle)" />
            <line x1="46" y1="20" x2="46" y2="200" stroke="var(--ds-color-border-subtle)" />
            {[0, 0.5, 1.0, 1.5].map((t) => (<text key={'t' + t} x={tx(t)} y="216" fontSize="10" textAnchor="middle" fill="var(--ds-color-text-tertiary)">{t.toFixed(1)}</text>))}
            {[0, 0.5, 1.0].map((v) => (<text key={'v' + v} x="38" y={sy(v) + 3} fontSize="10" textAnchor="end" fill="var(--ds-color-text-tertiary)">{v.toFixed(1)}</text>))}
            <text x="248" y="232" fontSize="11" textAnchor="middle" fill="var(--ds-color-text-secondary)">temperature →</text>
            {TEMPERATURE_TRAJECTORY.map((t, pi) => (
              <g key={t.id}>
                <polyline points={outLine(t.points)} fill="none" stroke={TRAJ_COLORS[pi]} strokeWidth="2" />
                <polyline points={synLine(t.points)} fill="none" stroke={TRAJ_COLORS[pi]} strokeWidth="1.5" strokeDasharray="5 4" strokeOpacity="0.55" />
                {t.points.filter((pt) => pt.temp === t.optimalTemp).map((pt) => (
                  <g key={'opt' + t.id}>
                    <circle cx={tx(pt.temp)} cy={sy(pt.output)} r="6" fill={TRAJ_COLORS[pi]} stroke="white" strokeWidth="1.5" />
                  </g>
                ))}
              </g>
            ))}
          </svg>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
            {TEMPERATURE_TRAJECTORY.map((t, pi) => (
              <Card key={t.id} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid ' + TRAJ_COLORS[pi] }}>
                <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{t.problem}</div>
                <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>sweet spot T = {t.optimalTemp.toFixed(1)} — {t.note}</div>
              </Card>
            ))}
          </Grid>
          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>⚠️ {ZERO_TEMP_NOTE}</div>
          <Callout type="warning"><strong>Metric only as good as the behavior suite:</strong> output consistency inherits every blind spot in the fingerprints — thin suites under-report real divergence. {UNRUNNABLE_RULE}</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
