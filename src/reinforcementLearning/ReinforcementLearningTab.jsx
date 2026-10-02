import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  THREE_RL_BASELINES,
  CONSUMER_RL_USE_CASES,
  SIMULATE_DYNAMIC_PRICING_MDP,
  PYTHON_PPO_PRICING_SCRIPT
} from './rlEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ReinforcementLearningTab() {
  const [activeSubTab, setActiveSubTab] = useState('baselines'); 
  // 'baselines' | 'simulator' | 'consumer' | 'code'

  // Dynamic Pricing Simulator State
  const [basePrice, setBasePrice] = useState(120);
  const [inventory, setInventory] = useState(60);
  const [daysLeft, setDaysLeft] = useState(30);

  const mdpResult = SIMULATE_DYNAMIC_PRICING_MDP(basePrice, inventory, daysLeft);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Core Principles [Reinforcement Learning & MDPs]"
        title="Reinforcement Learning: 3 Baseline Policies & Consumer Business Engines"
        description="Master the empirical foundations and enterprise economics of Reinforcement Learning. Learn why any RL algorithm must statistically beat 3 non-negotiable baselines (Random, Greedy Heuristic, and Static Cyclic) and how consumer businesses leverage closed-loop MDPs for dynamic pricing, personalized recommendations, and LTV maximization."
        metrics={[
          { label: '3 Mandatory Baselines', value: 'Random, Heuristic, Static' },
          { label: 'Evaluation Criterion', value: 'PPO Must Beat Expert Rules' },
          { label: 'Consumer Focus', value: 'Dynamic Pricing, NBA, LTV' },
          { label: 'Core Mechanism', value: 'Markov Decision Processes (MDP)' }
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
            { id: 'baselines', icon: '🏛️', label: '1. 3 Non-Negotiable Baselines', desc: 'Random, greedy heuristic, cyclic' },
            { id: 'simulator', icon: '⚡', label: '2. Dynamic Pricing MDP Simulator', desc: 'RL policy vs heuristic price curve' },
            { id: 'consumer', icon: '🛍️', label: '3. Consumer Business RL Matrix', desc: 'Pricing, NBA, LTV, and supply chain' },
            { id: 'code', icon: '🛠️', label: '4. Gymnasium & PPO Script', desc: 'Production custom Gym environment' }
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

        {/* ─── SUBTAB 1: 3 NON-NEGOTIABLE BASELINES ─── */}
        {activeSubTab === 'baselines' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ The 3 Baseline Policies Your RL Algorithm Must Beat</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Before spending thousands of dollars fine-tuning neural architectures, verify your agent beats these 3 foundational baselines across multiple random seeds.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {THREE_RL_BASELINES.map((b, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${b.color}` }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '13px', color: b.color }}>{b.name}</strong>
                        <Badge variant="outline">{b.type}</Badge>
                      </Flex>

                      <div style={{ background: '#0F1219', padding: '8px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-inverse)', marginBottom: '8px' }}>
                        {b.behavior}
                      </div>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                        <strong>Why Essential:</strong> {b.whyEssential}
                      </p>

                      <div style={{ fontSize: '11px', color: b.color, fontWeight: 'bold' }}>
                        Benchmark Score: {b.expectedScore}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="warning">
                  <strong>The Black-Box Pitfall:</strong> In complex industrial environments (fleet routing, inventory management, ad-bidding), RL algorithms frequently appear to learn when in reality they are merely discovering trivial open-loop cyclic behaviors or underperforming simple greedy heuristics!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: DYNAMIC PRICING SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Live Dynamic Pricing Closed-Loop MDP Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate a 30-day finite horizon selling window. Adjust inventory, base price, and days left to see how a learned Reinforcement Learning policy out-earns naive and greedy rule-based baselines.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Base Catalog Price ($):
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={e => setBasePrice(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Initial Inventory Units:
                    </label>
                    <input
                      type="number"
                      value={inventory}
                      onChange={e => setInventory(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Selling Window (Days):
                    </label>
                    <input
                      type="number"
                      value={daysLeft}
                      onChange={e => setDaysLeft(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>
                </Grid>

                {/* SIMULATED REVENUE COMPARISON */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: '#0F1219', borderTop: '3px solid #C47A6A' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RANDOM POLICY REVENUE</div>
                    <div style={{ fontSize: '20px', color: '#C47A6A', fontWeight: 'bold', marginTop: '4px' }}>
                      ${mdpResult.revenueRandom.toLocaleString()}
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#0F1219', borderTop: '3px solid #F0A89A' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>GREEDY HEURISTIC REVENUE</div>
                    <div style={{ fontSize: '20px', color: '#F0A89A', fontWeight: 'bold', marginTop: '4px' }}>
                      ${mdpResult.revenueHeuristic.toLocaleString()}
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#0F1219', borderTop: '3px solid #5EC4C8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>LEARNED RL AGENT REVENUE</div>
                    <div style={{ fontSize: '20px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                      ${mdpResult.revenueRL.toLocaleString()} (+{mdpResult.rlLiftVsHeuristic}%)
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: CONSUMER BUSINESS RL MATRIX ─── */}
        {activeSubTab === 'consumer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛍️ Reinforcement Learning Applications in Consumer Enterprises</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on Raj's framework for modeling complex customer touchpoints, marketing fatigue, and supply chains as Markov Decision Processes.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {CONSUMER_RL_USE_CASES.map((u, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #5EC4C8' }}>
                      <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                        {u.domain}
                      </strong>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>State (S):</strong> {u.state}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Action (A):</strong> {u.action}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                        <strong>Reward (R):</strong> {u.reward}
                      </div>

                      <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold' }}>
                        🚀 Business Impact: {u.businessImpact}
                      </div>
                    </Card>
                  ))}
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
                  <h3 style={{ margin: 0 }}>🛠️ Production Gymnasium Custom Env & Stable-Baselines3 PPO</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Ready-to-run Python script defining a custom retail dynamic pricing Gymnasium environment and training a Proximal Policy Optimization (PPO) agent.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_PPO_PRICING_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
