import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TOOL_CALLING_RECIPE,
  TOOL_CALLING_DATASET_SHAPE,
  GROUNDED_EXTRACTION_PIPELINE
} from '../src/llmFinetuning/finetuningEngine.js';

test('tool-calling recipe hyperparameters match exact values', () => {
  assert.equal(TOOL_CALLING_RECIPE.rank, 16);
  assert.equal(TOOL_CALLING_RECIPE.alpha, 32);
  assert.equal(TOOL_CALLING_RECIPE.alphaRule, '2×rank');
  assert.equal(TOOL_CALLING_RECIPE.dropout, 0);
  assert.match(TOOL_CALLING_RECIPE.dropoutReason, /fused kernels/);
  assert.deepEqual(TOOL_CALLING_RECIPE.targetModules, ['q', 'k', 'v', 'o', 'gate', 'up', 'down']);
  assert.equal(TOOL_CALLING_RECIPE.perDeviceBatch, 2);
  assert.equal(TOOL_CALLING_RECIPE.gradAccumSteps, 8);
  assert.equal(TOOL_CALLING_RECIPE.effectiveBatch, 16);
  assert.equal(TOOL_CALLING_RECIPE.trainSteps, 60);
  assert.equal(TOOL_CALLING_RECIPE.trainStepsNote, '~tens of steps');
  assert.equal(TOOL_CALLING_RECIPE.learningRate, 0.0002);
});

test('tool-calling recipe uses generic base/trainer terms', () => {
  assert.equal(TOOL_CALLING_RECIPE.base, '4-bit quantised base');
  assert.equal(TOOL_CALLING_RECIPE.trainer, 'fused-kernel trainer');
});

test('tool-calling dataset is 3-part system/user/exact-JSON', () => {
  assert.equal(TOOL_CALLING_DATASET_SHAPE.length, 3);
  assert.deepEqual(TOOL_CALLING_DATASET_SHAPE.map((p) => p.role), ['system', 'user', 'assistant']);
  assert.match(TOOL_CALLING_DATASET_SHAPE[0].contains, /tool signatures/);
  assert.match(TOOL_CALLING_DATASET_SHAPE[0].contains, /strict-JSON-only/);
  assert.match(TOOL_CALLING_DATASET_SHAPE[2].contains, /exact JSON/);
});

test('data-quality rule is exact', () => {
  assert.equal(TOOL_CALLING_RECIPE.dataQualityRule, 'hundreds of clean examples beat thousands of noisy ones');
});

test('health check distinguishes healthy loss from memorization', () => {
  assert.equal(TOOL_CALLING_RECIPE.healthCheckHealthy, 'loss settling low-but-not-zero');
  assert.match(TOOL_CALLING_RECIPE.healthCheckWarning, /memorization/);
});

test('base-model failure signature is chatty wrapper', () => {
  assert.equal(TOOL_CALLING_RECIPE.baseFailureSignature, 'chatty wrapper around the call');
  assert.ok(TOOL_CALLING_RECIPE.baseFailureExample.length > 10);
});

test('inference detail is low-temp, short tokens, new-tokens-only', () => {
  assert.equal(TOOL_CALLING_RECIPE.inferenceTemperature, 0.1);
  assert.equal(TOOL_CALLING_RECIPE.inferenceMaxTokens, 128);
  assert.equal(TOOL_CALLING_RECIPE.inferenceDecodeNote, 'decode-only-new-tokens');
});

test('grounded extraction pipeline stages chunk → intermediate → rows', () => {
  assert.equal(GROUNDED_EXTRACTION_PIPELINE.stages.length, 3);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.stages[0].step, /Chunk/);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.stages[1].step, /Intermediate structured output/);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.stages[2].step, /Explode into rows/);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.stages[2].detail, /instruction \/ input \/ output/);
});

test('grounded pipeline framing is extractor-not-generator grounded in docs', () => {
  assert.match(GROUNDED_EXTRACTION_PIPELINE.framing, /extractor-not-generator/);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.framing, /YOUR documents/);
  assert.match(GROUNDED_EXTRACTION_PIPELINE.framing, /hallucination/);
});

test('grounded pipeline row types cover all six kinds', () => {
  const types = GROUNDED_EXTRACTION_PIPELINE.rowTypes.map((r) => r.type);
  assert.deepEqual(types, ['bullets', 'QA pairs', 'rephrase', 'triplets', 'title', 'summary']);
});
