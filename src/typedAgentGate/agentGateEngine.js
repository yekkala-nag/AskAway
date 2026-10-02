// ============================================================================
// TYPED TOOLS, HARD BOUNDS & DOWNSTREAM COMPOSER GATE ENGINE
// Implementation of the 8-Tool Semantic Contract,
// 80-Line Bounded Loop, Composer Gate Refusal, and Escalation Architecture
// ============================================================================

export const THE_EIGHT_TYPED_TOOLS = [
  {
    name: "search_evidence",
    signature: "search_evidence(query: str, top_k: int = 5)",
    domain: "Exact Source Text",
    description: "Retrieves verbatim source document clauses, exact numerical amounts, and textual citations.",
    exampleCall: "search_evidence('roof inspection age threshold 2025', top_k=3)",
    returns: "List[EvidenceChunk] with document_id, text, chunk_index, validity_range"
  },
  {
    name: "search_knowledge",
    signature: "search_knowledge(query: str, top_k: int = 5)",
    domain: "Curated Understanding",
    description: "Retrieves curated organizational concepts, policy decisions, entity definitions, and known business rules.",
    exampleCall: "search_knowledge('underwriting roof guidelines policy change', top_k=3)",
    returns: "List[ConceptObject] with concept_id, summary, owner, status"
  },
  {
    name: "resolve_entity",
    signature: "resolve_entity(mention: str)",
    domain: "Canonical Identity",
    description: "Maps a noisy string mention or synonym to its single canonical organizational entity ID before graph traversal.",
    exampleCall: "resolve_entity('H3 Homeowners Product')",
    returns: "EntityRef with entity_id: 'ENT_PROD_H3', canonical_name, confidence"
  },
  {
    name: "traverse",
    signature: "traverse(entity_id: str, relation_types: List[str], as_of: str, hops: int = 2)",
    domain: "Graph Relationships",
    description: "Walks typed, time-valid relationship edges up to 2 hops around an entity as of a specific historical date.",
    exampleCall: "traverse('ENT_PROD_H3', ['GOVERNED_BY', 'SUPERSEDES'], as_of='2026-03-01', hops=2)",
    returns: "GraphNeighborhood with nodes, typed edges, validity_windows"
  },
  {
    name: "timeline",
    signature: "timeline(entity_id: str)",
    domain: "Temporal Evolution",
    description: "Retrieves the complete chronological lifecycle and state evolution history of a concept or policy.",
    exampleCall: "timeline('POLICY_ROOF_INSPECTION')",
    returns: "List[TimelineEvent] sorted by effective_date"
  },
  {
    name: "diff",
    signature: "diff(entity_id: str, from_date: str, to_date: str)",
    domain: "Windowed Changes",
    description: "Computes the exact semantic delta and rule modifications between two historical timestamps.",
    exampleCall: "diff('POLICY_ROOF_INSPECTION', from_date='2025-06-01', to_date='2026-03-01')",
    returns: "SemanticDiff with added_clauses, removed_clauses, modified_thresholds"
  },
  {
    name: "list_contradictions",
    signature: "list_contradictions(entity_id: str = None, scope: str = None)",
    domain: "Disagreement & Governance",
    description: "Checks if the organization has registered open, unresolved contradictions or conflicting policies for an entity.",
    exampleCall: "list_contradictions(entity_id='POLICY_WATER_DAMAGE')",
    returns: "List[Contradiction] with position_a, position_b, sources, status: 'UNRESOLVED'"
  },
  {
    name: "get_source",
    signature: "get_source(source_id: str)",
    domain: "Full Document Context",
    description: "Retrieves complete document metadata, effective dates, author, and surrounding context, not just a chunk.",
    exampleCall: "get_source('DOC_UNDERWRITING_MEMO_2026')",
    returns: "SourceDocument with full_text, publication_date, author, scope"
  }
];

export const BENCHMARK_ABLATION_DATA = [
  {
    metric: "Single-Hop Questions Correctness",
    systemA_fixed: "95.0% (Fast & Accurate)",
    systemB_searchOnly: "68.0% (Hallucinates)",
    systemC_typedAgent: "70.0% (Over-investigates)",
    winner: "System A (Fixed Fused Pipeline)"
  },
  {
    metric: "Multi-Hop Counterfactual Reasoning",
    systemA_fixed: "42.0% (Misses 2nd hop)",
    systemB_searchOnly: "48.0% (Keyword mismatch)",
    systemC_typedAgent: "88.0% (Traverses & compares)",
    winner: "System C (8-Tool Governed Agent)"
  },
  {
    metric: "Contradiction Refusal Rate",
    systemA_fixed: "100.0% (Injected in context)",
    systemB_searchOnly: "15.0% (Blown through to be helpful)",
    systemC_typedAgent: "100.0% (Composer Gate Enforced)",
    winner: "System A & System C (Gated)"
  },
  {
    metric: "Avg Token Cost per Query",
    systemA_fixed: "1.2k tokens ($0.003)",
    systemB_searchOnly: "4.8k tokens ($0.012)",
    systemC_typedAgent: "5.1k tokens ($0.014)",
    winner: "System A (4x cheaper for single-hop)"
  }
];

export const ESCALATION_SIGNALS = [
  {
    signal: "Sequential Dependency",
    detector: "Regex / AST Query Analyzer detects multi-stage questions ('Did X who filed under rule Y qualify for Z?')",
    action: "Escalate immediately to 8-Tool Agent Lane"
  },
  {
    signal: "Temporal Span / Counterfactual",
    detector: "Query references multiple dates or retrospective policy shifts ('under the March rule vs prior rule')",
    action: "Escalate to 8-Tool Agent Lane for `timeline` + `diff`"
  },
  {
    signal: "Insufficient Flag Returned",
    detector: "Fixed pipeline retrieval returns confidence < 0.65 or explicit `insufficient=True` flag",
    action: "Escalate to Agent Lane to explore alternative graph neighborhoods"
  },
  {
    signal: "Default Single-Hop Traffic",
    detector: "Standard factual lookup with unambiguous entity grounding ('What is the deductible for Plan B?')",
    action: "Keep in Default Fixed Fused Pipeline (95% accuracy, 4x cheaper)"
  }
];

export const PYTHON_BOUNDED_LOOP_SCRIPT = `# ============================================================================
# PRODUCTION 80-LINE BOUNDED AGENT LOOP + DOWNSTREAM COMPOSER GATE
# Enforces outer hard bounds, auditable trace, and non-negotiable refusal gate
# ============================================================================

from typing import List, Dict, Any

MAX_ROUNDS = 8
MAX_TOKENS = 6000
TIMEOUT_SECONDS = 15.0

class BoundedAgentLoop:
    def __init__(self, model_client, tools_registry, composer_gate):
        self.model = model_client
        self.tools = tools_registry
        self.composer = composer_gate

    def run(self, question: str) -> Dict[str, Any]:
        trace = []
        history = [
            {"role": "system", "content": "You are a governed investigative agent. Use typed tools."},
            {"role": "user", "content": question}
        ]
        rounds = 0
        total_tokens = 0
        bound_tripped = None

        # ── 80-LINE TEXTBOOK LOOP WITH HARD OUTER BOUNDS ───────────────────
        while rounds < MAX_ROUNDS:
            rounds += 1
            reply = self.model.chat(messages=history, tools=self.tools.schemas())
            total_tokens += reply.usage.total_tokens

            # Bound enforcement outside the model
            if total_tokens >= MAX_TOKENS:
                bound_tripped = "MAX_TOKEN_BUDGET_EXCEEDED"
                break

            if not reply.tool_calls:
                # Model believes it has sufficient evidence
                break

            # Execute parallel typed tool calls
            for call in reply.tool_calls:
                result = self.tools.execute(call.name, **call.arguments)
                digest = result.get_digest()
                trace.append({
                    "round": rounds,
                    "tool": call.name,
                    "args": call.arguments,
                    "digest": digest,
                    "insufficient": result.insufficient
                })
                history.append({"role": "tool", "tool_call_id": call.id, "content": result.to_json()})

        # ── DOWNSTREAM COMPOSER GATE (GOVERNANCE OUTSIDE THE LOOP) ─────────
        # The composer owns the final answer and independently checks contradictions
        final_answer = self.composer.finalize(
            question=question,
            draft=reply.content if not bound_tripped else None,
            trace=trace,
            bound_tripped=bound_tripped
        )

        return {
            "answer": final_answer.text,
            "refusal_enforced": final_answer.refusal_enforced,
            "trace": trace,
            "rounds_used": rounds,
            "total_tokens": total_tokens
        }
`;
