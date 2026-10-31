import React, { useState, useEffect } from "react";
import { getTabById, UMBRELLA_TOPICS } from "../registry/tabsRegistry.js";
import { getTabMeta } from "../registry/tabsMeta.js";
import { getChildrenForUmbrella as getChildren, getChildById as getChild, getChildSequence, getTopicMeta, getHubPageId } from "../registry/curriculum.js";

const C = {
  bg: "#F5F5F7", surface: "#FFFFFF", s2: "#EDEDF0", s3: "#EDEDF0",
  border: "#E8E8EC", text: "#2D2D3A", muted: "#4A4A5A",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const LEVEL_INK = {
  1: "#1F6B6E",
  2: "#6B5E94",
  3: "#C47A6A",
};

const LEVEL_BADGES = {
  1: { label: "L1", color: "#5EC4C8" },
  2: { label: "L2", color: "#9B89C4" },
  3: { label: "L3", color: "#F0A89A" },
};

function isTabUnlocked(tabId, topicMeta, progress) {
  const meta = topicMeta[tabId];
  if (!meta || !meta.p?.length) return true;
  return meta.p.every(p => progress?.completed?.includes(p));
}

export function HubPage({ childId, onSelectTab }) {
  const child = getChild(childId);
  if (!child) return <div style={{ padding: 24, color: C.muted }}>Child umbrella not found: {childId}</div>;

  const tabs = getChildSequence(childId);
  const topicMeta = {};
  tabs.forEach(id => {
    const meta = getTopicMeta(id);
    topicMeta[id] = { l: meta?.l || 1, p: meta?.p || [], keywords: (getTabMeta(id)?.keywords) || [] };
  });

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(`hub_progress_${childId}`);
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`hub_progress_${childId}`, JSON.stringify(progress));
    } catch {}
  }, [progress, childId]);

  const completedIds = (progress?.completed || []).filter(id => tabs.includes(id));
  const completedCount = completedIds.length;
  const totalCount = tabs.length;
  const pct = totalCount ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;
  const nextUp = tabs.find(id => !completedIds.includes(id)) || tabs[0];
  const isComplete = totalCount > 0 && completedCount >= totalCount;

  const children = getChildren(child.umbrellaId);
  const currentIndex = children.findIndex(c => c.id === childId);
  const nextChild = children[currentIndex + 1];
  const prevChild = children[currentIndex - 1];
  const firstHubId = children.length ? getHubPageId(children[0].id) : null;
  // Cross-section escape (no dead-ends): first hub in an umbrella links back
  // to the last hub of the previous umbrella. Forward motion from a hub
  // enters its own topics via Next (see footer); hub-to-hub stepping lives
  // in the TopBar position bar and sidebar.
  const umbrellaIdx = UMBRELLA_TOPICS.findIndex(u => u.id === child.umbrellaId);
  const prevUmbrella = umbrellaIdx > 0 ? UMBRELLA_TOPICS[umbrellaIdx - 1] : null;
  const prevSectionLast = !prevChild && prevUmbrella ? getChildren(prevUmbrella.id).slice(-1)[0] : null;
  const prevTarget = prevChild || prevSectionLast;

  function handleTabClick(tabId) {
    onSelectTab(tabId);
  }

  function toggleDone(tabId) {
    setProgress((p) => ({
      completed: (p?.completed || []).includes(tabId)
        ? (p.completed || []).filter((t) => t !== tabId)
        : [...(p?.completed || []), tabId],
    }));
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span title={child.blurb} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: "rgba(94,196,200,0.14)", color: C.tealInk, border: `1px solid ${C.tealDark}` }}>
            {(UMBRELLA_TOPICS.find(u => u.id === child.umbrellaId) || {}).title || child.umbrellaId}
          </span>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{child.title}</h1>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{child.blurb}</p>
      </div>

      {/* Navigation (top) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, marginBottom: 8, borderBottom: `1px solid ${C.border}` }}>
        {prevTarget ? (
          <button
            onClick={() => onSelectTab(getHubPageId(prevTarget.id))}
            title={prevChild ? `Previous: ${prevTarget.title}` : `Previous section: ${prevTarget.title}`}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: "transparent", color: C.tealInk, border: `1px solid ${C.tealDark}`,
            }}
          >
            ← {prevTarget.title}
          </button>
        ) : <span />}
        <div style={{ flex: 1, textAlign: "center" }}>
          {currentIndex > 0 && (
          <button
            onClick={() => firstHubId && onSelectTab(firstHubId)}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              margin: "0 8px", background: "transparent", color: C.tealInk, border: `1px solid ${C.tealDark}`,
            }}
          >
            Back to start of section
          </button>
          )}
        </div>
        {nextUp ? (
          <button
            onClick={() => handleTabClick(nextUp)}
            title={completedCount === 0 ? `Next: start with ${(getTabById(nextUp) || {}).label || nextUp}` : (isComplete ? `Next: review ${(getTabById(nextUp) || {}).label || nextUp}` : `Next: continue with ${(getTabById(nextUp) || {}).label || nextUp}`)}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: C.coralDeep, color: "#FFFFFF", border: "none",
            }}
          >
            {completedCount === 0
              ? `Next: ${(getTabById(nextUp) || {}).label || nextUp} →`
              : (isComplete
                ? `Next: review ${(getTabById(nextUp) || {}).label || nextUp} →`
                : `Next: ${(getTabById(nextUp) || {}).label || nextUp} →`)}
          </button>
        ) : <span />}
      </div>

      {/* Progress Ring + Stats + Resume CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, marginBottom: 16, alignItems: "center" }}>
        <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r={37} fill="none" stroke={C.border} strokeWidth={6} />
          <circle
            cx="40" cy="40" r={37}
            fill="none" stroke={C.coral} strokeWidth={6}
            strokeDasharray={2 * Math.PI * 37} strokeDashoffset={2 * Math.PI * 37 * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
            fontSize={17} fontWeight={700} fontFamily="JetBrains Mono, monospace" fill={C.coralDeep}>
            {pct}%
          </text>
        </svg>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.muted }}>Progress</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: C.coralDeep }}>
              {completedCount} / {totalCount} topics
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: C.muted }}>
            <span>L1: {tabs.filter(t => topicMeta[t]?.l === 1).length}</span>
            <span>L2: {tabs.filter(t => topicMeta[t]?.l === 2).length}</span>
            <span>L3: {tabs.filter(t => topicMeta[t]?.l === 3).length}</span>
          </div>
        </div>
      </div>

      {nextUp && (
        <div style={{ marginBottom: 24 }}>
          <button
            onClick={() => handleTabClick(nextUp)}
            title={completedCount === 0 ? `Start with ${(getTabById(nextUp) || {}).label || nextUp}` : (isComplete ? `Review ${(getTabById(nextUp) || {}).label || nextUp}` : `Continue with ${(getTabById(nextUp) || {}).label || nextUp}`)}
            style={{ padding: "12px 24px", background: C.tealDark, color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            {completedCount === 0
              ? `Start the hub →`
              : (isComplete
                ? `Review: ${(getTabById(nextUp) || {}).label || nextUp} →`
                : `Continue: ${(getTabById(nextUp) || {}).label || nextUp} →`)}
          </button>
        </div>
      )}

      {/* Topic Grid */}
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Follow the sequence, or jump to any topic. Tick topics off as you finish them.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
        {tabs.map(tabId => {
          const meta = topicMeta[tabId];
          const completed = progress?.completed?.includes(tabId);
          const level = meta?.l || 1;
          const pendingPrereqs = (meta?.p || []).filter(p => !progress?.completed?.includes(p));

          return (
            <div
              key={tabId}
              onClick={() => handleTabClick(tabId)}
              style={{
                cursor: "pointer",
                opacity: 1,
                borderColor: completed ? C.tealDark : C.border,
                background: completed ? `rgba(94,196,200,0.12)` : C.surface,
                transition: "all 0.2s",
                padding: 16,
                border: `1px solid ${completed ? C.tealDark : C.border}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                  background: completed ? "rgba(94,196,200,0.14)" : "transparent",
                  color: completed ? LEVEL_INK[meta?.l || 1] : C.muted,
                  border: `1px solid ${completed ? C.tealDark : C.border}`,
                }}>
                  {LEVEL_BADGES[meta?.l || 1].label}
                </span>
                {completed && <span style={{ color: C.tealDark, fontSize: 16 }}>✓</span>}
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: C.text }}>
                {(getTabById(tabId) || {}).label || tabId}
              </h3>
              <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                {meta?.keywords?.slice(0, 3).join(", ") || "No description"}
              </p>
              {meta?.p?.length ? (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.muted }}>
                  {pendingPrereqs.length ? `Suggested after: ${pendingPrereqs.map(p => (getTabById(p) || {}).label || p).join(", ")}` : "Prerequisites complete ✓"}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleTabClick(tabId); }}
                  style={{ flex: 1, padding: "9px 12px", background: "transparent", color: C.tealInk, border: `1px solid ${C.tealDark}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Open topic →
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDone(tabId); }}
                  title={completed ? "Mark as not done" : "Mark as done"}
                  style={{ padding: "9px 12px", background: completed ? C.tealDark : "transparent", color: completed ? "#FFFFFF" : C.muted, border: `1px solid ${completed ? C.tealDark : C.border}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  {completed ? "✓ Done" : "Mark done"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HubPage;