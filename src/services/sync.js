/**
 * sync.js — local-first progress sync with Supabase.
 *
 * localStorage is the source of truth while offline. On login we pull the
 * server row, merge with local, then push. Writes to the server are debounced
 * (≥ 5s) and batched into one request. An offline queue retries with backoff.
 * No server sync happens without explicit ai_rag_storage_consent.
 *
 * Pure functions (merge, scoreOf) are exported for unit testing without a DOM
 * or network.
 */

import { supabase } from '../lib/supabaseClient.js';

// localStorage keys (must match the owning services)
const KEYS = {
  mastery: 'adaptive_mastery_v2',
  completedTabs: 'adaptive_completed_tabs',
  currentTrack: 'adaptive_current_track',
  activeTab: 'adaptive_active_tab',
  placement: 'adaptive_placement_v1',
  prompts: 'askaway_prompt_library_v1',
  consent: 'ai_rag_storage_consent',
};

const DEBOUNCE_MS = 5000;
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

let _supabase = null;
let _userId = null;
let _online = typeof navigator === 'undefined' || navigator.onLine !== false;
let _dirty = false;
let _debounceTimer = null;
let _queue = []; // { op, payload, retries, nextAt }
let _status = 'synced'; // synced | syncing | offline | error
const _listeners = new Set();

function emit(status) {
  _status = status;
  for (const cb of _listeners) cb(status);
}

export function getSyncStatus() { return _status; }
export function subscribeToSync(cb) { _listeners.add(cb); return () => _listeners.delete(cb); }
export function setSupabase(sb) { _supabase = sb; }
export function setUserId(id) { _userId = id; }
export function isOnline() { return _online; }

export function setOnline(online) {
  _online = online;
  emit(online ? 'synced' : 'offline');
  if (online) processQueue();
}

/** Consent gate: no server sync without explicit ai_rag_storage_consent. */
export function isConsented() {
  if (typeof window === 'undefined') return false;
  try { return localStorage.getItem(KEYS.consent) === 'acknowledged'; } catch { return false; }
}

/** ---- pure score helper (used by merge) ---- */

function scoreOf(evidence = {}) {
  if (evidence.legacy) return 100;
  let s = (evidence.visit ? 20 : 0) + 80 * (evidence.quizBest || 0);
  if (evidence.sim) s = Math.min(100, s + 5);
  return Math.min(100, Math.round(s));
}

/** ---- snapshot of all sync-relevant localStorage ---- */

export function snapshotLocal() {
  const readJSON = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  };
  const mastery = readJSON(KEYS.mastery, {});
  const completedTabs = readJSON(KEYS.completedTabs, []);
  const currentTrack = readJSON(KEYS.currentTrack, null);
  const activeTab = readJSON(KEYS.activeTab, null);
  const placement = readJSON(KEYS.placement, null);
  const prompts = readJSON(KEYS.prompts, []);
  return {
    mastery,
    completedTabs,
    currentTrack,
    activeTab,
    placement,
    prompts,
    updatedAt: Date.now(),
  };
}

/** ---- pure merge: local + server -> merged snapshot ---- */

export function merge(local, server = {}) {
  const lm = local.mastery || {};
  const sm = server.mastery || {};
  const allIds = new Set([...Object.keys(lm), ...Object.keys(sm)]);
  const mastery = {};
  for (const id of allIds) {
    const l = lm[id] || {};
    const s = sm[id] || {};
    const ls = scoreOf(l);
    const ss = scoreOf(s);
    // mastery score = max; tie → later updatedAt, else local
    if (ls > ss) mastery[id] = { ...l, updatedAt: l.updatedAt || 0 };
    else if (ss > ls) mastery[id] = { ...s, updatedAt: s.updatedAt || 0 };
    else mastery[id] = (l.updatedAt || 0) >= (s.updatedAt || 0) ? { ...l } : { ...s };
  }

  // completed tabs = union
  const completedTabs = [...new Set([
    ...(local.completedTabs || []),
    ...(server.completed_tabs || []),
  ])];

  // prompt library = union by id, latest updated_at wins
  const promptMap = new Map();
  for (const p of (local.prompts || [])) {
    if (p.id) promptMap.set(p.id, { ...p });
  }
  for (const p of (server.prompts || [])) {
    const id = p.client_id || p.id;
    if (!id) continue;
    const candidate = { id, ...(p.data || {}), updatedAt: p.updated_at || p.updatedAt || 0 };
    const existing = promptMap.get(id);
    if (!existing || (candidate.updatedAt || 0) > (existing.updatedAt || 0)) {
      promptMap.set(id, candidate);
    }
  }
  const prompts = [...promptMap.values()];

  // track / active tab / placement = latest timestamp wins
  const serverNewer = server && (server.updated_at || 0) > (local.updatedAt || 0);
  return {
    mastery,
    completedTabs,
    currentTrack: serverNewer ? server.current_track : local.currentTrack,
    activeTab: serverNewer ? server.active_tab : local.activeTab,
    placement: serverNewer ? server.placement : local.placement,
    prompts,
    updatedAt: Date.now(),
  };
}

/** ---- persist merged snapshot back to localStorage ---- */

export function persistMerged(merged) {
  if (typeof window === 'undefined') return;
  const writeJSON = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  };
  writeJSON(KEYS.mastery, merged.mastery);
  writeJSON(KEYS.completedTabs, merged.completedTabs);
  writeJSON(KEYS.currentTrack, merged.currentTrack);
  writeJSON(KEYS.activeTab, merged.activeTab);
  writeJSON(KEYS.placement, merged.placement);
  writeJSON(KEYS.prompts, merged.prompts);
}

/** ---- debounced, batched push to server ---- */

function restartDebounce() {
  if (_debounceTimer) clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => {
    _debounceTimer = null;
    if (_dirty) flush();
  }, DEBOUNCE_MS);
}

/** Call when local progress changes (wraps localStorage writes automatically too). */
export function markDirty() {
  _dirty = true;
  restartDebounce();
}

/** Push current local snapshot to the server in one request. */
export async function flush() {
  if (_debounceTimer) { clearTimeout(_debounceTimer); _debounceTimer = null; }
  if (!_dirty || !_userId || !isConsented() || !_online || !_supabase) return;
  _dirty = false;
  emit('syncing');
  try {
    await pushToServer(snapshotLocal());
    emit('synced');
  } catch (e) {
    emit('error');
    enqueueOffline({ op: 'push', payload: snapshotLocal(), retries: 0,
      nextAt: Date.now() + BASE_BACKOFF_MS });
  }
}

async function pushToServer(snap) {
  // Upsert progress row
  await _supabase.from('user_progress').upsert({
    user_id: _userId,
    mastery: snap.mastery,
    completed_tabs: snap.completedTabs,
    current_track: snap.currentTrack,
    active_tab: snap.activeTab,
    placement: snap.placement,
    updated_at: new Date(snap.updatedAt).toISOString(),
  }, { onConflict: 'user_id' });

  // Upsert prompts (union by client_id; server already merged on read)
  for (const p of (snap.prompts || [])) {
    if (!p.id) continue;
    await _supabase.from('user_prompts').upsert({
      user_id: _userId,
      client_id: p.id,
      data: p,
      updated_at: new Date(p.updatedAt || snap.updatedAt).toISOString(),
    }, { onConflict: 'user_id,client_id' });
  }
}

/** ---- On login: pull server, merge with local, persist, push ---- */

export async function initSync(userId, sb) {
  if (!isConsented()) { emit('synced'); return { synced: false, reason: 'no consent' }; }
  _userId = userId;
  _supabase = sb || supabase;
  emit('syncing');
  try {
    const local = snapshotLocal();

    const { data: progress, error } = await _supabase
      .from('user_progress').select('*').eq('user_id', _userId).single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

    const { data: promptRows } = await _supabase
      .from('user_prompts').select('*').eq('user_id', _userId);

    const server = {
      mastery: progress?.mastery || {},
      completed_tabs: progress?.completed_tabs || [],
      current_track: progress?.current_track,
      active_tab: progress?.active_tab,
      placement: progress?.placement,
      updated_at: progress?.updated_at || 0,
      prompts: (promptRows || []).map(p => ({
        id: p.client_id,
        ...(p.data || {}),
        updatedAt: p.updated_at || 0,
      })),
    };

    const merged = merge(local, server);
    persistMerged(merged);
    await pushToServer(merged); // ensure server has the merged state
    _dirty = false;
    emit('synced');
    return { synced: true, merged };
  } catch (e) {
    emit('error');
    return { synced: false, error: String(e) };
  }
}

/** ---- offline queue with retry + backoff ---- */

function enqueueOffline(item) {
  // dedupe by op: keep the latest push
  _queue = _queue.filter(q => q.op !== item.op);
  _queue.push(item);
  processQueue();
}

async function processQueue() {
  if (!_online || !_userId || !isConsented() || !_supabase) return;
  const now = Date.now();
  const due = _queue.filter(q => q.nextAt <= now);
  if (!due.length) return;
  for (const q of due) {
    try {
      await pushToServer(q.payload);
      _queue = _queue.filter(x => x !== q);
      emit('synced');
    } catch (e) {
      q.retries += 1;
      if (q.retries >= MAX_RETRIES) {
        _queue = _queue.filter(x => x !== q);
        emit('error');
      } else {
        const backoff = BASE_BACKOFF_MS * Math.pow(2, q.retries - 1);
        q.nextAt = Date.now() + backoff;
      }
    }
  }
}

// Auto-mark dirty when any sync-relevant localStorage key is written.
export function enableAutoDirty() {
  if (typeof window === 'undefined' || window.__askawaySyncPatched) return;
  const origSetItem = localStorage.setItem.bind(localStorage);
  const syncKeys = new Set(Object.values(KEYS));
  localStorage.setItem = function (key, value) {
    origSetItem(key, value);
    if (syncKeys.has(key)) markDirty();
  };
  window.__askawaySyncPatched = true;
}

export { scoreOf };

export default {
  getSyncStatus, subscribeToSync, setSupabase, setUserId, setOnline,
  isOnline, isConsented, snapshotLocal, scoreOf, merge, persistMerged,
  markDirty, flush, initSync, enableAutoDirty,
};
