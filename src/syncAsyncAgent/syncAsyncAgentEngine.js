// ── Synchronous vs asynchronous agent execution — data & pure logic ──
// Illustrative numbers only: a gateway-style limit vs a long agent run.

export const SYNC_LIMIT_S = 29;
export const EXAMPLE_LONG_RUN_S = 45;

export const SYNC_STEPS = [
  { id: 'ask', label: 'Client asks', detail: 'One request opens one connection and waits.' },
  { id: 'hold', label: 'Thread stays blocked', detail: 'The waiting thread can do nothing else while the agent works.' },
  { id: 'limit', label: 'Illustrative limit hits', detail: 'Around 29s the gateway gives up and drops the connection.' },
  { id: 'waste', label: 'Work burns on', detail: 'The agent may run to 45s anyway — tokens spent, nobody listening.' },
];

export const ASYNC_STAGES = [
  { id: 'submit', label: 'Submit', detail: 'Client sends the task, gets a job id back instantly.' },
  { id: 'queue', label: 'Queue', detail: 'A message broker holds the job durably until a worker is free.' },
  { id: 'work', label: 'Background workers', detail: 'Workers pull jobs and run the agent steps off-request.' },
  { id: 'checkpoint', label: 'State checkpointing', detail: 'Progress is saved to a state store every few steps.' },
  { id: 'finish', label: 'Poll or notify', detail: 'Client polls the job id, or gets a push when it completes.' },
];

export const INFRA_ROWS = [
  { part: 'Message broker', role: 'Durable queue', note: 'Holds submitted jobs so nothing is lost if workers are busy or restart.' },
  { part: 'Background workers', role: 'Off-request runners', note: 'Pull one job at a time and run the agent loop away from the user connection.' },
  { part: 'State store', role: 'Checkpoints + status', note: 'Records step progress and final result keyed by job id; survives crashes.' },
  { part: 'Polling endpoint', role: 'Status reads', note: 'Client asks "done yet?" with the job id; simple, works everywhere.' },
  { part: 'Push notify', role: 'Completion signal', note: 'A callback or socket event tells the client the moment the job finishes.' },
];

export const FAILURE_MODES = [
  { failure: 'Lost jobs', cause: 'Worker crashes before saving progress', mitigation: 'Acknowledge only after a checkpoint lands in the state store; requeue the rest.' },
  { failure: 'Duplicate delivery', cause: 'Retries and redeliveries run the same job twice', mitigation: 'Make handlers idempotent: one job id writes its result exactly once.' },
  { failure: 'Unbounded queues', cause: 'Submits outpace workers and the backlog grows forever', mitigation: 'Cap queue depth, shed or delay excess load, and scale workers on backlog size.' },
];

// ── Sync verdict: does the run finish before the connection gives up? ──
export function evaluateSyncRun(taskSeconds, timeoutSeconds) {
  const task = Number(taskSeconds);
  const limit = Number(timeoutSeconds);
  if (task <= limit) {
    return {
      success: true,
      verdict: 'SUCCESS',
      droppedAt: null,
      wastedSeconds: 0,
      message: 'Run finished before the connection gave up — holding the line was fine.',
    };
  }
  return {
    success: false,
    verdict: 'TIMEOUT',
    droppedAt: limit,
    wastedSeconds: task - limit,
    message: 'Connection dropped while the agent kept working — tokens burned with nobody listening.',
  };
}

// ── Async sketch: how many polls and checkpoints does a run produce? ──
export function simulateAsyncRun(taskSeconds, pollIntervalSeconds, checkpointEverySeconds = 5) {
  const task = Math.max(0, Number(taskSeconds));
  const poll = Math.max(1, Number(pollIntervalSeconds));
  const every = Math.max(1, Number(checkpointEverySeconds));
  const polls = Math.ceil(task / poll);
  const checkpoints = Math.floor(task / every);
  return { polls, checkpoints, totalWallSeconds: task };
}

export const DECISION_PRESETS = [
  { id: 'quick-answer', label: 'Quick answer', durationS: 4, toleranceS: 10, complexity: 1 },
  { id: 'draft-doc', label: 'Draft a document', durationS: 25, toleranceS: 30, complexity: 2 },
  { id: 'deep-research', label: 'Deep research pass', durationS: 45, toleranceS: 20, complexity: 4 },
  { id: 'nightly-digest', label: 'Nightly digest', durationS: 300, toleranceS: 10, complexity: 3 },
  { id: 'tricky-but-short', label: 'Short but tangled', durationS: 12, toleranceS: 30, complexity: 5 },
];

// ── Pattern picker: duration × patience × complexity → SYNC or ASYNC ──
export function pickPattern({ durationS, toleranceS, complexity }) {
  const duration = Number(durationS);
  const tolerance = Number(toleranceS);
  const level = Number(complexity);
  if (duration > SYNC_LIMIT_S) {
    return {
      pattern: 'ASYNC',
      reason: 'Run exceeds the illustrative 29s gateway limit — the connection would drop.',
    };
  }
  if (duration > tolerance) {
    return {
      pattern: 'ASYNC',
      reason: 'Run exceeds the wait window — return a job id instead of holding the line.',
    };
  }
  if (level >= 4) {
    return {
      pattern: 'ASYNC',
      reason: 'High-complexity multi-step work — checkpoint it in the background.',
    };
  }
  return {
    pattern: 'SYNC',
    reason: 'Short, simple, and fits inside the wait window — hold the connection.',
  };
}

export const CODE_SYNC = `# Wait-and-see: one connection held open for the whole run.
GATEWAY_LIMIT_S = 29  # illustrative: the front door gives up here

def handle(question):
    answer = run_agent(question)          # blocks the thread
    if answer.seconds > GATEWAY_LIMIT_S:
        raise DroppedConnection("client already gone; work still burned")
    return answer

# A 45s agent run on a 29s limit: dropped at 29s, 16s of tokens wasted.
`;

export const CODE_ASYNC = `# Fire-and-forget: submit a job, poll the job id, resume from checkpoints.
def submit(task):
    job_id = broker.enqueue(task)         # durable queue entry
    return {"job_id": job_id}             # instant reply, connection free

def worker_loop():
    while True:
        job = broker.dequeue()            # one job per worker
        for step in run_agent_steps(job):
            state_store.save(job.id, step)  # checkpoint every few steps
        state_store.mark_done(job.id)

def status(job_id):
    return state_store.read(job_id)       # client polls, or waits for a push

# Crash between steps? Next worker resumes from the last checkpoint.
`;
