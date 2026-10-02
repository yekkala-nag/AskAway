import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  THREE_TIERS_OF_CARING,
  ETHICAL_DILEMMAS_SIMULATOR,
  PYTHON_CONSTITUTIONAL_AI_SCRIPT
} from './moralEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function MoralAgencyTab() {
  const [activeSubTab, setActiveSubTab] = useState('tiers'); 
  // 'tiers' | 'dilemmas' | 'framework' | 'code'

  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = ETHICAL_DILEMMAS_SIMULATOR[selectedScenarioIdx];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Alignment [AI Ethics & Philosophy]"
        title="AI Alignment & Moral Agency: Does AI Need to Be Conscious to Care?"
        description="Explore the intersection of philosophy, biology, and applied AI alignment. Discover why artificial systems do not require subjective phenomenal consciousness (qualia) to exhibit genuine Functional Caring and rigorous Artificial Moral Agency through Constitutional AI and formal constraint boundaries."
        metrics={[
          { label: 'Core Paradigm', value: 'Functional vs Experiential Caring' },
          { label: 'Consciousness Needed?', value: 'No for Functional Caring' },
          { label: 'Enforcement Mechanism', value: 'Constitutional AI & RLHF' },
          { label: 'Moral Framework', value: 'Deontological Safety Fences' }
        ]}
      />

      <Container size="wide">
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
            { id: 'tiers', icon: '🧠', label: '1. Three Tiers of Caring', desc: 'Functional, experiential, and moral' },
            { id: 'dilemmas', icon: '⚖️', label: '2. Ethical Dilemmas Lab', desc: 'Utilitarian vs Deontological AI actions' },
            { id: 'framework', icon: '🛡️', label: '3. Constitutional Alignment', desc: 'Translating ethics into constraints' },
            { id: 'code', icon: '💻', label: '4. Constitutional AI Code', desc: 'Self-critique & moral agency pipeline' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: THREE TIERS OF CARING ─── */}
        {activeSubTab === 'tiers' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧠 The Three Tiers of Caring in Synthetic Intelligence</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    A framework separating subjective biological feelings from computational ethical alignment.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {THREE_TIERS_OF_CARING.map((t, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: `4px solid ${idx === 0 ? '#5EC4C8' : idx === 1 ? '#5EC4C8' : '#F5A623'}` }}>
                      <strong style={{ fontSize: '13px', color: idx === 0 ? '#5EC4C8' : idx === 1 ? '#5EC4C8' : '#F5A623', display: 'block', marginBottom: '8px' }}>
                        {t.tier}
                      </strong>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                        {t.definition}
                      </p>

                      <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', color: 'white', marginBottom: '6px' }}>
                        <strong>Requires Sentience:</strong> {t.requiresConsciousness}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Example:</strong> {t.realWorldExample}
                      </div>

                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>
                        Verifiability: {t.verifiability}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>The Functional Conclusion:</strong> Society does not need an autonomous vehicle or medical AI to feel internal emotional pain to drive safely or administer chemotherapy accurately. We need verifiable, constraint-governed <em>Functional Caring</em>.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: ETHICAL DILEMMAS LAB ─── */}
        {activeSubTab === 'dilemmas' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Interactive Ethical Dilemma & Moral Philosophy Sandbox</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    See how different ethical philosophies (Utilitarianism vs Deontology vs Functional AI Governance) resolve high-stakes edge cases.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ETHICAL_DILEMMAS_SIMULATOR.map((s, idx) => (
                    <Button
                      key={s.id}
                      variant={selectedScenarioIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedScenarioIdx(idx)}
                    >
                      {s.title}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '16px', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '6px' }}>
                    CONTEXT SCENARIO:
                  </strong>
                  <p style={{ fontSize: '12px', color: 'white', margin: 0 }}>
                    {activeScenario.context}
                  </p>
                </Card>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #F5A623' }}>
                    <strong style={{ fontSize: '12px', color: '#F5A623' }}>1. Utilitarian View (Max Utility)</strong>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      {activeScenario.utilitarianChoice}
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>2. Deontological View (Duty/Rights)</strong>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      {activeScenario.deontologicalChoice}
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>3. Functional AI Alignment Action</strong>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      {activeScenario.functionalAIAction}
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: CONSTITUTIONAL ALIGNMENT ─── */}
        {activeSubTab === 'framework' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛡️ Constitutional AI: Operationalizing Moral Agency</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How Anthropic and leading AI labs translate philosophical ethics into verifiable, self-critiquing neural feedback loops.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>Stage 1: Supervised Self-Critique</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      The base model drafts a response, then is prompted to critique its own output against written constitutional rules (e.g. non-harm, privacy, truthfulness). It revises its own text until compliance is achieved.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>Stage 2: Reinforcement Learning from AI Feedback (RLAIF)</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      A preference model evaluates thousands of pairs of responses purely based on constitutional principle adherence, training a reward model without human bottlenecking.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Constitutional AI & Moral Critique Python Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Production-grade implementation demonstrating automated ethical self-critique and constraint gating.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_CONSTITUTIONAL_AI_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
