import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  GOAL_CATEGORIES,
  INITIAL_GOALS_CATALOG,
  MOCK_DAILY_MATRIX,
  NEON_SQL_SCHEMA,
  STREAMLIT_PYTHON_CODE
} from './goalEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: goal catalog → serverless Postgres → analytics dashboard. */
function GoalTrackerPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  return (
    <Panel
      title="Data-Driven Vision Board & Goal Tracker"
      sub="Catalog goals by frequency, persist them in serverless Postgres, and read progress off an analytics dashboard."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#34D399" icon="flag" title="1. Goal Catalog">
          <ul style={pts}>
            <li>High-frequency: daily routines, habits, updates</li>
            <li>Low-frequency: long-term vision, strategy, milestones</li>
          </ul>
        </GlassCard>
        <GlassCard color="#5EC4C8" icon="file" title="2. Serverless Database">
          <ul style={pts}>
            <li>Tables: goals catalog, daily/weekly/long-term tracking, users</li>
            <li>Serverless connection pooling + data sync</li>
          </ul>
        </GlassCard>
        <GlassCard color="#A78BFA" icon="chart" title="3. Execution Dashboard">
          <ul style={pts}>
            <li>Matrix visualisation + gap indicators</li>
            <li>Weekday aggregations + progress heatmaps</li>
            <li>Incremental updates close the loop</li>
          </ul>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function GoalTrackerTab() {
  const [activeSubTab, setActiveSubTab] = useState('execution'); // 'setup' | 'execution' | 'analytics' | 'code'
  const [goalsList, setGoalsList] = useState(INITIAL_GOALS_CATALOG);
  const [dailyMatrix, setDailyMatrix] = useState(MOCK_DAILY_MATRIX);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('AI Engineering & RAG');
  const [newFrequency, setNewFrequency] = useState('Daily');

  // Toggle habit checkbox
  const toggleMatrixCell = (dayIndex, goalId) => {
    const updated = [...dailyMatrix];
    const key = `goalId${goalId}`;
    updated[dayIndex][key] = !updated[dayIndex][key];
    setDailyMatrix(updated);
  };

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newGoal = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      frequency: newFrequency,
      targetPerWeek: newFrequency === 'Daily' ? 7 : 3,
      currentStreak: 1,
      target: newFrequency === 'Daily' ? 'Daily Check-in' : 'Strategic Target'
    };
    setGoalsList([...goalsList, newGoal]);
    setNewTitle('');
  };

  const filteredGoals = goalsList.filter(g => filterCategory === 'ALL' || g.category === filterCategory);

  // Compute metrics
  const totalGoalsCount = goalsList.length;
  const dailyHabitsCount = goalsList.filter(g => g.frequency === 'Daily' || g.frequency === 'Weekly').length;
  const strategicGoalsCount = goalsList.filter(g => g.frequency === 'Monthly' || g.frequency === 'Yearly').length;

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Practical Lab — Full-Stack Data System [2026 Edition]"
        title="The 2026 Goal Tracker: Data-Driven Vision Board & Neon Postgres System"
        description="Centralized, multi-scale goal engineering system combining daily high-frequency habit matrix tracking with low-frequency strategic vision planning. Powered by pure Python, Streamlit UI, and Neon Serverless PostgreSQL."
        metrics={[
          { label: 'Architecture', value: 'Streamlit + Neon' },
          { label: 'Database', value: 'Serverless Postgres' },
          { label: 'Goal Scales', value: 'Daily ➔ Yearly' },
          { label: 'Time Engine', value: 'ISO Thursday Rule' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <GoalTrackerPanel />
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
            { id: 'execution', icon: '⚡', label: '1. Execution Matrix Grid', desc: 'Interactive habit check-ins & gap analysis' },
            { id: 'setup', icon: '📋', label: '2. Strategy & Goal Catalog', desc: 'Add/manage multi-scale goals' },
            { id: 'analytics', icon: '📊', label: '3. Analytics & Progress Reports', desc: 'Streaks, heatmaps & late alerts' },
            { id: 'code', icon: '💻', label: '4. Neon Postgres & Streamlit Lab', desc: 'SQL schema & runnable Python code' }
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

        {/* ─── SUBTAB 1: EXECUTION MATRIX GRID ─── */}
        {activeSubTab === 'execution' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚡ Daily & Weekly Execution Grid (Matrix Check-Ins)</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      In data visualization, an empty cell is just as informative as a filled one. Unchecked boxes signal consistency gaps immediately.
                    </p>
                  </div>
                  <Badge variant="success" size="md">Live Consistency Metric: 85.7%</Badge>
                </Flex>

                {/* MATRIX GRID TABLE */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={3}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                        <thead>
                          <tr style={{ background: 'var(--ds-color-bg-canvas)', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Goal Title & Category</th>
                            <th style={{ padding: '10px', textAlign: 'center' }}>Scale</th>
                            {dailyMatrix.map(m => (
                              <th key={m.day} style={{ padding: '10px', textAlign: 'center' }}>
                                <div>{m.day}</div>
                                <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>{m.date.slice(5)}</div>
                              </th>
                            ))}
                            <th style={{ padding: '10px', textAlign: 'center' }}>Current Streak</th>
                          </tr>
                        </thead>
                        <tbody>
                          {goalsList.slice(0, 5).map(g => (
                            <tr key={g.id} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                              <td style={{ padding: '10px' }}>
                                <div style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>{g.title}</div>
                                <Badge variant="subtle" size="sm" style={{ marginTop: '2px' }}>{g.category}</Badge>
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <Badge variant={g.frequency === 'Daily' ? 'primary' : 'info'} size="sm">{g.frequency}</Badge>
                              </td>
                              {dailyMatrix.map((m, dayIdx) => {
                                const checked = m[`goalId${g.id}`] ?? true;
                                return (
                                  <td key={dayIdx} style={{ padding: '10px', textAlign: 'center' }}>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggleMatrixCell(dayIdx, g.id)}
                                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--ds-color-module-foundations-primary)' }}
                                    />
                                  </td>
                                );
                              })}
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <strong style={{ color: '#3A9B9F', fontSize: 'var(--ds-font-size-bodySm)' }}>🔥 {g.currentStreak} Days</strong>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Callout type="info">
                      <strong>Product Design Principle:</strong> The matrix grid eliminates app fragmentation. By combining daily habits (high-frequency) and strategic milestones (low-frequency) into a unified visual matrix, you maintain execution momentum without losing long-term direction.
                    </Callout>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: STRATEGY & GOAL CATALOG ─── */}
        {activeSubTab === 'setup' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📋 Strategy Setup & Goal Catalog</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Add new daily habits or strategic long-term goals into your system catalog.
                  </p>
                </div>

                {/* ADD GOAL FORM */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <form onSubmit={handleAddGoal}>
                    <Stack gap={3}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>➕ Add New 2026 Goal to Catalog</strong>
                      <Grid columns={{ base: '1fr', md: '2fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Goal Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Build GraphRAG Pipeline"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-primary)' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Category</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-primary)' }}
                          >
                            {GOAL_CATEGORIES.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Frequency Scale</label>
                          <select
                            value={newFrequency}
                            onChange={(e) => setNewFrequency(e.target.value)}
                            style={{ width: '100%', padding: '8px', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-primary)' }}
                          >
                            <option value="Daily">Daily (Habit)</option>
                            <option value="Weekly">Weekly (Routine)</option>
                            <option value="Monthly">Monthly (Milestone)</option>
                            <option value="Yearly">Yearly (Strategic)</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <Button type="submit" variant="primary" style={{ width: '100%' }}>Add Goal</Button>
                        </div>
                      </Grid>
                    </Stack>
                  </form>
                </Card>

                {/* CATALOG LIST */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {filteredGoals.map(g => (
                    <Card key={g.id} style={{ padding: 'var(--ds-space-3)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <Flex align="center" justify="space-between">
                        <div>
                          <Badge variant={g.frequency === 'Daily' ? 'primary' : g.frequency === 'Weekly' ? 'info' : 'warning'} size="sm">
                            {g.frequency}
                          </Badge>
                          <div style={{ fontWeight: 'bold', marginTop: '4px', fontSize: 'var(--ds-font-size-bodySm)' }}>{g.title}</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                            Category: {g.category} | Target: {g.target}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: '#3A9B9F', fontSize: 'var(--ds-font-size-bodySm)' }}>🔥 {g.currentStreak}</strong>
                          <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>Streak</div>
                        </div>
                      </Flex>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: ANALYTICS & PROGRESS REPORTS ─── */}
        {activeSubTab === 'analytics' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Analytics & Progress Reports</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    High-level performance snapshot assessing consistency, habit completion rates, and late goal alerts.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3A9B9F' }}>88.4%</div>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>Overall Habit Consistency</div>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#3A9B9F' }}>{dailyHabitsCount}</div>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>Active High-Freq Habits</div>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6' }}>{strategicGoalsCount}</div>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>Strategic Milestones</div>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f59e0b' }}>18 Days</div>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>Max Continuous Streak</div>
                  </Card>
                </Grid>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={2}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Late Goal Alert Indicators (ISO Thursday Rule Engine)</strong>
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '12px', borderRadius: 'var(--ds-radius-md)' }}>
                      <Flex align="center" justify="space-between">
                        <div>
                          <strong style={{ color: '#ef4444' }}>⚠️ 1 Goal Currently Behind Schedule</strong>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                            "2 Hours Uninterrupted Deep Work" missed 2 check-ins in ISO Week 07.
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Adjust Target</Button>
                      </Flex>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: NEON POSTGRES & STREAMLIT LAB ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Practical Lab — Neon Serverless Postgres & Streamlit Architecture</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete database DDL schema for Neon Postgres and python orchestrator code for Streamlit deployment.
                  </p>
                </div>

                <Stack gap={3}>
                  <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>1. Neon Postgres SQL Schema (5 Fundamental Tables)</strong>
                  <CodeBlock language="sql" code={NEON_SQL_SCHEMA} />
                </Stack>

                <Stack gap={3}>
                  <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>2. Streamlit Python Orchestrator (`app.py`)</strong>
                  <CodeBlock language="python" code={STREAMLIT_PYTHON_CODE} />
                </Stack>

                <Callout type="success">
                  <strong>Deployment Quickstart:</strong>
                  <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: 'var(--ds-font-size-caption)' }}>
                    <li>Create a free account on <code>console.neon.tech</code> and copy your Connection String.</li>
                    <li>Paste string into <code>.streamlit/secrets.toml</code> as <code>DATABASE_URL = "postgres://..."</code></li>
                    <li>Deploy to Streamlit Cloud (<code>share.streamlit.io</code>) with <code>requirements.txt</code> containing <code>streamlit</code> and <code>psycopg2-binary</code>.</li>
                  </ol>
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
