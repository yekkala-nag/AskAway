import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DESCRIPTOR_KINDS,
  PROTOCOL_METHODS,
  LOOKUP_CHAIN,
  VS_PROPERTY,
  validateRating,
  toUsd,
  JPY_USD_RATE,
  lazyAccessLog,
  lookupWinner,
  DESC_CODE,
  TAB_CODE_DEMO,
  demoTrace,
} from '../src/pyDescriptors/pyDescEngine.js';

test('validateRating: type first, range second, normalize on accept', () => {
  assert.deepEqual(DESCRIPTOR_KINDS.map((k) => k.id), ['validated', 'computed', 'lazy']);
  for (const k of DESCRIPTOR_KINDS) {
    assert.ok(k.hooks.includes('__get__'), `${k.id} reads through __get__`);
    assert.ok(k.job.length > 30, `${k.id} has a real job description`);
    assert.ok(k.without.length > 30, `${k.id} explains the failure mode`);
    assert.ok(k.example.length > 10);
  }
  assert.ok(DESCRIPTOR_KINDS.find((k) => k.id === 'validated').hooks.includes('__set__'));
  assert.ok(DESCRIPTOR_KINDS.find((k) => k.id === 'lazy').hooks.includes('__set_name__'));
});

test('protocol table covers all four hooks incl. __set_name__', () => {
  assert.equal(PROTOCOL_METHODS.length, 4);
  const methods = PROTOCOL_METHODS.map((m) => m.method);
  assert.ok(methods.some((m) => m.includes('__get__')));
  assert.ok(methods.some((m) => m.includes('__set__')));
  assert.ok(methods.some((m) => m.includes('__delete__')));
  assert.ok(methods.some((m) => m.includes('__set_name__')));
  assert.ok(PROTOCOL_METHODS.find((m) => m.method.includes('__set_name__')).note.includes('3.6'));
});

test('validateRating: type first, range second, normalize on accept', () => {
  assert.deepEqual(validateRating(4.8), { ok: true, kind: null, message: null, stored: 4.8 });
  assert.equal(validateRating(4.856).stored, 4.86, 'rounds to 2dp on store');
  const t = validateRating('4.8');
  assert.equal(t.kind, 'TypeError');
  assert.equal(t.stored, null);
  const v = validateRating(6.0);
  assert.equal(v.kind, 'ValueError');
  assert.equal(v.message, 'rating must be between 1 and 5.', 'JS renders 1.0 as 1 in the message');
  assert.equal(validateRating(1.0).ok, true, 'bounds are inclusive');
  assert.equal(validateRating(5.0).ok, true);
  assert.equal(validateRating(0.9).kind, 'ValueError');
  assert.equal(validateRating(Number.NaN).kind, 'TypeError');
  const wide = validateRating(9, 1, 10);
  assert.equal(wide.ok, true, 'bounds come from the instance, not the class body');
});

test('toUsd: converts and rounds; rejects non-numbers', () => {
  assert.equal(JPY_USD_RATE, 0.0067);
  assert.equal(toUsd(45000), 301.5);
  assert.equal(toUsd(1500), 10.05);
  assert.throws(() => toUsd('45000'), TypeError);
});

test('lazy access log: first read computes, the rest are cache hits', () => {
  const log = lazyAccessLog(4);
  assert.equal(log.length, 4);
  assert.equal(log[0].hit, false);
  assert.ok(log[0].path.includes('__dict__'));
  assert.ok(log.slice(1).every((r) => r.hit && r.cost === 'instant'));
  assert.ok(log.slice(1).every((r) => r.path.includes('bypassed')));
  assert.deepEqual(lazyAccessLog(0), []);
  assert.throws(() => lazyAccessLog(-1), TypeError);
  assert.throws(() => lazyAccessLog(2.5), TypeError);
});

test('lookup winner mirrors the four-rank chain', () => {
  assert.equal(LOOKUP_CHAIN.length, 4);
  assert.equal(LOOKUP_CHAIN[0].step, 'Data descriptors on the type');
  assert.equal(lookupWinner({ hasSet: true, inInstanceDict: true }).winner, 1, '__set__ outranks instance dict');
  assert.equal(lookupWinner({ hasSet: false, inInstanceDict: true }).winner, 2);
  assert.equal(lookupWinner({ hasSet: false, inInstanceDict: false }).winner, 3);
});

test('property comparison and code/trace content', () => {
  assert.equal(VS_PROPERTY.length, 4);
  assert.ok(VS_PROPERTY.some((r) => r.axis.includes('Reused')));
  assert.ok(DESC_CODE.includes('__set_name__') && DESC_CODE.includes('ValidatedRating'));
  assert.ok(DESC_CODE.includes('class JapanTour'));
  assert.ok(TAB_CODE_DEMO.includes('ValueError') && TAB_CODE_DEMO.includes('AttributeError'));
  assert.equal(demoTrace().length, 6);
  assert.ok(demoTrace().some((t) => t.effect.includes('bypass') || t.effect.includes('__dict__')));
});

test('content carries no URLs or site references', () => {
  const blobs = [DESC_CODE, TAB_CODE_DEMO,
    ...DESCRIPTOR_KINDS.flatMap((k) => Object.values(k)),
    ...PROTOCOL_METHODS.flatMap((r) => Object.values(r)),
    ...LOOKUP_CHAIN.flatMap((r) => Object.values(r)),
    ...VS_PROPERTY.flatMap((r) => Object.values(r)),
    ...demoTrace().flatMap((r) => Object.values(r))];
  for (const b of blobs) {
    if (typeof b !== 'string') continue;
    assert.ok(!/https?:\/\//.test(b), `no URLs: ${b.slice(0, 60)}`);
    assert.ok(!/machinelearningmastery|palomares|brownlee|guiding tech/i.test(b), 'no source attribution');
  }
});
