import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  BRIDGE_STRATEGIES,
  GAP_FRAMES,
  FINANCE_PLAYBOOK,
  GUARDRAIL_RULES,
  VERIFIABLE_TASKS,
  LEDGER_ROWS,
  BANK_ROWS,
  reconcile,
  timeSaved,
  RECON_PROMPT,
  RED_TEAM_TEXT,
  RED_TEAM_PROMPTS,
  ANTI_HYPE_MOVES,
  BLOCKERS,
  OUTCOME_FRAMING,
  MICRO_WIN_QUESTIONS,
} from './aiGapEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'gap', icon: '🌗', label: '1. The Gap', desc: 'Why beliefs diverge' },
  { id: 'finance', icon: '🏦', label: '2. Finance Playbook', desc: 'Guardrails first' },
  { id: 'lab', icon: '⚖️', label: '3. Reconciliation Lab', desc: 'The verifiable demo' },
  { id: 'antihype', icon: '🔇', label: '4. Anti-Hype Playbook', desc: 'Action, not persuasion' },
];

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

// ── 1. The Gap ──────────────────────────────────────────────────────────────

function GapChart() {
  const cols = [
    { key: 'n', header: '#', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'name', header: 'Strategy', render: (v) => <strong>{v}</strong> },
    { key: 'trap', header: 'The trap it fixes', sortable: false },
    { key: 'action', header: 'The action', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];
  const frameCols = [
    { key: 'label', header: 'Side', render: (v) => <strong>{v}</strong> },
    { key: 'level', header: 'What it looks like', sortable: false },
    { key: 'basis', header: 'Judged from', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🌗 The gap is widening faster than conversations can catch up</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The distance between “AI as a quirky chatbot” and “AI as a capable agentic coworker” is growing every quarter — and most teams are still arguing from the first line while the second line has left the building.
            </p>
          </div>
          <svg viewBox="0 0 720 250" style={{ width: '100%', height: 'auto' }} role="img" aria-label="diverging curves of perception versus capability over time">
            <line x1={50} y1={210} x2={700} y2={210} stroke="var(--ds-color-border-subtle)" strokeWidth={1.5} />
            <line x1={50} y1={20} x2={50} y2={210} stroke="var(--ds-color-border-subtle)" strokeWidth={1.5} />
            <text x={375} y={240} fontSize={12} fill="var(--ds-color-text-secondary)" textAnchor="middle">time →</text>
            <text x={16} y={120} fontSize={12} fill="var(--ds-color-text-secondary)" transform="rotate(-90 16 120)" textAnchor="middle">capability / expectation</text>
            {/* widening gap area */}
            <path d="M 70 168 C 240 165, 380 160, 680 152 L 680 55 C 380 78, 240 140, 70 168 Z" fill="#B4553A18" />
            {/* perception line: nearly flat */}
            <path d="M 70 168 C 240 165, 380 160, 680 152" fill="none" stroke={RED} strokeWidth={3} />
            {/* reality line: steep rise */}
            <path d="M 70 168 C 260 150, 380 100, 520 68 C 600 50, 650 48, 680 45" fill="none" stroke={TEAL} strokeWidth={3} />
            <circle cx={680} cy={152} r={5} fill={RED} />
            <circle cx={680} cy={45} r={5} fill={TEAL} />
            <text x={540} y={175} fontSize={13} fontWeight={700} fill={RED}>Perception: “quirky chatbot”</text>
            <text x={330} y={40} fontSize={13} fontWeight={700} fill={TEAL_DARK}>Reality: agentic coworker</text>
            <text x={600} y={105} fontSize={12} fontWeight={700} fill={AMBER} textAnchor="middle">widening</text>
            <text x={600} y={122} fontSize={12} fontWeight={700} fill={AMBER} textAnchor="middle">gap</text>
          </svg>
          <Table columns={frameCols} data={GAP_FRAMES} sortable={false} />
          <Callout type="warning" title="The free-tier illusion">
            Opinions formed on capped, outdated models are opinions about the wrong machine. The first bridge move is making sure everyone is judging the same vehicle.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>🌉 Five strategies to bridge the gap</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Move people from the casual-tier mindset to the professional-tier reality — each strategy names the trap it removes.
            </p>
          </div>
          <Table columns={cols} data={BRIDGE_STRATEGIES} sortable={false} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Finance Playbook ─────────────────────────────────────────────────────

function FinancePlaybook() {
  const demo = timeSaved(17, 10);
  const guardCols = [
    { key: 'rule', header: 'Rule', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'detail', header: 'How to state it', sortable: false },
  ];
  const taskCols = [
    { key: 'task', header: 'Task', render: (v) => <strong>{v}</strong> },
    { key: 'example', header: 'Concrete example', sortable: false },
    { key: 'why', header: 'Why it’s verifiable', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>🛡️ Guardrails first — skepticism is a strength</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              In regulated, precision-built work, a wrong number is a compliance event — not a quirky glitch. Define what the tool must not do <em>before</em> showing what it can.
            </p>
          </div>
          <Table columns={guardCols} data={GUARDRAIL_RULES} sortable={false} />
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>🍓 Low-hanging fruit: tasks with binary outcomes</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Do not start with forecasts or memos. Start where the output either matches the source or it visibly doesn’t.
            </p>
          </div>
          <Table columns={taskCols} data={VERIFIABLE_TASKS} sortable={false} />
          <Grid columns={3} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>DEMO, MANUAL</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: RED }}>{Math.floor(demo.manualSec / 60)}–20 min</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>skimming a filing for themed mentions</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>DEMO, GROUNDED</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: TEAL_DARK }}>{demo.aiSeconds} s</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>quotes + locations in a table, cited</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: '#F4EFE6', border: `1.5px solid ${AMBER}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>SPEED-UP</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: AMBER }}>{demo.speedup}×</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>and nobody had to trust an opinion</div>
            </Card>
          </Grid>
          <Callout type="tip" title="The Trojan-horse demo">
            Live, anonymized, 10 minutes: extract themed mentions with direct quotes and sections. The skeptics check the citations themselves — belief follows verification, not slides.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <h3 style={{ margin: 0 }}>🗺️ The five-move playbook</h3>
          <Grid columns={2} gap="var(--ds-space-4)">
            {FINANCE_PLAYBOOK.map((p) => (
              <Card key={p.n} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: TEAL_DARK }}>{p.n}. {p.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-primary)', margin: '6px 0 4px' }}>{p.action}</div>
                <div style={{ fontSize: 12, color: PURPLE }}>Payoff: {p.payoff}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. Reconciliation Lab ───────────────────────────────────────────────────

function ReconciliationLab() {
  const [amountTol, setAmountTol] = useState(0.05);
  const [dateTol, setDateTol] = useState(2);
  const [noiseCents, setNoiseCents] = useState(0);

  const result = useMemo(
    () => reconcile({ amountTol, dateTol, noiseCents }),
    [amountTol, dateTol, noiseCents],
  );
  const save = timeSaved(45, 5);

  const reconCols = [
    { key: 'ledgerDate', header: 'Ledger date' },
    { key: 'bankDate', header: 'Bank date' },
    { key: 'ledgerDesc', header: 'Ledger desc', sortable: false },
    { key: 'bankDesc', header: 'Bank desc', sortable: false },
    { key: 'amount', header: 'Amount', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', color: v < 0 ? RED : TEAL_DARK }}>{v < 0 ? '-' : '+'}${Math.abs(v).toFixed(2)}</span> },
    { key: 'reason', header: 'Match reason', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
  ];
  const excCols = [
    { key: 'source', header: 'Source', render: (v) => <Badge variant="default">{v}</Badge> },
    { key: 'date', header: 'Date' },
    { key: 'desc', header: 'Description', sortable: false },
    { key: 'amount', header: 'Amount', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', color: RED }}>{v < 0 ? '-' : '+'}${Math.abs(v).toFixed(2)}</span> },
    { key: 'reason', header: 'Reason', render: (v) => <span style={{ color: RED, fontSize: 12 }}>{v}</span> },
  ];

  const listCols = [
    { key: 'date', header: 'Date' },
    { key: 'desc', header: 'Description', sortable: false },
    { key: 'amount', header: 'Amount', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v < 0 ? '-' : '+'}${Math.abs(v).toFixed(2)}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>⚖️ Reconciliation Lab — AI as a deterministic pattern-matcher</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A weekly chore: eyeballing a messy bank export against the internal ledger. No creativity needed — amount and date tolerances decide, every row carries its reason, the human reviews only the exceptions.
            </p>
          </div>
          <svg viewBox="0 0 860 120" style={{ width: '100%', height: 'auto' }} role="img" aria-label="two lists flowing through a rules engine into reconciled and exception outputs">
            <rect x={6} y={18} width={170} height={84} rx={10} fill="var(--ds-color-bg-surfaceHover)" stroke={PURPLE} strokeWidth={1.5} />
            <text x={91} y={46} fontSize={12.5} fontWeight={700} fill={TEAL_DARK} textAnchor="middle">List A · Ledger</text>
            <text x={91} y={68} fontSize={11} fill="var(--ds-color-text-secondary)" textAnchor="middle">{LEDGER_ROWS.length} rows</text>
            <text x={91} y={86} fontSize={11} fill="var(--ds-color-text-secondary)" textAnchor="middle">date · desc · amount</text>
            <line x1={176} y1={60} x2={230} y2={60} stroke={PURPLE} strokeWidth={2} />
            <polygon points="230,60 222,56 222,64" fill={PURPLE} />
            <rect x={234} y={18} width={230} height={84} rx={10} fill="#F4EFE6" stroke={AMBER} strokeWidth={1.5} />
            <text x={349} y={44} fontSize={12.5} fontWeight={700} fill={AMBER} textAnchor="middle">Rules engine</text>
            <text x={349} y={66} fontSize={11} fill="var(--ds-color-text-secondary)" textAnchor="middle">|Δamount| ≤ ${amountTol.toFixed(2)} · |Δdate| ≤ {dateTol}d</text>
            <text x={349} y={86} fontSize={11} fill="var(--ds-color-text-tertiary)" textAnchor="middle">no guessing · every row reasoned</text>
            <line x1={464} y1={40} x2={530} y2={40} stroke={TEAL} strokeWidth={2} />
            <polygon points="530,40 522,36 522,44" fill={TEAL} />
            <line x1={464} y1={84} x2={530} y2={84} stroke={RED} strokeWidth={2} />
            <polygon points="530,84 522,80 522,88" fill={RED} />
            <rect x={534} y={14} width={320} height={42} rx={9} fill="#E8F3F3" stroke={TEAL} strokeWidth={1.5} />
            <text x={694} y={41} fontSize={13} fontWeight={700} fill={TEAL_DARK} textAnchor="middle">✅ Reconciled · {result.reconciled.length} rows</text>
            <rect x={534} y={68} width={320} height={42} rx={9} fill="#FDF0EC" stroke={RED} strokeWidth={1.5} />
            <text x={694} y={95} fontSize={13} fontWeight={700} fill={RED} textAnchor="middle">❌ Exceptions · {result.exceptions.length} rows</text>
          </svg>
          <Grid columns={3} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Amount tolerance: <strong style={{ color: TEAL_DARK }}>${amountTol.toFixed(2)}</strong>
              <input type="range" min={0} max={1} step={0.01} value={amountTol}
                onChange={(e) => setAmountTol(+e.target.value)} style={{ width: '100%' }} aria-label="amount tolerance in dollars" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Date tolerance: <strong style={{ color: PURPLE }}>{dateTol} day{dateTol === 1 ? '' : 's'}</strong>
              <input type="range" min={0} max={7} step={1} value={dateTol}
                onChange={(e) => setDateTol(+e.target.value)} style={{ width: '100%' }} aria-label="date tolerance in days" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Bank rounding noise: <strong style={{ color: AMBER }}>{noiseCents}¢</strong>
              <input type="range" min={0} max={50} step={1} value={noiseCents}
                onChange={(e) => setNoiseCents(+e.target.value)} style={{ width: '100%' }} aria-label="simulated bank rounding noise in cents" />
            </label>
          </Grid>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Badge variant="default">{result.reconciled.length} reconciled · {result.exceptions.length} exceptions</Badge>
            {noiseCents > amountTol * 100 && <Badge variant="default">⚠ noise exceeds amount tolerance</Badge>}
          </div>
          <Table columns={reconCols} data={result.reconciled} sortable={false} />
          <Table columns={excCols} data={result.exceptions} sortable={false} />
          <Callout type={result.exceptions.length ? 'info' : 'success'} title={result.exceptions.length ? 'The human reviews only this' : 'Everything matched within tolerances'}>
            {result.exceptions.length
              ? 'The exceptions table is the analyst’s queue — everything else arrived pre-reasoned. Raise the date tolerance to 3 days and watch the two late posts reconcile; drop amount tolerance to 0.01 with noise on and watch cents break the match.'
              : 'Even at zero tolerances, exact pairs stay matched. The point: the rules decide, and the analyst only ever sees exceptions.'}
          </Callout>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>LIST A · INTERNAL LEDGER</div>
              <div style={{ marginTop: 6 }}><Table columns={listCols} data={LEDGER_ROWS} sortable={false} /></div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>LIST B · BANK STATEMENT</div>
              <div style={{ marginTop: 6 }}><Table columns={listCols} data={BANK_ROWS} sortable={false} /></div>
            </Card>
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>📜 The exact prompt (nothing left to imagination)</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              System instructions ban estimating and external knowledge, define the tolerances, and force a reason onto every row. Copy, paste, run — the output above is what comes back in seconds.
            </p>
          </div>
          <CodeBlock language="text" code={RECON_PROMPT} />
          <Callout type="success" title={`${save.speedup}× faster, zero creative trust required`}>
            Manual: ~{Math.round(save.manualSec / 60)} minutes of cross-referencing. Machine: {save.aiSeconds} seconds with a reason per row. You never called it AI out loud — you handed back a finished file and offered the prompt.
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Anti-Hype ────────────────────────────────────────────────────────────

function AntiHype() {
  const [pid, setPid] = useState(null);
  const prompt = RED_TEAM_PROMPTS.find((p) => p.id === pid);
  const tone = prompt?.verdict === 'pass' ? TEAL : prompt?.verdict === 'warn' ? AMBER : RED;

  const moveCols = [
    { key: 'name', header: 'Move', render: (v) => <strong>{v}</strong> },
    { key: 'action', header: 'Do this', sortable: false },
    { key: 'why', header: 'Why it works', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔇 Stop giving the speech — four anti-hype moves</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              When everyone is sick of hearing about the technology, preaching loses. Reframe around outcomes, remove friction, and let finished work do the arguing.
            </p>
          </div>
          <Table columns={moveCols} data={ANTI_HYPE_MOVES} sortable={false} />
          <Table
            columns={[
              { key: 'before', header: '❌ Buzzword version', render: (v) => <span style={{ color: RED }}>{v}</span> },
              { key: 'after', header: '✓ Outcome version', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
            ]}
            data={OUTCOME_FRAMING}
            sortable={false}
          />
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🧪 Red-team exercise — let the flaw show first</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The document below mentions a 6-week supplier delay (Section 3) and a 2-point margin drop (Section 7) — and nothing else. Pick a prompt and see what comes back:
            </p>
          </div>
          <div style={{
            padding: 10, borderRadius: 8, background: 'var(--ds-color-bg-surfaceHover)',
            fontSize: 12.5, fontFamily: 'ui-monospace, monospace', color: 'var(--ds-color-text-primary)',
          }}>
            {RED_TEAM_TEXT}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {RED_TEAM_PROMPTS.map((p) => (
              <button key={p.id} onClick={() => setPid(p.id)} aria-pressed={pid === p.id} style={chipStyle(pid === p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          {prompt && (
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: prompt.verdict === 'pass' ? '#E8F3F3' : prompt.verdict === 'warn' ? '#F9F1DC' : '#FDF0EC',
              border: `1.5px solid ${tone}`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: tone }}>
                {prompt.verdict === 'pass' ? '✓ GROUNDED — auditable output' : prompt.verdict === 'warn' ? '◐ MOSTLY FAITHFUL — one uncited invention' : '✗ HALLUCINATED'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ds-color-text-primary)', margin: '6px 0' }}>{prompt.result}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{prompt.lesson}</div>
            </Card>
          )}
          <Callout type="info" title="The skeptic becomes the operator">
            Once the team has watched an open prompt fabricate and a bounded prompt abstain, you no longer have to argue about trust — they saw the guardrail work with their own eyes.
          </Callout>
        </Stack>
      </Card>

      <Grid columns={2} gap="var(--ds-space-4">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🧱 Real blockers are valid — fix those</h3>
            {BLOCKERS.map((b) => (
              <Card key={b.quote} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 12.5, fontStyle: 'italic', color: 'var(--ds-color-text-primary)' }}>“{b.quote}”</div>
                <div style={{ fontSize: 12, color: TEAL_DARK, marginTop: 6 }}>
                  <strong>Valid.</strong> Real fix: {b.realFix}
                </div>
              </Card>
            ))}
            <Callout type="tip" title="Ask, don’t lecture">
              “What is the actual reason we aren’t using this — IT, compliance, or time?” — then address that reason, not the attitude.
            </Callout>
          </Stack>
        </Card>
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🌱 Micro-win questions for your next meeting</h3>
            {MICRO_WIN_QUESTIONS.map((m) => (
              <Card key={m.prompt} style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: '1px solid #B7D9D9' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{m.prompt}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>→ {m.next}</div>
              </Card>
            ))}
            <Callout type="success" title="Champions are created, not converted">
              When someone leaves 30 minutes early on a Friday because a task got automated, they become the internal champion — no slide deck required.
            </Callout>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function AiGapTab() {
  const [activeSubTab, setActiveSubTab] = useState('gap');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="aigap"
        moduleLabel="Foundations"
        title="Bridging the AI Understanding Gap — Before It Widens Further"
        description="The split between “quirky chatbot” and “agentic coworker” is growing faster than workplaces can absorb, and the friction shows up in boardrooms and standups alike. Bridge it with five team strategies, a regulated-industry playbook that puts guardrails first, a fully deterministic reconciliation lab you can run right now, and an anti-hype kit for teams already tired of hearing about the technology."
        metrics={[
          { label: 'Bridge strategies', value: '5' },
          { label: 'Guardrail rules', value: '3' },
          { label: 'Lab tolerances', value: '2' },
          { label: 'Anti-hype moves', value: '4' },
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
                color: activeSubTab === tab.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
                transition: 'background .2s, color .2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'gap' && <GapChart />}
        {activeSubTab === 'finance' && <FinancePlaybook />}
        {activeSubTab === 'lab' && <ReconciliationLab />}
        {activeSubTab === 'antihype' && <AntiHype />}
      </Container>
    </div>
  );
}
