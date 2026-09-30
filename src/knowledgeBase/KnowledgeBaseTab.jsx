import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  TOP_10_SEED_QUESTIONS,
  RAW_CORPUS_SAMPLES,
  INDEXING_STRATEGIES,
  LIFECYCLE_STAGES
} from './kbEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: five pillars from ingestion to freshness. */
function KnowledgeBasePanel() {
  return (
    <Panel
      title="How to Build an Efficient Knowledge Base"
      sub="Ingest broadly, clean ruthlessly, chunk atomically, index by shape, and never stop evaluating freshness."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="file" index="1." title="Ingestion + Question Seeding" detail="Loaders pull PDFs, docs, and wikis into a base corpus; top-10 essential QA pairs seed coverage from day one." />
        <GlassBar color="#6A9BD8" icon="refresh" index="2." title="Cleansing & Dedup Engine" detail="Strip boilerplate headers, footers, and noise; merge near-duplicates into one refined knowledge base." />
        <GlassBar color="#A78BFA" icon="clip" index="3." title="Atomic Chunking + RBAC Tags" detail="Fixed-size and hierarchical semantic chunks at optimal granularity, each tagged Admins:RW, Engineers:RO, Finance:Deny." />
        <GlassBar color="#E8C558" icon="search" index="4." title="Index Selection Matrix" detail="Flat O(N) for exact search, IVF O(N/C) balanced, HNSW O(log N) ultra-low latency — pick against the sub-10ms SLA." />
        <GlassBar color="#34D399" icon="chart" index="5." title="Eval Loop + Freshness TTLs" detail="Precision/recall and latency dashboards, periodic re-embedding, time-to-live freshness — feeding incremental updates back to ingestion." />
      </div>
    </Panel>
  );
}

export default function KnowledgeBaseTab() {
  const [activeSubTab, setActiveSubTab] = useState('lifecycle'); // 'lifecycle' | 'cleanse' | 'rbac' | 'indexing' | 'freshness' | 'code'
  const [activeLifecycleStage, setActiveLifecycleStage] = useState(0);
  const [activeCorpusDocId, setActiveCorpusDocId] = useState('doc_01');
  const [selectedUserRole, setSelectedUserRole] = useState('Engineering');
  const [corpusSize, setCorpusSize] = useState(500000); // 500k chunks
  const [selectedIndexStrategy, setSelectedIndexStrategy] = useState('hnsw');

  const activeDoc = RAW_CORPUS_SAMPLES.find(d => d.id === activeCorpusDocId) || RAW_CORPUS_SAMPLES[0];
  const activeStage = LIFECYCLE_STAGES[activeLifecycleStage] || LIFECYCLE_STAGES[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="knowledge"
        moduleLabel="Enterprise Knowledge Architecture [Vol.1 #17]"
        title="How to Build an Efficient Knowledge Base for AI Models"
        description="A knowledge base for AI models is not a static setup but an iterative process of refinement. Learn how to seed top-10 core questions, purge boilerplate and near-duplicates, enforce chunk-level RBAC, choose optimal vector indexes (Flat vs IVF vs HNSW), and maintain freshness TTLs."
        metrics={[
          { label: 'Lifecycle Stages', value: '5 Iterative Steps' },
          { label: 'Deduplication Gain', value: '-28% Index Bloat' },
          { label: 'Search Latency SLA', value: '<5.0ms (HNSW)' },
          { label: 'Security Enforcement', value: 'Chunk-Level RBAC' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC CARD */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <KnowledgeBasePanel />
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
            { id: 'lifecycle', icon: '🌱', label: '5-Stage Lifecycle', desc: 'Iterative refinement path' },
            { id: 'cleanse', icon: '🧹', label: 'Cleansing & Deduplication', desc: 'Boilerplate & near-duplicate lab' },
            { id: 'rbac', icon: '🔒', label: 'Chunk-Level RBAC Security', desc: 'Role-based access filtering' },
            { id: 'indexing', icon: '⚡', label: 'Index Matrix (Flat/IVF/HNSW)', desc: 'Search latency & memory calculator' },
            { id: 'freshness', icon: '⏳', label: 'Freshness TTLs & Staleness', desc: 'Document lifecycle rotation' },
            { id: 'code', icon: '💻', label: 'Production Python Code', desc: 'KnowledgeBaseManager implementation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '200px',
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

        {/* ─── 1. 5-STAGE LIFECYCLE STEPPER ─── */}
        {activeSubTab === 'lifecycle' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🌱 The 5-Stage Knowledge Base Lifecycle</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Start small with Top-10 validated questions, iterate through cleaning and indexing, and maintain a feedback loop.
                    </p>
                  </div>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activeLifecycleStage === 0}
                      onClick={() => setActiveLifecycleStage(s => Math.max(0, s - 1))}
                    >
                      ← Previous Stage
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={activeLifecycleStage >= LIFECYCLE_STAGES.length - 1}
                      onClick={() => setActiveLifecycleStage(s => Math.min(LIFECYCLE_STAGES.length - 1, s + 1))}
                    >
                      Next Stage →
                    </Button>
                  </Flex>
                </Flex>

                <Stepper
                  activeStep={activeLifecycleStage}
                  onStepClick={setActiveLifecycleStage}
                  steps={LIFECYCLE_STAGES.map((s, idx) => ({
                    label: `Stage ${s.stage}`,
                    detail: s.title.split(' ')[0],
                    status: idx < activeLifecycleStage ? 'complete' : idx === activeLifecycleStage ? 'current' : 'upcoming'
                  }))}
                />

                <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={2}>
                        <span style={{ fontSize: '1.6rem' }}>{activeStage.icon}</span>
                        <div>
                          <h4 style={{ margin: 0 }}>Stage {activeStage.stage}: {activeStage.title}</h4>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                            {activeStage.summary}
                          </p>
                        </div>
                      </Flex>
                      <Badge variant="primary">Deliverable</Badge>
                    </Flex>

                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '12px 14px', borderRadius: '8px', borderLeft: '4px solid #3A9B9F' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', textTransform: 'uppercase' }}>
                        KEY STAGE OUTCOME:
                      </strong>
                      <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', marginTop: '4px' }}>
                        {activeStage.deliverable}
                      </div>
                    </div>

                    {activeStage.stage === 1 && (
                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                          Top-10 Golden Seed Questions (Initial Validation Scope):
                        </span>
                        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="8px">
                          {TOP_10_SEED_QUESTIONS.map(q => (
                            <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px' }}>
                              <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>
                                <strong style={{ color: '#3A9B9F' }}>[{q.category}]</strong> {q.question}
                              </span>
                              <Badge variant="success" size="sm">{q.status}</Badge>
                            </div>
                          ))}
                        </Grid>
                      </div>
                    )}
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 2. CLEANSING & DEDUPLICATION LAB ─── */}
        {activeSubTab === 'cleanse' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧹 Cleansing & Deduplication Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Raw enterprise data is loaded with duplicate documents and boilerplate headers/footers. Test automatic normalization.
                  </p>
                </div>

                <Flex gap={2}>
                  {RAW_CORPUS_SAMPLES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setActiveCorpusDocId(d.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--ds-radius-md)',
                        border: `1px solid ${activeCorpusDocId === d.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                        background: activeCorpusDocId === d.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                        color: activeCorpusDocId === d.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                        cursor: 'pointer',
                        fontWeight: activeCorpusDocId === d.id ? 'bold' : 'normal'
                      }}
                    >
                      {d.title}
                    </button>
                  ))}
                </Flex>

                <Grid columns={2} gap={4}>
                  {/* RAW DOCUMENT */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="subtle">Raw Ingested Text (With Noise & Boilerplate)</Badge>
                      <pre style={{ margin: 0, padding: '10px', background: 'var(--ds-color-bg-canvas)', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--ds-color-text-primary)' }}>
                        {activeDoc.rawText}
                      </pre>
                    </Stack>
                  </Card>

                  {/* CLEANED & NORMALIZED */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: activeDoc.isDuplicate ? 'rgba(239,68,68,0.04)' : 'rgba(16,185,129,0.04)', border: `1px solid ${activeDoc.isDuplicate ? '#ef4444' : '#5EC4C8'}` }}>
                    <Stack gap={2}>
                      <Badge variant={activeDoc.isDuplicate ? 'danger' : 'success'}>
                        {activeDoc.isDuplicate ? `DUPLICATE DETECTED (${(activeDoc.similarityScore * 100).toFixed(0)}% Similarity ➔ PURGED)` : 'CLEANED & NORMALIZED'}
                      </Badge>
                      <pre style={{ margin: 0, padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--ds-color-text-primary)' }}>
                        {activeDoc.cleanedText}
                      </pre>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. CHUNK-LEVEL RBAC SECURITY ─── */}
        {activeSubTab === 'rbac' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🔒 Chunk-Level Role-Based Access Control (RBAC)</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Sensitive data must be guarded at the vector retrieval stage. Filter queries by authenticated user role.
                    </p>
                  </div>
                  <Flex gap={2}>
                    {['Public', 'Engineering', 'Executive / HR'].map(r => (
                      <Button
                        key={r}
                        size="sm"
                        variant={selectedUserRole === r ? 'primary' : 'outline'}
                        onClick={() => setSelectedUserRole(r)}
                      >
                        Role: {r}
                      </Button>
                    ))}
                  </Flex>
                </Flex>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  {RAW_CORPUS_SAMPLES.map(doc => {
                    const isAllowed = selectedUserRole === 'Executive / HR' || (selectedUserRole === 'Engineering' && doc.rbacRole !== 'Executive / HR') || (selectedUserRole === 'Public' && doc.rbacRole === 'Public');
                    return (
                      <Card
                        key={doc.id}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderTop: `4px solid ${isAllowed ? '#5EC4C8' : '#ef4444'}`,
                          opacity: isAllowed ? 1 : 0.6
                        }}
                      >
                        <Stack gap={2}>
                          <Flex justify="space-between" align="center">
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{doc.title}</strong>
                            <Badge variant={isAllowed ? 'success' : 'danger'}>
                              {isAllowed ? 'ACCESSIBLE' : 'ACCESS DENIED'}
                            </Badge>
                          </Flex>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                            Required Role: <code style={{ color: 'var(--ds-color-text-primary)' }}>{doc.rbacRole}</code>
                          </div>
                          <p style={{ margin: 0, fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                            {isAllowed ? doc.cleanedText : '🔒 [Encrypted / Filtered from Vector Search Matrix for current role]'}
                          </p>
                        </Stack>
                      </Card>
                    );
                  })}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. INDEX SELECTION MATRIX ─── */}
        {activeSubTab === 'indexing' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Index Selection Matrix: Flat vs IVF vs HNSW</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Choose the right vector index based on dataset scale, memory budget, and query SLA requirements.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  {INDEXING_STRATEGIES.map(strat => (
                    <Card
                      key={strat.id}
                      style={{
                        padding: 'var(--ds-space-4)',
                        borderTop: `4px solid ${selectedIndexStrategy === strat.id ? '#3A9B9F' : 'var(--ds-color-border-subtle)'}`,
                        background: selectedIndexStrategy === strat.id ? 'var(--ds-color-bg-surfaceHover)' : 'var(--ds-color-bg-surface)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedIndexStrategy(strat.id)}
                    >
                      <Stack gap={2}>
                        <Flex justify="space-between" align="center">
                          <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{strat.name}</strong>
                          <Badge variant="primary">{strat.searchComplexity}</Badge>
                        </Flex>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Recall Accuracy:</strong> {strat.recallAccuracy}
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Search Latency (1M):</strong> <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{strat.latency1M}</span>
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Memory Footprint:</strong> {strat.memoryUsage}
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', borderTop: '1px solid var(--ds-color-border-subtle)', paddingTop: '6px' }}>
                          {strat.bestFor}
                        </p>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. FRESHNESS TTLS & STALENESS ─── */}
        {activeSubTab === 'freshness' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⏳ Freshness TTLs & Continuous Feedback Loop</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Outdated documentation causes severe hallucinations. Knowledge bases must enforce Time-To-Live (TTL) expiration schedules.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #5EC4C8' }}>
                    <Stack gap={2}>
                      <Badge variant="success">Active (Fresh)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>OAuth2 PKCE Docs (v4.2)</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Last Verified: 3 days ago<br />TTL Remaining: 87 days
                      </div>
                      <Badge variant="subtle" size="sm">Available in Vector Search</Badge>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #f59e0b' }}>
                    <Stack gap={2}>
                      <Badge variant="warning">Needs Re-Verification</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Legacy VPN Config Guide</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Last Verified: 175 days ago<br />TTL Remaining: 5 days
                      </div>
                      <Badge variant="warning" size="sm">Re-Verification Triggered</Badge>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #ef4444' }}>
                    <Stack gap={2}>
                      <Badge variant="danger">Expired (Archived)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>2023 Pricing Tiers (v1.0)</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        TTL Expired: 120 days ago<br />Status: Removed from Index
                      </div>
                      <Badge variant="danger" size="sm">Archived (Zero Hallucination)</Badge>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 6. PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <Flex justify="space-between" align="center">
                  <h3 style={{ margin: 0 }}>💻 Production Knowledge Base Implementation</h3>
                  <Badge variant="subtle">Python 3.11+ / FAISS HNSW / RBAC Metadata</Badge>
                </Flex>

                <CodeBlock
                  language="python"
                  code={`# Enterprise Knowledge Base Architecture
import faiss
import numpy as np
from typing import List, Dict, Any

class KnowledgeBaseChunk:
    def __init__(self, chunk_id: str, text: str, role_acl: List[str], ttl_days: int = 90):
        self.chunk_id = chunk_id
        self.text = text
        self.role_acl = role_acl
        self.ttl_days = ttl_days

class HNSWKnowledgeBaseIndex:
    """Scalable HNSW Graph Index with Chunk-Level RBAC Filtering."""
    def __init__(self, dim: int = 1536, M: int = 32, efConstruction: int = 64):
        # Initialize HNSW index for sub-5ms search
        self.index = faiss.IndexHNSWFlat(dim, M)
        self.index.hnsw.efSearch = 32
        self.chunks: Dict[int, KnowledgeBaseChunk] = {}

    def add_chunk(self, vector: np.ndarray, chunk: KnowledgeBaseChunk):
        idx = len(self.chunks)
        self.index.add(vector.reshape(1, -1))
        self.chunks[idx] = chunk

    def search_with_rbac(self, query_vec: np.ndarray, user_roles: List[str], top_k: int = 5) -> List[KnowledgeBaseChunk]:
        # Retrieve candidate pool
        distances, indices = self.index.search(query_vec.reshape(1, -1), top_k * 3)
        
        # Enforce deterministic RBAC security boundaries
        authorized_results = []
        for idx in indices[0]:
            if idx in self.chunks:
                candidate = self.chunks[idx]
                if any(r in candidate.role_acl for r in user_roles):
                    authorized_results.append(candidate)
                    if len(authorized_results) == top_k:
                        break
                        
        return authorized_results`}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
