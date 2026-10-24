import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { MODALITY_TABLE, VLM_TABLE, ROUTE_MODALITY, PIPELINE_STAGES, PYTHON_MMRAG_CODE, PYTHON_MVRAG_PIPELINE, SIM_PIPELINE_COST } from './mmragEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function MultimodalRAGTab() {
  const [sub, setSub] = useState('modal');
  const [scan, setScan] = useState(30); const [chart, setChart] = useState(20);
  const [photo, setPhoto] = useState(10); const [table, setTable] = useState(40);
  const [imgCount, setImgCount] = useState(18);
  const [skipKb, setSkipKb] = useState(25);
  const r = ROUTE_MODALITY({ scan, chart, photo, table });
  const pc = SIM_PIPELINE_COST(imgCount, 90, skipKb);
  const slider = (l, v, s) => (<div><label style={{ fontSize: '11px', color: 'white' }}>{l}: {v}%</label><input type="range" min="0" max="100" value={v} onChange={e => s(+e.target.value)} style={{ width: '100%' }} /></div>);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Multimodal RAG]"
        title="Pixels Need Pipelines — Route Every Page by Modality"
        description="Scans get OCR+layout, tables get grids, charts get DePlot, photos get SigLIP+VQA. Every modality cites geometry — bbox, rect, figure. Captions without verification are hallucinations with coordinates."
        metrics={[{ label: 'Modalities', value: '4' }, { label: 'Vision Line', value: '>30% Share' }, { label: 'Cite Rule', value: 'Geometry' }, { label: 'Chart Path', value: 'DePlot → SQL' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/multimodal_rag.svg" alt="Multimodal RAG" title="Modality Router + Citation Invariant" caption="Per-page routing; vision LLM budgeted past 30%; geometry citations everywhere." background="#090d16" maxWidth={1100} /></div>
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/multimodal_rag_pipeline.svg" alt="Multimodal RAG pipeline" title="Parse → Summarize → Store → Query" caption="Images as first-class retrievables: embed summaries, return raw pixels at answer time." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'modal', icon: '🖼️', label: '1. Modalities + VLMs', desc: '4 paths, 3 models' },
          { id: 'pipeline', icon: '📄', label: '2. PDF pipeline', desc: 'Parse → query' },
          { id: 'sim', icon: '🔬', label: '3. Router Sim', desc: 'Page mix → pipeline' },
          { id: 'code', icon: '🛠️', label: '4. Code', desc: 'Router + MVR' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'modal' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Modality</th><th style={{ textAlign: 'left', padding: '8px' }}>Embedding</th><th style={{ padding: '8px' }}>Cite</th><th style={{ textAlign: 'left', padding: '8px' }}>Trap</th></tr></thead>
            <tbody>{MODALITY_TABLE.map((m, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{m.mod}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{m.embed}</td><td style={{ padding: '8px', color: '#3A9B9F', fontFamily: 'monospace' }}>{m.cite}</td><td style={{ padding: '8px', color: '#ef4444' }}>{m.trap}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{VLM_TABLE.map((v, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{v.model}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>{v.role}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{v.note}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'pipeline' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>📄 Document pipeline (text + embedded images)</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Stage</th><th style={{ textAlign: 'left', padding: '8px' }}>Action</th><th style={{ textAlign: 'left', padding: '8px' }}>Stack</th><th style={{ textAlign: 'left', padding: '8px' }}>Trap</th></tr></thead>
            <tbody>{PIPELINE_STAGES.map((s, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{s.stage}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{s.action}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{s.lib}</td><td style={{ padding: '8px', color: '#ef4444' }}>{s.trap}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Embedded images in doc: {imgCount}</label>
              <input type="range" min={0} max={80} value={imgCount} onChange={e => setImgCount(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Skip threshold (KB): {skipKb}</label>
              <input type="range" min={5} max={120} step={5} value={skipKb} onChange={e => setSkipKb(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: 12, color: 'white' }}>≈ {pc.visionIndexCalls} vision calls at index</div>
              <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>{pc.advice}</div>
              <div style={{ fontSize: 11, color: '#3A9B9F', marginTop: 6 }}>{pc.retrieveNote}</div>
            </Card>
          </Grid>
          <Callout type="info"><strong>Dual architecture:</strong> modality router (above) for page-type ops pipelines; four-stage flow here for mixed PDFs via partition + multi-vector store.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Modality router simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              {slider('Scanned', scan, setScan)}{slider('Charts', chart, setChart)}{slider('Photos', photo, setPhoto)}{slider('Tables', table, setTable)}
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: '12px', color: 'white' }}>{r.pipeline}</div>
              <div style={{ fontSize: '12px', color: r.visionLLM.startsWith('REQUIRED') ? '#F5A623' : '#5EC4C8', fontWeight: 'bold', marginTop: '6px' }}>{r.visionLLM}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{r.cite}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Per-page ingest router</h3></div>
          <CodeBlock language="python" code={PYTHON_MMRAG_CODE} />
          <div><h3 style={{ margin: '16px 0 0' }}>🛠️ PDF multi-vector pipeline</h3></div>
          <CodeBlock language="python" code={PYTHON_MVRAG_PIPELINE} />
          <Callout type="success"><strong>Numbers rule:</strong> chart/table figures get extracted to data first, then answered via SQL/text — never read pixels as prose when a grid exists.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
