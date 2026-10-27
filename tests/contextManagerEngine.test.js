import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getContextLifecycle } from '../src/pythonEngineering/contextManagerEngine.js';

describe('context manager lifecycle', () => {
  it('models normal exit with a None exception triple', () => {
    const steps = getContextLifecycle('normal');
    assert.equal(steps[3].code, 'manager.__exit__(None, None, None)');
    assert.match(steps[4].detail, /return value from __exit__ is ignored/);
  });

  it('models propagation when __exit__ is falsey', () => {
    const steps = getContextLifecycle('propagate');
    assert.match(steps[3].code, /exc_type, exc_value, traceback/);
    assert.equal(steps[4].code, 'return False  # propagate');
    assert.match(steps[4].detail, /continues to the caller/);
  });

  it('models suppression when __exit__ is truthy', () => {
    const steps = getContextLifecycle('suppress');
    assert.equal(steps[4].code, 'return True  # handled intentionally');
    assert.match(steps[4].detail, /execution continues after the block/);
  });
});
