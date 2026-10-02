import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { WHY_DIFFERENT, FAILURE_MODES, WHY_NAIVE_FIXES_FAIL, UNIFIED_LAYER, FANOUT_LOAD, PYTHON_FANOUT_CODE } from './fanoutEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function AgentFanoutTab() {
  const [sub, setSub] = useState('why');
  const [agents, setAgents] = useState(200);
  const [reforms, setReforms] = useState(4);
  const [cache, setCache] = useState(40);
  const r = FANOUT_LOAD(agents, reforms, 120, cache / 100);
  const rc = r.verdict.startsWith('WALL') ? '#ef4444' : r.verdict.startsWith('CORRUPTION') ? '#F5A623' : '#5EC4C8';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Retrieval Under Agent Fan-Out]"
        title="Hundreds of Agents Don't Add Load — They Multiply It"
        description="Retrieve→reason→reformulate→retrieve: 200 agents become 800 freshness-sensitive QPS. Latency stacks per hop, caches serve fast-wrong, reformulations drift. Bigger DBs don't fix validity problems."
        metrics={[{ label: 'Multiplier', value: '3–8x per task' }, { label: 'Watch', value: 'p95, not avg' }, { label: 'Cache Trap', value: 'Fast-wrong' }, { label: 'Fix', value: 'Unify layer' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/agent_fanout.svg" alt="Agent fan-out load" title="Stacking + Staleness + Drift" caption="Naive fixes miss; unified layer with freshness budgets holds." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'why', icon: '🌊', label: '1. Why Different', desc: 'Agents ≠ concurrency' },
          { id: 'sim', icon: '🔬', label: '2. Load Simulator', desc: 'Find your wall' },
          { id: 'code', icon: '🛠️', label: '3. Load Model Code', desc: 'fanout()' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'why' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Human query</th><th style={{ textAlign: 'left', padding: '8px' }}>Agent workload</th><th style={{ padding: '8px' }}>Effect</th></tr></thead>
            <tbody>{WHY_DIFFERENT.map((w, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{w.human}</td><td style={{ padding: '8px', color: 'white' }}>{w.agent}</td><td style={{ padding: '8px', textAlign: 'center', color: '#F5A623', fontWeight: 'bold' }}>{w.mult}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{FAILURE_MODES.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.mode}</div><div style={{ fontSize: '11px', color: 'white' }}>{f.detail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{f.missed}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{WHY_NAIVE_FIXES_FAIL.map((w, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>✕ {w.fix}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{w.fails}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Fan-out load simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Concurrent agents: {agents}</label>
              <input type="range" min={5} max={1000} step={5} value={agents} onChange={e => setAgents(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Reformulations/task: {reforms}</label>
              <input type="range" min={1} max={10} value={reforms} onChange={e => setReforms(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Cache hit: {cache}%</label>
              <input type="range" min={0} max={95} value={cache} onChange={e => setCache(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>{r.qps} eff. QPS · p95 {r.p95Ms}ms · stale {r.staleRiskPct}%</div>
              <div style={{ fontSize: '13px', color: rc, fontWeight: 'bold', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{r.note}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{UNIFIED_LAYER.map((u, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{u.piece}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{u.does}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Fan-out load model</h3></div>
          <CodeBlock language="python" code={PYTHON_FANOUT_CODE} />
          <Callout type="success"><strong>Find the wall early:</strong> load-test with reformulating agents, not static queries — p95 per hop, freshness budgets enforced, hop caps set.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
