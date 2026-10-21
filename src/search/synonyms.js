/**
 * Query-time synonym / abbreviation map for AskAway search.
 *
 * Each group is a list of equivalent terms. At query time a token that
 * matches any member of a group is expanded into an OR over the whole
 * group, so "MCP" finds "Model Context Protocol" tabs and vice versa.
 *
 * To extend: append a new array of equivalent terms (lowercase).
 * Multi-word phrases are supported and matched longest-first.
 */

export const SYNONYM_GROUPS = [
  // RAG
  ['rag', 'retrieval augmented generation', 'retrieval-augmented generation', 'retrieval'],
  // MCP
  ['mcp', 'model context protocol'],
  // LLM ops / evals
  ['llmops', 'llm ops', 'llm operations'],
  ['eval', 'evals', 'evaluation', 'evaluations', 'benchmark', 'benchmarks'],
  // Agents
  ['agent', 'agents', 'agentic', 'ai agent'],
  ['multiagent', 'multi agent', 'multi-agent', 'multiple agents'],
  // Memory / context
  ['memory', 'memories', 'remember', 'remembers', 'recall', 'long-term memory', 'long term memory'],
  ['context', 'context window', 'context engineering', 'prompt context'],
  // Hallucination & safety
  ['hallucination', 'hallucinations', 'hallucinate', 'hallucinating', 'confabulation', 'made up', 'make stuff up'],
  ['guardrail', 'guardrails', 'safety', 'content safety', 'moderation', 'responsible ai'],
  ['injection', 'prompt injection', 'jailbreak', 'jailbreaking'],
  // Mitigation verbs (concept-style queries: "stop hallucinations", "reduce cost").
  // Marked soft: they are common English, so at query time they only boost
  // docs that also match the content terms — they never drive ranking alone.
  { soft: true, terms: ['reduce', 'minimize', 'cut', 'lower', 'shrink', 'cheaper'] },
  { soft: true, terms: ['prevent', 'stop', 'avoid', 'mitigate', 'curb', 'block', 'defend against', 'protect against'] },
  // Fine-tuning & training
  ['finetune', 'fine-tune', 'fine tune', 'fine-tuning', 'fine tuning', 'lora', 'qlora', 'peft'],
  ['train', 'training', 'tune', 'tuning'],
  // Vector / embeddings
  ['embedding', 'embeddings', 'vector', 'vectors', 'vector search', 'vectorstore', 'vector store', 'vectordb', 'vector db', 'vector database'],
  ['database', 'db', 'databases'],
  // Chunking / parsing
  ['chunk', 'chunking', 'splitting', 'text splitting'],
  ['parse', 'parsing', 'extraction', 'document parsing'],
  // Prompts
  ['prompt', 'prompts', 'prompting', 'prompt engineering', 'prompt design'],
  ['system prompt', 'system message', 'persona prompt'],
  // Frameworks
  ['langchain', 'lang chain', 'lc'],
  ['langgraph', 'lang graph'],
  ['llm', 'large language model', 'large language models', 'foundation model'],
  // Structured output
  ['json', 'structured output', 'structured outputs', 'schema', 'structured generation'],
  // Routing / cost
  ['router', 'routing', 'model routing', 'model selection'],
  ['cost', 'costs', 'spend', 'pricing', 'token cost', 'bill'],
  // Streaming
  ['stream', 'streaming', 'sse', 'server-sent events'],
  // Long-context models
  ['long context', 'long-context', 'large context', '100k context', 'million token'],
  // Classical ML / deep learning
  ['lstm', 'long short-term memory', 'recurrent network', 'rnn'],
  ['stm', 'short-term memory'],
  ['transformer', 'transformers', 'attention', 'self-attention'],
  ['diffusion', 'diffusion model', 'stable diffusion', 'image generation'],
  ['rlhf', 'reinforcement learning from human feedback'],
  ['rl', 'reinforcement learning'],
  ['grpo', 'group relative policy optimization'],
  ['ppo', 'proximal policy optimization'],
  ['trpo', 'trust region policy optimization'],
  ['gan', 'generative adversarial network'],
  ['vae', 'variational autoencoder', 'variational autoencoders'],
  // Retrieval quality
  ['rerank', 'reranking', 'reranker', 'rerankers', 'cross-encoder'],
  ['hybrid search', 'hybrid retrieval', 'bm25 + embeddings'],
  ['dense retrieval', 'dpr', 'semantic search'],
  ['keyword search', 'lexical search', 'sparse retrieval'],
  // Agents tooling
  ['tool calling', 'function calling', 'tools', 'tool use'],
  ['mcp server', 'mcp servers', 'model context protocol server'],
  ['a2a', 'agent to agent', 'agent-to-agent', 'agent communication'],
  ['hitl', 'human in the loop', 'human-in-the-loop'],
  // Production
  ['observability', 'monitoring', 'tracing', 'traces', 'logging'],
  ['ragas', 'rag evaluation'],
  ['graphrag', 'graph rag', 'knowledge graph rag'],
  ['text2sql', 'text-to-sql', 'text to sql', 'nl2sql', 'natural language to sql'],
  ['pptx', 'powerpoint'],
  ['pdf', 'pdfs', 'pdf parsing'],
  ['ui', 'user interface', 'frontend'],
  ['ceo', 'chief executive officer'],
  ['api', 'apis', 'rest api'],
  ['ci/cd', 'ci cd', 'continuous integration'],
  ['tdd', 'test driven development', 'test-driven development'],
  ['prompt engineering', 'prompt craft'],
  ['agent memory', 'agent memories', 'agents memory'],
  ['hitl approval', 'human approval'],
];

const normalize = (s) =>
  s.toLowerCase().trim().replace(/\s+/g, ' ');

/** term (normalized) -> { members: string[], soft: boolean } */
export function buildSynonymLookup(groups = SYNONYM_GROUPS) {
  const lookup = new Map();
  for (const group of groups) {
    const terms = Array.isArray(group) ? group : group.terms;
    const soft = !Array.isArray(group) && group.soft === true;
    const members = [...new Set(terms.map(normalize))];
    for (const m of members) {
      const existing = lookup.get(m);
      if (existing) {
        existing.members = [...new Set([...existing.members, ...members])];
        existing.soft = existing.soft && soft;
      } else {
        lookup.set(m, { members: [...members], soft });
      }
    }
  }
  return lookup;
}

/** Generic filler words stripped from queries before matching. */
export const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
  'how', 'do', 'does', 'did', 'should', 'can', 'could', 'would', 'will',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its', 'this', 'that',
  'i', 'my', 'me', 'we', 'our', 'you', 'your', 'us',
  'what', 'which', 'when', 'why', 'who', 'whom',
  'things', 'thing', 'way', 'ways', 'get', 'got',
  'about', 'into', 'from', 'by', 'as', 'if', 'then', 'so', 'not', 'no', 'yes',
  'there', 'here', 'them', 'they', 'their', 'these', 'those', 'am', 'pm',
  'please', 'tell', 'explain', 'show', 'work', 'works', 'working',
]);

/** Split a query (or text) into normalized searchable tokens. */
export function tokenize(text) {
  if (!text) return [];
  return normalize(String(text))
    .split(/[^\p{L}\p{N}+#]+/u)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ''))
    .filter(Boolean);
}

/**
 * Expand a raw query into ordered token groups.
 * Each group is { tokens: string[] } where tokens[0] is the original token
 * and the rest are synonym additions. Multi-word synonyms collapse the
 * matching consecutive tokens into a single group (longest match first).
 *
 * Returns { groups, keptTokens, droppedTokens }.
 */
export function expandQuery(rawQuery, lookup = buildSynonymLookup()) {
  const all = tokenize(rawQuery);
  const groups = [];
  const droppedTokens = [];
  let i = 0;
  while (i < all.length) {
    // Longest-phrase match: try 4-gram down to 1-gram against the lookup
    let matchedLen = 0;
    let matchedEntry = null;
    for (let len = Math.min(4, all.length - i); len >= 1; len--) {
      const phrase = all.slice(i, i + len).join(' ');
      const entry = lookup.get(phrase);
      if (entry) {
        matchedLen = len;
        matchedEntry = entry;
        break;
      }
    }
    if (matchedLen > 0) {
      const phrase = all.slice(i, i + matchedLen).join(' ');
      // OR-clause uses single-token members only; other multi-word members
      // are dropped (MiniSearch has no true phrase matching — including
      // them would OR in unrelated docs). The typed phrase itself, when
      // multi-token, is kept as a nested AND.
      const singles = matchedEntry.members.filter((m) => !m.includes(' '));
      groups.push({
        tokens: singles,
        phrase: matchedLen > 1 ? phrase : null,
        soft: matchedEntry.soft,
      });
      i += matchedLen;
    } else {
      const tok = all[i];
      if (STOP_WORDS.has(tok)) {
        droppedTokens.push(tok);
      } else {
        const entry = lookup.get(tok);
        groups.push(
          entry
            ? {
                tokens: [...new Set(entry.members.filter((m) => !m.includes(' ')))],
                phrase: null,
                soft: entry.soft,
              }
            : { tokens: [tok], phrase: null, soft: false }
        );
      }
      i += 1;
    }
  }
  // Never drop everything (e.g. query "the") — fall back to raw tokens
  if (groups.length === 0 && all.length > 0) {
    for (const tok of all) groups.push({ tokens: [tok], phrase: null, soft: false });
  }
  return { groups, keptTokens: groups.map((g) => g.phrase || g.tokens[0] || ''), droppedTokens };
}

/** Escape a term for MiniSearch's Lucene-style query parser. */
function escapeTerm(t) {
  return t.replace(/([\\"()])/g, '\\$1');
}

function groupToClause(g) {
  const terms = g.tokens.filter(Boolean).map((t) => escapeTerm(t));
  if (g.phrase) {
    const nested = g.phrase.split(' ').map(escapeTerm).join(' AND ');
    terms.push(`(${nested})`);
  }
  if (terms.length === 0) return '';
  if (terms.length === 1) return terms[0];
  return `(${terms.join(' OR ')})`;
}

/**
 * Build MiniSearch query strings with synonym OR-groups.
 *
 * Hard (content) groups are AND-ed together with an explicit `AND`, so the
 * search options must NOT pass combineWith (it would override the operators).
 * Soft groups (common mitigation verbs) return as a separate `softQuery`
 * used only to boost docs that already match the content terms.
 *
 * e.g. "stop hallucinations" →
 *   query:     (hallucination OR hallucinations OR ...)
 *   softQuery: (stop OR prevent OR avoid OR ...)
 */
export function buildSearchQuery(rawQuery, lookup = buildSynonymLookup()) {
  const { groups } = expandQuery(rawQuery, lookup);
  const hard = groups.filter((g) => !g.soft);
  const soft = groups.filter((g) => g.soft);
  const clauseOf = (gs) => gs.map(groupToClause).filter(Boolean).join(' AND ');
  const query = clauseOf(hard.length ? hard : soft);
  const softClause = clauseOf(soft);
  const softQuery = hard.length && soft.length ? softClause : '';
  return { query, softQuery, groups };
}
