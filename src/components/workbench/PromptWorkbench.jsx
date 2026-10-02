import React, { useState, useMemo, useCallback } from 'react';
import { createPrompt } from '../../services/promptRepresentation.js';
import { findGaps, applyAnswers, QUESTION_BANK } from '../../services/clarificationEngine.js';
import { buildContract, validateAgainstContract, CONTRACT_TEMPLATES, CONTRACT_NOTICE } from '../../services/outputContract.js';
import { createVersion, diffTexts, alignLines, pushVersion, decide, undo, summarize, loadHistory, saveHistory, clearHistory } from '../../services/refinementLab.js';
import { LIBRARY_CATEGORIES, listPrompts, saveUserPrompt, deleteUserPrompt, searchPrompts, listTags } from '../../services/promptLibrary.js';
import { STEP_TYPES, createWorkflow, validateWorkflow, topoOrder, runWorkflow, DEFAULT_WORKFLOW } from '../../services/workflowComposer.js';

const C = {
  surface: '#161B26',
  s2: '#1C2433',
  border: '#2A3548',
  text: '#E2E8F0',
  muted: '#B8B8C4',
  teal: '#5EC4C8',
  coral: '#E8837A',
  lav: '#C9B8E8',
  ok: '#6BD4A0',
  bad: '#E8837A',
};
const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" };

const sectionStyle = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 18 };
const labelStyle = (color) => ({ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12, ...mono });
const btn = (color = C.teal) => ({ background: 'transparent', border: `1px solid ${color}`, color, borderRadius: 6, padding: '6px 12px', fontSize: 11, cursor: 'pointer', ...mono });

/* ─── Clarification panel ─────────────────────────────── */
function ClarificationPanel() {
  const [task, setTask] = useState('');
  const [context, setContext] = useState('');
  const [answers, setAnswers] = useState({});
  const rep = useMemo(() => applyAnswers(createPrompt({ task, context }), answers), [task, context, answers]);
  const gaps = useMemo(() => findGaps(rep), [rep]);
  const answeredCount = gaps.ok ? QUESTION_BANK.length - gaps.unresolved : 0;

  const setA = useCallback((k, v) => setAnswers((prev) => ({ ...prev, [k]: v })), []);

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>CLARIFICATION ENGINE — CLOSE THE GAPS BEFORE YOU RUN</div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
        Static gap detection over your prompt: {answeredCount}/{QUESTION_BANK.length} questions answered.
        Nothing is sent anywhere — this runs entirely in your browser.
      </div>
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Your task in one sentence… (e.g. Write a launch email for our v2 release)"
        style={{ width: '100%', height: 60, boxSizing: 'border-box', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, resize: 'vertical', marginBottom: 8 }}
      />
      <textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Context: audience, background, stakes…"
        style={{ width: '100%', height: 50, boxSizing: 'border-box', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, resize: 'vertical', marginBottom: 12 }}
      />
      {!gaps.ok && (
        <div style={{ color: C.bad, fontSize: 11, ...mono }}>Invalid representation: {gaps.errors.join(', ')}</div>
      )}
      {gaps.ok && gaps.questions.length === 0 && (
        <div style={{ color: C.ok, fontSize: 12, ...mono }}>✓ All clarification questions answered — the prompt is unambiguous on every checked axis.</div>
      )}
      {gaps.ok && gaps.questions.map((q) => (
        <div key={q.id} style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <div style={{ color: C.text, fontSize: 12, marginBottom: 4 }}>{q.question}</div>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>Why it matters: {q.why}</div>
          <input
            value={answers[q.field] || ''}
            onChange={(e) => setA(q.field, e.target.value)}
            placeholder={q.field === 'constraints' ? 'One per line — must / avoid…' : q.field === 'outputSchema' ? 'bullets | table | json…' : 'Your answer…'}
            style={{ width: '100%', boxSizing: 'border-box', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 10px', color: C.text, fontSize: 11, ...mono }}
          />
        </div>
      ))}
      <div style={{ height: 6, background: C.s2, borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${gaps.progress || 0}%`, background: C.teal, transition: 'width 200ms' }} />
      </div>
    </div>
  );
}

/* ─── Output contract panel ───────────────────────────── */
function ContractPanel() {
  const [tpl, setTpl] = useState('json_object');
  const [keys, setKeys] = useState('title,steps');
  const [sample, setSample] = useState('');
  const contract = useMemo(() => {
    const base = { ...(CONTRACT_TEMPLATES[tpl] || CONTRACT_TEMPLATES.bullets) };
    if (base.format === 'json') base.requiredKeys = keys.split(',').map((s) => s.trim()).filter(Boolean);
    return buildContract(base);
  }, [tpl, keys]);
  const [result, setResult] = useState(null);

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>OUTPUT CONTRACT — SHAPE CHECK, NOT FACT-CHECK</div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>{CONTRACT_NOTICE}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <select value={tpl} onChange={(e) => setTpl(e.target.value)} style={{ background: C.s2, border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }}>
          {Object.keys(CONTRACT_TEMPLATES).map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
        {contract.format === 'json' && (
          <input value={keys} onChange={(e) => setKeys(e.target.value)} placeholder="required keys (comma-sep)"
            style={{ flex: 1, minWidth: 180, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }} />
        )}
        <button style={btn(C.teal)} onClick={() => setResult(validateAgainstContract(sample, contract))}>Validate sample output</button>
      </div>
      <textarea
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        placeholder={contract.format === 'json' ? '{"title": "…", "steps": ["…"]}' : 'Paste a sample response to check against the contract…'}
        style={{ width: '100%', height: 70, boxSizing: 'border-box', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, resize: 'vertical' }}
      />
      {result && (
        <div style={{ marginTop: 10 }}>
          <div style={{ color: result.pass ? C.ok : C.bad, fontSize: 12, fontWeight: 700, ...mono, marginBottom: 6 }}>
            {result.pass ? `✓ PASS — ${result.checkedCount} check(s)` : `✗ FAIL — ${result.failed}/${result.checkedCount} check(s) failed`}
          </div>
          {result.checks.map((ch) => (
            <div key={ch.id} style={{ color: ch.pass ? C.ok : C.bad, fontSize: 11, ...mono, padding: '2px 0' }}>
              {ch.pass ? '✓' : '✗'} {ch.label}{ch.detail ? ` — ${ch.detail}` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Refinement lab panel ────────────────────────────── */
function RefinementLab() {
  const [text, setText] = useState('Write a launch email for v2. Audience: existing users. Output: bullets, max 5. Avoid hype words.');
  const [baseline, setBaseline] = useState('');
  const [note, setNote] = useState('');
  const [history, setHistory] = useState(() => loadHistory());
  const [selectedId, setSelectedId] = useState(null);
  const stats = useMemo(() => summarize(history), [history]);
  const selected = history.find((v) => v.id === selectedId) || null;
  const diff = useMemo(() => (selected ? diffTexts(baseline || text, selected.text) : null), [selected, baseline, text]);
  const rows = useMemo(() => (selected ? alignLines(baseline || text, selected.text) : null), [selected, baseline, text]);

  function persist(next) { setHistory(next); saveHistory(next); }
  function save() {
    const v = createVersion(text, note, 'manual');
    persist(pushVersion(history, v));
    if (!baseline) setBaseline(text);
    setNote('');
    setSelectedId(v.id);
  }
  function act(id, decision) { persist(decide(history, id, decision)); }
  function revert(id) { persist(undo(history, id)); if (selectedId === id) setSelectedId(null); }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.coral)}>REFINEMENT LAB — VERSION, DIFF, ACCEPT / REJECT</div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
        Local history (max 50, stored in this browser). Accepting a version marks it good for you — no model execution is implied.
        {stats.total > 0 && <> · {stats.total} saved · {stats.accepted} accepted · {stats.rejected} rejected · {stats.pending} pending</>}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: 80, boxSizing: 'border-box', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, resize: 'vertical', lineHeight: 1.6 }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="version note (optional)"
          style={{ flex: 1, minWidth: 160, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }} />
        <button style={btn(C.teal)} onClick={save}>Save version</button>
        <button style={btn(C.muted)} onClick={() => { clearHistory(); setHistory([]); setSelectedId(null); }}>Clear history</button>
      </div>
      {history.length > 0 && (
        <div style={{ marginTop: 12, display: 'grid', gap: 6 }}>
          {[...history].reverse().map((v) => (
            <div key={v.id} onClick={() => setSelectedId(v.id)}
              style={{ display: 'flex', gap: 8, alignItems: 'center', background: selectedId === v.id ? C.teal + '14' : C.s2, border: `1px solid ${selectedId === v.id ? C.teal : C.border}`, borderRadius: 6, padding: '7px 10px', cursor: 'pointer' }}>
              <span style={{ color: C.teal, fontSize: 11, ...mono, minWidth: 62 }}>{v.id.slice(2, 15)}</span>
              <span style={{ color: C.muted, fontSize: 11, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.note || '(no note)'}</span>
              <span style={{ color: v.state === 'accepted' ? C.ok : v.state === 'rejected' ? C.bad : C.lav, fontSize: 10, ...mono, textTransform: 'uppercase' }}>{v.state}</span>
              <button style={{ ...btn(C.ok), padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); act(v.id, 'accepted'); }}>✓</button>
              <button style={{ ...btn(C.bad), padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); act(v.id, 'rejected'); }}>✗</button>
              <button style={{ ...btn(C.muted), padding: '3px 8px' }} onClick={(e) => { e.stopPropagation(); revert(v.id); }}>undo</button>
            </div>
          ))}
        </div>
      )}
      {selected && diff && (
        <div style={{ marginTop: 12 }}>
          <div style={{ color: C.muted, fontSize: 11, ...mono, marginBottom: 6 }}>
            {diff.changed
              ? `Diff vs baseline: +${diff.counts.added} / −${diff.counts.removed} line(s)`
              : 'No textual difference vs baseline'}
          </div>
          <div style={{ background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, maxHeight: 220, overflow: 'auto' }}>
            {rows.map((r, i) => (
              <div key={i} style={{
                fontSize: 11, ...mono, lineHeight: 1.7,
                color: r.status === 'added' ? C.ok : r.status === 'removed' ? C.bad : r.status === 'changed' ? C.lav : C.muted,
                background: r.status === 'added' ? C.ok + '12' : r.status === 'removed' ? C.bad + '12' : 'transparent',
              }}>
                {r.status === 'added' ? '+ ' : r.status === 'removed' ? '− ' : '  '}
                {r.status === 'removed' ? r.old : r.new}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Prompt library panel ────────────────────────────── */
function LibraryPanel() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [items, setItems] = useState(() => listPrompts());
  const [openId, setOpenId] = useState(null);
  const [draft, setDraft] = useState({ title: '', text: '', category: 'Writing', tags: '' });
  const [showForm, setShowForm] = useState(false);

  const results = useMemo(
    () => searchPrompts(items, q, { category: cat }),
    [items, q, cat]
  );
  const tags = useMemo(() => listTags(items), [items]);

  function refresh() { setItems(listPrompts()); }
  function persist() {
    saveUserPrompt({
      title: draft.title,
      text: draft.text,
      category: draft.category,
      tags: draft.tags.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setDraft({ title: '', text: '', category: 'Writing', tags: '' });
    setShowForm(false);
    refresh();
  }
  function remove(id) {
    deleteUserPrompt(id);
    if (openId === id) setOpenId(null);
    refresh();
  }

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.teal)}>PROMPT LIBRARY — {items.length} PROMPTS, SEARCH / SAVE YOUR OWN</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, text, tags, framework…"
          style={{ flex: 1, minWidth: 200, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}
          style={{ background: C.s2, border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }}>
          <option value="">All categories</option>
          {LIBRARY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button style={btn(showForm ? C.coral : C.teal)} onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ New prompt'}
        </button>
      </div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {tags.slice(0, 14).map((t) => (
            <button key={t} onClick={() => setQ(q === t ? '' : t)}
              style={{ background: q === t ? C.teal + '22' : C.s2, border: `1px solid ${q === t ? C.teal : C.border}`, color: q === t ? C.teal : C.muted, borderRadius: 10, padding: '2px 8px', fontSize: 10, cursor: 'pointer', ...mono }}>
              {t}
            </button>
          ))}
        </div>
      )}
      {showForm && (
        <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Title"
            style={{ width: '100%', boxSizing: 'border-box', marginBottom: 6, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }} />
          <textarea value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} placeholder="Prompt text…"
            style={{ width: '100%', boxSizing: 'border-box', height: 60, marginBottom: 6, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono, resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
              style={{ background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '6px 8px', borderRadius: 6, fontSize: 11, ...mono }}>
              {LIBRARY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="tags, comma-sep"
              style={{ flex: 1, minWidth: 140, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '6px 8px', borderRadius: 6, fontSize: 11, ...mono }} />
            <button style={btn(C.teal)} onClick={persist}>Save</button>
          </div>
        </div>
      )}
      {results.length === 0 && (
        <div style={{ color: C.muted, fontSize: 11, ...mono }}>No prompts match "{q}".</div>
      )}
      <div style={{ display: 'grid', gap: 6 }}>
        {results.map((p) => (
          <div key={p.id} style={{ background: C.s2, border: `1px solid ${openId === p.id ? C.teal : C.border}`, borderRadius: 8, padding: 10 }}>
            <div onClick={() => setOpenId(openId === p.id ? null : p.id)} style={{ display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>{p.title}</span>
              <span style={{ color: C.lav, fontSize: 10, ...mono }}>{p.framework || '—'}</span>
              <span style={{ color: C.muted, fontSize: 10, ...mono }}>{p.category}</span>
              {p.userOwned && <span style={{ color: C.teal, fontSize: 10, ...mono }}>mine</span>}
              <span style={{ color: C.muted, fontSize: 10, marginLeft: 'auto' }}>{openId === p.id ? '▾' : '▸'}</span>
            </div>
            {openId === p.id && (
              <div style={{ marginTop: 8 }}>
                <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>{p.bestFor}</div>
                <pre style={{ whiteSpace: 'pre-wrap', background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, color: C.text, fontSize: 11, ...mono, lineHeight: 1.6, margin: 0 }}>{p.text}</pre>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  <button style={btn(C.teal)} onClick={() => navigator.clipboard?.writeText(p.text)}>Copy</button>
                  {p.userOwned && <button style={btn(C.bad)} onClick={() => remove(p.id)}>Delete</button>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Workflow composer panel ─────────────────────────── */
function WorkflowPanel() {
  const [wf, setWf] = useState(() => createWorkflow(DEFAULT_WORKFLOW.steps));
  const [seedText, setSeedText] = useState('Write a launch email for existing users. Audience: developers. Output: bullets, max 5.');
  const [pasted, setPasted] = useState('');
  const [report, setReport] = useState(null);
  const validation = useMemo(() => validateWorkflow(wf), [wf]);
  const order = useMemo(() => { try { return topoOrder(wf).map((s) => s.id).join(' → '); } catch (e) { return `INVALID: ${e.message}`; } }, [wf]);

  function run() {
    if (!validation.ok) return;
    setReport(runWorkflow(wf, { text: seedText, modelOutput: pasted }));
  }
  function removeStep(id) { setWf({ ...wf, steps: wf.steps.filter((s) => s.id !== id).map((s) => ({ ...s, dependsOn: s.dependsOn.filter((d) => d !== id) })) }); }
  function addStep(type) {
    const meta = STEP_TYPES[type];
    const id = `${type}_${wf.steps.length + 1}`;
    const deps = wf.steps.length ? [wf.steps[wf.steps.length - 1].id] : [];
    setWf({ ...wf, steps: [...wf.steps, { id, type, config: {}, dependsOn: meta.kind === 'local' && type === 'input' ? [] : deps }] });
  }

  const statusColor = (s) => s === 'done' ? C.ok : s === 'fail' || s === 'error' ? C.bad : s === 'requires-model' ? C.coral : C.lav;

  return (
    <div style={sectionStyle}>
      <div style={labelStyle(C.lav)}>WORKFLOW COMPOSER — HONEST PIPELINES ONLY</div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
        Local steps execute real analysis in your browser. The generate step needs a model API — it is reported
        as <em>requires-model</em> and its downstream steps are skipped, never faked.
      </div>
      <textarea value={seedText} onChange={(e) => setSeedText(e.target.value)} placeholder="Seed prompt text…"
        style={{ width: '100%', boxSizing: 'border-box', height: 56, marginBottom: 8, background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, resize: 'vertical' }} />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {Object.values(STEP_TYPES).map((m) => (
          <button key={m.type} style={{ ...btn(m.kind === 'requires-model' ? C.coral : C.muted), padding: '4px 9px', fontSize: 10 }}
            title={`${m.label} — ${m.description}`} onClick={() => addStep(m.type)}>
            + {m.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 6, marginBottom: 10 }}>
        {wf.steps.map((s) => {
          const meta = STEP_TYPES[s.type];
          return (
            <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', background: C.s2, border: `1px solid ${validation.ok ? C.border : C.bad}`, borderRadius: 6, padding: '7px 10px' }}>
              <span style={{ color: C.teal, fontSize: 11, ...mono, minWidth: 90 }}>{s.id}</span>
              <span style={{ color: C.text, fontSize: 11 }}>{meta.label}</span>
              <span style={{ color: meta.kind === 'requires-model' ? C.coral : C.muted, fontSize: 10, ...mono }}>{meta.kind}</span>
              {s.dependsOn.length > 0 && <span style={{ color: C.muted, fontSize: 10, ...mono }}>after: {s.dependsOn.join(', ')}</span>}
              <button style={{ ...btn(C.bad), padding: '2px 7px', marginLeft: 'auto' }} onClick={() => removeStep(s.id)}>×</button>
            </div>
          );
        })}
      </div>
      {!validation.ok && (
        <div style={{ color: C.bad, fontSize: 11, ...mono, marginBottom: 8 }}>Invalid graph: {validation.errors.join('; ')}</div>
      )}
      <div style={{ color: C.muted, fontSize: 10, ...mono, marginBottom: 10 }}>Execution order: {order}</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
        <input value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="Paste model output to validate against contract (optional)"
          style={{ flex: 1, minWidth: 220, background: '#0F1219', border: `1px solid ${C.border}`, color: C.text, padding: '7px 10px', borderRadius: 6, fontSize: 11, ...mono }} />
        <button style={{ ...btn(C.teal), opacity: validation.ok ? 1 : 0.4 }} disabled={!validation.ok} onClick={run}>Run workflow</button>
      </div>
      {report && (
        <div style={{ background: '#0F1219', border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
          <div style={{ color: C.muted, fontSize: 11, ...mono, marginBottom: 6 }}>
            Ran {report.ranLocally} local step(s) · {report.requiresModel} requires model
          </div>
          {report.results.map((r) => (
            <div key={r.id} style={{ fontSize: 11, ...mono, padding: '2px 0', color: statusColor(r.status) }}>
              [{r.status}] {r.id} — {r.summary}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PromptWorkbench() {
  return (
    <>
      <ClarificationPanel />
      <ContractPanel />
      <RefinementLab />
      <LibraryPanel />
      <WorkflowPanel />
    </>
  );
}
