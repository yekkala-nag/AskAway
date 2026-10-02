import React from 'react';
import LearningTabSkeleton from '../components/learning/LearningTabSkeleton.jsx';

const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" };
const C = { surface: '#161B26', border: '#2A3548', text: '#E2E8F0', muted: '#B8B8C4', teal: '#5EC4C8', coral: '#E8837A', lav: '#C9B8E8', ok: '#6BD4A0', bad: '#E8837A', warn: '#E8C37A', bg: '#0F1219' };
const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 };
const label = (color) => ({ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10, ...mono });
const body = { color: C.text, fontSize: 13, lineHeight: 1.75 };
const muted = { color: C.muted, fontSize: 12.5, lineHeight: 1.7 };

function H({ children, color = C.teal }) { return <div style={{ ...label(color), marginTop: 4 }}>{children}</div>; }
function P({ children }) { return <p style={{ ...body, margin: '0 0 10px' }}>{children}</p>; }
function Section({ children }) { return <div style={card}>{children}</div>; }

/* Native SVG: working memory (context window) vs external long-term store */
function MemoryBigPicture() {
  return (
    <svg viewBox="0 0 860 320" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Context window as working memory connected to external long-term stores">
      <rect x="0" y="0" width="860" height="320" rx="10" fill="#0F1219" />
      {/* context window */}
      <rect x="40" y="60" width="330" height="200" rx="10" fill="#161B26" stroke="#5EC4C8" strokeWidth="2" />
      <text x="55" y="45" fill="#5EC4C8" fontSize="13" fontFamily="monospace">CONTEXT WINDOW — working memory</text>
      <rect x="60" y="90" width="290" height="46" rx="6" fill="#5EC4C822" stroke="#5EC4C8" strokeWidth="1" />
      <text x="72" y="110" fill="#E2E8F0" fontSize="11" fontFamily="monospace">system prompt + tools</text>
      <text x="72" y="128" fill="#B8B8C4" fontSize="10" fontFamily="monospace">fixed, always resident</text>
      <rect x="60" y="146" width="290" height="52" rx="6" fill="#C9B8E822" stroke="#C9B8E8" strokeWidth="1" />
      <text x="72" y="166" fill="#E2E8F0" fontSize="11" fontFamily="monospace">conversation buffer</text>
      <text x="72" y="184" fill="#B8B8C4" fontSize="10" fontFamily="monospace">recent turns — what "just happened"</text>
      <rect x="60" y="208" width="290" height="36" rx="6" fill="#1C2433" stroke="#2A3548" strokeWidth="1" />
      <text x="72" y="230" fill="#B8B8C4" fontSize="11" fontFamily="monospace">retrieved chunks (from the store →)</text>
      {/* external store */}
      <rect x="530" y="60" width="290" height="200" rx="10" fill="#161B26" stroke="#C9B8E8" strokeWidth="2" />
      <text x="545" y="45" fill="#C9B8E8" fontSize="13" fontFamily="monospace">EXTERNAL STORE — long-term memory</text>
      {[
        { y: 86, t: 'Vector store', s: 'episodic: what happened, embeddings' },
        { y: 140, t: 'Knowledge graph / entities', s: 'semantic: who/what relates to what' },
        { y: 194, t: 'User profile + files', s: 'preference, identity, standing facts' },
      ].map((r) => (
        <g key={r.y}>
          <rect x="550" y={r.y} width="250" height="44" rx="6" fill="#1C2433" stroke="#2A3548" />
          <text x="562" y={r.y + 18} fill="#E2E8F0" fontSize="11.5" fontFamily="monospace">{r.t}</text>
          <text x="562" y={r.y + 34} fill="#B8B8C4" fontSize="9.5" fontFamily="monospace">{r.s}</text>
        </g>
      ))}
      {/* write path */}
      <path d="M 370 120 C 450 120, 450 110, 530 110" stroke="#5EC4C8" strokeWidth="2" fill="none" markerEnd="url(#arrT)" />
      <text x="395" y="100" fill="#5EC4C8" fontSize="11" fontFamily="monospace">WRITE (consolidate)</text>
      {/* read path */}
      <path d="M 530 210 C 450 210, 450 226, 370 226" stroke="#C9B8E8" strokeWidth="2" fill="none" markerEnd="url(#arrM)" />
      <text x="395" y="252" fill="#C9B8E8" fontSize="11" fontFamily="monospace">READ (retrieve top-k)</text>
      <defs>
        <marker id="arrT" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#5EC4C8" /></marker>
        <marker id="arrM" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#C9B8E8" /></marker>
      </defs>
      <text x="40" y="300" fill="#B8B8C4" fontSize="11" fontFamily="monospace">Rule: everything the model can use must be IN the window — long-term memory is just a disciplined way to decide what earns a seat.</text>
    </svg>
  );
}

const SECTIONS = [
  {
    id: 'bigpicture', icon: '🗺️', label: '1. Memory, the big picture',
    render: () => (
      <Section>
        <H>THE CONTEXT WINDOW IS THE ONLY MEMORY THE MODEL HAS</H>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
          <MemoryBigPicture />
        </div>
        <P>The model itself is stateless: every call starts cold. What looks like memory is two different systems. <strong>Working memory</strong> is the context window — system prompt, conversation, tool results, retrieved chunks — all visible at once, all paying token cost. <strong>Long-term memory</strong> lives outside the model (databases, files, graphs) and only matters when something from it is <em>retrieved into the window</em>.</P>
        <P style={muted}>This split is the whole design problem: short-term memory = <em>what to keep visible</em>; long-term memory = <em>what to store, when to write it, and when to bring it back</em>.</P>
      </Section>
    ),
  },
  {
    id: 'short', icon: '⏱️', label: '2. Short-term memory',
    render: () => (
      <Section>
        <H>CONVERSATION BUFFERS, WINDOWS, SUMMARIZATION</H>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, ...mono }}>
            <thead><tr>{['Strategy', 'How it works', 'Token cost', 'Loses what'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${C.border}`, color: C.teal, fontSize: 11 }}>{h}</th>))}</tr></thead>
            <tbody style={{ color: C.text }}>
              {[
                ['Full buffer', 'Send entire history every turn', 'Grows linearly → hits limit', 'nothing until the window overflows'],
                ['Sliding window', 'Keep last N turns (or last K tokens)', 'constant', 'anything older than the window'],
                ['Buffer + summary', 'Roll older turns into a running summary', 'constant + summary size', 'verbatim detail, keeps gist'],
                ['Hybrid (default in practice)', 'recent turns verbatim + summary + facts', 'constant, tuned', 'only trivia you chose to drop'],
              ].map((row, i) => (
                <tr key={i}>{row.map((cell, j) => (
                  <td key={j} style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}`, color: j === 0 ? C.lav : C.text }}>{cell}</td>))}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <H color={C.coral}>TOKEN-BUDGET DISCIPLINE</H>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, ...mono, fontSize: 12, color: C.text, lineHeight: 1.9 }}>
          window budget = system + tools + summary + facts + retrieved + recent turns<br />
          <span style={{ color: C.muted }}>// reserve ~30–40% for the model's answer and tool loop before retrieval starts bidding for space</span>
        </div>
        <P style={{ ...muted, marginTop: 10 }}>Summarization is lossy by design: summarize <em>decisions and commitments</em> verbatim-adjacent, chit-chat loosely — the summary should preserve what would hurt to forget.</P>
      </Section>
    ),
  },
  {
    id: 'long', icon: '🗄️', label: '3. Long-term memory',
    render: () => (
      <Section>
        <H>THREE STORES, THREE JOBS</H>
        {[
          { t: 'Vector store (episodic)', c: C.teal, d: 'Embed past conversations / documents; retrieve by similarity. Strength: fuzzy recall of "what happened". Weakness: similarity ≠ relevance — needs filters (time, user, session) and reranking.' },
          { t: 'Entity / knowledge graph (semantic)', c: C.lav, d: 'Facts as typed edges: user → works_at → Acme; project → blocked_by → vendor. Strength: exact, traversable answers ("who is my manager?"). Weakness: extraction errors compound — a wrong edge is confidently recalled forever.' },
          { t: 'User profile (structured)', c: C.warn, d: 'Small JSON of stable preferences: tone, language, tools, standing constraints. Strength: cheapest, most reliable. Weakness: goes stale — needs explicit update + expiry, not silent overwrite.' },
        ].map((s) => (
          <div key={s.t} style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${s.c}`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ color: s.c, fontSize: 12.5, fontWeight: 700, ...mono, marginBottom: 4 }}>{s.t}</div>
            <div style={muted}>{s.d}</div>
          </div>
        ))}
        <P style={muted}>Write path: extract → validate → dedupe → store (with timestamps + provenance). Read path: query → filter → top-k → rerank → inject with citation. Everything else is optimization.</P>
      </Section>
    ),
  },
  {
    id: 'arch', icon: '🏛️', label: '4. Architectures compared',
    render: () => (
      <Section>
        <H>EPISODIC · SEMANTIC · PROCEDURAL — WRITE, RETRIEVE, FORGET</H>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          {[
            { n: 'Episodic', q: 'What happened?', w: 'After each turn/task: store event + outcome + embedding', r: 'Similarity + recency', f: 'TTL by value: chat trivia decays in days; kept decisions survive', c: C.teal },
            { n: 'Semantic', q: 'What is true?', w: 'On confirmed facts only (user said / system verified)', r: 'Exact lookup / graph hop', f: 'Supersede on contradiction; log the change', c: C.lav },
            { n: 'Procedural', q: 'How do we act?', w: 'Learned instructions, tool recipes, skills (often in files/prompts, not a DB)', r: 'Always loaded or triggered by intent', f: 'Versioned — a skill edit is a deploy', c: C.warn },
          ].map((m) => (
            <div key={m.n} style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${m.c}`, borderRadius: 8, padding: 12 }}>
              <div style={{ color: m.c, fontWeight: 700, fontSize: 12.5, ...mono }}>{m.n} — {m.q}</div>
              <div style={{ ...muted, marginTop: 4 }}>Write: {m.w}</div>
              <div style={muted}>Retrieve: {m.r}</div>
              <div style={muted}>Forget: {m.f}</div>
            </div>
          ))}
        </div>
        <H color={C.coral}>THE FORGETTING DECISION (most teams skip this)</H>
        <P style={muted}>Storage is cheap; stale memory is expensive. Default rules that hold up: (1) never store secrets unless the product demands it — quarantine PII; (2) every memory carries <span style={{ ...mono, color: C.teal }}>created_at + source + confidence</span>; (3) user statements beat extracted inferences; (4) "forget" must actually delete — in the store, the index, and any summaries.</P>
      </Section>
    ),
  },
  {
    id: 'hands', icon: '🛠️', label: '5. Hands-on: add memory',
    render: () => (
      <Section>
        <H>BARE-PYTHON AGENT MEMORY (buffer + summarize + recall)</H>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, ...mono, fontSize: 11.5, color: C.text, lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>
{`from dataclasses import dataclass, field

@dataclass
class AgentMemory:
    turns: list = field(default_factory=list)   # short-term: full buffer
    summary: str = ""                          # short-term: rolled-up past
    long_term: dict = field(default_factory=dict)  # long-term: {embedding-free: facts}

    def recall(self, budget=2000):
        "Fit history into the window: recent verbatim, older as summary."
        recent = self.turns[-6:]                      # sliding window
        older  = len(self.turns) - len(recent)
        head = [f"Earlier context: {self.summary} ({older} turns collapsed)"] \\
               if self.summary else []
        return head + recent

    def remember(self, fact, source="user"):
        # write path: only confirmed statements, with provenance
        self.long_term[fact] = {"source": source, "turn": len(self.turns)}

    def forget(self, fact):
        self.long_term.pop(fact, None)   # must delete everywhere, not just hide

m = AgentMemory()
m.turns += ["user: I ship on Fridays", "assistant: noted, Friday deploys"]
m.remember("user prefers Friday deploys")
prompt = "\\n".join(m.recall())        # → this is what actually goes in the window
print(prompt)`}
        </div>
        <H color={C.lav}>SWAPPING IN FRAMEWORKS (same three operations)</H>
        <div style={{ ...muted }}>
          <span style={{ color: C.teal, ...mono }}>LangGraph</span> — a <span style={{ ...mono }}>MemoryStore</span> checkpointed per thread; summarize node before the window fills.<br />
          <span style={{ color: C.teal, ...mono }}>LlamaIndex</span> — <span style={{ ...mono }}>Memory</span> buffer + <span style={{ ...mono }}>VectorMemoryBlock</span> for retrieved episodes.<br />
          <span style={{ color: C.teal, ...mono }}>Mem0 / Zep / Letta</span> — managed write/extract/retrieve with lifecycle policies (compare in the Memory Hierarchy tab).
        </div>
        <P style={{ ...muted, marginTop: 8 }}>The API names change; the three operations never do: <strong>append to short-term, consolidate to summary, write/read long-term.</strong></P>
      </Section>
    ),
  },
  {
    id: 'pitfalls', icon: '⚠️', label: '6. Pitfalls',
    render: () => (
      <Section>
        <H color={C.bad}>WHAT ACTUALLY BREAKS PRODUCTION MEMORY</H>
        {[
          { t: 'Stale memory', s: 'Profile says "prefers Python"; user switched to Rust a year ago.', fix: 'TTL + explicit invalidation on contradiction; show the user what you remember (and let them edit it).' },
          { t: 'Privacy / compliance', s: 'PII written to a shared vector store becomes a breach surface; GDPR "erase me" must reach every copy.', fix: 'Classify before write; quarantine PII; deletion that cascades to indexes + summaries; document retention.' },
          { t: 'Memory poisoning', s: 'A retrieved "memory" planted by injected content steers every future turn (write-path injection).', fix: 'Only write from trusted channels; provenance on every item; retrieved text is data, never instructions.' },
          { t: 'Cost & latency', s: 'Retrieve-on-every-turn adds 100–400ms and tokens for memories the turn did not need.', fix: 'Retrieve on intent triggers (entity mentions, ambiguity), not habitually; cap k; cache hot facts in-profile.' },
        ].map((p) => (
          <div key={p.t} style={{ background: C.bg, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.bad}`, borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <div style={{ color: C.bad, fontWeight: 700, fontSize: 12.5, ...mono }}>{p.t}</div>
            <div style={{ ...muted, margin: '4px 0' }}>{p.s}</div>
            <div style={{ ...muted, color: C.ok }}>Fix: {p.fix}</div>
          </div>
        ))}
        <div style={{ background: C.bg, border: `1px solid ${C.warn}55`, borderRadius: 8, padding: 12, ...muted }}>
          The test that catches most of these: <strong style={{ color: C.warn }}>ask the agent what it remembers about you, then try to correct it.</strong> If it cannot show, edit, and delete its memory, you do not have memory — you have a log.
        </div>
      </Section>
    ),
  },
];

const QUIZ = [
  {
    q: 'A model is stateless. What actually provides "memory" in a chat app?',
    options: ['The weights fine-tune between messages', 'The application rebuilds relevant state into the context window each call', 'KV-cache persists across users', 'The system prompt is saved by the provider'],
    answer: 1,
    explain: 'Weights never change at inference; KV-cache dies with the session. Every "memory" feature is the app choosing what to put back into the window.',
    myth: 'The model remembers the conversation on its own after you tell it something.',
  },
  {
    q: 'Sliding window keeps last N turns. What is the honest trade-off?',
    options: ['None — it is free', 'Constant token cost, but anything older than the window is invisible unless summarized or retrieved', 'It compresses the model', 'It improves accuracy'],
    answer: 1,
    explain: 'You buy a constant budget by selling history. That is why hybrids (summary + retrieval) exist.',
    myth: 'A bigger window makes sliding windows unnecessary.',
  },
  {
    q: 'Where should the fact "my manager is Priya" live?',
    options: ['Only in the vector store', 'A semantic store (profile/graph) with provenance — exact facts want exact retrieval', 'In the system prompt permanently', 'Nowhere — re-ask every session'],
    answer: 1,
    explain: 'Similarity search is for fuzzy recall; a standing fact should be an exact, updatable, attributable record with a source.',
    myth: 'Everything should go in the vector store because embeddings are smart.',
  },
  {
    q: 'What is memory poisoning?',
    options: ['Disk corruption', 'Malicious or injected content written into memory and later recalled as trusted instructions', 'Summary drift', 'KV-cache eviction'],
    answer: 1,
    explain: 'If untrusted text can enter the write path, retrieved "memories" become persistent prompt injection. Provenance + trusted write channels are the defense.',
    myth: 'Retrieved memories are safe because the model decides what to trust.',
  },
  {
    q: 'Which statement about forgetting is correct?',
    options: ['Deleting from the UI is enough', 'True deletion must cascade to store, index, summaries, and caches, or the memory still exists', 'Forgetting hurts accuracy, so never do it', 'TTL only applies to logs'],
    answer: 1,
    explain: 'Copies live in chunks, embeddings, summaries, and traces. A "forget" that skips one is not deletion — and stale copies resurface later.',
    myth: 'If the app cannot find the memory, it is gone.',
  },
];

export default function AgentMemoryTab({ onSelectTab }) {
  return (
    <LearningTabSkeleton
      eyebrow="AGENTS · MEMORY ENGINEERING"
      title="Short-Term & Long-Term Memory for LLM Apps"
      tagline="How agents remember within a conversation and across them: the context window as working memory, external stores as long-term memory, and the write/retrieve/forget discipline that keeps both honest."
      objectives={[
        'Separate working memory (context window) from external long-term storage — and say what each can and cannot do.',
        'Choose between buffer, sliding window, and summarization strategies using a token budget.',
        'Design write/read/forget paths for episodic, semantic, and procedural memory.',
        'Add working memory + a long-term store to a plain-Python agent, then map the same operations to LangGraph/LlamaIndex.',
        'Identify the four production killers: staleness, privacy, poisoning, and cost/latency.',
      ]}
      analogy="Working memory is your desk: expensive, fixed size, everything on it is visible now. Long-term memory is the filing cabinet: nearly free, invisible until you walk over and pull a file onto the desk. Summarization is clipping a long document into a sticky note; retrieval is choosing which files earn desk space this turn; forgetting is shredding — actually shredding, in every drawer where a copy might live."
      sections={SECTIONS}
      quiz={QUIZ}
      prev={{ id: 'contextlimits', label: '1M Context Limits & Working Memory' }}
      next={{ id: 'memhierarchy', label: 'Memory Hierarchy & Lifecycle' }}
      onSelectTab={onSelectTab}
    />
  );
}
