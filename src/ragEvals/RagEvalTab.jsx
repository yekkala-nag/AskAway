import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { EVAL_METRICS, GRADE_TABLE, SCORE_RUN, PYTHON_RAGEVAL_CODE, generatePollutedDataset, runABBenchmark, predictPlainConcat, predictLabeledTruth, AB_LESSON } from './ragEvalEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function RagEvalTab() {
  const [sub, setSub] = useState('triad');
  const [ret, setRet] = useState(8); const [rel, setRel] = useState(5);
  const [need, setNeed] = useState(6); const [found, setFound] = useState(5);
  const [claims, setClaims] = useState(10); const [supp, setSupp] = useState(9);
  const r = SCORE_RUN(ret, rel, need, found, claims, supp);
  const bandColor = r.band === 'Ship' ? '#5EC4C8' : r.band === 'Gate' ? '#F5A623' : '#ef4444';
  const [benchPolluted, setBenchPolluted] = useState(true);
  const [benchCount, setBenchCount] = useState(6);
  const [benchTier, setBenchTier] = useState('small');
  const benchData = generatePollutedDataset(benchCount, 7, benchPolluted);
  const bench = runABBenchmark(benchData, benchTier);
  const tabs = [
    { id: 'triad', icon: '📐', label: '1. Eval Triad', desc: 'Precision · recall · faithfulness' },
    { id: 'sim', icon: '🔬', label: '2. Ship-Gate Simulator', desc: 'Score a QA run live' },
    { id: 'bench', icon: '⚖️', label: '3. A/B Benchmark', desc: 'Polluted-context shootout' },
    { id: 'code', icon: '🛠️', label: '4. Grades + Code', desc: 'Bands & Python' }
  ];
  const slider = (label, v, set, max) => (<div><label style={{ fontSize: '11px', color: 'white' }}>{label}: {v}</label><input type="range" min="0" max={max} value={v} onChange={e => set(+e.target.value)} style={{ width: '100%' }} /></div>);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [RAG Evaluation]"
        title="RAG Eval Triad — Ship, Gate, or Rebuild?"
        description="Four numbers separate retrieval faults from generation faults. Faithfulness below 0.85 means the generator is ungrounded; recall below 0.7 means the retriever is blind. Prompt tuning fixes neither."
        metrics={[{ label: 'Triad', value: 'Prec · Rec · Faith' }, { label: 'Ship Gate', value: 'Faith ≥ 0.95' }, { label: 'Rebuild Line', value: 'Faith < 0.85' }, { label: 'Fix Order', value: 'Contract → Retrieval' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/rag_eval.svg" alt="RAG eval triad" title="Triad → Ship/Gate/Rebuild Bands" caption="Precision and recall blame retrieval; faithfulness blames generation. Bands decide the action." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'triad' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div><h3 style={{ margin: 0 }}>📐 Four metrics, each with an owner</h3></div>
          {EVAL_METRICS.map((m, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${m.metric === 'Faithfulness' ? '#5EC4C8' : '#5EC4C8'}` }}>
            <Flex justify="space-between" align="center"><strong style={{ color: 'white' }}>{m.metric}</strong><Badge variant="subtle" style={{ fontSize: '9px' }}>{m.range}</Badge></Flex>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '6px' }}>
              <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>Asks: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{m.asks}</span></div>
              <div><span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>Fix: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{m.fix}</span></div></Grid></Card>))}
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Ship-gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                {slider('Retrieved', ret, setRet, 20)}{slider('Relevant', rel, setRel, 20)}{slider('Needed', need, setNeed, 12)}{slider('Found', found, setFound, 12)}{slider('Claims', claims, setClaims, 20)}{slider('Supported', supp, setSupp, 20)}
              </Grid>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${bandColor}` }}>
              <strong style={{ color: bandColor, fontSize: '16px' }}>{r.band.toUpperCase()}</strong>
              <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '12px', marginTop: '8px' }}>
                <div>Precision <b style={{ color: 'white' }}>{r.precision}</b></div><div>Recall <b style={{ color: 'white' }}>{r.recall}</b></div><div>Faithfulness <b style={{ color: 'white' }}>{r.faithfulness}</b></div></Grid>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>{r.diagnosis}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'bench' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>⚖️ A/B benchmark: polluted context</h3>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Same queries, two retrieval shapes: plain concat vs labeled-truth with a conflict-resolution instruction. Seeded dataset (seed 7) — toggle pollution, query count, and model tier.</div></div>
          <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
              <div><label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)', display: 'block', marginBottom: '4px' }}>Context: {benchPolluted ? 'Polluted' : 'Clean'}</label>
                <Flex gap="var(--ds-space-2)"><Button variant={benchPolluted ? 'secondary' : 'primary'} size="sm" onClick={() => setBenchPolluted(false)}>Clean</Button><Button variant={benchPolluted ? 'primary' : 'secondary'} size="sm" onClick={() => setBenchPolluted(true)}>Polluted</Button></Flex></div>
              <div><label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)', display: 'block', marginBottom: '4px' }}>Model tier: {benchTier}</label>
                <Flex gap="var(--ds-space-2)"><Button variant={benchTier === 'small' ? 'primary' : 'secondary'} size="sm" onClick={() => setBenchTier('small')}>Small</Button><Button variant={benchTier === 'large' ? 'primary' : 'secondary'} size="sm" onClick={() => setBenchTier('large')}>Large</Button></Flex></div>
              <div>{slider('Queries', benchCount, setBenchCount, 12)}</div>
            </Grid>
          </Card>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5B4B8A' }}>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>Plain concat · {bench.plain.correct}/{bench.plain.total} · {bench.plain.accuracy}</div>
              <div style={{ height: '10px', background: '#090d16', borderRadius: '6px', marginTop: '8px', overflow: 'hidden' }}><div style={{ width: (bench.plain.accuracy * 100) + '%', height: '100%', background: '#5B4B8A' }} /></div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>Unlabeled merge — decoys compete evenly with truth.</div></Card>
            <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3A9B9F' }}>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>Labeled-truth + instruction · {bench.effectiveLabeled.correct}/{bench.effectiveLabeled.total} · {bench.effectiveLabeled.accuracy}{bench.regressionFlag ? ' (effective)' : ''}</div>
              <div style={{ height: '10px', background: '#090d16', borderRadius: '6px', marginTop: '8px', overflow: 'hidden' }}><div style={{ width: (bench.effectiveLabeled.accuracy * 100) + '%', height: '100%', background: '#3A9B9F' }} /></div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{bench.regressionFlag ? 'Raw labeled score ' + bench.labeled.accuracy + ' — discounted: small tier cannot carry the conflict instruction.' : 'Labels + conflict instruction hold at full strength on this tier.'}</div></Card>
          </Grid>
          <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid ' + (bench.regressionFlag ? '#B4553A' : '#3A9B9F') }}>
            <Flex justify="space-between" align="center"><strong style={{ color: 'var(--ds-color-text-primary)' }}>{bench.regressionFlag ? 'REGRESSION FLAG' : 'VERDICT: ' + bench.winner.toUpperCase()}</strong>{bench.regressionFlag && (<Badge variant="subtle" style={{ fontSize: '9px', background: '#B4553A', color: 'white' }}>small tier + conflict prompt</Badge>)}</Flex>
            <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{bench.verdict}</div>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{bench.capacityNote}</div>
          </Card>
          <Callout type="warning"><strong>Lesson:</strong> {AB_LESSON} Route conflict-resolution work to a larger tier instead of stuffing enforcement into a small-tier prompt.</Callout>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Query</th><th style={{ textAlign: 'left', padding: '8px' }}>True</th><th style={{ textAlign: 'left', padding: '8px' }}>Decoys</th><th style={{ textAlign: 'left', padding: '8px' }}>Plain predicts</th><th style={{ textAlign: 'left', padding: '8px' }}>Labeled predicts</th></tr></thead>
            <tbody>{benchData.slice(0, 6).map((d) => (<tr key={d.id} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
              <td style={{ padding: '8px', color: 'var(--ds-color-text-primary)' }}>{d.query}</td>
              <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{d.trueValue}</td>
              <td style={{ padding: '8px', color: '#B9821F' }}>{d.decoys.length ? d.decoys.join(', ') : '—'}</td>
              <td style={{ padding: '8px', color: predictPlainConcat(d) === d.trueValue ? '#3A9B9F' : '#B4553A' }}>{predictPlainConcat(d)}</td>
              <td style={{ padding: '8px', color: '#3A9B9F' }}>{predictLabeledTruth(d)}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Grade bands + Python scorer</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>Band</th><th style={{ textAlign: 'left', padding: '8px' }}>Rule</th><th style={{ textAlign: 'left', padding: '8px' }}>Action</th></tr></thead>
            <tbody>{GRADE_TABLE.map((g, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', textAlign: 'center', color: g.band === 'Ship' ? '#5EC4C8' : g.band === 'Gate' ? '#F5A623' : '#ef4444', fontWeight: 'bold' }}>{g.band}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{g.rule}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{g.action}</td></tr>))}</tbody></table></div>
          <CodeBlock language="python" code={PYTHON_RAGEVAL_CODE} />
          <Callout type="success"><strong>Fix order matters:</strong> faithfulness fault → generation contract first. Recall fault → retrieval rebuild. Precision fault → rerank + filter. Never tune prompts to fix retrieval blindness.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
