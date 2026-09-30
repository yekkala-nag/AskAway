import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  FLAT_PILE_FAILURE_MODES,
  CORPUS_SHAPES_TAXONOMY,
  SAMPLE_NIST_CORPUS,
  RUN_CORPUS_BENCHMARK_SIMULATOR,
  PYTHON_CORPUS_SHAPES_CODE
} from './corpusEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: diagnose the corpus shape, then pick the architecture it deserves. */
function CorpusShapesPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };
  return (
    <Panel
      title="Three Kinds of RAG Corpus & Architecture Selection"
      sub="A flat pile of vectors fails in predictable ways; three diagnostic questions reveal the corpus shape, and the shape picks the architecture."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#E8836A" icon="zap" title="1. Flat-Pile Failure Modes">
          <div style={flow}>One naive vector store over a random assortment.</div>
          <ul style={pts}>
            <li>Vocabulary drift across conflicting terminologies</li>
            <li>Cross-file bleeding into unrelated text</li>
            <li>Multi-doc dilution, missing-file silence</li>
            <li>Supersession failure — stale versions win</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="help" title="2. Three Diagnostic Questions">
          <div style={flow}>Unstructured? Typed content? Logically bundled?</div>
          <ul style={pts}>
            <li>Pile of unrelated PDFs</li>
            <li>Homogeneous typed corpus — invoices, contracts, emails</li>
            <li>Case-file bundles — client info, briefs, exhibits</li>
          </ul>
        </GlassCard>
        <GlassCard color="#6A9BD8" icon="cpu" title="3. Architecture Selection">
          <div style={flow}>Match the engine to the shape.</div>
          <ul style={pts}>
            <li>Naive for-loop baseline — slow, exhaustive, a starting point</li>
            <li>Metadata table indexing — doc_type / client filters, precise</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function RAGCorpusShapesTab() {
  const [activeSubTab, setActiveSubTab] = useState('failures'); // 'failures' | 'taxonomy' | 'benchmark' | 'code'

  // Diagnostic Wizard State
  const [q1Relations, setQ1Relations] = useState(true);
  const [q2UniversalFields, setQ2UniversalFields] = useState(true);
  const [q3Bundles, setQ3Bundles] = useState(false);

  // Benchmark State
  const [benchArch, setBenchArch] = useState('naive_loop'); // 'naive_loop' | 'metadata_index'
  const benchResult = RUN_CORPUS_BENCHMARK_SIMULATOR(benchArch);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Corpus Taxonomy & Selection]"
        title="Three Kinds of RAG Corpus, and What It Costs to Build for the Wrong One"
        description="Stop embedding entire folders into flat vector stores. Learn the 5 failure modes of flat piles, answer 3 diagnostic business questions, and select the correct architecture (Unrelated Pile, Homogeneous Typed Corpus, or Case Bundles)."
        metrics={[
          { label: 'Corpus Shapes', value: '3 Distinct Architectures' },
          { label: 'Diagnostic Test', value: '3 Business Questions' },
          { label: 'Wasted LLM Calls', value: '80% ➔ 0% with Metadata' },
          { label: 'Pre-Filter Scope', value: '250k Files ➔ 3 Files' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <CorpusShapesPanel />
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
            { id: 'failures', icon: '💥', label: '1. Flat-Pile Vector Store Failures', desc: '5 ways naive vector search fails' },
            { id: 'taxonomy', icon: '❓', label: '2. 3 Diagnostic Questions & Shapes', desc: 'Corpus classification wizard' },
            { id: 'benchmark', icon: '📊', label: '3. 5-PDF Baseline Benchmark', desc: '80% wasted call benchmark' },
            { id: 'code', icon: '🛠️', label: '4. Production Python & Metadata Code', desc: 'Corpus profiling & SQL pre-filter' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
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

        {/* ─── SUBTAB 1: FLAT-PILE FAILURE MODES ─── */}
        {activeSubTab === 'failures' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💥 5 Ways a Flat Vector Store Fails at Enterprise Scale</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Embedding every page of every file into one vector store without metadata indexing causes 5 independent failure modes that rerankers cannot fix.
                  </p>
                </div>

                <Stack gap={3}>
                  {FLAT_PILE_FAILURE_MODES.map((f, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#ef4444', display: 'block', marginBottom: '4px' }}>
                        {f.mode}
                      </strong>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Trigger Symptom:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{f.symptom}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Flat-Pile Outcome:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#ef4444' }}>{f.flatPileOutcome}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Required Architectural Fix:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>{f.fix}</div>
                        </div>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 3 DIAGNOSTIC QUESTIONS & SHAPES ─── */}
        {activeSubTab === 'taxonomy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>❓ The 3 Diagnostic Business Questions Wizard</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Answer 3 quick business questions before writing ingestion code to determine the exact shape and architecture for your document collection.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '10px' }}>
                      INTERACTIVE DIAGNOSTIC QUESTIONS:
                    </strong>

                    <Stack gap={3}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>
                          Q1: Do two documents ever point at each other? (Amendments, renewals, certificates)
                        </label>
                        <select
                          value={q1Relations ? 'yes' : 'no'}
                          onChange={e => setQ1Relations(e.target.value === 'yes')}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        >
                          <option value="yes">YES — Need Version Chain & Validity Dates</option>
                          <option value="no">NO — Standalone documents</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>
                          Q2: Can users name universal fields that EVERY document carries with identical meaning?
                        </label>
                        <select
                          value={q2UniversalFields ? 'yes' : 'no'}
                          onChange={e => setQ2UniversalFields(e.target.value === 'yes')}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        >
                          <option value="yes">YES — Homogeneous Typed Corpus (Invoices, Contracts)</option>
                          <option value="no">NO — Unrelated PDF pile</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>
                          Q3: Do documents arrive in case bundles about a single entity? (Claim folders, medical records)
                        </label>
                        <select
                          value={q3Bundles ? 'yes' : 'no'}
                          onChange={e => setQ3Bundles(e.target.value === 'yes')}
                          style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                        >
                          <option value="yes">YES — Case File Bundles</option>
                          <option value="no">NO — Independent files</option>
                        </select>
                      </div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      RECOMMENDED ARCHITECTURE & SELECTION:
                    </strong>

                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'white', fontWeight: 'bold', marginBottom: '6px' }}>
                      {q2UniversalFields && q3Bundles ? 'Shape 3: Case File Bundles' : q2UniversalFields ? 'Shape 2: Homogeneous Typed Corpus' : 'Shape 1: Pile of Unrelated PDFs'}
                    </div>

                    <div style={{ fontSize: '11px', color: '#3A9B9F', marginBottom: '8px' }}>
                      Preparation Strategy: {q2UniversalFields && q3Bundles ? 'Assemble bundle manifest first; run cross-file comparison.' : q2UniversalFields ? 'Build SQL Metadata Index (`doc_type = X AND client = Y`).' : 'Summary lines per file + Hierarchical TOC routing.'}
                    </div>

                    <div style={{ fontSize: '11px', color: q1Relations ? '#F5A623' : 'var(--ds-color-text-tertiary)' }}>
                      Version Dimension: {q1Relations ? 'MUST add `valid_from` & `valid_to` columns to filter active versions.' : 'Standard single-version indexing.'}
                    </div>
                  </Card>
                </Grid>

                <Stack gap={3}>
                  {CORPUS_SHAPES_TAXONOMY.map((s, idx) => (
                    <Card key={idx} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F', display: 'block', marginBottom: '4px' }}>
                        {s.shape}
                      </strong>
                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)" style={{ fontSize: 'var(--ds-font-size-caption)' }}>
                        <div>Characteristics: <span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.characteristics}</span></div>
                        <div>Architecture: <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{s.architecture}</span></div>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: 5-PDF BASELINE BENCHMARK ─── */}
        {activeSubTab === 'benchmark' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 5-PDF Baseline Waste Benchmark</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Demonstrating what happens when you wrap a single-document pipeline in a naive for-loop over 5 NIST PDFs vs pre-filtering via Metadata Table Indexing.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '10px' }}>
                      ARCHITECTURE BENCHMARK SELECTOR:
                    </strong>

                    <select
                      value={benchArch}
                      onChange={e => setBenchArch(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px', marginBottom: '10px' }}
                    >
                      <option value="naive_loop">Naive For-Loop Baseline (All 5 PDFs)</option>
                      <option value="metadata_index">Metadata Table Indexing (Pre-filtered)</option>
                    </select>

                    <Stack gap={2} style={{ fontSize: '11px' }}>
                      <div>Applied Filter: <span style={{ color: '#3A9B9F', fontFamily: 'monospace' }}>{benchResult.queryFilterApplied}</span></div>
                      <div>Total Documents Evaluated: <span style={{ color: 'white' }}>{benchResult.totalDocuments} PDFs</span></div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${benchArch === 'metadata_index' ? '#5EC4C8' : '#ef4444'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: benchArch === 'metadata_index' ? '#5EC4C8' : '#ef4444' }}>
                        BENCHMARK PERFORMANCE
                      </strong>
                      <Badge variant="subtle" style={{ background: benchArch === 'metadata_index' ? 'rgba(46,204,140,0.15)' : 'rgba(239,68,68,0.15)', color: benchArch === 'metadata_index' ? '#5EC4C8' : '#ef4444', fontSize: '9px' }}>
                        WASTED CALLS: {benchResult.wastedCallPct}%
                      </Badge>
                    </Flex>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginBottom: '8px' }}>
                      <div>Wall-Time: <span style={{ color: 'white', fontWeight: 'bold' }}>{benchResult.totalWallTimeSec}s</span></div>
                      <div>Wasted LLM Calls: <span style={{ color: benchArch === 'metadata_index' ? '#5EC4C8' : '#ef4444', fontWeight: 'bold' }}>{benchResult.wastedCalls} / {benchResult.totalDocuments}</span></div>
                    </Grid>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>Result Document:</div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>
                      {benchResult.retrievedResult}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION PYTHON & METADATA CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python Corpus Classifier & Metadata Filter Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete Python reference implementation for corpus classification and SQL/metadata pre-filtering before embedding retrieval.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_CORPUS_SHAPES_CODE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author details or unredacted PII. 100% public domain NIST dataset mock.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
