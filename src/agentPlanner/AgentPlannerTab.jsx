import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { PLANNER_PATTERNS, PLANNER_GUARDRAILS, RECOMMEND_PLANNER, PYTHON_PLANNER_CODE, DYNAMIC_SKILL_ARCHITECTURE, SKILL_RETRIEVAL_SIMULATOR, PYTHON_DYNAMIC_SKILLS_CODE } from './plannerEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (on, active) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: on === active ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: on === active ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function AgentPlannerTab() {
  const [sub, setSub] = useState('patterns');
  const [decomp, setDecomp] = useState(true);
  const [verif, setVerif] = useState(false);
  const [stakes, setStakes] = useState('low');
  const [unk, setUnk] = useState('many');
  const rec = RECOMMEND_PLANNER(decomp, verif, stakes, unk);
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };

  // Dynamic Skills state
  const [skillTaskContext, setSkillTaskContext] = useState('Build a REST API with authentication, database models, and OpenAPI docs');
  const [skillRetrievalResults, setSkillRetrievalResults] = useState(() => 
    SKILL_RETRIEVAL_SIMULATOR('Build a REST API with authentication, database models, and OpenAPI docs', [
      { id: 'connect_db', name: 'Connect to Database', preconditions: ['db_config'], postconditions: ['db_connection'] },
      { id: 'define_models', name: 'Define ORM Models', preconditions: ['db_connection'], postconditions: ['models'] },
      { id: 'create_migrations', name: 'Create Migrations', preconditions: ['models'], postconditions: ['schema'] },
      { id: 'build_routes', name: 'Build API Routes', preconditions: ['schema'], postconditions: ['routes'] },
      { id: 'add_auth', name: 'Add Authentication', preconditions: ['routes'], postconditions: ['auth_routes'] },
      { id: 'gen_openapi', name: 'Generate OpenAPI Spec', preconditions: ['routes'], postconditions: ['openapi_spec'] },
      { id: 'write_tests', name: 'Write Tests', preconditions: ['routes'], postconditions: ['test_suite'] },
      { id: 'deploy', name: 'Deploy to Cloud', preconditions: ['test_suite', 'openapi_spec'], postconditions: ['deployment'] },
    ])
  );
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Planning Patterns]"
        title="Match the Loop to the Task — Then Cap It"
        description="ReAct explores, Plan-Execute parallelises, Reflexion retries, Tree-of-Thoughts votes. The pattern is a cost decision; guardrails (caps, stall detection, external verifiers) are non-negotiable."
        metrics={[{ label: 'Patterns', value: '4' }, { label: 'Step Cap', value: '8–12' }, { label: 'Stall Rule', value: '2 → Replan' }, { label: 'Critic Rule', value: '≠ Actor' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agent_planner.svg" alt="Planner patterns" title="4 Patterns + Guardrails" caption="Cost grows ReAct → Plan-Execute → Reflexion → ToT. Caps and verifiers bound every loop." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'patterns', icon: '🔁', label: '1. Patterns + Guards', desc: 'Traces, costs, failures' },
          { id: 'sim', icon: '🔬', label: '2. Pattern Picker Sim', desc: 'Describe task → pattern' },
          { id: 'code', icon: '🛠️', label: '3. Loop Code', desc: 'Bounded ReAct + dispatch' },
          { id: 'dynamic', icon: '🧬', label: '4. Dynamic Skills', desc: 'Graph, retrieval, chaining, evolution' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'patterns' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Pattern</th><th style={{ textAlign: 'left', padding: '8px' }}>Trace</th><th style={{ padding: '8px' }}>Calls</th><th style={{ textAlign: 'left', padding: '8px' }}>Best for</th><th style={{ textAlign: 'left', padding: '8px' }}>Fails when</th></tr></thead>
            <tbody>{PLANNER_PATTERNS.map((p, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{p.name}</td><td style={{ padding: '8px', color: '#3A9B9F', fontFamily: 'monospace' }}>{p.trace}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{p.calls}</td><td style={{ padding: '8px', color: '#3A9B9F' }}>{p.best}</td><td style={{ padding: '8px', color: '#ef4444' }}>{p.fail}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{PLANNER_GUARDRAILS.map((g, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold' }}>{g.guard}</div><div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>{g.rule}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>stops: {g.stops}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Pattern picker simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={decomp} onChange={e => setDecomp(e.target.checked)} /> task decomposes cleanly</label><br />
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={verif} onChange={e => setVerif(e.target.checked)} /> outcome verifiable (tests/tools)</label>
              <label style={{ fontSize: '11px', color: 'white', display: 'block', marginTop: '8px' }}>Stakes</label>
              <select value={stakes} onChange={e => setStakes(e.target.value)} style={sel}><option value="low">low</option><option value="high">high</option><option value="critical">critical</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>Unknowns</label>
              <select value={unk} onChange={e => setUnk(e.target.value)} style={sel}><option value="many">many (explore)</option><option value="few">few (known tools)</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
              <strong style={{ color: '#3A9B9F' }}>{rec.pick}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>{rec.why}</div>
              <div style={{ fontSize: '11px', color: '#3A9B9F', fontFamily: 'monospace', marginTop: '4px' }}>{rec.trace} · {rec.calls}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>caution: {rec.caution}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Bounded loops + approval-aware dispatch</h3></div>
          <CodeBlock language="python" code={PYTHON_PLANNER_CODE} />
          <Callout type="success"><strong>Non-negotiables:</strong> step cap, stall→replan, irreversible plans need approval, critics must be external (tests, tools, second model).</Callout>
        </Stack></Card></Stack>)}

        {/* ─── SUBTAB 4: DYNAMIC SKILL COMPOSITION (TDS GUIDE) ─── */}
        {sub === 'dynamic' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧬 From Static to Dynamic Skills — Skill Graph Architecture</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Based on Towards Data Science guide: skills as composable graph nodes, context-aware retrieval, dynamic chaining into macro-skills, and autonomous evolution loops.
                  </p>
                </div>

                {/* 4-Component Architecture */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🏗️ Four-Component Dynamic Skill Architecture</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ds-space-3)' }}>
                    {DYNAMIC_SKILL_ARCHITECTURE.map((c, i) => (
                      <Card key={i} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
                        <div style={{ fontSize: '12px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '6px' }}>{c.component}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>{c.description}</div>
                        <div style={{ fontSize: '10px', color: '#3A9B9F', fontFamily: 'monospace', marginBottom: '4px' }}>{c.structure || c.technique || c.mechanism || c.loop}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', fontStyle: 'italic' }}>Benefit: {c.benefit}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Skill Retrieval Simulator */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🔍 Context-Aware Skill Retrieval Simulator</h4>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                    <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                      <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '8px' }}>
                        Task Context
                        <textarea
                          value={skillTaskContext}
                          onChange={e => { setSkillTaskContext(e.target.value); setSkillRetrievalResults(SKILL_RETRIEVAL_SIMULATOR(e.target.value, [
                            { id: 'connect_db', name: 'Connect to Database', preconditions: ['db_config'], postconditions: ['db_connection'] },
                            { id: 'define_models', name: 'Define ORM Models', preconditions: ['db_connection'], postconditions: ['models'] },
                            { id: 'create_migrations', name: 'Create Migrations', preconditions: ['models'], postconditions: ['schema'] },
                            { id: 'build_routes', name: 'Build API Routes', preconditions: ['schema'], postconditions: ['routes'] },
                            { id: 'add_auth', name: 'Add Authentication', preconditions: ['routes'], postconditions: ['auth_routes'] },
                            { id: 'gen_openapi', name: 'Generate OpenAPI Spec', preconditions: ['routes'], postconditions: ['openapi_spec'] },
                            { id: 'write_tests', name: 'Write Tests', preconditions: ['routes'], postconditions: ['test_suite'] },
                            { id: 'deploy', name: 'Deploy to Cloud', preconditions: ['test_suite', 'openapi_spec'], postconditions: ['deployment'] },
                          ]))}}
                          style={{ width: '100%', minHeight: '80px', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px', fontFamily: 'monospace', marginTop: '4px' }}
                        />
                      </label>
                    </Card>
                    <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <div style={{ fontSize: '12px', color: '#3A9B9F', fontWeight: 'bold', marginBottom: '8px' }}>Top-K Retrieved Skills</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {(skillRetrievalResults || []).map((s, i) => (
                          <div key={s.id || i} style={{ padding: '8px', background: s.precondMet ? 'rgba(38,191,176,0.1)' : 'rgba(245,166,35,0.1)', borderRadius: '4px', border: `1px solid ${s.precondMet ? '#5EC4C833' : '#F5A62333'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ color: 'white', fontWeight: 'bold' }}>{s.name}</span>
                              <span style={{ color: s.precondMet ? '#5EC4C8' : '#F5A623', fontFamily: 'monospace' }}>relevance: {typeof s.relevance === 'number' ? s.relevance.toFixed(2) : s.relevance}</span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '2px' }}>
                              Pre: [{(s.preconditions || []).join(', ')}] → Post: [{(s.postconditions || []).join(', ')}]
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Grid>
                </div>

                {/* Python Code */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🛠️ Dynamic Skills: Graph + Retrieval + Chaining + Evolution</h4>
                  <CodeBlock language="python" code={PYTHON_DYNAMIC_SKILLS_CODE} />
                  <Callout type="success">
                    <strong>Key insight from TDS:</strong> Static skill libraries don't scale. The graph enables topological planning, retrieval makes 1000s of skills tractable, 
                    chaining builds reusable macro-skills, and the evolution loop turns production traffic into automatic capability improvement.
                  </Callout>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
