import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  KNOWING_PHASES,
  VOICE_EXPLORATION_STEPS,
  SKILL_ANATOMY_FIELDS,
  EXAMPLE_SKILLS,
  ATTENTION_FORMATS,
  DAILY_QUIZ_AUTOMATION,
  getPhaseById,
  nextPhaseId,
  buildSkill,
  estimateRetention,
  forgettingRetention,
  triageTopic,
  getFormatsForAttention,
  buildDailyQuiz,
} from '../src/aiLearning/aiLearningEngine.js';

describe('aiLearningEngine phases', () => {
  it('exposes four phases in loop order', () => {
    assert.equal(KNOWING_PHASES.length, 4);
    assert.deepEqual(KNOWING_PHASES.map((p) => p.id), [
      'unknown-unknowns',
      'known-unknowns',
      'known-knowns',
      'unknown-knowns',
    ]);
  });

  it('getPhaseById returns the phase or null', () => {
    assert.equal(getPhaseById('known-knowns').name, 'Known knowns');
    assert.equal(getPhaseById('nope'), null);
    assert.equal(getPhaseById(null), null);
  });

  it('nextPhaseId loops mastery back to new unknowns', () => {
    assert.equal(nextPhaseId('unknown-unknowns'), 'known-unknowns');
    assert.equal(nextPhaseId('known-knowns'), 'unknown-knowns');
    assert.equal(nextPhaseId('unknown-knowns'), 'unknown-unknowns');
    assert.equal(nextPhaseId('bogus'), null);
  });

  it('voice exploration has five steps', () => {
    assert.equal(VOICE_EXPLORATION_STEPS.length, 5);
    assert.equal(VOICE_EXPLORATION_STEPS[0].id, 'dump');
  });
});

describe('aiLearningEngine buildSkill', () => {
  it('requires all five anatomy fields', () => {
    assert.equal(SKILL_ANATOMY_FIELDS.length, 5);
    const r = buildSkill({ purpose: '  ', inputs: '', process: '', outputFormat: '', qualityChecks: '' });
    assert.equal(r.ok, false);
    assert.deepEqual(r.errors, ['purpose', 'inputs', 'process', 'outputFormat', 'qualityChecks']);
  });

  it('generates when-to-use and do-not-use lines exactly', () => {
    const r = buildSkill({
      purpose: 'Collect the best resources',
      inputs: 'topic, level',
      process: 'gather, rank, keep top five',
      outputFormat: 'ranked list',
      qualityChecks: 'two sources per item',
    });
    assert.equal(r.ok, true);
    assert.equal(r.skill.title, 'Collect the best resources');
    assert.equal(r.skill.whenToUse, 'Use when topic, level are available.');
    assert.equal(r.skill.doNotUse, 'Do not use when two sources per item cannot be verified.');
    assert.equal(r.skill.summary, 'Collect the best resources — gather, rank, keep top five → ranked list.');
  });

  it('ships three example skills', () => {
    assert.equal(EXAMPLE_SKILLS.length, 3);
    assert.deepEqual(EXAMPLE_SKILLS.map((s) => s.id), ['resource-collector', 'study-scheduler', 'concept-comparer']);
  });
});

describe('aiLearningEngine retention', () => {
  it('estimateRetention computes exact values for gentle preset', () => {
    const r = estimateRetention([1, 3, 7]);
    assert.equal(r.ok, true);
    assert.equal(r.reviews, 3);
    assert.equal(r.averageGap, 3.7);
    assert.equal(r.estimatedRetention, 67);
    assert.equal(r.level, 'steady');
  });

  it('single review fades, intensive caps at 97 strong', () => {
    const one = estimateRetention([1]);
    assert.deepEqual([one.estimatedRetention, one.level], [41, 'fading']);
    const hard = estimateRetention([1, 2, 4, 7, 14, 30]);
    assert.deepEqual([hard.estimatedRetention, hard.level], [97, 'strong']);
    assert.equal(hard.averageGap, 9.7);
  });

  it('rejects empty or invalid intervals', () => {
    assert.equal(estimateRetention([]).ok, false);
    assert.equal(estimateRetention(['x']).ok, false);
    assert.deepEqual(estimateRetention(null).errors, ['intervals-required']);
  });

  it('forgettingRetention decays exponentially with exact values', () => {
    assert.equal(forgettingRetention(0), 100);
    assert.equal(forgettingRetention(1), 85);
    assert.equal(forgettingRetention(3), 61);
    assert.equal(forgettingRetention(7), 31);
    assert.equal(forgettingRetention(14), 10);
  });
});

describe('aiLearningEngine triage + planning', () => {
  it('go-deep needs new + relevant + evidence', () => {
    const r = triageTopic({ isNew: true, isRelevant: true, hasEvidence: true });
    assert.equal(r.decision, 'go-deep');
    assert.equal(r.nextAction, 'Schedule one 25-minute deep session today.');
  });

  it('parks irrelevant topics and already-known topics', () => {
    assert.equal(triageTopic({ isNew: true, isRelevant: false, hasEvidence: true }).decision, 'park');
    assert.equal(triageTopic({ isNew: false, isRelevant: true, hasEvidence: true }).decision, 'park');
  });

  it('revisits with evidence when unproven', () => {
    const r = triageTopic({ isNew: true, isRelevant: true, hasEvidence: false });
    assert.equal(r.decision, 'revisit-with-evidence');
    assert.equal(r.nextAction, 'Find one worked example before scheduling deep time.');
  });

  it('matches formats to attention states', () => {
    assert.equal(ATTENTION_FORMATS.length, 4);
    assert.equal(getFormatsForAttention('focused').best, 'Worked examples + teach-back');
    assert.equal(getFormatsForAttention('commute').avoid, 'Dense derivations');
    assert.equal(getFormatsForAttention('missing'), null);
  });

  it('buildDailyQuiz varies focus with questions-first pattern', () => {
    const q = buildDailyQuiz('photosynthesis', 3);
    assert.equal(q.ok, true);
    assert.equal(q.topic, 'photosynthesis');
    assert.deepEqual(q.plan.map((d) => d.focus), ['Recall', 'Apply', 'Teach-back']);
    assert.equal(q.plan[0].questions[0], 'State the core idea of photosynthesis in two sentences.');
    assert.equal(q.plan[1].questions[0], 'Give one worked example of photosynthesis from memory.');
    assert.equal(buildDailyQuiz('   ').ok, false);
  });

  it('quiz automation string embeds escaped template keys', () => {
    assert.ok(DAILY_QUIZ_AUTOMATION.includes('questionsFirst'));
    assert.ok(DAILY_QUIZ_AUTOMATION.includes('${topic}'));
    assert.ok(DAILY_QUIZ_AUTOMATION.includes('${date}'));
  });
});
