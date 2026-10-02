// ============================================================================
// GENERATING STRUCTURED OUTPUTS FROM LLMS: ENGINE
// Prompting vs API vs Constrained Decoding
// ============================================================================

export const EXTRACTION_SCENARIOS = [
  {
    id: "receipt_extraction",
    title: "Scenario 1: Retail Receipt & Invoice Extraction",
    inputData: `ACME Supermarket #402
Date: 2026-05-14 18:42
Items:
1x Organic Almond Milk ($4.99)
2x Sourdough Bread ($3.50 ea -> $7.00)
1x Dark Roast Coffee Beans ($14.25)
Subtotal: $26.24
State Tax (8.25%): $2.16
Total Paid: $28.40 (Visa **** 9210)`,
    targetSchema: {
      type: "object",
      properties: {
        vendor: { type: "string" },
        date: { type: "string", format: "date-time" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              quantity: { type: "integer" },
              unit_price: { type: "number" },
              total_price: { type: "number" }
            },
            required: ["name", "quantity", "unit_price", "total_price"]
          }
        },
        subtotal: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" }
      },
      required: ["vendor", "date", "items", "subtotal", "tax", "total"]
    },
    results: {
      prompting: {
        status: "PARSING_ERROR_ON_PASS_1",
        rawOutput: `\`\`\`json
{
  "vendor": "ACME Supermarket #402",
  "date": "2026-05-14 18:42",
  "items": [
    { "name": "Organic Almond Milk", "quantity": 1, "unit_price": 4.99, "total_price": 4.99 },
    { "name": "Sourdough Bread", "quantity": 2, "unit_price": 3.50, "total_price": 7.00 },
    { "name": "Dark Roast Coffee Beans", "quantity": 1, "unit_price": 14.25, "total_price": 14.25 },
  ],
  "subtotal": 26.24,
  "tax": 2.16,
  "total": 28.40
}
\`\`\``,
        error: "JSONDecodeError: Trailing comma in array at line 8 column 3. Required retry loop with error prompt.",
        retriesNeeded: 1,
        latencyMs: 1420
      },
      apiProvider: {
        status: "SUCCESS_VALIDATED",
        structuredJson: {
          vendor: "ACME Supermarket #402",
          date: "2026-05-14T18:42:00Z",
          items: [
            { name: "Organic Almond Milk", quantity: 1, unit_price: 4.99, total_price: 4.99 },
            { name: "Sourdough Bread", quantity: 2, unit_price: 3.50, total_price: 7.00 },
            { name: "Dark Roast Coffee Beans", quantity: 1, unit_price: 14.25, total_price: 14.25 }
          ],
          subtotal: 26.24,
          tax: 2.16,
          total: 28.40
        },
        retriesNeeded: 0,
        latencyMs: 820
      },
      constrainedDecoding: {
        status: "SUCCESS_100_PCT_MATHEMATICAL_GUARANTEE",
        structuredJson: {
          vendor: "ACME Supermarket #402",
          date: "2026-05-14T18:42:00Z",
          items: [
            { name: "Organic Almond Milk", quantity: 1, unit_price: 4.99, total_price: 4.99 },
            { name: "Sourdough Bread", quantity: 2, unit_price: 3.50, total_price: 7.00 },
            { name: "Dark Roast Coffee Beans", quantity: 1, unit_price: 14.25, total_price: 14.25 }
          ],
          subtotal: 26.24,
          tax: 2.16,
          total: 28.40
        },
        retriesNeeded: 0,
        fsmTransitions: 84,
        maskedTokensPruned: 12400,
        latencyMs: 640
      }
    }
  },
  {
    id: "medical_prescription",
    title: "Scenario 2: Clinical Prescription & Dosage Extraction",
    inputData: `Patient: Jane Doe (DOB: 1984-11-03)
Rx: Amoxicillin 500mg capsules. Take 1 capsule orally every 8 hours for 10 days. 
Refills: 0. 
Caution: Patient has mild penicillin allergy; monitor for rash.`,
    targetSchema: {
      type: "object",
      properties: {
        patient_name: { type: "string" },
        medication: { type: "string" },
        dosage_mg: { type: "integer" },
        frequency_hours: { type: "integer" },
        duration_days: { type: "integer" },
        refills: { type: "integer" },
        allergy_warning: { type: "boolean" }
      },
      required: ["patient_name", "medication", "dosage_mg", "frequency_hours", "duration_days", "refills", "allergy_warning"]
    },
    results: {
      prompting: {
        status: "TYPE_MISMATCH_ERROR",
        rawOutput: `{ "patient_name": "Jane Doe", "medication": "Amoxicillin", "dosage_mg": "500mg", "frequency_hours": 8, "duration_days": 10, "refills": 0, "allergy_warning": true }`,
        error: "ValidationError: dosage_mg expected integer, received string '500mg'. Required re-prompting loop.",
        retriesNeeded: 1,
        latencyMs: 1650
      },
      apiProvider: {
        status: "SUCCESS_VALIDATED",
        structuredJson: {
          patient_name: "Jane Doe",
          medication: "Amoxicillin",
          dosage_mg: 500,
          frequency_hours: 8,
          duration_days: 10,
          refills: 0,
          allergy_warning: true
        },
        retriesNeeded: 0,
        latencyMs: 910
      },
      constrainedDecoding: {
        status: "SUCCESS_100_PCT_MATHEMATICAL_GUARANTEE",
        structuredJson: {
          patient_name: "Jane Doe",
          medication: "Amoxicillin",
          dosage_mg: 500,
          frequency_hours: 8,
          duration_days: 10,
          refills: 0,
          allergy_warning: true
        },
        retriesNeeded: 0,
        fsmTransitions: 62,
        maskedTokensPruned: 9850,
        latencyMs: 580
      }
    }
  }
];

export const FSM_DECODING_STEPS = [
  {
    step: 1,
    fsmState: "OBJECT_START",
    generatedSoFar: "",
    allowedTokens: ['"{"'],
    maskedTokensSample: ['"Hello"', '"The"', '"["', '"123"', '"null"'],
    chosenToken: '"{"',
    explanation: "FSM starts in root state. Only opening curly brace '{' has positive logit; all other 128,000 vocabulary tokens are masked to -inf."
  },
  {
    step: 2,
    fsmState: "KEY_NAME",
    generatedSoFar: '{"',
    allowedTokens: ['"vendor"', '"date"', '"items"'],
    maskedTokensSample: ['"123"', '":"', '"}"', '"true"', '"name"'],
    chosenToken: '"vendor"',
    explanation: "FSM requires schema key string. Only valid root property keys from JSON Schema are allowed."
  },
  {
    step: 3,
    fsmState: "COLON_SEPARATOR",
    generatedSoFar: '{"vendor"',
    allowedTokens: ['":"'],
    maskedTokensSample: ['","', '"}"', '"is"', '"value"'],
    chosenToken: '":"',
    explanation: "JSON syntax requires colon delimiter after key string. Only ':' is unmasked."
  },
  {
    step: 4,
    fsmState: "STRING_VALUE",
    generatedSoFar: '{"vendor":',
    allowedTokens: ['"ACME Supermarket #402"'],
    maskedTokensSample: ['"["', '"{"', '"true"', '"123"'],
    chosenToken: '"ACME Supermarket #402"',
    explanation: "Schema requires string type for 'vendor'. LLM selects content tokens, closed by quotation mark."
  },
  {
    step: 5,
    fsmState: "COMMA_SEPARATOR",
    generatedSoFar: '{"vendor":"ACME Supermarket #402"',
    allowedTokens: ['","', '"}"'],
    maskedTokensSample: ['"vendor"', '":"', '"items"'],
    chosenToken: '","',
    explanation: "After value completion, FSM transitions to next property via comma ',' or object close '}'."
  }
];

export const PARADIGM_COMPARISON = [
  {
    paradigm: "1. Prompting & Re-prompting (Instructor / Pydantic)",
    mechanism: "Prompt instructions + client-side Pydantic validation + retry loop",
    syntaxGuarantee: "❌ No (72% - 85% first-pass pass rate)",
    latencyCost: "High on error (2x-3x latency on retry loops)",
    portability: "High (Works with any LLM API or endpoint)",
    localModelSupport: "Yes (Through any API wrapper)"
  },
  {
    paradigm: "2. API Provider Enforcement (OpenAI Strict JSON Schema)",
    mechanism: "Server-side proprietary grammar parser during token generation",
    syntaxGuarantee: "✅ 100% Schema Valid (Server enforced)",
    latencyCost: "Low (No client-side retry overhead)",
    portability: "❌ Locked to specific provider (OpenAI / Gemini / Anthropic)",
    localModelSupport: "❌ No (Proprietary server hook)"
  },
  {
    paradigm: "3. Constrained Decoding with FSM (Outlines / SGLang / Guidance)",
    mechanism: "DFA / CFG compilation + dynamic logit masking at generation step t",
    syntaxGuarantee: "✅ 100% Mathematical Guarantee (Zero syntax errors)",
    latencyCost: "Lowest (Single forward pass, zero retries, fast local decoding)",
    portability: "✅ Universal (Works with any open-weights model HuggingFace/vLLM)",
    localModelSupport: "✅ Native (llama.cpp, vLLM, transformers, SGLang)"
  }
];
