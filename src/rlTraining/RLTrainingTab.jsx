import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { THREE_STAGES, RL_MAPPING, METHOD_LADDER, VALUE_DISCOUNT, GRPO_ADVANTAGE, PYTHON_GRPO_CODE } from './rlEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function RLTrainingTab() {
  const [sub, setSub] = useState('stages');
  const [rewards, setRewards] = useState([0.2, 0.5, 0.5, 0.8]);
  const [slider, setSlider] = useState(2);
  const presets = [[0.2, 0.5, 0.5, 0.8], [0.9, 0.9, 0.1, 0.1], [0.4, 0.45, 0.5, 0.55]];
  const g = GRPO_ADVANTAGE(rewards);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [RL Training: TRPO → GRPO]"
        title="How Rewards Reshape Policies — TRPO to GRPO"
        description="Pretrain → SFT → RLHF. Tokens are actions, reward models score, and three algorithms balance stability vs efficiency: TRPO's hard KL, PPO's clip, GRPO's group z-scores that delete the value model."
        metrics={[{ label: 'Stages', value: '3' }, { label: 'Ladder', value: 'TRPO·PPO·GRPO' }, { label: 'GRPO Saves', value: 'Value model' }, { label: 'Math', value: 'Minimal' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/trpo_grpo.svg" alt="TRPO to GRPO" title="Trust Regions Get Cheaper" caption="Same RL roots; each step drops machinery while keeping stability." background="#0F1219" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'stages', icon: '🎓', label: '1. Stages + Ladder', desc: 'RL mapping, 3 methods' },
          { id: 'sim', icon: '🔬', label: '2. GRPO Lab', desc: 'Group → z-scores' },
          { id: 'code', icon: '🛠️', label: '3. Advantage Code', desc: 'Numpy in 5 lines' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'stages' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{THREE_STAGES.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 2 ? '#5EC4C8' : '#5EC4C8'}` }}><div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{s.stage}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.does}</div><div style={{ fontSize: '11px', color: '#3A9B9F' }}>→ {s.gives}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#C47A6A' }}>RL → LLM mapping:</strong>
              {RL_MAPPING.map((m, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}><span style={{ color: 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>{m.rl}</span> = {m.llm}</div>))}
            </Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
              <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>Value discounting (γ):</strong>
              {VALUE_DISCOUNT.map((v, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', marginTop: '4px' }}>{v.prefix} → {v.value}</div>))}
            </Card>
          </Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Method</th><th style={{ textAlign: 'left', padding: '8px' }}>Idea</th><th style={{ textAlign: 'left', padding: '8px' }}>Cost</th><th style={{ padding: '8px' }}>Status</th></tr></thead>
            <tbody>{METHOD_LADDER.map((m, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{m.method}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{m.idea}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{m.cost}</td><td style={{ padding: '8px', textAlign: 'center', color: m.status === 'Frontier' ? '#5EC4C8' : 'var(--ds-color-text-tertiary)' }}>{m.status}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 GRPO advantage lab — pick a reward group</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#0F1219', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#C47A6A', display: 'block', marginBottom: '8px' }}>GROUP PRESETS:</strong>
              <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                {[['Spread', 0], ['Polarized', 1], ['Tight', 2]].map(([l, i]) => (
                  <Button key={l} variant={slider === i ? 'primary' : 'secondary'} size="sm" onClick={() => { setSlider(i); setRewards(presets[i]); }}>{l}</Button>
                ))}
              </Flex>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-inverse)', fontFamily: 'monospace', marginTop: '8px' }}>rewards = [{rewards.join(', ')}]</div>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontFamily: 'monospace' }}>μ={g.mu} σ={g.sd} → A=[{g.adv.join(', ')}]</div>
              <div style={{ fontSize: '12px', color: '#3A9B9F', marginTop: '6px' }}>{g.read}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{g.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Group z-scores in numpy</h3></div>
          <CodeBlock language="python" code={PYTHON_GRPO_CODE} />
          <Callout type="success"><strong>Author's bet:</strong> RL will outrun pretraining and SFT as the driver of future LLM gains. Watch the reward design — it becomes the spec.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
