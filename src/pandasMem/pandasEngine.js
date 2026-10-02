// ============================================================================
// PANDAS MEMORY ENGINE (7 techniques)
// inplace, usecols, dtype downgrade/category/sparse, dtype-at-read, chunks
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const TECHNIQUES = [
  { n: 1, name: "Inplace assignment", saves: "~2x (no copy)", rule: "inplace=True iff intermediate is useless", caveat: "Mutates input — never when caller needs original" },
  { n: 2, name: "usecols (read subset)", saves: "137→15MB (~9x) + 4x faster", rule: "Preview 5 rows, list interests, then load", caveat: "Dropped columns are gone — confirm scope first" },
  { n: 3, name: "Downcast ints/floats", saves: "~50% per column", rule: "min-max analysis → smallest fitting type", caveat: "Overflow silently wraps — bound-check" },
  { n: 4, name: "object → category", saves: "~75% on repeats", rule: "nunique ≪ nrows → astype('category')", caveat: "High-cardinality gets worse, not better" },
  { n: 5, name: "Sparse for NaN-heavy", saves: "~% of NaN share (~40%)", rule: "Sparse[float/int/str] past ~30% NaN", caveat: "Dense ops densify — know your downstream" },
  { n: 6, name: "dtype at read time", saves: "Peak RAM (never materialize fat)", rule: "dtype={col: type} from data dictionary", caveat: "Wrong guess = parse errors; verify" },
  { n: 7, name: "chunksize streaming", saves: "Fits anything (one chunk resident)", rule: "Process per chunk, aggregate", caveat: "No global ops (groupby splits across chunks)" }
];

// Baseline: 25 cols × 100k rows demo frame ≈ 137MB (article's number)
export const MEMORY_PLAN = (rowsK = 100, cols = 25, catPct = 40, nanPct = 20, use = [1, 2, 3, 4, 5, 6]) => {
  const base = rowsK * 1.37; // scaled from the 137MB reference
  let mb = base;
  const applied = [];
  const eff = {
    1: () => { mb *= 0.55; return "inplace: no ghost copy"; },
    2: () => { mb *= 0.25; return "usecols: load interests only"; },
    3: () => { mb *= 0.75; return "downcast numerics"; },
    4: () => { mb *= (1 - (catPct / 100) * 0.6); return `category on ${catPct}% cols`; },
    5: () => { mb *= (1 - (nanPct / 100) * 0.4); return `sparse on ${nanPct}% NaN`; },
    6: () => { mb *= 0.9; return "dtype-at-read: skip fat peak"; }
  };
  [1, 2, 3, 4, 5, 6].forEach(k => { if (use.includes(k)) applied.push(eff[k]()); });
  return {
    baseMB: +base.toFixed(1), optMB: +mb.toFixed(1),
    savedPct: base ? Math.round((1 - mb / base) * 100) : 0,
    applied,
    verdict: mb < base * 0.3 ? "Lean frame — chunking (#7) only if still OOM." : "Still heavy — add chunksize streaming for the tail."
  };
};

export const PYTHON_PANDAS_CODE = `# ============================================================================
# PANDAS MEMORY: the seven, composed
# ============================================================================
import pandas as pd
import numpy as np

# #2 + #6: subset + dtypes AT READ (peak never materializes fat frame)
df = pd.read_csv("dummy_dataset.csv",
                 usecols=["Employee_ID", "First_Name", "Salary", "Rating", "Company"],
                 dtype={"Employee_ID": "int32", "Company": "category"})

# #3/#4/#5: post-load tightening
def tighten(df: pd.DataFrame) -> pd.DataFrame:
    for c in df.select_dtypes("int64"):
        df[c] = pd.to_numeric(df[c], downcast="integer")     # min-max fit
    for c in df.select_dtypes("float64"):
        df[c] = pd.to_numeric(df[c], downcast="float")
    for c in df.select_dtypes("object"):
        if df[c].nunique() / len(df) < 0.05:
            df[c] = df[c].astype("category")                 # repeats only!
        elif df[c].isna().mean() > 0.3:
            df[c] = df[c].astype(pd.SparseDtype(df[c].dtype))
    return df

# #1: inplace when the intermediate is useless; #7: chunksize when OOM anyway
for chunk in pd.read_csv("huge.csv", chunksize=50_000):      # no global groupby!
    process(tighten(chunk))
`;
