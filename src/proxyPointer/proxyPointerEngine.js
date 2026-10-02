// ============================================================================
// PROXY-POINTER RAG ENGINE: STRUCTURE MEETS SCALE (100% ACCURACY)
// Gemini Embeddings + Pointer Map Architecture
// ============================================================================

export const SAMPLE_MARKDOWN_DOC = `# Cloud Identity & Access Management (IAM)
Version 4.2 · Last Updated: 2026-04-10

## 1. Authentication Protocols

### 1.1 OAuth 2.0 Authorization Code Flow with PKCE
The Authorization Code Flow with Proof Key for Code Exchange (PKCE) is the mandatory standard for single-page applications (SPAs) and native mobile apps.

#### 1.1.1 Code Challenge & Verifier Generation
1. The client creates a cryptographically random string called the code_verifier (43 to 128 characters, unreserved URL characters).
2. The client calculates the code_challenge by applying SHA-256 to the verifier and base64url-encoding the hash.
3. The client redirects to the /authorize endpoint passing code_challenge and code_challenge_method=S256.

#### 1.1.2 Token Exchange & Validation
When the authorization server returns an authorization code, the client sends a POST request to /oauth/token with the raw code_verifier. The server computes SHA-256(code_verifier) and compares it with the stored code_challenge. If matched, access and refresh tokens are issued.

### 1.2 SAML 2.0 Enterprise Federation
For enterprise single sign-on (SSO), SAML 2.0 Web Browser SSO profile is supported with SHA-256 assertion signatures.

## 2. Token Lifetime & Revocation Matrix
Access tokens expire in 3600 seconds (1 hour). Refresh tokens expire in 30 days unless revoked via the /oauth/revoke endpoint.

<!-- NOISE BOILERPLATE (Filtered out by LLM Noise Filter) -->
* Legal Disclaimer: This software is provided "as is" without warranty of any kind.
* Cookie Policy: We use cookies to personalize content and analyze traffic.
* Copyright © 2026 Enterprise Corp. All rights reserved.
`;

export const PIPELINE_STEPS = [
  {
    id: "skeleton_tree",
    num: 1,
    title: "Skeleton Tree Parse",
    icon: "🦴",
    color: "#C47A6A",
    badge: "Regex Heading Parser · No LLM · <1 sec",
    desc: "Parses markdown headings (#, ##, ###, ####) into a hierarchical tree structure with start/end line offsets in under 1 second.",
    output: {
      tree_nodes: [
        { id: "node_1", title: "1. Authentication Protocols", level: 2, lines: "4 - 23", children: ["node_1_1", "node_1_2"] },
        { id: "node_1_1", title: "1.1 OAuth 2.0 Authorization Code Flow with PKCE", level: 3, lines: "6 - 19", children: ["node_1_1_1", "node_1_1_2"] },
        { id: "node_1_1_1", title: "1.1.1 Code Challenge & Verifier Generation", level: 4, lines: "9 - 14", children: [] },
        { id: "node_1_1_2", title: "1.1.2 Token Exchange & Validation", level: 4, lines: "15 - 19", children: [] },
        { id: "node_1_2", title: "1.2 SAML 2.0 Enterprise Federation", level: 3, lines: "20 - 23", children: [] },
        { id: "node_2", title: "2. Token Lifetime & Revocation Matrix", level: 2, lines: "24 - 27", children: [] }
      ]
    }
  },
  {
    id: "tree_walk",
    num: 2,
    title: "Tree Walk & Boundary Propagation",
    icon: "🌳",
    color: "#3A9B9F",
    badge: "Parent-Child Capping · Boundary Propagation",
    desc: "Walks the tree to compute exact character spans, establishes parent-child relationships, and calculates section boundaries.",
    output: {
      total_nodes: 6,
      root_depth: 4,
      boundary_rules: "Strict per-node containment (chunks never cross heading levels without explicit parent link)"
    }
  },
  {
    id: "noise_filter",
    num: 3,
    title: "LLM Noise Filter",
    icon: "🧹",
    color: "#ef4444",
    badge: "Gemini Flash Lite · 6 Category Exclusion",
    desc: "Applies lightweight Gemini Flash Lite to detect and purge boilerplate noise (legal disclaimers, cookie notices, copyright footers).",
    output: {
      excluded_elements: [
        "Legal Disclaimer: This software is provided 'as is'...",
        "Cookie Policy: We use cookies to personalize...",
        "Copyright © 2026 Enterprise Corp. All rights reserved."
      ],
      tokens_saved_pct: "14.2%"
    }
  },
  {
    id: "breadcrumb_injection",
    num: 4,
    title: "Breadcrumb Injection",
    icon: "🏷️",
    color: "#7A6BA8",
    badge: "Prepend Ancestry Path",
    desc: "Prepends full hierarchical ancestry to each chunk to eliminate pronoun ambiguity and contextual blindness.",
    output: {
      injected_sample: "[Cloud Identity & Access Management > Authentication Protocols > OAuth 2.0 with PKCE > Code Challenge & Verifier Generation]\n1. The client creates a cryptographically random string called code_verifier..."
    }
  },
  {
    id: "chunking",
    num: 5,
    title: "Structure-Guided Chunking",
    icon: "✂️",
    color: "#f59e0b",
    badge: "2000 char · 200 overlap · Per-node boundaries",
    desc: "Splits text within each node boundary using 2000-character windows, ensuring code blocks and lists remain intact.",
    output: {
      total_proxy_chunks: 4,
      overlap_strategy: "200 characters with heading preservation"
    }
  },
  {
    id: "metadata_attach",
    num: 6,
    title: "Metadata & Pointer Attachment",
    icon: "📎",
    color: "#3A9B9F",
    badge: "doc_id · node_id · title · line_ranges · pointer_uri",
    desc: "Attaches pointer coordinates back to the source Markdown document for instant full-section resolution.",
    output: {
      chunk_metadata: {
        doc_id: "iam_policy_v4",
        node_id: "node_1_1_1",
        title: "1.1.1 Code Challenge & Verifier Generation",
        start_line: 9,
        end_line: 14,
        pointer_uri: "s3://docs/iam_policy_v4.md#L9-L14",
        parent_pointer_uri: "s3://docs/iam_policy_v4.md#L6-L19"
      }
    }
  },
  {
    id: "embedding",
    num: 7,
    title: "Gemini Embedding",
    icon: "🗄️",
    color: "#06b6d4",
    badge: "gemini-embedding-001 · 1536 dims",
    desc: "Generates high-dimensional vector embeddings on the breadcrumb-enriched proxy text for precision vector matching.",
    output: {
      model: "gemini-embedding-001",
      dimensions: 1536,
      similarity_metric: "Cosine Distance"
    }
  },
  {
    id: "faiss_index",
    num: 8,
    title: "FAISS Index & Pointer Map",
    icon: "📦",
    color: "#3A9B9F",
    badge: "Proxy Search Layer + Physical Pointer Map",
    desc: "Stores proxy vectors in FAISS for sub-millisecond retrieval and maps hit IDs directly to source document line pointers.",
    output: {
      index_type: "FAISS HNSWFlat",
      search_layer: "Proxy Vector Index (Breadcrumb Enriched)",
      retrieval_layer: "Pointer Map ➔ Full Source Document Section"
    }
  }
];

export const SEARCH_SCENARIOS = [
  {
    id: "pkce_verifier",
    query: "How is the code_verifier validated during PKCE token exchange?",
    proxyHit: {
      doc_title: "Cloud Identity & Access Management (IAM)",
      breadcrumb: "IAM > Authentication Protocols > OAuth 2.0 with PKCE > Token Exchange & Validation",
      snippet: "When the authorization server returns an authorization code, the client sends a POST request to /oauth/token with raw code_verifier. Server computes SHA-256(code_verifier) and compares with stored code_challenge.",
      node_id: "node_1_1_2",
      score: 0.942
    },
    pointerResolvedContext: `### 1.1 OAuth 2.0 Authorization Code Flow with PKCE
The Authorization Code Flow with Proof Key for Code Exchange (PKCE) is the mandatory standard for single-page applications (SPAs) and native mobile apps.

#### 1.1.1 Code Challenge & Verifier Generation
1. The client creates a cryptographically random string called the code_verifier (43 to 128 characters, unreserved URL characters).
2. The client calculates the code_challenge by applying SHA-256 to the verifier and base64url-encoding the hash.
3. The client redirects to the /authorize endpoint passing code_challenge and code_challenge_method=S256.

#### 1.1.2 Token Exchange & Validation
When the authorization server returns an authorization code, the client sends a POST request to /oauth/token with the raw code_verifier. The server computes SHA-256(code_verifier) and compares it with the stored code_challenge. If matched, access and refresh tokens are issued.`,
    standardRagComparison: {
      standardChunk: "POST request to /oauth/token with raw code_verifier. Server computes SHA-256(code_verifier)... [Context truncated without section title or PKCE setup prerequisites]",
      standardFailure: "Misses how code_challenge was originally created in step 1.1.1; LLM cannot explain the cryptographic relationship between S256 challenge and verifier."
    }
  },
  {
    id: "token_revocation",
    query: "What is the access token lifetime and how can refresh tokens be revoked?",
    proxyHit: {
      doc_title: "Cloud Identity & Access Management (IAM)",
      breadcrumb: "IAM > Token Lifetime & Revocation Matrix",
      snippet: "Access tokens expire in 3600 seconds (1 hour). Refresh tokens expire in 30 days unless revoked via the /oauth/revoke endpoint.",
      node_id: "node_2",
      score: 0.965
    },
    pointerResolvedContext: `## 2. Token Lifetime & Revocation Matrix
Access tokens expire in 3600 seconds (1 hour). Refresh tokens expire in 30 days unless revoked via the /oauth/revoke endpoint.`,
    standardRagComparison: {
      standardChunk: "Access tokens expire in 3600 seconds (1 hour). Refresh tokens expire in 30 days unless revoked via /oauth/revoke. * Legal Disclaimer: This software is provided 'as is'...",
      standardFailure: "Standard RAG includes legal disclaimer boilerplate and fails to isolate clean token lifetimes."
    }
  }
];

export const NOISE_FILTER_CATEGORIES = [
  { name: "Legal Disclaimers & Warranties", icon: "⚖️", example: "This document is provided for informational purposes only..." },
  { name: "Cookie & Tracking Banners", icon: "🍪", example: "We use cookies to analyze web traffic and personalize ads..." },
  { name: "Copyright & Trademark Footers", icon: "©️", example: "Copyright © 2026 Corp. All rights reserved." },
  { name: "Site Navigation Breadcrumbs", icon: "🧭", example: "Home > Products > Cloud > IAM > Docs" },
  { name: "Duplicate Changelog Footers", icon: "📝", example: "v1.0 initial commit, v1.1 minor typo fix..." },
  { name: "Promotional / Marketing Banners", icon: "📣", example: "Sign up today for our enterprise webinar!" }
];

export const MULTIMODAL_SCENARIOS = [
  {
    id: "q2_revenue_chart",
    title: "Scenario 1: Quarterly Revenue Breakdown Chart (Bar & Line Graph)",
    query: "What was the year-over-year revenue growth in Europe for Q2 2026?",
    documentTitle: "Enterprise Financial Report Q2 2026 (Page 14)",
    textProxy: {
      caption: "Figure 4.2: Regional Revenue Breakdown by Segment (North America, Europe, APAC) comparing Q2 2025 vs Q2 2026. Europe grew from $142M to $188M (+32.4% YoY).",
      ocrExtractedData: "Europe: Q2 2025 = $142M | Q2 2026 = $188M | Delta = +$46M (+32.4%)",
      embeddingDims: 1536,
      modelUsed: "gemini-embedding-001 (Pure Text Embedding)"
    },
    multimodalPointer: {
      pointer_uri: "s3://assets/finance/2026/q2_revenue_chart_fig42.png",
      asset_type: "HIGH_RES_CHART_IMAGE",
      resolution: "2400 x 1600 px (300 DPI)",
      bbox_coordinates: { x: 72, y: 340, width: 480, height: 260, page: 14 }
    },
    multimodalLLMAnswer: {
      model: "Gemini 1.5 Pro / GPT-4o Multimodal",
      textAnswer: "According to Figure 4.2 on page 14 of the Q2 2026 Financial Report, revenue in Europe grew by +32.4% year-over-year, increasing from $142 Million in Q2 2025 to $188 Million in Q2 2026, driven primarily by enterprise SaaS expansion.",
      confidence: "99.4%"
    },
    clipColPaliVsProxyComparison: {
      clipOverhead: "$0.042 / image embedding + 4096d multi-vector index latency (180ms)",
      proxyPointerAdvantage: "Fast text embedding ($0.0001) + Sub-10ms search + Direct pointer injection into Multimodal LLM"
    }
  },
  {
    id: "system_arch_diagram",
    title: "Scenario 2: Distributed Microservices Architecture Diagram",
    query: "Which caching layer sits between the API Gateway and Auth Service?",
    documentTitle: "Platform Architecture Blueprint v3.1 (Page 8)",
    textProxy: {
      caption: "Figure 2.1: Distributed Microservices Topology showing API Gateway routing through Redis Cluster L2 Cache before hitting Auth Service and IAM Token Store.",
      ocrExtractedData: "Nodes: [API Gateway] ➔ [Redis Cluster Cache (L2)] ➔ [Auth Service / Vault]",
      embeddingDims: 1536,
      modelUsed: "gemini-embedding-001 (Pure Text Embedding)"
    },
    multimodalPointer: {
      pointer_uri: "s3://assets/architecture/v3/microservices_topology_fig21.svg",
      asset_type: "VECTOR_SVG_DIAGRAM",
      resolution: "Scalable Vector Graphics (SVG)",
      bbox_coordinates: { x: 50, y: 120, width: 520, height: 380, page: 8 }
    },
    multimodalLLMAnswer: {
      model: "Gemini 1.5 Pro / GPT-4o Multimodal",
      textAnswer: "As illustrated in Figure 2.1 on page 8 of the Platform Architecture Blueprint, a Redis Cluster L2 Cache sits directly between the API Gateway and the Auth Service to cache validated JWT session tokens and prevent DB stampedes.",
      confidence: "98.9%"
    },
    clipColPaliVsProxyComparison: {
      clipOverhead: "ColPali requires 1024 visual tokens per page (~35MB memory per document)",
      proxyPointerAdvantage: "Lightweight caption proxy (<250 text tokens) + Instant high-res SVG pointer resolution"
    }
  }
];
