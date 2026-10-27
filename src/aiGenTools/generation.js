const CHAT_TYPES = {
  tables: {
    instruction: 'Return a useful table with a concise title, 2-6 column names, and 2-12 rows. Every row must have exactly one string value per column.',
    validate: (value) => (
      isRecord(value) &&
      isNonEmptyString(value.title) &&
      Array.isArray(value.columns) &&
      value.columns.length >= 2 &&
      value.columns.length <= 6 &&
      value.columns.every(isNonEmptyString) &&
      Array.isArray(value.rows) &&
      value.rows.length >= 2 &&
      value.rows.length <= 12 &&
      value.rows.every((row) => Array.isArray(row) && row.length === value.columns.length && row.every(isScalar))
    ),
  },
  workflows: {
    instruction: 'Return a workflow with a concise title and 3-8 ordered steps. Each step has a short label and description.',
    validate: (value) => (
      isRecord(value) &&
      isNonEmptyString(value.title) &&
      Array.isArray(value.steps) &&
      value.steps.length >= 3 &&
      value.steps.length <= 8 &&
      value.steps.every((step) => isRecord(step) && isNonEmptyString(step.label) && isNonEmptyString(step.description))
    ),
  },
  simulations: {
    instruction: 'Return an interactive scenario with a title, description, metric name, unit, numeric baseline, and 2-5 input variables. Each variable has name, unit, numeric min, max, initialValue, and impact (metric units per input unit). Ensure min < max and initialValue is within the range.',
    validate: (value) => (
      isRecord(value) &&
      isNonEmptyString(value.title) &&
      isNonEmptyString(value.description) &&
      isNonEmptyString(value.metric) &&
      isNonEmptyString(value.unit) &&
      Number.isFinite(value.baseline) &&
      Array.isArray(value.variables) &&
      value.variables.length >= 2 &&
      value.variables.length <= 5 &&
      value.variables.every((variable) => (
        isRecord(variable) &&
        isNonEmptyString(variable.name) &&
        isNonEmptyString(variable.unit) &&
        Number.isFinite(variable.min) &&
        Number.isFinite(variable.max) &&
        Number.isFinite(variable.initialValue) &&
        Number.isFinite(variable.impact) &&
        variable.min < variable.max &&
        variable.initialValue >= variable.min &&
        variable.initialValue <= variable.max
      ))
    ),
  },
  animations: {
    instruction: 'Return a short animated storyboard with a title and 3-6 scenes. Each scene has a concise label, one-sentence description, a hex accent color, and durationMs between 1000 and 6000.',
    validate: (value) => (
      isRecord(value) &&
      isNonEmptyString(value.title) &&
      Array.isArray(value.scenes) &&
      value.scenes.length >= 3 &&
      value.scenes.length <= 6 &&
      value.scenes.every((scene) => (
        isRecord(scene) &&
        isNonEmptyString(scene.label) &&
        isNonEmptyString(scene.description) &&
        /^#[0-9a-f]{6}$/i.test(scene.color) &&
        Number.isInteger(scene.durationMs) &&
        scene.durationMs >= 1000 &&
        scene.durationMs <= 6000
      ))
    ),
  },
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isScalar(value) {
  return ['string', 'number', 'boolean'].includes(typeof value) || value === null;
}

function parseJsonContent(content) {
  const normalized = content.trim().replace(/^```(?:json)?\s*|\s*```$/gi, '');
  try {
    return JSON.parse(normalized);
  } catch (error) {
    throw new Error(`The AI response was not valid JSON: ${error.message}`);
  }
}

async function postJson(endpoint, apiKey, body) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error('Enter a valid API endpoint URL.');
  }

  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) {
    throw new Error('API endpoints must use HTTPS (HTTP is allowed for localhost).');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      const details = (await response.text()).slice(0, 240);
      throw new Error(`Generation request failed (${response.status})${details ? `: ${details}` : ''}`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Generation request timed out after 60 seconds.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateArtifact(type, requirements, config) {
  const definition = CHAT_TYPES[type];
  if (!definition) throw new Error(`Unsupported output type: ${type}`);
  if (!requirements.trim()) throw new Error('Describe what you want to generate.');
  if (!config.apiKey.trim()) throw new Error('Enter an API key to generate an artifact.');

  const data = await postJson(config.endpoint, config.apiKey, {
    model: config.model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `Create original, useful output from the user's requirements. ${definition.instruction} Return only a JSON object matching the requested shape. Do not copy existing works or include author, publisher, website, URL, citation, or copyright-credit details. Avoid using protected characters, logos, or brand identities.`,
      },
      { role: 'user', content: requirements.trim() },
    ],
  });

  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('The AI endpoint returned no message content.');
  }
  const artifact = parseJsonContent(content);
  if (!definition.validate(artifact)) {
    throw new Error(`The AI response did not match the required ${type} output shape. Try refining your requirements.`);
  }
  return artifact;
}

export async function generateImage(requirements, config) {
  if (!requirements.trim()) throw new Error('Describe the image you want to generate.');
  if (!config.apiKey.trim()) throw new Error('Enter an API key to generate an image.');

  const data = await postJson(config.imageEndpoint, config.apiKey, {
    model: config.imageModel,
    prompt: `Create an original image based on these requirements. Do not include text, logos, signatures, watermarks, or copied protected characters or artwork unless the user specifically asks for text. Requirements: ${requirements.trim()}`,
    n: 1,
    size: '1024x1024',
  });

  const image = data.data?.[0];
  if (typeof image?.b64_json === 'string' && image.b64_json.length > 0) {
    return { src: `data:image/png;base64,${image.b64_json}` };
  }
  if (typeof image?.url === 'string') {
    let url;
    try {
      url = new URL(image.url);
    } catch {
      throw new Error('The image endpoint returned an invalid image URL.');
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('The image endpoint returned an unsupported image URL.');
    }
    return { src: url.href };
  }
  throw new Error('The image endpoint returned no image.');
}
