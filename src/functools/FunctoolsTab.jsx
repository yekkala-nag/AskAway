import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { TRICKS, LINES_SAVED, PYTHON_FUNCTOOLS_CODE } from './functoolsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function FunctoolsTab() {
  const [sub, setSub] = useState('tricks');
  const [use, setUse] = useState(['total_ordering', 'partial', 'singledispatch']);
  const toggle = (id) => setUse(u => u.includes(id) ? u.filter(x => x !== id) : [...u, id]);
  const r = LINES_SAVED(use);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="data_platform" moduleLabel="Data & Platform Layers [functools Power Tricks]"
        title="Three Decorators That Delete Boilerplate"
        description="total_ordering derives 6 comparisons from 2 methods, partial freezes arguments into families, singledispatch routes by type instead of if-chains. Stdlib only, readable always — caveats attached."
        metrics={[{ label: 'Tricks', value: '3 + lru' }, { label: 'Line Cut', value: '~60%' }, { label: 'Deps', value: 'Zero' }, { label: 'Rule', value: 'Caveats first' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="data_platform" src="/assets/functools.svg" alt="functools tricks" title="Delete Boilerplate, Keep Warnings" caption="Each trick's savings paired with the caveat that bites." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'tricks', icon: '🐍', label: '1. Three Tricks', desc: 'Before/after each' },
          { id: 'sim', icon: '🔬', label: '2. Savings Sim', desc: 'Toggle + caveats' },
          { id: 'code', icon: '🛠️', label: '3. Runnable Code', desc: 'Copy-paste trio' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tricks' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          {TRICKS.map((t, i) => (
            <Card key={i} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <strong style={{ color: 'white', fontSize: '13px', fontFamily: 'monospace' }}>{t.name}</strong>
                <Badge variant="subtle" style={{ fontSize: '9px', background: 'rgba(16,185,129,0.15)', color: '#3A9B9F' }}>{t.lines[0]} → {t.lines[1]} lines</Badge>
              </Flex>
              <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '8px' }}>
                <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Use when: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{t.need}</span></div>
                <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Before → after: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{t.before} → {t.after}</span></div>
                <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>⚠ Caveat: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{t.caveat}</span></div>
              </Grid>
            </Card>
          ))}
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Savings + caveat board</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>APPLY TRICKS:</strong>
              <Stack gap={2}>{TRICKS.map(t => (
                <label key={t.id} style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', cursor: 'pointer' }}><input type="checkbox" checked={use.includes(t.id)} onChange={() => toggle(t.id)} /> {t.name}</label>
              ))}</Stack>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: '20px', color: 'white', fontFamily: 'monospace' }}>{r.before} → {r.after} <span style={{ color: '#3A9B9F' }}>−{r.savedPct}%</span></div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '8px' }}>CAVEATS ACTIVE:</div>
              {r.caveats.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>⚠ {c}</div>))}
              <div style={{ fontSize: '11px', color: 'white', marginTop: '8px' }}>{r.verdict}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ The trio, runnable</h3></div>
          <CodeBlock language="python" code={PYTHON_FUNCTOOLS_CODE} />
          <Callout type="success"><strong>Lineage note:</strong> pair with <span style={{ fontFamily: 'monospace' }}>@lru_cache</span> from the companion article for recursion + request memoization — same stdlib, same zero-cost discipline.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
