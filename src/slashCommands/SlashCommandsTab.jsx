import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  COMMANDS,
  BEFORE_AFTER,
  DIY_COMMANDS,
  composePrompt,
  customInstructionText,
  CODE_BUILDER,
  CODE_VALIDATE,
} from './slashCommandsEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';

const SUBTABS = [
  { id: 'why', icon: '💡', label: '1. Shape, Not Stacking', desc: 'Why commands work' },
  { id: 'library', icon: '📚', label: '2. The Nine Commands', desc: 'Library with examples' },
  { id: 'playground', icon: '🧪', label: '3. Playground', desc: 'Compose your prompt' },
  { id: 'diy', icon: '🛠️', label: '4. DIY & Code', desc: 'Your own commands' },
];

function Playground() {
  const [selected, setSelected] = useState(COMMANDS[6].cmd); // /table
  const command = COMMANDS.find((c) => c.cmd === selected);
  const [input, setInput] = useState(command.sampleInput);

  const pick = (cmd) => {
    setSelected(cmd);
    setInput(COMMANDS.find((c) => c.cmd === cmd).sampleInput);
  };

  const composed = composePrompt(selected, input);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧪 Playground — command first, request second</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Pick a command, edit the request, and copy the composed prompt. The command sets the response contract; the request supplies the topic.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {COMMANDS.map((c) => (
            <button key={c.cmd} onClick={() => pick(c.cmd)}
              style={{
                padding: '7px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                border: `1.5px solid ${selected === c.cmd ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: selected === c.cmd ? TEAL : 'transparent',
                color: selected === c.cmd ? '#FFF' : 'var(--ds-color-text-secondary)',
              }}>
              {c.cmd}
            </button>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Your request</div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2}
            style={{
              width: '100%', padding: 10, borderRadius: 10, fontSize: 14, resize: 'vertical',
              border: '1.5px solid var(--ds-color-border-subtle)',
              background: 'var(--ds-color-bg-canvas)', color: 'var(--ds-color-text-primary)',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
            aria-label="Your request" />
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Composed prompt (copy this)</div>
          <div style={{
            padding: 14, borderRadius: 10, background: '#1A1D26', color: '#E5E7EB',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13.5, lineHeight: 1.6,
            wordBreak: 'break-word',
          }}>
            <span style={{ color: '#7FD1D4', fontWeight: 700 }}>{selected}</span>{' '}
            <span>{input}</span>
          </div>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${TEAL}` }}>
            <strong style={{ fontSize: 12.5, color: TEAL_DARK, display: 'block', marginBottom: 4 }}>What the command changes</strong>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{command.effect}</span>
          </Card>
          <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${PURPLE}` }}>
            <strong style={{ fontSize: 12.5, color: PURPLE_DARK, display: 'block', marginBottom: 4 }}>Shape you should expect back</strong>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{command.expect}</span>
          </Card>
        </Grid>

        <Callout type="info" title="Example response shape">
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, whiteSpace: 'pre-wrap' }}>
            {command.exampleOutput}
          </span>
        </Callout>
      </Stack>
    </Card>
  );
}

export default function SlashCommandsTab() {
  const [activeSubTab, setActiveSubTab] = useState('why');
  const [copied, setCopied] = useState(false);

  const beforeAfterColumns = [
    { key: 'request', header: 'You ask for' },
    { key: 'without', header: 'Without a command', render: (v) => <span style={{ color: 'var(--ds-color-text-secondary)' }}>{v}</span> },
    { key: 'with', header: 'With a command', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
  ];

  const libraryColumns = [
    { key: 'cmd', header: 'Command', render: (v) => (
      <code style={{
        background: '#E3F2F2', color: TEAL_DARK, fontWeight: 700, padding: '2px 8px',
        borderRadius: 6, fontSize: 13, whiteSpace: 'nowrap',
      }}>{v}</code>
    ) },
    { key: 'effect', header: 'What it does', sortable: false },
    { key: 'expect', header: 'Shape you get back', sortable: false },
    { key: 'favorite', header: '', render: (v) => v ? <Badge variant="default" style={{ background: '#F5F3FA', color: PURPLE_DARK, border: `1px solid ${PURPLE}` }}>favorite</Badge> : null },
  ];

  const diyColumns = [
    { key: 'cmd', header: 'Custom command', render: (v) => (
      <code style={{ background: '#F5F3FA', color: PURPLE_DARK, fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>{v}</code>
    ) },
    { key: 'definition', header: 'Contract definition', sortable: false },
  ];

  const copyText = () => {
    navigator.clipboard?.writeText(customInstructionText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="slashcommands"
        moduleLabel="Foundations [Prompting]"
        title="Slash Commands: One Token of Intent Beats a Stack of Instructions"
        description="Instead of adding another paragraph telling the model how to answer, lead with a slash command. It is a one-token contract for the response shape — the model answers in bullets, tables, or critique mode because the command says so, not because you negotiated in prose."
        metrics={[
          { label: 'Command library', value: '9 built-in' },
          { label: 'Words per command', value: '1' },
          { label: 'DIY commands in this tab', value: '4' },
          { label: 'Instruction stacking', value: '0' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '185px', padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? PURPLE : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'why' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 8px 0' }}>Stacking instructions (the usual way)</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  “Keep it short. No preamble. Use bullets. Actually, a table is better. Don’t summarize at the end. Also mention pricing.”
                  <br /><br />
                  Every added sentence competes with every other one. Long instruction stacks dilute each other, contradict under pressure, and silently fall out of the context you thought they held.
                </p>
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${TEAL}` }}>
                <h3 style={{ margin: '0 0 8px 0' }}>One command (the fix)</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  <code style={{ background: '#E3F2F2', color: TEAL_DARK, padding: '1px 6px', borderRadius: 5, fontWeight: 700 }}>/table Compare SQS, Kafka, RabbitMQ</code>
                  <br /><br />
                  One token declares the shape: fixed columns, one option per row, consistent criteria. The command comes first, before the actual request — it is a contract header, not part of the content.
                </p>
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Same request, two outcomes</h3>
              <Table columns={beforeAfterColumns} data={BEFORE_AFTER} sortable={false} />
            </Card>

            <Callout type="tip" title="Commands change shape, not topic">
              The request still says what to think about; the command says what the answer should look like. Separate those two channels and you stop rewriting your prompt from scratch every time.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'library' && (
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
            <h3 style={{ margin: '0 0 4px 0' }}>The nine commands</h3>
            <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Put the command at the start of the message. Each one is a fixed contract for a different response shape.
            </p>
            <Table columns={libraryColumns} data={COMMANDS} sortable={false} />
          </Card>
        )}

        {activeSubTab === 'playground' && <Playground />}

        {activeSubTab === 'diy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Build your own — four starters</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                A custom command is a trigger phrase plus a fixed contract. Paste the definitions below into your model’s custom instructions so they work everywhere.
              </p>
              <Table columns={diyColumns} data={DIY_COMMANDS} sortable={false} />
              <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                <button onClick={copyText}
                  style={{
                    padding: '9px 16px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    border: 'none', background: copied ? '#E3F2F2' : TEAL, color: copied ? TEAL_DARK : '#FFF',
                  }}>
                  {copied ? '✓ Copied' : 'Copy instruction block'}
                </button>
                <span style={{ fontSize: 12, color: 'var(--ds-color-text-tertiary)' }}>paste into custom instructions</span>
              </div>
              <div style={{
                marginTop: 10, padding: 14, borderRadius: 10, background: '#1A1D26', color: '#E5E7EB',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12.5,
                whiteSpace: 'pre-wrap', lineHeight: 1.6, maxHeight: 240, overflowY: 'auto',
              }}>
                {customInstructionText()}
              </div>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Command library as data — prompt and docs from one source</h3>
              <CodeBlock language="python" code={CODE_BUILDER} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Validate your command set (exit 1 = fix your names)</h3>
              <CodeBlock language="python" code={CODE_VALIDATE} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
