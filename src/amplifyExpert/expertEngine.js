// ============================================================================
// AMPLIFY THE EXPERT ENGINE (EDI manifesto M1)
// Thesis, two camps, ML-decade parallel, 4 conditions, 3 disciplines,
// 4 bricks, 6 counter-positions
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const THESIS = "Build RAG that amplifies enterprise experts working with their own documents — not general document intelligence that replaces them.";

export const TWO_CAMPS = [
  { camp: "IT camp", builds: "Opaque vector pipeline nobody can explain", trusts: "Cosine similarity" },
  { camp: "Expert camp", builds: "Ctrl+F + TOC, precise but unscalable", trusts: "Known vocabulary" },
  { camp: "The bridge", builds: "Expert method (keywords→TOC) scaled by LLM", trusts: "Auditable retrieval" }
];

export const FOUR_CONDITIONS = [
  { cond: "Known document context", test: "Fixed classes: contracts, records, filings?" },
  { cond: "Accessible experts", test: "Can you sit with underwriters/users?" },
  { cond: "Amplification goal", test: "Expert stays after shipping?" },
  { cond: "Auditability required", test: "Must cite, trace, reproduce?" }
];

export const THREE_DISCIPLINES = [
  { d: "Expertise-driven", rule: "Ships iff it builds on expert wisdom", test: "Would the underwriter recognize it?" },
  { d: "Pyramidal engineering", rule: "4 bricks → named functions → one sitting trace", test: "New hire traces input→output reading code alone?" },
  { d: "Relational junctions", rule: "Tables between bricks, never string-soup", test: "line_df, toc_df, question_df, typed answers?" }
];

export const FOUR_BRICKS = [
  { brick: "Parsing", mirrors: "First-read scan", amplifies: "Once, kept forever (misses never recover)" },
  { brick: "Question parsing", mirrors: "Ctrl+F reflex", amplifies: "Co-occurrence + dictionary expansion" },
  { brick: "Retrieval", mirrors: "30-hit triage", amplifies: "Anchor/scope/context kept apart" },
  { brick: "Generation", mirrors: "Faithful restatement", amplifies: "Typed schema + citations, never drift" }
];

export const SIX_POSITIONS = [
  { if: "Experts know keywords", then: "Vector store = fallback, not foundation" },
  { if: "Embeddings find synonyms", then: "Discovery into the dictionary, not per-call retriever" },
  { if: "Filters use expert vocab", then: "Reranker has no leftover work" },
  { if: "Experts must audit", then: "Deterministic dispatcher, not agent loops" },
  { if: "Corpus is business-specific", then: "Structure at ingestion; don't vectorize noise" },
  { if: "Questions route by type", then: "Not chunk sweeps/finetunes (wrong toolkit)" }
];

// ── Simulator: does the thesis apply? ───────────────────────────────────────
export const CHECK_FIT = (known = true, experts = true, amplify = true, audit = true) => {
  const got = [known, experts, amplify, audit].filter(Boolean).length;
  return {
    score: `${got}/4`,
    verdict: got === 4 ? "BUILD THIS WAY — all conditions hold; the six positions follow."
      : got === 3 ? "Mostly — name the missing condition's cost explicitly."
      : "DIFFERENT STANCE — open-domain/general/agentic fits better; don't force it.",
    note: "The thesis is strong exactly because it admits where it doesn't apply."
  };
};

export const PYTHON_MANIFEST_CODE = `# ============================================================================
# AMPLIFY-THE-EXPERT GATE: four conditions decide the architecture
# ============================================================================
def fits_thesis(known_docs: bool, experts: bool, amplify: bool, audit: bool) -> str:
    score = sum([known_docs, experts, amplify, audit])
    if score == 4:
        return "ENTERPRISE-RAG: keywords->TOC, deterministic dispatch, tables"
    if score == 3:
        return "MOSTLY: name the missing condition's cost in the design doc"
    return "GENERAL-STACK: open retrieval + agents; audit sacrificed knowingly"

# Pyramidal check: can a new hire trace input->output reading code in one
# sitting? Tables at every junction (line_df, toc_df, question_df)?
`;
