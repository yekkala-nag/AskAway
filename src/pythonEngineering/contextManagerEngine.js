const LIFECYCLE_STEPS = [
  {
    title: 'Evaluate the manager',
    detail: 'Python evaluates the expression after “with” to obtain a context manager.',
    code: 'manager = acquire_resource()',
  },
  {
    title: 'Enter the context',
    detail: 'Python calls __enter__() and binds its return value to the optional “as” target.',
    code: 'value = manager.__enter__()',
  },
  {
    title: 'Run the body',
    detail: 'The indented block runs with the value returned by __enter__().',
    code: 'use(value)',
  },
];

export function getContextLifecycle(scenario) {
  const steps = [...LIFECYCLE_STEPS];
  if (scenario === 'normal') {
    steps.push(
      {
        title: 'Exit normally',
        detail: '__exit__(None, None, None) runs even when the body completes successfully.',
        code: 'manager.__exit__(None, None, None)',
      },
      {
        title: 'Continue after the block',
        detail: 'Execution continues with cleanup complete; the return value from __exit__ is ignored.',
        code: 'continue_execution()',
      },
    );
    return steps;
  }

  steps.push({
    title: 'Exit with an exception',
    detail: '__exit__() receives the exception type, value, and traceback so it can clean up or handle it.',
    code: 'manager.__exit__(exc_type, exc_value, traceback)',
  });

  if (scenario === 'suppress') {
    steps.push({
      title: 'Suppress and continue',
      detail: 'A truthy return from __exit__ marks the exception as handled; execution continues after the block.',
      code: 'return True  # handled intentionally',
    });
  } else {
    steps.push({
      title: 'Propagate the exception',
      detail: 'A falsey return from __exit__ leaves the exception unhandled, so it continues to the caller.',
      code: 'return False  # propagate',
    });
  }
  return steps;
}

export const CONTEXT_MANAGER_USES = [
  { pattern: 'Database transaction', resource: 'Transaction state', guarantee: 'Commit on success; roll back when the block raises.' },
  { pattern: 'Thread lock', resource: 'Exclusive access', guarantee: 'Release the lock when the block exits, including on exceptions.' },
  { pattern: 'Temporary directory', resource: 'Temporary files', guarantee: 'Remove the temporary directory when its scope ends.' },
  { pattern: 'Temporary configuration', resource: 'Scoped settings', guarantee: 'Restore the previous setting when the block exits.' },
  { pattern: 'Dynamic resource set', resource: 'Several resources', guarantee: 'Close entered resources in reverse order, including partial setup.' },
];

export const TRANSACTION_CONTEXT_CODE = `from contextlib import contextmanager

@contextmanager
def transaction(connection):
    try:
        yield connection
    except BaseException:
        connection.rollback()
        raise
    else:
        connection.commit()

with transaction(connection) as tx:
    tx.execute("UPDATE inventory SET quantity = quantity - 1")`;

export const EXIT_STACK_CODE = `from contextlib import ExitStack

def read_all(paths):
    with ExitStack() as stack:
        files = [stack.enter_context(path.open()) for path in paths]
        return [file.read() for file in files]`;
