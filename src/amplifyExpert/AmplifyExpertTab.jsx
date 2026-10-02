import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { THESIS, TWO_CAMPS, FOUR_CONDITIONS, THREE_DISCIPLINES, FOUR_BRICKS, SIX_POSITIONS, CHECK_FIT, PYTHON_MANIFEST_CODE } from './expertEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function AmplifyExpertTab() {
  const [sub, setSub] = useState('thesis');
  const [conds, setConds] = useState({ known: true, experts: true, amplify: true, audit: true });
  const toggle = (k) => setConds(c => ({ ...c, [k]: !c[k] }));
  const fit = CHECK_FIT(conds.known, conds.experts, conds.amplify, conds.audit);
  const fc = fit.score === '4/4' ? '#5EC4C8' : fit.score.startsWith('3') ? '#F5A623' : '#ef4444';
  const condLabel = { known: 'Known document context', experts: 'Accessible experts', amplify: 'Amplification goal', audit: 'Audit required' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Amplify the Expert]"
        title="Amplify the Expert — Scale Judgment, Don't Replace It"
        description="Enterprise RAG that mirrors trusted expert method (keywords → TOC → cited answers) instead of opaque vectors. Four conditions decide fit; three disciplines and six positions follow mechanically."
        metrics={[{ label: 'Thesis', value: '1 sentence' }, { label: 'Conditions', value: '4 gates' }, { label: 'Disciplines', value: '3' }, { label: 'Positions', value: '6 follow' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/amplify_expert.svg" alt="Amplify the expert" title="Two Camps + Bridge" caption="Opaque pipelines lose trust; Ctrl+F doesn't scale. The bridge scales trusted method." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'thesis', icon: '📜', label: '1. Thesis + Camps', desc: 'Why experts matter' },
          { id: 'sim', icon: '🔬', label: '2. Fit Checker', desc: 'Do conditions hold?' },
          { id: 'code', icon: '🛠️', label: '3. Bricks + Code', desc: 'Disciplines, gate' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'thesis' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Card style={{ padding: '14px', background: '#090d16', borderLeft: '4px solid #F0A89A' }}>
            <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold' }}>"{THESIS}"</div>
          </Card>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{TWO_CAMPS.map((c, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 2 ? '#5EC4C8' : '#64748b'}` }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{c.camp}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{c.builds}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>trusts: {c.trusts}</div></Card>))}</Grid>
          <Callout type="success"><strong>History rhymes:</strong> 2015–20 enterprise ML failed copying Google (≈85% stalled) for the same sins — generality over domain anchoring. RAG repeats it; domain-specific RAG is the same answer that worked.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Fit checker — the thesis admits its boundary</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>FOUR CONDITIONS:</strong>
              <Stack gap={2}>{Object.entries(condLabel).map(([k, label]) => (
                <label key={k} style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}><input type="checkbox" checked={conds[k]} onChange={() => toggle(k)} /> {label}</label>
              ))}</Stack>
              <div style={{ marginTop: '10px' }}>{FOUR_CONDITIONS.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{c.cond}:</span> {c.test}</div>))}</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${fc}` }}>
              <div style={{ fontSize: '20px', color: fc, fontWeight: 'bold' }}>{fit.score}</div>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>{fit.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{fit.note}</div>
            </Card>
          </Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>If…</th><th style={{ textAlign: 'left', padding: '8px' }}>…then (mechanically)</th></tr></thead>
            <tbody>{SIX_POSITIONS.map((s, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: '#F5A623' }}>{s.if}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{s.then}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Disciplines, bricks, and the fit gate</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{THREE_DISCIPLINES.map((d, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{d.d}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{d.rule}</div><div style={{ fontSize: '11px', color: '#F5A623', fontFamily: 'monospace' }}>test: {d.test}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{FOUR_BRICKS.map((b, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{b.brick}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>mirrors: {b.mirrors}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>× {b.amplifies}</div></Card>))}</Grid>
          <CodeBlock language="python" code={PYTHON_MANIFEST_CODE} />
          <Callout type="success"><strong>Lineage:</strong> Tetlock (expert judgment) · Norman (tool-as-amplifier) · Bainbridge (ironies of automation) · Anthropic (workflows over agents). Same direction, deeper roots.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
