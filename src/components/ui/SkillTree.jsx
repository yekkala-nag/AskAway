/**
 * SkillTree — the curriculum's dependency graph as a playable map.
 * Pillar filter → L1/L2/L3 columns → nodes colored by mastery.
 * Ready nodes (prereqs met, unproven) glow: that's "what unlocks next".
 */
import React, { useState } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getTabById } from '../../registry/tabsRegistry.js';
import { getTopicMeta, getPrereqIds, sortTopicsLikeJourney } from '../../registry/curriculum.js';
import { getMasteryScore, isMastered, isProven, isClaimed } from '../../services/mastery.js';
import { frameStyles } from './SpectrumFrame.jsx';
import { spectrumAccentForModule } from '../../design-system/diagramTokens.js';

const COL_X = { 1: 150, 2: 430, 3: 710 };
const NODE_W = 250;
const ROW_H = 38;
const TOP = 44;

function nodeColor(id) {
  if (isProven(id)) return { fill: 'rgba(42,181,176,0.14)', stroke: '#5EC4C8', text: '#22303C' };
  if (isClaimed(id)) return { fill: 'rgba(255,138,107,0.12)', stroke: '#F0A89A', text: '#22303C' };
  const s = getMasteryScore(id);
  if (s > 0) return { fill: 'rgba(197,173,234,0.2)', stroke: '#9B89C4', text: '#22303C' };
  return { fill: '#fff', stroke: '#C9B8E8', text: '#7A8AA0' };
}

function isReady(id) {
  if (isMastered(id)) return false;
  return getPrereqIds(id).every(p => isMastered(p));
}

export function SkillTree({ onSelectTab }) {
  const [umbrella, setUmbrella] = useState('rag_architecture');
  const mod = UMBRELLA_TOPICS.find(u => u.id === umbrella);
  const frame = frameStyles(spectrumAccentForModule(umbrella));
  const tabs = sortTopicsLikeJourney(getTabsForUmbrella(umbrella));
  const byLevel = { 1: [], 2: [], 3: [] };
  tabs.forEach(t => {
    const l = getTopicMeta(t.id).l;
    if (byLevel[l]) byLevel[l].push(t.id);
  });
  const posOf = {};
  Object.entries(byLevel).forEach(([l, ids]) => {
    ids.forEach((id, i) => { posOf[id] = { x: COL_X[l], y: TOP + i * ROW_H }; });
  });
  const maxRows = Math.max(byLevel[1].length, byLevel[2].length, byLevel[3].length, 1);
  const H = TOP + maxRows * ROW_H + 30;
  const short = (s) => (s.length > 27 ? s.slice(0, 26) + '…' : s);

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {UMBRELLA_TOPICS.map(u => (
          <button
            key={u.id}
            onClick={() => setUmbrella(u.id)}
            style={{
              padding: '6px 12px', borderRadius: '16px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              background: umbrella === u.id ? u.color + '26' : 'transparent',
              border: `1px solid ${umbrella === u.id ? (u.dark || u.color) : 'var(--ds-color-border-subtle)'}`,
              color: umbrella === u.id ? (u.dark || u.color) : 'var(--ds-color-text-secondary)'
            }}
          >
            {u.icon} {u.title.split(' ')[0]}
          </button>
        ))}
      </div>
      <div style={{ ...frame.figure, padding: 6 }}>
      <div style={{ overflowX: 'auto', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '8px', background: 'var(--ds-color-bg-canvas)' }}>
        <svg viewBox={`0 0 860 ${H}`} style={{ minWidth: '620px', width: '100%', height: 'auto', display: 'block' }} role="img" aria-label={`Skill tree for ${mod.title}`}>
          <defs>
            <filter id="readyGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F0A89A" floodOpacity="0.8" />
            </filter>
          </defs>
          {[1, 2, 3].map(l => (
            <text key={l} x={COL_X[l]} y={20} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="800" letterSpacing="2">
              {l === 1 ? 'L1 · CORE' : l === 2 ? 'L2 · PRACTITIONER' : 'L3 · ADVANCED'}
            </text>
          ))}
          {/* prereq edges */}
          {tabs.map(t => {
            const a = posOf[t.id];
            if (!a) return null;
            return getPrereqIds(t.id).map(p => {
              const b = posOf[p];
              if (!b) return null;
              const x1 = b.x + NODE_W / 2, y1 = b.y;
              const x2 = a.x - NODE_W / 2, y2 = a.y;
              const mx = (x1 + x2) / 2;
              return <path key={`${p}-${t.id}`} d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`} fill="none" stroke={isMastered(p) ? '#5EC4C8' : '#D5DDE8'} strokeWidth={isMastered(p) ? 2 : 1.2} opacity={isMastered(p) ? 0.9 : 0.8} />;
            });
          })}
          {/* nodes */}
          {tabs.map(t => {
            const a = posOf[t.id];
            if (!a) return null;
            const c = nodeColor(t.id);
            const ready = isReady(t.id);
            const tab = getTabById(t.id) || { label: t.id, icon: '📝' };
            return (
              <g
                key={t.id}
                onClick={() => onSelectTab && onSelectTab(t.id)}
                style={{ cursor: 'pointer' }}
                filter={ready ? 'url(#readyGlow)' : undefined}
              >
                <title>{`${tab.label} — mastery ${getMasteryScore(t.id)}${ready ? ' · READY (prereqs met)' : ''}`}</title>
                <rect x={a.x - NODE_W / 2} y={a.y - 14} width={NODE_W} height={28} rx={14}
                  fill={c.fill} stroke={c.stroke} strokeWidth={ready ? 2.5 : 1.5} />
                <text x={a.x} y={a.y + 4} textAnchor="middle" fill={c.text} fontSize="11" fontWeight={ready ? 700 : 500}>
                  {isProven(t.id) ? '✓ ' : ''}{short(`${tab.icon} ${tab.label}`)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      </div>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)' }}>
        <span><span style={{ color: '#5EC4C8' }}>●</span> proven</span>
        <span><span style={{ color: '#F0A89A' }}>●</span> claimed</span>
        <span><span style={{ color: '#9B89C4' }}>●</span> in progress</span>
        <span><span style={{ color: '#C9B8E8' }}>●</span> untouched</span>
        <span>✨ glow = ready (prereqs met) — click any node to jump in</span>
      </div>
    </div>
  );
}
