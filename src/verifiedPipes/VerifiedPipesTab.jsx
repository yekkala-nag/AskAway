import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { BREAKDOWN_STATS, WHY_REVIEW_FAILS, PIPELINE_GATES, WHERE_REVIEW_EARNS_KEEP, ESCAPE_MODEL, PYTHON_GATES_CODE } from './gatesEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function VerifiedPipesTab() {
  const [sub, setSub] = useState('breakdown');
  const [prs, setPrs] = useState(100);
  const [cover, setCover] = useState(30);
  const [strict, setStrict] = useState(70);
  const r = ESCAPE_MODEL(prs, cover, strict);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Verified Pipelines]"
        title="Review Is Theater at Agent Volume — Pipelines Verify"
        description="PRs up 98%, incidents per PR up 243%: no human audits a 40k-line agent PR they didn't reason through, and AI-reviewing-AI shares the blind spots. Policy-as-code gates verify every deployment; humans handle only exceptions."
        metrics={[{ label: 'PR Volume', value: '+98%' }, { label: 'Incidents/PR', value: '+243%' }, { label: 'AI Usage', value: '90%' }, { label: 'Fix', value: 'Gates, not gazes' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/verified_pipes.svg" alt="Verified pipelines" title="Theater vs Gates" caption="Volume broke review's assumptions; author-agnostic gates restore trust." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'breakdown', icon: '📉', label: '1. Breakdown + Gates', desc: 'Stats, beliefs, gates' },
          { id: 'sim', icon: '🔬', label: '2. Escape Simulator', desc: 'Volume × cover × gates' },
          { id: 'code', icon: '🛠️', label: '3. Gate Code', desc: 'Author-agnostic checks' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'breakdown' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{BREAKDOWN_STATS.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.stat}</div><div style={{ fontSize: '18px', color: '#ef4444', fontWeight: 'bold' }}>{s.value}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{s.note}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{WHY_REVIEW_FAILS.map((w, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>✕ {w.belief}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{w.fails}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{PIPELINE_GATES.map((g, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{g.gate}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{g.catches}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Escaped-bug simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>PRs/week: {prs}</label>
              <input type="range" min={10} max={500} step={10} value={prs} onChange={e => setPrs(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Human review cover: {cover}%</label>
              <input type="range" min={0} max={100} value={cover} onChange={e => setCover(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Gate strictness: {strict}%</label>
              <input type="range" min={0} max={100} value={strict} onChange={e => setStrict(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
              <div style={{ fontSize: '13px', color: 'white' }}><b style={{ color: '#ef4444' }}>{r.escapedPerWeek}</b> escaped/week → <b style={{ color: '#ef4444' }}>{r.incidentsPerWeek}</b> incidents</div>
              <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{r.note}</div>
            </Card>
          </Grid>
          <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
            <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Where review still earns keep:</strong>
            {WHERE_REVIEW_EARNS_KEEP.map((w, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>• {w}</div>))}
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Policy-as-code gate + review-worthiness check</h3></div>
          <CodeBlock language="python" code={PYTHON_GATES_CODE} />
          <Callout type="success"><strong>The line:</strong> pipeline verifies every deployment against rules, regardless of author. Review handles intent, product judgment, and novel shapes — nothing else.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
