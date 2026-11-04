/**
 * aiKeyStore.js — one remembered AI connection config for every AI panel.
 *
 * Entered once (freellmapi key etc.), reused across tabs and reloads via
 * localStorage so no panel asks for the key again. Values only ever come
 * from user input at runtime — nothing is baked into the bundle.
 */
const STORAGE_KEY = 'ai_rag_ai_config';

const DEFAULTS = {
  apiKey: '',
  // freellmapi (npx freellmapi setup opencode) — OpenAI-compatible, localhost only.
  baseUrl: 'http://localhost:3001/v1',
  model: 'auto',
};

export function loadAIConfig() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveAIConfig(patch) {
  const next = { ...loadAIConfig(), ...patch };
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // storage unavailable (private mode) — keep in-memory value only
  }
  return next;
}
