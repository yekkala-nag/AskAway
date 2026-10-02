import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { OOM_STORY, LEDGER_RULES, KV_SWAP, CAC_ANALOGY, OUT_OF_SCOPE, ADMIT, PYTHON_LEDGER_CODE } from './vramEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const QUEUE = ['llama', 'qwen', 'smol'];

export default function VramConductorTab() {
  const [sub, setSub] = useState('story');
  const [queue, setQueue] = useState(['llama', 'qwen', 'smol']);
  const toggle = (m) => setQueue(q => q.includes(m) ? q.filter(x => x !== m) : [...q, m]);
  const r = ADMIT(queue.length ? queue : ['llama']);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [VRAM Conductor]"
        title="Refusing Impossible Work Beats Optimizing Possible Work"
        description="Three terminals, one GTX 1080, two cudaMalloc funerals — because KV cache reserves up front with no shared accounting. A 1,500-line C++ daemon (90% ledger, mutex, book-before-build, KV swap) admits all three."
        metrics={[{ label: 'Ledger', value: '90% cap' }, { label: 'Naive', value: '1 survivor' }, { label: 'Daemon', value: '3 alive' }, { label: 'Steady', value: '926 MiB' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/vram_conductor.svg" alt="VRAM conductor" title="Naive OOM vs Ledger" caption="Pre-reservation without accounting is a coin flip past 80% full." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'story', icon: '💀', label: '1. OOM Story + Fix', desc: 'Why processes die' },
          { id: 'sim', icon: '🔬', label: '2. Ledger Sim', desc: 'Admit/deny walk' },
          { id: 'code', icon: '🛠️', label: '3. Ledger Code', desc: 'Mutex + unwind' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'story' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          {OOM_STORY.map((s, i) => (
            <Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${s.result.includes('Survives') ? '#5EC4C8' : '#ef4444'}` }}>
              <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <strong style={{ color: 'white', fontSize: '12px', fontFamily: 'monospace' }}>{s.step}</strong>
                <Badge variant="subtle" style={{ fontSize: '9px', background: s.result.includes('Survives') ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: s.result.includes('Survives') ? '#5EC4C8' : '#ef4444' }}>{s.result}</Badge>
              </Flex>
              <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginTop: '4px' }}>{s.vram}</div>
            </Card>
          ))}
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2]">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Ledger rules:</strong>
              {LEDGER_RULES.map((l, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{l.rule}:</span> {l.why}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>KV-swap DECODE walk:</strong>
              {KV_SWAP.map((k, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>{k.call} → evict:{k.evicted} restore:{k.restored} ({k.what})</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#F5A623' }}>5G CAC déjà vu:</strong>
              {CAC_ANALOGY.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{c.telecom}</span> = {c.gpu}</div>))}
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Admission ledger simulator (8GB card, 90% cap)</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>REGISTER QUEUE:</strong>
              <Stack gap={2}>{QUEUE.map(m => (
                <label key={m} style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', cursor: 'pointer' }}><input type="checkbox" checked={queue.includes(m)} onChange={() => toggle(m)} /> {m}</label>
              ))}</Stack>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '8px' }}>llama 6536 · qwen 1536 · smol 1536 MiB (KV-heavy, like the article)</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${r.rows.every(x => x.ok) ? '#5EC4C8' : '#ef4444'}` }}>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>cap {r.cap} MiB · booked {r.usedMB}</div>
              {r.rows.map((x, i) => (<div key={i} style={{ fontSize: '12px', fontFamily: 'monospace', color: x.ok ? '#5EC4C8' : '#ef4444', marginTop: '4px' }}>{x.ok ? 'OK' : 'ERR DENY'} {x.model} ({x.need} MiB) → {x.usedAfter}</div>))}
              <div style={{ fontSize: '11px', color: 'white', fontWeight: 'bold', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{r.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Compare-and-bump ledger + unwind discipline</h3></div>
          <CodeBlock language="python" code={PYTHON_LEDGER_CODE} />
          <Callout type="success"><strong>Author's honest scope:</strong> {OUT_OF_SCOPE.join(' · ')}</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
