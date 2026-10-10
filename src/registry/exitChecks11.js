/**
 * Exit-check bank K — agent observability, token economics, control plane,
 * agent lifecycle, agentic UI workflows, temporal Graph RAG.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_K = {
  agentobservability: [
    { q: 'The duplicate refund_lookup calls show up in the trace as…', o: ['An exception thrown inside the tool itself', 'Two sibling tool spans under one wide chat span', 'A failed status on the request', 'A red dashboard tile'], a: 1, e: 'Tool spans are siblings of the chat step that proposed them — the shape reveals the loop, not an error.' },
    { q: 'An input:output token ratio that keeps exceeding 10:1 usually means…', o: ['The system prompt has quietly bloated', 'The model is being rate-limited', 'Retrieval returned too few chunks', 'Sampling is set too low'], a: 0, e: 'That alert exists to catch prompt bloat long before the bill does.' },
    { q: 'Routine production successes are captured at only 5–10% because…', o: ['Error traces are legally required to be dropped', 'Every span must be stored forever', 'Spans are large and model calls slow — full capture adds cost, not value', 'Storage allows one run per minute'], a: 2, e: 'Development, errors, high-token requests and full agent runs all stay at 100%.' }
  ],
  costtollbooth: [
    { q: 'If a subagent keeps working past the manager’s cache window…', o: ['Nothing changes — warm prefixes never expire', 'The tier drops automatically to light', 'The whole context recomputes and the delegation costs more than it saved', 'Only the subagent’s own tokens are re-billed'], a: 2, e: 'The intern rules require the job to finish inside the window or the prefix is rebuilt from scratch.' },
    { q: 'Arithmetic is the first candidate to hand off to code because…', o: ['Models predict digits, not arithmetic — a script is free and identical every run', 'Scripts can use the GPU cache', 'Models refuse numeric questions', 'Code needs no tests'], a: 0, e: 'One right answer means no judgement needed, so no tokens spent.' },
    { q: 'Among the cache windows listed in this tab, the shortest is…', o: ['~60 minutes', '~30 minutes', '~8 minutes', '~5 minutes'], a: 3, e: 'Windows run from 5 to 60 minutes — know yours before planning a back-and-forth session.' }
  ],
  agentcontrolplane: [
    { q: 'The tier model says a risk tier can be…', o: ['Lowered when the model answers confidently', 'Assigned once per agent for its whole life', 'Raised by risk signals, never lowered by model confidence', 'Chosen by the approver after the fact'], a: 2, e: 'Escalate on risk signals; the single downward rule is never used.' },
    { q: 'A dispatch that returns HTTP 200 with no authoritative read-back leaves the effect…', o: ['Verified — the provider receipt proves it', 'Pending or unknown until the postcondition is read', 'Failed — the timeout branch always runs', 'Compensated automatically'], a: 1, e: 'A 200 is not a business result; without the postcondition the state stays pending or unknown.' },
    { q: 'Human approval must bind to…', o: ['A digest of the canonical action — any change invalidates it and a one-time nonce blocks replay', 'The agent’s natural-language intent', 'The chat transcript of the request', 'The approver’s role alone'], a: 0, e: 'Approve the exact effect that will dispatch, not a vague description of it.' }
  ],
  agentlifecycle: [
    { q: 'When evidence challenges the task decomposition itself, the loop returns to…', o: ['Build — improve the current design and re-run', 'Plan — reconsider the hypothesis or the decomposition', 'Operate — ship it and watch', 'Nothing; evaluation ends the cycle'], a: 1, e: 'Evidence that fits goes back to Build; evidence that challenges goes back to Plan.' },
    { q: 'In the behavioral contract, a confident label with no supporting evidence scores as…', o: ['A failure, even if the label happens to be right', 'A pass, because the label matched', 'Inconclusive', 'A pass with a warning flag'], a: 0, e: 'Scoring rejects unsupported confidence — right answer, wrong process still fails.' },
    { q: 'Raising the attempt count k moves the two reliability measures…', o: ['Both fall', 'Both rise', 'pass@k up while all-k down', 'Neither moves without retraining'], a: 2, e: 'pass@k rises and all-k collapses as k grows — occasional success never justifies acting on every result.' }
  ],
  agenticuiworkflow: [
    { q: 'In the order-intake workflow, non-purchase-order mail is filtered…', o: ['Before any parsing cost is paid', 'After the row is appended to the sheet', 'By the optimization endpoint', 'Only at the end of the session'], a: 0, e: 'Cheap checks run before the expensive model call.' },
    { q: 'The optimal batch schedule is computed by…', o: ['The language model, reasoning step by step', 'A spreadsheet formula in the reply', 'A deterministic endpoint the agent only calls and narrates', 'The mail client’s built-in rules'], a: 2, e: 'If a number decides money, it comes from the service — never from the model.' },
    { q: 'When a parsed field such as holding cost comes back empty, the agent should…', o: ['Assume zero and continue', 'Ask a clarification question instead of guessing', 'Estimate it from the previous period', 'Abort the whole workflow'], a: 1, e: 'A blank cost silently yields a confident, wrong schedule — pause and ask.' }
  ],
  temporalgraphrag: [
    { q: 'Facts dated after the query are kept out of the answer by…', o: ['Recency decay, which scores them near zero', 'The model noticing the date in the text', 'A hard date ≤ query filter applied before scoring', 'A similarity threshold on the wording'], a: 2, e: 'Future facts are excluded from candidates, never merely down-weighted.' },
    { q: 'With a 365-day half-life, the three mid-November CEO facts fall within…', o: ['0.25–0.37 of each other, clearly separated', 'A 0.97–0.99 band — technically ranked, practically indistinguishable', 'Exactly 0.5 apart', 'Zero weight all round'], a: 1, e: 'A 7-day half-life spreads them to 0.25–0.37 so the latest appointment wins cleanly.' },
    { q: 'The right half-life is chosen…', o: ['Per predicate or domain — personnel moves on weeks, founding facts on years', 'Once for the whole knowledge base', 'Always at 365 days', 'By whichever model scores highest'], a: 0, e: 'Half-life is a domain parameter, not a default.' }
  ]
};
