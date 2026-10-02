// ============================================================================
// VRAM CONDUCTOR ENGINE (lmxd admission control)
// KV-upfront OOM, 90% ledger, book-before-build, KV swap, layer streaming
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const OOM_STORY = [
  { step: "Agent 1 (Llama 1B, -c 172032)", vram: "6,536 / 8,192 MiB — KV reserved UPFRONT", result: "Survives" },
  { step: "Agent 2 (Qwen 0.5B)", vram: "+1,536 MiB ask → cudaMalloc fail", result: "qwen process ended 🫡" },
  { step: "Agent 3 (SmolLM 360M)", vram: "+5,120 MiB ask → fail", result: "One-agent demo + two crash logs" }
];

export const LEDGER_RULES = [
  { rule: "90% cap, one number", why: "Admit iff used + estimate ≤ cap — before touching GPU" },
  { rule: "Mutex compare-and-bump", why: "Parallel REGISTERs can't overcommit on stale state" },
  { rule: "Book before build", why: "Reserve → load; unwind on failure leaves zero trace" },
  { rule: "One backend, refcounts", why: "Single CUDA context; shared GGUF mapped once" },
  { rule: "Self-explaining denial", why: "ERR ... ledger_max/allocated/requested — debug in one line" }
];

export const KV_SWAP = [
  { call: "DECODE smol", evicted: "—", restored: "false", what: "Cold start, fresh context" },
  { call: "DECODE qwen", evicted: "smol→host", restored: "false", what: "Serialized out, freed, rebuilt" },
  { call: "DECODE smol", evicted: "qwen→host", restored: "true", what: "Conversation continues (~440ms total)" }
];

export const CAC_ANALOGY = [
  { telecom: "Cell radio budget", gpu: "90% of vram_total_bytes" },
  { telecom: "Session ask estimated", gpu: "table_bytes per model" },
  { telecom: "Admit before bearer", gpu: "Admit before GGUF load" },
  { telecom: "Reject spares live calls", gpu: "Reject spares live agents" }
];

export const OUT_OF_SCOPE = [
  "LayerStreamer kernel is FMA-representative, not a transformer pass (multi-month to port)",
  "Single live context — concurrent decode needs streamer-inside-decode",
  "Operator-supplied byte estimates must grow (KV/activations/margin)",
  "NVML sampled at boot; one GPU, one client at a time"
];

// ── Simulator: admission ledger ─────────────────────────────────────────────
const MODELS = { smol: 1536, qwen: 1536, llama: 6536, mistral7b: 5200 };
export const ADMIT = (queue = ["llama", "qwen", "smol"], cardMB = 8192, pct = 90) => {
  const cap = Math.round(cardMB * pct / 100);
  let used = 22;
  const rows = queue.map(m => {
    const need = MODELS[m] || 1500;
    const ok = used + need <= cap;
    if (ok) used += need;
    return { model: m, need, ok, usedAfter: used };
  });
  return {
    cap, rows, usedMB: used,
    verdict: rows.every(r => r.ok) ? "All admitted — one backend, zero coin flips."
      : "DENIED at cap — structured ERR, live agents untouched. Refusing beats OOM.",
    note: "Naive stack dies at agent 2; ledger admits by arithmetic."
  };
};

export const PYTHON_LEDGER_CODE = `# ============================================================================
# VRAM LEDGER: 90% cap + book-before-build (lmxd essence, telecom CAC)
# ============================================================================
import threading

class VramLedger:
    def __init__(self, total_mb: int, pct: int = 90):
        self.cap = total_mb * pct // 100
        self.used = 22          # driver baseline
        self.mu = threading.Lock()

    def try_reserve(self, need_mb: int) -> bool:
        with self.mu:           # compare-and-bump: no stale-state overcommit
            if self.used + need_mb > self.cap:
                return False
            self.used += need_mb
            return True

    def release(self, need_mb: int):
        with self.mu:
            self.used -= need_mb

def register(agent: str, model_mb: int, ledger: VramLedger) -> str:
    if not ledger.try_reserve(model_mb):
        return f"ERR VRAM_LEDGER_DENY used={ledger.used} cap={ledger.cap}"
    try:
        load_model()            # book BEFORE build — unwind on failure
    except Exception as e:
        ledger.release(model_mb)
        return f"ERR load failed: {e}"
    return f"OK {agent} booked {model_mb}MB"
`;
