// ============================================================================
// TABLES-IN-PDFS GRID ENGINE
// Diagnostic table_df_meta + 5 composable ops + dispatcher + question modulator
// Responsible AI & Security Compliant: Zero PII / synthetic demo tables only
// ============================================================================

export const REPRESENTATION_LEVELS = [
  { id: "A", name: "Row-as-line in line_df", shape: "Markdown pipe rows, _type='table', bbox kept", when: "Default. Answer reads like prose ('deductible for property coverage?'). Most mixed-content tables stop here.", example: "| property | CA | 1200 |" },
  { id: "B", name: "Separate table_df", shape: "Headers = columns, rows = rows; line_df keeps pointer by id", when: "Need 2D ops: multi-page concat, column projection, row filtering. Columns addressable, not just visible.", example: "table_df[['coverage','state','premium']]" },
  { id: "C", name: "Columnar extraction (typed)", shape: "Named + typed columns (policy_number, premium_amount:decimal), indexed by doc/table id", when: "Recurring stable-shape tables across docs. Unlocks corpus SQL: total premiums, joins, aggregates.", example: "SELECT SUM(premium) … (DuckDB/Parquet/Postgres)" },
  { id: "D", name: "Columnar but heterogeneous", shape: "Single text column + metadata (doc_id, page, table_id); grid gone", when: "Honest fallback: wanted C, schemas resisted normalisation. Keep retrieval + FTS.", example: "doc-level retrieval, no 2D addressing" }
];

export const DIAGNOSTIC_FIELDS = [
  { field: "Parse quality", values: ["perfect (clean grid, consistent counts)", "partial (irregular grid, bboxes known)", "failed (rectangles only / scanned / OCR w/o structure)"], drives: "O1 vs O5; parser escalation" },
  { field: "Size (n_rows, n_cols)", values: ["fits LLM context w/ overhead → projection optional", "exceeds budget → O3 mandatory"], drives: "O3 projection" },
  { field: "Header status", values: ["present (first row = header)", "absent", "continuation (real header on earlier page)"], drives: "O2 header propagation" },
  { field: "Multi-page continuity", values: ["autonomous (same page)", "continued-from-N", "continues-to-M (geometric: same cols, x ±5px, headerless)"], drives: "O2 concatenation" },
  { field: "Document context (table-area ratio)", values: ["6% CMO · 13% · 26% NIST … ~50%+ → stop doing RAG-on-text, switch to SQL-on-tables"], drives: "A/B vs C architecture" }
];

export const OPERATIONS = [
  { id: "O1", name: "Structural reconstruction from positions", pre: "parse=partial + word bboxes available", does: "Cluster x into column bands + y gaps into row bands; snap cells to grid. Recovers e.g. dropped Commodity label column.", cost: "1 geometric pass/page ≈ free", fail: "Merged/irregular cells defeat grid → O5" },
  { id: "O2", name: "Multi-page concat + header propagation", pre: "continued-from-N / continues-to-M", does: "Walk run, copy header to continuations, emit one table_df + source_page provenance.", cost: "cheap", fail: "Without it: 200 rows/8pp → 8 orphans, 7 headerless" },
  { id: "O3", name: "Question-driven projection", pre: "size > context budget", does: "Project columns matching concept_keywords + filter rows matching scope_filters (Article 6/17 pattern at table level).", cost: "cheap", fail: " projecting a broken parse picks right year, wrong row" },
  { id: "O4", name: "Columnar extraction (B→C or B→D)", pre: "recurring known-shape tables / table-dominant doc", does: "Lift to typed store; route later questions to SQL agent. C on common schema, D when schemas resist.", cost: "ingestion lift", fail: "Cross-doc joins need schema alignment (future work)" },
  { id: "O5", name: "Vision-LLM fallback", pre: "O1 failed or parse=failed from start", does: "Render page region → vision LLM → JSON table. ≥10x cost of O1 — fallback, never default.", cost: "$$$$", fail: "Cost compounds across long docs" }
];

export const QUESTION_TYPES = [
  { type: "Cell lookup", q: "Premium for property coverage in California?", path: "O1→O2→O3 → 1 row → cite cell rect on source page", cite: "cell + page bbox" },
  { type: "Range / column", q: "Deductibles for all coverage types?", path: "Project columns → return slice as small markdown table", cite: "table-level" },
  { type: "Aggregate", q: "Total premium across all states?", path: "Do NOT retrieve — route to SQL agent: SELECT SUM(premium) … → LLM interprets scalar", cite: "SQL + result" }
];

export const REAL_EXAMPLES = [
  { doc: "NIST CSF v1.1 (55pp, 28 tables, 26% tabular)", diag: "p30–32 partial/over-split (4 cols → 8) · p33+ perfect + continued ~20pp, Function/Category blank on continuations", fix: "O1 fold 8→4, O2 forward-fill + concat → 1 table_df (~100 subcategories). Else PR.AC-3 loses Protect→IAM ancestry." },
  { doc: "World Bank CMO Oct-2025 (66pp, 38 tables, 6%)", diag: "p17 Price Forecasts 42×14: numeric block clean, Commodity label column dropped (first cell empty every row)", fix: "O1 recover labels via left-margin clustering, O3 project (wheat, 2027). O3-alone gets year right, row wrong." },
  { doc: "Attention Is All You Need, Table 3 (13 cols)", diag: "Fitz: failed (13 cols → 3 multi-line cells). Azure DI: perfect 13 cols incl. sparse cells", fix: "Parser choice ≥ op choice. Cheap parser first, escalate hard tables/pages (Art.10 cascade). Azure/page-cost ≪ wrong ablation answer." }
];

export const SAMPLE_PREMIUM_TABLE = [
  { coverage: "property", state: "CA", premium: 1200, deductible: 500 },
  { coverage: "property", state: "TX", premium: 950, deductible: 500 },
  { coverage: "liability", state: "CA", premium: 2100, deductible: 0 },
  { coverage: "auto", state: "CA", premium: 780, deductible: 250 }
];

// ── Dispatcher simulator ────────────────────────────────────────────────────
export const DISPATCH = ({ parse = "partial", size = "large", header = "continuation", continuity = "continued-from-N", ratio = 26, question = "cell" }) => {
  const ops = [];
  const reasons = [];
  if (parse === "partial") { ops.push("O1"); reasons.push("O1: partial grid + bboxes → rebuild columns/rows geometrically"); }
  if (parse === "failed") { ops.push("O5"); reasons.push("O5: parse failed → vision-LLM fallback (expensive, last resort)"); }
  if (continuity !== "autonomous" || header === "continuation") { ops.push("O2"); reasons.push("O2: continuation run → propagate header + concat with source_page"); }
  if (size === "large") { ops.push("O3"); reasons.push("O3: exceeds context → project columns + filter rows from question scope"); }
  if (ratio >= 50) { ops.push("O4"); reasons.push("O4: table-dominant doc → promote to columnar store, SQL-agent answers"); }
  const composition = ops.length ? ops.join(" → ") : "Level A suffices — no ops (clean small autonomous table)";
  const level = ops.includes("O4") ? "C (or D if schemas resist)" : ops.length ? "B (operated table_df)" : "A (row-as-line)";
  const answer = question === "cell" ? "Cell lookup → 1 cell + cell-rect citation"
    : question === "column" ? "Column slice → small markdown table + table citation"
      : "Aggregate → SQL agent (SELECT …) + query citation, no passage retrieval";
  const audit = ["diagnostic table_df_meta row", ...reasons, `level=${level}`, `answer=${answer}`];
  return { ops, composition, level, answer, audit };
};

export const RUN_TABLE_PROJECTION = (stateFilter = "CA", coverageFilter = "property") => {
  const flat = SAMPLE_PREMIUM_TABLE.map(r => `| ${r.coverage} | ${r.state} | ${r.premium} | ${r.deductible} |`).join("\n");
  const rows = SAMPLE_PREMIUM_TABLE.filter(r =>
    (!stateFilter || r.state === stateFilter) && (!coverageFilter || r.coverage === coverageFilter));
  const projected = rows.map(r => ({ coverage: r.coverage, state: r.state, premium: r.premium }));
  return {
    flattenedChars: flat.length,
    flattenedRows: SAMPLE_PREMIUM_TABLE.length,
    projectedRows: projected,
    sql: `SELECT coverage, state, premium FROM schedule WHERE state = '${stateFilter}' AND coverage = '${coverageFilter}';`,
    cellAnswer: projected.length ? `premium = ${projected[0].premium} (coverage=${coverageFilter}, state=${stateFilter})` : "no matching row"
  };
};

export const PYTHON_TABLE_GRID_CODE = `# ============================================================================
# TABLES IN PDFs: DIAGNOSTIC + 5 COMPOSABLE OPS + DISPATCHER
# Pattern: diagnostic table_df_meta -> compose [O1..O5] -> question modulator
# ============================================================================
from dataclasses import dataclass, field

@dataclass
class TableMeta:
    table_id: str
    parse_quality: str      # perfect | partial | failed
    n_rows: int; n_cols: int
    header: str             # present | absent | continuation
    continuity: str         # autonomous | continued-from-N | continues-to-M
    table_area_ratio: float # 0..100 document-level

def diagnose(meta: TableMeta, context_budget_cells: int = 2000) -> dict:
    needs_O1 = meta.parse_quality == "partial"
    needs_O5 = meta.parse_quality == "failed"
    needs_O2 = meta.continuity != "autonomous" or meta.header == "continuation"
    needs_O3 = meta.n_rows * meta.n_cols > context_budget_cells
    needs_O4 = meta.table_area_ratio >= 50
    return {"O1": needs_O1, "O5": needs_O5, "O2": needs_O2, "O3": needs_O3, "O4": needs_O4}

def dispatch(meta: TableMeta, question_type: str) -> dict:
    flags = diagnose(meta)
    ops = [o for o in ["O1", "O2", "O3", "O4", "O5"] if flags[o]]
    # canonical order: reconstruct -> concat -> project; O4 promotion; O5 fallback
    order = {"O1": 0, "O2": 1, "O3": 2, "O4": 3, "O5": 4}
    ops = sorted(ops, key=lambda o: order[o])
    level = "C-or-D" if "O4" in ops else ("B" if ops else "A")
    answer = {"cell": "1 cell + bbox citation",
              "column": "markdown slice + table citation",
              "aggregate": "SQL agent + query citation"}[question_type]
    return {"ops": ops, "level": level, "answer": answer,
            "audit": [f"{meta.table_id}: {meta.parse_quality}/{meta.header}/{meta.continuity}"] + ops}

# O1/O2/O3 are local pandas/geometric passes; O5 renders page->vision LLM->JSON.
# O4 lifts table_df into Parquet/DuckDB/Postgres with NAMED+TYPED columns.

if __name__ == "__main__":
    nist = TableMeta("nist-core", "partial", 100, 4, "continuation", "continued-from-33", 26)
    print(dispatch(nist, "cell"))   # -> O1 -> O2 (+O3 if over budget)
`;
