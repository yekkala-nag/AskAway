import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  SAMPLE_PROMPTS,
  DECODING_STRATEGIES,
  CALCULATE_SAMPLING_DISTRIBUTION,
  PYTHON_LOGITS_PROCESSOR_SCRIPT
} from './samplingEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function LLMSamplingTab() {
  const [activeSubTab, setActiveSubTab] = useState('simulator'); 
  // 'simulator' | 'strategies' | 'tracer' | 'math' | 'code'

  // Simulator State
  const [selectedPromptId, setSelectedPromptId] = useState('factual_code');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.90);
  const [minP, setMinP] = useState(0.05);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0);
  const [isGreedy, setIsGreedy] = useState(false);
  const [rollout, setRollout] = useState([]);
  const [lastSampledToken, setLastSampledToken] = useState(null);

  // Tracer State
  const [tracerStep, setTracerStep] = useState(0);

  const activePrompt = SAMPLE_PROMPTS.find(p => p.id === selectedPromptId) || SAMPLE_PROMPTS[0];
  const vocabSize = activePrompt.vocabCandidates.length;
  const effectiveTopK = Math.min(topK, vocabSize);

  const distribution = CALCULATE_SAMPLING_DISTRIBUTION({
    rawCandidates: activePrompt.vocabCandidates,
    temperature,
    topK: effectiveTopK,
    topP,
    minP,
    repetitionPenalty,
    isGreedy
  });

  // Live distribution metrics — recompute on every control change
  const survivingTokens = distribution.filter(d => d.isSurviving);
  const top1Prob = survivingTokens[0]?.finalProb || 0;
  const entropyBits = -survivingTokens.reduce(
    (sum, d) => (d.finalProb > 0 ? sum + d.finalProb * Math.log2(d.finalProb) : sum),
    0
  );
  const perplexity = Math.pow(2, entropyBits);
  const retainedMass = survivingTokens.reduce((sum, d) => sum + d.rawProb, 0);
  const minRawLogit = Math.min(...distribution.map(d => d.rawLogit));
  const maxRawLogit = Math.max(...distribution.map(d => d.rawLogit));

  const sampleNextToken = () => {
    const pool = distribution.filter(d => d.isSurviving && d.finalProb > 0);
    if (pool.length === 0) return;
    let roll = Math.random();
    let picked = pool[pool.length - 1];
    for (const candidate of pool) {
      roll -= candidate.finalProb;
      if (roll <= 0) {
        picked = candidate;
        break;
      }
    }
    setLastSampledToken(picked.token);
    setRollout(prev => [...prev.slice(-15), picked.token]);
  };

  // Autoregressive steps for Tracer
  const tracerSteps = [
    {
      step: 1,
      inputContext: "The capital of France is",
      nextLogits: [
        { token: " Paris", prob: 0.94, selected: true },
        { token: " a", prob: 0.03, selected: false },
        { token: " known", prob: 0.01, selected: false },
        { token: " located", prob: 0.01, selected: false }
      ],
      explanation: "Step 1: The model computes self-attention over the 5 input tokens and projects the final hidden state to logits. 'Paris' dominates with 94% probability."
    },
    {
      step: 2,
      inputContext: "The capital of France is Paris",
      nextLogits: [
        { token: ",", prob: 0.72, selected: true },
        { token: ".", prob: 0.21, selected: false },
        { token: " which", prob: 0.05, selected: false },
        { token: " and", prob: 0.01, selected: false }
      ],
      explanation: "Step 2: 'Paris' is appended to the context. A new forward pass is executed (leveraging the KV cache for the previous 5 tokens). A comma is sampled."
    },
    {
      step: 3,
      inputContext: "The capital of France is Paris,",
      nextLogits: [
        { token: " which", prob: 0.65, selected: true },
        { token: " home", prob: 0.18, selected: false },
        { token: " known", prob: 0.12, selected: false },
        { token: " the", prob: 0.03, selected: false }
      ],
      explanation: "Step 3: Context now contains 7 tokens. The model attends to all previous tokens and predicts 'which' with 65% probability."
    },
    {
      step: 4,
      inputContext: "The capital of France is Paris, which",
      nextLogits: [
        { token: " is", prob: 0.88, selected: true },
        { token: " houses", prob: 0.07, selected: false },
        { token: " boasts", prob: 0.03, selected: false }
      ],
      explanation: "Step 4: Autoregressive token generation continues until the model emits an <|endoftext|> / </s> EOS token or hits max_new_tokens."
    }
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [LLM Generation & Sampling Mechanics]"
        title="How LLMs Generate Text: Logits, Softmax & Sampling"
        description="Master the mathematics and mechanics behind autoregressive language model generation. Explore how raw neural network logits transform into probability distributions, and how Temperature, Top-K, Top-P (Nucleus), and Min-P govern the balance between precision and creativity."
        metrics={[
          { label: 'Core Mechanism', value: 'Autoregressive Next-Token' },
          { label: 'Sampling Methods', value: 'Greedy, Temp, Top-K, Top-P, Min-P' },
          { label: 'Logit Space', value: 'Unbounded Reals (\\mathbb{R})' },
          { label: 'Probability Space', value: '[0, 1] Summing to 1.0' }
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
            { id: 'simulator', icon: '🎛️', label: '1. Live Sampling Simulator', desc: 'Real-time probability mass reshaping' },
            { id: 'strategies', icon: '⚖️', label: '2. Decoding Strategies', desc: 'Greedy vs Top-P vs Min-P' },
            { id: 'tracer', icon: '🔍', label: '3. Autoregressive Tracer', desc: 'Step-by-step token generation loop' },
            { id: 'math', icon: '🧮', label: '4. Mathematical Formulas', desc: 'Softmax, logit scaling & cutoffs' },
            { id: 'code', icon: '🛠️', label: '5. PyTorch & vLLM Code', desc: 'Custom LogitsProcessor implementation' }
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

        {/* ─── SUBTAB 1: LIVE SAMPLING SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎛️ Real-Time Logits & Probability Mass Reshaper</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Adjust hyperparameters to see how the unnormalized logits from the Language Model Head (W_lm_head) get reshaped, truncated, and normalized into final token probabilities.
                  </p>
                </div>

                {/* SCENARIO PICKER */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SAMPLE_PROMPTS.map(p => (
                    <Button
                      key={p.id}
                      variant={selectedPromptId === p.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedPromptId(p.id)}
                    >
                      {p.title}
                    </Button>
                  ))}
                </div>

                {/* PROMPT CONTEXT DISPLAY */}
                <Card style={{ padding: '12px 14px', background: '#090d16', borderLeft: '4px solid #5EC4C8' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>INPUT PROMPT CONTEXT:</div>
                  <pre style={{ margin: 0, color: 'white', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {activePrompt.prompt}
                  </pre>
                </Card>

                {/* HYPERPARAMETER CONTROLS */}
                <Grid columns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }} gap="var(--ds-space-3)">
                  {/* Temperature */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#0F766E', fontWeight: 'bold' }}>Temperature (T):</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{temperature.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.05"
                      value={temperature}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setTemperature(val);
                        setIsGreedy(val === 0);
                      }}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      {temperature === 0 ? '0.0 (Greedy argmax)' : temperature < 0.5 ? 'Low (Sharp & Factual)' : temperature < 1.0 ? 'Balanced' : 'High (Wild / Creative)'}
                    </div>
                  </Card>

                  {/* Top-K */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#0F766E', fontWeight: 'bold' }}>Top-K Cutoff:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{effectiveTopK}</span>
                    </Flex>
                    <input
                      type="range"
                      min="1"
                      max={vocabSize}
                      step="1"
                      value={effectiveTopK}
                      onChange={e => setTopK(parseInt(e.target.value, 10))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Keeps top {effectiveTopK} of {vocabSize} candidates
                    </div>
                  </Card>

                  {/* Top-P */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#B45309', fontWeight: 'bold' }}>Top-P (Nucleus):</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{topP.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.10"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={e => setTopP(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Cum. mass threshold: {Math.round(topP * 100)}%
                    </div>
                  </Card>

                  {/* Min-P */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 'bold' }}>Min-P Threshold:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{minP.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.0"
                      max="0.30"
                      step="0.01"
                      value={minP}
                      onChange={e => setMinP(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Discard tokens &lt; {(minP * 100).toFixed(0)}% of top token
                    </div>
                  </Card>

                  {/* Repetition Penalty */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#BE123C', fontWeight: 'bold' }}>Repetition Penalty:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ds-color-text-primary)', fontWeight: 700 }}>{repetitionPenalty.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="1.0"
                      max="1.5"
                      step="0.05"
                      value={repetitionPenalty}
                      onChange={e => setRepetitionPenalty(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      {repetitionPenalty === 1.0 ? '1.0 (No penalty)' : `Penalty divisor: ${repetitionPenalty}`}
                    </div>
                  </Card>
                </Grid>

                {/* DISTRIBUTION VISUALIZATION TABLE & BARS */}
                <div>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <strong style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>
                      TOKEN CANDIDATE PROBABILITY DISTRIBUTION:
                    </strong>
                    <Button variant="primary" size="sm" onClick={sampleNextToken}>
                      🎲 Sample Next Token
                    </Button>
                  </Flex>

                  {/* LIVE METRICS — recompute on every control change */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginBottom: '10px' }}>
                    {[
                      { label: 'Entropy', value: `${entropyBits.toFixed(2)} bits`, hint: 'pool uncertainty' },
                      { label: 'Perplexity', value: perplexity.toFixed(1), hint: 'effective choices (2^H)' },
                      { label: 'Top-1 Mass', value: `${(top1Prob * 100).toFixed(1)}%`, hint: 'after re-normalization' },
                      { label: 'Retained Mass', value: `${(retainedMass * 100).toFixed(0)}%`, hint: 'survivors pre re-norm' },
                      { label: 'Sampling Pool', value: `${survivingTokens.length} / ${distribution.length}`, hint: 'tokens still selectable' }
                    ].map(stat => (
                      <div
                        key={stat.label}
                        style={{
                          background: 'var(--ds-color-bg-surface)',
                          border: '1px solid var(--ds-color-border-subtle)',
                          borderRadius: '8px',
                          padding: '8px 10px'
                        }}
                      >
                        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ds-color-text-tertiary)', fontWeight: 700 }}>
                          {stat.label}
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#0E9F8A', fontFamily: 'monospace', lineHeight: 1.3, transition: 'all 0.2s ease' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--ds-color-text-tertiary)' }}>
                          {stat.hint}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Stack gap={2}>
                    {distribution.map((item, idx) => {
                      const isSampled = item.token === lastSampledToken;
                      const logitPct = maxRawLogit > minRawLogit
                        ? Math.max(2, ((item.rawLogit - minRawLogit) / (maxRawLogit - minRawLogit)) * 100)
                        : 100;
                      return (
                        <Card
                          key={idx}
                          style={{
                            padding: '10px 14px',
                            background: item.isSurviving ? 'var(--ds-color-bg-surface)' : '#FAFBFC',
                            opacity: item.isSurviving ? 1.0 : 0.45,
                            borderLeft: `4px solid ${item.isSurviving ? (idx === 0 ? '#0E9F8A' : '#5EC4C8') : '#94A3B8'}`,
                            outline: isSampled ? '2px solid #0E9F8A' : 'none',
                            outlineOffset: isSampled ? '1px' : '0px',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                            <Flex align="center" gap="8px" style={{ flexWrap: 'wrap' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '13px', color: item.isSurviving ? '#0E9F8A' : '#64748b', fontWeight: 'bold', background: '#090d16', padding: '2px 6px', borderRadius: '3px' }}>
                                "{item.token}"
                              </span>
                              <Badge variant="subtle" style={{ fontSize: '10px' }}>
                                Logit: {item.rawLogit.toFixed(1)}
                              </Badge>
                              {isSampled && (
                                <Badge variant="outline" style={{ color: '#0E9F8A', borderColor: '#0E9F8A', fontWeight: 700 }}>✓ SAMPLED</Badge>
                              )}
                              {isGreedy ? (
                                !item.isSurviving && <Badge variant="outline" style={{ color: '#64748B', borderColor: '#64748B' }}>Cut by Greedy argmax</Badge>
                              ) : (
                                <>
                                  {!item.isKeptByTopK && <Badge variant="outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Cut by Top-K</Badge>}
                                  {!item.isKeptByTopP && <Badge variant="outline" style={{ color: '#B45309', borderColor: '#B45309' }}>Cut by Top-P</Badge>}
                                  {!item.isKeptByMinP && <Badge variant="outline" style={{ color: '#6D28D9', borderColor: '#6D28D9' }}>Cut by Min-P</Badge>}
                                </>
                              )}
                            </Flex>
                          </Flex>

                          {/* Raw logit reference bar — fixed baseline (gray) */}
                          <Flex align="center" gap="8px" style={{ marginBottom: '4px' }}>
                            <span style={{ width: '34px', flexShrink: 0, fontSize: '9px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace', textTransform: 'uppercase' }}>logit</span>
                            <div style={{ flex: 1, height: '4px', background: 'rgba(22, 40, 63, 0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${logitPct}%`,
                                  height: '100%',
                                  background: '#94A3B8',
                                  transition: 'width 0.3s ease'
                                }}
                              />
                            </div>
                          </Flex>

                          {/* Final probability bar — live-reshaped (teal) */}
                          <Flex align="center" gap="8px">
                            <span style={{ width: '34px', flexShrink: 0, fontSize: '9px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'monospace', textTransform: 'uppercase' }}>prob</span>
                            <div style={{ flex: 1, height: '14px', background: 'rgba(22, 40, 63, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${item.finalProb * 100}%`,
                                  height: '100%',
                                  background: item.isSurviving
                                    ? (idx === 0
                                        ? 'linear-gradient(90deg, #14B8A6, #0E9F8A)'
                                        : 'linear-gradient(90deg, #5EC4C8, #2FA6B5)')
                                    : '#CBD5E1',
                                  borderRadius: '4px',
                                  transition: 'width 0.3s ease, background 0.3s ease'
                                }}
                              />
                            </div>
                            <span
                              style={{
                                width: '86px',
                                flexShrink: 0,
                                textAlign: 'right',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: item.isSurviving ? '#0E9F8A' : '#94A3B8',
                                fontWeight: 700
                              }}
                            >
                              {(item.finalProb * 100).toFixed(1)}%
                            </span>
                          </Flex>
                        </Card>
                      );
                    })}
                  </Stack>

                  {/* ROLLOUT STRIP — weighted-random draws from the live distribution */}
                  {rollout.length > 0 && (
                    <Card style={{ padding: '10px 12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #0E9F8A' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ds-color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          🎲 Weighted Rollout ({rollout.length} draw{rollout.length === 1 ? '' : 's'})
                        </span>
                        <button
                          onClick={() => { setRollout([]); setLastSampledToken(null); }}
                          style={{
                            background: 'none', border: '1px solid var(--ds-color-border-subtle)',
                            borderRadius: '6px', padding: '2px 8px', fontSize: '10px',
                            color: 'var(--ds-color-text-secondary)', cursor: 'pointer'
                          }}
                        >
                          Clear
                        </button>
                      </Flex>
                      <div style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--ds-color-text-primary)', background: '#090d16', padding: '8px 10px', borderRadius: '4px', whiteSpace: 'pre-wrap', minHeight: '18px' }}>
                        {activePrompt.prompt.slice(-40)}<span style={{ color: '#5EC4C8' }}>{rollout.join('')}</span>
                      </div>
                    </Card>
                  )}
                </div>

                <Callout type="info">
                  <strong>How to use this simulator:</strong> Set <code>Temperature = 0</code> to observe <em>Greedy Decoding</em> where only the top token has 100% probability. Raise <code>Temperature = 1.5</code> to watch tail tokens gain probability — the gray <em>logit</em> bar stays fixed while the teal <em>prob</em> bar reshapes. Drag <code>Top-K</code>, <code>Top-P</code>, or <code>Min-P</code> and watch the Sampling Pool shrink as cut badges appear. Press <strong>🎲 Sample Next Token</strong> to draw from the live distribution and extend the weighted rollout.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: DECODING STRATEGIES & TRADEOFFS ─── */}
        {activeSubTab === 'strategies' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Comprehensive Comparison of LLM Decoding Strategies</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Different enterprise tasks require different decoding algorithms. Selecting the wrong sampling strategy is one of the leading causes of hallucinations and broken JSON schemas.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {DECODING_STRATEGIES.map((strat) => (
                    <Card key={strat.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>{strat.name}</strong>
                        <Badge variant="outline" style={{ color: '#F5A623', borderColor: '#F5A623' }}>
                          {strat.idealTemperature}
                        </Badge>
                      </Flex>

                      <Card style={{ padding: '6px 10px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '11px', margin: '6px 0 10px 0' }}>
                        {strat.formula}
                      </Card>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Pros:</strong> {strat.pros}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                        <strong>Cons:</strong> {strat.cons}
                      </div>
                      <div style={{ fontSize: '11px', color: '#3A9B9F' }}>
                        🎯 <strong>Ideal for:</strong> {strat.useCases}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: AUTOREGRESSIVE GENERATION TRACER ─── */}
        {activeSubTab === 'tracer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 Step-by-Step Autoregressive Token Generation Tracer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Trace the autoregressive loop forward pass by forward pass. See how generated tokens are iteratively fed back into the context window to condition subsequent token logits.
                  </p>
                </div>

                {/* STEP SELECTOR BUTTONS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tracerSteps.map((st, idx) => (
                    <Button
                      key={idx}
                      variant={tracerStep === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTracerStep(idx)}
                    >
                      Step {st.step}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>CONTEXT WINDOW AT STEP {tracerSteps[tracerStep].step}:</div>
                  <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace', padding: '8px 12px', background: '#090d16', borderRadius: '4px', marginBottom: '12px' }}>
                    {tracerSteps[tracerStep].inputContext} <span style={{ background: '#5EC4C8', color: '#090d16', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>[NEXT_TOKEN_PREDICTION]</span>
                  </div>

                  <strong style={{ fontSize: '12px', color: '#3A9B9F', display: 'block', marginBottom: '6px' }}>
                    Predicted Candidate Probabilities at Step {tracerSteps[tracerStep].step}:
                  </strong>

                  <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ marginBottom: '12px' }}>
                    {tracerSteps[tracerStep].nextLogits.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 12px',
                          background: item.selected ? 'rgba(16,185,129,0.12)' : '#FAFBFC',
                          border: item.selected ? '1px solid #0E9F8A' : '1px solid rgba(22, 40, 63, 0.08)',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontFamily: 'monospace', color: item.selected ? '#0E9F8A' : 'var(--ds-color-text-primary)', fontWeight: item.selected ? 'bold' : 'normal' }}>
                          "{item.token}" {item.selected && '✓ (SAMPLED)'}
                        </span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--ds-color-text-secondary)' }}>
                          {(item.prob * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </Grid>

                  <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                    💡 <strong>Mechanics Explanation:</strong> {tracerSteps[tracerStep].explanation}
                  </div>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: MATHEMATICAL FORMULATIONS ─── */}
        {activeSubTab === 'math' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Mathematical Formulations of Logit Transformations</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Detailed breakdown of the mathematical operations applied to raw logit vectors before token sampling.
                  </p>
                </div>

                <Stack gap={3}>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>1. Unnormalized Logits to Probabilities (Standard Softmax)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"P(t_i) = exp(z_i) / sum_{j=1}^{|V|} exp(z_j)"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      The final layer of the Transformer outputs a vector of raw scores z in R^|V| where |V| is the vocabulary size (e.g. 128,256 in Llama 3). The Softmax function maps unbounded real numbers into a valid probability distribution where sum(P(t_i)) = 1.0.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>2. Temperature Scaling (T)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"P(t_i; T) = exp(z_i / T) / sum_{j=1}^{|V|} exp(z_j / T)"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Dividing logits by temperature T &gt; 0 scales the variance. As T -&gt; 0, the highest logit dominates with probability approaching 1.0 (Greedy argmax). As T -&gt; infinity, the distribution approaches a uniform distribution 1 / |V| (maximum entropy / randomness).
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
                    <strong style={{ fontSize: '13px', color: '#F5A623' }}>3. Top-P (Nucleus) Cumulative Probability Cutoff</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"V^(p) = min { V' subseteq V : sum_{t in V'} P(t) >= p }"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Finds the smallest subset of tokens whose cumulative probability mass exceeds threshold p in (0, 1]. All other tokens have their logits set to -infinity, preventing the model from sampling unreliable tail tokens.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #a78bfa' }}>
                    <strong style={{ fontSize: '13px', color: '#a78bfa' }}>4. Min-P Dynamic Probability Thresholding</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"Mask(t_i) = z_i if P(t_i) >= P_max * p_min else -infinity"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Min-P discards tokens whose probability is smaller than p_min times the probability of the most confident token. When the model is uncertain, many tokens survive; when the model is confident, only the top token survives.
                    </p>
                  </Card>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PRODUCTION PYTORCH & VLLM CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch LogitsProcessor & vLLM Sampling Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable implementation of custom sampling processors in PyTorch, Transformers, and vLLM inference server.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LOGITS_PROCESSOR_SCRIPT} />

                <Callout type="success">
                  <strong>Production Best Practice:</strong> For deterministic tasks (SQL, JSON schema extraction, Code), always configure <code>temperature=0.0</code>. For open-ended reasoning, use <code>temperature=0.7</code> combined with <code>min_p=0.05</code> to eliminate degenerative tail tokens.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
