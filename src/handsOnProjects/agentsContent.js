// Hands-On Projects — Agents.
// Python code reproduced verbatim from the source tutorials; only site branding removed.

// Backtick kept out of the raw templates: String.raw would escape it into a literal backslash.
const BT = "\u0060";

export const TAB_OVERVIEW = {
  title: "Agents",
  subtitle: "Graph orchestration, tool use and multi-agent crews, each built end to end.",
  audience: "Developers ready to move from a single prompt call to state, tools and delegation.",
  outcomes: [
    "Model shared agent state as a graph and wire nodes into it.",
    "Give an agent data access, then internet access.",
    "Route research, planning and synthesis across specialised agents.",
    "Bound autonomy with roles, tasks and a sequential process.",
  ],
};

export const PROJECTS = [
  {
    id: "p12",
    n: 12,
    title: "Build a Multi-Agent System With LangGraph",
    blurb:
      "Orchestrate specialized AI agents that collaborate through a shared state graph.",
    stack: ["LangGraph", "Ollama", "DuckDuckGo"],
    steps: [
      {
        title: "Shared State",
        note:
          "The state is the contract: every node reads the whole dict and returns the whole dict. Keeping it flat and typed is what makes the graph debuggable — you can print one object to see the entire run.",
        code: String.raw`from typing import TypedDict
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    topic: str
    research_data: str
    blog_post: str`,
      },
      {
        title: "Researcher Agent",
        note:
          "Node functions must return the merged state, not mutate it — that is what `{**state, ...}` does. A search call inside a node also means every graph run depends on network availability.",
        code: String.raw`from duckduckgo_search import DDGS

def researcher_node(state: AgentState) -> AgentState:
    topic = state["topic"]
    print(f"🔍 Researching: {topic}")
    with DDGS() as ddgs:
        results = list(ddgs.text(topic, max_results=5))
    research = "\n\n".join([f"**{r['title']}**\n{r['body']}" for r in results])
    return {**state, "research_data": research}`,
      },
      {
        title: "Writer Agent",
        note:
          "Calling Ollama over HTTP instead of through a client library keeps the node dependency-free, but it also means no retry or timeout here. Temperature 0.7 is the only knob controlling how far the post drifts from the research.",
        code: String.raw`import requests

def writer_node(state: AgentState) -> AgentState:
    prompt = f"""Based on this research about {state['topic']}:
{state['research_data']}
Write a concise, engaging blog post (3-4 paragraphs)."""

    response = requests.post("http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": False,
              "options": {"temperature": 0.7}})
    return {**state, "blog_post": response.json()["response"]}`,
      },
      {
        title: "Build the Graph",
        note:
          "Three lines define the whole topology: nodes, entry point, edges. `END` is an explicit terminal node — without it a compiled graph has nowhere to stop.",
        code: String.raw`workflow = StateGraph(AgentState)
workflow.add_node("researcher", researcher_node)
workflow.add_node("writer", writer_node)
workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", END)
app = workflow.compile()
print("✅ Multi-agent graph compiled")`,
      },
      {
        title: "Run the System",
        note:
          "The initial state must satisfy every key, including the empty ones. Returned state is the final state — inspect both fields to see what the researcher actually collected.",
        code: String.raw`result = app.invoke({
    "topic": "The future of AI agents in software development",
    "research_data": "",
    "blog_post": ""
})
print("\n📝 BLOG POST\n" + "="*50)
print(result["blog_post"])`,
      },
    ],
  },
  {
    id: "p14",
    n: 14,
    title: "Build Your Personal AI Data Analyst",
    blurb:
      "Upload any CSV and ask questions — the AI writes and executes Python code to analyze your data.",
    stack: ["pandas", "Ollama", "matplotlib", "exec"],
    steps: [
      {
        title: "Robust Data Loading",
        note:
          "Two branches: a path for CLI use, a file-like object for web uploads. The suffix drives the reader, so a misleading extension silently parses as CSV rather than failing loudly.",
        code: String.raw`import pandas as pd
from pathlib import Path
import io

def load_data(file_or_path) -> pd.DataFrame:
    if isinstance(file_or_path, (str, Path)):
        p = Path(file_or_path)
        s = p.suffix.lower()
        if s == ".csv": return pd.read_csv(p)
        if s in {".xls", ".xlsx"}: return pd.read_excel(p)
        if s == ".json": return pd.read_json(p)
        return pd.read_csv(p)

    # Handle file-like objects (e.g., Streamlit uploads)
    name = getattr(file_or_path, "name", None)
    suffix = Path(name).suffix.lower() if name else None
    raw = file_or_path.read()
    if isinstance(raw, str): raw = raw.encode("utf-8")
    bio = io.BytesIO(raw)

    if suffix == ".csv": bio.seek(0); return pd.read_csv(bio)
    if suffix in {".xls", ".xlsx"}: bio.seek(0); return pd.read_excel(bio)
    bio.seek(0); return pd.read_csv(bio)`,
      },
      {
        title: "Smart Prompt Suggestions",
        note:
          "Suggestions come from dtypes, not from a model — deterministic, instant, free. The `nunique() <= 50` cutoff is what separates a useful category column from an identifier column.",
        code: String.raw`import numpy as np

def suggest_prompts(df: pd.DataFrame):
    numeric = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical = [c for c in df.columns if c not in numeric and df[c].nunique() <= 50]
    suggestions = ["Summarize the dataset in 5 bullet points."]

    if categorical:
        suggestions.append(f"Show top 10 counts for '{categorical[0]}'.")
    if numeric:
        suggestions.append(f"Create a histogram of '{numeric[0]}'.")
        suggestions.append(f"Show summary statistics for numeric columns.")
    if len(numeric) >= 2:
        suggestions.append(f"Scatter plot: '{numeric[0]}' vs '{numeric[1]}'.")
        suggestions.append("Show correlation matrix heatmap.")

    return suggestions[:8]

df = load_data("sales.csv")
for s in suggest_prompts(df):
    print(f"  💡 {s}")`,
      },
      {
        title: "Natural Language → Code → Result",
        note:
          "`exec` on model output is arbitrary code execution. It is fine on your own machine with your own CSV; never expose it to untrusted input without a sandbox and an import allowlist.",
        code: String.raw`import ollama
import textwrap

def analyze(question: str, df: pd.DataFrame):
    schema = f"Columns: {list(df.columns)}\nDtypes: {dict(df.dtypes)}\nShape: {df.shape}"

    response = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""You are a data analyst. Given this DataFrame 'df':
{schema}

Write Python code to answer: {question}
Return ONLY executable Python code. Use 'df' as the variable. Print results."""
    }])

    code = response["message"]["content"].strip().strip("${BT}").replace("python\n", "")
    print(f"Generated code:\n{code}\n")

    try:
        exec(code, {"df": df, "pd": pd, "np": np, "plt": __import__('matplotlib.pyplot')})
    except Exception as e:
        print(f"Execution error: {e}")

analyze("What is the average revenue by region?", df)`,
      },
    ],
  },
  {
    id: "p15",
    n: 15,
    title: "Build an AI Agent to Automate Your Research",
    blurb:
      "An autonomous agent that searches, reads, summarizes, and compiles research reports.",
    stack: ["DuckDuckGo", "Ollama", "Markdown report"],
    steps: [
      {
        title: "Search & Collect Sources",
        note:
          "One summarisation call per result: five sources means five model calls before you have written anything. Truncating the title in the log is cosmetic, but it hides which source failed when one does.",
        code: String.raw`from duckduckgo_search import DDGS
import ollama

def research_topic(topic: str, num_sources: int = 5):
    print(f"🔍 Researching: {topic}")
    with DDGS() as ddgs:
        results = list(ddgs.text(topic, max_results=num_sources))

    sources = []
    for r in results:
        summary = ollama.chat(model="llama3", messages=[{
            "role": "user",
            "content": f"Summarize this in 2-3 bullet points:\n\nTitle: {r['title']}\n{r['body']}"
        }])
        sources.append({
            "title": r["title"],
            "url": r.get("href", ""),
            "summary": summary["message"]["content"]
        })
        print(f"  ✅ Processed: {r['title'][:50]}...")

    return sources

sources = research_topic("Latest advances in AI agents 2024")`,
      },
      {
        title: "Compile Research Report",
        note:
          "Summaries are condensed twice — once per source, then again into the report — so claim-level detail is lost. The `[Source N]` convention is what lets a reader recover it.",
        code: String.raw`def compile_report(topic: str, sources: list):
    source_text = "\n\n".join([
        f"Source {i+1}: {s['title']}\n{s['summary']}"
        for i, s in enumerate(sources)
    ])

    response = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""Write a structured research report about: {topic}

Use these sources:
{source_text}

Format:
# Executive Summary
# Key Findings
# Detailed Analysis
# Conclusion
# Sources Used

Cite sources as [Source N] throughout."""
    }])

    report = response["message"]["content"]

    # Save to file
    with open(f"research_report.md", "w") as f:
        f.write(report)
    print(f"\n📄 Report saved ({len(report)} chars)")
    return report

report = compile_report("Latest advances in AI agents 2024", sources)
print(report)`,
      },
    ],
  },
  {
    id: "p17",
    n: 17,
    title: "Connect Your First AI Agent to the Internet",
    blurb: "Give your agent tools to search the web, fetch pages, and take actions online.",
    stack: ["DuckDuckGo", "BeautifulSoup", "Ollama"],
    steps: [
      {
        title: "Web Search Tool",
        note:
          "Stripping script, style, nav and footer before extracting text is what keeps 3,000 characters of page from being menus and analytics. The result cap is a hard token budget, not a courtesy.",
        code: String.raw`from duckduckgo_search import DDGS
import requests
from bs4 import BeautifulSoup

def web_search(query: str, max_results: int = 5):
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=max_results))
    return [{"title": r["title"], "url": r.get("href", ""), "snippet": r["body"]} for r in results]

def fetch_page(url: str):
    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer"]):
            tag.decompose()
        return soup.get_text(separator="\n", strip=True)[:3000]
    except Exception as e:
        return f"Error fetching page: {e}"

results = web_search("Python AI agent frameworks 2024")
for r in results:
    print(f"  {r['title']}: {r['url']}")`,
      },
      {
        title: "Tool-Using Agent",
        note:
          "This is a fixed four-step pipeline, not a loop: the model picks one query, two pages are read, one answer is written. Real tool use needs the model to choose between `TOOLS` on each turn and stop when satisfied.",
        code: String.raw`import ollama

TOOLS = {"search": web_search, "fetch": fetch_page}

def internet_agent(question: str):
    print(f"🤖 Agent processing: {question}")

    # Step 1: Decide if we need to search
    plan = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""You are an AI agent with internet access.
Question: {question}
What search query would help answer this? Return ONLY the search query."""
    }])
    search_query = plan["message"]["content"].strip()

    # Step 2: Search
    results = web_search(search_query, max_results=3)
    print(f"  Found {len(results)} results")

    # Step 3: Read top results
    context = ""
    for r in results[:2]:
        if r["url"]:
            content = fetch_page(r["url"])
            context += f"\n\nSource: {r['title']}\n{content[:1500]}"

    # Step 4: Synthesize answer
    answer = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"Based on this research:\n{context}\n\nAnswer: {question}"
    }])
    return answer["message"]["content"]

print(internet_agent("What are the latest AI agent frameworks in 2024?"))`,
      },
    ],
  },
  {
    id: "p18",
    n: 18,
    title: "Building a Multi-Agent System using Gemini API",
    blurb:
      "Orchestrate multiple specialized agents powered by Google's Gemini for complex tasks.",
    stack: ["google-generativeai", "Gemini", "Pipeline"],
    steps: [
      {
        title: "Gemini API Setup & Agents",
        note:
          "Each \"agent\" is a closure over the same model plus a different system instruction. That is enough for role separation, but there is no shared state and no tool access between them.",
        code: String.raw`import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-pro")

def create_agent(role: str, system_prompt: str):
    def agent_fn(input_text: str):
        response = model.generate_content(
            f"You are a {role}. {system_prompt}\n\nInput: {input_text}"
        )
        return response.text
    return agent_fn

researcher = create_agent(
    "Research Analyst",
    "Find key facts and data points. Be thorough and cite sources."
)
writer = create_agent(
    "Content Writer",
    "Write engaging, clear content based on research provided."
)
editor = create_agent(
    "Editor",
    "Review for clarity, accuracy, and tone. Suggest improvements."
)`,
      },
      {
        title: "Pipeline Orchestration",
        note:
          "Sequential handoff means every stage sees the full previous output — simple, but token cost grows with each hop. The editor stage is the only quality gate, so it carries all the weight.",
        code: String.raw`def run_content_pipeline(topic: str):
    print(f"🚀 Starting pipeline for: {topic}\n")

    # Stage 1: Research
    print("📚 Stage 1: Research")
    research = researcher(f"Research the topic: {topic}")
    print(f"  Research complete ({len(research)} chars)\n")

    # Stage 2: Write
    print("✍️ Stage 2: Writing")
    draft = writer(f"Write a blog post based on this research:\n{research}")
    print(f"  Draft complete ({len(draft)} chars)\n")

    # Stage 3: Edit
    print("🔍 Stage 3: Editing")
    final = editor(f"Review and improve this draft:\n{draft}")
    print(f"  Editing complete\n")

    return {
        "research": research,
        "draft": draft,
        "final": final
    }

result = run_content_pipeline("The impact of AI agents on software development")
print("\n📝 FINAL OUTPUT")
print("=" * 50)
print(result["final"])`,
      },
    ],
  },
  {
    id: "p20",
    n: 20,
    title: "Building AI Agents with CrewAI",
    blurb:
      "Define autonomous agents with roles, goals, and tasks — then let them collaborate.",
    stack: ["CrewAI", "llama-cpp-python", "Mistral 7B Q4"],
    steps: [
      {
        title: "Local LLM Setup",
        note:
          "Q4_K_M at 4,096 context fits in roughly 5 GB of memory with no GPU offload. `n_gpu_layers=0` forces CPU — correct fallback, and the reason generation is slow.",
        code: String.raw`from llama_cpp import Llama

llm_model = Llama(
    model_path="./models/mistral-7b-instruct-v0.2.Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=8,
    n_gpu_layers=0,
    verbose=False
)

test = llm_model("What is an AI agent?", max_tokens=100)
print("Model loaded! Test:", test["choices"][0]["text"][:100])`,
      },
      {
        title: "LLM Wrapper",
        note:
          "CrewAI expects a callable with a `complete` shape; this class is the adapter. `stop=[\"\\n\\n\\n\"]` is what keeps a chat model from running past its answer into invented dialogue.",
        code: String.raw`class LocalLLM:
    def __init__(self, model):
        self.model = model

    def complete(self, prompt, **kwargs):
        response = self.model(
            prompt,
            max_tokens=kwargs.get("max_tokens", 1024),
            temperature=kwargs.get("temperature", 0.7),
            stop=kwargs.get("stop", ["\n\n\n"]),
            echo=False
        )
        return response["choices"][0]["text"].strip()

    def __call__(self, prompt, **kwargs):
        return self.complete(prompt, **kwargs)

local_llm = LocalLLM(llm_model)`,
      },
      {
        title: "Define the Agents",
        note:
          "Role, goal and backstory are the whole persona contract. `allow_delegation=False` keeps each agent on its own task — enable it only when you want an agent handing work to a peer.",
        code: String.raw`from crewai import Agent

researcher = Agent(
    role="Market Research Analyst",
    goal="Analyze market trends and competitor strategies",
    backstory="""Senior market research analyst with 15 years
    of experience in tech industry analysis.""",
    llm=local_llm,
    verbose=True,
    allow_delegation=False
)

strategist = Agent(
    role="Content Strategist",
    goal="Create data-driven content strategies",
    backstory="""Content strategist who combines analytical
    thinking with creative storytelling.""",
    llm=local_llm,
    verbose=True,
    allow_delegation=False
)`,
      },
      {
        title: "Define the Tasks",
        note:
          "`expected_output` is the only quality signal the crew gets — vague here means vague results. `depends_on` is what orders the two stages instead of letting them run in parallel.",
        code: String.raw`from crewai import Task

research_task = Task(
    description="""Research AI agents in 2024: key players, market size,
    use cases, adoption barriers, and emerging trends.""",
    expected_output="Detailed market research report with data points",
    agent=researcher
)

strategy_task = Task(
    description="""Based on the research, create a content strategy:
    3 blog topics with outlines, key messages, distribution channels,
    and a one-month content calendar.""",
    expected_output="Comprehensive content strategy document",
    agent=strategist,
    depends_on=[research_task]
)`,
      },
      {
        title: "Run the Crew",
        note:
          "`Process.sequential` is deterministic; hierarchical adds a manager agent that costs another model call per step. Local 7B models rarely hold a long task chain together — start with two tasks.",
        code: String.raw`from crewai import Crew, Process

crew = Crew(
    agents=[researcher, strategist],
    tasks=[research_task, strategy_task],
    process=Process.sequential,
    verbose=True
)

print("🚀 Starting crew execution...")
result = crew.kickoff()
print("\n" + "="*50)
print("✅ CREW EXECUTION COMPLETE")
print("="*50)
print(result)`,
      },
    ],
  },
];
