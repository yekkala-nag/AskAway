import { callAIProxy } from '../../lib/aiProxy.js';

export async function generateWorkflowFromToc(tocEntries, aiConfig = null) {
  const workflow = {
    title: 'Document Workflow',
    nodes: [],
    edges: [],
  };

  if (tocEntries.length === 0) {
    workflow.nodes.push({ id: 'empty', label: 'No structure detected', type: 'info' });
    return workflow;
  }

  const topLevel = tocEntries.filter(t => t.level === 1);
  if (topLevel.length === 0) {
    workflow.nodes.push({ id: 'root', label: 'Document Root', type: 'root' });
  } else {
    workflow.nodes.push({ id: 'root', label: topLevel[0].title, type: 'root' });
  }

  for (const entry of tocEntries) {
    if (entry.level === 1 && entry.title === topLevel[0]?.title) continue;
    const nodeId = `node-${entry.page}-${entry.level}`;
    workflow.nodes.push({
      id: nodeId,
      label: `${'  '.repeat(entry.level - 1)}${entry.title}`,
      page: entry.page,
      level: entry.level,
      type: entry.level === 1 ? 'section' : entry.level === 2 ? 'subsection' : 'detail',
    });
    const parentLevel = entry.level - 1;
    const parent = tocEntries.find(t => t.level === parentLevel && t.page <= entry.page);
    if (parent) {
      const parentId = parent.level === 1 && parent.title === topLevel[0]?.title ? 'root' : `node-${parent.page}-${parent.level}`;
      workflow.edges.push({ from: parentId, to: nodeId });
    } else {
      workflow.edges.push({ from: 'root', to: nodeId });
    }
  }

  if (aiConfig?.apiKey) {
    try {
      const enriched = await callAIForWorkflowEnrichment(workflow, aiConfig);
      return enriched;
    } catch (e) {
      console.warn('AI workflow enrichment failed, using algorithmic workflow', e);
    }
  }

  return workflow;
}

async function callAIForWorkflowEnrichment(workflow, aiConfig) {
  const prompt = `Given this document structure, suggest a better workflow layout and labels. Return JSON with nodes and edges.\n${JSON.stringify(workflow, null, 2)}`;
  const response = await fetchAI(aiConfig, prompt, {
    type: 'object',
    properties: {
      nodes: { type: 'array' },
      edges: { type: 'array' },
    },
  });
  return response;
}

export function workflowToMermaid(workflow) {
  const lines = ['graph TD'];
  for (const node of workflow.nodes) {
    const label = node.label.replace(/"/g, '#quot;');
    lines.push(`  ${node.id}["${label}"]`);
    if (node.type === 'root') lines[lines.length - 1] += ':::root';
    else if (node.type === 'section') lines[lines.length - 1] += ':::section';
  }
  for (const edge of workflow.edges) {
    lines.push(`  ${edge.from} --> ${edge.to}`);
  }
  if (workflow.nodes.some(n => n.type === 'root')) {
    lines.push('  classDef root fill:#5EC4C8,color:#fff');
    lines.push('  classDef section fill:#5EC4C8,color:#fff');
    lines.push('  classDef subsection fill:#60a5fa,color:#fff');
  }
  return lines.join('\n');
}

export async function generateTableFromToc(tocEntries, lineDf = null, aiConfig = null) {
  const table = {
    title: 'Document Structure Summary',
    headers: ['Section', 'Level', 'Page', 'Type'],
    rows: [],
  };

  for (const entry of tocEntries) {
    table.rows.push([
      entry.title,
      entry.level,
      entry.page,
      entry.level === 1 ? 'Chapter' : entry.level === 2 ? 'Section' : 'Subsection',
    ]);
  }

  if (aiConfig?.apiKey) {
    try {
      const enriched = await callAIForTableEnrichment(table, tocEntries, aiConfig);
      return enriched;
    } catch (e) {
      console.warn('AI table enrichment failed, using algorithmic table', e);
    }
  }

  return table;
}

async function callAIForTableEnrichment(table, tocEntries, aiConfig) {
  const prompt = `Enrich this document structure table with summary descriptions for each section based on typical content patterns. Return JSON with title, headers, and rows.\n${JSON.stringify(table, null, 2)}`;
  const response = await fetchAI(aiConfig, prompt, {
    type: 'object',
    properties: {
      title: { type: 'string' },
      headers: { type: 'array' },
      rows: { type: 'array' },
    },
  });
  return response;
}

export async function generateFlashcardsFromToc(tocEntries, lineDf = null, aiConfig = null) {
  const flashcards = [];

  for (let i = 0; i < tocEntries.length; i++) {
    const entry = tocEntries[i];
    const nextEntry = tocEntries[i + 1];

    flashcards.push({
      id: `fc-${i}`,
      type: 'heading',
      front: `What section is titled "${entry.title}"?`,
      back: `Level ${entry.level} section on page ${entry.page}`,
      tags: [entry.level === 1 ? 'chapter' : 'section', `page-${entry.page}`],
    });

    if (nextEntry) {
      flashcards.push({
        id: `fc-${i}-order`,
        type: 'order',
        front: `What comes after "${entry.title}"?`,
        back: `${nextEntry.title} (Level ${nextEntry.level}, Page ${nextEntry.page})`,
        tags: ['order', 'navigation'],
      });
    }

    flashcards.push({
      id: `fc-${i}-detail`,
      type: 'detail',
      front: `Describe the structure of "${entry.title}"`,
      back: `This is a Level ${entry.level} heading at page ${entry.page}. ` +
        (entry.heading_score ? `Confidence score: ${entry.heading_score.toFixed(2)}. ` : '') +
        `Source: ${entry.source || 'unknown'}.`,
      tags: ['detail', `level-${entry.level}`],
    });
  }

  if (aiConfig?.apiKey) {
    try {
      const enriched = await callAIForFlashcardEnrichment(flashcards, tocEntries, aiConfig);
      return enriched;
    } catch (e) {
      console.warn('AI flashcard enrichment failed, using algorithmic flashcards', e);
    }
  }

  return flashcards;
}

async function callAIForFlashcardEnrichment(flashcards, tocEntries, aiConfig) {
  const prompt = `Generate additional study flashcards from this document structure. Include concept questions and cross-references. Return JSON array of flashcards with id, type, front, back, tags.\n${JSON.stringify({ flashcards: flashcards.slice(0, 10), tocEntries }, null, 2)}`;
  const response = await fetchAI(aiConfig, prompt, {
    type: 'array',
    items: {
      type: 'object',
      required: ['id', 'type', 'front', 'back', 'tags'],
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        front: { type: 'string' },
        back: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
    },
  });
  return response;
}

export async function generateImagePromptsFromToc(tocEntries, aiConfig = null) {
  const prompts = [];

  for (const entry of tocEntries) {
    prompts.push({
      section: entry.title,
      page: entry.page,
      prompt: `Professional diagram illustrating "${entry.title}". Clean, modern, educational style.`,
      style: 'diagram',
    });
  }

  if (aiConfig?.apiKey) {
    try {
      const enriched = await callAIForImagePrompts(prompts, tocEntries, aiConfig);
      return enriched;
    } catch (e) {
      console.warn('AI image prompt enrichment failed, using algorithmic prompts', e);
    }
  }

  return prompts;
}

async function callAIForImagePrompts(prompts, tocEntries, aiConfig) {
  const prompt = `Generate detailed image generation prompts for each document section. Include visual style, key elements, and composition notes. Return JSON array.\n${JSON.stringify(prompts.slice(0, 10), null, 2)}`;
  const response = await fetchAI(aiConfig, prompt, {
    type: 'array',
    items: { type: 'object' },
  });
  return response;
}

async function fetchAI(aiConfig, prompt, schema) {
  const content = await callAIProxy({
    messages: [
      { role: 'system', content: 'You are a helpful assistant that returns valid JSON matching the provided schema.' },
      { role: 'user', content: prompt },
    ],
    model: aiConfig?.model || 'gpt-4o-mini',
    apiKey: aiConfig?.apiKey || undefined,
  });
  return JSON.parse(content);
}
