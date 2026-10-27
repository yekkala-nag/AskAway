import React, { useState } from 'react';
import { Card, Callout } from '../components/ui/Core.jsx';
import { CodeBlock } from '../components/ui/Content.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import {
  CONTEXT_MANAGER_USES,
  EXIT_STACK_CODE,
  getContextLifecycle,
  TRANSACTION_CONTEXT_CODE,
} from './contextManagerEngine.js';

const SCENARIOS = [
  { id: 'normal', label: 'Successful block' },
  { id: 'propagate', label: 'Exception propagates' },
  { id: 'suppress', label: 'Exception suppressed' },
];

const selectStyle = {
  padding: '8px 10px',
  border: '1px solid var(--ds-color-border-default)',
  borderRadius: 'var(--ds-radius-md)',
  color: 'var(--ds-color-text-primary)',
  background: 'var(--ds-color-bg-surface)',
};

export default function ContextManagersPanel() {
  const [scenario, setScenario] = useState('normal');
  const steps = getContextLifecycle(scenario);

  return (
    <div style={{ display: 'grid', gap: 'var(--ds-space-5)' }}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <h3 style={{ margin: '0 0 6px' }}>A context manager is a scoped resource protocol</h3>
        <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
          The <code>with</code> statement coordinates setup and cleanup around a block. Files are one example;
          transactions, locks, temporary state, and groups of resources can use the same structure.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
          <label htmlFor="context-scenario" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Choose a block outcome</label>
          <select id="context-scenario" value={scenario} onChange={(event) => setScenario(event.target.value)} style={selectStyle}>
            {SCENARIOS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </div>
      </Card>

      <Workflow
        title="The with-statement lifecycle"
        description="Step through the selected outcome to see the exit protocol and exception behavior."
        accent="platform"
        steps={steps}
      />

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <h3 style={{ margin: '0 0 12px' }}>Where scoped cleanup helps</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                {['Pattern', 'Resource or state', 'Scope guarantee'].map((heading) => (
                  <th key={heading} style={{ padding: '10px', borderBottom: '2px solid var(--ds-color-border-default)' }}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONTEXT_MANAGER_USES.map((item) => (
                <tr key={item.pattern}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--ds-color-border-subtle)', fontWeight: 600 }}>{item.pattern}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>{item.resource}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>{item.guarantee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout type="info">
          <strong>Know the scope:</strong> redirecting standard output changes process-global state, so avoid using it
          around concurrent work that also writes to standard output. Context managers make cleanup predictable;
          they do not automatically make a resource safe to share.
        </Callout>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <h3 style={{ margin: '0 0 6px' }}>Build one with contextlib</h3>
        <p style={{ margin: '0 0 12px', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
          A generator-based manager pauses at <code>yield</code> while the block runs. If the block raises,
          the exception is raised at that point; re-raising after rollback preserves normal propagation.
        </p>
        <CodeBlock language="python" code={TRANSACTION_CONTEXT_CODE} />
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <h3 style={{ margin: '0 0 6px' }}>Manage a dynamic number of resources</h3>
        <p style={{ margin: '0 0 12px', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
          <code>ExitStack</code> is useful when the resources to enter are known only at runtime. If setup fails
          halfway through, already-entered managers are still unwound when the stack exits.
        </p>
        <CodeBlock language="python" code={EXIT_STACK_CODE} />
      </Card>

      <Callout type="success">
        <strong>Async variant:</strong> asynchronous context managers use <code>__aenter__</code> and <code>__aexit__</code>,
        and are used with <code>async with</code> when setup or cleanup must await asynchronous operations.
      </Callout>
    </div>
  );
}
