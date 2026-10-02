import React, { useEffect, useMemo, useState } from 'react';
import { FRAMEWORK_CATALOG, METHODOLOGY_CATALOG, getFrameworkItem, getMethodologyItem, conflictsWith } from '../services/promptTaxonomy.js';
import { composePrompt, suggestMethodologies } from '../services/promptComposer.js';
import { evaluatePrompt } from '../services/qualityEvaluator.js';
import { saveUserPrompt } from '../services/promptLibrary.js';
import { C, mono, sectionStyle, labelStyle, btn, inputStyle, pageWrap, h1, sub, chipStyle } from './studioStyle.js';

const RESERVED = [
  { key: 'task', label: 'Task (your goal, in your words)', rows: 3, always: true },
  { key: 'constraints', label: 'Constraints (must / must not)', rows: 2 },
  { key: 'outputFormat', label: 'Output format', rows: 1 },
  { key: 'examples', label: 'Examples (one input → output per line)', rows: 2 },
  { key: 'documents', label: 'Documents / source material (for retrieval-grounded)', rows: 3, onlyIf: 'retrieval_grounded' },
  { key: 'schema', label: 'Schema (for structured-output)', rows: 2, onlyIf: 'structured_output' },
  { key: 'tools', label: 'Available tools (for tool-assisted)', rows: 2, onlyIf: 'tool_assisted' },
];

export default function PromptStudioTab({ onSelectTab }) {
  const [frameworkId, setFrameworkId] = useState(null);
  const [methodIds, setMethodIds] = useState([]);
  const [inputs, setInputs] = useState({});
  const [override, setOverride] = useState(null);
  const [savedNote, setSavedNote] = useState('');
  const [evalReport, setEvalReport] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('askaway_studio_prefill');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.frameworkId) setFrameworkId(p.frameworkId);
        if (Array.isArray(p.methodologyIds)) setMethodIds(p.methodologyIds);
        sessionStorage.removeItem('askaway_studio_prefill');
      }
    } catch (e) { /* ignore */ }
  }, []);

  const framework = frameworkId ? getFrameworkItem(frameworkId) : null;
  const composed = useMemo(
    () => composePrompt({ frameworkId, methodologyIds: methodIds, inputs }),
    [frameworkId, methodIds, inputs]
  );
  const promptText = override !== null ? override : composed.prompt;
  const suggestions = useMemo(() => suggestMethodologies(frameworkId, methodIds), [frameworkId, methodIds]);

  const setIn = (k, v) => { setInputs((prev) => ({ ...prev, [k]: v })); setOverride(null); };
  const toggleMethod = (id) => {
    setOverride(null);
    setMethodIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const visibleReserved = RESERVED.filter((r) => r.always || !r.onlyIf || methodIds.includes(r.onlyIf));
  const fieldRows = framework
    ? framework.requiredFields.filter((f) => !RESERVED.some((r) => r.key === f))
    : [];

  function copy() { navigator.clipboard?.writeText(promptText); setSavedNote('Copied to clipboard'); setTimeout(() => setSavedNote(''), 2500); }
  function download() {
    const blob = new Blob([promptText], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `prompt-${frameworkId || 'blank'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    setSavedNote('Downloaded .txt');
    setTimeout(() => setSavedNote(''), 2500);
  }
  function saveToLibrary() {
    try {
      saveUserPrompt({
        title: `Studio: ${framework ? framework.name : 'blank'} + ${methodIds.length} method(s)`,
        text: promptText,
        category: 'Writing',
        tags: ['studio', ...(framework ? [framework.id] : []), ...methodIds],
        bestFor: inputs.task ? inputs.task.slice(0, 80) : 'Composed in Prompt Studio',
      });
      setSavedNote('Saved to Prompt Library');
      setTimeout(() => setSavedNote(''), 2500);
    } catch (e) { setSavedNote(`Save failed: ${e.message}`); }
  }
  function runEvaluation() { setEvalReport(evaluatePrompt(promptText)); }

  const conflictPairsSelected = [];
  for (let i = 0; i < methodIds.length; i++) for (let j = i + 1; j < methodIds.length; j++) {
    if (conflictsWith(methodIds[i], methodIds[j])) conflictPairsSelected.push([methodIds[i], methodIds[j]]);
  }

  const evalTone = evalReport
    ? { pass: evalReport.dimensions.filter((d) => d.status === 'pass').length, total: evalReport.dimensions.length }
    : null;

  return (
    <div style={pageWrap}>
      <h1 style={h1}>Prompt Studio</h1>
      <p style={sub}>
        The universal entry point — no terminology required. Start from a <strong style={{ color: C.teal }}>blank prompt</strong>,
        or combine a structural framework with compatible methodologies, then refine, evaluate (static checks), save, and export.
      </p>

      <div style={{ ...sectionStyle, borderColor: C.teal }}>
        <div style={labelStyle(C.teal)}>STEP 1 — SELECT A FRAMEWORK (or start blank)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={frameworkId || ''}
            onChange={(e) => { setFrameworkId(e.target.value || null); setOverride(null); }}
            style={{ ...inputStyle, minWidth: 280 }}
          >
            <option value="">— Blank prompt (no framework) —</option>
            {FRAMEWORK_CATALOG.map((f) => <option key={f.id} value={f.id}>{f.name} · {f.expansion}</option>)}
          </select>
          {framework && (
            <button style={btn(C.lav)} onClick={() => onSelectTab && onSelectTab('prompt_frameworks')}>Browse frameworks →</button>
          )}
        </div>
        {framework && <div style={{ color: C.muted, fontSize: 11.5, marginTop: 8, lineHeight: 1.6 }}>{framework.description}</div>}
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.lav)}>STEP 2 — APPLY METHODOLOGIES ({methodIds.length} selected)</div>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>
          Multiple techniques combine — but more is not automatically better. Conflicting grounding strategies are flagged below.
          {framework && <> Highlighted: recommended for {framework.name}.</>}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {METHODOLOGY_CATALOG.map((m) => {
            const active = methodIds.includes(m.id);
            const recommended = framework ? framework.compatibleMethodologyIds.includes(m.id) : false;
            const conflict = conflictPairsSelected.some((p) => p.includes(m.id));
            const color = conflict ? C.bad : active ? (recommended ? C.teal : C.warn) : C.muted;
            return (
              <button key={m.id} onClick={() => toggleMethod(m.id)} style={chipStyle(active, color)}
                title={`${m.description}\n${m.requires.length ? `Requires: ${m.requires.join(', ')}` : ''}`}>
                {m.name}{conflict ? ' ⚠' : ''}
              </button>
            );
          })}
        </div>
        {suggestions.length > 0 && methodIds.length === 0 && (
          <div style={{ color: C.muted, fontSize: 11, marginTop: 10 }}>
            Suggested: {suggestions.slice(0, 4).map((m) => m.name).join(' · ')}
          </div>
        )}
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle(C.coral)}>STEP 3 — DEFINE THE INPUTS</div>
        <div style={{ display: 'grid', gap: 10 }}>
          {visibleReserved.map((r) => (
            <div key={r.key}>
              <div style={{ color: C.muted, fontSize: 10.5, marginBottom: 4, ...mono }}>{r.label}</div>
              <textarea
                value={inputs[r.key] || ''}
                onChange={(e) => setIn(r.key, e.target.value)}
                rows={r.rows}
                placeholder={r.key === 'task' ? 'e.g. Generate a Python coding assessment: 10 questions, easy/medium/hard…' : ''}
                style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, color: C.text, fontSize: 11.5, ...mono, lineHeight: 1.55, resize: 'vertical' }}
              />
            </div>
          ))}
          {fieldRows.map((f) => (
            <div key={f}>
              <div style={{ color: C.warn, fontSize: 10.5, marginBottom: 4, ...mono }}>{f} (required by {framework.name})</div>
              <input
                value={inputs[f] || ''}
                onChange={(e) => setIn(f, e.target.value)}
                style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                placeholder={`Value for [${f}]…`}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...sectionStyle, borderColor: composed.ok ? C.teal : C.coral }}>
        <div style={labelStyle(composed.ok ? C.teal : C.coral)}>STEP 4 — GENERATED PROMPT (editable)</div>

        {composed.missingRequired.length > 0 && (
          <div style={{ color: C.warn, fontSize: 11.5, ...mono, marginBottom: 6 }}>
            Missing required field(s): {composed.missingRequired.map((m) => m.field).join(', ')}
          </div>
        )}
        {composed.unresolvedFields.length > 0 && (
          <div style={{ color: C.muted, fontSize: 11.5, ...mono, marginBottom: 6 }}>
            Unresolved placeholders (edit them in the text below): {composed.unresolvedFields.join(', ')}
          </div>
        )}
        {composed.conflicts.map((c, i) => (
          <div key={i} style={{ color: c.type === 'missing-requirement' ? C.warn : C.bad, fontSize: 11.5, lineHeight: 1.6, marginBottom: 4 }}>
            ⚠ {c.text} <span style={{ color: C.muted }}>— {c.detail}</span>
          </div>
        ))}
        {composed.assumptions.map((a, i) => (
          <div key={`a${i}`} style={{ color: C.lav, fontSize: 11.5, marginBottom: 4 }}>ℹ {a}</div>
        ))}

        <textarea
          value={promptText}
          onChange={(e) => setOverride(e.target.value)}
          rows={Math.min(24, Math.max(8, promptText.split('\n').length + 2))}
          style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, color: C.text, fontSize: 12, ...mono, lineHeight: 1.65, resize: 'vertical' }}
        />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, alignItems: 'center' }}>
          <button style={btn(C.teal)} onClick={copy}>Copy</button>
          <button style={btn(C.teal)} onClick={download}>Download .txt</button>
          <button style={btn(C.lav)} onClick={saveToLibrary}>Save to library</button>
          <button style={btn(C.coral)} onClick={runEvaluation}>Evaluate (static)</button>
          {override !== null && (
            <button style={btn(C.muted)} onClick={() => setOverride(null)}>↻ Reset to generated</button>
          )}
          <span style={{ color: C.ok, fontSize: 11, ...mono }}>{savedNote}</span>
        </div>

        <div style={{ color: C.muted, fontSize: 10.5, ...mono, marginTop: 8 }}>
          Composition is deterministic text assembly — no model is called. Evaluation is static analysis (see report),
          not execution of this prompt.
        </div>

        {evalReport && (
          <div style={{ marginTop: 12, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            <div style={{ color: evalTone.pass >= 6 ? C.ok : evalTone.pass >= 4 ? C.warn : C.bad, fontSize: 12, fontWeight: 700, ...mono, marginBottom: 6 }}>
              Static evaluation: {evalTone.pass}/{evalTone.total} dimensions pass
            </div>
            {evalReport.dimensions.map((d) => (
              <div key={d.id} style={{ fontSize: 11, ...mono, padding: '1px 0', color: d.status === 'pass' ? C.ok : d.status === 'fail' ? C.bad : d.status === 'warn' ? C.warn : C.muted }}>
                [{d.status}] {d.label} — {d.findings[0]?.text}{d.findings[0]?.evidence ? ` ("${d.findings[0].evidence}")` : ''}
              </div>
            ))}
            <div style={{ color: C.muted, fontSize: 10, ...mono, marginTop: 6 }}>{evalReport.notice}</div>
          </div>
        )}
      </div>
    </div>
  );
}
