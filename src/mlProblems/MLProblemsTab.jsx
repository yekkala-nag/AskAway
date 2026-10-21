import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Callout } from '../components/ui/Core.jsx';
import {
  FRAMING_TEMPLATE,
  FRAMING_BLOCKS,
  PROBLEM_TYPES,
  TYPE_BY_ID,
  EXAMPLES,
  DECISION_QUESTIONS,
  LEAF_NOTES,
  resolveType,
  ML_CHECKLIST,
  ML_FRAMING_PROMPT,
  DIFFICULTY_SPECTRUM,
  SIDE_CONCEPTS,
  buildFramingPrompt,
} from './mlProblemsEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'frame', icon: '📐', label: '1. Framing Template', desc: 'Given → Identify → Benefit' },
  { id: 'taxonomy', icon: '🗂️', label: '2. Taxonomy & Examples', desc: 'Four types, ten grounds' },
  { id: 'tree', icon: '🌳', label: '3. Decision Tree', desc: 'Classify any problem' },
  { id: 'check', icon: '✅', label: '4. Is It ML?', desc: 'Checklist & full prompt' },
];

const TYPE_COLORS = { classification: TEAL_DARK, regression: PURPLE, clustering: AMBER, rule_extraction: RED };

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

// ── 1. Framing template ─────────────────────────────────────────────────────

function FramingTemplate() {
  const [data, setData] = useState('two years of card transactions');
  const [decision, setDecision] = useState('whether a transaction is fraudulent');
  const [benefit, setBenefit] = useState('fraudulent charges get refunded early');
  const [type, setType] = useState('classification');
  const prompt = useMemo(() => buildFramingPrompt({ data, decision, benefit, type }), [data, decision, benefit, type]);

  const inputs = [
    { key: 'data', label: 'Given — the data', value: data, set: setData },
    { key: 'decision', label: 'Identify / predict — the decision', value: decision, set: setDecision },
    { key: 'benefit', label: 'Benefit — the action', value: benefit, set: setBenefit },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📐 One sentence makes it a machine-learning problem</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              ML is defined by the problem being solved, not the algorithm. Fill three slots — the data you have, the single decision to model, the benefit someone acts on — and you have a framed problem ready to classify.
            </p>
          </div>
          <CodeBlock language="text" code={FRAMING_TEMPLATE} showLineNumbers={false} />
          <Grid columns={3} gap="var(--ds-space-4)">
            {FRAMING_BLOCKS.map((b) => (
              <Card key={b.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 16 }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK, marginTop: 4 }}>{b.name}</div>
                <div style={{ fontSize: 12.5, fontFamily: 'ui-monospace, monospace', margin: '6px 0', color: 'var(--ds-color-text-primary)' }}>{b.line}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>{b.why}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🛠️ Framing simulator — fill the slots, get the brief</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Edit any field and the framing, type assignment, data needs, and algorithm families regenerate live.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {inputs.map((f) => (
              <label key={f.key} style={{ display: 'block' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: TEAL_DARK }}>{f.label}</span>
                <input
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  style={{
                    width: '100%', marginTop: 6, padding: '9px 10px', borderRadius: 8, minHeight: 44,
                    border: '1.5px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-surface)',
                    color: 'var(--ds-color-text-primary)', fontSize: 13, fontFamily: 'inherit',
                  }}
                />
              </label>
            ))}
          </Grid>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROBLEM_TYPES.map((t) => (
              <button key={t.id} onClick={() => setType(t.id)} aria-pressed={type === t.id} style={chipStyle(type === t.id)}>
                {t.icon} {t.name}
              </button>
            ))}
          </div>
          <CodeBlock language="text" code={prompt} showLineNumbers={false} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Taxonomy & examples ──────────────────────────────────────────────────

function Taxonomy() {
  const cols = [
    { key: 'name', header: 'Problem', render: (v) => <strong>{v}</strong> },
    { key: 'given', header: 'Given (the data)', sortable: false },
    { key: 'decision', header: 'Decision modelled', sortable: false },
    { key: 'benefit', header: 'Benefit', sortable: false },
    {
      key: 'type', header: 'Type', render: (v) => (
        <span style={{ color: TYPE_COLORS[v], fontWeight: 700, fontSize: 12 }}>
          {TYPE_BY_ID[v].icon} {TYPE_BY_ID[v].name}
        </span>
      ),
    },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🗂️ Four problem classes — name the type, unlock the data & algorithms</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Knowing the class of problem tells you what data you need and which families of algorithms are worth trying. Work backwards from the outcome the client is asking for.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            {PROBLEM_TYPES.map((t) => (
              <Card key={t.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)', borderTop: `3px solid ${TYPE_COLORS[t.id]}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{t.icon}</span>
                  <strong style={{ fontSize: 15, color: TYPE_COLORS[t.id] }}>{t.name}</strong>
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                    background: t.labeled ? '#E8F3F3' : '#F9F1DC', color: t.labeled ? TEAL_DARK : AMBER,
                  }}>
                    {t.labeled ? 'LABELLED data' : 'UNLABELLED data'}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, margin: '8px 0 4px', color: 'var(--ds-color-text-secondary)' }}><strong>Outcome:</strong> {t.outcome}</div>
                <div style={{ fontSize: 12.5, margin: '0 0 4px', color: 'var(--ds-color-text-secondary)' }}><strong>Essence:</strong> {t.essence}</div>
                <div style={{ fontSize: 12.5, margin: '0 0 4px', color: 'var(--ds-color-text-secondary)' }}><strong>Data needed:</strong> {t.dataNeeds}</div>
                <div style={{ fontSize: 12.5, marginTop: 6 }}>
                  <strong style={{ fontSize: 12 }}>Try:</strong>{' '}
                  {t.algorithmHints.map((a, i) => (
                    <span key={a} style={{ color: TYPE_COLORS[t.id] }}>{a}{i < t.algorithmHints.length - 1 ? ' · ' : ''}</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', marginTop: 8, padding: '8px 10px', borderRadius: 8, background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', lineHeight: 1.5 }}>
                  {t.framed}
                </div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔟 Ten problems that ground the theory</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Each row is a corpus of examples, a decision modelled, and a benefit. Sort by type to see the distribution.
            </p>
          </div>
          <Table columns={cols} data={EXAMPLES} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROBLEM_TYPES.map((t) => (
              <span key={t.id} style={{
                fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 999,
                background: 'var(--ds-color-bg-surfaceHover)', color: TYPE_COLORS[t.id],
              }}>
                {t.icon} {t.name}: {EXAMPLES.filter((e) => e.type === t.id).length}
              </span>
            ))}
          </div>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <h3 style={{ margin: 0 }}>🎚️ Difficulty is a spectrum, not a verdict</h3>
          {DIFFICULTY_SPECTRUM.map((d) => (
            <div key={d.band} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', borderRadius: 10, background: 'var(--ds-color-bg-surfaceHover)' }}>
              <strong style={{ fontSize: 13, color: TEAL_DARK, minWidth: 180 }}>{d.band}</strong>
              <div>
                <div style={{ fontSize: 12.5 }}>{d.examples}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>{d.note}</div>
              </div>
            </div>
          ))}
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. Decision tree ────────────────────────────────────────────────────────

function DecisionTree() {
  const [answers, setAnswers] = useState({});
  const result = resolveType(answers);
  const answered = Object.keys(answers).length;

  const qDecision = answers.decision;
  const showLabels = qDecision === 'yes';
  const showReal = answers.labels === 'yes';
  const showStructure = qDecision === 'yes' && answers.labels === 'no';

  const set = (id, v) => setAnswers((a) => {
    const next = { ...a, [id]: v };
    if (id === 'decision') { delete next.labels; delete next.real; delete next.structure; }
    if (id === 'labels') { delete next.real; delete next.structure; }
    return next;
  });

  const qCard = (q, options, visible) => visible === false ? null : (
    <Card key={q.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)', opacity: answers[q.id] ? 1 : 0.95 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{q.q}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map(([val, label]) => (
          <button key={val} onClick={() => set(q.id, val)} aria-pressed={answers[q.id] === val} style={chipStyle(answers[q.id] === val)}>{label}</button>
        ))}
      </div>
    </Card>
  );

  const q0 = DECISION_QUESTIONS[0];
  const q1 = DECISION_QUESTIONS[1];
  const q2 = DECISION_QUESTIONS[2];
  const q3 = DECISION_QUESTIONS[3];

  const leaf = result === 'notml' ? null : TYPE_BY_ID[result];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🌳 Problem-class decision tree — two questions, four answers</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Is it a decision modelled from data? Is the data labelled? Is the answer a number? Answer in order — the tree routes you to a class or tells you it isn’t ML yet.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
            <span>Progress:</span>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 26, height: 26, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12,
                background: answered > i ? TEAL : 'var(--ds-color-bg-surfaceHover)',
                color: answered > i ? '#fff' : 'var(--ds-color-text-secondary)',
              }}>{i + 1}</span>
            ))}
            {answered > 0 && (
              <button onClick={() => setAnswers({})} style={{ ...chipStyle(false), marginLeft: 8 }}>↺ Reset</button>
            )}
          </div>
          {qCard(q0, [['yes', 'Yes — one decision'], ['no', 'No / unclear']], true)}
          {qCard(q1, [['yes', 'Yes — labelled examples'], ['no', 'No labels']], showLabels)}
          {qCard(q2, [['no', 'No — a class / category'], ['yes', 'Yes — a real number']], showReal)}
          {qCard(q3, [['groups', 'Groups (segment, organize)'], ['relationships', 'If–then relationships'], ['no', 'Neither']], showStructure)}

          {result === 'notml' && answered >= 1 && (
            <Callout type="warning" title="Not (yet) an ML problem">
              {LEAF_NOTES.notml} Work backwards from the outcome: what decision would someone act on, and what data would teach it?
            </Callout>
          )}
          {leaf && (
            <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 22 }}>{leaf.icon}</span>
                <strong style={{ fontSize: 17, color: TYPE_COLORS[result] }}>{leaf.name}</strong>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                  background: leaf.labeled ? '#fff' : '#F9F1DC', color: leaf.labeled ? TEAL_DARK : AMBER,
                }}>{leaf.labeled ? 'LABELLED' : 'UNLABELLED'}</span>
              </div>
              <div style={{ fontSize: 13, margin: '10px 0 6px', color: 'var(--ds-color-text-primary)' }}>{LEAF_NOTES[result]}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}><strong>Data needed:</strong> {leaf.dataNeeds}</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>
                <strong style={{ fontSize: 12, color: TEAL_DARK }}>Try:</strong> {leaf.algorithmHints.join(' · ')}
              </div>
              <div style={{ fontSize: 12.5, marginTop: 8, fontFamily: 'ui-monospace, monospace', padding: '8px 10px', borderRadius: 8, background: '#fff', lineHeight: 1.5 }}>
                {leaf.framed}
              </div>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Is it ML? checklist + full prompt ────────────────────────────────────

function IsItML() {
  const [checked, setChecked] = useState([]);
  const toggle = (id) => setChecked((c) => c.includes(id) ? c.filter((x) => x !== id) : [...c, id]);
  const score = checked.length;

  const cols = [
    { key: 'check', header: 'Check', render: (v, row) => (
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
        <input type="checkbox" checked={checked.includes(row.id)} onChange={() => toggle(row.id)} style={{ width: 18, height: 18, accentColor: TEAL_DARK }} />
        <strong>{v}</strong>
      </label>
    ) },
    { key: 'weak', header: '🚩 Weak version', render: (v) => <span style={{ color: RED, fontSize: 12 }}>{v}</span>, sortable: false },
    { key: 'strong', header: '✅ Strong version', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span>, sortable: false },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>✅ “Is this actually an ML problem?” — five checks</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A named decision, existing data, an action downstream, recurring volume, and feedback that eventually reveals the truth. Tick what you have.
            </p>
          </div>
          <Table columns={cols} data={ML_CHECKLIST} sortable={false} />
          <div style={{
            padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: score >= 4 ? '#E8F3F3' : score >= 2 ? '#F9F1DC' : '#F7E8E3',
            color: score >= 4 ? TEAL_DARK : score >= 2 ? AMBER : RED,
          }}>
            {score >= 4 ? `Ready to frame — ${score}/5 checks pass. Write the Given→Identify→Benefit sentence and classify the type.`
              : score >= 2 ? `${score}/5 checks — promising, but a missing check is a hidden cost. Name the gap before choosing algorithms.`
              : score > 0 ? `${score}/5 checks — this may not be an ML problem yet. Collect the decision, the data, and the action first.`
              : 'Tick the checks to score your idea — most “ML projects” fail on the checklist, not the math.'}
          </div>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📜 The full framing prompt — paste a vague request, get a framed problem</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              One prompt that forces a single decision, fills the template, names the type, lists the data, and surfaces the most dangerous assumption.
            </p>
          </div>
          <CodeBlock language="text" code={ML_FRAMING_PROMPT} />
          <Grid columns={2} gap="var(--ds-space-4)">
            {SIDE_CONCEPTS.map((c) => (
              <Card key={c.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 16 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK, marginTop: 4 }}>{c.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{c.text}</div>
              </Card>
            ))}
          </Grid>
          <Callout type="info" title="Work backwards from the outcome">
            When you think something is an ML problem, ask what type you could phrase it as — or what outcome the requirement is asking for — and work backwards. The type names the data; the data names the project.
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function MLProblemsTab() {
  const [activeSubTab, setActiveSubTab] = useState('frame');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="mlproblems"
        moduleLabel="Foundations"
        title="Practical ML Problems: Frame, Classify, Then Build"
        description="Machine learning is defined by the problem being solved, not the algorithm. Frame any request as Given → Identify → Benefit, classify it into one of four problem types (classification, regression, clustering, rule extraction), and run the five-check gate that tells you whether it is worth modelling at all."
        metrics={[
          { label: 'Framing slots', value: '3' },
          { label: 'Problem types', value: '4' },
          { label: 'Grounding examples', value: '10' },
          { label: 'ML checks', value: '5' },
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

        {activeSubTab === 'frame' && <FramingTemplate />}
        {activeSubTab === 'taxonomy' && <Taxonomy />}
        {activeSubTab === 'tree' && <DecisionTree />}
        {activeSubTab === 'check' && <IsItML />}
      </Container>
    </div>
  );
}
