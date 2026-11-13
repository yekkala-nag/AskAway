// ── Lexical Graph RAG (AWS graphrag-toolkit) — engine data & pure logic ──
// Based on AWS Labs' open-source graphrag-toolkit (lexical-graph component)
// Hierarchical 6-level graph: source → chunk → topic → statement → fact → entity
// Two-stage pipeline: extract (LLM) → build (graph + vector indexes)
// Traversal-based search: vector anchors → graph traversal

export const HIERARCHY_LEVELS = [
  {
    level: 1,
    name: 'Source',
    icon: '📄',
    description: 'Original document or data source (PDF, HTML, Wikipedia page)',
    example: 'Wikipedia: "Artemis_program"',
    color: '#3A9B9F',
    nodeCount: 3,
  },
  {
    level: 2,
    name: 'Chunk',
    icon: '🧩',
    description: 'Text segments split from source (semantic chunking)',
    example: 'Chunk 1: "Artemis I launched Nov 2022..."',
    color: '#4AABAF',
    nodeCount: 47,
  },
  {
    level: 3,
    name: 'Topic',
    icon: '🏷️',
    description: 'Thematic clusters emerging from chunks',
    example: 'Launch vehicles, Crew modules, International partners',
    color: '#5ABBBF',
    nodeCount: 62,
  },
  {
    level: 4,
    name: 'Statement',
    icon: '📝',
    description: 'Self-contained propositions cleaned from raw text (proposition-cleanup pass)',
    example: '"Artemis I used the Space Launch System rocket"',
    color: '#6ACBCF',
    nodeCount: 210,
  },
  {
    level: 5,
    name: 'Fact',
    icon: '✅',
    description: 'Verified, atomic claims extracted from statements',
    example: 'SLS Block 1 capacity: 95t to LEO',
    color: '#7ADBDF',
    nodeCount: 178,
  },
  {
    level: 6,
    name: 'Entity',
    icon: '🔗',
    description: 'Named entities linking across facts (people, orgs, vehicles, dates)',
    example: 'NASA, Orion, SLS, Artemis, ESA, JAXA',
    color: '#8AEBEF',
    nodeCount: 94,
  },
];

export const PIPELINE_STAGES = [
  {
    stage: 'Extract',
    icon: '🔍',
    title: 'Extraction Stage',
    description: 'Ingest raw documents → chunk → LLM extraction → structured elements',
    steps: [
      'Load documents (PDF, HTML, text) via LlamaIndex readers',
      'Semantic chunking with overlap preservation',
      'Pass 1 (Proposition Cleanup): LLM converts raw chunks → well-formed, self-contained propositions',
      'Pass 2 (Element Extraction): LLM extracts topics, statements, facts, entities from propositions',
      'Output: JSONL files with extracted elements per chunk',
    ],
    detail: 'Two LLM calls per chunk. First cleans messy text into propositions. Second extracts structured elements from clean propositions. Quality measurably improves with the cleanup pass.',
    config: {
      modelProvider: 'Amazon Bedrock (only built-in)',
      chunkSize: 'Configurable (default ~512 tokens)',
      overlap: 'Configurable (default ~50 tokens)',
      batchSize: 'Micro-batched for resumability',
    },
  },
  {
    stage: 'Build',
    icon: '🏗️',
    title: 'Graph Construction Stage',
    description: 'Populate graph store + vector indexes from extracted elements',
    steps: [
      'Read extracted JSONL from Extract stage',
      'Create nodes in graph store at all 6 hierarchy levels',
      'Build edges: source→chunk, chunk→topic, topic→statement, statement→fact, fact→entity',
      'Generate embeddings for vector-indexed levels (chunks, statements, facts)',
      'Write vectors to vector store (pgvector, Neptune, OpenSearch, S3 Vectors)',
      'Compute connectivity metrics (local/global)',
    ],
    detail: 'Deliberately separate from Extract. Allows pausing, inspecting, filtering large ingestion jobs. Micro-batched and resumable.',
    config: {
      graphStores: ['Neo4j', 'Amazon Neptune DB', 'Neptune Analytics', 'FalkorDB (contrib)'],
      vectorStores: ['Postgres+pgvector', 'Neptune', 'OpenSearch Serverless', 'S3 Vectors'],
      indexNames: ['chunk', 'statement', 'fact'],
      embeddings: 'Via Bedrock (Titan, Cohere, etc.)',
    },
  },
];

export const INFRASTRUCTURE_OPTIONS = [
  {
    layer: 'Graph Store',
    options: [
      { name: 'Neo4j', local: true, cost: 'Free (Docker)', notes: 'Mature, Cypher, APOC plugins', badge: 'Recommended for local' },
      { name: 'Amazon Neptune DB', local: false, cost: 'AWS pricing', notes: 'Managed, Gremlin + openCypher', badge: 'Production AWS' },
      { name: 'Neptune Analytics', local: false, cost: 'AWS pricing', notes: 'Serverless, graph analytics', badge: 'Large graphs' },
      { name: 'FalkorDB', local: true, cost: 'Free (Docker)', notes: 'Separate contrib package required', badge: 'Redis-based' },
    ],
  },
  {
    layer: 'Vector Store',
    options: [
      { name: 'Postgres + pgvector', local: true, cost: 'Free (Docker)', notes: 'SQL + vectors, ACID', badge: 'Recommended for local' },
      { name: 'Amazon Neptune', local: false, cost: 'AWS pricing', notes: 'Unified graph + vector', badge: 'Unified backend' },
      { name: 'OpenSearch Serverless', local: false, cost: 'AWS pricing', notes: 'Managed search + vectors', badge: 'Search-heavy' },
      { name: 'S3 Vectors', local: false, cost: 'AWS pricing', notes: 'Native S3 vector index', badge: 'Serverless' },
    ],
  },
  {
    layer: 'Model Provider',
    options: [
      { name: 'Amazon Bedrock', local: false, cost: 'Per-call', notes: 'Only built-in option; Titan, Claude, Cohere, Llama', badge: 'Required' },
      { name: 'Custom Provider', local: true, cost: 'Varies', notes: 'Extensible via custom work', badge: 'Advanced' },
    ],
  },
];

export const TRAVERSAL_SEARCH_FLOW = [
  {
    step: 1,
    name: 'Embed Question',
    description: 'User question → embedding vector via Bedrock',
    icon: '🔤',
  },
  {
    step: 2,
    name: 'Vector Anchor Search',
    description: 'Top-K similarity search against vector store (chunks/statements/facts) to find entry points',
    icon: '🎯',
  },
  {
    step: 3,
    name: 'Graph Traversal',
    description: 'From anchors, follow entity/topic edges across hierarchy levels to pull connected context',
    icon: '🕸️',
  },
  {
    step: 4,
    name: 'Context Assembly',
    description: 'Group retrieved content by topic and source, deduplicate, rank by relevance',
    icon: '📦',
  },
  {
    step: 5,
    name: 'LLM Generation',
    description: 'Supply assembled context + original question to LLM for final answer',
    icon: '🤖',
  },
];

// Simulator: Graph connectivity metrics explorer
export const GRAPH_STATS_DEMO = {
  source: 3,
  chunk: 47,
  topic: 62,
  statement: 210,
  fact: 178,
  entity: 94,
  localConnectivity: 1.31,
  globalConnectivity: 0.87,
};

export function computeConnectivityInsights(stats) {
  const { chunk, topic, statement, fact, entity, localConnectivity, globalConnectivity } = stats;
  const avgEdgesPerChunk = (statement / chunk).toFixed(1);
  const factToEntityRatio = (fact / entity).toFixed(1);
  const stmtToFactRatio = (statement / fact).toFixed(1);

  return {
    avgEdgesPerChunk,
    factToEntityRatio,
    stmtToFactRatio,
    localConnectivity,
    globalConnectivity,
    interpretation: {
      local: localConnectivity > 1
        ? 'Healthy: chunks connect to multiple statements/topics'
        : 'Sparse: chunks may be isolated',
      global: globalConnectivity > 0.5
        ? 'Well-connected: entities link across document boundaries'
        : 'Fragmented: entities mostly within single documents',
    },
  };
}

// Simulator: Traversal depth vs. context size
export const TRAVERSAL_DEPTH_NODES = [
  { depth: 0, label: 'Anchors (vector)', nodes: 5, tokens: 1200, description: 'Top-5 vector hits' },
  { depth: 1, label: 'Statements', nodes: 18, tokens: 4100, description: 'Direct statement neighbors' },
  { depth: 2, label: 'Topics + Facts', nodes: 35, tokens: 7800, description: 'Topic clusters & facts' },
  { depth: 3, label: 'Entities', nodes: 52, tokens: 11200, description: 'Cross-document entities' },
  { depth: 4, label: 'Full neighborhood', nodes: 78, tokens: 16500, description: 'All reachable within 4 hops' },
];

export function estimateTraversalCost(depth, tokenPricePerM = 3) {
  const level = TRAVERSAL_DEPTH_NODES.find(d => d.depth === depth) || TRAVERSAL_DEPTH_NODES[0];
  const costPerQuery = (level.tokens * tokenPricePerM) / 1_000_000;
  const costPer1k = costPerQuery * 1000;
  return {
    nodes: level.nodes,
    tokens: level.tokens,
    costPerQuery: costPerQuery.toFixed(6),
    costPer1k: costPer1k.toFixed(2),
  };
}

// Code examples from the article (cleaned of copyright/site references)
export const CODE_DOCKER_COMPOSE = `version: '3.8'
services:
  neo4j:
    image: neo4j:5
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/graphrag-password
    volumes:
      - neo4j_data:/data

  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=graphrag-password
      - POSTGRES_DB=graphrag
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  neo4j_data:
  postgres_data:`;

export const CODE_INSTALL = `# Core toolkit (lexical-graph component)
pip install graphrag-lexical-graph

# Postgres vector store dependencies
pip install psycopg2-binary pgvector

# Document ingestion (Wikipedia reader + HTML cleanup)
pip install llama-index-readers-web html2text`;

export const CODE_EXTRACT_BUILD = `from graphrag_toolkit.lexical_graph import LexicalGraphIndex
from graphrag_toolkit.lexical_graph.storage import GraphStoreFactory, VectorStoreFactory
from llama_index.readers.web import SimpleWebPageReader

# Local Neo4j graph store
neo4j_connection = "neo4j://neo4j:graphrag-password@localhost:7687"

# Local Postgres vector store (pgvector)
postgres_connection = "postgresql://postgres:graphrag-password@localhost:5432/graphrag"

with (
    GraphStoreFactory.for_graph_store(neo4j_connection) as graph_store,
    VectorStoreFactory.for_vector_store(
        postgres_connection,
        index_names=["chunk"],
    ) as vector_store,
):
    graph_index = LexicalGraphIndex(graph_store, vector_store)

    # Real Wikipedia articles covering related but distinct topics
    docs = SimpleWebPageReader(html_to_text=True).load_data([
        "https://en.wikipedia.org/wiki/Artemis_program",
        "https://en.wikipedia.org/wiki/International_Space_Station",
        "https://en.wikipedia.org/wiki/Commercial_Crew_Program",
    ])

    # Runs both Extract + Build stages in one call
    graph_index.extract_and_build(docs, show_progress=True)`;

export const CODE_INSPECT_STATS = `    # Still inside the 'with' block from above
    stats = graph_index.get_stats()
    print(stats)
    # Example output:
    # {'source': 3, 'chunk': 47, 'topic': 62, 'statement': 210,
    #  'fact': 178, 'entity': 94, 'localConnectivity': 1.31,
    #  'globalConnectivity': 0.87, ...}`;

export const CODE_QUERY = `    # Still inside the same 'with' block
    from graphrag_toolkit.lexical_graph import LexicalGraphQueryEngine

    query_engine = LexicalGraphQueryEngine.for_traversal_based_search(
        graph_store,
        vector_store,
        versioning=False,
    )

    response = query_engine.query(
        "How does the Commercial Crew Program relate to crew transport "
        "for the International Space Station, and how might that "
        "connect to Artemis program crew logistics?"
    )

    print(response)

    # Optional: structured JSON output instead of plain text
    # response = query_engine.query(
    #     "...question...",
    #     context_format="json",
    #     verbose=False,
    # )`;

export const CODE_SEPARATE_QUERY = `# Separate script for querying an already-built graph
from graphrag_toolkit.lexical_graph import LexicalGraphQueryEngine
from graphrag_toolkit.lexical_graph.storage import GraphStoreFactory, VectorStoreFactory

neo4j_connection = "neo4j://neo4j:graphrag-password@localhost:7687"
postgres_connection = "postgresql://postgres:graphrag-password@localhost:5432/graphrag"

with (
    GraphStoreFactory.for_graph_store(neo4j_connection) as graph_store,
    VectorStoreFactory.for_vector_store(
        postgres_connection,
        index_names=["chunk"],
    ) as vector_store,
):
    query_engine = LexicalGraphQueryEngine.for_traversal_based_search(
        graph_store,
        vector_store,
        versioning=False,
    )

    response = query_engine.query("Your multi-hop question here")
    print(response)`;

// Key differentiators table
export const GRAPHRAG_VS_VECTOR = [
  { aspect: 'Retrieval Unit', vector: 'Fixed-size chunks (isolated)', graphrag: 'Hierarchy levels + graph edges' },
  { aspect: 'Multi-hop Questions', vector: 'Fails — no cross-chunk links', graphrag: 'Native — follows entity/topic edges' },
  { aspect: 'Entity Resolution', vector: 'Implicit (similarity only)', graphrag: 'Explicit (canonical entity nodes)' },
  { aspect: 'Context Assembly', vector: 'Top-K chunks concatenated', graphrag: 'Thematic grouping by topic/source' },
  { aspect: 'Explainability', vector: 'Opaque similarity scores', graphrag: 'Traversable path from anchor to answer' },
  { aspect: 'Freshness/Updates', vector: 'Re-embed entire corpus', graphrag: 'Versioned updates (archive old, add new)' },
  { aspect: 'Infrastructure', vector: 'Vector DB only', graphrag: 'Graph DB + Vector DB (both swappable)' },
];

// Advanced features from the toolkit
export const ADVANCED_FEATURES = [
  {
    name: 'MCP Server Exposure',
    description: 'Expose tenant graph as callable tool via Model Context Protocol. Agents browse catalog of domain-specific graphs and pick the right one.',
    icon: '🔌',
  },
  {
    name: 'Multi-tenancy',
    description: 'Host multiple separate graphs (different doc collections, users) in same underlying stores. No per-tenant infrastructure provisioning.',
    icon: '🏢',
  },
  {
    name: 'Metadata Filtering',
    description: 'Constrain indexing and querying to specific document subsets via user-defined tags. Enable per-user, per-project, per-domain isolation.',
    icon: '🏷️',
  },
  {
    name: 'Versioned Updates',
    description: 'Re-ingest changed documents: archive old version automatically, add new. No stale contradictions in the graph.',
    icon: '📦',
  },
  {
    name: 'BYOKG-RAG',
    description: 'Separate component for teams with existing knowledge graphs. Skip extraction entirely; add multi-strategy QA layer over your graph.',
    icon: '🗄️',
  },
];

// Workshop & Explorer references
export const NEXT_STEPS = [
  {
    title: 'Self-Guided Workshop',
    description: 'Jupyter notebooks walking through extraction, querying, multi-tenancy, versioning, and MCP server setup.',
    link: 'github.com/awslabs/graphrag-toolkit/tree/main/examples/lexical-graph/workshop',
    type: 'workshop',
  },
  {
    title: 'RAG Explorer Application',
    description: 'Compare graph-based vs. plain vector RAG responses side-by-side on your own data. See the difference concretely.',
    link: 'github.com/aws-samples/sample-rag-explorer-graphragtoolkit',
    type: 'app',
  },
  {
    title: 'Graph Model Documentation',
    description: 'Official documentation of the 6-level hierarchical lexical graph model and traversal-based querying.',
    link: 'awslabs.github.io/graphrag-toolkit/lexical-graph/graph-model/',
    type: 'docs',
  },
  {
    title: 'Querying Documentation',
    description: 'Traversal-based search details, context_format options, verbose mode, and configuration parameters.',
    link: 'awslabs.github.io/graphrag-toolkit/lexical-graph/querying/',
    type: 'docs',
  },
];

// Proposition cleanup pass explanation
export const PROPOSITION_CLEANUP = {
  title: 'Why Two LLM Calls Per Chunk?',
  explanation: 'Raw chunks contain noise: headers, fragments, run-on sentences. The proposition-cleanup pass (Pass 1) uses an LLM to convert raw text into well-formed, self-contained propositions. Pass 2 then extracts topics/statements/facts/entities from these clean propositions rather than from messy raw text.',
  evidence: 'Per the toolkit\'s own documentation, extraction quality measurably improves when the proposition-cleanup pass runs first. The second call can run directly against raw content (optional), but the two-pass approach yields better structured elements.',
  pass1: 'Raw chunk → Clean propositions (self-contained, decontextualized)',
  pass2: 'Clean propositions → Topics, Statements, Facts, Entities',
};