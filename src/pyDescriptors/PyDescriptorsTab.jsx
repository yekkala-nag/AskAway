import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  DESCRIPTOR_KINDS,
  PROTOCOL_METHODS,
  LOOKUP_CHAIN,
  VS_PROPERTY,
  validateRating,
  toUsd,
  JPY_USD_RATE,
  lazyAccessLog,
  lookupWinner,
  DESC_CODE,
  TAB_CODE_DEMO,
  demoTrace,
} from './pyDescEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'protocol', icon: '🔬', label: '1. The Protocol', desc: 'How attribute access routes' },
  { id: 'validator', icon: '🛡️', label: '2. Validator Lab', desc: 'Validated attributes live' },
  { id: 'computed', icon: '🧮', label: '3. Computed & Lazy', desc: 'Derive and defer' },
  { id: 'assembly', icon: '🧵', label: '4. Full Assembly', desc: 'Three hooks, one class' },
];

// ── 1. Protocol ─────────────────────────────────────────────────────────────

function ProtocolFlow() {
  const [hasSet, setHasSet] = useState(true);
  const [inInstanceDict, setInInstanceDict] = useState(false);
  const result = lookupWinner({ hasSet, inInstanceDict });

  const chainCols = [
    { key: 'step', header: 'Rank', render: (v, row) => <strong style={{ color: TEAL_DARK }}>#{row.n}</strong> },
    { key: 'step', header: 'Where Python looks', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Detail', sortable: false },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔬 Attribute access is a routing table, not a dict lookup</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A descriptor is a class implementing __get__ / __set__ / __delete__. When you write <code>tour.rating</code>, Python walks a fixed chain to decide who answers — and __set__ makes the descriptor outrank the instance dict.
            </p>
          </div>
          <svg viewBox="0 0 860 200" style={{ width: '100%', height: 'auto' }} role="img" aria-label="attribute lookup chain from instance to class">
            {LOOKUP_CHAIN.map((s, i) => {
              const x = 8 + i * 214;
              const hot = (s.n === 1 && hasSet) || (s.n === 2 && !hasSet && inInstanceDict) || (s.n === 3 && !hasSet && !inInstanceDict);
              return (
                <g key={s.n}>
                  <rect x={x} y={30} width={190} height={92} rx={12}
                    fill={hot ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)'}
                    stroke={hot ? TEAL : 'var(--ds-color-border-subtle)'} strokeWidth={hot ? 2.5 : 1.5}
                    style={{ transition: 'all .25s' }} />
                  <text x={x + 14} y={56} fontSize={12} fontWeight={800} fill={TEAL_DARK}>#{s.n}</text>
                  <text x={x + 14} y={78} fontSize={13.5} fontWeight={700} fill="var(--ds-color-text-primary)">{s.step}</text>
                  <text x={x + 14} y={98} fontSize={10.5} fill="var(--ds-color-text-secondary)">{s.detail.slice(0, 42)}…</text>
                  {hot && <circle cx={x + 176} cy={50} r={8} fill={TEAL} />}
                  {i < 3 && (
                    <g>
                      <line x1={x + 190} y1={76} x2={x + 210} y2={76} stroke={PURPLE} strokeWidth={2} />
                      <polygon points={`${x + 210},76 ${x + 202},72 ${x + 202},80`} fill={PURPLE} />
                    </g>
                  )}
                </g>
              );
            })}
            <text x={12} y={160} fontSize={12} fill="var(--ds-color-text-secondary)">Green = who wins for the attribute shape you configured below. The walk stops at the first hit.</text>
          </svg>
          <Grid columns={2} gap="var(--ds-space-4)">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setHasSet((v) => !v)} aria-pressed={hasSet} style={chipStyle(hasSet)}>
                {hasSet ? '✓ Descriptor defines __set__ (data)' : '✗ Descriptor is __get__-only (non-data)'}
              </button>
              <button onClick={() => setInInstanceDict((v) => !v)} aria-pressed={inInstanceDict} style={chipStyle(inInstanceDict)}>
                {inInstanceDict ? '✓ Name already in instance __dict__' : '✗ Instance dict is empty for this name'}
              </button>
            </div>
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: '#E8F3F3', border: `1.5px solid ${TEAL}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>WINNER</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: TEAL_DARK, margin: '4px 0' }}>{result.label}</div>
            </Card>
          </Grid>
          <Table columns={chainCols} data={LOOKUP_CHAIN} sortable={false} />
        </Stack>
      </Card>

      <Grid columns={2} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>⚙️ The four protocol hooks</h3>
            <Table
              columns={[
                { key: 'method', header: 'Method', render: (v) => <code style={{ fontSize: 11.5 }}>{v}</code> },
                { key: 'fires', header: 'Fires on', sortable: false },
                { key: 'note', header: 'Note', sortable: false },
              ]}
              data={PROTOCOL_METHODS}
              sortable={false}
            />
          </Stack>
        </Card>
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🆚 Descriptors vs @property</h3>
            <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              @property handles exactly one attribute per decorated pair. Descriptors are a reusable class — define the rule once, attach it many times.
            </p>
            <Table
              columns={[
                { key: 'axis', header: 'Axis', render: (v) => <strong>{v}</strong> },
                { key: 'property', header: '@property', sortable: false },
                { key: 'descriptor', header: 'Descriptor', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
              ]}
              data={VS_PROPERTY}
              sortable={false}
            />
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

// ── 2. Validator Lab ────────────────────────────────────────────────────────

function ValidatorLab() {
  const [value, setValue] = useState(4.8);
  const [minVal, setMinVal] = useState(1.0);
  const [maxVal, setMaxVal] = useState(5.0);
  const [asText, setAsText] = useState(false);

  const effective = asText ? '4.8' : value;
  const result = validateRating(effective, minVal, maxVal);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🛡️ Validator Lab — every write passes through __set__</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            The descriptor stores bounds at class level and a private key via __set_name__. Drag the rating or widen the bounds — the exception text is generated from those same bounds.
          </p>
        </div>
        <Grid columns={3} gap="var(--ds-space-4)">
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Rating value: <strong style={{ color: PURPLE }}>{asText ? '"4.8" (str)' : value}</strong>
            <input type="range" min={0} max={7} step={0.1} value={value} disabled={asText}
              onChange={(e) => setValue(+e.target.value)}
              style={{ width: '100%', opacity: asText ? 0.4 : 1 }} aria-label="rating value" />
          </label>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            min_val: <strong style={{ color: TEAL_DARK }}>{minVal.toFixed(1)}</strong>
            <input type="range" min={0} max={4.9} step={0.1} value={minVal}
              onChange={(e) => setMinVal(+e.target.value)} style={{ width: '100%' }} aria-label="minimum allowed rating" />
          </label>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            max_val: <strong style={{ color: TEAL_DARK }}>{maxVal.toFixed(1)}</strong>
            <input type="range" min={0.1} max={7} step={0.1} value={maxVal}
              onChange={(e) => setMaxVal(+e.target.value)} style={{ width: '100%' }} aria-label="maximum allowed rating" />
          </label>
        </Grid>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setAsText((v) => !v)} aria-pressed={asText} style={chipStyle(asText)}>
            {asText ? '✓ Send a string instead of a number' : '○ Send a number'}
          </button>
          {minVal >= maxVal && (
            <Badge variant="default">⚠ min_val must stay below max_val</Badge>
          )}
        </div>
        <Grid columns={2} gap="var(--ds-space-4)">
          <Card style={{
            padding: 'var(--ds-space-4)',
            background: result.ok ? '#E8F3F3' : '#FDF0EC',
            border: `1.5px solid ${result.ok ? TEAL : RED}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>__set__ VERDICT</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: result.ok ? TEAL_DARK : RED, margin: '4px 0' }}>
              {result.ok ? '✓ ACCEPTED — stored as float' : `✗ RAISES ${result.kind}`}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
              {result.ok
                ? `_rating ← ${result.stored}`
                : `${result.kind}: ${result.message}`}
            </div>
          </Card>
          <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>WHAT HAPPENED UNDER THE HOOD</div>
            <ol style={{ margin: '8px 0 0 0', paddingLeft: 18, fontSize: 12.5, lineHeight: 1.7, color: 'var(--ds-color-text-primary)' }}>
              <li>Class body executed → <code>__set_name__(JapanTour, "rating")</code> recorded <code>_rating</code></li>
              <li><code>tour.rating = …</code> hit the data descriptor, not the instance dict</li>
              <li>Type check → range check → <code>setattr(obj, "_rating", float(value))</code></li>
            </ol>
          </Card>
        </Grid>
        <Callout type="tip" title="Why float(value) on the way in">
          Normalizing at the boundary means every later reader sees one type. Validators that store raw input just move the type bug downstream.
        </Callout>
      </Stack>
    </Card>
  );
}

// ── 3. Computed & Lazy ──────────────────────────────────────────────────────

function ComputedLazy() {
  const [jpy, setJpy] = useState(45000);
  const usd = toUsd(jpy);
  const [accesses, setAccesses] = useState(2);
  const log = useMemo(() => lazyAccessLog(accesses), [accesses]);
  const computes = log.filter((r) => !r.hit).length;
  const hits = log.filter((r) => r.hit).length;

  return (
    <Stack gap={5}>
      <Grid columns={2} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={4}>
            <div>
              <h3 style={{ margin: 0 }}>🧮 Computed attribute — derived, never stored</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                __get__ reads <code>price_jpy</code> off the same object and converts on the fly. Change the base price; the derived value follows with zero cache invalidation code.
              </p>
            </div>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              price_jpy: <strong style={{ color: PURPLE }}>¥{jpy.toLocaleString()}</strong>
              <input type="range" min={1000} max={120000} step={500} value={jpy}
                onChange={(e) => setJpy(+e.target.value)} style={{ width: '100%' }} aria-label="price in yen" />
            </label>
            <svg viewBox="0 0 300 110" style={{ width: '100%', height: 'auto' }} role="img" aria-label="yen price flowing through exchange rate into dollars">
              <rect x={4} y={24} width={110} height={62} rx={10} fill="var(--ds-color-bg-surfaceHover)" stroke={PURPLE} strokeWidth={1.5} />
              <text x={59} y={50} fontSize={11} fontWeight={700} fill="var(--ds-color-text-secondary)" textAnchor="middle">price_jpy</text>
              <text x={59} y={72} fontSize={16} fontWeight={800} fill={TEAL_DARK} textAnchor="middle">¥{jpy.toLocaleString()}</text>
              <line x1={114} y1={55} x2={146} y2={55} stroke={AMBER} strokeWidth={2.5} />
              <polygon points="146,55 138,51 138,59" fill={AMBER} />
              <rect x={150} y={34} width={62} height={42} rx={8} fill="#F4EFE6" stroke={AMBER} strokeWidth={1.5} />
              <text x={181} y={60} fontSize={11} fontWeight={700} fill={AMBER} textAnchor="middle">×{JPY_USD_RATE}</text>
              <line x1={212} y1={55} x2={238} y2={55} stroke={AMBER} strokeWidth={2.5} />
              <polygon points="238,55 230,51 230,59" fill={AMBER} />
              <rect x={242} y={24} width={56} height={62} rx={10} fill="#E8F3F3" stroke={TEAL} strokeWidth={1.5} />
              <text x={270} y={50} fontSize={11} fontWeight={700} fill="var(--ds-color-text-secondary)" textAnchor="middle">usd</text>
              <text x={270} y={72} fontSize={16} fontWeight={800} fill={TEAL_DARK} textAnchor="middle">${usd.toFixed(2)}</text>
            </svg>
            <Callout type="warning" title="Writes are rejected on purpose">
              price_usd = 10 raises AttributeError — a computed value that accepts assignments invites two sources of truth.
            </Callout>
          </Stack>
        </Card>

        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={4}>
            <div>
              <h3 style={{ margin: 0 }}>😴 Lazy attribute — pay on first read, cache forever</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Each access simulates one read of <code>tour.itinerary</code>. The first one runs the expensive build and parks the result in __dict__; every later read bypasses the descriptor entirely.
              </p>
            </div>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Accesses: <strong style={{ color: PURPLE }}>{accesses}</strong>
              <input type="range" min={1} max={6} step={1} value={accesses}
                onChange={(e) => setAccesses(+e.target.value)} style={{ width: '100%' }} aria-label="number of itinerary accesses" />
            </label>
            <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
              <span style={{ color: RED, fontWeight: 700 }}>computes: {computes}</span>
              <span style={{ color: TEAL_DARK, fontWeight: 700 }}>cache hits: {hits}</span>
            </div>
            <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {log.map((r) => (
                <div key={r.n} style={{
                  display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center',
                  padding: '7px 10px', borderRadius: 8, fontSize: 12,
                  background: r.hit ? '#E8F3F3' : '#FDF0EC',
                  border: `1px solid ${r.hit ? TEAL : '#E8B4A8'}`,
                  transition: 'background .2s',
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>read #{r.n}</span>
                  <span style={{ color: 'var(--ds-color-text-secondary)', flex: 1 }}>{r.path}</span>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: r.hit ? TEAL_DARK : RED }}>{r.cost}</span>
                </div>
              ))}
            </div>
            <Callout type="info" title="The bypass is the trick">
              Storing the cache under the attribute's own name in __dict__ means Python finds it before the non-data descriptor on later reads — no if-check needed on the hot path in real code; the dict itself is the cache.
            </Callout>
          </Stack>
        </Card>
      </Grid>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <h3 style={{ margin: 0 }}>📋 Execution trace of the demo class</h3>
          <Table
            columns={[
              { key: 'line', header: 'Statement', render: (v) => <code style={{ fontSize: 12 }}>{v}</code> },
              { key: 'effect', header: 'What Python does', sortable: false },
            ]}
            data={demoTrace()}
            sortable={false}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Full Assembly ────────────────────────────────────────────────────────

function Assembly() {
  const kindCols = [
    { key: 'name', header: 'Kind', render: (v, row) => <span><span style={{ marginRight: 6 }}>{row.icon}</span><strong>{v}</strong></span> },
    { key: 'hooks', header: 'Hooks', render: (v) => <code style={{ fontSize: 11 }}>{v.join(', ')}</code> },
    { key: 'job', header: 'Job', sortable: false },
    { key: 'example', header: 'In the demo', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>🧵 Three descriptor classes, one class body</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Attach descriptors at class level like any other attribute. __set_name__ fires automatically while the class body executes — before a single instance exists.
            </p>
          </div>
          <Table columns={kindCols} data={DESCRIPTOR_KINDS} sortable={false} />
          <CodeBlock language="python" code={DESC_CODE} />
        </Stack>
      </Card>
      <Grid columns={2} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <CodeBlock language="python" code={TAB_CODE_DEMO} />
        </Card>
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🎯 When to reach for which</h3>
            {DESCRIPTOR_KINDS.map((k) => (
              <Card key={k.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: TEAL_DARK }}>{k.icon} {k.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', margin: '4px 0' }}>{k.job}</div>
                <div style={{ fontSize: 12, color: RED }}>Without it: {k.without}</div>
              </Card>
            ))}
            <Callout type="success" title="The one-sentence takeaway">
              Descriptors turn attribute access into reusable policy: validate on write, derive on read, defer until needed — three behaviors, one protocol, zero getter boilerplate.
            </Callout>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function PyDescriptorsTab() {
  const [activeSubTab, setActiveSubTab] = useState('protocol');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="pydescriptors"
        moduleLabel="Data & Platform Layers"
        title="Python Descriptors: Validated, Computed & Lazy Attributes"
        description="Descriptors are the protocol behind every attribute access — a class implementing __get__/__set__/__delete__ intercepts reads and writes on other objects. Build three production patterns with it: a validated attribute that rejects bad writes, a computed read-only attribute derived on the fly, and a lazily loaded attribute that pays its cost once. Interactive: walk the lookup chain, run the validator, and watch the lazy cache kick in."
        metrics={[
          { label: 'Controlled kinds', value: '3' },
          { label: 'Protocol hooks', value: '4' },
          { label: 'Lookup ranks', value: '4' },
          { label: 'Property lines needed', value: '0' },
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

        {activeSubTab === 'protocol' && <ProtocolFlow />}
        {activeSubTab === 'validator' && <ValidatorLab />}
        {activeSubTab === 'computed' && <ComputedLazy />}
        {activeSubTab === 'assembly' && <Assembly />}
      </Container>
    </div>
  );
}
