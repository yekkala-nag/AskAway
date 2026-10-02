/**
 * Refinement lab — version history, line diff, accept/reject/undo.
 * Pure decision functions + a thin localStorage persistence adapter.
 * Tests use the pure functions only (no DOM).
 */
const STORAGE_KEY = 'askaway_refinement_lab_v1';

export function createVersion(text, note = '', source = 'edit') {
  return {
    id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    text: String(text ?? ''),
    note: String(note || ''),
    source,
    createdAt: Date.now(),
    state: 'pending',
  };
}

/** Diff by lines: added/removed/unchanged lists + counts. Pure. */
export function diffTexts(oldText, newText) {
  const a = String(oldText ?? '').split('\n');
  const b = String(newText ?? '').split('\n');
  const setA = new Map();
  a.forEach((l, i) => { if (!setA.has(l)) setA.set(l, i); });
  const removed = [];
  const added = [];
  const unchanged = [];
  const matchedB = new Set();
  for (const line of a) {
    if (b.includes(line)) unchanged.push(line);
    else removed.push(line);
  }
  for (const line of b) {
    if (a.includes(line)) matchedB.add(line);
    else added.push(line);
  }
  return {
    added, removed, unchanged,
    counts: { added: added.length, removed: removed.length, unchanged: unchanged.length, oldLines: a.length, newLines: b.length },
    changed: added.length + removed.length > 0,
  };
}

/** Line-aligned pairs for rendering (LCS-free, stable naive alignment). */
export function alignLines(oldText, newText) {
  const a = String(oldText ?? '').split('\n');
  const b = String(newText ?? '').split('\n');
  const rows = [];
  const max = Math.max(a.length, b.length);
  for (let i = 0; i < max; i++) {
    const l = i < a.length ? a[i] : null;
    const r = i < b.length ? b[i] : null;
    const status = l === r ? 'same' : l === null ? 'added' : r === null ? 'removed' : 'changed';
    rows.push({ old: l, new: r, status });
  }
  return rows;
}

export function pushVersion(history, version) {
  const list = Array.isArray(history) ? history.slice() : [];
  list.push(version);
  return list.slice(-50);
}

export function decide(history, versionId, decision) {
  if (!['accepted', 'rejected'].includes(decision)) throw new Error(`invalid-decision:${decision}`);
  return (history || []).map((v) => (v.id === versionId ? { ...v, state: decision } : v));
}

export function undo(history, versionId) {
  const list = Array.isArray(history) ? history.slice() : [];
  const idx = list.findIndex((v) => v.id === versionId);
  if (idx === -1) return list;
  list.splice(idx, 1);
  return list;
}

export function summarize(history) {
  const list = Array.isArray(history) ? history : [];
  return {
    total: list.length,
    accepted: list.filter((v) => v.state === 'accepted').length,
    rejected: list.filter((v) => v.state === 'rejected').length,
    pending: list.filter((v) => v.state === 'pending').length,
    latest: list.length ? list[list.length - 1] : null,
  };
}

/** Persistence adapter — swaps to in-memory when localStorage unavailable. */
let memStore = [];
function getStore() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return {
        read() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (e) { return []; } },
        write(list) { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); },
      };
    }
  } catch (e) { /* fall through */ }
  return { read: () => memStore.slice(), write: (list) => { memStore = list.slice(); } };
}

export function loadHistory() { return getStore().read(); }
export function saveHistory(list) { getStore().write(Array.isArray(list) ? list : []); }
export function clearHistory() { saveHistory([]); }
