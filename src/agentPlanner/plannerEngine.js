// ============================================================================
// AGENT PLANNING PATTERNS ENGINE — ReAct vs Plan-Execute vs Reflexion vs ToT
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// Extended with: Dynamic Skill Composition (TDS) — skill graphs, context-aware
// skill retrieval, skill chaining, and skill evolution loops
// ============================================================================

export const PLANNER_PATTERNS = [
  { id: "react", name: "ReAct (reason+act loop)", trace: "Thought → Action → Observation × N", calls: "3–15 LLM", best: "Open-ended research, unknown tools needed", fail: "Loops without progress; needs step cap + progress check" },
  { id: "planexec", name: "Plan-Execute (plan then dispatch)", trace: "Plan → [parallel subtasks] → replan on drift", calls: "2–8 LLM", best: "Decomposable tasks with clear dependencies", fail: "Bad upfront plan poisons all branches" },
  { id: "reflexion", name: "Reflexion (self-critique)", trace: "Attempt → critique → retry (bounded)", calls: "4–12 LLM", best: "Code/reasoning tasks with verifiable outcome", fail: "Critic agrees with itself; needs external verifier" },
  { id: "tot", name: "Tree-of-Thoughts (branch+vote)", trace: "Branch k candidates → score → keep best", calls: "k× depth (expensive)", best: "Puzzles, high-stakes single decisions", fail: "Combinatorial cost; cap breadth aggressively" }
];

export const PLANNER_GUARDRAILS = [
  { guard: "Hard step cap", rule: "max_steps = 8–12; halt + escalate on breach", stops: "infinite loops" },
  { guard: "Progress monitor", rule: "No new information in 2 steps → replan or stop", stops: "token burn" },
  { guard: "Plan review gate", rule: "Plan-Execute plans need approval for irreversible tools", stops: "bad-plan blast radius" },
  { guard: "External verifier", rule: "Reflexion critic ≠ actor (tests, tools, second model)", stops: "self-congratulation" }
];

// ── Simulator: recommend a pattern ──────────────────────────────────────────
export const RECOMMEND_PLANNER = (decomposable = true, verifiable = true, stakes = "low", unknowns = "many") => {
  let pick = "react", why = "Unknowns dominate — interleave reasoning with tool use.";
  if (decomposable && unknowns === "few") { pick = "planexec"; why = "Clear decomposition + known tools — plan once, parallelise."; }
  if (verifiable && stakes !== "low" && !decomposable) { pick = "reflexion"; why = "Verifiable outcome rewards critique-retry cycles."; }
  if (stakes === "critical" && unknowns === "few") { pick = "tot"; why = "One critical decision — pay for branches, vote, keep best."; }
  const meta = PLANNER_PATTERNS.find(p => p.id === pick);
  return { pick: meta.name, why, trace: meta.trace, calls: meta.calls, caution: meta.fail };
};

export const PYTHON_PLANNER_CODE = `# ============================================================================
# PLANNER: bounded ReAct + Plan-Execute dispatcher with guardrails
# ============================================================================
MAX_STEPS, STALL_LIMIT = 10, 2

def react_loop(task: str, act, observe) -> dict:
    seen, stall = [], 0
    for step in range(MAX_STEPS):
        thought, action = act(task, seen)          # LLM: Thought + Action
        obs = observe(action)                      # tool result
        stall = stall + 1 if obs in seen else 0
        seen.append(obs)
        if done(obs): return {"status": "done", "steps": step + 1}
        if stall >= STALL_LIMIT: return {"status": "replan", "steps": step + 1}
    return {"status": "escalate", "steps": MAX_STEPS}

def plan_execute(task: str, plan, dispatch) -> dict:
    steps = plan(task)                             # LLM: full plan first
    if needs_approval(steps): request_approval(steps)
    results = [dispatch(s) for s in independent(steps)]
    drifted = [s for s in results if drift(s)]
    if drifted: return plan_execute(task, plan, dispatch)  # bounded replan
    return {"status": "done", "subtasks": len(steps)}

def needs_approval(steps) -> bool:
    return any(s.get("irreversible") for s in steps)
`;

// ============================================================================
// DYNAMIC SKILL COMPOSITION — From Static to Dynamic Skills (TDS Guide)
// Skill graphs, context-aware retrieval, chaining, and evolution loops
// ============================================================================

export const DYNAMIC_SKILL_ARCHITECTURE = [
  {
    component: "Skill Graph (Knowledge Base)",
    description: "Directed acyclic graph of skills with prerequisites, inputs/outputs, and success conditions. Each skill is a self-contained capability with pre/post conditions.",
    structure: "Nodes: skill_id, name, description, code/tool, preconditions, postconditions, confidence\nEdges: depends_on, enables, conflicts_with",
    example: "Skill: 'query_sql' requires 'connect_db' → enables 'analyze_results'",
    benefit: "Enables topological planning — agent discovers valid skill sequences automatically"
  },
  {
    component: "Context-Aware Skill Retrieval",
    description: "Embed skills + task context into shared vector space. Retrieve top-k relevant skills for current state, not all skills.",
    technique: "Dual encoder: skill(description + preconditions) + task(state + goal) → cosine similarity",
    reranking: "Cross-encoder on (task, skill) pairs for precision; filter by precondition satisfaction",
    benefit: "Scales to 1000s of skills; agent only sees relevant capabilities"
  },
  {
    component: "Skill Chaining & Composition",
    description: "Compose primitive skills into compound skills dynamically. Verified chains cached as new macro-skills.",
    mechanism: "Planner proposes chain → simulator validates preconditions → execute → if success, distill into macro-skill",
    caching: "Macro-skill stored with: name, sub-skills, aggregated pre/post conditions, empirical success rate",
    benefit: "Amortizes planning cost; builds hierarchy from primitives to complex workflows"
  },
  {
    component: "Skill Evolution Loop",
    description: "Continuous improvement: monitor skill success/failure → propose mutations → A/B test → promote or retire.",
    loop: "1. Log every skill invocation (context, outcome, latency, errors)\n2. Nightly: cluster failures → identify gaps\n3. LLM proposes new skills / fixes\n4. Shadow test on production traffic\n5. Promote if statistically significant improvement",
    safeguards: "Canary deployment, rollback on regression, human-in-loop for safety-critical skills",
    benefit: "System gets better autonomously; no manual skill engineering bottleneck"
  }
];

export const SKILL_RETRIEVAL_SIMULATOR = (taskContext = '', availableSkills = [], topK = 5) => {
  // Safe extraction of state set and raw text
  const contextStr = typeof taskContext === 'string' ? taskContext : (taskContext?.text || taskContext?.state || '');
  const stateList = Array.isArray(taskContext?.state)
    ? taskContext.state
    : typeof taskContext?.state === 'string'
      ? [taskContext.state]
      : [];

  // Simulated dual-encoder retrieval with precondition filtering
  const scored = (availableSkills || []).map(skill => {
    const semanticScore = Math.random() * 0.4 + 0.3; // 0.3-0.7 simulated cosine sim
    const preconds = skill.preconditions || [];
    const precondMet = preconds.length === 0 || preconds.every(p => {
      const pNorm = String(p).toLowerCase().replace(/_/g, ' ');
      return stateList.includes(p) || contextStr.toLowerCase().includes(pNorm);
    });
    const relevance = precondMet ? semanticScore : semanticScore * 0.3;
    return { ...skill, relevance: +relevance.toFixed(2), precondMet };
  });
  return scored
    .filter(s => s.relevance > 0.25)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, topK);
};

export const PYTHON_DYNAMIC_SKILLS_CODE = `# ============================================================================
# DYNAMIC SKILL COMPOSITION: Graph + Retrieval + Chaining + Evolution
# ============================================================================

from dataclasses import dataclass, field
from typing import Callable, Any
import numpy as np

@dataclass
class Skill:
    id: str
    name: str
    description: str
    executor: Callable[..., Any]          # actual tool/code
    preconditions: list[str] = field(default_factory=list)
    postconditions: list[str] = field(default_factory=list)
    confidence: float = 0.8               # empirical success rate
    embedding: np.ndarray = None          # dual-encoder embedding

    def can_execute(self, state: set[str]) -> bool:
        return all(p in state for p in self.preconditions)

    def apply(self, state: set[str]) -> set[str]:
        new_state = state | set(self.postconditions)
        return new_state

class SkillGraph:
    def __init__(self):
        self.skills: dict[str, Skill] = {}
        self.edges: dict[str, set[str]] = {}  # depends_on

    def add_skill(self, skill: Skill, depends_on: list[str] = None):
        self.skills[skill.id] = skill
        if depends_on:
            self.edges[skill.id] = set(depends_on)

    def topological_plan(self, goal_state: set[str], current_state: set[str]) -> list[Skill]:
        # Simplified: greedy forward-chaining from current state toward goal
        plan, state = [], set(current_state)
        while not goal_state.issubset(state):
            candidates = [s for s in self.skills.values()
                         if s.can_execute(state) and not s.postconditions.issubset(state)]
            if not candidates:
                raise ValueError("No applicable skill — goal unreachable")
            # Pick skill that maximizes progress toward goal
            best = max(candidates, key=lambda s: len(s.postconditions & goal_state))
            plan.append(best)
            state = best.apply(state)
        return plan

# 2. Context-Aware Retrieval (Dual Encoder)
class SkillRetriever:
    def __init__(self, encoder):  # encoder: (text) -> np.ndarray
        self.encoder = encoder
        self.skill_embeddings = {}

    def index_skills(self, skills: list[Skill]):
        for s in skills:
            text = f"{s.name}. {s.description}. Pre: {', '.join(s.preconditions)}"
            s.embedding = self.encoder(text)
            self.skill_embeddings[s.id] = s.embedding

    def retrieve(self, task_context: str, top_k: int = 5) -> list[Skill]:
        task_emb = self.encoder(task_context)
        scored = [(sid, float(task_emb @ emb)) for sid, emb in self.skill_embeddings.items()]
        scored.sort(key=lambda x: x[1], reverse=True)
        return [self.skills[sid] for sid, _ in scored[:top_k]]

# 3. Skill Chaining → Macro-Skill Distillation
def compose_macro_skill(graph: SkillGraph, skill_chain: list[Skill], name: str) -> Skill:
    all_pre = set()
    all_post = set()
    for s in skill_chain:
        all_pre |= set(s.preconditions)
        all_post |= set(s.postconditions)
    # Remove internal preconditions satisfied by chain
    internal = set()
    for s in skill_chain:
        internal |= set(s.postconditions)
    all_pre -= internal
    confidence = min(s.confidence for s in skill_chain)
    return Skill(
        id=f"macro_{name.lower().replace(' ', '_')}",
        name=name,
        description=f"Composed: {' → '.join(s.name for s in skill_chain)}",
        executor=lambda **kw: [s.executor(**kw) for s in skill_chain],
        preconditions=list(all_pre),
        postconditions=list(all_post),
        confidence=confidence,
    )

# 4. Evolution Loop (Pseudocode)
def evolution_step(graph: SkillGraph, logs: list[dict], llm_propose):
    # logs: {skill_id, context, success, latency, error}
    failures = [l for l in logs if not l['success']]
    clusters = cluster_by_error(failures)  # e.g., embedding of error messages
    for cluster in clusters:
        proposed = llm_propose(f"Fix failures: {cluster.errors}")
        new_skill = Skill(**proposed)
        # Shadow test
        if shadow_test(new_skill, logs) > 0.95 * baseline:
            graph.add_skill(new_skill)
`;
