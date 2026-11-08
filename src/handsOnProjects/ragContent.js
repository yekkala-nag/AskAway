// Hands-On Projects — RAG.
// Python code reproduced verbatim from the source tutorials; only site branding removed.

export const TAB_OVERVIEW = {
  title: "RAG",
  subtitle: "Build retrieval from the maths up, then across collections, graphs and conversation.",
  audience: "Developers who have used a RAG framework and want to know what it hides.",
  outcomes: [
    "Chunk, embed and score by hand to see what a vector store actually does.",
    "Keep separate collections and merge results across them with attribution.",
    "Augment vector search with entity relations from a knowledge graph.",
    "Hold conversation state while retrieving per turn.",
  ],
};

export const PROJECTS = [
  {
    id: "p3",
    n: 3,
    title: "Build Your First RAG System From Scratch",
    blurb:
      "Understand retrieval-augmented generation by building every component yourself.",
    stack: ["sentence-transformers", "NumPy", "Ollama"],
    steps: [
      {
        title: "Manual Chunking & Embeddings",
        note:
          "The overlap arithmetic is exact: with size 500 and overlap 100 the cursor advances 400, so a 2,000-character file yields six chunks, not four. Overlap is what stops an answer being cut in half at a boundary.",
        code: String.raw`from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def chunk_text(text, chunk_size=500, overlap=100):
    chunks = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

with open("knowledge.txt") as f:
    text = f.read()

chunks = chunk_text(text)
embeddings = model.encode(chunks)
print(f"Generated {len(embeddings)} embeddings of dim {embeddings[0].shape[0]}")`,
      },
      {
        title: "Vector Search with Cosine Similarity",
        note:
          "`argsort` returns ascending scores, so the `[::-1]` is load-bearing — without it you retrieve the three least relevant chunks. Cosine ignores magnitude, which is why normalised sentence embeddings work well with it.",
        code: String.raw`def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def search(query, chunks, embeddings, top_k=3):
    query_embedding = model.encode([query])[0]
    scores = [cosine_similarity(query_embedding, emb) for emb in embeddings]
    top_indices = np.argsort(scores)[-top_k:][::-1]
    return [(chunks[i], scores[i]) for i in top_indices]

results = search("What is machine learning?", chunks, embeddings)
for chunk, score in results:
    print(f"Score: {score:.3f} | {chunk[:100]}...")`,
      },
      {
        title: "Generate Answers with Context",
        note:
          "\"Answer based on this context only\" is a soft constraint, not enforcement — a small model will still drift. Hand the model numbered sources and require the answer to name them if you need citations you can trust.",
        code: String.raw`import ollama

def rag_answer(query, chunks, embeddings):
    results = search(query, chunks, embeddings)
    context = "\n\n".join([chunk for chunk, _ in results])

    response = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""Answer based on this context only:

{context}

Question: {query}
Answer:"""
    }])
    return response["message"]["content"]

answer = rag_answer("Explain neural networks", chunks, embeddings)
print(answer)`,
      },
    ],
  },
  {
    id: "p6",
    n: 6,
    title: "Building a Multi-Document RAG System",
    blurb:
      "Query across multiple document collections with source attribution and filtering.",
    stack: ["Chroma", "HuggingFace embeddings", "PDF"],
    steps: [
      {
        title: "Multi-Collection Ingestion",
        note:
          "One collection per category is a filtering strategy: it lets you search legal only, or search everything and keep the label. Note the metadata is set on one loader call and the docs list extends a second call to `loader.load()` — the second load is what actually lands in `docs`.",
        code: String.raw`from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=80)

collections = {}
for category in ["legal", "technical", "financial"]:
    docs = []
    for f in os.listdir(f"./docs/{category}"):
        if f.endswith(".pdf"):
            loader = PyPDFLoader(f"./docs/{category}/{f}")
            for doc in loader.load():
                doc.metadata["category"] = category
            docs.extend(loader.load())

    chunks = splitter.split_documents(docs)
    collections[category] = Chroma.from_documents(
        chunks, embeddings,
        collection_name=f"rag_{category}"
    )
    print(f"  {category}: {len(chunks)} chunks")`,
      },
      {
        title: "Cross-Collection Query",
        note:
          "Distance, not similarity: Chroma's `similarity_search_with_score` returns a distance where lower is better, which is why the sort is ascending. Mixing distance and similarity in one merge is the classic silent-ranking bug.",
        code: String.raw`def multi_search(query, collections, top_k=3):
    all_results = []
    for name, store in collections.items():
        results = store.similarity_search_with_score(query, k=top_k)
        for doc, score in results:
            doc.metadata["relevance_score"] = score
            all_results.append(doc)

    # Sort by relevance (lower distance = better)
    all_results.sort(key=lambda d: d.metadata["relevance_score"])
    return all_results[:top_k]

results = multi_search("What are the compliance requirements?", collections)
for doc in results:
    print(f"[{doc.metadata['category']}] Score: {doc.metadata['relevance_score']:.3f}")
    print(f"  {doc.page_content[:100]}...\n")`,
      },
    ],
  },
  {
    id: "p7",
    n: 7,
    title: "Build a GraphRAG Pipeline for Smart Retrieval",
    blurb:
      "Combine knowledge graphs with vector search for more accurate, relationship-aware retrieval.",
    stack: ["Ollama", "FAISS", "Knowledge graph"],
    steps: [
      {
        title: "Extract Entities & Relations",
        note:
          "Entity extraction from the first 20 chunks is a cost decision — every chunk is one LLM call. The bare `except` swallows schema drift silently, so log the raw response when a run produces zero relations.",
        code: String.raw`import ollama
import json

def extract_entities(text):
    response = ollama.chat(model="llama3", messages=[{
        "role": "user",
        "content": f"""Extract entities and relationships from this text.
Return JSON: {{"entities": [{{"name": "...", "type": "..."}}], "relations": [{{"source": "...", "target": "...", "relation": "..."}}]}}

Text: {text[:1000]}"""
    }])
    try:
        return json.loads(response["message"]["content"])
    except:
        return {"entities": [], "relations": []}

# Process all chunks
knowledge_graph = {"entities": [], "relations": []}
for chunk in chunks[:20]:  # Start with first 20
    extracted = extract_entities(chunk.page_content)
    knowledge_graph["entities"].extend(extracted["entities"])
    knowledge_graph["relations"].extend(extracted["relations"])

print(f"Extracted {len(knowledge_graph['entities'])} entities, {len(knowledge_graph['relations'])} relations")`,
      },
      {
        title: "Graph-Enhanced Retrieval",
        note:
          "Hybrid context is two blocks in one prompt: passages by similarity, edges by entity match. Graph traversal only helps when the question names an entity that actually exists in the graph — otherwise it contributes nothing and costs tokens.",
        code: String.raw`def graph_search(query, knowledge_graph, vectorstore, top_k=5):
    # Step 1: Vector search for relevant chunks
    vector_results = vectorstore.similarity_search(query, k=top_k)

    # Step 2: Extract entities from query
    query_entities = extract_entities(query)
    entity_names = {e["name"].lower() for e in query_entities["entities"]}

    # Step 3: Find related entities via graph
    related = []
    for rel in knowledge_graph["relations"]:
        if rel["source"].lower() in entity_names or rel["target"].lower() in entity_names:
            related.append(rel)

    # Step 4: Combine context
    vector_context = "\n".join([d.page_content for d in vector_results])
    graph_context = "\n".join([f"{r['source']} --{r['relation']}--> {r['target']}" for r in related[:10]])

    return f"Document Context:\n{vector_context}\n\nKnowledge Graph:\n{graph_context}"

context = graph_search("How does X relate to Y?", knowledge_graph, vectorstore)
print(context)`,
      },
    ],
  },
  {
    id: "p9",
    n: 9,
    title: "Build a Real-Time AI Assistant Using RAG + LangChain",
    blurb:
      "Create a conversational assistant with memory, retrieval, and streaming responses.",
    stack: ["LangChain", "flan-t5", "Ollama"],
    steps: [
      {
        title: "Conversational RAG Chain",
        note:
          "`ConversationalRetrievalChain` rewrites the follow-up question using chat history before retrieving — that rewrite is why \"and the second one?\" still finds anything. `k=5` sets memory depth, which is context cost per turn.",
        code: String.raw`from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

pipe = pipeline("text2text-generation", model="google/flan-t5-base", max_length=512)
llm = HuggingFacePipeline(pipeline=pipe)

memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    return_messages=True,
    k=5  # Keep last 5 exchanges
)

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    memory=memory,
    verbose=True
)

# Chat loop
while True:
    query = input("You: ")
    if query.lower() == "quit":
        break
    result = qa({"question": query})
    print(f"AI: {result['answer']}\n")`,
      },
      {
        title: "Add Streaming Output",
        note:
          "Streaming is a UX layer: retrieval still finishes before the first token appears. `chat_history[-5:]` bounds the prompt, and `flush=True` is what makes tokens appear as they arrive rather than at the end.",
        code: String.raw`from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
import ollama

def stream_chat(query, retriever, chat_history=[]):
    # Retrieve context
    docs = retriever.get_relevant_documents(query)
    context = "\n".join([d.page_content for d in docs])

    history_str = "\n".join([f"{role}: {msg}" for role, msg in chat_history[-5:]])

    prompt = f"""Chat History:
{history_str}

Context from documents:
{context}

User: {query}
Assistant:"""

    # Stream response
    print("AI: ", end="", flush=True)
    full_response = ""
    for chunk in ollama.chat(model="llama3",
        messages=[{"role": "user", "content": prompt}],
        stream=True):
        token = chunk["message"]["content"]
        print(token, end="", flush=True)
        full_response += token

    print()
    chat_history.append(("User", query))
    chat_history.append(("Assistant", full_response))
    return full_response`,
      },
    ],
  },
];
