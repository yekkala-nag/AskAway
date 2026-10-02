/**
 * Prompt library — curated seed prompts + user CRUD.
 * Search/filter are pure functions; persistence uses the localStorage
 * adapter pattern (in-memory fallback under Node for tests).
 */
const USER_KEY = 'askaway_prompt_library_v1';

export const LIBRARY_CATEGORIES = ['Writing', 'Analysis', 'Coding', 'Research', 'Operations', 'Learning'];

export const SEED_PROMPTS = [
  { id: 'seed_brief', title: 'Decision brief', category: 'Analysis', tags: ['decision', 'stakeholder', 'summary'], framework: 'PACT', bestFor: 'Turning messy inputs into a one-page recommendation', text: 'Act as a decision analyst. Context: [situation]. Audience: [stakeholders who decide]. Task: produce a one-page brief with options considered, recommendation, and the one risk that would change your mind. Constraints: no hedging; state a single recommendation. Output: bullets under Options / Recommendation / Killer risk.' },
  { id: 'seed_postmortem', title: 'Blameless postmortem', category: 'Operations', tags: ['incident', 'timeline', 'learning'], framework: 'RISE', bestFor: 'Extracting timeline and fixes after an outage', text: 'Write a blameless postmortem. Context: [incident summary]. Reconstruct the timeline in order (first anomalous signal → detection → mitigation → resolution). For each step note what the system did vs what humans observed. Root cause section must distinguish trigger from contributing factors. End with concrete, assigned action items. Output: Timeline / Root cause / Action items.' },
  { id: 'seed_codereview', title: 'Strict code review', category: 'Coding', tags: ['review', 'correctness', 'security'], framework: 'Reflexion', bestFor: 'Finding real defects, not style nits', text: 'Review the diff below as a senior engineer. Priority order: 1) correctness bugs, 2) security issues (injection, authz, secrets), 3) data loss risks, 4) performance regressions. Do not comment on formatting. For each finding give file:line, the failure scenario, and a minimal fix. If you find nothing in a category, say so explicitly. Output: numbered findings, then a verdict (approve / request changes).' },
  { id: 'seed_extract', title: 'Structured extraction', category: 'Analysis', tags: ['json', 'schema', 'extraction'], framework: 'Meta-Prompting', bestFor: 'Pulling fields from unstructured text', text: 'Extract information from the text below into JSON only — no prose before or after. Schema: {"entities":[{"name":string,"type":string}], "dates":[{"iso":string,"what":string}], "open_questions":[string]}. If a field is unknown, use an empty list rather than guessing. Text: [paste]' },
  { id: 'seed_lesson', title: 'Lesson plan in 3 levels', category: 'Learning', tags: ['teaching', 'scaffold', 'eli5'], framework: 'Few/Zero/One-Shot', bestFor: 'Explaining a topic for mixed-level audiences', text: 'Teach me [topic]. Start with a 5-line intuition a beginner can repeat back. Then the same idea at practitioner level with the key vocabulary. Then the expert-level caveats where the simple story breaks. For each level give one concrete example and one common misconception. Do not skip the misconceptions.' },
  { id: 'seed_research', title: 'Claim-first research plan', category: 'Research', tags: ['evidence', 'sources', 'skepticism'], framework: 'Generated Knowledge', bestFor: 'Checking whether a claim actually holds', text: 'Treat "[claim]" as unproven. List the three strongest pieces of evidence for it, then the three strongest against, with the weakest link in each chain marked. State what evidence would change your assessment. Do not average the two sides into a wishy-washy middle — state current best judgment with confidence level. Output: For / Against / What would change my mind / Judgment.' },
  { id: 'seed_email', title: 'Short async update', category: 'Writing', tags: ['email', 'status', 'concise'], framework: 'CO-STAR', bestFor: 'Weekly status updates that get read', text: 'Draft a status update for [audience]. Situation: one line of context. Task: what you need from them, if anything. Objective: the decision or awareness you want. Style: under 150 words, no filler openers, no apology padding. Result: end with owners and dates as bullets. If nothing is needed from the reader, end with "FYI only".' },
  { id: 'seed_testplan', title: 'Test plan from requirements', category: 'Coding', tags: ['testing', 'coverage', 'edges'], framework: 'Least-to-Most', bestFor: 'Deriving test cases from a spec', text: 'Given this requirement: [text]. Derive a test plan in three passes: 1) happy path cases, 2) boundary values with exact numbers, 3) failure modes (bad input, timeout, permission denied, partial failure). Each case: name, precondition, action, expected result. Mark any requirement that is too ambiguous to test as BLOCKED with the question to ask the author. Output: table with Pass / Case / Expected.' },
];

function getUserStore() {
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return {
        read() { try { return JSON.parse(localStorage.getItem(USER_KEY) || '[]'); } catch (e) { return []; } },
        write(list) { localStorage.setItem(USER_KEY, JSON.stringify(list)); },
      };
    }
  } catch (e) { /* fall through */ }
  return { read: () => memPrompts.slice(), write: (list) => { memPrompts = list.slice(); } };
}
let memPrompts = [];

export function listPrompts(includeSeeds = true) {
  const user = getUserStore().read();
  return includeSeeds ? [...SEED_PROMPTS, ...user] : user;
}

export function getPrompt(id) {
  return listPrompts().find((p) => p.id === id) || null;
}

export function saveUserPrompt({ id, title, category, tags, framework, bestFor, text }) {
  const t = String(text || '').trim();
  if (!t) throw new Error('prompt-text-required');
  const entry = {
    id: id || `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: String(title || '').trim() || t.slice(0, 40),
    category: LIBRARY_CATEGORIES.includes(category) ? category : 'Writing',
    tags: Array.isArray(tags) ? tags.map(String) : [],
    framework: framework || null,
    bestFor: String(bestFor || '').trim(),
    text: t,
    userOwned: true,
    updatedAt: Date.now(),
  };
  const user = getUserStore().read();
  const idx = user.findIndex((p) => p.id === entry.id);
  if (idx >= 0) user[idx] = { ...user[idx], ...entry };
  else user.push(entry);
  getUserStore().write(user);
  return entry;
}

export function deleteUserPrompt(id) {
  const user = getUserStore().read();
  const next = user.filter((p) => p.id !== id);
  getUserStore().write(next);
  return next.length !== user.length;
}

/** Pure search: token AND-match over title/text/tags/bestFor with optional filters. */
export function searchPrompts(all, query, { category = '', tag = '' } = {}) {
  const q = String(query || '').trim().toLowerCase();
  const tokens = q ? q.split(/\s+/) : [];
  return (all || []).filter((p) => {
    if (category && p.category !== category) return false;
    if (tag && !(p.tags || []).includes(tag)) return false;
    if (!tokens.length) return true;
    const hay = `${p.title} ${p.text} ${(p.tags || []).join(' ')} ${p.bestFor || ''} ${p.framework || ''}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}

export function listTags(all) {
  const set = new Set();
  for (const p of all || []) for (const t of p.tags || []) set.add(t);
  return [...set].sort();
}

export function clearUserPrompts() { getUserStore().write([]); }
