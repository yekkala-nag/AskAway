import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { ROUTE_STATIC_FAILS, SCORE_DIMS, TIERS, EXPERIMENTS, SCORE_TASK, PYTHON_ROUTER_CODE } from './routerEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const DIMS = [['Complexity', 'cx'], ['Reasoning', 'rs'], ['Context size', 'ctx']];
const LVL = ['Low (0)', 'Medium (1)', 'High (2)'];

export default function ModelRoutingTab() {
  const [sub, setSub] = useState('scoring');
  const [cx, setCx] = useState(0);
  const [rs, setRs] = useState(1);
  const [ctx, setCtx] = useState(1);
  const set = (k, v) => (k === 'cx' ? setCx(v) : k === 'rs' ? setRs(v) : setCtx(v));
  const get = (k) => (k === 'cx' ? cx : k === 'rs' ? rs : ctx);
  const r = SCORE_TASK(cx, rs, ctx);
  const rc = r.tier.includes('Fast') ? '#5EC4C8' : r.tier.includes('Balanced') ? '#F5A623' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Adaptive Model Routing]"
        title="Pay Only for the Thinking Each Task Needs"
        description="Static flagship-everywhere wastes 90%+ on easy work. JIT per-agent planning plus a cheap classifier scoring complexity × reasoning × accumulated context routes every sub-task to fast, balanced, or powerful."
        metrics={[{ label: 'Score', value: '0–6 sum' }, { label: 'Best Saving', value: '~94%' }, { label: 'Classifier', value: 'Flash-lite' }, { label: 'Rule', value: 'Never downgrade dense' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/model_routing.svg" alt="Adaptive model routing" title="0–6 Score → Three Tiers" caption="Same agent, 14x cost jumps between steps; dense critique honestly stays pro." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'scoring', icon: '🎯', label: '1. Scoring + Tiers', desc: 'Dims, tiers, evidence' },
          { id: 'sim', icon: '🔬', label: '2. Task Grader Sim', desc: 'Grade any sub-task' },
          { id: 'code', icon: '🛠️', label: '3. Router Code', desc: 'Article-faithful route_task' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'scoring' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{ROUTE_STATIC_FAILS.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>✕ {f.static}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{f.waste}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Dimension</th><th style={{ padding: '8px' }}>Low (0)</th><th style={{ padding: '8px' }}>Medium (1)</th><th style={{ padding: '8px' }}>High (2)</th></tr></thead>
            <tbody>{SCORE_DIMS.map((d, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{d.dim}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{d.low}</td><td style={{ padding: '8px', color: '#F5A623' }}>{d.mid}</td><td style={{ padding: '8px', color: '#ef4444' }}>{d.high}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{TIERS.map((t, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{t.tier} · {t.range}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{t.use}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Query</th><th style={{ padding: '8px' }}>Adaptive</th><th style={{ padding: '8px' }}>All-pro</th><th style={{ padding: '8px' }}>Saved</th><th style={{ textAlign: 'left', padding: '8px' }}>Why</th></tr></thead>
            <tbody>{EXPERIMENTS.map((e, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white' }}>{e.q}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontFamily: 'monospace', fontWeight: 'bold' }}>{e.adap}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace' }}>{e.full}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontWeight: 'bold' }}>{e.save}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{e.why}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Sub-task grader simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              {DIMS.map(([label, k]) => (
                <div key={k} style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <Flex gap="var(--ds-space-2)">{LVL.map((l, i) => (<Button key={l} variant={get(k) === i ? 'primary' : 'secondary'} size="sm" onClick={() => set(k, i)}>{l}</Button>))}</Flex>
                </div>
              ))}
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '20px', color: rc, fontWeight: 'bold' }}>{r.score} → {r.tier}</div>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', marginTop: '4px' }}>≈ {r.estCost}/step</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{r.read}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{r.contextNote}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Pydantic grades + deterministic context + tier map</h3></div>
          <CodeBlock language="python" code={PYTHON_ROUTER_CODE} />
          <Callout type="success"><strong>Fallback rule:</strong> unmapped scores route powerful, never silent. Savings scale inversely with difficulty — honest on dense queries, ruthless on easy ones.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
