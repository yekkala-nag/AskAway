/**
 * aiProxy.js — client-side helper for the /api/ai/chat proxy.
 *
 * Routes OpenAI-style chat requests through the Vercel function so that:
 *   - No OpenAI key or call exists in client bundles.
 *   - The server enforces auth, rate limits, model allow-lists, and quotas.
 *   - SSE streaming is supported when the caller passes onToken.
 *
 * The user-supplied key mode is preserved: pass `apiKey` and it is forwarded
 * to the proxy (which relays it to OpenAI). The key is never stored server-side.
 */

const API_BASE = (typeof import.meta.env === 'object' && import.meta.env)
  ? import.meta.env.VITE_API_BASE_URL || ''
  : '';

export async function callAIProxy({
  messages,
  model = 'gpt-4o-mini',
  stream = false,
  onToken,
  apiKey,
}) {
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['x-openai-api-key'] = apiKey;

  const res = await fetch(`${API_BASE}/api/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages, model, stream }),
  });

  if (!res.ok) {
    let detail;
    try {
      detail = await res.text();
    } catch {
      detail = String(res.status);
    }
    throw new Error(`AI proxy error: ${res.status} ${detail}`);
  }

  // ── Streaming (SSE) ──
  if (stream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    const collected = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content || '';
            collected.push(token);
            if (onToken) onToken(token);
          } catch {
            // skip unparseable SSE lines
          }
        }
      }
    }
    return collected.join('');
  }

  // ── Non-streaming ──
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export default { callAIProxy };
