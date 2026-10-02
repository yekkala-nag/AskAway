import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  AGENT_PAIRING_PILLARS,
  WORKFLOW_COMPARISON_MODES,
  PYTHON_AGENT_TEST_DRIVEN_SCRIPT,
  TOKEN_SAVERS,
  TOKEN_DISPLAY
} from './agentPairEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function AgentPairTab() {
  const [activeSubTab, setActiveSubTab] = useState('pillars'); 
  // 'pillars' | 'comparison' | 'decomposition' | 'code' | 'tokens'

  // Interactive Task Decomposition Demo state
  const [selectedTaskType, setSelectedTaskType] = useState('fullstack');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [AI Coding Agents]"
        title="How to Work with AI Coding Agents"
        description="Transform your engineering workflow from fragile 'vibe coding' into a high-precision, test-driven pair-programming machine. Master context injection, atomic task decomposition, automated self-verification loops, and maintaining human architectural control."
        metrics={[
          { label: 'Core Philosophy', value: 'Better Code, Not Just More Code' },
          { label: 'Reliability Gate', value: 'Test-Driven Self-Verification' },
          { label: 'Decomposition', value: 'Atomic Step-by-Step Milestones' },
          { label: 'Human Role', value: 'Architectural & Security Pilot' }
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
            { id: 'pillars', icon: '🏛️', label: '1. Four Core Pillars', desc: 'Context, steps, tests, control' },
            { id: 'comparison', icon: '⚖️', label: '2. Vibe Coding vs Engineered', desc: 'Failure rates & technical debt' },
            { id: 'decomposition', icon: '🧩', label: '3. Task Decomposition Lab', desc: 'Breaking complex problems down' },
            { id: 'code', icon: '🛠️', label: '4. Test-Driven Agent Prompts', desc: 'System prompts & verification loops' },
            { id: 'tokens', icon: '🪙', label: '5. Token Optimization', desc: '5 big savers + reading the display' }
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

        {/* ─── SUBTAB 1: FOUR CORE PILLARS ─── */}
        {activeSubTab === 'pillars' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ The 4 Pillars of Productive Agent Pairing</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on Sara A. Metwalli's methodology for eliminating hallucinations and keeping the engineer in the driver's seat.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {AGENT_PAIRING_PILLARS.map((p, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                        {p.pillar}
                      </strong>

                      <div style={{ background: 'rgba(239,68,68,0.08)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #ef4444', fontSize: '11px', color: '#f87171', marginBottom: '6px' }}>
                        <strong>Common Anti-Pattern:</strong> {p.mistake}
                      </div>

                      <div style={{ background: 'rgba(16,185,129,0.08)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #5EC4C8', fontSize: '11px', color: '#34d399', marginBottom: '8px' }}>
                        <strong>Engineered Pattern:</strong> {p.bestPractice}
                      </div>

                      <div style={{ fontSize: '11px', color: '#F5A623' }}>
                        💡 <strong>Impact:</strong> {p.impact}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: VIBE CODING VS ENGINEERED ─── */}
        {activeSubTab === 'comparison' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Vibe Coding vs Engineered Agent Pairing</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Comparing unstructured generation with systematic agent pair-programming across enterprise production repos.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {WORKFLOW_COMPARISON_MODES.map((m, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: `4px solid ${idx === 0 ? '#ef4444' : '#5EC4C8'}` }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '14px', color: idx === 0 ? '#ef4444' : '#5EC4C8' }}>{m.mode}</strong>
                        <Badge variant="subtle" style={{ color: idx === 0 ? '#ef4444' : '#5EC4C8', background: idx === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)' }}>
                          Failure Rate: {m.failureRate}
                        </Badge>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                        Velocity Profile: <strong style={{ color: 'white' }}>{m.speed}</strong>
                      </div>

                      <Stack gap={2} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                        {m.characteristics.map((c, i) => (
                          <div key={i}>• {c}</div>
                        ))}
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: TASK DECOMPOSITION LAB ─── */}
        {activeSubTab === 'decomposition' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧩 Interactive Task Decomposition Playground</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    See how a monolithic user story is decomposed into bounded, verifiable milestones that coding agents can execute with zero hallucination.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={selectedTaskType === 'fullstack' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedTaskType('fullstack')}
                  >
                    Feature: Real-Time User Notification System
                  </Button>
                  <Button
                    variant={selectedTaskType === 'refactor' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setSelectedTaskType('refactor')}
                  >
                    Refactor: Migrate from REST to GraphQL API
                  </Button>
                </div>

                {selectedTaskType === 'fullstack' ? (
                  <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>Step 1: Data Model</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Create Prisma/SQL migration for <code>Notification</code> schema with read receipts and user foreign keys.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>Step 2: Service & Redis PubSub</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Implement notification dispatch worker with Redis PubSub message queuing and deduplication.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #F5A623' }}>
                      <strong style={{ fontSize: '11px', color: '#F5A623' }}>Step 3: WebSocket Gateway</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Mount authenticated WebSocket handler emitting real-time push events to active sessions.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #a78bfa' }}>
                      <strong style={{ fontSize: '11px', color: '#a78bfa' }}>Step 4: UI Dropdown & Bell</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Build React notification bell component with unread counter badges and infinite scroll drawer.
                      </div>
                    </Card>
                  </Grid>
                ) : (
                  <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>Step 1: GraphQL Type Defs</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Define strict schema SDL with Query and Mutation types matching existing Pydantic models.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>Step 2: Resolvers & DataLoader</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Implement Strawberry/Ariane resolvers with batch DataLoader to eliminate N+1 query bottlenecks.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #F5A623' }}>
                      <strong style={{ fontSize: '11px', color: '#F5A623' }}>Step 3: Integration Tests</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Execute automated snapshot query tests asserting identical JSON payloads between REST and GraphQL.
                      </div>
                    </Card>
                    <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #a78bfa' }}>
                      <strong style={{ fontSize: '11px', color: '#a78bfa' }}>Step 4: Client Migration</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                        Update frontend Apollo Client hooks and clean up deprecated Axios endpoint helpers.
                      </div>
                    </Card>
                  </Grid>
                )}
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
                  <h3 style={{ margin: 0 }}>🛠️ Production Test-Driven Agent System Prompt</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Standard system prompt configuration enforcing test-first coding, automated test suite execution, and clean diff output.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_AGENT_TEST_DRIVEN_SCRIPT} />

                <Callout type="success">
                  <strong>The Golden Rule:</strong> An agent that verifies its own work against automated unit tests frees human engineers from babysitting syntax bugs and lets them focus purely on high-level system design.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: TOKEN OPTIMIZATION CHEAT SHEET ─── */}
        {activeSubTab === 'tokens' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🪙 The 5 Biggest Token Savers</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Where an agent session actually burns tokens — and the five habits that cut the bill. Figures are illustrative; exact numbers vary by tool and model.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {TOKEN_SAVERS.map((t, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
                      <strong style={{ fontSize: '13px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>
                        {idx + 1}. {t.saver}
                      </strong>

                      <div style={{ fontSize: '11.5px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                        How: {t.how}
                      </div>

                      <div style={{ background: 'rgba(16,185,129,0.08)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #34D399', fontSize: '11px', color: '#34d399', marginBottom: '6px' }}>
                        <strong>Saves:</strong> {t.saves}
                      </div>

                      <div style={{ background: 'rgba(239,68,68,0.08)', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #ef4444', fontSize: '11px', color: '#f87171' }}>
                        <strong>Watch out:</strong> {t.watch}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>Order of impact:</strong> a long-running session with a huge untouched history dwarfs any micro-optimization — compact first, then batch commands, then scope reads.
                </Callout>
              </Stack>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Understanding the Token Display</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    What each counter in your assistant's token readout means, what it costs, and how to push it down:
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {TOKEN_DISPLAY.map((t, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${idx === 0 ? '#5EC4C8' : idx === 1 ? '#a78bfa' : idx === 2 ? '#34D399' : '#F5A623'}` }}>
                      <strong style={{ fontSize: '12.5px', color: 'white', display: 'block', marginBottom: '6px' }}>{t.term}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>{t.meaning}</div>
                      <div style={{ fontSize: '11px', color: '#5EC4C8', marginBottom: '4px' }}><strong>Cost:</strong> {t.cost}</div>
                      <div style={{ fontSize: '11px', color: '#F5A623' }}><strong>Tip:</strong> {t.tip}</div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="warning">
                  <strong>Why caching beats everything:</strong> input history grows every turn — cache reads (~10% of base price) and compaction are the only levers that fight the compounding, while output tokens cost several × input, so ask for concise diffs when you only need changes.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
