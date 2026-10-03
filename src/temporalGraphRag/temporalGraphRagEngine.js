// ── Temporal Graph RAG: knowledge as (S, P, O, t) quads — data & pure logic ──

const DAY = 24 * 60 * 60 * 1000;

export function daysBetween(earlier, later) {
  return Math.round((Date.parse(later) - Date.parse(earlier)) / DAY);
}

// Recency weight: 0.5 ^ (age_days / half_life_days); future facts cap at 1.0
export function recencyWeight(factDate, queryDate, halfLifeDays) {
  const age = daysBetween(factDate, queryDate);
  if (age < 0) return 1.0;
  return Math.pow(0.5, age / halfLifeDays);
}

// Static facts (no meaningful change date) — treated as always available
export const FACTS = [
  { subject: 'Company', predicate: 'FOUNDED_IN', object: 'San Francisco', date: '2010-05-01', static: true },
  { subject: 'Company', predicate: 'CEO', object: 'Alice', date: '2021-01-15' },
  { subject: 'Company', predicate: 'CEO', object: 'Bob', date: '2023-11-17' },
  { subject: 'Company', predicate: 'CEO', object: 'Charlie', date: '2023-11-19' },
  { subject: 'Company', predicate: 'CEO', object: 'Bob', date: '2023-11-21' },
];

// Traditional (timeless) retrieval: every CEO fact at once
export function naiveRetrieve(facts, subject, predicate) {
  return facts
    .filter((f) => f.subject === subject && f.predicate === predicate)
    .map((f) => ({ ...f, naiveScore: 1 }));
}

// Temporal retrieval: only facts that existed at query time, ranked by recency
export function temporalRetrieve(facts, subject, predicate, queryDate, halfLifeDays) {
  return facts
    .filter((f) => f.subject === subject && f.predicate === predicate && !f.static)
    .filter((f) => f.date <= queryDate)
    .map((f) => ({ ...f, weight: recencyWeight(f.date, queryDate, halfLifeDays) }))
    .sort((a, b) => b.weight - a.weight || (a.date < b.date ? 1 : -1));
}

// Same list including static facts (weights still decay unless marked static)
export function temporalRetrieveAll(facts, queryDate, halfLifeDays) {
  return facts
    .filter((f) => f.date <= queryDate)
    .map((f) => ({
      ...f,
      weight: f.static ? 1.0 : recencyWeight(f.date, queryDate, halfLifeDays),
    }))
    .sort((a, b) => b.weight - a.weight);
}

// Was Bob really the CEO on the query date? Answered by interval logic, not similarity
export function wasFactTrue(facts, predicate, object, queryDate) {
  const starts = facts
    .filter((f) => f.predicate === predicate && f.object === object && !f.static)
    .map((f) => f.date)
    .filter((d) => d <= queryDate)
    .sort();
  if (starts.length === 0) return false;
  const successor = facts
    .filter((f) => f.predicate === predicate && !f.static && f.date > starts[starts.length - 1])
    .map((f) => f.date)
    .sort();
  return successor.length === 0 || successor[0] > queryDate;
}

export const QUAD_EXAMPLE = {
  triple: '(Company, CEO, Alice)',
  problem: 'True forever? False after 2021-01-15, true again after… never — the same triple is right on one date and wrong on another.',
  quad: '(Company, CEO, Alice, 2021-01-15)',
  meaning: 'Alice became CEO on this date — a fact that starts, rather than a fact that always was.',
  naiveFailure: [
    'A vector search over “Who is the CEO?” returns all four CEO records at once — Alice, Bob, Charlie, Bob again — with nothing to say which one answers the question.',
    'Answering with the “most similar” text picks a fact, not a fact-at-a-time.',
  ],
};

export const PIPELINE = [
  { n: 1, step: 'Store knowledge as quads', detail: 'Subject → predicate → [(object, date)] — every edge carries its timestamp' },
  { n: 2, step: 'Filter by query date', detail: 'Facts that had not happened yet are not candidates, no matter how similar they look' },
  { n: 3, step: 'Score by recency', detail: 'weight = 0.5 ^ (age_days / half_life_days); older evidence decays smoothly' },
  { n: 4, step: 'Rank and take top facts', detail: 'Sort descending by weight; feed the winners into the prompt' },
  { n: 5, step: 'Answer through the 3-tiered Graph-RAG', detail: 'Deterministic graph reasoning — temporal retrieval is upstream of it, not a replacement' },
];

export const HALF_LIFE_LESSON = {
  at365: 'With a 365-day half-life, the three mid-November CEO facts sit within 0.97–0.99 of each other — the ranking is technically correct but tells you almost nothing about which fact is current.',
  at7: 'With a 7-day half-life, the same facts spread across 0.25–0.37 and the chaotic week separates cleanly: the most recent appointment wins by a wide margin.',
  guidance: 'Half-life is a domain parameter, not a default: personnel facts move on weeks, product facts on quarters, founding facts on years.',
};

export const FAILURE_MODES = [
  { mode: 'Future leakage', fails: 'A fact dated after the query slips in (an announcement, a successor’s appointment) and poisons the answer', fix: 'Hard filter date ≤ query before scoring' },
  { mode: 'Indefinite persistence', fails: 'The model treats “was CEO” as “is CEO” because both are the same text', fix: 'Represent starts explicitly; derive the valid interval' },
  { mode: 'Arbitrary half-life', fails: 'One global decay constant mis-ranks fast and slow domains alike', fix: 'Half-life per predicate / per domain' },
  { mode: 'Retrieval ≠ truth', fails: 'A top-weighted fact is still just retrieved text, not a verified claim', fix: 'Temporal retrieval feeds the deterministic Graph-RAG tiers — they verify' },
];

export const CODE_RETRIEVER = `# Temporal retrieval: date filter first, recency rank second.
def temporal_retrieve(facts, subject, predicate, query_date, half_life_days):
    candidates = [
        f for f in facts
        if f["subject"] == subject
        and f["predicate"] == predicate
        and f["date"] <= query_date          # facts that had happened yet
    ]
    for f in candidates:
        age = (query_date - f["date"]).days
        f["weight"] = 0.5 ** (age / half_life_days)
    return sorted(candidates, key=lambda f: f["weight"], reverse=True)

# future facts are capped at 1.0 rather than scored into the ranking:
# they are excluded from candidates, never merely down-weighted.`;

export const CODE_ANSWER = `# Answer = temporal top facts + deterministic 3-tiered Graph-RAG.
def answer(question, query_date, half_life_days=365):
    subject, predicate = parse_triple(question)          # (Company, CEO, ?)
    ranked = temporal_retrieve(KB, subject, predicate, query_date, half_life_days)
    top = ranked[:3]                                     # winners into the prompt

    return graph_rag_answer(                             # unchanged, deterministic
        question=question,
        evidence=[f["object"] for f in top],
        weights=[f["weight"] for f in top],
        explain=[
            f'{f["object"]} since {f["date"]} '
            f'(weight {f["weight"]:.4f} at {query_date})'
            for f in top
        ],
    )`;
