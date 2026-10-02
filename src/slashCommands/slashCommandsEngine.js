// ── Slash commands for better answers — data & pure logic ──

export const COMMANDS = [
  {
    cmd: '/human',
    effect: 'Ask a clarifying question before answering instead of guessing intent.',
    expect: 'One focused question, then an answer shaped by your reply.',
    sample: 'Write the onboarding email.',
    sampleInput: 'Write the onboarding email.',
    exampleOutput: 'Question: is this for developers joining the API beta or non-technical customers? Tone — formal or casual? Once you answer, the draft follows.',
  },
  {
    cmd: '/critic',
    effect: 'First pass finds weaknesses, omissions, and hidden assumptions in your draft.',
    expect: 'A numbered critique list — no flattery, no rewrite yet.',
    sample: 'Critique our migration plan draft.',
    sampleInput: 'Draft plan: move all traffic Saturday, cut over in one step.',
    exampleOutput: '1. No rollback window — a bad cutover has no reverse path. 2. Saturday traffic still hits 18% of weekly peak. 3. Cache invalidation during cutover is unspecified…',
  },
  {
    cmd: '/tldr',
    effect: 'Compress a long answer, article, or thread to the load-bearing points.',
    expect: 'Two to five bullets, no preamble.',
    sample: 'TLDR this 40-page report.',
    sampleInput: 'Summarize the attached quarterly report for an engineer.',
    exampleOutput: '• Latency regression traced to the new auth middleware. • Headcount plan unchanged. • Two launch dates slip one week each.',
  },
  {
    cmd: '/senior',
    effect: 'Answer at senior-engineer depth: trade-offs, edge cases, “it depends” made explicit.',
    expect: 'Structured reasoning with alternatives, not a single confident answer.',
    sample: '/senior Should we shard this table?',
    sampleInput: 'Should we shard the events table?',
    exampleOutput: 'Depends on write hotspot locality. Option A: hash shard — even load, painful cross-shard queries. Option B: time shard — easy purges, hot partitions…',
  },
  {
    cmd: '/diff',
    effect: 'Show what changed — between versions, approaches, or your draft and a revision.',
    expect: 'A side-by-side or added/removed list.',
    sample: '/diff Compare v1 and v2 configs.',
    sampleInput: 'Compare these two config files.',
    exampleOutput: '+ retries: 5  − retries: 2   + timeout_ms: 800  − timeout_ms: 2000  (changes concentrate in failure handling)',
  },
  {
    cmd: '/bullets',
    effect: 'Force bullet output — nothing to read in paragraph form.',
    expect: 'Flat or nested bullets only.',
    sample: '/bullets What does the on-call rotation cover?',
    sampleInput: 'Explain the on-call rotation.',
    exampleOutput: '• Weekday pager: primary + secondary. • Weekends: primary only. • Escalation after 15 min…',
  },
  {
    cmd: '/table',
    effect: 'Turn the answer into a comparison table with consistent columns.',
    expect: 'A table: one option per row, one criterion per column.',
    sample: '/table Compare these three queues.',
    sampleInput: 'Compare SQS, Kafka, and RabbitMQ for us.',
    exampleOutput: '| Criterion | SQS | Kafka | RabbitMQ | — ordering, retention, throughput, ops burden, cost model…',
    favorite: true,
  },
  {
    cmd: '/devilsadvocate',
    effect: 'Argue the opposite position as hard as the evidence allows.',
    expect: 'The strongest counter-case to your plan.',
    sample: '/devilsadvocate Our plan to rewrite is correct.',
    sampleInput: 'Argue against rewriting the billing service.',
    exampleOutput: 'A rewrite ships zero value until day one. The current bugs cluster in one module — extract that, keep the 90% that works, and avoid a big-bang freeze…',
  },
  {
    cmd: '/rubberduck',
    effect: 'Explain the problem step by step — you catch the bug while saying it out loud.',
    expect: 'Guided walkthrough that pauses for your thinking, not a solution dump.',
    sample: '/rubberduck The off-by-one only fails on Mondays.',
    sampleInput: 'Walk me through why this fails only on Mondays.',
    exampleOutput: 'Step 1: what changes on Mondays? Step 2: does the index start Sunday or Monday? Walk me through your loop bounds before we look at code…',
  },
];

export const BEFORE_AFTER = [
  { request: 'Summarize this report', without: 'Paragraph summary of variable length, often with preamble', with: '/tldr → two to five bullets, straight away' },
  { request: 'Compare two options', without: 'Prose that drifts; criteria change mid-answer', with: '/table → fixed columns, one row per option' },
  { request: 'Is this plan sound?', without: 'Polite agreement, shallow notes', with: '/critic → numbered weaknesses; /devilsadvocate → the counter-case' },
  { request: 'Why does my code fail?', without: 'Ready-made answer that may solve the wrong thing', with: '/rubberduck → guided explanation that surfaces your own insight' },
];

export const DIY_COMMANDS = [
  { cmd: '/short', definition: 'Answer in a maximum of three sentences. No preamble, no summary at the end.' },
  { cmd: '/pitch', definition: 'Rewrite the input as a 60-second elevator pitch: hook, problem, solution, ask.' },
  { cmd: '/kids', definition: 'Explain the input to a curious 12-year-old: one analogy, no jargon, ≤ 150 words.' },
  { cmd: '/verify', definition: 'Before answering, list what would need to be true for the input to be correct, then check each.' },
];

export function composePrompt(cmd, input) {
  const c = COMMANDS.find((x) => x.cmd === cmd);
  if (!c) return input;
  return `${cmd} ${input}`;
}

export function customInstructionText(cmds = DIY_COMMANDS) {
  const lines = cmds.map((c) => `When the message starts with "${c.cmd}", ${c.definition.replace(/\.$/, '')}.`);
  return [
    '# Custom commands (paste into your custom instructions)',
    '# A command is just a trigger phrase + a fixed contract for the response.',
    '',
    ...lines,
    '',
    '# Rules:',
    '# - One command per message; commands come first, before the actual request.',
    '# - Commands change the SHAPE of the answer, not the topic.',
    '# - Keep the list short: every command competes with every other.',
  ].join('\n');
}

export const CODE_BUILDER = `# Build a command library as data — one source of truth for prompt and docs.
COMMANDS = {
    "/tldr": {
        "contract": "Reply with 2-5 bullets. No preamble, no closing summary.",
        "shape": "bullets",
    },
    "/table": {
        "contract": "One option per row, criterion per column. Include a source row.",
        "shape": "markdown_table",
    },
    "/critic": {
        "contract": "Numbered list of weaknesses and missing assumptions. Do not rewrite yet.",
        "shape": "numbered_list",
    },
}

def build_system_prompt(selected: list[str]) -> str:
    rules = [f'If the message starts with "{c}", {COMMANDS[c]["contract"]}'
             for c in selected if c in COMMANDS]
    return "Response-shape rules:\\n" + "\\n".join(rules)

# Response shape becomes contract text the model follows — and something
# you can unit-test: assert output shape == COMMANDS[cmd]["shape"].`;

export const CODE_VALIDATE = `import re, sys

KNOWN = {"/human", "/critic", "/tldr", "/senior", "/diff",
         "/bullets", "/table", "/devilsadvocate", "/rubberduck"}
CUSTOM = {"/short", "/pitch", "/kids", "/verify"}

def validate(cmds: set[str]) -> list[str]:
    errors = []
    if len(cmds) > 6:
        errors.append("too many commands: attention splits, conflicts multiply")
    if cmds & KNOWN and cmds & CUSTOM and (cmds & KNOWN) != {"/tldr"}:
        pass  # mixing is fine; just keep names unique
    for c in cmds:
        if not re.fullmatch(r"/[a-z]{3,16}", c):
            errors.append(f"{c}: use /lowercase, 3-16 letters — no spaces or symbols")
    if len(cmds) != len(set(cmds)):
        errors.append("duplicate command names")
    return errors

if __name__ == "__main__":
    errs = validate(set(sys.argv[1:]))
    [print("ERR:", e) for e in errs]
    sys.exit(1 if errs else 0)`;
