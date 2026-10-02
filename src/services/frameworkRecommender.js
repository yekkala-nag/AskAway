/**
 * Framework recommender — deterministic keyword classification over the
 * 30-item library. Rule-based and explainable: every recommendation cites
 * the matched signals. No model calls.
 */
import { FRAMEWORKS, getFramework } from './frameworkLibrary.js';

const TASK_TYPES = [
  { type: 'writing', label: 'Writing', keywords: ['write', 'blog', 'essay', 'article', 'post', 'story', 'copy', 'content', 'draft', 'email', 'marketing', 'novel', 'poem'], frameworks: ['CO-STAR', 'CREATE', 'Emotion Prompting'] },
  { type: 'coding', label: 'Coding', keywords: ['code', 'function', 'debug', 'bug', 'refactor', 'program', 'script', 'implement', 'api', 'sql', 'algorithm', 'compile'], frameworks: ['CoT / ToT', 'Least-to-Most', 'Reflexion'] },
  { type: 'research', label: 'Research', keywords: ['research', 'investigate', 'literature', 'survey', 'evidence', 'sources', 'find out', 'explore'], frameworks: ['Generated Knowledge', 'Self-Ask', 'Step-Back'] },
  { type: 'analysis', label: 'Analysis', keywords: ['analy', 'compare', 'evaluate', 'assess', 'review', 'audit', 'metrics', 'tradeoff', 'trade-off', 'pros', 'cons'], frameworks: ['CLEAR', 'STAR', 'Step-Back'] },
  { type: 'planning', label: 'Planning', keywords: ['plan', 'roadmap', 'strategy', 'schedule', 'milestone', 'project', 'itinerary', 'organize'], frameworks: ['TAG', 'Least-to-Most', 'Skeleton-of-Thought'] },
  { type: 'tutoring', label: 'Tutoring', keywords: ['teach', 'learn', 'explain', 'tutorial', 'lesson', 'student', 'understand', 'eli5'], frameworks: ['Few/Zero/One-Shot', 'RTF', 'Generated Knowledge'] },
  { type: 'design', label: 'Design', keywords: ['design', 'brainstorm', 'ideas', 'logo', 'ui', 'poster', 'creative', 'innovate'], frameworks: ['CREATE', 'Graph-of-Thoughts', 'Directional Stimulus'] },
  { type: 'decision', label: 'Decision support', keywords: ['decide', 'decision', 'choose', 'options', 'stakeholder', 'should i', 'recommend'], frameworks: ['PACT', 'STAR', 'Contrastive'] },
  { type: 'agents', label: 'Agent development', keywords: ['agent', 'tool', 'workflow', 'automate', 'pipeline', 'multi-step', 'rag', 'search'], frameworks: ['ReAct', 'Active-Prompt', 'Constitutional'] },
];

const TIER_TRADEOFF = {
  Foundation: 'Fast and low-overhead; less control over structure.',
  Structured: 'Balanced control and effort for most professional work.',
  Advanced: 'Most powerful but heavier: more tokens, more setup — overkill for simple asks.',
};

const SIMPLER_ALTERNATIVE = {
  'RASCEF': 'TRACE', 'CoT / ToT': 'TAG', 'Least-to-Most': 'TAG', 'ReAct': 'TAG',
  'Active-Prompt': 'TAG', 'Constitutional': 'CLEAR', 'Graph-of-Thoughts': 'CREATE',
  'Prompt Chaining': 'TAG', 'Self-Consistency': 'STAR', 'Skeleton-of-Thought': 'TAG',
  'Step-Back': 'CLEAR', 'Reflexion': 'RISE', 'Self-Ask': 'Generated Knowledge',
};

function tokenize(text) {
  return String(text || '').toLowerCase();
}

export function classifyTask(text) {
  const t = tokenize(text);
  const out = [];
  for (const tt of TASK_TYPES) {
    const matched = tt.keywords.filter((k) => {
      try {
        return new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t);
      } catch (e) {
        return t.includes(k);
      }
    });
    if (matched.length) out.push({ type: tt.type, label: tt.label, score: matched.length, matched });
  }
  out.sort((a, b) => b.score - a.score || a.type.localeCompare(b.type));
  return out;
}

export function recommendFrameworks(taskText, options = {}) {
  const limit = Math.max(1, Math.min(5, options.limit || 3));
  const text = String(taskText || '');
  const types = classifyTask(text);
  const seen = new Set();
  const recs = [];
  for (const tt of types) {
    const def = TASK_TYPES.find((d) => d.type === tt.type);
    for (const name of def.frameworks) {
      if (seen.has(name)) continue;
      const fw = getFramework(name);
      if (!fw) continue;
      seen.add(name);
      recs.push({
        name: fw.a,
        tier: fw.tier,
        score: tt.score,
        reasons: [
          `Detected ${def.label.toLowerCase()} task (matched: ${tt.matched.slice(0, 3).join(', ')})`,
          `Suited for ${fw.b}`,
        ],
        tradeoffs: TIER_TRADEOFF[fw.tier] || TIER_TRADEOFF.Structured,
        simplerAlternative: SIMPLER_ALTERNATIVE[fw.a] || null,
      });
      if (recs.length >= limit) break;
    }
    if (recs.length >= limit) break;
  }
  if (!recs.length) {
    for (const name of ['TAG', 'TRACE', 'Meta-Prompting']) {
      const fw = getFramework(name);
      if (fw) recs.push({
        name: fw.a, tier: fw.tier, score: 0,
        reasons: ['No strong task signals — starting simple is the honest default', `Suited for ${fw.b}`],
        tradeoffs: TIER_TRADEOFF[fw.tier],
        simplerAlternative: null,
      });
    }
  }
  return { recommendations: recs.slice(0, limit), detectedTypes: types.map((t) => t.type), fallback: recs.length > 0 && types.length === 0 };
}

export function listTaskTypes() {
  return TASK_TYPES.map((t) => ({ type: t.type, label: t.label }));
}
