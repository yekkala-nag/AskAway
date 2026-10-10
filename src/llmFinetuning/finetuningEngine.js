// ============================================================================
// MODEL FINE-TUNING & QLORA/DPO END-TO-END ENGINE
// Comprehensive, production-grade logic for PEFT, LoRA, QLoRA, DPO, RLHF,
// Hardware & VRAM Estimation, Dataset Preparation, and Inference Comparisons
// Extended with: Fine-tuning Agentic AI (ML Mastery) — multi-agent fine-tuning,
// agentic behavior distillation, tool-use fine-tuning, and agent evaluation loops
// ============================================================================

export const FINE_TUNE_VS_RAG_MATRIX = [
  {
    criterion: "Rigid & Complex Formatting Requirements",
    ragApproach: "Poor (Missed/added fields, hallucinations in legacy/synoptic schemas).",
    fineTuneApproach: "Superior (~98% accuracy by internalizing structural constraints in weights).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune with LoRA/QLoRA when deterministic schema compliance is required."
  },
  {
    criterion: "System Prompt Token Costs at Scale",
    ragApproach: "High ($30k context tokens per call; $320k/yr API bill at scale with 50+ few-shot examples).",
    fineTuneApproach: "Zero System Prompt Overhead (Internalized into model parameters).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune to eliminate huge prompt prefixes and reduce latency by up to 60%."
  },
  {
    criterion: "Combinatorial Logic & 50+ Branching Rules",
    ragApproach: "Degrades (Context window overload on overlapping multi-condition branching).",
    fineTuneApproach: "Robust (Low-rank adapters learn non-linear decision boundaries).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune when complex domain logic cannot fit cleanly into a prompt."
  },
  {
    criterion: "Frequently Changing Dynamic Knowledge",
    ragApproach: "Superior (Real-time index updates in vector DB without model retraining).",
    fineTuneApproach: "Expensive & Slow (Requires continuous periodic fine-tuning loops).",
    winner: "RAG",
    recommendation: "Use RAG for rapidly changing facts, live inventory, news, and policies."
  },
  {
    criterion: "Tone, Style, Persona & Brand Voice",
    ragApproach: "Fragile (Drifts easily across long multi-turn conversations).",
    fineTuneApproach: "Flawless (Consistent persona and brand voice encoded in weight activations).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune when brand voice or specialized conversational tone is a core requirement."
  },
  {
    criterion: "Latency & Time-To-First-Token (TTFT)",
    ragApproach: "High (Retrieval overhead + prompt processing of 4,000+ context tokens).",
    fineTuneApproach: "Ultra-Low (Compact prompts + small dedicated fine-tuned model like 7B/8B).",
    winner: "Fine-Tuning",
    recommendation: "Deploy fine-tuned 7B/8B model locally with vLLM for <30ms TTFT."
  }
];

export const FINE_TUNING_PARADIGMS = [
  {
    id: "full_sft",
    name: "Full Fine-Tuning (Full SFT)",
    type: "Supervised",
    paramsUpdated: "100% of weights",
    memoryMultiplier: "16x - 20x model weight size",
    pros: "Maximum expressiveness and domain adaptation capacity.",
    cons: "High VRAM requirements; catastrophic forgetting risk; requires multi-GPU clusters.",
    idealFor: "Training foundational domain models from scratch or huge dataset updates."
  },
  {
    id: "lora",
    name: "LoRA (Low-Rank Adaptation)",
    type: "PEFT (Parameter-Efficient)",
    paramsUpdated: "0.1% - 1.0% of weights",
    memoryMultiplier: "4x - 6x model weight size",
    pros: "Freezes base weights; trains low-rank decomposition matrices (B × A); swappable adapters.",
    cons: "Requires 16-bit base model in VRAM during training unless combined with quantization.",
    idealFor: "Task specialization, multilingual adaptation, fast task switching."
  },
  {
    id: "qlora",
    name: "QLoRA (Quantized LoRA)",
    type: "PEFT + 4-bit NF4",
    paramsUpdated: "0.1% - 0.5% of weights",
    memoryMultiplier: "1.2x - 1.5x model weight size",
    pros: "4-bit NormalFloat base weights + FP8 Double Quantization + Paged Optimizers; fits on single consumer GPU (24GB VRAM).",
    cons: "Slightly slower gradient calculation compared to unquantized FP16 LoRA.",
    idealFor: "Fine-tuning 7B to 70B models on a single GPU (RTX 3090/4090 or single A100)."
  },
  {
    id: "dpo",
    name: "DPO (Direct Preference Optimization)",
    type: "Preference Alignment",
    paramsUpdated: "0.1% - 1.0% (with LoRA/QLoRA)",
    memoryMultiplier: "2x model size (requires reference policy model)",
    pros: "Eliminates separate reward model training and complex RL actor-critic loops (PPO). Directly optimizes log ratio of chosen vs rejected responses.",
    cons: "Requires high-quality paired preference datasets (Prompt, Chosen, Rejected).",
    idealFor: "Safety alignment, removing refusal bugs, formatting enforcement, preference ranking."
  }
];

export const LORA_MATHEMATICAL_CONCEPTS = [
  {
    concept: "Low-Rank Decomposition (LoRA)",
    formula: "h = W_0 x + \\frac{\\alpha}{r} (B \\times A) x",
    description: "Decomposes the weight update matrix ΔW (d × k) into two low-rank matrices B (d × r) and A (r × k) where r ≪ min(d, k). B is initialized to 0 and A to Gaussian noise, ensuring ΔW = 0 at step 0.",
    vramImpact: "Reduces trainable parameters by 99.8% and optimizer state memory by >95%."
  },
  {
    concept: "4-bit NormalFloat (NF4)",
    formula: "q_i = Q_{\\text{NF4}}(w_i)",
    description: "Information-theoretically optimal quantile quantization designed specifically for normally distributed neural network weights, yielding equal probability mass per quant bin.",
    vramImpact: "Compresses 16-bit FP weights to 4 bits (4x reduction in base weight footprint)."
  },
  {
    concept: "Double Quantization (DQ)",
    formula: "c_{\\text{FP32}} \\rightarrow c_{\\text{FP8}} + c_{\\text{group}}",
    description: "Quantizes the quantization constants themselves. Instead of storing 32-bit floats for block scales, stores 8-bit floats with a second stage scale factor across blocks of 256.",
    vramImpact: "Saves ~0.373 bits per parameter (~3 GB VRAM saved on a 70B parameter model)."
  },
  {
    concept: "Paged Optimizers",
    formula: "\\text{VRAM} \\rightleftharpoons \\text{CPU RAM (CUDA Unified Memory)}",
    description: "Leverages CUDA Unified Memory to automatically page optimizer state tensors to CPU system RAM during memory spikes (e.g. processing long context outliers).",
    vramImpact: "Completely prevents training crashes due to CUDA Out-Of-Memory (OOM) errors."
  },
  {
    concept: "DPO Objective Loss",
    formula: "\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]",
    description: "Calculates the implicit reward difference between preferred response (y_w) and rejected response (y_l) directly via the policy model π_θ and frozen reference model π_ref.",
    vramImpact: "Avoids allocating a 3rd distinct reward model network in VRAM."
  }
];

export const HYPERPARAMETER_DEFAULTS = [
  { name: "Learning Rate", defaultVal: "2e-4", sweep: "[5e-5, 1e-4, 2e-4, 4e-4]", note: "Primary step size for adapter update. Use Cosine LR scheduler with 5% warmup." },
  { name: "LoRA Rank (r)", defaultVal: "16", sweep: "[8, 16, 32, 64, 128]", note: "Adapter capacity. r=16 is optimal for most tasks; r=64 for complex math/coding." },
  { name: "LoRA Alpha (α)", defaultVal: "32 (2 × r)", sweep: "2 × r", note: "Scaling factor. Setting α = 2*r ensures stable gradient magnitudes during sweeps." },
  { name: "Target Modules", defaultVal: "All Linear Layers", sweep: "q, k, v, o, gate, up, down", note: "Applying LoRA to ALL projection layers yields significantly higher performance (Schulman rule)." },
  { name: "Effective Batch Size", defaultVal: "16", sweep: "per_device (4) × grad_accum (4)", note: "Accumulating gradients enables large effective batch sizes with small per-device VRAM." },
  { name: "Weight Decay", defaultVal: "0.01", sweep: "[0.0, 0.01, 0.1]", note: "Regularization preventing adapter overfitting on small domain datasets." }
];

export const HARDWARE_PRESETS = [
  { id: "1b", name: "1B - 3B Small Models (Llama 3.2 1B/3B, SmolLM)", baseParamsB: 3, vramBase16: 6, vramBase4: 1.8 },
  { id: "7b", name: "7B - 8B Standard Models (Mistral 7B, Llama 3.1 8B, Qwen 2.5 7B)", baseParamsB: 8, vramBase16: 16, vramBase4: 4.8 },
  { id: "14b", name: "14B Mid-Tier Models (Qwen 2.5 14B, Gemma 2 9B/27B)", baseParamsB: 14, vramBase16: 28, vramBase4: 8.5 },
  { id: "32b", name: "32B DeepSeek / Qwen Models (Qwen 2.5 32B)", baseParamsB: 32, vramBase16: 64, vramBase4: 19.5 },
  { id: "70b", name: "70B Enterprise Models (Llama 3.3 70B, Qwen 2.5 72B)", baseParamsB: 70, vramBase16: 140, vramBase4: 42.0 }
];

export const CALCULATE_HARDWARE_ESTIMATE = (modelSizeB, method, seqLength, rank, batchSize) => {
  let baseWeightGb = 0;
  let adapterWeightGb = 0;
  let optimizerGb = 0;
  let activationGb = 0;

  const trainableParamsM = method === 'full' ? modelSizeB * 1000 : (rank * 4 * (modelSizeB / 8) * 7);

  if (method === 'full') {
    baseWeightGb = modelSizeB * 2.0; // 16-bit weights
    optimizerGb = (trainableParamsM / 1000) * 12.0; // FP32 master weights + Adam states (m, v)
    activationGb = (batchSize * seqLength * modelSizeB * 0.00015);
  } else if (method === 'lora') {
    baseWeightGb = modelSizeB * 2.0; // FP16 base weights
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.016; // Adam on adapter only
    activationGb = (batchSize * seqLength * 0.0008);
  } else if (method === 'qlora') {
    baseWeightGb = modelSizeB * 0.55; // 4-bit NF4 + Double Quant
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.012; // Paged AdamW 8-bit on adapter
    activationGb = (batchSize * seqLength * 0.0006);
  } else if (method === 'unsloth') {
    baseWeightGb = modelSizeB * 0.52;
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.008; // Cut Cross-Entropy + manual backprop
    activationGb = (batchSize * seqLength * 0.00025); // 80% activation memory reduction
  }

  const totalVramGb = parseFloat((baseWeightGb + adapterWeightGb + optimizerGb + activationGb + 1.2).toFixed(1));

  let recommendedGpu = "1x RTX 3090 / 4090 (24 GB VRAM)";
  let isFeasibleSingleGpu = true;

  if (totalVramGb <= 16) {
    recommendedGpu = "1x RTX 4080 (16 GB) or RTX 3090/4090 (24 GB)";
  } else if (totalVramGb <= 24) {
    recommendedGpu = "1x RTX 3090 / 4090 (24 GB) or 1x A10G (24 GB)";
  } else if (totalVramGb <= 48) {
    recommendedGpu = "1x A40 (48 GB) or 1x A6000 (48 GB)";
  } else if (totalVramGb <= 80) {
    recommendedGpu = "1x NVIDIA A100 / H100 (80 GB VRAM)";
  } else {
    const numGpus = Math.ceil(totalVramGb / 80);
    recommendedGpu = `${numGpus}x NVIDIA A100 / H100 80GB (FSDP / DeepSpeed ZeRO-3)`;
    isFeasibleSingleGpu = false;
  }

  return {
    trainableParamsM: Math.round(trainableParamsM),
    baseWeightGb: parseFloat(baseWeightGb.toFixed(1)),
    optimizerGb: parseFloat(optimizerGb.toFixed(2)),
    activationGb: parseFloat(activationGb.toFixed(2)),
    totalVramGb,
    recommendedGpu,
    isFeasibleSingleGpu
  };
};

export const DATASET_FORMATS = [
  {
    formatName: "Alpaca Instruction Format",
    desc: "Single-turn instruction-input-output triple. Ideal for simple question answering, summarization, and single-turn task execution.",
    example: JSON.stringify({
      instruction: "Convert the following raw clinical finding into synoptic standard format.",
      input: "Left upper lobe needle biopsy showing invasive ductal carcinoma, Nottingham grade 2.",
      output: "SPECIMEN: Left Upper Lobe Needle Biopsy\\nHISTOLOGIC TYPE: Invasive Ductal Carcinoma\\nHISTOLOGIC GRADE: Nottingham Grade 2 (Tubule: 2, Nuclear: 2, Mitotic: 1, Total: 5/9)"
    }, null, 2)
  },
  {
    formatName: "ShareGPT / Multi-Turn ChatML Format",
    desc: "Multi-turn conversations with system, user, and assistant roles. Used for chatbots, tool calling agents, and iterative debugging.",
    example: JSON.stringify({
      messages: [
        { role: "system", content: "You are an enterprise SQL specialist. Respond strictly in valid PostgreSQL JSON." },
        { role: "user", content: "Find top 5 customers with recurring failed payments in Q3 2024." },
        { role: "assistant", content: "SELECT c.id, c.name, COUNT(p.id) AS failed_count, SUM(p.amount) AS total_failed_usd FROM customers c JOIN payments p ON c.id = p.customer_id WHERE p.status = 'failed' AND p.created_at BETWEEN '2024-07-01' AND '2024-09-30' GROUP BY c.id, c.name ORDER BY failed_count DESC LIMIT 5;" }
      ]
    }, null, 2)
  },
  {
    formatName: "DPO Preference Format (Chosen vs Rejected)",
    desc: "Pairs a prompt with an ideal winning response and a flawed rejected response to steer model alignment without a reward model.",
    example: JSON.stringify({
      prompt: "Extract the net profit and EBITDA margin from this earnings report excerpt: 'Revenue was $4.2B with net income of $840M and EBITDA of $1.1B.'",
      chosen: "{\\n  \\\"net_profit_usd\\\": 840000000,\\n  \\\"ebitda_usd\\\": 1100000000,\\n  \\\"ebitda_margin_pct\\\": 26.19\\n}",
      rejected: "The net profit is 840M and the EBITDA is 1.1B. Revenue is 4.2B so EBITDA margin is around 26%."
    }, null, 2)
  }
];

export const INFERENCE_BENCHMARK_CASES = [
  {
    domain: "Synoptic Clinical / Medical Pathology",
    inputPrompt: "Process pathology finding: 'Biopsy right thyroid nodule, papillary thyroid carcinoma, classic type, measuring 1.4 cm. Margins uninvolved. 2 benign lymph nodes identified.'",
    baseModelOutput: "The patient has papillary thyroid carcinoma of classic type in the right thyroid nodule measuring 1.4 cm with negative margins and 2 benign lymph nodes.",
    baseFailureReason: "Failed to follow synoptic CAP structure; missing required fields (TNM stage, lymphovascular invasion tag); unusable in automated EHR pipelines.",
    fineTunedOutput: "{\n  \"specimen\": \"Right Thyroid Nodule, Biopsy\",\n  \"histologic_type\": \"Papillary Thyroid Carcinoma (Classic Variant)\",\n  \"tumor_size_max_cm\": 1.4,\n  \"margins\": \"Uninvolved\",\n  \"lymphovascular_invasion\": \"Not identified\",\n  \"regional_lymph_nodes\": {\n    \"examined\": 2,\n    \"involved\": 0\n  },\n  \"pathologic_stage_pTNM\": \"pT1b N0\"\n}",
    fineTunedAccuracy: "99.4% Valid JSON / 100% CAP Compliant"
  },
  {
    domain: "Enterprise Complex SQL with Row-Level Security",
    inputPrompt: "Write SQL query to fetch quarterly revenue grouped by department for tenant 'org_alpha_921' ensuring soft-deleted records (is_deleted = true) are excluded.",
    baseModelOutput: "SELECT department, SUM(revenue) FROM sales GROUP BY department;",
    baseFailureReason: "Critical security violation: Omitted tenant_id filter ('org_alpha_921') and failed to filter soft-deleted rows.",
    fineTunedOutput: "SELECT \n  department_id,\n  DATE_TRUNC('quarter', transaction_date) AS fiscal_quarter,\n  SUM(amount_cents) / 100.0 AS quarterly_revenue_usd\nFROM tenant_sales_ledger\nWHERE tenant_id = 'org_alpha_921'\n  AND is_deleted = FALSE\n  AND payment_status = 'settled'\nGROUP BY department_id, DATE_TRUNC('quarter', transaction_date)\nORDER BY fiscal_quarter DESC, quarterly_revenue_usd DESC;",
    fineTunedAccuracy: "100% Tenant Isolation Verified"
  },
  {
    domain: "Pydantic Schema Tool Calling Output",
    inputPrompt: "Format flight booking tool invocation for NYC to LHR on 2026-11-12 in business class with seat preference window.",
    baseModelOutput: "Booking flight from NYC to LHR on November 12th 2026 in Business class, window seat.",
    baseFailureReason: "Produced natural language instead of required strict JSON tool call structure; crashed tool execution agent.",
    fineTunedOutput: "{\n  \"name\": \"book_flight\",\n  \"arguments\": {\n    \"origin_airport_code\": \"JFK\",\n    \"destination_airport_code\": \"LHR\",\n    \"departure_date\": \"2026-11-12\",\n    \"cabin_class\": \"business\",\n    \"passenger_preferences\": {\n      \"seat_type\": \"window\",\n      \"meal\": \"standard\"\n    }\n  }\n}",
    fineTunedAccuracy: "100% Schema Validation Pass"
  }
];

export const RUN_QLORA_SIMULATOR = (rank = 16, learningRate = 0.0002, epochCount = 3, lrScheduler = 'cosine') => {
  const steps = [];
  let currentLoss = 2.48;
  let accuracy = 35.0;
  const totalSteps = epochCount * 10;

  for (let epoch = 1; epoch <= epochCount; epoch++) {
    const epochSteps = 10;
    for (let s = 1; s <= epochSteps; s++) {
      const globalStep = (epoch - 1) * epochSteps + s;
      const progress = globalStep / totalSteps;

      // LR Decay factor
      let lrFactor = 1.0;
      if (lrScheduler === 'cosine') {
        lrFactor = 0.5 * (1 + Math.cos(Math.PI * progress));
      } else {
        lrFactor = 1.0 - progress * 0.8;
      }

      const effectiveStepRate = learningRate * lrFactor * 1400 / Math.max(8, rank * 0.6);
      currentLoss = Math.max(0.045, currentLoss * (1 - effectiveStepRate));
      accuracy = Math.min(98.8, accuracy + ((98.8 - accuracy) * 0.16 * (1 + (rank / 64))));

      const gradNorm = parseFloat((0.85 * Math.exp(-progress * 2) + Math.random() * 0.1).toFixed(3));

      steps.push({
        globalStep,
        epoch,
        trainLoss: parseFloat(currentLoss.toFixed(4)),
        evalLoss: parseFloat((currentLoss * (1.05 + Math.sin(globalStep) * 0.02)).toFixed(4)),
        accuracyPct: parseFloat(accuracy.toFixed(1)),
        currentLr: (learningRate * lrFactor).toExponential(2),
        gradNorm
      });
    }
  }

  const finalAccuracy = steps[steps.length - 1].accuracyPct;
  const finalLoss = steps[steps.length - 1].evalLoss;

  return {
    rank,
    learningRate,
    epochCount,
    lrScheduler,
    steps,
    finalAccuracy,
    finalLoss,
    vramSavingsGb: 19.2,
    estimatedCost: `$${(epochCount * 12.5).toFixed(2)}`
  };
};

export const PYTHON_QLORA_TRAINING_SCRIPT = `# ============================================================================
# PRODUCTION QLORA FINE-TUNING PIPELINE (PYTORCH + TRL + PEFT)
# Single GPU 24GB VRAM Execution with 4-bit NF4 Quantization
# ============================================================================

import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)
from peft import LoraConfig, PeftModel, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig, DataCollatorForCompletionOnlyLM
from datasets import load_dataset

BASE_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
DATA_FILE = "./dataset_synoptic_reports.json"
RESPONSE_TEMPLATE = "[/INST]"
OUTPUT_DIR = "./mistral-qlora-adapter"

# ── 1. Configure 4-bit NF4 Quantization (BitsAndBytes) ───────────────────────
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True
)

# Load Quantized Base Model
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)

# ── 2. Configure LoRA (Targeting All Projection Matrices) ───────────────────
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# ── 3. Configure Tokenizer & Trainer ────────────────────────────────────────
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
tokenizer.pad_token = tokenizer.eos_token

sft_config = SFTConfig(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,  # Effective Batch Size = 16
    num_train_epochs=3,
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
    bf16=True,
    gradient_checkpointing=True,
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch"
)

# Mask Prompt Loss: Only calculate cross-entropy loss on target tokens
collator = DataCollatorForCompletionOnlyLM(
    response_template=RESPONSE_TEMPLATE,
    tokenizer=tokenizer
)

trainer = SFTTrainer(
    model=model,
    args=sft_config,
    peft_config=lora_config,
    train_dataset=load_dataset("json", data_files=DATA_FILE, split="train"),
    data_collator=collator
)

# Execute Fine-Tuning
trainer.train()
trainer.save_model(os.path.join(OUTPUT_DIR, "final"))

# ── 4. Merge Adapter Weights for High-Throughput vLLM Serving ────────────────
def merge_and_save():
    base = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.bfloat16,
        device_map="auto"
    )
    merged = PeftModel.from_pretrained(base, os.path.join(OUTPUT_DIR, "final"))
    merged = merged.merge_and_unload()
    merged.save_pretrained("./mistral-7b-synoptic-merged", safe_serialization=True)
    tokenizer.save_pretrained("./mistral-7b-synoptic-merged")
    print("Merged weights saved to ./mistral-7b-synoptic-merged")

merge_and_save()
`;

export const PYTHON_DPO_TRAINING_SCRIPT = `# ============================================================================
# PRODUCTION DPO (DIRECT PREFERENCE OPTIMIZATION) PIPELINE
# Aligns model behavior using (prompt, chosen, rejected) pairs without RLHF
# ============================================================================

import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig
from trl import DPOTrainer, DPOConfig
from datasets import load_dataset

SFT_MODEL = "./mistral-7b-synoptic-merged"
PREFERENCE_DATA = "./dpo_preferences.json"
OUTPUT_DIR = "./mistral-dpo-aligned"

tokenizer = AutoTokenizer.from_pretrained(SFT_MODEL)
tokenizer.pad_token = tokenizer.eos_token

# Load Base Policy Model and Frozen Reference Model
model = AutoModelForCausalLM.from_pretrained(
    SFT_MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
ref_model = AutoModelForCausalLM.from_pretrained(
    SFT_MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    bias="none",
    task_type="CAUSAL_LM"
)

dpo_config = DPOConfig(
    output_dir=OUTPUT_DIR,
    beta=0.1,  # Temperature hyperparameter for implicit reward scaling
    learning_rate=5e-7,
    num_train_epochs=2,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    bf16=True,
    logging_steps=5
)

dpo_trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,
    args=dpo_config,
    peft_config=lora_config,
    train_dataset=load_dataset("json", data_files=PREFERENCE_DATA, split="train"),
    tokenizer=tokenizer
)

dpo_trainer.train()
dpo_trainer.save_model(OUTPUT_DIR)
print("DPO Alignment Complete!")
`;

export const VLLM_SERVING_COMMAND = `# ============================================================================
# HIGH-THROUGHPUT vLLM DEPLOYMENT (OPENAI-COMPATIBLE API ENDPOINT)
# Serves the merged fine-tuned model with PagedAttention and continuous batching
# ============================================================================

python3 -m vllm.entrypoints.openai.api_server \\
    --model ./mistral-7b-synoptic-merged \\
    --port 8000 \\
    --tensor-parallel-size 1 \\
    --gpu-memory-utilization 0.90 \\
    --max-model-len 8192 \\
    --dtype bfloat16 \\
    --enforce-eager
`;

// ============================================================================
// FINE-TUNING AGENTIC AI — Extended Content from ML Mastery Guide
// Multi-agent fine-tuning, agentic behavior distillation, tool-use training,
// and agent evaluation loops
// ============================================================================

export const AGENTIC_FINE_TUNING_PIPELINE = [
  {
    stage: "1. Agent Behavior Data Collection",
    description: "Generate expert trajectories from strong agents (GPT-4o, Claude 3.5 Sonnet) solving complex tasks using tools, planning, and multi-step reasoning.",
    keyTechniques: [
      "ReAct / Plan-Execute trajectory logging",
      "Tool call + observation serialization",
      "State snapshots at each decision point",
      "Human preference annotations on trajectories"
    ],
    dataFormat: "JSONL with {task, trajectory, tools_used, outcome, preference_rank}",
    computeCost: "High — requires frontier model API calls"
  },
  {
    stage: "2. Behavior Cloning (SFT) on Agent Trajectories",
    description: "Supervised fine-tuning on expert agent trajectories to internalize planning, tool selection, and reasoning patterns.",
    keyTechniques: [
      "QLoRA on 7B–70B base models",
      "Packed sequences with conversation + tool format",
      "Loss masking on tool outputs (only train on agent tokens)",
      "Multi-turn conversation template with tool schema"
    ],
    dataFormat: "ChatML / OpenAI format with tool_calls and tool_results roles",
    computeCost: "Moderate — single GPU (24GB) for 7B QLoRA"
  },
  {
    stage: "3. Tool-Use Fine-Tuning (Function Calling)",
    description: "Specialized fine-tuning for reliable function calling with correct JSON schema adherence and parameter validation.",
    keyTechniques: [
      "Constrained decoding with JSON schema grammars",
      "Negative examples: malformed tool calls → correction",
      "Parallel tool call training",
      "Tool description injection at inference"
    ],
    dataFormat: "Function calling format (OpenAI / Mistral / Anthropic)",
    computeCost: "Low — can be combined with Stage 2"
  },
  {
    stage: "4. Preference Optimization (DPO/RLAIF) for Agent Behavior",
    description: "Align agent outputs with human preferences: fewer loops, better tool choices, graceful error recovery.",
    keyTechniques: [
      "DPO on trajectory pairs (chosen vs rejected)",
      "RLAIF: LLM-as-judge for trajectory ranking",
      "Reward components: task success, tool efficiency, token economy",
      "Rejection sampling for hard negative mining"
    ],
    dataFormat: "DPO pairs: {prompt, chosen_trajectory, rejected_trajectory}",
    computeCost: "Moderate — requires reference model"
  },
  {
    stage: "5. Agent Evaluation Loop",
    description: "Continuous evaluation framework measuring agent capabilities on held-out tasks with automated and human judges.",
    keyTechniques: [
      "Benchmarks: GAIA, WebShop, ALFWorld, SWE-bench",
      "Metrics: success rate, steps to completion, tool accuracy, cost",
      "Regression detection on capability drift",
      "A/B testing fine-tuned vs base agents"
    ],
    dataFormat: "Evaluation reports + trajectory logs",
    computeCost: "Ongoing — automated nightly runs"
  }
];

export const AGENTIC_FINE_TUNING_CHALLENGES = [
  {
    challenge: "Distribution Shift: Agent vs Chat Data",
    detail: "Agent trajectories contain tool calls, observations, and multi-turn reasoning — vastly different from chat/instruction data. Requires custom tokenization and loss masking.",
    mitigation: "Separate training phases: SFT on trajectories → tool-use specialization → preference alignment"
  },
  {
    challenge: "Tool Schema Generalization",
    detail: "Fine-tuned agents overfit to training tool schemas. New tools at inference cause hallucinated parameters.",
    mitigation: "Schema-injected training, few-shot tool examples in context, constrained decoding with dynamic grammars"
  },
  {
    challenge: "Multi-Agent Credit Assignment",
    detail: "In multi-agent systems, which agent's action caused success/failure? Trajectory-level rewards don't attribute to individual agents.",
    mitigation: "Counterfactual trajectory editing, per-agent advantage estimation, hierarchical reward decomposition"
  },
  {
    challenge: "Evaluation Cost & Reliability",
    detail: "Running agents on benchmarks is expensive (API costs, latency) and stochastic. Hard to get statistically significant comparisons.",
    mitigation: "Deterministic seeds, cached tool responses, LLM-as-judge with calibration, smaller proxy benchmarks"
  },
  {
    challenge: "Catastrophic Forgetting of Base Capabilities",
    detail: "Fine-tuning for agent behavior can degrade general reasoning, coding, or knowledge retrieval abilities.",
    mitigation: "LoRA with low rank (r=8–16), replay buffers with general data, KL regularization to base model"
  }
];

export const AGENTIC_FINE_TUNING_RECIPES = [
  {
    name: "Single-Agent Task Automation (7B QLoRA)",
    baseModel: "Mistral-7B / Llama-3.1-8B",
    method: "QLoRA r=16, α=32, 4-bit NF4",
    data: "5k–10k expert ReAct trajectories on target domain",
    epochs: 3,
    lr: "2e-4",
    hardware: "1× RTX 4090 (24GB) or A10G",
    expectedOutcome: "80%+ success on domain tasks, reliable tool calling"
  },
  {
    name: "Multi-Agent Coding Assistant (34B QLoRA)",
    baseModel: "CodeLlama-34B / DeepSeek-Coder-33B",
    method: "QLoRA r=32, α=64, 4-bit NF4",
    data: "20k+ trajectories: planner + coder + reviewer + tester roles",
    epochs: 2,
    lr: "1e-4",
    hardware: "2× A100 80GB or 4× RTX 4090",
    expectedOutcome: "End-to-end feature implementation with self-review"
  },
  {
    name: "Tool-Augmented Research Agent (DPO Alignment)",
    baseModel: "Llama-3.1-70B (QLoRA)",
    method: "DPO β=0.1 on trajectory pairs + QLoRA",
    data: "3k preference pairs from human annotators",
    epochs: 1,
    lr: "5e-7",
    hardware: "2× A100 80GB",
    expectedOutcome: "Fewer redundant searches, better source selection, graceful API error handling"
  }
];

export const PYTHON_AGENTIC_QLORA_SCRIPT = `# ============================================================================
# AGENTIC QLORA: Fine-tuning a Tool-Using Agent with Trajectory Data
# ============================================================================
# pip install unsloth trl peft accelerate bitsandbytes datasets

from unsloth import FastLanguageModel
from trl import SFTTrainer
from datasets import load_dataset
import torch

# 1. Load 4-bit quantized base model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Mistral-7B-Instruct-v0.3-bnb-4bit",
    max_seq_length=8192,
    dtype=torch.bfloat16,
    load_in_4bit=True,
)

# 2. Add LoRA adapters (only 0.5% params trained)
model = FastLanguageModel.get_peft_model(
    model, r=16, target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=32, lora_dropout=0, bias="none", use_gradient_checkpointing="unsloth",
    random_state=42, use_rslora=False, loftq_config=None,
)

# 3. Load agent trajectory dataset (JSONL: messages with tool_calls/tool_results)
dataset = load_dataset("json", data_files="agent_trajectories.jsonl", split="train")

# 4. Format for chat template with tool roles
def format_trajectory(ex):
    # Assumes OpenAI-style chat format with tool_calls
    return {"text": tokenizer.apply_chat_template(ex["messages"], tokenize=False, add_generation_prompt=False)}

dataset = dataset.map(format_trajectory, remove_columns=dataset.column_names)

# 5. SFT Trainer with loss masking on tool outputs
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=8192,
    dataset_num_proc=4,
    packing=True,
    args=TrainingArguments(
        output_dir="./agentic-mistral-7b-qlora",
        per_device_train_batch_size=2,
        gradient_accumulation_steps=8,
        warmup_steps=10,
        num_train_epochs=3,
        learning_rate=2e-4,
        fp16=False, bf16=True,
        logging_steps=5,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",
        seed=42,
        report_to="none",
    ),
)

trainer.train()
model.save_pretrained_merged("./agentic-mistral-7b-merged", tokenizer, save_method="merged_16bit")
print("Agentic QLoRA complete!")

# ============================================================================
# INFERENCE: Tool-Constrained Decoding with JSON Schema
# ============================================================================
from transformers import GenerationConfig
from llama_cpp import Llama

llm = Llama(model_path="./agentic-mistral-7b-merged.gguf", n_gpu_layers=-1, n_ctx=8192)

# Define tool schema for constrained decoding
tool_schema = {
    "name": "search_web",
    "parameters": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}
}

# Grammar-constrained generation (llama.cpp GBNF)
gbnf_grammar = '''
root ::= tool_call
tool_call ::= "{\\"name\\": \\"search_web\\", \\"arguments\\": " {" query } "}"
query ::= "\\"query\\": \\"" [^"]* "\\""
'''

response = llm.create_chat_completion(
    messages=[{"role": "user", "content": "Find the latest Rust async runtime benchmarks"}],
    tools=[tool_schema],
    tool_choice="auto",
    grammar=gbnf_grammar,
    temperature=0.1,
)
print(response)
`;

// ============================================================================
// MERGE 1(a) — TOOL-CALLING RECIPE (generic terms only, node-importable)
// Hyperparameter recipe + 3-part dataset shape + quality rule + health check
// + base-model failure signature + inference detail. No vendor/library names.
// ============================================================================

export const TOOL_CALLING_RECIPE = {
  id: "tool-calling-recipe",
  title: "Tool-Calling Recipe",
  base: "4-bit quantised base",
  trainer: "fused-kernel trainer",
  rank: 16,
  alpha: 32,
  alphaRule: "2×rank",
  dropout: 0,
  dropoutReason: "zero dropout for fused kernels",
  targetModules: ["q", "k", "v", "o", "gate", "up", "down"],
  perDeviceBatch: 2,
  gradAccumSteps: 8,
  effectiveBatch: 16,
  trainSteps: 60,
  trainStepsNote: "~tens of steps",
  learningRate: 0.0002,
  dataQualityRule: "hundreds of clean examples beat thousands of noisy ones",
  healthCheckHealthy: "loss settling low-but-not-zero",
  healthCheckWarning: "instant-zero means memorization",
  baseFailureSignature: "chatty wrapper around the call",
  baseFailureExample: "Sure! Here is your call for you: { tool call } — hope that helps!",
  inferenceTemperature: 0.1,
  inferenceMaxTokens: 128,
  inferenceDecodeNote: "decode-only-new-tokens"
};

export const TOOL_CALLING_DATASET_SHAPE = [
  {
    role: "system",
    contains: "tool signatures + strict-JSON-only instruction",
    example: "Available tools: get_weather(latitude: number, longitude: number). Reply with strict JSON only — no prose."
  },
  {
    role: "user",
    contains: "plain task request",
    example: "What is the weather at latitude 35.68, longitude 139.69?"
  },
  {
    role: "assistant",
    contains: "exact JSON tool call",
    example: '{"name": "get_weather", "arguments": {"latitude": 35.68, "longitude": 139.69}}'
  }
];

// ============================================================================
// MERGE 1(b) — GROUNDED EXTRACTION PIPELINE (extractor-not-generator)
// chunk → intermediate structured output → explode into rows.
// ============================================================================

export const GROUNDED_EXTRACTION_PIPELINE = {
  id: "grounded-extraction-pipeline",
  title: "Grounded Extraction Pipeline",
  stages: [
    { step: "1. Chunk", detail: "Split YOUR documents into short passages." },
    { step: "2. Intermediate structured output", detail: "Extract bullets, entities and facts per chunk." },
    { step: "3. Explode into rows", detail: "Turn each fact into instruction / input / output rows." }
  ],
  framing: "Be an extractor-not-generator: ground every row in YOUR documents to cut hallucination and cost.",
  rowTypes: [
    { type: "bullets", use: "Atomic facts per chunk." },
    { type: "QA pairs", use: "Question plus grounded answer from one passage." },
    { type: "rephrase", use: "Same fact restated for robustness." },
    { type: "triplets", use: "Subject / relation / object rows." },
    { type: "title", use: "Short heading per passage." },
    { type: "summary", use: "One-paragraph compression per chunk." }
  ]
};
