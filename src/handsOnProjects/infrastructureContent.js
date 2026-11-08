// Hands-On Projects — Infrastructure.
// Python code reproduced verbatim from the source tutorials; only site branding removed.
// Steps 1–3 of each project keep the original numbering order, per project.

export const TAB_OVERVIEW = {
  title: "Infrastructure",
  subtitle: "Ingestion, parsing, prompting and the API layer that every later project sits on.",
  audience: "Developers who want a working local stack before adding retrieval or agents.",
  outcomes: [
    "Parse mixed document formats into a uniform text pipeline.",
    "Chunk, embed and query without leaning on a framework.",
    "Wrap a local model in a streaming FastAPI service with cache and rate limits.",
    "Batch-score structured output and validate the JSON that comes back.",
  ],
};

export const PROJECTS = [
  {
    id: "p1",
    n: 1,
    title: "Document Analysis using LLMs",
    blurb:
      "Parse, chunk, and analyze documents with large language models — the entry point for every later pipeline.",
    stack: ["LangChain loaders", "FAISS", "HuggingFace", "flan-t5"],
    steps: [
      {
        title: "Load & Parse Documents",
        note:
          "Three loader types keyed by extension give one uniform list of page objects. Everything downstream assumes `.page_content` and `.metadata`, so normalising here saves rework later.",
        code: String.raw`from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
import os

def load_documents(folder_path):
    loaders = {
        ".pdf": PyPDFLoader,
        ".docx": Docx2txtLoader,
        ".txt": TextLoader,
    }
    docs = []
    for f in os.listdir(folder_path):
        ext = os.path.splitext(f)[1].lower()
        if ext in loaders:
            loader = loaders[ext](os.path.join(folder_path, f))
            docs.extend(loader.load())
    return docs

docs = load_documents("./documents")
print(f"Loaded {len(docs)} document pages")`,
      },
      {
        title: "Chunk & Embed",
        note:
          "500-character chunks with 80 overlap is a sane default for prose: big enough to hold a claim, small enough to keep retrieval precise. FAISS keeps it in-process — no server to run.",
        code: String.raw`from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)
chunks = splitter.split_documents(docs)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)

print(f"Created {len(chunks)} chunks in vector store")`,
      },
      {
        title: "Query & Analyze",
        note:
          "`return_source_documents=True` is the whole point: the answer is only as good as the citation you can show next to it. Flan-T5-base is weak on multi-hop questions — swap the model before blaming retrieval.",
        code: String.raw`from langchain.chains import RetrievalQA
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

pipe = pipeline("text2text-generation", model="google/flan-t5-base", max_length=512)
llm = HuggingFacePipeline(pipeline=pipe)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True
)

result = qa("What are the key findings in these documents?")
print("Answer:", result["result"])
for doc in result["source_documents"]:
    print(f"  Source: {doc.metadata.get('source', 'unknown')}")`,
      },
    ],
  },
  {
    id: "p2",
    n: 2,
    title: "Build a Production-Ready LLM API",
    blurb:
      "Wrap your LLM in a FastAPI service with streaming, rate limiting, and caching.",
    stack: ["FastAPI", "Ollama", "Redis-style cache", "Docker"],
    steps: [
      {
        title: "FastAPI + Ollama Setup",
        note:
          "A generator that yields tokens plus `StreamingResponse` is all streaming takes. The Ollama endpoint streams newline-delimited JSON, so each line is one partial chunk.",
        code: String.raw`from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import requests, json

app = FastAPI(title="LLM API")

def stream_llm(prompt: str):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt, "stream": True},
        stream=True
    )
    for line in response.iter_lines():
        if line:
            data = json.loads(line)
            yield data.get("response", "")

@app.post("/generate")
async def generate(prompt: str):
    return StreamingResponse(stream_llm(prompt), media_type="text/plain")`,
      },
      {
        title: "Add Caching & Rate Limiting",
        note:
          "Hashing the prompt is the cheapest cache key that works; a per-IP sliding window caps spend. Both are in-process and reset on restart — swap in Redis when you run more than one worker.",
        code: String.raw`from fastapi import Request
from functools import lru_cache
import hashlib, time

# Simple in-memory cache
response_cache = {}

def get_cached_response(prompt: str):
    key = hashlib.md5(prompt.encode()).hexdigest()
    if key in response_cache:
        return response_cache[key]
    return None

def cache_response(prompt: str, response: str):
    key = hashlib.md5(prompt.encode()).hexdigest()
    response_cache[key] = response

# Rate limiter
request_counts = {}
RATE_LIMIT = 10  # requests per minute

@app.middleware("http")
async def rate_limit(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()
    window = [t for t in request_counts.get(client_ip, []) if now - t < 60]
    if len(window) >= RATE_LIMIT:
        return JSONResponse(status_code=429, content={"error": "Rate limit exceeded"})
    window.append(now)
    request_counts[client_ip] = window
    return await call_next(request)`,
      },
      {
        title: "Deploy with Docker",
        note:
          "Two services, one compose file: the API and the model server on a shared network. Binding uvicorn to 0.0.0.0 is required inside a container; the port mapping is what exposes it to the host.",
        code: String.raw`# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# docker-compose.yml
# version: "3.8"
# services:
#   api:
#     build: .
#     ports: ["8000:8000"]
#   ollama:
#     image: ollama/ollama
#     ports: ["11434:11434"]`,
      },
    ],
  },
  {
    id: "p4",
    n: 4,
    title: "Build an AI Resume Screener with Llama 3",
    blurb:
      "Automate resume screening with local LLMs — parse, score, and rank candidates.",
    stack: ["PyPDF", "Ollama", "Llama 3", "JSON output"],
    steps: [
      {
        title: "Parse Resumes",
        note:
          "PDF text arrives in page order with no structure preserved. Collapsing pages into one string is fine for scoring, but you lose section boundaries — keep page numbers if you need to cite evidence later.",
        code: String.raw`from langchain_community.document_loaders import PyPDFLoader
import os

def parse_resumes(folder):
    resumes = []
    for f in os.listdir(folder):
        if f.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(folder, f))
            pages = loader.load()
            text = "\n".join([p.page_content for p in pages])
            resumes.append({"name": f, "text": text})
    return resumes

resumes = parse_resumes("./resumes")
print(f"Parsed {len(resumes)} resumes")`,
      },
      {
        title: "Score with Llama 3",
        note:
          "Truncating to 2,000 characters is a real decision, not a detail: it silently drops the second half of long resumes. Asking for a fixed JSON shape keeps the next step parseable.",
        code: String.raw`import ollama

job_description = """
Senior Python Developer
- 5+ years Python experience
- Machine learning expertise
- FastAPI or Flask experience
- Strong communication skills
"""

def score_resume(resume_text, job_desc):
    response = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""Score this resume against the job description.
Return JSON: {{"score": 1-10, "strengths": [...], "gaps": [...]}}

Job Description: {job_desc}

Resume: {resume_text[:2000]}"""
    }])
    return response["message"]["content"]

for resume in resumes:
    result = score_resume(resume["text"], job_description)
    print(f"\n{resume['name']}:\n{result}")`,
      },
      {
        title: "Rank & Report",
        note:
          "Malformed JSON gets score 0 rather than crashing the run — the right call for batch jobs, wrong for anything user-facing. Screening decisions on candidates deserve a human review step regardless of score.",
        code: String.raw`import json

def rank_candidates(resumes, job_desc):
    scored = []
    for resume in resumes:
        result = score_resume(resume["text"], job_desc)
        try:
            data = json.loads(result)
            data["name"] = resume["name"]
            scored.append(data)
        except json.JSONDecodeError:
            scored.append({"name": resume["name"], "score": 0, "error": "Parse failed"})

    ranked = sorted(scored, key=lambda x: x.get("score", 0), reverse=True)

    print("\n📊 CANDIDATE RANKINGS")
    print("=" * 40)
    for i, c in enumerate(ranked, 1):
        print(f"{i}. {c['name']} — Score: {c.get('score', 'N/A')}/10")
        if 'strengths' in c:
            print(f"   Strengths: {', '.join(c['strengths'][:3])}")
    return ranked

rankings = rank_candidates(resumes, job_description)`,
      },
    ],
  },
  {
    id: "p5",
    n: 5,
    title: "Build LLM with Reasoning Skills",
    blurb:
      "Add chain-of-thought and step-by-step reasoning to make your LLM think before answering.",
    stack: ["Ollama", "Llama 3", "Prompting"],
    steps: [
      {
        title: "Chain-of-Thought Prompting",
        note:
          "A fixed output template does two jobs: it forces the model to commit to intermediate steps, and it makes the answer machine-splittable on `ANSWER:`. The arithmetic in the demo is average speed — total distance over total time, not the mean of the two speeds.",
        code: String.raw`import ollama

def reason(question: str):
    response = ollama.chat(model="llama3", messages=[{
        "role": "system",
        "content": """You are a reasoning assistant. For every question:
1. Break the problem into steps
2. Think through each step explicitly
3. Only then give your final answer

Format:
THINKING:
- Step 1: ...
- Step 2: ...
ANSWER: ..."""
    }, {
        "role": "user",
        "content": question
    }])
    return response["message"]["content"]

print(reason("If a train travels 120km in 2 hours, and then 90km in 1.5 hours, what is its average speed for the entire journey?"))`,
      },
      {
        title: "Self-Verification Loop",
        note:
          "A second pass reviewing the first is cheap insurance against arithmetic slips — but the same model tends to rubber-stamp its own reasoning. It catches slips, not misunderstandings; an external checker is stronger.",
        code: String.raw`def reason_and_verify(question: str):
    # Step 1: Initial reasoning
    initial = reason(question)

    # Step 2: Self-verification
    verification = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""Review this reasoning for errors:

Question: {question}

Reasoning: {initial}

Check each step. If you find errors, provide corrected reasoning.
If correct, respond with "VERIFIED" followed by the final answer."""
    }])

    return {
        "initial_reasoning": initial,
        "verification": verification["message"]["content"]
    }

result = reason_and_verify("What is 17 * 24 + 13?")
print("Initial:", result["initial_reasoning"])
print("\nVerified:", result["verification"])`,
      },
    ],
  },
];
