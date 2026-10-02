import React, { useMemo, useState } from 'react';
import { FRAMEWORK_CATALOG, getFrameworkItem, getMethodologyItem, searchCatalog } from '../services/promptTaxonomy.js';
import { C, mono, sectionStyle, labelStyle, btn, inputStyle, pageWrap, h1, sub, chipStyle } from './studioStyle.js';

function openInStudio(onSelectTab, payload) {
  try { sessionStorage.setItem('askaway_studio_prefill', JSON.stringify(payload)); } catch (e) { /* private mode */ }
  if (onSelectTab) onSelectTab('prompt_studio');
}

function FrameworkDetail({ item, onOpenInStudio }) {
  const [template, setTemplate] = useState(item.template);
  const [dirty, setDirty] = useState(false);
  const methods = useMemo(() => item.compatibleMethodologyIds.map((id) => getMethodologyItem(id)).filter(Boolean), [item]);
  const unfilled = useMemo(() => (template.match(/\[[^\]]+\]/g) || []).length, [template]);

  return (
    <div style={{ ...sectionStyle, borderColor: C.teal }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ color: C.teal, fontSize: 16, fontWeight: 700 }}>{item.name}</div>
        <div style={{ color: C.lav, fontSize: 11, ...mono }}>{item.expansion}</div>
        <div style={{ color: C.muted, fontSize: 10, ...mono }}>{item.tier} · {item.category} · v{item.version}</div>
      </div>
      <p style={{ color: C.text, fontSize: 12.5, lineHeight: 1.7, margin: '10px 0 14px' }}>{item.description}</p>

      <div style={labelStyle(C.lav)}>EDITABLE TEMPLATE {dirty && <span style={{ color: C.warn }}>(edited)</span>}</div>
      <textarea
        value={template}
        onChange={(e) => { setTemplate(e.target.value); setDirty(true); }}
        style={{ width: '100%', boxSizing: 'border-box', height: 84, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, fontSize: 12, ...mono, lineHeight: 1.6, resize: 'vertical' }}
      />
      <div style={{ color: C.muted, fontSize: 10.5, ...mono, margin: '6px 0 14px' }}>
        {unfilled} placeholder{unfilled === 1 ? '' : 's'} — values are filled in Prompt Studio.
        {dirty && <> <button style={{ ...btn(C.muted), padding: '2px 8px' }} onClick={() => { setTemplate(item.template); setDirty(false); }}>reset</button></>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
        <div>
          <div style={labelStyle(C.coral)}>REQUIRED FIELDS</div>
          {item.requiredFields.length === 0 && <div style={{ color: C.muted, fontSize: 11 }}>None — works as-is.</div>}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {item.requiredFields.map((f) => <span key={f} style={{ ...chipStyle(false, C.coral), cursor: 'default' }}>{f}</span>)}
          </div>
          {item.optionalFields.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {item.optionalFields.map((f) => <span key={f} style={{ ...chipStyle(false, C.muted), cursor: 'default' }}>optional: {f}</span>)}
            </div>
          )}
        </div>
        <div>
          <div style={labelStyle(C.teal)}>EXAMPLE</div>
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, fontSize: 11, ...mono, lineHeight: 1.6 }}>
            <div style={{ color: C.muted }}>Input: <span style={{ color: C.text }}>{item.example.input}</span></div>
            <div style={{ color: C.muted, marginTop: 6 }}>Output: <span style={{ color: C.text }}>{item.example.output}</span></div>
          </div>
        </div>
      </div>

      <div style={{ ...labelStyle(C.teal), marginTop: 16 }}>COMPATIBLE METHODOLOGIES ({methods.length})</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {methods.map((m) => <span key={m.id} style={{ ...chipStyle(false, C.teal), cursor: 'default' }}>{m.name}</span>)}
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button style={btn(C.teal)} onClick={() => onOpenInStudio({ frameworkId: item.id })}>Open in Prompt Studio →</button>
        <button style={btn(C.lav)} onClick={() => onOpenInStudio({ frameworkId: item.id, methodologyIds: item.compatibleMethodologyIds.slice(0, 3) })}>
          Open with top 3 methodologies
        </button>
      </div>
    </div>
  );
}

export default function PromptFrameworksTab({ onSelectTab }) {
  const [q, setQ] = useState('');
  const [tier, setTier] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const items = useMemo(() => {
    let list = searchCatalog(FRAMEWORK_CATALOG, q);
    if (tier) list = list.filter((f) => f.tier === tier);
    return list;
  }, [q, tier]);
  const selected = selectedId ? getFrameworkItem(selectedId) : null;

  return (
    <div style={pageWrap}>
      <h1 style={h1}>Prompt Frameworks</h1>
      <p style={sub}>
        How to <strong style={{ color: C.teal }}>structure</strong> a prompt: reusable blueprints with defined sections,
        sequence, and output expectations. {FRAMEWORK_CATALOG.length} frameworks — start here if you know what shape
        your answer should take. Techniques live in <button style={{ ...btn(C.lav), padding: '2px 8px' }} onClick={() => onSelectTab && onSelectTab('prompt_methodologies')}>Prompt Methodologies</button>,
        and you can combine both in <button style={{ ...btn(C.teal), padding: '2px 8px' }} onClick={() => onSelectTab && onSelectTab('prompt_studio')}>Prompt Studio</button>.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search frameworks (name, use case, sections)…"
          style={{ ...inputStyle, flex: 1, minWidth: 240 }} />
        <select value={tier} onChange={(e) => setTier(e.target.value)} style={{ ...inputStyle }}>
          <option value="">All tiers</option>
          <option value="Foundation">Foundation</option>
          <option value="Structured">Structured</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {selected && <FrameworkDetail item={selected} onOpenInStudio={(p) => openInStudio(onSelectTab, p)} />}

      {items.length === 0 && (
        <div style={{ color: C.muted, fontSize: 12, ...mono, padding: 24, textAlign: 'center', background: C.surface, borderRadius: 10, border: `1px dashed ${C.border}` }}>
          No frameworks match "{q}". Try "decision", "writing", or clear the search.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {items.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedId(selectedId === f.id ? null : f.id)}
            style={{
              textAlign: 'left', background: selectedId === f.id ? `${C.teal}14` : C.surface,
              border: `1px solid ${selectedId === f.id ? C.teal : C.border}`, borderRadius: 10,
              padding: 14, cursor: 'pointer', color: C.text,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{f.name}</span>
              <span style={{ color: C.lav, fontSize: 10, ...mono }}>{f.tier || '—'}</span>
            </div>
            <div style={{ color: C.muted, fontSize: 10.5, ...mono, margin: '4px 0 6px' }}>{f.expansion}</div>
            <div style={{ color: C.muted, fontSize: 11.5, lineHeight: 1.55 }}>{f.description.slice(0, 130)}{f.description.length > 130 ? '…' : ''}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
              <span style={{ ...chipStyle(false, C.coral), fontSize: 9.5, cursor: 'default' }}>{f.category}</span>
              <span style={{ ...chipStyle(false, C.teal), fontSize: 9.5, cursor: 'default' }}>{f.compatibleMethodologyIds.length} methods</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
