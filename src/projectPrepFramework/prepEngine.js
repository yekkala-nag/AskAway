// ============================================================================
// PROJECT PREPARATION FRAMEWORK ENGINE (Mike Huls — Solve the Right Problem)
// Agentic AI: reduce uncertainty while change is cheap; 6 docs, reversibility
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Text
// ============================================================================

export const FRAMEWORK_STEPS = [
  {
    n: 1, id: "pid", doc: "PID.md", title: "Business Prerequisites",
    question: "Are we solving the right problem?",
    purpose: "Align on business problem, scope, users, goals, success metrics. Engineers read it to understand the 'why'.",
    warStory: "The Webhook — customer urgently needed a 'webhook'. Team built it flawlessly. Customer actually needed an API and didn't know what a webhook was.",
    lesson: "Customer owns the problem, you own the solution. A short goals interview catches it in minutes.",
    produces: ["problem statement", "in/out of scope", "users & stakeholders", "goals + success metrics"],
    reversibility: "low",
    agentRisk: "Fleet builds the wrong product 10x faster"
  },
  {
    n: 2, id: "discovery", doc: "discovery-report.md", title: "IT Prerequisites",
    question: "Can we solve this inside the existing landscape?",
    purpose: "Surface data, systems, dependencies, feasibility, risks and constraints before code depends on them.",
    warStory: "The Real-Time Dashboard — sprints building real-time processing. Source only produced a batch every 12h. Product worked, couldn't plug in.",
    lesson: "Fail early: don't 'build a train for an organisation with no railroads'.",
    produces: ["systems & data inventory", "feasibility verdict", "constraints & risks", "integration touchpoints"],
    reversibility: "low",
    agentRisk: "Agents generate integrations against systems that can't deliver"
  },
  {
    n: 3, id: "functional", doc: "functional-requirements.md", title: "Functional Requirements",
    question: "What must the solution accomplish?",
    purpose: "Define capabilities, users, behaviour, frequency and scope. User stories carry who/how/how-often.",
    warStory: "Essential Automation — 100+ hours automating a 10-min/month manual task, plus a UI nobody wanted. Users were developers who wanted an API.",
    lesson: "Ferrari vs bicycle: understand user, usage and frequency before opening an IDE.",
    produces: ["capability list", "user stories", "frequency/volume", "explicit non-goals"],
    reversibility: "medium",
    agentRisk: "Gold-plating at agent speed on unused paths"
  },
  {
    n: 4, id: "technical", doc: "technical-requirements.md", title: "Technical Requirements",
    question: "How do we make it real — and what is expensive to reverse?",
    purpose: "Turn business + IT + functional into deliberate technical choices. Tie every decision to 'if wrong, cost to change?'",
    warStory: "Database Open-Heart Surgery — chose Postgres as team default. Domain model varied per customer and changed often. Migration was painful, not because Postgres is bad but because the decision preceded domain understanding.",
    lesson: "Right tool = fit to problem + evolution, not familiarity. Architecture happens before build, not during.",
    produces: ["architecture + data contracts", "decision log with reversal cost", "system boundaries", "NFRs (perf, security, compliance)"],
    reversibility: "high",
    agentRisk: "Wrong data contract copied into every agent-generated change"
  },
  {
    n: 5, id: "governance", doc: "governance.md", title: "Governance",
    question: "Who does what, who decides, who is responsible?",
    purpose: "Make decision structure explicit for build/launch/operate. RACI + escalation so disagreement leads to a call, not limbo.",
    warStory: "Around in Circles — critical design change circulated weeks across 3 teams, each assuming another owned approval. Deadline passed before owner found.",
    lesson: "A RACI matrix or one ownership meeting beats weeks of inbox limbo.",
    produces: ["RACI matrix", "escalation path", "approval gates", "comms cadence"],
    reversibility: "medium",
    agentRisk: "Parallel agents blocked or shipping unapproved decisions"
  },
  {
    n: 6, id: "roadmap", doc: "roadmap.md", title: "Planning",
    question: "When, in what order, by whom?",
    purpose: "Break into small tasks with clear outcomes, dependencies, owners, sequencing so humans + agents work in parallel without pile-ups.",
    warStory: "A Hot Mess — everyone started at once. Two devs built on an undesigned API; another integrated an interface that later changed. Stop, undo, redo.",
    lesson: "Map who-needs-what-from-whom first. Small tasks with explicit dependencies unblock parallel work.",
    produces: ["sequenced backlog", "dependency map", "owners + milestones", "validation checkpoints"],
    reversibility: "medium",
    agentRisk: "Fleet queues behind one undesigned bottleneck"
  }
];

export const WHEN_TO_USE_TRIGGERS = [
  { id: "coord", label: "Multiple stakeholders / teams must coordinate", weight: 2 },
  { id: "ambig", label: "Problem or desired outcome is ambiguous", weight: 2 },
  { id: "landscape", label: "Solution depends on existing systems / data / constraints", weight: 2 },
  { id: "irreversible", label: "Architectural or data decisions expensive to reverse", weight: 3 },
  { id: "parallel", label: "Several people or AI agents work in parallel", weight: 2 },
  { id: "damage", label: "Mistake risks financial / compliance / reputational damage", weight: 3 },
  { id: "rework", label: "Project large enough that rework hurts materially", weight: 1 }
];

export const REVERSIBILITY_GUIDE = [
  { decision: "Button label / copy tweak", reverseCost: "Trivial — decide fast, adjust later", scrutiny: "Minimal" },
  { decision: "Prompt wording in one isolated agent", reverseCost: "Low — version + re-eval one agent", scrutiny: "Light" },
  { decision: "Chunking / retrieval defaults", reverseCost: "Medium — re-index + re-eval retrieval", scrutiny: "Moderate" },
  { decision: "Data contract / schema / system boundary", reverseCost: "High — migration + downstream rewrites", scrutiny: "Deep" },
  { decision: "Autonomous decision authority (who decides?)", reverseCost: "Very high — legal, safety, trust rework", scrutiny: "Deepest" }
];

export const RACI_EXAMPLE = [
  { decision: "Problem scope (PID)", R: "Product lead", A: "Sponsor", C: "Engineering, Legal", I: "All teams" },
  { decision: "Data contract choice", R: "Data architect", A: "CTO", C: "Domain owners", I: "Agent platform team" },
  { decision: "Human-in-the-loop policy", R: "AI lead", A: "CISO / Legal", C: "Case workers", I: "Ops" },
  { decision: "Release / rollout gate", R: "Delivery lead", A: "Sponsor", C: "QA, Security", I: "Support" }
];

export const CASE_WALKTHROUGH = [
  { step: "Business", surprise: "Not 'automate decisions' but 'cut manual prep, keeper stays in charge'", doc: "PID.md" },
  { step: "IT", surprise: "Source docs inconsistent; identity model constrains design", doc: "discovery-report.md" },
  { step: "Functional", surprise: "Scope cut to classify + summarise + trace; autonomous deciding dropped", doc: "functional-requirements.md" },
  { step: "Technical", surprise: "Human-in-the-loop + traceability built in from day one", doc: "technical-requirements.md" },
  { step: "Governance", surprise: "'Can AI decide this?' has a named owner before production", doc: "governance.md" },
  { step: "Planning", surprise: "Doc-quality assumptions validated before scaling team", doc: "roadmap.md" }
];

// ── Simulator: readiness score ──────────────────────────────────────────────
export const SCORE_READINESS = (activeTriggerIds = [], agentFleet = 1, parallelPeople = 2) => {
  const weightSum = WHEN_TO_USE_TRIGGERS.filter(t => activeTriggerIds.includes(t.id))
    .reduce((a, t) => a + t.weight, 0);
  const maxWeight = WHEN_TO_USE_TRIGGERS.reduce((a, t) => a + t.weight, 0);
  const scaleBonus = Math.min(4, (agentFleet >= 5 ? 2 : 0) + (parallelPeople >= 4 ? 2 : 0));
  const score = Math.min(100, Math.round((weightSum / maxWeight) * 100 + scaleBonus * 3));
  let verdict = "Skip — change is small and reversible";
  let depth = "No framework docs needed.";
  if (score >= 65) {
    verdict = "Full framework justified — cost of wrong direction is high";
    depth = "Write all 6 docs; validate PID + discovery before any agent fleet work.";
  } else if (score >= 35) {
    verdict = "Lite pass — a few pages of decisions";
    depth = "Write PID + discovery + decisions log; keep functional/technical to 1 page each.";
  }
  const wastedMultiplier = agentFleet <= 1 ? 1 : Math.min(10, agentFleet);
  return {
    score, verdict, depth, weightSum, maxWeight,
    fleetAmplification: `A wrong assumption fans out ~${wastedMultiplier}x with ${agentFleet} agent(s) in parallel.`,
    triggersHit: activeTriggerIds.length
  };
};

// ── Simulator: reversal-cost estimator ──────────────────────────────────────
export const ESTIMATE_REVERSAL = (kind = "contract", stageFound = "production") => {
  const base = { copy: 1, prompt: 3, retrieval: 8, contract: 25, autonomy: 60 }[kind] ?? 10;
  const stageMult = { blueprint: 1, build: 4, production: 10 }[stageFound] ?? 4;
  const costUnits = base * stageMult;
  return {
    kind, stageFound, costUnits,
    message: `Fixing a '${kind}'-class decision in ${stageFound} costs ~${costUnits}x vs catching it on the blueprint.`,
    advice: stageFound === "blueprint"
      ? "Cheapest point — update the doc and re-align."
      : "Expensive point — this is why steps 1–4 exist before implementation."
  };
};

export const PYTHON_PREP_CODE = `# ============================================================================
# PROJECT PREPARATION FRAMEWORK — SCAFFOLD 6 DOCS + RACI + READINESS SCORE
# ============================================================================
from dataclasses import dataclass, field
from pathlib import Path

DOCS = ["PID.md", "discovery-report.md", "functional-requirements.md",
        "technical-requirements.md", "governance.md", "roadmap.md"]

TRIGGER_WEIGHTS = {"coord": 2, "ambig": 2, "landscape": 2, "irreversible": 3,
                   "parallel": 2, "damage": 3, "rework": 1}

def readiness(triggers: list[str], agent_fleet: int = 1) -> dict:
    s = sum(TRIGGER_WEIGHTS.get(t, 0) for t in triggers)
    m = sum(TRIGGER_WEIGHTS.values())
    score = min(100, round(s / m * 100) + (3 if agent_fleet >= 5 else 0))
    verdict = ("FULL framework" if score >= 65 else
               "LITE pass" if score >= 35 else "SKIP — reversible change")
    return {"score": score, "verdict": verdict,
            "fleet_amplification": f"~{min(10, max(1, agent_fleet))}x rework if direction wrong"}

@dataclass
class RACI:
    decision: str
    responsible: str
    accountable: str
    consulted: str = ""
    informed: str = ""

def scaffold(outdir: str = "prep"):
    Path(outdir).mkdir(exist_ok=True)
    for d in DOCS:
        p = Path(outdir) / d
        if not p.exists():
            p.write_text(f"# {d}\\n\\n> Decision log — update when later discovery invalidates it.\\n")
    print("Scaffolded:", DOCS)
    print(readiness(["ambig", "parallel", "irreversible"], agent_fleet=6))

if __name__ == "__main__":
    scaffold()
`;
