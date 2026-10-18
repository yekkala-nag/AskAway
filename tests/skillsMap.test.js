import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_MAP, SKILLS_WORKFLOW, skillTopicCount, ROADMAP_STAGES } from '../src/aiRoadmap/roadmapEngine.js';
import { TABS_REGISTRY } from '../src/registry/tabsRegistry.js';

const registryIds = new Set(TABS_REGISTRY.map((t) => t.id));

test('SKILLS_MAP: 4 branches, 20 skills, unique skill names', () => {
  assert.equal(SKILLS_MAP.length, 4);
  const titles = SKILLS_MAP.map((b) => b.title);
  assert.equal(new Set(titles).size, 4);
  assert.ok(titles.some((t) => t.includes('Building & deploying')));
  assert.ok(titles.some((t) => t.includes('Software engineering')));
  assert.ok(titles.some((t) => t.includes('coding agents')));
  assert.ok(titles.some((t) => t.includes('Shaping the build')));
  const skills = SKILLS_MAP.flatMap((b) => b.skills);
  assert.equal(skills.length, 20);
  assert.equal(new Set(skills.map((s) => s.name)).size, 20, 'skill names unique across branches');
  assert.deepEqual(SKILLS_MAP.map((b) => b.skills.length), [6, 5, 5, 4]);
});

test('every skill maps to real, non-empty tab ids in the registry', () => {
  for (const branch of SKILLS_MAP) {
    for (const skill of branch.skills) {
      assert.ok(skill.tabs.length >= 2, `${skill.name} needs at least 2 topics`);
      for (const id of skill.tabs) {
        assert.ok(registryIds.has(id), `${skill.name}: unknown tab id "${id}"`);
      }
      assert.ok(skill.blurb.length > 20, `${skill.name} needs a real blurb`);
    }
  }
});

test('skillTopicCount: matches the sum of skill mappings', () => {
  const manual = SKILLS_MAP.reduce((a, b) => a + b.skills.reduce((s, sk) => s + sk.tabs.length, 0), 0);
  assert.equal(skillTopicCount(), manual);
  assert.equal(skillTopicCount(), 85);
  assert.equal(skillTopicCount(SKILLS_MAP.slice(0, 1)), 31);
});

test('SKILLS_WORKFLOW: five sequential steps Diagnose → Review', () => {
  assert.equal(SKILLS_WORKFLOW.length, 5);
  assert.deepEqual(SKILLS_WORKFLOW.map((s) => s.n), [1, 2, 3, 4, 5]);
  assert.deepEqual(SKILLS_WORKFLOW.map((s) => s.name), ['Diagnose', 'Walk the branches', 'Prove', 'Apply', 'Review']);
  SKILLS_WORKFLOW.forEach((s) => assert.ok(s.detail.length > 20));
});

test('stage path still intact alongside the skills map', () => {
  assert.equal(ROADMAP_STAGES.length, 8);
  for (const stage of ROADMAP_STAGES) {
    for (const id of stage.tabs) {
      assert.ok(registryIds.has(id), `stage ${stage.n}: unknown tab id "${id}"`);
    }
  }
});
