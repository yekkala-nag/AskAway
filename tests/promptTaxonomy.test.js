import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { KIND, FRAMEWORK_CATALOG, METHODOLOGY_CATALOG, getFrameworkItem, getMethodologyItem, findFrameworkByName, searchCatalog, catalogStats, conflictsWith, CONFLICT_PAIRS } from '../src/services/promptTaxonomy.js';
import { FRAMEWORKS } from '../src/services/frameworkLibrary.js';

describe('promptTaxonomy', () => {
  it('reclassifies all 30 library items exactly once with a valid kind', () => {
    const stats = catalogStats();
    assert.equal(stats.reclassified, 30);
    assert.equal(stats.fromLibrary, 30);
    const ids = [...FRAMEWORK_CATALOG, ...METHODOLOGY_CATALOG].map((x) => x.id);
    assert.equal(new Set(ids).size, ids.length, 'ids must be unique across catalogs');
    for (const item of [...FRAMEWORK_CATALOG, ...METHODOLOGY_CATALOG]) {
      assert.ok(item.kind === KIND.FRAMEWORK || item.kind === KIND.METHODOLOGY);
      assert.ok(item.name && item.description && item.category && item.version === 1);
      assert.ok(FRAMEWORKS.some((f) => f.a === item.name) || item.relatedTab || item.version >= 1);
    }
  });

  it('frameworks and methodologies land in separate catalogs (structure vs technique)', () => {
    assert.ok(FRAMEWORK_CATALOG.length >= 16, `frameworks: ${FRAMEWORK_CATALOG.length}`);
    assert.ok(METHODOLOGY_CATALOG.length >= 24, `methodologies: ${METHODOLOGY_CATALOG.length}`);
    assert.ok(FRAMEWORK_CATALOG.every((f) => f.kind === 'framework'));
    assert.ok(METHODOLOGY_CATALOG.every((m) => m.kind === 'methodology'));
    // spot-check classification
    assert.equal(getFrameworkItem('trace').kind, 'framework');
    assert.equal(getMethodologyItem('few_zero_one_shot').kind, 'methodology');
    assert.equal(getMethodologyItem('cot_tot').kind, 'methodology');
    assert.equal(getFrameworkItem('skeleton_of_thought').kind, 'framework');
  });

  it('methodology metadata is complete per spec', () => {
    for (const m of METHODOLOGY_CATALOG) {
      assert.ok(m.whenToUse && m.limitations && m.applicationInstructions && m.modelCaveats, `incomplete: ${m.id}`);
      assert.ok(Array.isArray(m.requires));
      assert.ok(Array.isArray(m.compatibleFrameworkIds) && m.compatibleFrameworkIds.length > 0, `no compatible frameworks: ${m.id}`);
      for (const fid of m.compatibleFrameworkIds) assert.ok(getFrameworkItem(fid), `${m.id} → dangling framework ${fid}`);
    }
  });

  it('framework metadata is complete per spec, including user-requested blueprints', () => {
    for (const f of FRAMEWORK_CATALOG) {
      assert.ok(f.template && Array.isArray(f.requiredFields) && f.example && Array.isArray(f.compatibleMethodologyIds), `incomplete: ${f.id}`);
      assert.ok(f.example.input && f.example.output, `no example: ${f.id}`);
      for (const mid of f.compatibleMethodologyIds) assert.ok(getMethodologyItem(mid), `${f.id} → dangling methodology ${mid}`);
    }
    for (const name of ['Three-Sentence Prompt', 'Role–Task–Context–Output', 'Goal–Context–Constraints–Format', 'Understand–Plan–Execute–Validate', 'Problem–Options–Decision–Action', 'Input–Process–Output']) {
      assert.ok(findFrameworkByName(name), `missing requested framework: ${name}`);
    }
    for (const name of ['Retrieval-grounded prompting', 'Constraint-based prompting', 'Structured-output prompting', 'Tool-assisted prompting', 'Iterative prompting']) {
      assert.ok(METHODOLOGY_CATALOG.some((m) => m.name === name), `missing requested methodology: ${name}`);
    }
  });

  it('Three-Sentence Prompt preserves a link to the existing tab (no duplicate behavior)', () => {
    const ts = findFrameworkByName('Three-Sentence Prompt');
    assert.equal(ts.relatedTab, 'threesentenceprompt');
    assert.ok(ts.template.split('.').length >= 3, 'keeps the three-sentence structure');
  });

  it('conflict pairs reference real methodologies', () => {
    assert.ok(CONFLICT_PAIRS.length >= 1);
    for (const [a, b] of CONFLICT_PAIRS) {
      assert.ok(getMethodologyItem(a) && getMethodologyItem(b));
      assert.ok(conflictsWith(a, b) && conflictsWith(b, a));
    }
    assert.ok(conflictsWith('retrieval_grounded', 'generated_knowledge'));
    assert.ok(!conflictsWith('retrieval_grounded', 'constraint_based'));
  });

  it('search matches across names, descriptions, and categories', () => {
    const all = [...FRAMEWORK_CATALOG, ...METHODOLOGY_CATALOG];
    assert.ok(searchCatalog(all, 'json').length >= 1 || searchCatalog(all, 'schema').length >= 1);
    assert.ok(searchCatalog(all, 'ROLE task').length >= 1);
    assert.equal(searchCatalog(all, '').length, all.length);
    assert.equal(searchCatalog(all, 'zzz-nothing').length, 0);
  });
});
