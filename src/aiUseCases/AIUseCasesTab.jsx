import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  THREE_USE_CASES_MATRIX,
  SAMPLE_RESUME_PROFILES,
  CALCULATE_COSINE_SIMILARITY,
  PREDICT_LEAD_SCORE,
  PYTHON_AI_USECASES_CODE
} from './aiUseCasesEngine.js';
import ZoomableImage from '../components/ui/ZoomableImage.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: three enterprise AI patterns beyond chatbots. */
function UseCasesPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const flow = { fontSize: 12, color: '#7FE3DC', marginTop: 8, lineHeight: 1.6 };
  return (
    <Panel
      title="Enterprise AI Architecture — 3 Use Cases Beyond Chatbots"
      sub="Unstructured text becomes structured features, embeddings, and scored priorities."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#5EC4C8" icon="file" title="1. Feature Engineering via LLMs">
          <div style={flow}>Raw resume text → extraction engine → structured variables → feature store.</div>
          <ul style={pts}>
            <li>Named entity recognition</li>
            <li>Text summarization</li>
            <li>Skills &amp; experience extraction</li>
          </ul>
        </GlassCard>
        <GlassCard color="#6A9BD8" icon="search" title="2. Structuring via Embeddings">
          <div style={flow}>Unstructured text → embedding model → vector space + vector DB.</div>
          <ul style={pts}>
            <li>Ideal-customer-profile embedding</li>
            <li>Current vs ICP vector, cosine distance</li>
            <li>Relevance score out</li>
          </ul>
        </GlassCard>
        <GlassCard color="#A78BFA" icon="chart" title="3. Predictive Lead Scoring">
          <div style={flow}>Raw lead data + engineered features → trained model → probabilities.</div>
          <ul style={pts}>
            <li>Scoring &amp; grading into an A/B/C/D queue</li>
            <li>Sales action dashboard on top</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function AIUseCasesTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'features' | 'embeddings' | 'scoring'
  const [selectedLeadId, setSelectedLeadId] = useState(1);

  // Lead scoring interactive sliders
  const [yearsExp, setYearsExp] = useState(14);
  const [isITLeader, setIsITLeader] = useState(true);
  const [icpSim, setIcpSim] = useState(0.92);

  const activeLead = SAMPLE_RESUME_PROFILES.find(p => p.id === selectedLeadId) || SAMPLE_RESUME_PROFILES[0];
  const predictedScore = PREDICT_LEAD_SCORE(yearsExp, isITLeader, icpSim);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Enterprise AI Strategy]"
        title="3 AI Use Cases (That Are Not a Chatbot)"
        description="A framework for driving tangible business value beyond unpredictable AI chatbots: LLM Feature Engineering, Structuring Unstructured Data via Embeddings, and Predictive Lead Scoring Models."
        metrics={[
          { label: 'Use Case 1', value: 'LLM Feature Extraction' },
          { label: 'Use Case 2', value: 'Vector Embeddings' },
          { label: 'Use Case 3', value: 'Predictive Lead Scoring' },
          { label: 'Cost Savings', value: '100× vs Data Brokers' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <UseCasesPanel />
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
            { id: 'overview', icon: '💡', label: '1. Why Chatbots Aren\'t Enough', desc: 'Predictability & Business ROI' },
            { id: 'features', icon: '⚙️', label: '2. LLM Feature Engineering', desc: 'Extracting variables from text' },
            { id: 'embeddings', icon: '📐', label: '3. Embeddings & ICP Matching', desc: 'Structuring unstructured data' },
            { id: 'scoring', icon: '🎯', label: '4. Predictive Lead Scoring', desc: 'Grading A/B/C/D priority queue' }
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

        {/* ─── SUBTAB 1: OVERVIEW ─── */}
        {activeSubTab === 'overview' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💡 Moving Beyond the Chatbot Hype</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    While custom AI chatbots are popular, they are inherently unpredictable and prone to hallucinations. Enterprise value is generated by <strong>solving the right business problems</strong> (e.g. automating lead qualification, structuring raw resumes, and scoring opportunities) rather than deploying conversational UIs.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {THREE_USE_CASES_MATRIX.map((uc, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                        {uc.useCase}
                      </strong>
                      <p style={{ fontSize: '11px', color: '#ef4444', margin: '6px 0 4px 0' }}>
                        <strong>Problem:</strong> {uc.problem}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '0 0 4px 0' }}>
                        <strong>AI Solution:</strong> {uc.solution}
                      </p>
                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                        Value: {uc.businessValue}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: FEATURE ENGINEERING ─── */}
        {activeSubTab === 'features' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚙️ Use Case 1: LLM Feature Engineering</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of paying $0.10/lead to 3rd-party data brokers or manually reading 100,000 resumes, LLMs extract structured numerical features (Years of Exp, Title, Industry, IT Leader flag) at $0.001/lead.
                  </p>
                </div>

                <Flex gap={2} align="center">
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Select Lead:</span>
                  {SAMPLE_RESUME_PROFILES.map(lead => (
                    <Button
                      key={lead.id}
                      variant={selectedLeadId === lead.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      {lead.name}
                    </Button>
                  ))}
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>UNSTRUCTURED RAW RESUME TEXT:</strong>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '6px', color: 'var(--ds-color-text-secondary)', fontStyle: 'italic' }}>
                      "{activeLead.rawResume}"
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>LLM EXTRACTED STRUCTURED VARIABLES:</strong>
                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: 'var(--ds-radius-sm)', marginTop: '8px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                      <div>job_title: "{activeLead.llmExtracted.jobTitle}"</div>
                      <div>years_experience: {activeLead.llmExtracted.yearsExp}</div>
                      <div>industry: "{activeLead.llmExtracted.industry}"</div>
                      <div>is_it_leader: {activeLead.llmExtracted.isITLeader ? 'True (1)' : 'False (0)'}</div>
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: EMBEDDINGS ─── */}
        {activeSubTab === 'embeddings' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📐 Use Case 2: Structuring Unstructured Data via Text Embeddings</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Text embeddings convert raw text into 1536-dimensional vectors. We can mathematically compute Cosine Similarity to compare lead resumes against an Ideal Customer Profile (ICP).
                  </p>
                </div>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #8b5cf6' }}>
                  <strong style={{ fontSize: '11px', color: '#8b5cf6' }}>IDEAL CUSTOMER PROFILE (ICP) EMBEDDING REFERENCE:</strong>
                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                    "Decision maker VP/Director of IT looking for enterprise cybersecurity & cloud infrastructure SaaS."
                  </div>
                </Card>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {SAMPLE_RESUME_PROFILES.map(lead => (
                    <Card key={lead.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{lead.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0' }}>
                        {lead.llmExtracted.jobTitle} ({lead.llmExtracted.industry})
                      </div>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px', borderRadius: 'var(--ds-radius-sm)', marginTop: '6px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                        ICP Similarity: <strong style={{ color: lead.icpSimilarity > 0.8 ? '#5EC4C8' : '#ef4444' }}>{lead.icpSimilarity}</strong>
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PREDICTIVE LEAD SCORING ─── */}
        {activeSubTab === 'scoring' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Use Case 3: Predictive Lead Scoring & Grade Priority</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Combine LLM features + Text Embedding similarities in an ML Classifier to predict conversion probability and assign Lead Grades (A, B, C, D) to prioritize sales outreach.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Interactive Lead Parameter Simulator:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Years Experience ({yearsExp} yrs):</label>
                        <input type="range" min="1" max="25" value={yearsExp} onChange={e => setYearsExp(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>ICP Cosine Similarity ({icpSim}):</label>
                        <input type="range" min="0.1" max="0.99" step="0.01" value={icpSim} onChange={e => setIcpSim(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Is IT Leader?</label>
                        <Button
                          variant={isITLeader ? 'primary' : 'subtle'}
                          size="sm"
                          onClick={() => setIsITLeader(!isITLeader)}
                        >
                          {isITLeader ? '✅ Yes (IT Leader)' : '❌ No (Non-IT)'}
                        </Button>
                      </div>
                    </Grid>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>PREDICTED CONVERSION PROBABILITY:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                          {(predictedScore.score * 100).toFixed(0)}%
                        </div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${predictedScore.color}` }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>ASSIGNED LEAD GRADE:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: predictedScore.color }}>
                          {predictedScore.grade}
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>

                <CodeBlock language="python" code={PYTHON_AI_USECASES_CODE} />

                <Callout type="success">
                  <strong>AI Strategy Takeaway:</strong> High-performing AI applications focus on high-leverage workflows like feature extraction, semantic structuring, and predictive scoring rather than just wrapping LLMs in simple chat interfaces.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: IMAGE + TABLE + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>💡 Interactive Use-Case Map</h3>
            <Badge variant="module" moduleId="frontiers">Image · Table</Badge>
          </div>
          <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Explore the sales-architecture diagram via hotspots, then compare the three enterprise use cases side by side.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <ZoomableImage
            src="/assets/ai_use_cases_sales_arch.png"
            title="Enterprise AI Sales Architecture"
            caption="Tap the numbered hotspots to trace how raw resumes become scored, graded leads; click the figure for a zoomable fullscreen view."
            accent="frontiers"
            hotspots={[
              { x: 16, y: 30, label: 'Unstructured Resumes', title: 'Raw Input', body: 'Free-text resumes & profiles enter the pipeline as unstructured documents.' },
              { x: 42, y: 40, label: 'LLM Feature Extraction', title: 'Structure', body: 'LLMs extract Years-Exp, Industry, IT-Leader flag at ~$0.001/lead vs $0.10 from brokers.' },
              { x: 66, y: 32, label: 'Embeddings (1536-d)', title: 'Vectorize', body: 'Text becomes mathematical points enabling cosine-similarity matching to the ICP.' },
              { x: 86, y: 52, label: 'Lead Grading A/B/C/D', title: 'Predict', body: 'A trained model outputs grades that prioritize high-probability opportunities.' },
            ]}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="Three Enterprise AI Use Cases Beyond Chatbots"
            columns={[
              { key: 'useCase', label: 'Use Case', sortable: false },
              { key: 'problem', label: 'Problem', sortable: false },
              { key: 'solution', label: 'Solution', sortable: false },
              { key: 'businessValue', label: 'Business Value', sortable: false },
            ]}
            rows={THREE_USE_CASES_MATRIX}
            rowKey={(r) => r.useCase}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Cost Reduction</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-frontiers-primary)' }}>
                <AnimatedNumber value={100} suffix="×" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              LLM structuring cuts lead-qualification cost from <strong>$0.10</strong> (data brokers) to <strong>~$0.001</strong> per lead — a <strong>100×</strong> saving.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
