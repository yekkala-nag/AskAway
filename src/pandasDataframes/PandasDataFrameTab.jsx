import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  DATA_STRUCTURES_COMPARISON,
  ARRAY_DIMENSIONS_DATA,
  DATAFRAME_CONSTRUCTION_WORKFLOWS,
  RUN_DATAFRAME_OPERATION,
  PYTHON_PANDAS_ADVANCED_CODE
} from './pandasEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: lists → numpy → DataFrames → creation workflows. */
function PandasPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '8px 10px', marginTop: 8, lineHeight: 1.7, whiteSpace: 'pre-wrap',
  };
  return (
    <Panel
      title="Python Data Structures — NumPy vs Pandas DataFrames"
      sub="Heterogeneous lists, vectorized homogeneous arrays, and labeled in-memory tables — plus the three ways frames get built."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
        <GlassCard color="#6A9BD8" icon="clip" title="1. Python Lists">
          <div style={flow}>Heterogeneous elements, one by one.</div>
          <ul style={pts}>
            <li>Mixed types per list</li>
            <li>No vectorization</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="cpu" title="2. NumPy ndarrays">
          <div style={flow}>Homogeneous, vectorized operations.</div>
          <ul style={pts}>
            <li>1D arrays, 2D matrices, 3D arrays</li>
            <li>Typed dtypes: int64, float64</li>
          </ul>
        </GlassCard>
        <GlassCard color="#A78BFA" icon="table" title="3. DataFrame Core">
          <div style={flow}>In-memory tabular layout with metadata alignment.</div>
          <ul style={pts}>
            <li>Index (axis 0), columns (axis 1)</li>
            <li>Per-column dtypes; Series access</li>
            <li>data.shape · df.dtypes · df.loc alignment</li>
          </ul>
        </GlassCard>
        <GlassCard color="#34D399" icon="code" title="4. Creation Workflows">
          <div style={flow}>Three on-ramps into frames.</div>
          <div style={mono}>{'pd.DataFrame(data=..., index=..., columns=...)\npd.DataFrame(data=dict)\npd.read_csv("data.csv")'}</div>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function PandasDataFrameTab() {
  const [activeSubTab, setActiveSubTab] = useState('structures'); // 'structures' | 'ndarrays' | 'workflows' | 'operations' | 'code'
  const [selectedWorkflowIdx, setSelectedWorkflowIdx] = useState(0);
  const [selectedOp, setSelectedOp] = useState('head'); // 'head' | 'tail' | 'filter' | 'describe' | 'memory'
  const [filterVal, setFilterVal] = useState(25);

  const activeWorkflow = DATAFRAME_CONSTRUCTION_WORKFLOWS[selectedWorkflowIdx];
  const opResult = RUN_DATAFRAME_OPERATION(selectedOp, filterVal);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Pandas]"
        title="The Absolute Beginner’s Guide to Pandas DataFrames"
        description="Comprehensive interactive guide bridging SQL database tables, Python data structures, NumPy ndarrays, and Pandas DataFrames. Learn 2D tabular memory layout, vectorization, and production creation workflows."
        metrics={[
          { label: 'Core Object', value: 'pd.DataFrame' },
          { label: 'Underlying Engine', value: 'NumPy 2D ndarray' },
          { label: 'Responsible AI', value: '0 PII / 0 Author Info' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <PandasPanel />
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'structures', icon: '📊', label: '1. SQL vs Data Structures', desc: 'Lists vs Arrays vs DataFrames' },
            { id: 'ndarrays', icon: '🔢', label: '2. NumPy Ndarrays (1D/2D/3D)', desc: 'Vectors, Matrices & Tensors' },
            { id: 'workflows', icon: '🏗️', label: '3. Construction Workflows', desc: '4 creation methods' },
            { id: 'operations', icon: '🧪', label: '4. Operations Simulator', desc: 'head, tail, filter, describe, memory' },
            { id: 'code', icon: '🛠️', label: '5. Production Python Code', desc: 'Pandas initialization & profiling' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: DATA STRUCTURES & SQL ANALOGY ─── */}
        {activeSubTab === 'structures' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 SQL Tables vs Python In-Memory Data Structures</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Coming from SQL, data is stored in static database tables and columns. In Python data analysis, the core building blocks are in-memory data structures: Lists, NumPy Arrays, and Pandas DataFrames.
                  </p>
                </div>

                <Stack gap={3}>
                  {DATA_STRUCTURES_COMPARISON.map((ds, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                          {ds.name}
                        </strong>
                        <Badge variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                          {ds.type}
                        </Badge>
                      </Flex>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Homogeneity & Mutability:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                            {ds.homogeneity} ({ds.mutability})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '8px' }}>Best Used For:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                            {ds.bestFor}
                          </div>
                        </div>

                        <Card style={{ padding: '10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                          <strong style={{ fontSize: '10px', color: '#F5A623' }}>SYNTAX:</strong>
                          <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#3A9B9F', marginTop: '4px' }}>
                            {ds.syntax}
                          </div>
                        </Card>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: NUMPY NDARRAYS ─── */}
        {activeSubTab === 'ndarrays' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔢 NumPy Ndarrays (1D Vectors, 2D Matrices, 3D Tensors)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    NumPy arrays (`ndarray`) power vector math in Python. Pandas DataFrames build directly on top of 2D NumPy matrices.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {ARRAY_DIMENSIONS_DATA.map((dim, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F' }}>{dim.dim}</strong>
                        <Badge variant="subtle" style={{ fontSize: '9px', fontFamily: 'monospace' }}>Shape: {dim.shape}</Badge>
                      </Flex>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                        {dim.analogy}
                      </p>
                      <Card style={{ padding: '10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#A78BFA' }}>{dim.code}</div>
                        <div style={{ fontSize: '10px', color: '#3A9B9F', marginTop: '6px' }}>{dim.vectorizedExample}</div>
                      </Card>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: DATAFRAME CONSTRUCTION WORKFLOWS ─── */}
        {activeSubTab === 'workflows' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏗️ 4 Core DataFrame Creation Workflows</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Explore the four standard methods of constructing a Pandas DataFrame: 2D NumPy Array, Dictionary of Lists, List of Dictionaries, and CSV Stream (`pd.read_csv`).
                  </p>
                </div>

                <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                  {DATAFRAME_CONSTRUCTION_WORKFLOWS.map((wf, idx) => (
                    <Button
                      key={wf.id}
                      variant={selectedWorkflowIdx === idx ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedWorkflowIdx(idx)}
                    >
                      {wf.name}
                    </Button>
                  ))}
                </Flex>

                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                  <strong style={{ fontSize: 'var(--ds-font-size-body)', color: '#3A9B9F', display: 'block', marginBottom: '4px' }}>
                    {activeWorkflow.name}
                  </strong>
                  <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: '0 0 12px 0' }}>
                    {activeWorkflow.description}
                  </p>
                  <CodeBlock language="python" code={activeWorkflow.code} />
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: OPERATIONS SIMULATOR ─── */}
        {activeSubTab === 'operations' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧪 Interactive DataFrame Operations Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Execute live DataFrame methods: `df.head()`, `df.tail()`, relational filtering `df[df['val'] &gt; threshold]`, `df.describe()`, and `df.memory_usage(deep=True)`.
                  </p>
                </div>

                <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                  {[
                    { id: 'head', label: 'df.head(3)' },
                    { id: 'tail', label: 'df.tail(3)' },
                    { id: 'filter', label: 'df[df["metric_val"] &gt; threshold]' },
                    { id: 'describe', label: 'df.describe()' },
                    { id: 'memory', label: 'df.memory_usage(deep=True)' }
                  ].map(btn => (
                    <Button
                      key={btn.id}
                      variant={selectedOp === btn.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedOp(btn.id)}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </Flex>

                {selectedOp === 'filter' && (
                  <Flex gap={3} align="center">
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      Filter Threshold (metric_val &gt; {filterVal}):
                    </label>
                    <input type="range" min="10" max="50" value={filterVal} onChange={e => setFilterVal(Number(e.target.value))} style={{ width: '200px' }} />
                  </Flex>
                )}

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623' }}>PYTHON COMMAND:</strong>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3A9B9F', marginTop: '6px' }}>
                      {opResult.code}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>
                      {opResult.description}
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      RESULTING DATAFRAME IN-MEMORY OUTPUT ({opResult.title}):
                    </strong>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: '#3A9B9F' }}>
                            {opResult.columns.map((c, idx) => (
                              <th key={idx} style={{ padding: '6px' }}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {opResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              {opResult.columns.map((c, cIdx) => (
                                <td key={cIdx} style={{ padding: '6px', color: cIdx === 0 ? '#F5A623' : 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>
                                  {row[c]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python & Pandas Code Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference script for initializing DataFrames, performing vectorized transformations, and profiling memory usage.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_PANDAS_ADVANCED_CODE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author data or unredacted PII is stored or executed in this environment.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: TABLE + WORKFLOW + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🐼 Interactive Pandas Lab</h3>
            <Badge variant="module" moduleId="foundations">Compare · Construct · Explore</Badge>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <DataTable
            caption="Data Structure Comparison — List vs NumPy vs Pandas DataFrame"
            searchable
            initialSort={{ key: 'name', dir: 'asc' }}
            columns={[
              { key: 'name', label: 'Structure', sortable: false },
              { key: 'type', label: 'Engine', sortable: false },
              { key: 'homogeneity', label: 'Homogeneity', sortable: false },
              { key: 'vectorizedOps', label: 'Vectorized Ops', sortable: false },
              { key: 'bestFor', label: 'Best For', sortable: false },
            ]}
            rows={DATA_STRUCTURES_COMPARISON}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="Array Dimensions — Shape, Analogy & Vectorization"
            searchable={false}
            columns={[
              { key: 'dim', label: 'Dimension', sortable: false },
              { key: 'shape', label: 'Shape', sortable: false },
              { key: 'analogy', label: 'Real-World Analogy', sortable: false },
              { key: 'vectorizedExample', label: 'Vectorized Example', sortable: false },
            ]}
            rows={ARRAY_DIMENSIONS_DATA}
          />
        </Reveal>

        <Reveal variant="rise" delay={180}>
          <Workflow
            accent="foundations"
            accentLabel="Construction Patterns"
            title="Four Ways to Build a DataFrame"
            description="Step through the canonical construction paths. Hit ▶ Play to animate."
            steps={DATAFRAME_CONSTRUCTION_WORKFLOWS.map((w) => ({
              title: w.name, description: w.description, detail: w.code, icon: '🛠️',
            }))}
          />
        </Reveal>

        <Reveal variant="scale" delay={240}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Columnar Ops Speedup</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-foundations-primary)' }}>
                <AnimatedNumber value={4} suffix="×" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Vectorized columnar operations on a Pandas DataFrame run up to <strong>4× faster</strong> than Python-loop
              equivalents over the same data — the core reason tabular ML pipelines standardize on DataFrames.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
