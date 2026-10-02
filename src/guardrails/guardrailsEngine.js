// ============================================================================
// RESPONSIBLE AI, SECURITY & GUARDRAILS ENGINE
// Focuses on PII & Author Redaction, Copyright/IP Protection, and Prompt Injection Defense
// ============================================================================

export const ANONYMIZE_PII_AND_AUTHORS = (inputText) => {
  if (!inputText) return { sanitizedText: "", stats: { authorsRedacted: 0, piiRedacted: 0 } };

  let redactedCount = 0;
  let authorCount = 0;
  let text = inputText;

  // 1. Author & Full Name Redaction patterns
  const authorPatterns = [
    /\b(by|author|written by|created by)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
    /\b(Dr\.|Prof\.|Mr\.|Ms\.)\s+([A-Z][a-z]+(\s+[A-Z][a-z]+)?)/g
  ];

  authorPatterns.forEach(pattern => {
    text = text.replace(pattern, (match, prefix, name) => {
      authorCount++;
      return `${prefix} [REDACTED_AUTHOR]`;
    });
  });

  // 2. Email Address Redaction
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  text = text.replace(emailRegex, () => {
    redactedCount++;
    return "[REDACTED_EMAIL]";
  });

  // 3. Phone Number Redaction
  const phoneRegex = /\b(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
  text = text.replace(phoneRegex, () => {
    redactedCount++;
    return "[REDACTED_PHONE]";
  });

  // 4. SSN / Government ID Redaction
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  text = text.replace(ssnRegex, () => {
    redactedCount++;
    return "[REDACTED_SSN]";
  });

  return {
    sanitizedText: text,
    stats: {
      authorsRedacted: authorCount,
      piiRedacted: redactedCount
    }
  };
};

export const CHECK_COPYRIGHT_AND_IP = (outputText) => {
  if (!outputText) return { status: "PASS", similarityScore: 0, matches: [] };

  const proprietaryFingerprints = [
    { title: "Verbatim Book Excerpt", pattern: /harry potter and the sorcerer/i, similarity: 0.94 },
    { title: "Proprietary Trade Secret Code", pattern: /def secret_trading_algorithm\(/i, similarity: 0.98 },
    { title: "Commercial Novel Chapter", pattern: /once upon a time in a galaxy far far away verbatim/i, similarity: 0.91 }
  ];

  const matches = [];
  let maxSimilarity = 0;

  proprietaryFingerprints.forEach(fp => {
    if (fp.pattern.test(outputText)) {
      matches.push(fp.title);
      maxSimilarity = Math.max(maxSimilarity, fp.similarity);
    }
  });

  if (matches.length > 0) {
    return {
      status: "BLOCKED_COPYRIGHT",
      similarityScore: maxSimilarity,
      matches,
      fallbackMessage: "Notice: Output blocked by Responsible AI Guardrail — Content matches registered copyrighted text or proprietary IP."
    };
  }

  return {
    status: "PASS_IP_CLEAN",
    similarityScore: 0.05,
    matches: [],
    fallbackMessage: "Content verified: IP Compliance Check Passed."
  };
};

export const PROMPT_INJECTION_DEFENSE = (userPrompt) => {
  if (!userPrompt) return { isThreat: false, threatType: "SAFE", riskScore: 0 };

  const threatRules = [
    { type: "JAILBREAK_OVERRIDE", pattern: /(ignore previous instructions|disregard system prompt|you are now DAN|do anything now)/i, score: 0.98 },
    { type: "SYSTEM_PROMPT_LEAK", pattern: /(reveal system prompt|show instructions above|print initial developer message)/i, score: 0.92 },
    { type: "DATA_EXFILTRATION", pattern: /(curl http|fetch credentials|send API key to)/i, score: 0.95 },
    { type: "ROLEPLAY_EXPLOIT", pattern: /(pretend you have no safety filters|bypass content restrictions)/i, score: 0.89 }
  ];

  for (let rule of threatRules) {
    if (rule.pattern.test(userPrompt)) {
      return {
        isThreat: true,
        threatType: rule.type,
        riskScore: rule.score,
        mitigation: "Blocked by Input Security Guardrail — Prompt Injection attack detected."
      };
    }
  }

  return {
    isThreat: false,
    threatType: "SAFE",
    riskScore: 0.02,
    mitigation: "Input clean and verified safe for model execution."
  };
};

export const PYTHON_GUARDRAILS_CODE = `# ============================================================================
# RESPONSIBLE AI, PII ANONYMIZATION & COPYRIGHT GUARDRAILS (PYTHON)
# Multi-Layer LLM Security Pipeline
# ============================================================================

import re
from typing import Dict, Tuple

class ResponsibleAIGuardrails:
    def __init__(self):
        self.banned_copyright_phrases = [
            "harry potter and the sorcerer",
            "def secret_trading_algorithm("
        ]
        
    def sanitize_input_pii_and_authors(self, text: str) -> Tuple[str, Dict]:
        """Layer 1: Redact PII & Author Metadata from input/output streams"""
        stats = {"authors": 0, "pii": 0}
        
        # Redact Author Names
        author_pattern = r'\\b(by|author|written by)\\s+([A-Z][a-z]+\\s+[A-Z][a-z]+)'
        text, n_auth = re.subn(author_pattern, r'\\1 [REDACTED_AUTHOR]', text, flags=re.IGNORECASE)
        stats["authors"] += n_auth
        
        # Redact Email Addresses
        email_pattern = r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b'
        text, n_email = re.subn(email_pattern, '[REDACTED_EMAIL]', text)
        stats["pii"] += n_email
        
        return text, stats

    def check_copyright_compliance(self, text: str) -> Tuple[bool, str]:
        """Layer 2: Check for verbatim copyrighted text and IP leakage"""
        for phrase in self.banned_copyright_phrases:
            if phrase.lower() in text.lower():
                return False, "BLOCKED: Output violates Copyright & IP Protection Guardrail."
        return True, "IP_COMPLIANCE_PASSED"

    def scan_prompt_injection(self, prompt: str) -> Tuple[bool, str]:
        """Layer 3: Detect Direct & Indirect Prompt Injections"""
        injection_patterns = [
            r'ignore previous instructions',
            r'reveal system prompt',
            r'you are now DAN'
        ]
        for pattern in injection_patterns:
            if re.search(pattern, prompt, re.IGNORECASE):
                return False, "BLOCKED: Prompt Injection Threat Detected!"
        return True, "SAFE"

# ── Usage Example ────────────────────────────────────────────────────────────
guard = ResponsibleAIGuardrails()
sample_input = "Article written by John Doe. Contact at john@example.com."
sanitized, stats = guard.sanitize_input_pii_and_authors(sample_input)
print("Sanitized Stream:", sanitized)
print("Security Stats:", stats)
`;

// ── Curriculum: threat map → guardrail layers ───────────────────────────────
export const THREAT_MAP = [
  { layer: "Input", threats: "jailbreaks, direct/indirect injection, PII entering the prompt, oversized payloads", first: "filter + redact before the model sees anything" },
  { layer: "Retrieval", threats: "poisoned corpus, untrusted docs smuggling instructions, exfil via retrieved content", first: "trust scores on sources; retrieved text is data, never instructions" },
  { layer: "Tool / agent", threats: "over-privileged tools, destructive actions, secret leakage, runaway loops", first: "least privilege, confirm destructive calls, budget the loop" },
  { layer: "Model output", threats: "hallucinated claims, PII echo, copyrighted verbatim text, unsafe advice, schema violations", first: "validate + redact + gate before anything downstream sees it" },
  { layer: "Downstream", threats: "unchecked output becoming code/SQL/API calls, poisoned writes back into memory", first: "same guardrails re-run on anything the output triggers" }
];

export const OUTPUT_CHECKS = [
  { check: "Schema / contract validation", how: "JSON-schema, enum, length bounds — reject and repair", stops: "malformed tool calls, broken UI rendering" },
  { check: "PII + secret echo", how: "regex + NER pass on output — redact or block", stops: "model repeating an email it saw in retrieval" },
  { check: "Grounding / faithfulness", how: "claim-vs-context check; citations must resolve", stops: "confident hallucination presented as fact" },
  { check: "Toxicity / safety filter", how: "classifier on the completion; threshold + escalate", stops: "unsafe content reaching users" },
  { check: "Copyright / IP scan", how: "n-gram match vs protected corpus (see section 3)", stops: "verbatim leakage of protected text" }
];

export const AGENT_GUARDRAILS = [
  { guard: "Least-privilege tools", rule: "read-only by default; write/delete requires explicit allow-list per task", why: "an agent is an API caller with a hallucinating brain" },
  { guard: "Human gate on irreversible actions", rule: "deploy, payment, delete, email-send → confirm", why: "cost of a wrong action >> cost of a pause" },
  { guard: "Argument validation at the boundary", rule: "schema-check every tool call before execution; reject unknown fields", stops: "prompt-injected arguments reaching real systems" },
  { guard: "Secret brokering", rule: "scoped, expiring credentials minted per call — never raw secrets in context", why: "context is visible to the model and the trace" },
  { guard: "Loop budgets", rule: "max steps, max tokens, stall detection → abort with audit entry", why: "runaway loops burn money and can brute-force past other guards" }
];

export const FRAMEWORK_TABLE = [
  { dim: "NVIDIA NeMo Guardrails", note: "Colang dialog rails, input/output/safety rails; strongest when dialogue flow matters; NVIDIA stack gravity" },
  { dim: "Guardrails AI (guardrailsai)", note: "Validators per output field + typed Rail specs; great structure guarantees, lighter security coverage" },
  { dim: "Provider content policies", note: "API-level refusals + safety classes (OpenAI/Azure/Anthropic/Google); zero code, least control, vendor-coupled" },
  { dim: "Plain code + regex/NER (this lab)", note: "Transparent, auditable, dependency-free; you own coverage and maintenance" }
];

// ── Hands-on: guardrails instrumented with observability spans ─────────────
export const PAIRED_GUARDRAILS_OBS_CODE = `# Guardrail events AS spans — blocked output still produces a trace
from opentelemetry import trace
tracer = trace.get_tracer("rag")

def guarded_generate(prompt: str, user_input: str) -> str:
    with tracer.start_as_current_span("guardrails.run") as span:
        verdict, kind = scan_prompt_injection(user_input)   # lab's layer-3 check
        span.set_attribute("guardrails.injection", verdict)
        span.set_attribute("guardrails.threat_type", kind)

        if not verdict:                                     # blocked → alert span
            span.set_attribute("outcome", "blocked")
            span.set_status(StatusCode.ERROR)
            raise PermissionError(f"blocked: {kind}")

        text = generate(prompt, user_input)                 # your model call
        span.set_attribute("guardrails.pii_out", count_pii(text))
        span.set_attribute("outcome", "sanitized")          # 200 OK with a verdict
        return redact(text)

# Alert rules join here: blocked-rate > baseline, pii_out > 0,
# or band-slip on the scores you log in the same trace (obs tab).
`;
