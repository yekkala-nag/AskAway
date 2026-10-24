// ============================================================================
// MULTIMODAL RAG ENGINE — CLIP/SigLIP, layout, chart QA, modality router
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const MODALITY_TABLE = [
  { mod: "Scanned pages / OCR", embed: "Text + layout (DocLayNet) + OCR conf", cite: "page bbox", trap: "OCR order ≠ reading order" },
  { mod: "Charts / plots", embed: "Deplot-style table extraction + caption", cite: "figure + recovered table", trap: "Hue/size encodings need vision LLM" },
  { mod: "Photos / figures", embed: "CLIP/SigLIP + VQA caption", cite: "image region", trap: "Caption hallucinates detail" },
  { mod: "Tables (visual)", embed: "Table Transformer grid → table_df", cite: "row/cell rect", trap: "Merged cells break grids" }
];

export const VLM_TABLE = [
  { model: "CLIP / SigLIP", role: "Retrieval embeddings", note: "Bi-encoder for image↔text; rerank with VQA" },
  { model: "LLaVA / PaLI-GEMMA", role: "VQA + captioning", note: "Answer + cite region; verify numbers" },
  { model: "DePlot / ChartQA", role: "Chart → table", note: "Plot to data, then SQL/text path" }
];

// ── Simulator: modality router ──────────────────────────────────────────────
export const ROUTE_MODALITY = (mix = { scan: 30, chart: 20, photo: 10, table: 40 }) => {
  const total = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  const steps = [];
  if (mix.scan) steps.push(`OCR+layout (${mix.scan}%)`);
  if (mix.table) steps.push(`Table-Transformer→table_df (${mix.table}%)`);
  if (mix.chart) steps.push(`DePlot→table (${mix.chart}%)`);
  if (mix.photo) steps.push(`SigLIP+VQA caption (${mix.photo}%)`);
  const visionShare = (mix.chart + mix.photo) / total;
  return {
    pipeline: steps.join(" + ") || "text-only",
    visionLLM: visionShare > 0.3 ? "REQUIRED (vision share >30%) — budget O5-style fallback" : "fallback only",
    cite: "Every modality cites geometry: bbox / rect / figure — no naked claims."
  };
};

export const PYTHON_MMRAG_CODE = `# ============================================================================
# MULTIMODAL RAG ROUTER: per-page modality -> extraction -> typed store
# ============================================================================
def route_page(modality: str) -> str:
    return {"scan": "ocr+layout", "table": "table-transformer",
            "chart": "deplot->table", "photo": "siglip+vqa"}.get(modality, "text")

def ingest(pages: list[dict]):
    for p in pages:
        kind = route_page(p["modality"])
        if kind == "deplot->table":
            p["table"] = deplot(p["image"])      # chart -> data, then SQL/text
        elif kind == "siglip+vqa":
            p["caption"], p["region"] = vqa(p["image"])  # cite region!
    return pages
`;

export const PIPELINE_STAGES = [
  { stage: "1 · Parse", action: "Partition PDF → text chunks + image files + table structure", lib: "document partitioner + poppler for raster", trap: "Flat text chunking drops charts" },
  { stage: "2 · Summarize", action: "Vision call per image → dense searchable caption", lib: "multimodal chat model at index time", trap: "Logos/icons — filter by min bytes" },
  { stage: "3 · Store", action: "Multi-vector retriever: embeddings + docstore by shared id", lib: "vector DB + in-memory/raw doc store", trap: "Only embedding summaries loses pixels" },
  { stage: "4 · Query", action: "Retrieve → load raw text paths + base64 images → grounded answer", lib: "multimodal prompt with typed metadata", trap: "Must branch on metadata.type" }
];

export const PYTHON_MVRAG_PIPELINE = `# Four-stage multimodal RAG (API-driven)
from partitioner import partition_pdf  # text / Image / table elements

raw = partition_pdf("report.pdf", extract_images_dir="./img", infer_table_structure=True)
text_chunks, image_paths = [], []
for el in raw:
    if el.is_composite_text:
        text_chunks.append(str(el))
    elif el.is_image:
        image_paths.append(el.image_path)

def summarize_for_search(image_path, vision_client):
    return vision_client.describe(image_path, prompt="Dense retrieval summary.")

summaries = [summarize_for_search(p, vision_client) for p in image_paths]

# MultiVectorRetriever: embed summaries + text; docstore holds raw paths/content
retriever.add_embedded(text_chunks + summaries, ids=...)
retriever.docstore.link(ids, raw_docs_with_type_metadata)

def answer(question):
    docs = retriever.invoke(question)
    parts = [load_text(d) if d.type == "text" else load_image_b64(d) for d in docs]
    return vision_client.chat(parts + [question])
`;

/** Index-time cost vs retrieval quality tradeoff */
export const SIM_PIPELINE_COST = (imageCount = 12, avgKb = 80, skipSmallKb = 20) => {
  const n = Math.max(0, Math.round(imageCount));
  const skipRate = Math.min(0.6, (skipSmallKb / Math.max(avgKb, 1)) * 0.25);
  const kept = Math.max(0, Math.round(n * (1 - skipRate)));
  const indexCalls = kept + Math.ceil(n * 0.1);
  return {
    images: n,
    visionIndexCalls: indexCalls,
    advice: indexCalls > 40 ? "Batch + cache summaries; filter icons under size threshold" : "Reasonable for reports/manuals",
    retrieveNote: "Query sends matched raw images + text — not summary alone"
  };
};
