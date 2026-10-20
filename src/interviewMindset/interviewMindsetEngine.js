// ── Interview mindset engine — what a thousand big-tech interviews teach.
// Original teaching content. No sources, URLs, authors, or company names.
// Durations and counts are illustrative of typical big-tech loops.

export const ROUNDS = [
  { id: 'coding', icon: '💻', name: 'Coding round', minutes: 40, format: '~2 problems, talk-aloud', answers: 'Should we hire you?', key: 'Clear the bar — but it is only the bar' },
  { id: 'ai', icon: '🤖', name: 'AI-assisted coding', minutes: 60, format: 'Existing multi-file codebase + terminal + tests', answers: 'Should we hire you?', key: 'Navigate unfamiliar code with an AI tool you drive' },
  { id: 'design', icon: '🏛️', name: 'System design', minutes: 45, format: 'Complex system or product architecture', answers: 'At what level?', key: 'Drive the conversation; narrate trade-offs' },
  { id: 'behavioral', icon: '🗣️', name: 'Behavioral', minutes: 45, format: 'Projects, feedback, failure, leadership', answers: 'At what level?', key: 'Own your stories; numbers over adjectives' },
];

export const CODING_AXES = [
  { id: 'code', name: 'Coding', icon: '⌨️', asks: 'Can you write the solution?', fail: 'The round ends here — nothing else rescues a failed code bar' },
  { id: 'comm', name: 'Communication', icon: '💬', asks: 'Do you ask questions and explain your thinking?', fail: 'A silent correct answer looks like a memorized answer' },
  { id: 'solve', name: 'Problem-solving', icon: '🧩', asks: 'Do you compare approaches and trade-offs?', fail: 'One shot in the dark with no alternatives reads as luck' },
  { id: 'verify', name: 'Verification', icon: '🔬', asks: 'Can you test it and catch your own bugs?', fail: 'Untested code is unfinished code — this axis is where bugs become positives' },
];

export const CONVERSATION_LADDER = [
  { n: 1, step: 'Clarify', detail: 'Ask questions until you are sure you understand the problem — constraints, inputs, edge cases' },
  { n: 2, step: 'Explore', detail: 'Talk through two possible approaches and the trade-offs of each' },
  { n: 3, step: 'Choose', detail: 'Pick one and say why — the justification is the signal' },
  { n: 4, step: 'Narrate', detail: 'Explain your thinking as you code — never go quiet for long stretches' },
  { n: 5, step: 'Verify', detail: 'Walk one or two test cases out loud; if you find a bug, name it and fix it' },
];

export const HINT_LADDER = [
  { response: 'Defend the failing approach', outcome: 'fail', why: 'The nudge was an offer of help; defending signals you cannot course-correct' },
  { response: 'Ignore the nudge and keep coding', outcome: 'fail', why: 'Interviewers want to help you succeed — missing the hint wastes their lifeline' },
  { response: 'Notice, confirm, then pivot', outcome: 'pass', why: 'Stop, restate the hint as a question, then change approach — this is the hire pattern' },
];

export const HINT_EXAMPLE = '“What if the data set were much larger?” — a nudge away from an approach that will not scale.';

export const BUG_RULES = [
  { rule: 'Bugs are not automatic fails', detail: 'Finding and catching your own bugs during verification is explicitly a positive signal' },
  { rule: 'But you cannot leave it buggy', detail: 'The verification step exists to show you can test your own work — skipping it is the real failure' },
  { rule: 'Name it, explain it, fix it', detail: '“Here is an edge case that crashes — I will add a guard” beats silent patching or silent freezing' },
  { rule: 'Freezing or hiding is worse than the bug', detail: 'Saying nothing and hoping the interviewer did not notice is the one path that always hurts' },
];

export const PRACTICE_DRILLS = [
  { drill: 'Record yourself', how: 'Code while talking to your phone camera; watch it back', lookFor: 'Long silences, unclear explanations, nervous tics you never knew you had' },
  { drill: 'Pattern reps, not pattern depth', how: 'A handful of problems per core pattern — recognize, solve, explain', lookFor: 'Weeks lost to one deep pattern while others rot' },
  { drill: 'Talk-aloud solves', how: 'Every practice problem spoken, never silent', lookFor: 'Whether you can narrate and code at the same time' },
  { drill: 'Bug-hunt passes', how: 'After each solve, deliberately break it, then find and fix the break', lookFor: 'Whether verification is muscle memory or an afterthought' },
];

export const TOPIC_FOCUS = [
  { topic: 'Iteration', why: 'Two-pointer and scan patterns cover a huge share of real prompts', reps: 'Handful of easy → hard reps each' },
  { topic: 'Sorting', why: 'Sorting plus a sweep answers more problems than any exotic structure', reps: 'Sort-then-scan variants' },
  { topic: 'Divide & conquer', why: 'Binary search and merge thinking recur in every round format', reps: 'Search-on-sorted, merge intervals' },
  { topic: 'Recursion', why: 'Tree/graph walks and backtracking build on recursive fluency', reps: 'DFS/BFS, simple backtracking' },
];

export const TOPIC_CAUTION = 'Confirm with your recruiter which advanced, memorization-heavy topics are excluded — grinding one banned pattern for weeks is the classic burnout trap.';

export const AI_ROUND = [
  { aspect: 'The setting', detail: 'An existing multi-file codebase, a terminal, and unit tests — not a blank editor' },
  { aspect: 'The work', detail: 'Find and fix planted bugs, add features, handle edge cases and scaling concerns' },
  { aspect: 'The tool', detail: 'An in-house AI assistant you have never used — budget time to learn its affordances' },
  { aspect: 'The trap', detail: 'Candidates who blindly accept every AI suggestion, unable to explain the diff' },
  { aspect: 'You stay in control', detail: 'The interviewer still needs to understand YOUR thinking — AI writes some lines, you own the design' },
];

export const AI_PRACTICE = [
  { habit: 'Read unfamiliar code first', detail: 'Spend practice sessions in repos you did not write before touching a single prompt' },
  { habit: 'Hunt bugs with AI as a sidekick', detail: 'Use the assistant to propose fixes, then verify each diff against the tests yourself' },
  { habit: 'Change code, run tests, explain the diff', detail: 'The interview loop is: edit → run → justify. Practice it as one motion' },
  { habit: 'Ask for the practice environment', detail: 'Recruiters can often grant early access to the same tooling used on interview day' },
];

export const DESIGN_DRIVERS = [
  { n: 1, move: 'Ask what is required', detail: 'Users? Volume? Latency? Freshness? Scope before solution' },
  { n: 2, move: 'Sketch the shape', detail: 'Boxes and arrows; name the interfaces before the internals' },
  { n: 3, move: 'Narrate trade-offs', detail: 'Push vs pull, cache vs recompute — say why you pick one, not just that you picked' },
  { n: 4, move: 'Drive, do not wait', detail: 'The conversation is yours to lead — initiative is being graded alongside the diagram' },
  { n: 5, move: 'Senior extra: own a real system', detail: 'Walk a system you designed end-to-end, then answer: what would you change if you did it again?' },
];

export const PUSH_PULL = [
  { axis: 'Push updates', pro: 'Instant delivery; no polling load', con: 'Connection state, fan-out cost, ordering headaches', tell: 'Say why freshness justifies the machinery' },
  { axis: 'Pull updates', pro: 'Simple, stateless servers, easy caching', con: 'Latency bound by poll interval; wasted requests', tell: 'Say why the latency budget tolerates polling' },
];

export const SUCCESS_LADDER = [
  { answer: '“I learned a lot.”', reveals: 'Growth is your metric — fine for juniors, thin for seniors' },
  { answer: '“My team had a great time.”', reveals: 'Team climate over outcomes' },
  { answer: '“We shipped on schedule.”', reveals: 'Delivery reliability is your definition' },
  { answer: '“My manager loved it.”', reveals: 'Upward approval is your definition' },
  { answer: '“It got me promoted.”', reveals: 'Career progress is your definition' },
];

export const BEHAVIORAL_PROBES = [
  { probe: 'How do you take feedback?', looksFor: 'Specific instance, what changed in your behavior, evidence of the change' },
  { probe: 'What do you do under uncertainty?', looksFor: 'How you reduce ambiguity — experiments, deciders, reversible bets' },
  { probe: 'Project canceled — then what?', looksFor: 'Grace, salvage learning, where you redirected the team' },
  { probe: 'How do you know your work mattered?', looksFor: 'Metrics you chose, before/after numbers, counterfactual honesty' },
  { probe: 'Tell me about your leadership.', looksFor: 'Influence without authority, mentoring, decisions you owned' },
];

export const STAR_FIELDS = [
  { field: 'Situation', prompt: 'Where were you? One or two sentences of context only', weak: 'Three paragraphs of org history', strong: '“A service kept falling over during traffic spikes.”' },
  { field: 'Task', prompt: 'What was yours to own?', weak: '“We needed to fix it” (passive, team-only)', strong: '“I led the root-cause work on the bottleneck.”' },
  { field: 'Action', prompt: 'What did YOU do, and why that?', weak: 'Generic teamwork adjectives', strong: '“I redesigned the hot path and added load shedding at the edge.”' },
  { field: 'Result', prompt: 'What changed? Numbers if you can', weak: '“It went better after.”', strong: '“3× the traffic, zero incidents since launch.”' },
];

export const SENIOR_STORY_CHECKS = [
  { check: 'Multi-month complexity', detail: 'Duration is not the point — depth of decisions is' },
  { check: 'You helped design it', detail: 'Not just implemented someone else\u2019s architecture' },
  { check: 'You launched it', detail: 'Shipping is where trade-offs become real' },
  { check: 'You lived with the consequences', detail: 'What broke six months later? What would you redo?' },
];

export const BLUFF_LADDER = [
  { move: 'Bluff confidently', grade: 'red', why: 'Confident wrongness blocks every hint the interviewer could offer — this is the path that fails people' },
  { move: '“I don\u2019t know.” (full stop)', grade: 'amber', why: 'Honest, but leaves the room empty — safe floor, not a hire' },
  { move: '“Haven\u2019t done this — here is how I\u2019d reason about it.” + clarifying question', grade: 'green', why: 'Honesty plus reasoning invites hints and mirrors how real teammates work' },
];

export const WINNER_TRAITS = [
  { trait: 'Talked through their approaches', detail: 'The interviewer could always see the next step' },
  { trait: 'Listened when help was offered', detail: 'Hints landed; they confirmed and pivoted' },
  { trait: 'Caught their own mistakes', detail: 'Bugs became demonstrations of verification skill' },
  { trait: 'Understood, never memorized', detail: 'Recognition over recall — they could rebuild the solution live' },
];

export const RECRUITER_USES = [
  { ask: 'Which round flavor will I get?', why: 'Design rounds split into scale-vs-distributed vs product-architecture — prepare for the one you will actually face' },
  { ask: 'Which topics are excluded?', why: 'Official topic lists change; a recruiter answer saves weeks of misdirected grinding' },
  { ask: 'Can I access the practice environment?', why: 'Early hands-on with the in-house AI tool removes day-of surprises' },
  { ask: 'What does this level expect?', why: 'Recruiters know the bar language; they are your coach through the loop' },
];

export const ROUND_CODE = `# Verification is a spoken ritual, not a private thought
def solve(nums, target):          # first draft — and it has a bug
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:    # misses the i itself edge case
            return [seen[target - x], i]
        seen[x] = i

# Walk a test case OUT LOUD:
#   nums=[3,3], target=6 → i=0, x=3, seen={} → miss → seen={3:0}
#                              i=1, x=3 → found at 0 → [0, 1]  ✓
#   nums=[3], target=6    → loop ends, returns None  ✗ no pair exists
#   Name the bug: an input with no valid pair falls through silently.
#   Fix: raise or return [] explicitly. Move on — you just PASSED
#   the verification axis by catching it yourself.`;

export const BLUF_TEMPLATE = `# The three-line recovery when you are stuck
1. “I haven’t worked with this specific pattern before —
   let me reason it out from what I do know.”
2. Clarifying question: “Can the input contain duplicates /
   is it sorted / how large can it get?”
3. Loud first attempt: “If I sort first, I could then …
   does that direction seem reasonable?”`;
