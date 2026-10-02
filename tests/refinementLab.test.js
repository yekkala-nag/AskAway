import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createVersion, diffTexts, alignLines, pushVersion, decide, undo, summarize, loadHistory, saveHistory, clearHistory } from '../src/services/refinementLab.js';

describe('refinementLab', () => {
  it('createVersion normalizes fields and starts pending', () => {
    const v = createVersion('hello', 'tightened wording', 'edit');
    assert.equal(v.text, 'hello');
    assert.equal(v.note, 'tightened wording');
    assert.equal(v.state, 'pending');
    assert.ok(v.id.startsWith('v_'));
  });

  it('diffTexts reports added/removed/unchanged', () => {
    const d = diffTexts('a\nb\nc', 'a\nB\nd');
    assert.deepEqual(d.added, ['B', 'd']);
    assert.deepEqual(d.removed, ['b', 'c']);
    assert.deepEqual(d.unchanged, ['a']);
    assert.equal(d.changed, true);
    assert.equal(diffTexts('same', 'same').changed, false);
  });

  it('alignLines produces row statuses', () => {
    const rows = alignLines('a\nb', 'a\nx');
    assert.deepEqual(rows.map((r) => r.status), ['same', 'changed']);
    assert.deepEqual(alignLines('a', 'a\nb').map((r) => r.status), ['same', 'added']);
  });

  it('accept/reject only flips the target version; undo removes it', () => {
    let h = pushVersion([], createVersion('one'));
    h = pushVersion(h, createVersion('two'));
    assert.equal(h.length, 2);
    const id = h[1].id;
    const accepted = decide(h, id, 'accepted');
    assert.equal(accepted[1].state, 'accepted');
    assert.equal(accepted[0].state, 'pending');
    assert.throws(() => decide(h, id, 'yeet'), /invalid-decision/);
    const afterUndo = undo(accepted, id);
    assert.equal(afterUndo.length, 1);
    assert.equal(undo(afterUndo, 'nope').length, 1);
  });

  it('history caps at 50 versions', () => {
    let h = [];
    for (let i = 0; i < 60; i++) h = pushVersion(h, createVersion(`t${i}`));
    assert.equal(h.length, 50);
    assert.equal(h[49].text, 't59');
  });

  it('summarize counts states', () => {
    let h = pushVersion([], createVersion('a'));
    h = pushVersion(h, createVersion('b'));
    h = decide(h, h[0].id, 'accepted');
    h = decide(h, h[1].id, 'rejected');
    const s = summarize(h);
    assert.deepEqual({ t: s.total, a: s.accepted, r: s.rejected, p: s.pending }, { t: 2, a: 1, r: 1, p: 0 });
    assert.equal(summarize([]).total, 0);
  });

  it('persistence round-trips through the fallback store in Node', () => {
    clearHistory();
    saveHistory([createVersion('persisted')]);
    const h = loadHistory();
    assert.equal(h.length, 1);
    assert.equal(h[0].text, 'persisted');
    clearHistory();
    assert.equal(loadHistory().length, 0);
  });
});
