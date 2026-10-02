// ============================================================================
// FUNCTOOLS TRICKS ENGINE (total_ordering/partial/dispatch)
// Plus lru_cache lineage; perf caveats included
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const TRICKS = [
  {
    id: "total_ordering", name: "@total_ordering", need: "All 6 comparisons from __eq__ + one ordering method",
    before: "5 dunders hand-written (__eq__ __lt__ __gt__ __le__ __ge__)", after: "2 methods + decorator derives the rest",
    lines: [14, 6], caveat: "Not for hot paths — derives by evaluating multiple comparisons"
  },
  {
    id: "partial", name: "functools.partial", need: "Families of near-identical functions (find_A/find_B/…)",
    before: "N near-duplicate defs", after: "partial(re.findall, pattern) per variant",
    lines: [8, 2], caveat: "Name the partial well — tracebacks show wrapper, not intent"
  },
  {
    id: "singledispatch", name: "@singledispatch", need: "One function, many input types (no if-else chains)",
    before: "if/elif on type()", after: "@register per type; dispatcher routes",
    lines: [12, 7], caveat: "Dispatches on FIRST arg type only"
  },
  {
    id: "lru_cache", name: "@lru_cache", need: "Repeated pure calls (recursion, web fetches) — prior article", before: "Manual memo dicts", after: "One decorator, bounded cache",
    lines: [6, 1], caveat: "Args must hash; side-effectful fns must NOT cache"
  }
];

// ── Simulator: lines-saved + caveat board ───────────────────────────────────
export const LINES_SAVED = (use = ["total_ordering", "partial", "singledispatch"]) => {
  const rows = TRICKS.filter(t => use.includes(t.id));
  const before = rows.reduce((a, t) => a + t.lines[0], 0);
  const after = rows.reduce((a, t) => a + t.lines[1], 0);
  return {
    rows, before, after, saved: before - after,
    savedPct: before ? Math.round((1 - after / before) * 100) : 0,
    caveats: rows.map(t => `${t.name}: ${t.caveat}`),
    verdict: "Neat, tidy, readable — until a caveat bites. Apply with the warnings attached."
  };
};

export const PYTHON_FUNCTOOLS_CODE = `# ============================================================================
# FUNCTOOLS TRIO: total_ordering + partial + singledispatch
# ============================================================================
from functools import total_ordering, partial, singledispatch
import re

@total_ordering
class Employee:
    def __init__(self, name, age): self.name, self.age = name, age
    def __lt__(self, other): return self.age < other.age
    def __eq__(self, other): return self.age == other.age
    # __gt__/__le__/__ge__ derived. Hot paths: hand-write instead.

find_A_words = partial(re.findall, r'A\\w+')
find_B_words = partial(re.findall, r'B\\w+')

@singledispatch
def greeting(name): print(f'Hi, {name}!')

@greeting.register
def _(name: list):
    print(f'Hi, {\", \".join(name)}!')   # dispatches on FIRST arg type

if __name__ == "__main__":
    print(find_A_words('Apple Ate Big Bad Air Bag'))
    greeting(['Alice', 'Bob'])
`;
