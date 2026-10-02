import React, { useMemo, useState } from 'react';
import { METHODOLOGY_CATALOG, getMethodologyItem, getFrameworkItem, searchCatalog } from '../services/promptTaxonomy.js';
import { C, mono, sectionStyle, labelStyle, btn, inputStyle, pageWrap, h1, sub, chipStyle } from './studioStyle.js';

const SAMPLE_TASK = 'Summarize the attached incident report for leadership.';

function openInStudio(onSelectTab, payload) {
  try { sessionStorage.setItem('askaway_studio_prefill', JSON.stringify(payload)); } catch (e) { /* private mode */ }
  if (onSelectTab) onSelectTab('prompt_studio');
}

function MethodologyDetail({ item, onOpenInStudio }) {
  const frameworks = useMemo(() => item.compatibleFrameworkIds.map((id) => getFrameworkItem(id)).filter(Boolean), [item]);
  const related = (item.related || []).join(' · ');
  return (
    <div style={{ ...sectionStyle, borderColor: C.lav }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ color: C.lav, fontSize: 16, fontWeight: 700 }}>{item.name}</div>
        <div style={{ color: C.muted, fontSize: 10, ...mono }}>{item.category} · v{item.version}</div>
        {related && <div style={{ color: C.teal, fontSize: 10, ...mono }}>related: {related}</div>}
      </div>
      <p style={{ color: C.text, fontSize: 12.5, lineHeight: 1.7, margin: '10px 0 14px' }}>{item.description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        <div>
          <div style={labelStyle(C.ok)}>WHEN TO USE</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.65 }}>{item.whenToUse}</div>
          <div style={{ ...labelStyle(C.bad), marginTop: 14 }}>LIMITATIONS / WHEN NOT</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.65 }}>{item.limitations}</div>
        </div>
        <div>
          <div style={labelStyle(C.teal)}>HOW TO APPLY</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.65, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10 }}>
            {item.applicationInstructions}
          </div>
          <div style={{ ...labelStyle(C.warn), marginTop: 14 }}>MODEL CAVEATS</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.65 }}>{item.modelCaveats}</div>
        </div>
      </div>

      <div style={{ ...labelStyle(C.coral), marginTop: 16 }}>BEFORE / AFTER (illustrative)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, fontSize: 11.5, ...mono, lineHeight: 1.6, color: C.muted }}>
          <div style={{ color: C.bad, fontSize: 10, marginBottom: 4 }}>WITHOUT</div>
          {SAMPLE_TASK}
        </div>
        <div style={{ background: C.bg, border: `1px solid ${C.teal}66`, borderRadius: 8, padding: 10, fontSize: 11.5, ...mono, lineHeight: 1.6, color: C.text }}>
          <div style={{ color: C.ok, fontSize: 10, marginBottom: 4 }}>WITH THIS METHODOLOGY</div>
          {SAMPLE_TASK}
          <div style={{ color: C.teal, marginTop: 6 }}>+ {item.applicationInstructions.slice(0, 180)}{item.applicationInstructions.length > 180 ? '…' : ''}</div>
        </div>
      </div>

      {item.requires.length > 0 && (
        <>
          <div style={{ ...labelStyle(C.warn), marginTop: 14 }}>REQUIRES AS INPUT</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.requires.map((r) => <span key={r} style={{ ...chipStyle(false, C.warn), cursor: 'default' }}>{r}</span>)}
          </div>
        </>
      )}

      <div style={{ ...labelStyle(C.teal), marginTop: 16 }}>WORKS WITH FRAMEWORKS ({frameworks.length})</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {frameworks.slice(0, 12).map((f) => <span key={f.id} style={{ ...chipStyle(false, C.teal), cursor: 'default' }}>{f.name}</span>)}
        {frameworks.length > 12 && <span style={{ color: C.muted, fontSize: 11, ...mono }}>+{frameworks.length - 12} more</span>}
      </div>

      <div style={{ marginTop: 16 }}>
        <button style={btn(C.lav)} onClick={() => onOpenInStudio({ methodologyIds: [item.id] })}>Add to Prompt Studio →</button>
      </div>
    </div>
  );
}

export default function PromptMethodologiesTab({ onSelectTab }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const categories = useMemo(() => [...new Set(METHODOLOGY_CATALOG.map((m) => m.category))].sort(), []);
  const items = useMemo(() => {
    let list = searchCatalog(METHODOLOGY_CATALOG, q);
    if (cat) list = list.filter((m) => m.category === cat);
    return list;
  }, [q, cat]);
  const selected = selectedId ? getMethodologyItem(selectedId) : null;

  return (
    <div style={pageWrap}>
      <h1 style={h1}>Prompt Methodologies</h1>
      <p style={sub}>
        How to <strong style={{ color: C.lav }}>approach</strong> a task: techniques for providing examples, decomposing
        work, grounding answers, exploring alternatives, and refining outputs. {METHODOLOGY_CATALOG.length} methodologies —
        they slot into any structure, so pick a framework first in <button style={{ ...btn(C.teal), padding: '2px 8px' }} onClick={() => onSelectTab && onSelectTab('prompt_frameworks')}>Prompt Frameworks</button>
        or combine everything in <button style={{ ...btn(C.teal), padding: '2px 8px' }} onClick={() => onSelectTab && onSelectTab('prompt_studio')}>Prompt Studio</button>.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search techniques (few-shot, grounding, critique…)…"
          style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ ...inputStyle }}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {selected && <MethodologyDetail item={selected} onOpenInStudio={(p) => openInStudio(onSelectTab, p)} />}

      {items.length === 0 && (
        <div style={{ color: C.muted, fontSize: 12, ...mono, padding: 24, textAlign: 'center', background: C.surface, borderRadius: 10, border: `1px dashed ${C.border}` }}>
          No methodologies match "{q}". Try "examples", "grounding", or "refine".
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
            style={{
              textAlign: 'left', background: selectedId === m.id ? `${C.lav}14` : C.surface,
              border: `1px solid ${selectedId === m.id ? C.lav : C.border}`, borderRadius: 10,
              padding: 14, cursor: 'pointer', color: C.text,
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.name}</div>
            <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.55, margin: '6px 0' }}>
              {m.description.slice(0, 130)}{m.description.length > 130 ? '…' : ''}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ ...chipStyle(false, C.lav), fontSize: 9.5, cursor: 'default' }}>{m.category}</span>
              {m.requires.length > 0 && <span style={{ ...chipStyle(false, C.warn), fontSize: 9.5, cursor: 'default' }}>needs: {m.requires.join(', ')}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
