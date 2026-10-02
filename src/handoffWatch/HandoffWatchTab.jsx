import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { SILENT_FAILURES, WHY_EVALS_MISS, WATCHDOG_RULES, WATCHDOG_COSTS, GRADE_HANDOFF, PYTHON_WATCHDOG_CODE } from './watchEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function HandoffWatchTab() {
  const [sub, setSub] = useState('failures');
  const [scenario, setScenario] = useState('empty200');
  const [floor, setFloor] = useState(0.35);
  const g = GRADE_HANDOFF(scenario, floor);
  const gc = g.verdict.startsWith('PASS') ? '#5EC4C8' : '#ef4444';
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Handoff Watchdogs]"
        title="Your Final Output Can Lie — Grade the Seams"
        description="Support-triage pipeline, three nodes deep: a 200-OK empty payload sails through tone checks and ships a polite wrong refund. Intermediate State Evals put a cheap watchdog between nodes so corruption halts where it enters."
        metrics={[{ label: 'Silent Share', value: '~40% of failures' }, { label: 'Grader', value: 'Local 1B, 1 Q' }, { label: 'Floor', value: '0.35, tuned' }, { label: 'Rule', value: 'Fail closed' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/handoff_watchdog.svg" alt="Handoff watchdog" title="Seam Grading + Costs" caption="Empty-200 passes tone checks; watchdog halts at the seam with payload attached." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'failures', icon: '👻', label: '1. Silent Shapes', desc: 'What sails through' },
          { id: 'sim', icon: '🔬', label: '2. Grader Sim', desc: 'Floor slider included' },
          { id: 'code', icon: '🛠️', label: '3. Watchdog Code', desc: 'Schema + gate' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'failures' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{SILENT_FAILURES.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.shape}</div><div style={{ fontSize: '11px', color: 'white' }}>{f.detail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>→ {f.downstream}</div></Card>))}</Grid>
          <div><h3 style={{ margin: 0 }}>Why evals miss all four</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{WHY_EVALS_MISS.map((w, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{w.check}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>sees: {w.sees}</div><div style={{ fontSize: '11px', color: '#ef4444' }}>misses: {w.misses}</div></Card>))}</Grid>
          <Callout type="success"><strong>UI-testing analogy:</strong> nobody calls an app tested because login renders. Test the query, the token, the permission — the layers beneath the final text.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Handoff grader simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Handoff shape</label>
              <select value={scenario} onChange={e => setScenario(e.target.value)} style={{ ...sel, marginBottom: '8px' }}><option value="valid">valid lookup</option><option value="empty200">empty 200 (active sub)</option><option value="idmismatch">account ID mismatch</option><option value="lowconf">low-confidence edge</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>Confidence floor: {floor.toFixed(2)}</label>
              <input type="range" min="0" max="90" value={floor * 100} onChange={e => setFloor(+e.target.value / 100)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${gc}` }}>
              <strong style={{ color: gc }}>{g.verdict}</strong>
              <div style={{ fontSize: '11px', color: 'white', marginTop: '6px' }}>{g.shape}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{g.reason}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>{g.lesson}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{[...WATCHDOG_RULES, ...WATCHDOG_COSTS.map(c => ({ rule: `Cost: ${c.cost}`, why: c.detail }))].slice(0, 6).map((r, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${r.rule.startsWith('Cost') ? '#ef4444' : '#5EC4C8'}` }}><div style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>{r.rule}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{r.why}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Schema + grader + gate (article-faithful)</h3></div>
          <CodeBlock language="python" code={PYTHON_WATCHDOG_CODE} />
          <Callout type="success"><strong>Rollout advice:</strong> start at the last internal handoff before externals, run a week, let catches justify pushing the pattern backward.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
