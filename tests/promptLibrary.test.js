import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { SEED_PROMPTS, LIBRARY_CATEGORIES, listPrompts, getPrompt, saveUserPrompt, deleteUserPrompt, searchPrompts, listTags, clearUserPrompts } from '../src/services/promptLibrary.js';

describe('promptLibrary', () => {
  beforeEach(() => clearUserPrompts());

  it('ships curated seeds with required fields and valid categories', () => {
    assert.ok(SEED_PROMPTS.length >= 8);
    for (const p of SEED_PROMPTS) {
      assert.ok(p.id && p.title && p.text && p.bestFor);
      assert.ok(LIBRARY_CATEGORIES.includes(p.category));
      assert.ok(Array.isArray(p.tags) && p.tags.length > 0);
    }
    assert.equal(new Set(SEED_PROMPTS.map((p) => p.id)).size, SEED_PROMPTS.length);
  });

  it('lists seeds by default, user prompts only on request', () => {
    assert.equal(listPrompts().length, SEED_PROMPTS.length);
    assert.equal(listPrompts(false).length, 0);
    saveUserPrompt({ title: 'Mine', text: 'Do the thing' });
    assert.equal(listPrompts(false).length, 1);
    assert.equal(listPrompts().length, SEED_PROMPTS.length + 1);
  });

  it('rejects empty prompts and resolves getPrompt', () => {
    assert.throws(() => saveUserPrompt({ title: 'x', text: '   ' }), /prompt-text-required/);
    const saved = saveUserPrompt({ title: 'Find me', text: 'unique-canary-text' });
    assert.equal(getPrompt(saved.id).text, 'unique-canary-text');
    assert.equal(getPrompt('nope'), null);
  });

  it('updates in place when the same id is saved twice', () => {
    const first = saveUserPrompt({ title: 'v1', text: 'first text' });
    saveUserPrompt({ id: first.id, title: 'v2', text: 'second text' });
    const user = listPrompts(false);
    assert.equal(user.length, 1);
    assert.equal(user[0].title, 'v2');
    assert.equal(user[0].text, 'second text');
  });

  it('deletes only user prompts; seeds are immutable', () => {
    const saved = saveUserPrompt({ title: 'temp', text: 'temp text' });
    assert.equal(deleteUserPrompt(saved.id), true);
    assert.equal(deleteUserPrompt(saved.id), false);
    assert.equal(deleteUserPrompt('seed_brief'), false);
    assert.equal(listPrompts(false).length, 0);
  });

  it('search is AND-token across fields, with category/tag filters', () => {
    const all = listPrompts();
    const json = searchPrompts(all, 'json schema');
    assert.ok(json.length >= 1);
    assert.ok(json.every((p) => `${p.title} ${p.text} ${p.tags.join(' ')}`.toLowerCase().includes('json')));
    assert.ok(searchPrompts(all, 'json', { category: 'Writing' }).length === 0 || searchPrompts(all, 'json', { category: 'Writing' }).every((p) => p.category === 'Writing'));
    const tagged = searchPrompts(all, '', { tag: 'incident' });
    assert.ok(tagged.length >= 1 && tagged.every((p) => p.tags.includes('incident')));
    assert.equal(searchPrompts(all, 'zzz-no-match').length, 0);
    assert.equal(searchPrompts(all, '').length, all.length);
  });

  it('listTags aggregates sorted unique tags', () => {
    const tags = listTags(listPrompts());
    assert.ok(tags.includes('incident'));
    assert.deepEqual(tags, [...tags].sort());
    assert.equal(new Set(tags).size, tags.length);
  });
});
