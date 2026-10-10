// ============================================================================
// REFACTOR HEALTH ENGINE — score anatomy, loop, methods, stop conditions
// Data + pure functions only. No JSX / window / document. Node-safe.
// Illustrative numbers only — teaching model, not a measurement claim.
// ============================================================================

export const TEAL = "#3A9B9F";
export const TEAL_DARK = "#1A6B6E";
export const PURPLE = "#5B4B8A";
export const RED = "#B4553A";
export const AMBER = "#B9821F";

export const WEIGHTS = { duplication: 0.4, deadCode: 0.35, complexity: 0.25 };

export const SUB_SCORES = [
  { key: "duplication", label: "Duplication", weight: 0.4, color: TEAL, what: "Same logic pasted in several places. Fix by collapsing to one shared helper." },
  { key: "deadCode", label: "Dead code", weight: 0.35, color: PURPLE, what: "Unreachable or never-called code. Fix by proving it is unused, then deleting." },
  { key: "complexity", label: "Complexity", weight: 0.25, color: AMBER, what: "Over-long branches and nesting. Fix by splitting hotspots into small units." },
];

export const GRADE_BANDS = [
  { band: "A", min: 90, note: "Healthy — keep the loop running." },
  { band: "B", min: 80, note: "Good — one weak sub-score to work." },
  { band: "C", min: 70, note: "Smells accumulating — schedule fixes." },
  { band: "D", min: 60, note: "Dragging — fix before adding features." },
  { band: "F", min: 0, note: "Stalled — stop and clean first." },
];

export function clampScore(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function healthScore(scores) {
  const d = clampScore(scores.duplication);
  const k = clampScore(scores.deadCode);
  const c = clampScore(scores.complexity);
  const raw = d * WEIGHTS.duplication + k * WEIGHTS.deadCode + c * WEIGHTS.complexity;
  return Math.round(raw * 10) / 10;
}

export function weakestLink(scores) {
  const entries = [
    ["duplication", clampScore(scores.duplication)],
    ["deadCode", clampScore(scores.deadCode)],
    ["complexity", clampScore(scores.complexity)],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

export function gradeBand(score) {
  const s = typeof score === "number" ? score : 0;
  for (const g of GRADE_BANDS) if (s >= g.min) return g.band;
  return "F";
}

export function gradeNote(score) {
  const b = gradeBand(score);
  return GRADE_BANDS.find((g) => g.band === b).note;
}

// ── The loop ────────────────────────────────────────────────────────────────
export const LOOP_STEPS = [
  { step: "1 · Measure", detail: "Run the same health scan on a clean worktree. Record the three sub-scores." },
  { step: "2 · Fix one thing", detail: "Pick the lowest sub-score. One logical change — collapse, delete, or split." },
  { step: "3 · Run tests", detail: "Full suite must stay green before anything is committed." },
  { step: "4 · Commit", detail: "One logical step per commit, so each commit is reviewable and revertable." },
  { step: "5 · Measure again", detail: "Re-scan with the same instrument. Score climbs while lines removed grows." },
];

export const COMMIT_TIMELINE = [
  { commit: "c1 baseline", score: 58, removed: 0, label: "measure" },
  { commit: "c2 collapse dup", score: 66, removed: 210, label: "fix one thing" },
  { commit: "c3 delete dead", score: 74, removed: 480, label: "fix one thing" },
  { commit: "c4 split hotspot", score: 81, removed: 560, label: "fix one thing" },
  { commit: "c5 tidy", score: 87, removed: 690, label: "measure again" },
];

// ── Methods + anti-gaming ───────────────────────────────────────────────────
export const METHODS = [
  { method: "Dead-code graph walk", rule: "Walk the call graph from entry points; anything unreachable is a delete candidate.", evidence: "Kept: reachability report + tests still green after deletion." },
  { method: "Complexity hotspot rule", rule: "Rank units by branch count; split the worst one first, not everything at once.", evidence: "Kept: before/after hotspot list from the same scan." },
  { method: "Duplication collapsing", rule: "Find repeated blocks, extract one shared helper, re-run callers through it.", evidence: "Kept: caller list pointing at the single helper." },
];

export const EVIDENCE_ROWS = [
  { kept: "Reachability report", proves: "Deletion was allowed — nothing reachable referenced it." },
  { kept: "Green suite per commit", proves: "Each deletion kept behavior intact." },
  { kept: "Same-instrument rescan", proves: "Score moved for a real reason, not a new ruler." },
  { kept: "One-step commits", proves: "Any step can be reverted alone." },
];

// Pure call-graph walk: adjacency map { fn: [callees] }, entryPoints [..] → sorted reachable list.
export function deadCodeWalk(graph, entryPoints) {
  const seen = new Set();
  const stack = [...entryPoints];
  while (stack.length) {
    const node = stack.pop();
    if (seen.has(node)) continue;
    seen.add(node);
    const next = (graph && graph[node]) || [];
    for (const n of next) if (!seen.has(n)) stack.push(n);
  }
  return [...seen].sort();
}

// Units: [{ name, branches }] → hotspot names strictly above threshold, worst first.
export function complexityHotspots(units, threshold) {
  return (units || [])
    .filter((u) => u.branches > threshold)
    .sort((a, b) => b.branches - a.branches)
    .map((u) => u.name);
}

// Snippets: [{ id, lines, copies }] → { totalDupLines, helpers } teaching calc.
export function collapseDuplication(snippets) {
  const rows = (snippets || []).map((s) => ({
    id: s.id,
    saved: s.lines * (s.copies - 1),
  }));
  const totalDupLines = rows.reduce((a, r) => a + r.saved, 0);
  return { rows, totalDupLines, helpers: rows.length };
}

// ── Stop conditions + hygiene ───────────────────────────────────────────────
export const STOP_RULES = [
  { stop: "Blocked by missing tests", meaning: "Legitimate stop — write the safety net before deleting anything." },
  { stop: "Score only goes up", meaning: "A score that can only go up is lying. A real instrument must be able to fall." },
  { stop: "Different ruler", meaning: "Same instrument before and after, or the comparison is void." },
  { stop: "Rewrite urge", meaning: "Refactoring is not a rewrite — small behavior-preserving steps only." },
];

export const SKILL_RULES = [
  { rule: "Test base first", why: "No green suite, no deletions." },
  { rule: "Small steps", why: "One smell per commit keeps review honest." },
  { rule: "Tests each step", why: "Run the suite after every single change." },
  { rule: "Separate commits", why: "One logical step per commit — revertable history." },
];

export function sameInstrumentCheck(beforeTool, afterTool) {
  return beforeTool === afterTool;
}

export const HEALTH_CHECK_CODE = `# Refactor-health loop (teaching sketch)
WEIGHTS = {"duplication": 0.4, "dead_code": 0.35, "complexity": 0.25}

def health_score(dup, dead, complexity):
    return round(dup * WEIGHTS["duplication"]
                 + dead * WEIGHTS["dead_code"]
                 + complexity * WEIGHTS["complexity"], 1)

def grade(score):
    if score >= 90: return "A"
    if score >= 80: return "B"
    if score >= 70: return "C"
    if score >= 60: return "D"
    return "F"

def dead_code_walk(graph, entries):
    seen, stack = set(), list(entries)
    while stack:
        node = stack.pop()
        if node in seen: continue
        seen.add(node)
        stack.extend(n for n in graph.get(node, []) if n not in seen)
    return sorted(seen)

# loop: measure -> fix one thing -> run tests -> commit -> measure again
# proving you were allowed to delete it is the work.
`;
