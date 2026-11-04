import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadAIConfig, saveAIConfig } from '../src/lib/aiKeyStore.js';
import { callAIProxy } from '../src/lib/aiProxy.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

describe('aiKeyStore', () => {
  let originalStorage;
  beforeEach(() => {
    originalStorage = globalThis.localStorage;
    globalThis.localStorage = memoryStorage();
  });
  afterEach(() => {
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  });

  it('returns defaults when nothing is saved', () => {
    const cfg = loadAIConfig();
    assert.equal(cfg.apiKey, '');
    assert.equal(cfg.baseUrl, 'http://localhost:3001/v1');
    assert.equal(cfg.model, 'auto');
  });

  it('round-trips a saved key', () => {
    saveAIConfig({ apiKey: 'freellmapi-abc' });
    assert.equal(loadAIConfig().apiKey, 'freellmapi-abc');
  });

  it('keeps other fields when patching one field', () => {
    saveAIConfig({ apiKey: 'freellmapi-abc', model: 'gpt-5-mini' });
    saveAIConfig({ apiKey: 'freellmapi-xyz' });
    const cfg = loadAIConfig();
    assert.equal(cfg.apiKey, 'freellmapi-xyz');
    assert.equal(cfg.model, 'gpt-5-mini');
  });
});

describe('callAIProxy routing', () => {
  let originalFetch;
  let originalStorage;
  let captured;
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    originalStorage = globalThis.localStorage;
    globalThis.localStorage = memoryStorage();
    captured = {};
    globalThis.fetch = async (url, options) => {
      captured.url = String(url);
      captured.options = options;
      return Response.json({ choices: [{ message: { content: 'ok' } }] });
    };
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
  });

  it('calls freellmapi directly with Bearer auth and the stored model', async () => {
    saveAIConfig({ apiKey: 'freellmapi-abc', baseUrl: 'http://localhost:3001/v1', model: 'auto' });
    const out = await callAIProxy({ messages: [{ role: 'user', content: 'hi' }] });
    assert.equal(out, 'ok');
    assert.equal(captured.url, 'http://localhost:3001/v1/chat/completions');
    assert.equal(captured.options.headers.Authorization, 'Bearer freellmapi-abc');
    assert.equal(JSON.parse(captured.options.body).model, 'auto');
  });

  it('routes non-freellmapi keys through the platform proxy', async () => {
    saveAIConfig({ apiKey: 'sk-test' });
    await callAIProxy({ messages: [{ role: 'user', content: 'hi' }], model: 'gpt-4o-mini' });
    assert.equal(captured.url, '/api/ai/chat');
    assert.equal(captured.options.headers['x-openai-api-key'], 'sk-test');
    assert.equal(captured.options.headers.Authorization, undefined);
    assert.equal(JSON.parse(captured.options.body).model, 'gpt-4o-mini');
  });

  it('falls back to the proxy when no key is stored', async () => {
    await callAIProxy({ messages: [{ role: 'user', content: 'hi' }] });
    assert.equal(captured.url, '/api/ai/chat');
    assert.equal(captured.options.headers['x-openai-api-key'], undefined);
  });

  it('explains the failure when freellmapi is not running', async () => {
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch');
    };
    saveAIConfig({ apiKey: 'freellmapi-abc' });
    await assert.rejects(
      callAIProxy({ messages: [{ role: 'user', content: 'hi' }] }),
      /Cannot reach freellmapi/,
    );
  });
});
