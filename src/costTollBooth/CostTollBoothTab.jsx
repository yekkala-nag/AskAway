import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PRICE_TIERS,
  CACHE_WINDOWS,
  TOKEN_FACTS,
  TRIMS,
  INTERN_RULES,
  DETERMINISTIC,
  conversationCost,
  spacedCost,
  CHEAT_SHEET,
  CODE_CALC,
  CODE_LADDER,
} from './costTollBoothEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const RED = '#B4553A';

const SUBTABS = [
  { id: 'meter', icon: '🏁', label: '1. The Toll Booth', desc: 'How the meter actually runs' },
  { id: 'cache', icon: '🧊', label: '2. Cache Simulator', desc: 'Warm window vs cold restart' },
  { id: 'trims', icon: '✂️', label: '3. Trims, Tiers & Interns', desc: 'Where the fat comes off' },
  { id: 'sheet', icon: '📋', label: '4. Cheat Sheet & Code', desc: 'The whole thing on one card' },
];

function TollBoothDiagram() {
  return (
    <svg viewBox="0 0 940 250" width="100%" role="img"
      aria-label="Toll booth diagram: input tokens pay at entry, output tokens pay at exit at a higher price, cached tokens pass at one tenth price">
      <defs>
        <marker id="arrC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>
      {/* entry lane */}
      <rect x="30" y="40" width="230" height="64" rx="10" fill="#FFFFFF" stroke={TEAL} strokeWidth="2" />
      <text x="145" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill={TEAL_DARK}>INPUT LANE</text>
      <text x="145" y="86" textAnchor="middle" fontSize="11.5" fill="#6B7280">full price — you pay to drive in</text>

      {/* booth */}
      <rect x="370" y="30" width="200" height="84" rx="12" fill="#F5F3FA" stroke={PURPLE} strokeWidth="2" />
      <text x="470" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill={PURPLE_DARK}>TOLL BOOTHS</text>
      <text x="470" y="80" textAnchor="middle" fontSize="11.5" fill="#6B7280">one booth per token predicted</text>
      <text x="470" y="98" textAnchor="middle" fontSize="11" fill="#6B7280">each needs all tokens before it</text>
      <path d="M 264 72 L 366 72" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrC)" />

      {/* exit lane */}
      <rect x="680" y="40" width="230" height="64" rx="10" fill="#FFFFFF" stroke={RED} strokeWidth="2" />
      <text x="795" y="66" textAnchor="middle" fontSize="13" fontWeight="700" fill={RED}>OUTPUT LANE</text>
      <text x="795" y="86" textAnchor="middle" fontSize="11.5" fill="#6B7280">pricier lane — you pay to drive back out</text>
      <path d="M 574 72 L 676 72" stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrC)" />

      {/* bypass */}
      <path d="M 145 112 C 145 190, 795 190, 795 112" fill="none" stroke={TEAL} strokeWidth="2.5" strokeDasharray="7 5" />
      <rect x="360" y="165" width="220" height="44" rx="10" fill="#E3F2F2" stroke={TEAL} strokeWidth="2" />
      <text x="470" y="184" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={TEAL_DARK}>WARM CACHE BYPASS</text>
      <text x="470" y="201" textAnchor="middle" fontSize="11.5" fill={TEAL_DARK}>prefix at 1/10 price — no re-tolling</text>

      <text x="470" y="236" textAnchor="middle" fontSize="11" fill="#6B7280">
        every extra sentence in history pays this toll again — until the cache window expires
      </text>
    </svg>
  );
}

function ReplayDiagram() {
  const turns = [
    { n: 1, blocks: ['msg1'], reply: 'reply1' },
    { n: 2, blocks: ['msg1', 'reply1', 'msg2'], reply: 'reply2' },
    { n: 3, blocks: ['msg1', 'reply1', 'msg2', 'reply2', 'msg3'], reply: 'reply3' },
  ];
  return (
    <svg viewBox="0 0 940 300" width="100%" role="img"
      aria-label="Three turns showing the whole conversation history replayed and re-billed every turn, growing each time">
      {turns.map((t, i) => {
        const y = 34 + i * 88;
        return (
          <g key={t.n}>
            <text x="14" y={y + 30} fontSize="12.5" fontWeight="700" fill="#1A1D26">turn {t.n}</text>
            {t.blocks.map((b, j) => (
              <g key={j}>
                <rect x={90 + j * 150} y={y} width="142" height="40" rx="7"
                  fill={j % 2 === 0 ? '#F5F3FA' : '#EEF1F4'} stroke={PURPLE} strokeWidth="1.3" />
                <text x={161 + j * 150} y={y + 25} textAnchor="middle" fontSize="11" fill={PURPLE_DARK}>{b}</text>
              </g>
            ))}
            <rect x={90 + t.blocks.length * 150} y={y} width="142" height="40" rx="7"
              fill="#E3F2F2" stroke={TEAL} strokeWidth="1.3" />
            <text x={161 + t.blocks.length * 150} y={y + 25} textAnchor="middle" fontSize="11" fill={TEAL_DARK}>{t.reply}</text>
            <text x={90} y={y + 58} fontSize="10.5" fill={RED}>
              billed at full input price: {(t.blocks.length * 900).toLocaleString()}+ replayed tokens
            </text>
          </g>
        );
      })}
      <text x="470" y="292" textAnchor="middle" fontSize="11" fill="#6B7280">
        without a cache the history is re-sent AND re-processed every single turn — cost grows quadratically
      </text>
    </svg>
  );
}

function CacheSim() {
  const [gap, setGap] = useState(5);
  const [turns, setTurns] = useState(7);
  const [windowIdx, setWindowIdx] = useState(1); // 8 min browser-like
  const [tierKey, setTierKey] = useState('middle');
  const [cacheOn, setCacheOn] = useState(true);

  const windowMin = CACHE_WINDOWS[windowIdx].minutes;
  const turnList = useMemo(
    () => Array.from({ length: turns }, () => ({ in: 900, out: 450 })),
    [turns]
  );
  const result = useMemo(
    () => conversationCost(turnList, { windowMin, gapMin: gap, tierKey, cacheEnabled: cacheOn }),
    [turnList, windowMin, gap, tierKey, cacheOn]
  );
  const burst = useMemo(() => spacedCost(turns, 5, { windowMin, tierKey, cacheEnabled: true }), [turns, windowMin, tierKey]);
  const daily = useMemo(() => spacedCost(turns, 1440, { windowMin, tierKey, cacheEnabled: true }), [turns, windowMin, tierKey]);

  const fmt = (v) => `$${v.toFixed(4)}`;
  const warm = cacheOn && gap <= windowMin;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧊 Simulator — one conversation, your window</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Each turn is 900 input tokens of history plus a 450-token reply. The question is only: is the prefix still warm when the next turn arrives?
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Gap between turns</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: gap <= windowMin ? TEAL_DARK : RED }}>{gap} min</span>
            </div>
            <input type="range" min={1} max={180} step={1} value={gap}
              onChange={(e) => setGap(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Gap between turns" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Turns in the thread</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE_DARK }}>{turns}</span>
            </div>
            <input type="range" min={3} max={20} step={1} value={turns}
              onChange={(e) => setTurns(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Turns" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Cache window / tier</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              {CACHE_WINDOWS.map((w, i) => (
                <button key={w.minutes} onClick={() => setWindowIdx(i)}
                  style={{
                    flex: 1, padding: '5px 4px', fontSize: 10.5, borderRadius: 7, cursor: 'pointer',
                    border: `1px solid ${windowIdx === i ? TEAL : 'var(--ds-color-border-subtle)'}`,
                    background: windowIdx === i ? '#E3F2F2' : 'transparent',
                    color: windowIdx === i ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                    fontWeight: 600,
                  }}>{w.minutes}m</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Object.keys(PRICE_TIERS).map((k) => (
                <button key={k} onClick={() => setTierKey(k)}
                  style={{
                    flex: 1, padding: '5px 4px', fontSize: 10.5, borderRadius: 7, cursor: 'pointer',
                    border: `1px solid ${tierKey === k ? PURPLE : 'var(--ds-color-border-subtle)'}`,
                    background: tierKey === k ? '#F5F3FA' : 'transparent',
                    color: tierKey === k ? PURPLE_DARK : 'var(--ds-color-text-secondary)',
                    fontWeight: 600,
                  }}>{PRICE_TIERS[k].label.split(' ')[0]}</button>
              ))}
            </div>
          </div>
        </Grid>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setCacheOn(!cacheOn)}
            style={{
              padding: '7px 14px', fontSize: 12.5, borderRadius: 9, cursor: 'pointer', fontWeight: 600,
              border: `1.5px solid ${cacheOn ? TEAL : RED}`,
              background: cacheOn ? '#E3F2F2' : '#FBEAE4',
              color: cacheOn ? TEAL_DARK : RED,
            }}>{cacheEnabledLabel(cacheOn)}</button>
          <Badge variant="default" style={{
            background: warm && cacheOn ? '#E3F2F2' : '#FBEAE4',
            color: warm && cacheOn ? TEAL_DARK : RED,
          }}>
            {cacheOn ? (warm ? 'prefix WARM — cached at 1/10' : 'prefix COLD — full recompute') : 'cache disabled'}
          </Badge>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={fmt(result.cost)} label="This conversation costs" color={TEAL_DARK} />
          <Metric value={fmt(result.naive)} label="Without any cache (naive)" color={PURPLE_DARK} />
          <Metric value={`${Math.round(result.savingsPct * 100)}%`} label="Saved by caching" color={result.savings > 0 ? TEAL_DARK : RED} />
          <Metric value={`${result.misses}`} label="Cold restarts (misses)" color={result.misses ? RED : TEAL_DARK} />
          <Metric value={`${result.cachedTokens.toLocaleString()}`} label="Tokens billed at 1/10" />
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${TEAL}` }}>
            <strong style={{ fontSize: 12.5, color: TEAL_DARK, display: 'block', marginBottom: 4 }}>Coffee-break trap — same {turns} questions</strong>
            <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
              All {turns} within 5 min: <strong style={{ color: TEAL_DARK }}>{fmt(burst.cost)}</strong><br />
              One per day (never warm): <strong style={{ color: RED }}>{fmt(daily.cost)}</strong><br />
              Daily costs <strong>{daily.cost > burst.cost ? (daily.cost / burst.cost).toFixed(1) : '1.0'}×</strong> more for identical questions.
            </div>
          </Card>
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${PURPLE}` }}>
            <strong style={{ fontSize: 12.5, color: PURPLE_DARK, display: 'block', marginBottom: 4 }}>Every hit resets the clock</strong>
            <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
              A cache hit inside the window extends it — keep the exchange moving and the prefix stays warm indefinitely.
              Walk away longer than the window and the model starts from token one: on long threads that is the single most expensive habit in AI work.
            </div>
          </Card>
        </Grid>
      </Stack>
    </Card>
  );
}

function cacheEnabledLabel(on) {
  return on ? 'cache: ON' : 'cache: OFF (never miss = never save)';
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function CostTollBoothTab() {
  const [activeSubTab, setActiveSubTab] = useState('meter');

  const factColumns = [
    { key: 'fact', header: 'How the meter works' },
    { key: 'why', header: 'Why it matters for the bill', sortable: false },
  ];
  const windowColumns = [
    { key: 'where', header: 'Where you’re working' },
    { key: 'minutes', header: 'Cache window', render: (v) => (
      <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK, fontWeight: 700 }}>~{v} min</span>
    ) },
  ];
  const trimColumns = [
    { key: 'trim', header: 'Trim', render: (v) => <strong>{v}</strong> },
    { key: 'recurring', header: 'Charged', render: (v) => <span style={{ color: RED, fontWeight: 600 }}>{v}</span> },
    { key: 'note', header: 'Note', sortable: false },
  ];
  const ladderColumns = [
    { key: 'label', header: 'Rung', render: (v, row) => (
      <strong>{v} <span style={{ fontWeight: 400, color: 'var(--ds-color-text-tertiary)', fontSize: 12 }}>
        (${row.in} in / ${row.out} out per M)</span></strong>
    ) },
    { key: 'best', header: 'Send it', sortable: false },
  ];
  const internColumns = [
    { key: 'rule', header: 'Rule', render: (v) => <strong>{v}</strong> },
    { key: 'why', header: 'Why', sortable: false },
  ];
  const detColumns = [
    { key: 'step', header: 'Step type' },
    { key: 'use', header: 'Use', render: (v) => <code style={{ fontSize: 12.5 }}>{v}</code> },
    { key: 'why', header: 'Why', sortable: false },
  ];
  const ladderRows = Object.values(PRICE_TIERS);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="costtollbooth"
        moduleLabel="Cost & Ops [Token Economics]"
        title="Your AI Bill Is a Toll Booth — Stop Paying Twice"
        description="Agents don’t just answer, they burn tokens on every step — and without caching you re-buy the entire conversation each turn, both directions. Know your cache window, trim the recurring fat, match the tier to the job, and let code do anything with one right answer."
        metrics={[
          { label: 'Cached input vs full price', value: '1/10' },
          { label: 'Tokens per word (rule of thumb)', value: '≈ 1.33' },
          { label: 'Cheapest→priciest spread in one family', value: '10×' },
          { label: 'Cost growth without cache', value: 'quadratic' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '185px', padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? PURPLE : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'meter' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Two lanes, one booth per token</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                You are a token predictor too — finish “twinkle, twinkle, little…” without thinking. The model does that one token at a time, and each prediction needs the maths for every token before it. That physics is the bill.
              </p>
              <TollBoothDiagram />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The conversation that never stops replaying</h3>
              <ReplayDiagram />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Four facts that explain the bill</h3>
              <Table columns={factColumns} data={TOKEN_FACTS} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'cache' && (
          <Stack gap={6}>
            <CacheSim />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Know your number — windows shift by tool</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                These drift over time; the point isn’t memorizing the table, it’s knowing <em>your</em> setup’s window before you plan a back-and-forth session.
              </p>
              <Table columns={windowColumns} data={CACHE_WINDOWS} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'trims' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Trim the fat — every sentence is a recurring charge</h3>
              <Table columns={trimColumns} data={TRIMS} sortable={false} />
            </Card>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Match the tier to the job</h3>
                <Table columns={ladderColumns} data={ladderRows} sortable={false} />
                <Callout type="tip" title="To think, or not to think">
                  Reasoning models write a private chain of thought before answering — a big part of why analysis got so much better. But “label these 500 emails” needs a fast clerk, not a philosopher. Skipping reasoning on clerical work is the two-second habit that stretches a budget.
                </Callout>
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Send in the interns — subagent rules</h3>
                <Table columns={internColumns} data={INTERN_RULES} sortable={false} />
              </Card>
            </Grid>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>If a step can be deterministic, make it deterministic</h3>
              <Table columns={detColumns} data={DETERMINISTIC} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'sheet' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#12141A' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#F3F4F6' }}>📋 The cheat sheet</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {CHEAT_SHEET.map((line, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, alignItems: 'baseline', color: '#D7DBE2',
                    fontSize: 13.5, lineHeight: 1.55,
                  }}>
                    <span style={{ color: '#7FD1D4', fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: '14px 0 0 0', color: '#8B93A1', fontSize: 12.5 }}>
                The hacks keep changing. The physics won’t: every new token leans on every token before it, so the cheapest token is the one never worked out twice.
              </p>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Cost of a conversation, warm vs cold</h3>
              <CodeBlock language="python" code={CODE_CALC} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · The two-second habit: route by tier</h3>
              <CodeBlock language="python" code={CODE_LADDER} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
