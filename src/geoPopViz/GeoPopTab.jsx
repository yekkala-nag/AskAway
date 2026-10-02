import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { DATASETS, PIPELINE_STEPS, RESULTS, RASTER_VS_VECTOR, AGREEMENT, PYTHON_GEO_CODE } from './geoEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function GeoPopTab() {
  const [sub, setSub] = useState('data');
  const [level, setLevel] = useState('L1');
  const a = AGREEMENT(level);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="data_platform" moduleLabel="Data & Platform Layers [Geospatial Population]"
        title="Two Maps, One Vietnam — Grid vs Points, 97M vs 98M"
        description="WorldPop 100m raster against Facebook 30m vectors, masked by GADM polygons in a notebook anyone can rerun. National agreement, district divergence — the question picks the source."
        metrics={[{ label: 'WP Total', value: '97.34M' }, { label: 'FB Total', value: '98.16M' }, { label: 'GADM L1–L3', value: '63·686·7658' }, { label: 'Rule', value: '45° test' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="data_platform" src="/assets/geo_pop.svg" alt="Population maps" title="Raster + Vector → Masked Counts" caption="Same country, two methodologies; divergence lives at district level." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'data', icon: '🗺️', label: '1. Data + Pipeline', desc: '3 sources, 4 steps' },
          { id: 'sim', icon: '🔬', label: '2. Agreement Sim', desc: 'Level → guidance' },
          { id: 'code', icon: '🛠️', label: '3. Geo Code', desc: 'Mask + choropleth' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'data' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Callout type="success"><strong>Read this generally:</strong> Vietnam is the demo dataset, not the subject. The transferable skill is raster-vs-vector thinking — gridded surfaces vs exact boundaries, masking one by the other, and letting the question pick the source.</Callout>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{DATASETS.map((d, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{d.src}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{d.form}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{d.role}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{PIPELINE_STEPS.map((s, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{s.step}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.detail}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{s.lib}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Level</th><th style={{ padding: '8px' }}>WorldPop</th><th style={{ padding: '8px' }}>Facebook</th><th style={{ textAlign: 'left', padding: '8px' }}>Read</th></tr></thead>
            <tbody>{RESULTS.map((r2, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r2.level}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontFamily: 'monospace' }}>{r2.wp}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F', fontFamily: 'monospace' }}>{r2.fb}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r2.read}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Source-agreement simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>ADMIN LEVEL:</strong>
              <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                {['L0', 'L1', 'L2', 'L3'].map(l => (<Button key={l} variant={level === l ? 'primary' : 'secondary'} size="sm" onClick={() => setLevel(l)}>{l}</Button>))}
              </Flex>
              <div style={{ marginTop: '10px' }}>{RASTER_VS_VECTOR.map((r2, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'white' }}>{r2.q}</span> — raster: {r2.raster} · vector: {r2.vector}</div>))}</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${a.color}` }}>
              <div style={{ fontSize: '12px', color: 'white' }}>Level {level}: correlation ≈ {a.corr}</div>
              <div style={{ fontSize: '12px', color: a.color, marginTop: '4px' }}>{a.gap}</div>
              <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', marginTop: '6px' }}>{a.use}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{a.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Boundaries + raster + mask code</h3></div>
          <CodeBlock language="python" code={PYTHON_GEO_CODE} />
          <Callout type="success"><strong>Policy lesson:</strong> notebooks (JPNE) put code, prose, and visuals where domain experts already are — collaboration beats handoff. Neither source is truth; the comparison is the product.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
