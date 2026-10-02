import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { TECHNIQUES, MEMORY_PLAN, PYTHON_PANDAS_CODE } from './pandasEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function PandasMemTab() {
  const [sub, setSub] = useState('tricks');
  const [use, setUse] = useState([1, 2, 3, 4, 5, 6]);
  const [rowsK, setRowsK] = useState(100);
  const [catPct, setCatPct] = useState(40);
  const [nanPct, setNanPct] = useState(20);
  const toggle = (n) => setUse(u => u.includes(n) ? u.filter(x => x !== n) : [...u, n]);
  const r = MEMORY_PLAN(rowsK, 25, catPct, nanPct, use);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="data_platform" moduleLabel="Data & Platform Layers [Pandas Memory]"
        title="137MB → ~15MB: Seven Cuts, Zero Dependencies"
        description="Inplace over copies, usecols over everything, downcast/category/sparse dtypes, dtypes-at-read, chunksize streaming — with every caveat attached."
        metrics={[{ label: 'Reference', value: '137 MB' }, { label: 'Best Cut', value: 'usecols 9x' }, { label: 'Category', value: '−75%' }, { label: 'Escape', value: 'Chunks' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="data_platform" src="/assets/pandas_mem.svg" alt="Pandas memory techniques" title="Seven Cuts + Order" caption="Subset at read, tighten after, stream the tail — measure with .info()." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'tricks', icon: '🔪', label: '1. Seven Cuts', desc: 'Rule + caveat each' },
          { id: 'sim', icon: '🔬', label: '2. Memory Planner', desc: 'Your frame, your MB' },
          { id: 'code', icon: '🛠️', label: '3. Tighten Code', desc: 'Composed pipeline' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tricks' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          {TECHNIQUES.map((t) => (
            <Card key={t.n} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${t.n === 2 ? '#5EC4C8' : t.n === 7 ? '#F5A623' : '#5EC4C8'}` }}>
              <strong style={{ color: 'white', fontSize: '12px' }}>#{t.n} {t.name} — <span style={{ color: '#3A9B9F' }}>{t.saves}</span></strong>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '4px' }}>
                <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Rule: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{t.rule}</span></div>
                <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>⚠ Caveat: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{t.caveat}</span></div>
              </Grid>
            </Card>
          ))}
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Memory planner — toggle cuts, watch MB</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Rows (k): {rowsK}</label>
              <input type="range" min={10} max={1000} step={10} value={rowsK} onChange={e => setRowsK(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Categorical cols: {catPct}%</label>
              <input type="range" min={0} max={100} step={5} value={catPct} onChange={e => setCatPct(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>NaN-heavy cols: {nanPct}%</label>
              <input type="range" min={0} max={100} step={5} value={nanPct} onChange={e => setNanPct(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5, 6].map(n => (<Button key={n} variant={use.includes(n) ? 'primary' : 'secondary'} size="sm" onClick={() => toggle(n)}>#{n}</Button>))}
              </Flex>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: '20px', color: 'white', fontFamily: 'monospace' }}>{r.baseMB} → {r.optMB} MB <span style={{ color: '#3A9B9F' }}>−{r.savedPct}%</span></div>
              {r.applied.map((a, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>✓ {a}</div>))}
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '6px' }}>{r.verdict}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Read-tight-process pipeline</h3></div>
          <CodeBlock language="python" code={PYTHON_PANDAS_CODE} />
          <Callout type="success"><strong>Order of operations:</strong> subset + dtypes at read (peak never materializes) → tighten resident → stream the tail. Measure every step with <span style={{ fontFamily: 'monospace' }}>.info()</span>.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
