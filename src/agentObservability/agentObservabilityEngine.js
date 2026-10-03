// ── Agent observability: logging, tracing, debugging — data & pure logic ──

export const FAIL_SIGNATURE = {
  story: 'A support agent closes a ticket with a clean, professional, entirely wrong answer. It called the refund-lookup tool, called it again seconds later with slightly different arguments, and answered from the second result. Nothing crashed. The dashboard stayed green. A customer noticed two days later.',
  symptoms: [
    { symptom: 'Incorrect but well-formed output', tripsAnError: false, whoCatches: 'A human reading the answer — days later' },
    { symptom: 'Redundant tool calls', tripsAnError: false, whoCatches: 'Only the trace waterfall, if you recorded one' },
    { symptom: 'Syntactically valid, semantically wrong action', tripsAnError: false, whoCatches: 'Post-hoc audit of effects, not logs' },
    { symptom: 'Exception / timeout', tripsAnError: true, whoCatches: 'Any standard error handler' },
  ],
};

export const SIGNAL_COMPARISON = [
  { signal: 'Latency driver', traditional: 'CPU, I/O, network', agent: 'Token count, model size, context width' },
  { signal: 'Cost unit', traditional: 'Requests per second', agent: 'Tokens consumed' },
  { signal: 'Failure mode', traditional: 'Exception, timeout', agent: 'Hallucination, context overflow, tool error' },
  { signal: 'Debug artifact', traditional: 'Stack trace', agent: 'Prompt, completion, and the reasoning chain between them' },
];

export const SPAN_TYPES = [
  { span: 'create_agent', meaning: 'An agent is defined (its tools, model, instructions)', carries: 'agent.name, gen_ai.system' },
  { span: 'invoke_agent', meaning: 'One full agent run, root of the trace', carries: 'gen_ai.request.model, session' },
  { span: 'invoke_workflow', meaning: 'Orchestration across multiple agents handing off', carries: 'workflow id, child agent runs' },
  { span: 'execute_tool', meaning: 'One tool call, sibling of the chat step that proposed it', carries: 'gen_ai.tool.name, call id, mcp.* for protocol detail' },
  { span: 'chat', meaning: 'The model inference call itself', carries: 'input/output tokens, response model, finish reasons' },
];

export const ALERTS = [
  { metric: 'Token usage rate', condition: '> 2× baseline over 10 min', why: 'Runaway loop or a prompt-injection attempt' },
  { metric: 'Operation duration, p99', condition: '> 30 s', why: 'Model overloaded, or the context window is too large' },
  { metric: 'Error rate', condition: '> 2% over 5 min', why: 'Rate limiting or quota exhaustion — catch it before users do' },
  { metric: 'Input:output token ratio', condition: 'Consistently > 10:1', why: 'The system prompt has quietly bloated' },
];

// Three sample traces, offsets/durations in ms.
export const SAMPLE_RUNS = [
  {
    id: 'clean',
    name: 'Run A · clean',
    totalMs: 1420,
    inputTokens: 2100, outputTokens: 640, errors: 0,
    spans: [
      { name: 'invoke_agent', start: 0, dur: 1420 },
      { name: 'chat', start: 40, dur: 620, tokens: { in: 1500, out: 480 } },
      { name: 'execute_tool · search_kb', start: 680, dur: 310 },
      { name: 'chat', start: 1010, dur: 370, tokens: { in: 600, out: 160 } },
    ],
    verdict: 'Two chat steps, one tool call, token split visible per model call. Nothing to chase.',
  },
  {
    id: 'duplicate',
    name: 'Run B · duplicate tool call',
    totalMs: 1850,
    inputTokens: 2400, outputTokens: 700, errors: 0,
    spans: [
      { name: 'invoke_agent', start: 0, dur: 1850 },
      { name: 'chat', start: 40, dur: 920, tokens: { in: 1700, out: 520 } },
      { name: 'execute_tool · refund_lookup', start: 700, dur: 310 },
      { name: 'execute_tool · refund_lookup', start: 1030, dur: 295, duplicate: true },
      { name: 'chat', start: 1360, dur: 470, tokens: { in: 700, out: 180 } },
    ],
    verdict: 'Two refund_lookup calls as siblings under one chat span — the answer was built from the second call. Visible in the shape, invisible to the dashboard.',
  },
  {
    id: 'runaway',
    name: 'Run C · runaway loop',
    totalMs: 61200,
    inputTokens: 48000, outputTokens: 900, errors: 3,
    spans: [
      { name: 'invoke_agent', start: 0, dur: 61200 },
      { name: 'chat', start: 50, dur: 8200, tokens: { in: 9000, out: 200 } },
      { name: 'execute_tool · fetch_orders', start: 8300, dur: 400 },
      { name: 'chat', start: 8800, dur: 9100, tokens: { in: 10000, out: 200 } },
      { name: 'execute_tool · fetch_orders', start: 18000, dur: 380, duplicate: true },
      { name: 'chat', start: 18500, dur: 9500, tokens: { in: 11000, out: 200 }, error: true },
      { name: 'chat', start: 28200, dur: 10200, tokens: { in: 12000, out: 150 }, error: true },
      { name: 'execute_tool · fetch_orders', start: 38600, dur: 410, duplicate: true },
      { name: 'chat', start: 39200, dur: 11000, tokens: { in: 13000, out: 150 }, error: true },
    ],
    verdict: 'The model re-plans the same fetch three times, each chat span wider than the last, errors accumulating. Token rate is the alarm that fires first.',
  },
];

export function evaluateRun(run, thresholds) {
  const findings = [];
  const toolCounts = {};
  for (const s of run.spans) {
    if (s.name.startsWith('execute_tool')) toolCounts[s.name] = (toolCounts[s.name] || 0) + 1;
  }
  for (const [name, n] of Object.entries(toolCounts)) {
    if (n > 1) findings.push({ level: 'warn', text: `${name} called ${n}× — redundant tool loop`, span: name });
  }
  const chatSpans = run.spans.filter((s) => s.name === 'chat');
  const widest = chatSpans.reduce((a, b) => (b.dur > (a?.dur || 0) ? b : a), null);
  if (widest && widest.dur > 8000) {
    findings.push({ level: 'warn', text: `Widest chat span is ${(widest.dur / 1000).toFixed(1)}s — time and token budget concentrate here`, span: 'chat' });
  }
  const errSpans = run.spans.filter((s) => s.error).length;
  if (errSpans > 0) findings.push({ level: 'error', text: `${errSpans} chat span(s) carry error status — record_exception + set_status visible in viewer`, span: 'chat' });
  const ratio = run.inputTokens / Math.max(1, run.outputTokens);
  if (ratio > thresholds.ratio) findings.push({ level: 'warn', text: `Input:output ratio ${ratio.toFixed(1)}:1 > ${thresholds.ratio}:1 — system prompt likely bloated`, span: 'metrics' });
  if (run.inputTokens > thresholds.tokenMultiplier * 20000) {
    findings.push({ level: 'error', text: `Token usage ${run.inputTokens.toLocaleString()} ≫ baseline (${thresholds.tokenMultiplier}× 20k) — runaway loop alarm fires`, span: 'metrics' });
  }
  if (run.totalMs > 30000) findings.push({ level: 'error', text: `Run duration ${(run.totalMs / 1000).toFixed(0)}s > p99 threshold 30s`, span: 'metrics' });
  if (run.errors > 0) findings.push({ level: 'error', text: `Error rate signal: ${run.errors} failed step(s) in one run`, span: 'metrics' });
  if (findings.length === 0) findings.push({ level: 'ok', text: 'No anomalies: no duplicates, ratio within bounds, duration under p99 threshold.', span: '—' });
  return findings;
}

export const SAMPLING_TIERS = [
  { situation: 'Development', rate: '100%', why: 'Full capture is cheap and every run is interesting' },
  { situation: 'Routine production success', rate: '5–10%', why: 'Spans are large and model calls are slow — full capture adds cost, not value' },
  { situation: 'Errors', rate: '100%', why: 'Exactly the runs you will want to look back at' },
  { situation: 'High-token requests', rate: '100%', why: 'Cost anomalies are the ones finance asks about' },
  { situation: 'Full agent runs', rate: '100%', why: 'End-to-end context for incident reconstruction' },
];

export const PRIVACY_RULES = [
  { rule: 'Prompt/completion content → span events, not attributes', why: 'Attributes are always indexed and exported unbounded; events can be filtered, truncated, or dropped at the Collector' },
  { rule: 'Strip at the Collector, not in app code', why: 'One transform removes content from every span crossing the pipeline — no scattered call-site changes' },
  { rule: 'Log result length, not result content', why: 'A length or truncated preview spots the problem without making every log line a privacy liability' },
  { rule: 'Attach trace_id to every log line', why: 'Turns scattered statements into a filter for the exact run that broke' },
];

export const CODE_LOGGING = `import logging
from opentelemetry import trace

logger = logging.getLogger("agent")

def call_tool(tool_name: str, arguments: dict):
    # get_current_span() reads whatever span is active right now —
    # no need to thread a trace id through every layer.
    span = trace.get_current_span()
    trace_id = format(span.get_span_context().trace_id, "032x")
    logger.info("tool_call_started", extra={
        "trace_id": trace_id, "tool_name": tool_name, "arguments": arguments,
    })
    try:
        result = execute_tool(tool_name, arguments)
        # length, not content: enough to spot a problem, safe to store
        logger.info("tool_call_succeeded", extra={
            "trace_id": trace_id, "tool_name": tool_name,
            "result_length": len(str(result)),
        })
        return result
    except Exception as e:
        logger.error("tool_call_failed", extra={
            "trace_id": trace_id, "tool_name": tool_name, "error": str(e),
        })
        raise`;

export const CODE_TRACING = `from opentelemetry import trace
from opentelemetry.trace import Status, StatusCode

tracer = trace.gettracer("agent-service")

def run_agent(task: str) -> str:
    # Root span: everything below nests inside it automatically,
    # because nested with-blocks define parentage — never wired by hand.
    with tracer.start_as_current_span("invoke_agent") as agent_span:
        agent_span.set_attributes({"agent.name": "support-agent"})
        messages = [{"role": "user", "content": task}]
        while True:
            with tracer.start_as_current_span("chat") as chat_span:
                response = model_client.chat(messages=messages, tools=TOOLS)
                chat_span.set_attributes({
                    "gen_ai.usage.input_tokens": response.usage.prompt_tokens,
                    "gen_ai.usage.output_tokens": response.usage.completion_tokens,
                })
                choice = response.choices[0]
            if choice.finish_reason != "tool_calls":
                agent_span.set_status(Status(StatusCode.OK))
                return choice.message.content
            # Tool spans are siblings of chat, not children of it:
            # a tool call is a separate step the chat step merely proposed.
            for tool_call in choice.message.tool_calls:
                with tracer.start_as_current_span("execute_tool") as tool_span:
                    tool_span.set_attribute("gen_ai.tool.name", tool_call.name)
                    try:
                        result = call_tool(tool_call.name, tool_call.arguments)
                    except Exception as e:
                        tool_span.record_exception(e)
                        tool_span.set_status(Status(StatusCode.ERROR, str(e)))
                        raise
                messages.append({"role": "tool", "content": str(result)})`;

export const CODE_METRICS = `from opentelemetry import metrics
import time

meter = metrics.get_meter("agent-service")
token_counter = meter.create_counter("gen_ai.client.token.usage", unit="token")
duration_histogram = meter.create_histogram("gen_ai.client.operation.duration", unit="s")

def tracked_chat(messages: list) -> str:
    attrs = {"gen_ai.request.model": MODEL}
    start = time.time()
    try:
        response = model_client.chat(messages=messages)
        # Two separate counter calls — input and output are priced
        # differently, and splitting them exposes a bloated system prompt.
        token_counter.add(response.usage.prompt_tokens, {**attrs, "gen_ai.token.type": "input"})
        token_counter.add(response.usage.completion_tokens, {**attrs, "gen_ai.token.type": "output"})
        return response.choices[0].message.content
    finally:
        duration_histogram.record(time.time() - start, attrs)`;

export const PIPELINE_STEPS = [
  { step: 'Instrumented app', detail: 'Spans, counters, structured logs with trace_id' },
  { step: 'Collector', detail: 'Receives, samples, transforms, strips prompt content' },
  { step: 'Storage / viewer', detail: 'Waterfall rendering, metric dashboards, alert rules' },
  { step: 'Debug loop', detail: 'Bad output → trace id → waterfall → span attributes' },
];
