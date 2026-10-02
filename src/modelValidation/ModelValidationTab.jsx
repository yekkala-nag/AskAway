import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { THREE_PILLARS, FIVE_BREAKS, TIER_TABLE, COMPONENT_MAP, DIMENSION_SETS, ROBUSTNESS_TESTS, JUDGE_TESTS, MONITOR_INDICATORS, CALC_TIER, PYTHON_VALIDATION_CODE } from './validationEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function ModelValidationTab() {
  const [sub, setSub] = useState('pillars');
  const [exposure, setExposure] = useState('customer');
  const [acts, setActs] = useState(true);
  const [material, setMaterial] = useState(true);
  const t = CALC_TIER(exposure, acts, material);
  const tc = t.tier === 'High' ? '#ef4444' : t.tier === 'Medium' ? '#F5A623' : '#5EC4C8';
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="frontiers_production" moduleLabel="Production & Frontiers [GenAI Model Validation]"
        title="Validate Systems You Can't Inspect — The Banking Playbook"
        description="No dev sample, vendor core, silent drift: SR 11-7's three pillars survive, but evidence changes completely. Tier by travel × acts × materiality, then dimension-battery, robustness, and judge-the-judge."
        metrics={[{ label: 'Pillars', value: '3 (SR 11-7)' }, { label: 'Breaks', value: '5 structural' }, { label: 'Tiers', value: 'Low/Med/High' }, { label: 'Rule', value: 'System, not model' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="frontiers_production" src="/assets/model_validation.svg" alt="Model validation playbook" title="Pillars + Breaks + Tiering" caption="Same questions as 2011, all-new evidence: dimensions, perturbations, validated judges." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'pillars', icon: '🏛️', label: '1. Pillars + Breaks', desc: 'Why templates fail' },
          { id: 'sim', icon: '🔬', label: '2. Tier Calculator', desc: 'Evidence bar per risk' },
          { id: 'code', icon: '🛠️', label: '3. Battery Code', desc: 'Tiers + judges + suites' }].map(t2 => (
          <button key={t2.id} onClick={() => setSub(t2.id)} style={navBtn(sub, t2.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t2.icon}</span><span>{t2.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t2.desc}</div></button>))}
        </div>
        {sub === 'pillars' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{THREE_PILLARS.map((p, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 1 ? '#5EC4C8' : '#5EC4C8'}` }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{i + 1}. {p.pillar}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>{p.asks}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{p.genai}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Structural break</th><th style={{ textAlign: 'left', padding: '8px' }}>Why classical fails</th><th style={{ textAlign: 'left', padding: '8px' }}>Consequence</th></tr></thead>
            <tbody>{FIVE_BREAKS.map((b, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: '#ef4444', fontWeight: 'bold' }}>{b.property}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{b.why}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{b.consequence}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{DIMENSION_SETS.map((d, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F0A89A' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{d.set}</div><div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace' }}>{d.dims}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>⚠ {d.trap}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Risk-tier calculator — tiering sets the evidence bar</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>How far does output travel?</label>
              <select value={exposure} onChange={e => setExposure(e.target.value)} style={sel}><option value="internal">Internal decision aid</option><option value="material-internal">Material internal decision</option><option value="customer">Customer / regulator-facing</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={acts} onChange={e => setActs(e.target.checked)} /> acts on systems (tools, writes, triggers)</label><br />
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={material} onChange={e => setMaterial(e.target.checked)} /> material error impact</label>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${tc}` }}>
              <strong style={{ color: tc, fontSize: '16px' }}>{t.tier.toUpperCase()} RISK (score {t.score}/7)</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>Evidence: {t.evidence}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>Monitor: {t.monitor}</div>
              <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '4px' }}>First move: {t.first}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>{t.warning}</div>
            </Card>
          </Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>Tier</th><th style={{ textAlign: 'left', padding: '8px' }}>Evidence</th><th style={{ padding: '8px' }}>Monitor</th></tr></thead>
            <tbody>{TIER_TABLE.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', textAlign: 'center', color: r.tier === 'High' ? '#ef4444' : r.tier === 'Medium' ? '#F5A623' : '#5EC4C8', fontWeight: 'bold' }}>{r.tier}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.evidence}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.monitor}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Tiering + judge validation + robustness code</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2">
            {[...COMPONENT_MAP.slice(0, 4).map(c => ({ t: c.comp, d: `${c.controls} controls — ${c.breaks}`, col: c.controls === 'Vendor' ? '#ef4444' : '#5EC4C8' })), ...ROBUSTNESS_TESTS.map(r => ({ t: `Perturb: ${r.perturb}`, d: `${r.how} — ${r.star}`, col: '#F5A623' })), ...JUDGE_TESTS.map(j => ({ t: `Judge: ${j.test}`, d: j.why, col: '#F0A89A' })), ...MONITOR_INDICATORS.map(m => ({ t: m.ind, d: `catches: ${m.catches}`, col: '#5EC4C8' }))].map((x, i) => (
              <Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${x.col}` }}><div style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>{x.t}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{x.d}</div></Card>
            ))}
          </Grid>
          <CodeBlock language="python" code={PYTHON_VALIDATION_CODE} />
          <Callout type="success"><strong>Second-line craft, restated:</strong> challenge boundaries you control, battery dimensions separately, perturb meaning-preserving inputs, validate the scorer, monitor the override rate — falling overrides are a warning, not a win.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
