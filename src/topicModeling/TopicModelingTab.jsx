import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  SEEDED_SCENARIOS,
  PREPROCESSING_COMPARISON,
  TWENTY_FIVE_YEAR_TRENDS,
  LLM_TOPIC_LABELS
} from './topicEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: seeded KeyNMF → LLM summarization → topic analyzer + trend engine. */
function SeededTopicPanel() {
  return (
    <Panel
      title="Seeded Topic Modeling + LLM Integration"
      sub="Seed phrases condition the topic matrix, LLM summarization removes token noise, and zero-shot labeling tracks topics across a 25-year trend."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar
          color="#E8C558" icon="zap" index="1." title="Seeded KeyNMF Engine"
          detail="Free-text seed phrases → sentence-transformer embeddings → document cosine scoring with seed-exponent pruning → NMF matrix factorization."
        />
        <GlassBar
          color="#5EC4C8" icon="file" index="2." title="LLM Summarization Preprocessing"
          detail="Long unstructured documents → LLM summarization → semantic key points → token noise eliminated before modeling."
        />
        <GlassBar
          color="#6A9BD8" icon="chart" index="3." title="Topic Analyzer & Trend Engine"
          detail="Zero-shot LLM topic labeling → descriptions → smoothed time-series trend plot spanning 2002–2026."
        />
      </div>
    </Panel>
  );
}

export default function TopicModelingTab() {
  const [activeSubTab, setActiveSubTab] = useState('seeded'); // 'seeded' | 'preprocessing' | 'analyzer' | 'trends' | 'code'
  const [selectedScenarioId, setSelectedScenarioId] = useState('eurozone_expansion');
  const [seedExponent, setSeedExponent] = useState(3.0);
  const [selectedPreproc, setSelectedPreproc] = useState('llmSummary');
  const [selectedTopicId, setSelectedTopicId] = useState(0);

  const activeScenario = SEEDED_SCENARIOS.find(s => s.id === selectedScenarioId) || SEEDED_SCENARIOS[0];
  const activeTopic = LLM_TOPIC_LABELS.find(t => t.topicId === selectedTopicId) || LLM_TOPIC_LABELS[0];
  const preprocInfo = PREPROCESSING_COMPARISON[selectedPreproc];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Enterprise NLP & Topic Modeling [2026 Edition]"
        title="Topic Modeling Techniques for 2026: Seeded KeyNMF & LLM Integration"
        description="Next-generation NLP pipeline combining mathematical KeyNMF matrix factorization with LLM document summarization and zero-shot topic labeling. Eliminate junk topics by conditioning models with free-text seed phrases and tracking 25 years of temporal topic dynamics."
        metrics={[
          { label: 'Core Method', value: 'Seeded KeyNMF' },
          { label: 'Syntax & Topic Guarantee', value: '100% Mathematical' },
          { label: 'Junk Topic Reduction', value: '-94% Noise' },
          { label: 'Preprocessing Speedup', value: '4x Faster' }
        ]}
      />

      <Container size="wide">
        {/* NATIVE GLASS RECREATION */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <SeededTopicPanel />
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
            { id: 'seeded', icon: '🌱', label: '1. Seeded KeyNMF Engine', desc: 'Free-text prompt conditioning' },
            { id: 'preprocessing', icon: '🧹', label: '2. LLM Preprocessing', desc: 'Bullet summary vs raw text' },
            { id: 'analyzer', icon: '🏷️', label: '3. LLM Topic Analyzer', desc: 'Zero-shot labeling & descriptions' },
            { id: 'trends', icon: '📈', label: '4. 25-Year Trend Explorer', desc: 'ECB speeches 2002–2026' },
            { id: 'code', icon: '💻', label: '5. Production Python Code', desc: 'Turftopic & KeyNMF integration' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '190px',
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

        {/* ─── SUBTAB 1: SEEDED KEYNMF ENGINE ─── */}
        {activeSubTab === 'seeded' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌱 Seeded KeyNMF Topic Discovery Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of letting unsupervised models extract unguided, random topics, Seeded KeyNMF conditions the document keyword matrix on your specific free-text prompt using sentence-transformer cosine similarity.
                  </p>
                </div>

                {/* SCENARIO PICKER */}
                <div>
                  <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', marginBottom: '8px', color: 'var(--ds-color-text-tertiary)' }}>
                    SELECT FREE-TEXT SEED PHRASE SCENARIO:
                  </div>
                  <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                    {SEEDED_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenarioId(sc.id)}
                        style={{
                          padding: 'var(--ds-space-3)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: selectedScenarioId === sc.id ? '2px solid var(--ds-color-module-foundations-primary)' : '1px solid var(--ds-color-border-subtle)',
                          background: selectedScenarioId === sc.id ? 'rgba(42,138,132,0.08)' : 'var(--ds-color-bg-surface)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <Badge variant="primary" size="sm">{sc.category}</Badge>
                        <div style={{ fontWeight: 'bold', marginTop: '6px', fontSize: 'var(--ds-font-size-bodySm)' }}>
                          "{sc.seedPhrase}"
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                          {sc.description}
                        </div>
                      </button>
                    ))}
                  </Grid>
                </div>

                {/* SEED EXPONENT SLIDER */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                    <div>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Seed Exponent (α): {seedExponent.toFixed(1)}</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Raises document relevance cos(θ)^α to amplify focus on seed-aligned speeches & prune unaligned documents.
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.5"
                      value={seedExponent}
                      onChange={(e) => setSeedExponent(parseFloat(e.target.value))}
                      style={{ width: '220px', cursor: 'pointer' }}
                    />
                  </Flex>
                </Card>

                {/* SIMULATED RESULTS CARD */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                    <Stack gap={2}>
                      <Badge variant="success">Discovered Seeded Topics</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-body)' }}>{activeScenario.discoveredTopics.length} Focused Topics Extracted</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        Matrix decomposition (V ≈ W × H) applied to seed-conditioned keyword matrix (K × relevance^α).
                      </div>

                      <div style={{ marginTop: '8px' }}>
                        {(activeScenario?.discoveredTopics || []).map(t => {
                          const weight = ((t?.relevance || 0.85) * (seedExponent / 3.0)).toFixed(2);
                          return (
                            <div key={t.id} style={{ marginBottom: '12px', padding: '8px', background: 'var(--ds-color-bg-canvas)', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Topic #{t.id}: {t.title}</span>
                                <Badge variant="neutral" size="sm">Weight: {weight}</Badge>
                              </div>
                              <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-module-foundations-primary)' }}>
                                Top Words: {(t.words || []).slice(0, 7).join(', ')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)' }}>
                    <Stack gap={3}>
                      <Badge variant="warning">Model Quality & Noise Reduction</Badge>
                      <Grid columns="1fr 1fr" gap="var(--ds-space-3)">
                        <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '12px', borderRadius: 'var(--ds-radius-md)', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                            {activeScenario.prunedJunkTopics}
                          </div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                            Junk Topics Pruned
                          </div>
                        </div>
                        <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '12px', borderRadius: 'var(--ds-radius-md)', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                            {((activeScenario.fsmRelevanceScore + (seedExponent - 3.0) * 0.01) * 100).toFixed(0)}%
                          </div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                            Seed Alignment Score
                          </div>
                        </div>
                      </Grid>

                      <Callout type="info">
                        <strong>Mathematical Principle:</strong> Unlike LDA or BERTopic which discover arbitrary cluster noise (e.g. legal disclaimers, press logistics), Seeded KeyNMF computes cosine similarity between `paraphrase-mpnet-base-v2` seed vector and all 279 documents, ensuring 100% of discovered topics pertain to your research question.
                      </Callout>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: LLM PREPROCESSING ─── */}
        {activeSubTab === 'preprocessing' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧹 LLM Summarization Preprocessing vs Raw Text</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why standard topic models struggle on long central bank speeches: Sentence transformers truncate after 512 tokens, and high-dimensional space causes distance inflation ($S^3$ signal separation problem). LLM key-point summaries solve both.
                  </p>
                </div>

                {/* PREPROCESSING PICKER */}
                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                  {Object.entries(PREPROCESSING_COMPARISON).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPreproc(key)}
                      style={{
                        padding: 'var(--ds-space-4)',
                        borderRadius: 'var(--ds-radius-md)',
                        border: selectedPreproc === key ? '2px solid var(--ds-color-module-foundations-primary)' : '1px solid var(--ds-color-border-subtle)',
                        background: selectedPreproc === key ? 'rgba(42,138,132,0.08)' : 'var(--ds-color-bg-surface)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Badge variant={key === 'llmSummary' ? 'success' : key === 'chunkedText' ? 'warning' : 'danger'} size="sm">
                        {key === 'llmSummary' ? 'RECOMMENDED (2026)' : key === 'chunkedText' ? 'LEGACY CHUNKING' : 'RAW TEXT'}
                      </Badge>
                      <div style={{ fontWeight: 'bold', marginTop: '8px', fontSize: 'var(--ds-font-size-bodySm)' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Avg Document Length: {item.avgTokenLength} tokens
                      </div>
                    </button>
                  ))}
                </Grid>

                {/* DETAIL DISPLAY */}
                <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid var(--ds-color-module-foundations-primary)' }}>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                    <Stack gap={2}>
                      <strong style={{ fontSize: 'var(--ds-font-size-body)' }}>{preprocInfo.label}</strong>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>Transformer Context Window Fit:</strong> {preprocInfo.transformerFits}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>BIC Optimal Topics Detected (k*):</strong> {preprocInfo.bicOptimalTopics} topics
                      </div>
                      <Callout type={selectedPreproc === 'llmSummary' ? 'success' : 'warning'}>
                        {selectedPreproc === 'llmSummary' ? preprocInfo.advantages : preprocInfo.issues}
                      </Callout>
                    </Stack>

                    <Stack gap={3}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Pipeline Quality Benchmarks</strong>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          <span>Topic Coherence Score</span>
                          <strong>{preprocInfo.topicQualityScore}/100</strong>
                        </div>
                        <div style={{ height: '8px', background: 'var(--ds-color-border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${preprocInfo.topicQualityScore}%`, background: preprocInfo.topicQualityScore > 90 ? '#5EC4C8' : preprocInfo.topicQualityScore > 70 ? '#f59e0b' : '#ef4444' }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          <span>Junk Topic Noise Percentage</span>
                          <strong style={{ color: preprocInfo.junkTopicsPct < 10 ? '#5EC4C8' : '#ef4444' }}>{preprocInfo.junkTopicsPct}% Noise</strong>
                        </div>
                        <div style={{ height: '8px', background: 'var(--ds-color-border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${preprocInfo.junkTopicsPct}%`, background: preprocInfo.junkTopicsPct < 10 ? '#5EC4C8' : '#ef4444' }} />
                        </div>
                      </div>
                    </Stack>
                  </Grid>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: LLM TOPIC ANALYZER ─── */}
        {activeSubTab === 'analyzer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏷️ Zero-Shot LLM Topic Analyzer & Descriptions</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of spending hours reading word clouds and manually assigning names to topics, the Turftopic `OpenAIAnalyzer` feeds top keywords and document exemplars to an LLM to generate human-readable topic titles and descriptions.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 2fr' }} gap="var(--ds-space-4)">
                  {/* TOPIC LIST */}
                  <Stack gap={2}>
                    <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>DISCOVERED TOPICS (ECB SPEECHES):</strong>
                    {LLM_TOPIC_LABELS.map(t => (
                      <button
                        key={t.topicId}
                        onClick={() => setSelectedTopicId(t.topicId)}
                        style={{
                          padding: 'var(--ds-space-3)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: selectedTopicId === t.topicId ? '2px solid var(--ds-color-module-foundations-primary)' : '1px solid var(--ds-color-border-subtle)',
                          background: selectedTopicId === t.topicId ? 'rgba(42,138,132,0.08)' : 'var(--ds-color-bg-surface)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Topic #{t.topicId}</span>
                          <Badge variant="neutral" size="sm">{t.prevalence}</Badge>
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)', marginTop: '4px', fontWeight: '500' }}>
                          {t.label}
                        </div>
                      </button>
                    ))}
                  </Stack>

                  {/* ACTIVE TOPIC INSPECTOR */}
                  <Card style={{ padding: 'var(--ds-space-5)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                    <Stack gap={3}>
                      <Flex align="center" justify="space-between">
                        <Badge variant="primary" size="md">Topic #{activeTopic.topicId} LLM Analysis</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontFamily: 'var(--ds-font-family-mono)' }}>
                          Prevalence: {activeTopic.prevalence}
                        </span>
                      </Flex>

                      <div>
                        <h3 style={{ margin: '4px 0 6px 0' }}>{activeTopic.label}</h3>
                        <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                          {activeTopic.description}
                        </p>
                      </div>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', marginBottom: '6px', color: 'var(--ds-color-text-tertiary)' }}>
                          TOP 10 KEYNMF DISCOVERED KEYWORDS:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {activeTopic.keywords.map((kw, idx) => (
                            <Badge key={idx} variant="module" moduleId="foundations" size="sm">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      </Card>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>Historical Peak Period:</strong> <span style={{ color: 'var(--ds-color-module-foundations-primary)', fontWeight: 'bold' }}>{activeTopic.trendPeak}</span>
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: 25-YEAR TREND EXPLORER ─── */}
        {activeSubTab === 'trends' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📈 25-Year ECB Central Bank Speech Trend Explorer (2002–2026)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Track topic prevalence dynamics across 279 monthly ECB press conferences smoothed with Savitzky-Golay filtering. Observe macro economic shifts from Euro adoption to the 2008 Financial Crisis and 2022 Inflation Shock.
                  </p>
                </div>

                {/* TREND VISUALIZATION CARD */}
                <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                  <Stack gap={4}>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                      <span style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'white' }}>
                        Topic Prevalence Intensity over Time (% of Speech Focus)
                      </span>
                      <Flex gap={3} wrap="wrap">
                        <span style={{ fontSize: '11px', color: '#C47A6A' }}>■ Eurozone Integration</span>
                        <span style={{ fontSize: '11px', color: '#3A9B9F' }}>■ Monetary Policy Rates</span>
                        <span style={{ fontSize: '11px', color: '#ef4444' }}>■ Liquidity Crisis (2008)</span>
                        <span style={{ fontSize: '11px', color: '#3A9B9F' }}>■ HICP Inflation (2022)</span>
                      </Flex>
                    </Flex>

                    {/* SVG TREND CHART */}
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                      <svg viewBox="0 0 800 240" style={{ width: '100%', minWidth: '600px', height: '220px' }}>
                        {/* Grid lines */}
                        <line x1="40" y1="40" x2="780" y2="40" stroke="#1e293b" strokeDasharray="4 4" />
                        <line x1="40" y1="100" x2="780" y2="100" stroke="#1e293b" strokeDasharray="4 4" />
                        <line x1="40" y1="160" x2="780" y2="160" stroke="#1e293b" strokeDasharray="4 4" />
                        <line x1="40" y1="210" x2="780" y2="210" stroke="#334155" />

                        {/* Y-Axis Labels */}
                        <text x="32" y="44" fill="#64748b" fontSize="10" textAnchor="end">60%</text>
                        <text x="32" y="104" fill="#64748b" fontSize="10" textAnchor="end">30%</text>
                        <text x="32" y="164" fill="#64748b" fontSize="10" textAnchor="end">15%</text>
                        <text x="32" y="214" fill="#64748b" fontSize="10" textAnchor="end">0%</text>

                        {/* Polyline 1: Eurozone Integration (Gold) */}
                        <polyline
                          fill="none"
                          stroke="#F0A89A"
                          strokeWidth="2.5"
                          points={TWENTY_FIVE_YEAR_TRENDS.map((d, i) => `${40 + i * (740 / 12)},${210 - (d.eurozoneIntegration / 70) * 170}`).join(' ')}
                        />

                        {/* Polyline 2: Monetary Policy (Blue) */}
                        <polyline
                          fill="none"
                          stroke="#5EC4C8"
                          strokeWidth="2.5"
                          points={TWENTY_FIVE_YEAR_TRENDS.map((d, i) => `${40 + i * (740 / 12)},${210 - (d.monetaryPolicy / 70) * 170}`).join(' ')}
                        />

                        {/* Polyline 3: Liquidity Crisis (Red) */}
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2.5"
                          points={TWENTY_FIVE_YEAR_TRENDS.map((d, i) => `${40 + i * (740 / 12)},${210 - (d.liquidityCrisis / 70) * 170}`).join(' ')}
                        />

                        {/* Polyline 4: Inflation Shock (Green) */}
                        <polyline
                          fill="none"
                          stroke="#5EC4C8"
                          strokeWidth="2.5"
                          points={TWENTY_FIVE_YEAR_TRENDS.map((d, i) => `${40 + i * (740 / 12)},${210 - (d.inflationShock / 70) * 170}`).join(' ')}
                        />

                        {/* Year Markers */}
                        {TWENTY_FIVE_YEAR_TRENDS.map((d, i) => (
                          <g key={i}>
                            <line x1={40 + i * (740 / 12)} y1="210" x2={40 + i * (740 / 12)} y2="215" stroke="#475569" />
                            <text x={40 + i * (740 / 12)} y="228" fill="#94a3b8" fontSize="10" textAnchor="middle">{d.year}</text>
                          </g>
                        ))}
                      </svg>
                    </div>

                    <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 'var(--ds-font-size-caption)' }}>2008 FINANCIAL CRISIS</div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                          Liquidity Crisis & Emergency Bank Facilities topic spiked to 45% of press conference content.
                        </div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <div style={{ color: '#3A9B9F', fontWeight: 'bold', fontSize: 'var(--ds-font-size-caption)' }}>2014-2016 RATE CYCLE</div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                          Monetary Policy Stance peaked at 62% during NIRP (Negative Interest Rate Policy) introduction.
                        </div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <div style={{ color: '#3A9B9F', fontWeight: 'bold', fontSize: 'var(--ds-font-size-caption)' }}>2022 INFLATION CRISIS</div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                          HICP Inflation & Energy Price Shocks surged to 52% of speech duration following post-pandemic shocks.
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
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
                  <h3 style={{ margin: 0 }}>💻 Production Python Code — Turftopic & Seeded KeyNMF</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete, runnable Python implementation combining `turftopic`, `SentenceTransformer`, `OpenAIAnalyzer`, and `savgol_filter` for central bank speech analysis.
                  </p>
                </div>

                <CodeBlock
                  language="python"
                  code={`# ============================================================================
# TOPIC MODELING TECHNIQUES FOR 2026: SEEDED KEYNMF & LLM PREPROCESSING
# Reference: Turftopic Engine
# ============================================================================

import pandas as pd
import numpy as np
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
from turftopic import KeyNMF
from turftopic.analyzers import OpenAIAnalyzer
from scipy.signal import savgol_filter
import plotly.express as px

# 1. Load Corpus (e.g. ECB Introductory Press Conference Statements)
df = pd.read_parquet("data/ecb_speeches.parquet")
raw_documents = list(df["content"])

# 2. LLM Summarization Preprocessing (Extract key points & remove token noise)
summary_prompt = """
Summarize the following central bank press conference statement into key bullet points 
separated by double linebreaks. Focus exclusively on monetary policy, inflation, and liquidity.
Reply with the summary points only.
\\n {document}
"""

summarizer = OpenAIAnalyzer("gpt-5-nano", summary_prompt=summary_prompt)
summaries = [summarizer.summarize_document(doc) for doc in tqdm(raw_documents, desc="Summarizing...")]

# 3. Seeded KeyNMF Model Setup (Conditioning on Free-Text Seed Phrase)
encoder = SentenceTransformer("paraphrase-mpnet-base-v2")

seeded_model = KeyNMF(
    n_components=4,                  # Or "auto" for BIC topic count detection
    encoder=encoder,
    seed_phrase="Expansion of the Eurozone and Monetary Union",
    seed_exponent=3.0                # Amplifies document relevance exponent
)

# Fit Seeded KeyNMF model on LLM bullet point summaries
doc_topic_matrix = seeded_model.fit_transform(summaries)
seeded_model.print_topics()

# 4. Zero-Shot LLM Topic Analyzer (Generate human-readable labels & descriptions)
analyzer = OpenAIAnalyzer(model="gpt-5-nano")
analysis_result = seeded_model.analyze_topics(analyzer, use_documents=True)

print(analysis_result.to_df())
# Output: DataFrame with columns [topic_id, topic_name, description, keywords]

# 5. Temporal Prevalence Tracking & Savitzky-Golay Smoothing (2002–2026)
time_df = pd.DataFrame(
    dict(
        date=df["date"],
        **dict(zip(analysis_result.topic_names, doc_topic_matrix.T / doc_topic_matrix.sum(axis=1)))
    )
).set_index("date")

# Smooth temporal trends using Savitzky-Golay filter
for col in time_df.columns:
    time_df[col] = savgol_filter(time_df[col], window_length=12, polyorder=2)

fig = px.line(time_df, title="25-Year ECB Topic Dynamics (2002–2026)", template="plotly_white")
fig.show()`}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: TABLES + WORKFLOW + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>📊 Interactive Comparison Tables</h3>
            <Badge variant="module" moduleId="foundations">Sortable · Filterable</Badge>
          </div>
          <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Click any column header to sort; type in the filter to search. These tables turn the static preprocessing
            trade-offs and 25-year macro trends into queryable evidence.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <DataTable
            caption="Preprocessing Strategy Comparison — Topic Quality vs Context Loss"
            searchable={false}
            initialSort={{ key: 'quality', dir: 'desc' }}
            columns={[
              { key: 'option', label: 'Strategy', sortable: false },
              { key: 'tokenLen', label: 'Avg Tokens', numeric: true },
              { key: 'fits', label: 'Transformer Fit', sortable: false },
              { key: 'quality', label: 'Topic Quality', numeric: true, render: (v) => (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, height: 6, minWidth: 60, background: 'var(--ds-color-border-subtle)', borderRadius: 999, overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${v}%`, background: v >= 90 ? 'var(--ds-color-state-success-light)' : v >= 75 ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-state-warning-light)' }} />
                  </span>
                  <strong>{v}</strong>
                </span>
              ) },
              { key: 'junk', label: 'Junk %', numeric: true, render: (v) => <span style={{ color: v <= 5 ? 'var(--ds-color-state-success-light)' : 'var(--ds-color-state-error-light)', fontWeight: 600 }}>{v}%</span> },
            ]}
            rows={Object.entries(PREPROCESSING_COMPARISON).map(([k, v]) => ({
              option: v.label, tokenLen: v.avgTokenLength, fits: v.transformerFits, quality: v.topicQualityScore, junk: v.junkTopicsPct,
            }))}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="25-Year Macro Topic Trend Tracking (share of discourse, %)"
            searchable={false}
            columns={[
              { key: 'year', label: 'Year', numeric: true },
              { key: 'eurozoneIntegration', label: 'Eurozone', numeric: true },
              { key: 'monetaryPolicy', label: 'Monetary Policy', numeric: true },
              { key: 'liquidityCrisis', label: 'Liquidity Crisis', numeric: true },
              { key: 'inflationShock', label: 'Inflation Shock', numeric: true },
            ]}
            rows={TWENTY_FIVE_YEAR_TRENDS}
            rowKey={(r) => r.year}
          />
        </Reveal>

        <Reveal variant="rise" delay={180}>
          <Workflow
            accent="foundations"
            accentLabel="KeyNMF Pipeline"
            title="From Seed Phrase to 25-Year Trend"
            description="Step through the 2026 topic-modeling pipeline. Hit ▶ Play to animate the end-to-end flow."
            steps={[
              { title: 'Seed KeyNMF', description: 'Condition Non-negative Matrix Factorization with a domain seed phrase (e.g. "Subprime Liquidity Crisis") and seed exponent to bias topic discovery.', icon: '🌱' },
              { title: 'LLM Preprocess', description: 'Summarize each document into 5–8 crisp semantic bullet points with an Open LLM, stripping legal boilerplate and tokenization noise.', icon: '✂️' },
              { title: 'Matrix Factorize', description: 'Run NMF on the summarized embedding matrix — runs ~4× faster with zero context loss versus raw text.', icon: '🧮' },
              { title: 'Zero-Shot Label', description: 'An LLM assigns human-readable labels to each discovered topic cluster and prunes junk topics.', icon: '🏷️' },
              { title: 'Track Trends', description: 'Aggregate topic shares year-over-year to surface 25-year macroeconomic narrative shifts.', icon: '📈' },
            ]}
          />
        </Reveal>

        <Reveal variant="scale" delay={220}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>LLM Preprocessing Quality</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-foundations-primary)' }}>
                <AnimatedNumber value={96} suffix="%" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              LLM summarization preprocessing lifts topic quality from <strong>62</strong> (raw text) to <strong>96</strong> while
              cutting junk topics from <strong>35%</strong> to <strong>2%</strong> — the single highest-leverage step in the pipeline.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
