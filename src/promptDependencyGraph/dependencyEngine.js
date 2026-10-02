// ============================================================================
// PROMPT DEPENDENCY GRAPH ENGINE
// Reachable (structural ceiling) vs Candidate (section-aware eval set)
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

// ── Article ground truth: 55-node synthetic experiment (seed 7) ─────────────
export const ARTICLE_RESULTS = [
  { change: "base-policy / refunds", reachable: 45, candidate: 24, narrowing: 47, note: "sales-* reachable via privacy, excluded from refunds candidate" },
  { change: "tone / professional", reachable: 55, candidate: 55, narrowing: 0, note: "Universal component — honest 0%. No shortcut exists." },
  { change: "format / json", reachable: 55, candidate: 35, narrowing: 36, note: "Widely shared format block, partial narrowing" },
  { change: "base-policy / privacy", reachable: 45, candidate: 24, narrowing: 47, note: "Mirror of refunds case" },
  { change: "safety / no-medical-advice", reachable: 15, candidate: 13, narrowing: 13, note: "Narrow safety surface" }
];

export const SHARING_CURVE = [
  { sharing: "10%", sharedAgents: 5, reachable: 54, candidate: 8, narrowing: 85 },
  { sharing: "24%", sharedAgents: 12, reachable: 54, candidate: 15, narrowing: 72 },
  { sharing: "50%", sharedAgents: 25, reachable: 54, candidate: 29, narrowing: 46 },
  { sharing: "76%", sharedAgents: 38, reachable: 54, candidate: 43, narrowing: 20 },
  { sharing: "100% (tone)", sharedAgents: 50, reachable: 55, candidate: 55, narrowing: 0 }
];

export const VOCAB_TABLE = [
  { avoid: "Structural blast radius", use: "Reachable", why: "'Structural' over-claims precision of a ceiling" },
  { avoid: "Semantic blast radius", use: "Candidate", why: "Nothing semantic happens — just section diff + traversal" },
  { avoid: "Safe prompts", use: "Candidates for evaluation", why: "Skipping ≠ proven safe" },
  { avoid: "Unaffected prompts", use: "Outside candidate set", why: "Graph shows declared deps, not behaviour" },
  { avoid: "Broken prompts", use: "Potentially affected", why: "Graph never confirms behaviour — only eval does" },
  { avoid: "Evaluation reduction", use: "Evaluation narrowing", why: "'Reduction' implies a target; 'narrowing' describes mechanism" }
];

export const RUNTIME_TABLE = [
  { op: "Build graph (55 nodes, 5 components)", latency: "0.229 ms", notes: "avg of 200 builds, Py3.12 CPU" },
  { op: "compute_impact() single change", latency: "0.0375 ms", notes: "avg of 2,000 calls" },
  { op: "compute_impact() × 1,000", latency: "31.91 ms", notes: "single block, no caching" }
];

// ── Distilled interactive graph (8 agents + 3 workflows, mirrors article rules)
export const AGENTS = [
  { name: "support-core", role: "support", deps: [{ component: "base-policy", sections: ["refunds", "privacy"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }] },
  { name: "support-enterprise", role: "support", deps: [{ component: "base-policy", sections: ["refunds", "privacy", "escalation"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }, { component: "safety", sections: ["no-medical-advice"] }] },
  { name: "sales-core", role: "sales", deps: [{ component: "base-policy", sections: ["privacy"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["markdown"] }] },
  { name: "sales-enterprise", role: "sales", deps: [{ component: "base-policy", sections: ["privacy", "escalation"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }] },
  { name: "analyst-core", role: "analyst", deps: [{ component: "base-policy", sections: ["escalation"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }] },
  { name: "ops-core", role: "operations", deps: [{ component: "base-policy", sections: ["refunds", "escalation"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }, { component: "safety", sections: ["no-medical-advice"] }] },
  { name: "ops-enterprise", role: "operations", deps: [{ component: "base-policy", sections: ["refunds", "escalation"] }, { component: "tone", sections: ["professional"] }, { component: "format", sections: ["json"] }, { component: "safety", sections: ["no-medical-advice", "escalation-policy"] }] },
  { name: "marketing-core", role: "marketing", deps: [{ component: "tone", sections: ["professional"] }, { component: "format", sections: ["markdown"] }] }
];

export const WORKFLOWS = [
  { name: "refund-workflow", members: ["support-core", "ops-core", "sales-core"] },
  { name: "escalation-workflow", members: ["support-enterprise", "ops-enterprise", "analyst-core"] },
  { name: "onboarding-workflow", members: ["sales-enterprise", "marketing-core", "analyst-core"] }
];

export const CHANGE_OPTIONS = [
  { component: "base-policy", section: "refunds", v1: "refunds within 30 days", v2: "refunds within 14 days" },
  { component: "base-policy", section: "privacy", v1: "retain 90 days", v2: "retain 30 days" },
  { component: "tone", section: "professional", v1: "be concise", v2: "be warm + concise" },
  { component: "format", section: "json", v1: "strict JSON", v2: "strict JSON + schema v2" },
  { component: "safety", section: "no-medical-advice", v1: "refuse medical", v2: "refuse medical + dosage" }
];

// ── Graph mechanics (JS port of article's BFS) ──────────────────────────────
const directDependentsOfComponent = (component) =>
  new Set(AGENTS.filter(a => a.deps.some(d => d.component === component)).map(a => a.name));

const sectionDependents = (component, section) =>
  new Set(AGENTS.filter(a => a.deps.some(d => d.component === component && d.sections.includes(section))).map(a => a.name));

const downstreamOf = (seeds) => {
  const seen = new Set(seeds);
  const out = new Set(seeds);
  let frontier = [...seeds];
  while (frontier.length) {
    const next = [];
    for (const wf of WORKFLOWS) {
      if (!seen.has(wf.name) && wf.members.some(m => frontier.includes(m))) {
        seen.add(wf.name); out.add(wf.name); next.push(wf.name);
      }
    }
    frontier = next;
  }
  return out;
};

export const COMPUTE_IMPACT = (component, section) => {
  const direct = directDependentsOfComponent(component);
  const reachableAgents = [...direct];
  const reachable = new Set([...reachableAgents]);
  for (const wf of WORKFLOWS) {
    if (wf.members.some(m => reachable.has(m))) reachable.add(wf.name);
  }
  const seeds = [...sectionDependents(component, section)];
  const candidate = downstreamOf(seeds);
  const total = AGENTS.length + WORKFLOWS.length;
  const reachArr = [...reachable], candArr = [...candidate];
  const reachableNotCandidate = reachArr.filter(x => !candidate.has(x));
  const notReachable = [...AGENTS.map(a => a.name), ...WORKFLOWS.map(w => w.name)].filter(x => !reachable.has(x));
  const narrowing = reachable.size ? Math.round((1 - candidate.size / reachable.size) * 100) : 0;
  return { reachable: reachArr, candidate: candArr, reachableNotCandidate, notReachable, narrowing, total };
};

export const PYTHON_PROMPT_GRAPH_CODE = `# ============================================================================
# PROMPT DEPENDENCY GRAPH — REACHABLE vs CANDIDATE
# Pure-Python change impact analysis for composable prompts. Full repo:
# ============================================================================
from dataclasses import dataclass, field

@dataclass(frozen=True)
class PromptComponent:
    name: str
    version: int
    sections: dict  # section name -> text

@dataclass
class SectionDependency:
    component: str            # e.g. "base-policy"
    sections: list            # which sections this agent actually uses
    kind: str = "imports"     # imports | inherits | references | formats-with

@dataclass
class AgentConfig:
    name: str
    role: str = ""
    deps: list = field(default_factory=list)   # list[SectionDependency]
    def depends_on(self, component, sections, kind="imports"):
        self.deps.append(SectionDependency(component, sections, kind))
        return self

# ── Build the graph: component -> agents, agent -> workflows ────────────────
class DepGraph:
    def __init__(self):
        self.comp_to_agents: dict[str, set] = {}
        self.node_to_dependents: dict[str, set] = {}
    def add_agent(self, agent: AgentConfig, workflows: list[str] = ()):
        for d in agent.deps:
            self.comp_to_agents.setdefault(d.component, set()).add(agent.name)
        for w in workflows:
            self.node_to_dependents.setdefault(agent.name, set()).add(w)
    def direct_dependents(self, component: str) -> set:
        return set(self.comp_to_agents.get(component, set()))
    def structural_blast_radius(self, component: str) -> set:
        """Reachable: everything downstream (BFS over agent->workflow edges)."""
        affected, frontier = set(), set(self.direct_dependents(component))
        while frontier:
            affected |= frontier
            nxt = set()
            for name in frontier:
                nxt |= self.node_to_dependents.get(name, set())
            frontier = nxt - affected
        return affected
    def section_dependents(self, component: str, section: str, agents) -> set:
        return {a.name for a in agents
                if any(d.component == component and section in d.sections for d in a.deps)}

def changed_sections(old: PromptComponent, new: PromptComponent) -> list:
    if old.name != new.name:
        raise ValueError("comparing sections across two different components")
    changed = []
    for sec, old_text in old.sections.items():
        new_text = new.sections.get(sec)
        if new_text is None or old_text.strip() != new_text.strip():
            changed.append(sec)
    return changed

def compute_impact(graph: DepGraph, agents, old: PromptComponent, new: PromptComponent):
    changed = changed_sections(old, new)
    structural = graph.structural_blast_radius(old.name)          # Reachable
    candidate: set = set()
    for section in changed:
        seeds = graph.section_dependents(old.name, section, agents)
        frontier, seen = set(seeds), set(seeds)
        while frontier:                                           # extend downstream
            nxt = set()
            for name in frontier:
                nxt |= graph.node_to_dependents.get(name, set())
            nxt -= seen
            candidate |= nxt; seen |= nxt; frontier = nxt
        candidate |= seeds
    return {"changed": changed, "reachable": structural, "candidate": candidate}

# ── Demo: base-policy refunds 30d -> 14d ────────────────────────────────────
if __name__ == "__main__":
    g = DepGraph()
    agents = []
    s = AgentConfig("support-core"); s.depends_on("tone", ["professional"], "inherits")
    s.depends_on("base-policy", ["refunds", "privacy"], "imports"); agents.append(s)
    g.add_agent(s, workflows=["refund-workflow"])
    old = PromptComponent("base-policy", 1, {"refunds": "refunds within 30 days", "privacy": "retain 90 days"})
    new = PromptComponent("base-policy", 2, {"refunds": "refunds within 14 days", "privacy": "retain 90 days"})
    print(compute_impact(g, agents, old, new))
`;
