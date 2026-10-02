// ── Single-pass decision head swapped onto an open LLM — data & pure logic ──

export const ARCH_COMPARISON = [
  { aspect: 'Output unit', loop: 'Generated tokens (one at a time)', single: 'One label + confidence vector' },
  { aspect: 'Forward passes', loop: 'One per output token until EOS', single: 'Exactly one' },
  { aspect: 'Latency profile', loop: 'Grows with answer length', single: 'Constant, independent of wording' },
  { aspect: 'Failure mode', loop: 'Malformed output, drift, verbose prose', single: 'Wrong class — inspectable scores' },
  { aspect: 'What it is good at', loop: 'Open-ended generation and reasoning', single: 'Bounded yes/no decisions at volume' },
];

export const HEAD_SWAP = [
  { part: 'Backbone', before: 'Frozen pretrained transformer', after: 'Same frozen backbone', changed: false },
  { part: 'LM head', before: 'Vocabulary logits (e.g. 151k × hidden)', after: 'Removed', changed: true },
  { part: 'Classification head', before: '—', after: 'nn.Linear(hidden, n_classes), often 2 classes', changed: true },
  { part: 'Pooling', before: 'Next-token logits', after: 'Last-token hidden state (or mean pool)', changed: true },
  { part: 'Trainable parameters', before: 'Full model (billions)', after: 'Head only — a few thousand', changed: true },
  { part: 'Optimizer state', before: 'Scales with model size', after: 'Tiny — fits alongside a frozen backbone', changed: true },
  { part: 'Inference cost', before: 'Full generation loop', after: 'One forward pass → argmax over 2 logits', changed: false },
];

export const DATASET = [
  { name: 'add', body: 'return x + y', label: 'match', ok: true },
  { name: 'add', body: 'return x * y', label: 'mismatch', ok: false },
  { name: 'is_even', body: 'return n % 2 == 0', label: 'match', ok: true },
  { name: 'is_even', body: 'return n % 2 == 1', label: 'mismatch', ok: false },
  { name: 'maximum', body: 'return max(a, b)', label: 'match', ok: true },
  { name: 'maximum', body: 'return min(a, b)', label: 'mismatch', ok: false },
  { name: 'rectangle_area', body: 'return w * h', label: 'match', ok: true },
  { name: 'rectangle_area', body: 'return w + h', label: 'mismatch', ok: false },
  { name: 'celsius_to_f', body: 'return c * 9 / 5 + 32', label: 'match', ok: true },
  { name: 'celsius_to_f', body: 'return c * 5 / 9 - 32', label: 'mismatch', ok: false },
];

export const PARAMS = {
  backbone: '1.5B (frozen)',
  hidden: 1536,
  classes: 2,
  headParams: 1536 * 2 + 2, // weight + bias
};

export function accuracyAt(epoch) {
  if (epoch <= 0) return 0.5;
  return Math.min(0.995, 0.5 + 0.495 * (1 - Math.exp(-epoch / 6)));
}

export function confusionAt(epoch) {
  const acc = accuracyAt(epoch);
  const total = 40; // 20 match + 20 mismatch validation examples
  const wrong = Math.round(total * (1 - acc));
  const wrongPos = Math.floor(wrong / 2);
  const wrongNeg = wrong - wrongPos;
  return {
    tp: 20 - wrongNeg, fn: wrongNeg, tn: 20 - wrongPos, fp: wrongPos, acc,
  };
}

export const QUANT = {
  fp: { sizeGB: 6.17, latencyMs: 78, label: 'fp16 baseline' },
  int8: { sizeGB: 0.93, latencyMs: 24, label: 'dynamic int8' },
};

export const DEMO_RESULTS = [
  { fn: 'add(x, y): return x + y', verdict: 'match', conf: 0.99 },
  { fn: 'add(x, y): return x * y', verdict: 'MISMATCH', conf: 1.00 },
  { fn: 'is_even(n): return n % 2 == 1', verdict: 'MISMATCH', conf: 0.98 },
  { fn: 'maximum(a, b): return min(a, b)', verdict: 'MISMATCH', conf: 0.88 },
  { fn: 'rectangle_area(w, h): return w + h', verdict: 'MISMATCH', conf: 0.94 },
  { fn: 'celsius_to_f(c): return c * 9 / 5 + 32', verdict: 'match', conf: 0.97 },
];

export const EDITOR_VS_SEMANTIC = [
  { check: 'Unused import', editor: '✓ caught', semantic: '✓ caught (as a side effect of any AST lint)' },
  { check: 'Undefined variable', editor: '✓ caught', semantic: '✓ caught' },
  { check: 'Wrong operator in a correctly-named function', editor: '✗ silent', semantic: '✓ caught — name says multiply, body says add' },
  { check: 'Function name lies about intent', editor: '✗ silent', semantic: '✓ caught' },
  { check: 'Probability-of-correctness for the check', editor: 'n/a (static)', semantic: `e.g. ${0.95} calibrated on held-out examples` },
];

export const CODE_MODEL = `import torch
import torch.nn as nn

class DecisionHead(nn.Module):
    """Swap the vocabulary head for a 2-way decision head.
    The backbone stays frozen — inference is a single forward pass."""

    def __init__(self, backbone, hidden=1536, n_classes=2):
        super().__init__()
        self.backbone = backbone
        for p in self.backbone.parameters():
            p.requires_grad = False          # frozen: ~1.5B params, zero grads
        self.head = nn.Linear(hidden, n_classes)   # 1536*2 + 2 = 3,074 params

    def forward(self, input_ids, attention_mask):
        out = self.backbone(
            input_ids=input_ids,
            attention_mask=attention_mask,
            output_hidden_states=True,
        )
        h = out.hidden_states[-1][:, -1, :]  # last token, last layer
        logits = self.head(h)                 # [batch, 2] — one pass, done
        return logits`;

export const CODE_TRAIN = `# Head-only training: the backbone never sees gradients.
model = DecisionHead(backbone).train()
head_params = [p for p in model.parameters() if p.requires_grad]
assert sum(p.numel() for p in head_params) == model.head.weight.numel() + model.head.bias.numel()

optim = torch.optim.AdamW(head_params, lr=1e-3)
loss_fn = nn.CrossEntropyLoss()

for epoch in range(50):
    for ids, mask, labels in train_loader:      # name-vs-body pairs
        logits = model(ids, mask)
        loss = loss_fn(logits, labels)
        optim.zero_grad()
        loss.backward()                         # grads touch only 3k params
        optim.step()
    val = evaluate(model, val_loader)           # track accuracy + calibration`;

export const CODE_QUANT = `# Dynamic int8 quantization of the frozen backbone: 6.17 GB -> 0.93 GB.
import torch.quantization as tq

quantized = tq.quantize_dynamic(
    model.backbone, {torch.nn.Linear}, dtype=torch.qint8
)
model.backbone = quantized
# heads stay fp16: they carry the decision, not the bulk of the weights.

torch.save(model.state_dict(), "decision_head.pt")`;

export const CODE_CHECK = `# check_names.py — exit 0 = clean, exit 1 = lying names found (CI hook).
import ast, sys, torch

def check(path: str) -> list[dict]:
    tree = ast.parse(open(path).read())
    results = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            src = ast.get_source_segment(open(path).read(), node)
            name, body = node.name, src.split(":", 1)[1].strip()
            ok, conf = model.predict(name, body)      # one forward pass
            if not ok:
                results.append({"fn": name, "body": body, "conf": float(conf)})
    return results

if __name__ == "__main__":
    findings = check(sys.argv[1])
    for f in findings:
        print(f"MISMATCH {f['fn']:>22}  conf={f['conf']:.2f}  <- {f['body'][:40]}")
    sys.exit(1 if findings else 0)   # 10 of 27 flagged -> CI fails the commit`;
