// ============================================================================
// BUILDING YOUR FIRST AI APP: ARCHITECTURE & INFRASTRUCTURE ENGINE
// Client Libraries, API Key Security, JSON Response Anatomy, Error Triaging, and Map-Reduce Chunking
// ============================================================================

export const FIVE_APP_STAGES = [
  {
    stage: "1. Client Library vs 'Installing AI'",
    concept: "The package (`openai` or `anthropic`) is not the AI model. It is an HTTP client / translator communicating with cloud neural compute clusters.",
    antiPattern: "Thinking AI runs locally inside `site-packages/` without internet or GPU access.",
    bestPractice: "Understand the client-server boundary: your app is a lightweight messenger; the LLM is remote infrastructure."
  },
  {
    stage: "2. Secrets Management & Environment Variables",
    concept: "API keys are cryptographic credentials with direct credit card billing attached. Hardcoding strings in source files leads to GitHub credential scrapers.",
    antiPattern: "Committing `api_key = 'sk-proj-1234...'` directly to git repositories.",
    bestPractice: "Store secrets in `.env` or system environment variables accessed strictly via `os.getenv('OPENAI_API_KEY')`."
  },
  {
    stage: "3. Anatomy of the Structured API Response",
    concept: "The model response is not raw plain text; it is a structured JSON object containing token counts, completion metadata, model ID, and choice arrays.",
    antiPattern: "Treating the return value as a primitive string and crashing when inspecting metadata.",
    bestPractice: "Traverse structured fields: `response.choices[0].message.content` and log `response.usage` for cost observability."
  },
  {
    stage: "4. Code Bugs vs Infrastructure Failures",
    concept: "AI applications fail across two distinct failure domains: script bugs vs remote API/quota infrastructure errors.",
    antiPattern: "Rewriting Python code when the actual issue is a 429 quota exhaustion or missing billing tier.",
    bestPractice: "Implement explicit HTTP status code triaging (401 Invalid Auth, 429 Rate Limit, 503 Overloaded)."
  },
  {
    stage: "5. Long Document Map-Reduce Chunking",
    concept: "Articles exceeding context or output budgets must be segmented, summarized per chunk, and merged into a coherent executive synthesis.",
    antiPattern: "Dumping 5,000-word PDFs into a single prompt and getting truncated, low-quality summaries.",
    bestPractice: "Split text into 500-word windows, run parallel or sequential map summarizations, and reduce into final output."
  }
];

export const API_ERROR_TRIAGE_MATRIX = [
  {
    code: "HTTP 401 Unauthorized",
    domain: "Authentication / Secrets",
    cause: "Invalid API key, expired token, or missing `OPENAI_API_KEY` environment variable.",
    remedy: "Check `os.getenv('OPENAI_API_KEY')` and verify API key permissions in provider dashboard."
  },
  {
    code: "HTTP 429 Insufficient Quota",
    domain: "Billing / Infrastructure",
    cause: "Account has run out of prepaid API credits or exceeded monthly spending ceiling.",
    remedy: "Add billing balance or increase organization rate-limit tier in provider settings."
  },
  {
    code: "HTTP 429 Rate Limit Exceeded",
    domain: "Concurrency / QPS",
    cause: "Too many requests per minute (RPM) or tokens per minute (TPM) submitted simultaneously.",
    remedy: "Implement exponential backoff retry logic (e.g. `tenacity` library in Python)."
  },
  {
    code: "HTTP 400 Context Window Exceeded",
    domain: "Payload Size",
    cause: "Prompt plus requested completion tokens exceeds the model maximum context length.",
    remedy: "Truncate prompt, apply Map-Reduce chunking, or switch to a large-context model (e.g. Gemini 2.0 / GPT-4o)."
  }
];

export const SIMULATE_SUMMARIZER_PIPELINE = (rawText = "", chunkSize = 400) => {
  const words = rawText.trim().split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;

  if (totalWords === 0) {
    return {
      chunks: [],
      totalTokensEstimated: 0,
      summary: "Please provide article text to summarize.",
      executionTimeMs: 120
    };
  }

  // Chunking
  const chunks = [];
  for (let i = 0; i < totalWords; i += chunkSize) {
    const chunkWords = words.slice(i, i + chunkSize);
    chunks.push(chunkWords.join(" "));
  }

  const estimatedTokens = Math.round(totalWords * 1.35);

  let summaryText = "";
  if (chunks.length === 1) {
    summaryText = `• Executive TL;DR: The article discusses foundational concepts across ${totalWords} words, emphasizing API client separation, environment variable security, and real-world AI infrastructure.\n• Key Takeaway: Real AI skills are built by deploying structured workflows rather than just memorizing theoretical prompt guides.`;
  } else {
    summaryText = `• Hierarchical Synthesis (${chunks.length} Chunks Processed):\n` +
      chunks.map((_, idx) => `  - Section ${idx + 1}: Analyzes core engineering constraints, chunked processing, and token usage optimization.`).join("\n") +
      `\n• Final Synthesis: Unified summary combining all ${chunks.length} mapped chunks into an actionable digest.`;
  }

  return {
    chunks,
    chunkCount: chunks.length,
    totalWords,
    totalTokensEstimated: estimatedTokens,
    summary: summaryText,
    executionTimeMs: 320 + chunks.length * 180
  };
};

export const PYTHON_PRODUCTION_APP_SCRIPT = `# ============================================================================
# PRODUCTION STARTER AI APP: ARTICLE SUMMARIZER WITH CHUNKING & RETRIES
# Clean engineering architecture: .env loading, error handling & token logging
# ============================================================================

import os
from dotenv import load_dotenv
from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

# 1. Secure Secret Loading from .env
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("ERROR: OPENAI_API_KEY is missing. Please set it in your .env file!")

client = OpenAI(api_key=api_key)

# 2. Resilient API Call with Exponential Backoff
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def summarize_chunk(text_chunk: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert technical editor. Summarize clearly in bullet points."},
            {"role": "user", "content": f"Summarize this text:\\n{text_chunk}"}
        ],
        temperature=0.3
    )
    # Log token usage for cost observability
    print(f"Tokens consumed: {response.usage.total_tokens} (Prompt: {response.usage.prompt_tokens}, Completion: {response.usage.completion_tokens})")
    return response.choices[0].message.content

# 3. Map-Reduce Chunking for Long Articles
def summarize_long_article(article_text: str, max_chunk_words: int = 500) -> str:
    words = article_text.split()
    chunks = [" ".join(words[i:i+max_chunk_words]) for i in range(0, len(words), max_chunk_words)]
    
    print(f"Processing article ({len(words)} words) across {len(chunks)} chunk(s)...")
    partial_summaries = [summarize_chunk(chunk) for chunk in chunks]
    
    if len(partial_summaries) == 1:
        return partial_summaries[0]
        
    # Reduce step: Combine partial summaries
    combined = "\\n".join(partial_summaries)
    return summarize_chunk(f"Synthesize these section summaries into one cohesive executive summary:\\n{combined}")

if __name__ == '__main__':
    sample_article = "Artificial intelligence applications require separating client code from cloud compute..."
    final_output = summarize_long_article(sample_article)
    print("\\n=== FINAL SUMMARY ===\\n", final_output)
`;
