import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  REPRESENTATION_LEVELS, DIAGNOSTIC_FIELDS, OPERATIONS,
  QUESTION_TYPES, REAL_EXAMPLES, DISPATCH, RUN_TABLE_PROJECTION,
  PYTHON_TABLE_GRID_CODE
} from './tableGridEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function TableGridRAGTab() {
  const [activeSubTab, setActiveSubTab] = useState('levels');
  const [parse, setParse] = useState('partial');
  const [size, setSize] = useState('large');
  const [header, setHeader] = useState('continuation');
  const [continuity, setContinuity] = useState('continued-from-N');
  const [ratio, setRatio] = useState(26);
  const [question, setQuestion] = useState('cell');
  const [stateF, setStateF] = useState('CA');
  const [covF, setCovF] = useState('property');

  const dispatch = DISPATCH({ parse, size, header, continuity, ratio, question });
  const proj = RUN_TABLE_PROJECTION(stateF, covF);
  const sel = { background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', width: '100%', marginBottom: '8px' };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Tables: Don't Flatten the Grid]"
        title="Tables in PDFs: Restore the Grid, Don't Flatten It"
        description="The number lives at row × column. Flatten to text and the intersection is gone. Diagnostic table_df_meta + 5 composable ops (O1–O5) + dispatcher keep tables as data."
        metrics={[
          { label: 'Pattern', value: 'Diagnose → Compose Ops' },
          { label: 'Levels', value: 'A · B · C · D' },
          { label: 'Operations', value: 'O1–O5 Idempotent' },
          { label: 'Answer Modes', value: 'Cell · Slice · SQL' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage moduleId="rag_architecture" src="/assets/table_grid_rag.svg" alt="Table grid diagnostic and ops" title="Flattening Fails → Diagnostic → Ops → Answer" caption="Top: flattened intersection loss vs diagnostic meta vs 4 levels. Middle: O1–O5 composition. Bottom: parser evidence + question modulator." background="#090d16" maxWidth={1100} />
        </div>

        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {[
            { id: 'levels', icon: '▦', label: '1. 4 Levels + Failures', desc: 'Why flattening loses answers' },
            { id: 'dispatch', icon: '🔀', label: '2. Dispatcher Simulator', desc: 'Diagnostic → op composition' },
            { id: 'ops', icon: '⚙️', label: '3. O1–O5 + Questions', desc: 'Ops cards + answer modes' },
            { id: 'code', icon: '🛠️', label: '4. Evidence + Code', desc: 'Real docs + Python' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{ flex: 1, minWidth: '210px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}><span>{tab.icon}</span><span>{tab.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'levels' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>▦ Why tables break + 4 representation levels</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>PDF table = drawn rectangles + positioned text, no row/column markers. Three simultaneous failures: structure lost → label/value split; header on p1 only → later pages are noise; no rows → line-citation (Art.8) can't point at "row 47". Fix: restore native structured form early.</p></div>
                <Stack gap={3}>
                  {REPRESENTATION_LEVELS.map(l => (
                    <Card key={l.id} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${l.id === 'A' ? '#5EC4C8' : l.id === 'B' ? '#F5A623' : l.id === 'C' ? '#5EC4C8' : '#64748b'}` }}>
                      <Flex justify="space-between" align="center"><strong style={{ color: 'white' }}>Level {l.id}: {l.name}</strong><Badge variant="subtle" style={{ fontSize: '9px', background: 'rgba(56,189,248,0.15)', color: '#3A9B9F' }}>{l.shape}</Badge></Flex>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{l.when}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3A9B9F', marginTop: '4px' }}>{l.example}</div>
                    </Card>
                  ))}
                </Stack>
                <Callout type="success"><strong>No decision tree:</strong> dimensions aren't mutually exclusive (native + long + headerless + table-dominant is valid). Use per-table diagnostic + idempotent ops instead.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'dispatch' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🔀 Dispatcher Simulator — table_df_meta → composition</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Five orthogonal diagnostic columns drive op selection. Try the NIST preset (partial + continued + 26%) vs a clean small table.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>DIAGNOSTIC INPUT:</strong>
                    <label style={{ fontSize: '11px', color: 'white' }}>Parse quality</label>
                    <select value={parse} onChange={e => setParse(e.target.value)} style={sel}><option value="perfect">perfect — clean grid</option><option value="partial">partial — irregular, bboxes known</option><option value="failed">failed — scanned / no grid</option></select>
                    <label style={{ fontSize: '11px', color: 'white' }}>Size</label>
                    <select value={size} onChange={e => setSize(e.target.value)} style={sel}><option value="small">small — fits context</option><option value="large">large — exceeds budget</option></select>
                    <label style={{ fontSize: '11px', color: 'white' }}>Header</label>
                    <select value={header} onChange={e => setHeader(e.target.value)} style={sel}><option value="present">present</option><option value="absent">absent</option><option value="continuation">continuation (lives earlier)</option></select>
                    <label style={{ fontSize: '11px', color: 'white' }}>Continuity</label>
                    <select value={continuity} onChange={e => setContinuity(e.target.value)} style={sel}><option value="autonomous">autonomous</option><option value="continued-from-N">continued-from-N</option><option value="continues-to-M">continues-to-M</option></select>
                    <label style={{ fontSize: '11px', color: 'white' }}>Table-area ratio: {ratio}%</label>
                    <input type="range" min="2" max="80" value={ratio} onChange={e => setRatio(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
                    <label style={{ fontSize: '11px', color: 'white' }}>Question type</label>
                    <select value={question} onChange={e => setQuestion(e.target.value)} style={sel}><option value="cell">cell lookup</option><option value="column">range / column</option><option value="aggregate">aggregate</option></select>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>COMPOSITION: {dispatch.composition}</strong>
                    <div style={{ fontSize: '11px', color: 'white', marginTop: '6px' }}>Level: {dispatch.level}</div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '4px' }}>Answer: {dispatch.answer}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '8px' }}>AUDIT TRAIL:</div>
                    {dispatch.audit.map((a, i) => (<div key={i} style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-secondary)' }}>{i + 1}. {a}</div>))}
                  </Card>
                </Grid>
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '12px' }}>Projection demo — flatten vs addressable grid</strong>
                    <Flex gap="var(--ds-space-2)">
                      <select value={covF} onChange={e => setCovF(e.target.value)} style={{ ...sel, width: 'auto', marginBottom: 0 }}><option value="property">property</option><option value="liability">liability</option><option value="auto">auto</option></select>
                      <select value={stateF} onChange={e => setStateF(e.target.value)} style={{ ...sel, width: 'auto', marginBottom: 0 }}><option value="CA">CA</option><option value="TX">TX</option></select>
                    </Flex>
                  </Flex>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                    <div><div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>FLATTENED ({proj.flattenedChars} chars, {proj.flattenedRows} rows of noise):</div>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-tertiary)' }}>label … value … which row is wheat?</div></div>
                    <div><div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>PROJECTED (O3): {proj.cellAnswer}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#3A9B9F' }}>{proj.sql}</div></div>
                  </Grid>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'ops' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>⚙️ Five ops + question modulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Each op takes table_df → returns table_df. Idempotent: non-matching precondition = no-op. O4 is the B→C/D promotion.</p></div>
                <Stack gap={3}>
                  {OPERATIONS.map(o => (
                    <Card key={o.id} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${o.id === 'O5' ? '#ef4444' : o.id === 'O4' ? '#5EC4C8' : '#5EC4C8'}` }}>
                      <Flex justify="space-between" align="center"><strong style={{ color: 'white' }}>{o.id}: {o.name}</strong><Badge variant="subtle" style={{ fontSize: '9px' }}>{o.cost}</Badge></Flex>
                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '6px' }}>
                        <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>When: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{o.pre}</span></div>
                        <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Does: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{o.does}</span></div>
                        <div><span style={{ color: '#ef4444', fontWeight: 'bold' }}>Fails: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{o.fail}</span></div>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {QUESTION_TYPES.map((q, i) => (
                    <Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F0A89A' }}>
                      <div style={{ fontSize: '11px', color: '#C47A6A', fontWeight: 'bold' }}>{q.type}</div>
                      <div style={{ fontSize: '11px', color: 'white' }}>"{q.q}"</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{q.path}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>cite: {q.cite}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🛠️ Evidence on real docs + dispatcher code</h3></div>
                <Stack gap={3}>
                  {REAL_EXAMPLES.map((e, i) => (
                    <Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '12px', color: 'white' }}>{e.doc}</strong>
                      <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>Diagnostic: {e.diag}</div>
                      <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '2px' }}>Fix: {e.fix}</div>
                    </Card>
                  ))}
                </Stack>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Diagnostic field</th><th style={{ textAlign: 'left', padding: '8px' }}>Values</th><th style={{ textAlign: 'left', padding: '8px' }}>Drives</th></tr></thead>
                    <tbody>{DIAGNOSTIC_FIELDS.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{d.field}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{d.values.join(' · ')}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{d.drives}</td></tr>))}</tbody>
                  </table>
                </div>
                <CodeBlock language="python" code={PYTHON_TABLE_GRID_CODE} />
                <Callout type="success"><strong>Out of scope (follow-ups):</strong> cross-doc table joins (schema alignment), purely visual tables (hue/size encodings), complex OCR, long structured forms (forms ≠ tables — route by diagnostic).</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
