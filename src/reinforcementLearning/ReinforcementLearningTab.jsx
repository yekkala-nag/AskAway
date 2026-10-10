import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  THREE_RL_BASELINES,
  CONSUMER_RL_USE_CASES,
  SIMULATE_DYNAMIC_PRICING_MDP,
  PYTHON_PPO_PRICING_SCRIPT,
  BANDIT_REWARD_MODELS,
  updateRunningMean,
  defaultTrueRates,
  comparePolicies,
  QLEARN_REWARDS,
  QLEARN_INVALID_PENALTY,
  runQLearningSession,
  topQEntries
} from './rlEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ReinforcementLearningTab() {
  const [activeSubTab, setActiveSubTab] = useState('baselines'); 
  // 'baselines' | 'simulator' | 'consumer' | 'code' | 'bandit' | 'qlearn'

  // Dynamic Pricing Simulator State
  const [basePrice, setBasePrice] = useState(120);
  const [inventory, setInventory] = useState(60);
  const [daysLeft, setDaysLeft] = useState(30);

  const mdpResult = SIMULATE_DYNAMIC_PRICING_MDP(basePrice, inventory, daysLeft);

  // Bandit Explore-vs-Exploit Simulator State
  const [banditArms, setBanditArms] = useState(3);
  const [banditSteps, setBanditSteps] = useState(200);
  const [banditEpsilon, setBanditEpsilon] = useState(0.1);
  const [banditSeed, setBanditSeed] = useState(7);
  const [banditModel, setBanditModel] = useState('fixed');

  const banditRates = defaultTrueRates(banditArms);
  const banditComparison = comparePolicies({ trueRates: banditRates, steps: banditSteps, epsilon: banditEpsilon, seed: banditSeed });
  const banditModelInfo = BANDIT_REWARD_MODELS.find(m => m.id === banditModel) || BANDIT_REWARD_MODELS[0];

  // Tabular Q-Learning Tic-Tac-Toe Simulator State
  const [qlearnEpisodes, setQlearnEpisodes] = useState(2000);
  const [qlearnAlpha, setQlearnAlpha] = useState(0.2);
  const [qlearnGamma, setQlearnGamma] = useState(0.9);
  const [qlearnEpsilon, setQlearnEpsilon] = useState(0.15);
  const [qlearnSeed, setQlearnSeed] = useState(21);

  const qlearnSession = runQLearningSession({ episodes: qlearnEpisodes, alpha: qlearnAlpha, gamma: qlearnGamma, epsilon: qlearnEpsilon, seed: qlearnSeed });
  const qlearnTop = topQEntries(qlearnSession.table, 8);

  const workedMeans = (seq) => {
    const means = [];
    let m = 0;
    for (let i = 0; i < seq.length; i++) {
      m = updateRunningMean(m, i, seq[i]);
      means.push(m);
    }
    return means;
  };
  const WORKED_ARM_A = [1, 1, 0, 1];
  const WORKED_ARM_B = [0, 1, 0];
  const workedA = workedMeans(WORKED_ARM_A);
  const workedB = workedMeans(WORKED_ARM_B);

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
            { id: 'code', icon: '🛠️', label: '4. Gymnasium & PPO Script', desc: 'Production custom Gym environment' },
            { id: 'bandit', icon: '🎰', label: '5. Bandit · Explore vs Exploit', desc: 'Epsilon-greedy simulator and reward taxonomy' },
            { id: 'qlearn', icon: '🧠', label: '6. Q-Learning · Tic-Tac-Toe', desc: 'Q-table training curve and inspector' }
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

        {/* ─── SUBTAB 5: BANDIT EXPLORE VS EXPLOIT ─── */}
        {activeSubTab === 'bandit' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🎰 Bandit · Explore vs Exploit</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Pure greedy exploitation locks onto the first lucky arm. Epsilon-greedy keeps sampling alternatives and overtakes it — watch the crossover step where exploration pulls ahead.
                  </p>
                </div>

                {/* EPSILON SLIDER SIMULATOR CONTROLS */}
                <Grid columns={{ base: '1fr', sm: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Arms: {banditArms} ({banditRates.map(r => r.toFixed(2)).join(' / ')})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={banditArms}
                      onChange={e => setBanditArms(Math.min(5, Math.max(1, Number(e.target.value) || 2)))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Steps: {banditSteps}
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="1000"
                      value={banditSteps}
                      onChange={e => setBanditSteps(Math.min(1000, Math.max(50, Number(e.target.value) || 200)))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Epsilon (exploration rate): {banditEpsilon.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={banditEpsilon}
                      onChange={e => setBanditEpsilon(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#3A9B9F' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Seed (deterministic):
                    </label>
                    <input
                      type="number"
                      value={banditSeed}
                      onChange={e => setBanditSeed(Number(e.target.value) || 0)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>
                </Grid>

                {/* WIN-RATE BARS: GREEDY VS EPSILON-GREEDY */}
                <Stack gap={3}>
                  <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                      <span><strong style={{ color: '#B4553A' }}>■</strong> Pure greedy (epsilon 0)</span>
                      <span>{(banditComparison.greedyWinRate * 100).toFixed(1)}% win rate · {banditComparison.greedy.totalReward} wins</span>
                    </div>
                    <div style={{ height: '14px', background: 'var(--ds-color-bg-canvas)', borderRadius: '7px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: (banditComparison.greedyWinRate * 100).toFixed(1) + '%', background: '#B4553A', borderRadius: '7px', transition: 'width 0.2s' }} />
                    </div>
                  </div>

                  <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '6px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                      <span><strong style={{ color: '#3A9B9F' }}>■</strong> Epsilon-greedy (epsilon {banditEpsilon.toFixed(2)})</span>
                      <span>{(banditComparison.exploratoryWinRate * 100).toFixed(1)}% win rate · {banditComparison.exploratory.totalReward} wins</span>
                    </div>
                    <div style={{ height: '14px', background: 'var(--ds-color-bg-canvas)', borderRadius: '7px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: (banditComparison.exploratoryWinRate * 100).toFixed(1) + '%', background: '#3A9B9F', borderRadius: '7px', transition: 'width 0.2s' }} />
                    </div>
                  </div>

                  <Callout type={banditComparison.crossoverStep >= 0 ? 'success' : 'warning'}>
                    {banditComparison.crossoverStep >= 0 ? (
                      <span><strong>Crossover at step {banditComparison.crossoverStep + 1}:</strong> greedy led early, then exploration overtook it by {(banditComparison.winRateDelta * 100).toFixed(1)} points. Same seed, same arms — the only difference is exploration.</span>
                    ) : (
                      <span><strong>No crossover yet:</strong> greedy still leads within {banditSteps} steps. Raise epsilon or steps to let exploration compound.</span>
                    )}
                  </Callout>
                </Stack>

                {/* WORKED 2-ARM RUNNING-MEAN TABLE */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>📐 Worked example: running-mean estimates on two arms</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: 420 }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-surface)' }}>
                          {['Pull #', 'Arm A reward', 'Arm A running mean', 'Arm B reward', 'Arm B running mean'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--ds-color-text-primary)', borderBottom: '2px solid #3A9B9F', fontSize: '11px' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[0, 1, 2, 3].map(i => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '8px 10px', color: 'var(--ds-color-text-secondary)' }}>{i + 1}</td>
                            <td style={{ padding: '8px 10px', color: '#1A6B6E', fontWeight: 700 }}>{WORKED_ARM_A[i]}</td>
                            <td style={{ padding: '8px 10px', color: 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>{workedA[i].toFixed(4)}</td>
                            <td style={{ padding: '8px 10px', color: '#5B4B8A', fontWeight: 700 }}>{i < WORKED_ARM_B.length ? WORKED_ARM_B[i] : '—'}</td>
                            <td style={{ padding: '8px 10px', color: 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>{i < workedB.length ? workedB[i].toFixed(4) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', margin: '6px 0 0 0' }}>
                    Update rule: new mean = old mean + (reward − old mean) / (pulls + 1). Arm A converges toward 0.75, arm B toward 0.33 — the agent then exploits arm A.
                  </p>
                </div>

                {/* REWARD-MODEL TAXONOMY TOGGLES */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>🗂️ Reward-model taxonomy: when does exploration matter most?</h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {BANDIT_REWARD_MODELS.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setBanditModel(m.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: banditModel === m.id ? '2px solid #5B4B8A' : '1px solid var(--ds-color-border-default)',
                          background: banditModel === m.id ? 'rgba(91,75,138,0.10)' : 'var(--ds-color-bg-surface)',
                          color: banditModel === m.id ? '#5B4B8A' : 'var(--ds-color-text-primary)'
                        }}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                  <Card style={{ padding: '14px 16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5B4B8A' }}>
                    <strong style={{ fontSize: '13px', color: '#5B4B8A', display: 'block', marginBottom: '6px' }}>{banditModelInfo.name}</strong>
                    <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: '0 0 6px 0' }}>{banditModelInfo.description}</p>
                    <p style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)', margin: 0 }}>Example: {banditModelInfo.example}</p>
                  </Card>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: Q-LEARNING TIC-TAC-TOE ─── */}
        {activeSubTab === 'qlearn' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧠 Q-Learning · Tic-Tac-Toe</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    A Q-table maps every board-and-move pair to an expected long-term payoff — no neural network needed for small games.
                    The agent starts with zero knowledge and plays thousands of episodes against a fixed random opponent.
                    Per-block wins climb and losses fall: that is the learning-curve signature. Exploration uses epsilon-greedy, covered in the bandit subtab.
                  </p>
                </div>

                {/* Q-TABLE + UPDATE RULE EXPLAINER */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px 16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3A9B9F' }}>
                    <strong style={{ fontSize: '13px', color: '#1A6B6E', display: 'block', marginBottom: '6px' }}>📊 The Q-table</strong>
                    <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Each entry answers: from this board, how good is this move in the long run? Unknown pairs start at 0 and get overwritten by experience.
                      Illustrative scale: a forced winning move converges near +1.00, a dead losing move sinks below −1.00.
                    </p>
                  </Card>
                  <Card style={{ padding: '14px 16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5B4B8A' }}>
                    <strong style={{ fontSize: '13px', color: '#5B4B8A', display: 'block', marginBottom: '6px' }}>🔁 The Q-learning update</strong>
                    <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: '0 0 6px 0' }}>
                      new value = old value + alpha × (reward + gamma × best next value − old value).
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Alpha (learning rate) sets how strongly new experience overwrites the old value; gamma (discount) sets how much future rewards count.
                      Try alpha 0.05 for slow cautious learning, or gamma 0.0 to make the agent short-sighted.
                    </p>
                  </Card>
                </Grid>

                {/* REWARD SHAPING */}
                <Card style={{ padding: '14px 16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #B9821F' }}>
                  <strong style={{ fontSize: '13px', color: '#B9821F', display: 'block', marginBottom: '6px' }}>🏆 Reward shaping used here</strong>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                    <Badge variant="outline">Win {QLEARN_REWARDS.win > 0 ? '+' : ''}{QLEARN_REWARDS.win}</Badge>
                    <Badge variant="outline">Draw {QLEARN_REWARDS.draw > 0 ? '+' : ''}{QLEARN_REWARDS.draw}</Badge>
                    <Badge variant="outline">Loss {QLEARN_REWARDS.loss}</Badge>
                    <Badge variant="outline">Invalid move {QLEARN_INVALID_PENALTY} (large penalty so illegal moves train out fast)</Badge>
                  </div>
                </Card>

                {/* SLIDER CONTROLS */}
                <Grid columns={{ base: '1fr', sm: '1fr 1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Episodes: {qlearnEpisodes}
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="5000"
                      step="200"
                      value={qlearnEpisodes}
                      onChange={e => setQlearnEpisodes(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#3A9B9F' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Alpha (learning rate): {qlearnAlpha.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={qlearnAlpha}
                      onChange={e => setQlearnAlpha(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#3A9B9F' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Gamma (discount): {qlearnGamma.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={qlearnGamma}
                      onChange={e => setQlearnGamma(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#5B4B8A' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Epsilon (exploration): {qlearnEpsilon.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="0.5"
                      step="0.01"
                      value={qlearnEpsilon}
                      onChange={e => setQlearnEpsilon(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#B4553A' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Seed (deterministic):
                    </label>
                    <input
                      type="number"
                      value={qlearnSeed}
                      onChange={e => setQlearnSeed(Number(e.target.value) || 0)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>
                </Grid>

                {/* LEARNING-CURVE BARS: WINS / DRAWS / LOSSES PER BLOCK */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>📈 Learning curve: wins climb, losses fall per block</h4>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                    <span><strong style={{ color: '#3A9B9F' }}>■</strong> Wins ({qlearnSession.wins})</span>
                    <span><strong style={{ color: '#B9821F' }}>■</strong> Draws ({qlearnSession.draws})</span>
                    <span><strong style={{ color: '#B4553A' }}>■</strong> Losses ({qlearnSession.losses})</span>
                  </div>
                  <Stack gap={2}>
                    {qlearnSession.blocks.map(blk => (
                      <div key={blk.block} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '56px', fontSize: '11px', color: 'var(--ds-color-text-tertiary)', flexShrink: 0 }}>Block {blk.block}</div>
                        <div style={{ flex: 1, display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden', background: 'var(--ds-color-bg-canvas)' }}>
                          <div title={'Wins: ' + blk.wins} style={{ width: (blk.wins / blk.episodes * 100) + '%', background: '#3A9B9F' }} />
                          <div title={'Draws: ' + blk.draws} style={{ width: (blk.draws / blk.episodes * 100) + '%', background: '#B9821F' }} />
                          <div title={'Losses: ' + blk.losses} style={{ width: (blk.losses / blk.episodes * 100) + '%', background: '#B4553A' }} />
                        </div>
                        <div style={{ width: '118px', fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', flexShrink: 0 }}>{blk.wins}W · {blk.draws}D · {blk.losses}L</div>
                      </div>
                    ))}
                  </Stack>
                </div>

                {/* INVALID-MOVE RATE + TABLE SIZE READOUTS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: '#0F1219', borderTop: '3px solid #B4553A' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>INVALID-MOVE RATE (ILLEGAL ATTEMPTS / AGENT MOVES)</div>
                    <div style={{ fontSize: '20px', color: '#B4553A', fontWeight: 'bold', marginTop: '4px' }}>
                      {(qlearnSession.invalidMoveRate * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      {qlearnSession.totalInvalids} illegal attempts across {qlearnSession.totalAgentMoves} agent moves — the penalty trains them out.
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#0F1219', borderTop: '3px solid #3A9B9F' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Q-TABLE SIZE (LEARNED BOARD-AND-MOVE PAIRS)</div>
                    <div style={{ fontSize: '20px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                      {qlearnSession.tableSize.toLocaleString()} entries
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Grows with episodes as the agent visits new positions.
                    </div>
                  </Card>
                </Grid>

                {/* MINI Q-TABLE INSPECTOR + FINAL POSITION BOARD */}
                <Grid columns={{ base: '1fr', md: '1.4fr 1fr' }} gap="var(--ds-space-3)">
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>🔍 Mini Q-table inspector (top entries by value)</h4>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: 320 }}>
                        <thead>
                          <tr style={{ background: 'var(--ds-color-bg-surface)' }}>
                            {['Board state', 'Move', 'Q-value'].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: 'var(--ds-color-text-primary)', borderBottom: '2px solid #3A9B9F', fontSize: '11px' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {qlearnTop.map(row => (
                            <tr key={row.key} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                              <td style={{ padding: '8px 10px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{row.state}</td>
                              <td style={{ padding: '8px 10px', color: '#1A6B6E', fontWeight: 700 }}>cell {row.action}</td>
                              <td style={{ padding: '8px 10px', color: 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>{row.value.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', margin: '6px 0 0 0' }}>
                      Board digits: 1 = agent (X), 2 = opponent (O), 0 = empty, read left-to-right top-to-bottom. Values near +1.00 mark winning moves.
                    </p>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>🏁 Final position of the last episode</h4>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <svg width="132" height="132" viewBox="0 0 132 132" role="img" aria-label="Final board position">
                        {qlearnSession.finalBoard.map((cell, idx) => {
                          const cx = (idx % 3) * 44;
                          const cy = Math.floor(idx / 3) * 44;
                          return (
                            <g key={idx}>
                              <rect x={cx + 2} y={cy + 2} width="40" height="40" rx="6" fill="var(--ds-color-bg-surface)" stroke="var(--ds-color-border-subtle)" />
                              {cell === 1 && (
                                <g stroke="#1A6B6E" strokeWidth="4" strokeLinecap="round">
                                  <line x1={cx + 12} y1={cy + 12} x2={cx + 32} y2={cy + 32} />
                                  <line x1={cx + 32} y1={cy + 12} x2={cx + 12} y2={cy + 32} />
                                </g>
                              )}
                              {cell === 2 && <circle cx={cx + 22} cy={cy + 22} r="10" fill="none" stroke="#5B4B8A" strokeWidth="4" />}
                            </g>
                          );
                        })}
                      </svg>
                      <div>
                        <Badge variant="outline">Last game: {qlearnSession.finalResult === 'win' ? 'agent wins' : qlearnSession.finalResult}</Badge>
                        <p style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', margin: '8px 0 0 0' }}>
                          X (teal) is the learning agent, O (purple) the fixed random opponent. Change the seed to deal a different final position.
                        </p>
                      </div>
                    </div>
                  </div>
                </Grid>

                <Callout type="success">
                  <span><strong>Next step — self-play:</strong> this agent trains against a fixed random opponent, so it plateaus once random play is solved.
                  The natural follow-up is a learning opponent (self-play): both sides update Q-tables, and strategies keep improving against each other.</span>
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
