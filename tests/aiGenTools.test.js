import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateArtifact, generateImage } from '../src/aiGenTools/generation.js';

const config = {
  apiKey: 'test-key',
  endpoint: 'https://api.example.test/v1/chat/completions',
  model: 'test-model',
  imageEndpoint: 'https://api.example.test/v1/images/generations',
  imageModel: 'test-image-model',
};

describe('AI generation tools', () => {
  it('creates validated tables from structured AI responses', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(options.body);
      assert.equal(body.response_format.type, 'json_object');
      return Response.json({
        choices: [{ message: { content: JSON.stringify({ title: 'Options', columns: ['Name', 'Value'], rows: [['A', '1'], ['B', '2']] }) } }],
      });
    };

    try {
      const result = await generateArtifact('tables', 'Compare two choices', config);
      assert.equal(result.rows.length, 2);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('rejects malformed or mismatched structured responses', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json({
      choices: [{ message: { content: JSON.stringify({ title: 'Incomplete', columns: ['Only one'], rows: [] }) } }],
    });
    try {
      await assert.rejects(generateArtifact('tables', 'Make a table', config), /did not match the required tables output shape/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('accepts valid workflows, simulations, and animated storyboards', async () => {
    const outputs = {
      workflows: {
        title: 'Release flow',
        steps: [
          { label: 'Plan', description: 'Set scope.' },
          { label: 'Build', description: 'Implement changes.' },
          { label: 'Verify', description: 'Check the release.' },
        ],
      },
      simulations: {
        title: 'Capacity planner',
        description: 'Estimate capacity from inputs.',
        metric: 'Capacity',
        unit: 'units',
        baseline: 100,
        variables: [
          { name: 'Staff', unit: 'people', min: 1, max: 10, initialValue: 5, impact: 3 },
          { name: 'Hours', unit: 'hours', min: 1, max: 8, initialValue: 4, impact: 2 },
        ],
      },
      animations: {
        title: 'Data journey',
        scenes: [
          { label: 'Collect', description: 'Inputs arrive.', color: '#123456', durationMs: 2000 },
          { label: 'Shape', description: 'Inputs are prepared.', color: '#654321', durationMs: 3000 },
          { label: 'Deliver', description: 'A result is shown.', color: '#ABCDEF', durationMs: 4000 },
        ],
      },
    };
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (_url, options) => {
      const { messages } = JSON.parse(options.body);
      const requestText = messages[1].content;
      const type = Object.keys(outputs).find((key) => requestText.includes(key));
      const requestedType = type || 'workflows';
      return Response.json({
        choices: [{ message: { content: JSON.stringify(outputs[requestedType]) } }],
      });
    };

    try {
      for (const [type, result] of Object.entries(outputs)) {
        assert.deepEqual(await generateArtifact(type, `Generate ${type}`, config), result);
      }
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('rejects insecure remote endpoints before sending credentials', async () => {
    const originalFetch = globalThis.fetch;
    let requested = false;
    globalThis.fetch = async () => { requested = true; };
    try {
      await assert.rejects(
        generateArtifact('workflows', 'Plan a process', { ...config, endpoint: 'http://api.example.test/chat' }),
        /must use HTTPS/,
      );
      assert.equal(requested, false);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('returns generated image data and rejects missing images', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => Response.json({ data: [{ b64_json: 'abc123' }] });
    try {
      assert.deepEqual(await generateImage('A simple diagram', config), { src: 'data:image/png;base64,abc123' });
      globalThis.fetch = async () => Response.json({ data: [] });
      await assert.rejects(generateImage('A simple diagram', config), /returned no image/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
