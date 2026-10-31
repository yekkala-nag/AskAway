import test from 'node:test';
import assert from 'node:assert/strict';
import { merge, scoreOf } from '../src/services/sync.js';

const base = (overrides = {}) => ({
  mastery: {},
  completedTabs: [],
  currentTrack: null,
  activeTab: null,
  placement: null,
  prompts: [],
  updatedAt: 0,
  ...overrides,
});

test('scoreOf computes mastery score', () => {
  assert.equal(scoreOf({}), 0);
  assert.equal(scoreOf({ visit: true }), 20);
  assert.equal(scoreOf({ visit: true, quizBest: 0.5 }), 60);
  assert.equal(scoreOf({ visit: true, quizBest: 1 }), 100);
  assert.equal(scoreOf({ legacy: true }), 100);
  assert.equal(scoreOf({ visit: true, quizBest: 0.5, sim: true }), 65);
  // capped at 100
  assert.equal(scoreOf({ visit: true, quizBest: 1, sim: true }), 100);
});

test('merge: mastery score = max (server higher wins)', () => {
  const local = base({
    mastery: { a: { visit: true, quizBest: 0.5, updatedAt: 100 } },
  });
  // server score 100 > local score 60
  const server = { mastery: { a: { visit: true, quizBest: 1, updatedAt: 200 } }, updated_at: 0 };
  const m = merge(local, server);
  assert.equal(m.mastery.a.quizBest, 1);
  assert.equal(m.mastery.a.visit, true);
});

test('merge: mastery score = max (local higher wins)', () => {
  const local = base({
    mastery: { a: { visit: true, quizBest: 1, updatedAt: 100 } },
  });
  const server = { mastery: { a: { visit: true, quizBest: 0.5, updatedAt: 200 } }, updated_at: 0 };
  const m = merge(local, server);
  assert.equal(m.mastery.a.quizBest, 1);
});

test('merge: mastery tie → later updatedAt wins', () => {
  const local = base({
    mastery: { a: { visit: true, quizBest: 0.5, updatedAt: 500 } },
  });
  const server = { mastery: { a: { visit: true, quizBest: 0.5, updatedAt: 200 } }, updated_at: 0 };
  const m = merge(local, server);
  assert.equal(m.mastery.a.updatedAt, 500);
});

test('merge: completed tabs = union (deduped)', () => {
  const local = base({ completedTabs: ['a', 'b'] });
  const server = { completed_tabs: ['b', 'c'], updated_at: 0 };
  const m = merge(local, server);
  assert.deepEqual(m.completedTabs.sort(), ['a', 'b', 'c']);
});

test('merge: prompts = union by id, latest updated_at wins', () => {
  const local = base({
    prompts: [{ id: 'p1', text: 'old', updatedAt: 100 }],
  });
  const server = { prompts: [{ client_id: 'p1', data: { text: 'new' }, updated_at: 200 }] };
  const m = merge(local, server);
  assert.equal(m.prompts.length, 1);
  assert.equal(m.prompts[0].text, 'new');
  assert.equal(m.prompts[0].updatedAt, 200);
});

test('merge: prompts keeps both sides when ids differ', () => {
  const local = base({ prompts: [{ id: 'p1', text: 'a', updatedAt: 100 }] });
  const server = { prompts: [{ client_id: 'p2', data: { text: 'b' }, updated_at: 200 }] };
  const m = merge(local, server);
  assert.equal(m.prompts.length, 2);
  assert.ok(m.prompts.some((p) => p.id === 'p1'));
  assert.ok(m.prompts.some((p) => p.id === 'p2'));
});

test('merge: track/active tab = latest timestamp wins (server newer)', () => {
  const local = base({ currentTrack: 'trackA', activeTab: 'tabX', updatedAt: 1000 });
  const server = { current_track: 'trackB', active_tab: 'tabY', placement: null, updated_at: 2000 };
  const m = merge(local, server);
  assert.equal(m.currentTrack, 'trackB');
  assert.equal(m.activeTab, 'tabY');
});

test('merge: keeps local track/active tab when local is newer', () => {
  const local = base({ currentTrack: 'trackA', activeTab: 'tabX', updatedAt: 5000 });
  const server = { current_track: 'trackB', active_tab: 'tabY', placement: null, updated_at: 2000 };
  const m = merge(local, server);
  assert.equal(m.currentTrack, 'trackA');
  assert.equal(m.activeTab, 'tabX');
});

test('merge: missing server is treated as empty', () => {
  const local = base({ completedTabs: ['a'], currentTrack: 'trackA' });
  const m = merge(local, {});
  assert.deepEqual(m.completedTabs, ['a']);
  assert.equal(m.currentTrack, 'trackA');
});
