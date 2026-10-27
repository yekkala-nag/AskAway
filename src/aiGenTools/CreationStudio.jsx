import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/ui/Core.jsx';
import { generateArtifact, generateImage } from './generation.js';

const OUTPUT_TYPES = [
  { id: 'images', label: 'Image', icon: '🎨', description: 'Generate an original image' },
  { id: 'tables', label: 'Table', icon: '📊', description: 'Create a structured table' },
  { id: 'workflows', label: 'Workflow', icon: '⚙️', description: 'Map a process into steps' },
  { id: 'simulations', label: 'Simulation', icon: '🧪', description: 'Explore a tunable scenario' },
  { id: 'animations', label: 'Animation', icon: '🎬', description: 'Animate a generated storyboard' },
];

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  padding: '10px 12px',
  font: 'inherit',
  fontSize: '0.82rem',
  color: '#1A1D26',
  background: '#FFFFFF',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: '6px', color: '#374151', fontSize: '0.75rem', fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

function AnimationPreview({ artifact }) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const scene = artifact.scenes[sceneIndex];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(
      () => setSceneIndex((index) => (index + 1) % artifact.scenes.length),
      scene.durationMs,
    );
    return () => window.clearTimeout(timer);
  }, [artifact.scenes.length, playing, scene.durationMs, sceneIndex]);

  return (
    <div>
      <div
        aria-live="polite"
        style={{
          minHeight: '190px',
          borderRadius: '12px',
          padding: '24px',
          display: 'grid',
          alignContent: 'center',
          textAlign: 'center',
          color: '#FFFFFF',
          background: `linear-gradient(135deg, ${scene.color}, #151B2B)`,
          transition: 'background 500ms ease',
        }}
      >
        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>SCENE {sceneIndex + 1} / {artifact.scenes.length}</div>
        <h4 style={{ margin: '8px 0', fontSize: '1.2rem' }}>{scene.label}</h4>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{scene.description}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {artifact.scenes.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => setSceneIndex(index)}
              aria-label={`Show scene ${index + 1}: ${item.label}`}
              aria-current={index === sceneIndex ? 'step' : undefined}
              style={{ width: '20px', height: '8px', border: 0, borderRadius: '99px', cursor: 'pointer', background: index === sceneIndex ? scene.color : '#D1D5DB' }}
            />
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={() => setPlaying((value) => !value)}>
          {playing ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  );
}

function SimulationPreview({ artifact }) {
  const [values, setValues] = useState(() => Object.fromEntries(
    artifact.variables.map((variable) => [variable.name, variable.initialValue]),
  ));
  const result = artifact.variables.reduce(
    (total, variable) => total + ((values[variable.name] - variable.initialValue) * variable.impact),
    artifact.baseline,
  );

  return (
    <div>
      <p style={{ color: '#6B7280', lineHeight: 1.5 }}>{artifact.description}</p>
      <div style={{ display: 'grid', gap: '16px' }}>
        {artifact.variables.map((variable) => (
          <label key={variable.name} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 12px', color: '#374151', fontSize: '0.78rem' }}>
            <span>{variable.name}</span>
            <strong>{values[variable.name]} {variable.unit}</strong>
            <input
              type="range"
              min={variable.min}
              max={variable.max}
              step={(variable.max - variable.min) / 100}
              value={values[variable.name]}
              onChange={(event) => setValues((current) => ({ ...current, [variable.name]: Number(event.target.value) }))}
              aria-label={variable.name}
              style={{ gridColumn: '1 / -1', width: '100%', accentColor: '#3A9B9F' }}
            />
          </label>
        ))}
      </div>
      <div style={{ marginTop: '18px', padding: '14px', borderRadius: '10px', background: '#EFF8F8', color: '#155E63' }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' }}>Illustrative projection</div>
        <strong style={{ display: 'block', marginTop: '4px', fontSize: '1.4rem' }}>{artifact.metric}: {result.toFixed(2)} {artifact.unit}</strong>
        <small>Calculated from the generated baseline and variable impacts; this is a demonstration, not a forecast.</small>
      </div>
    </div>
  );
}

function ArtifactPreview({ type, artifact }) {
  if (type === 'images') {
    return (
      <img
        src={artifact.src}
        alt="AI-generated result"
        style={{ display: 'block', width: '100%', maxHeight: '540px', objectFit: 'contain', borderRadius: '10px', background: '#F3F4F6' }}
      />
    );
  }
  if (type === 'tables') {
    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
          <thead><tr>{artifact.columns.map((column, index) => <th key={`${column}-${index}`} style={{ padding: '10px', borderBottom: '2px solid #D1D5DB' }}>{column}</th>)}</tr></thead>
          <tbody>{artifact.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex} style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>{String(cell)}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  if (type === 'workflows') {
    return (
      <ol style={{ display: 'grid', gap: '10px', padding: 0, listStyle: 'none' }}>
        {artifact.steps.map((step, index) => (
          <li key={`${step.label}-${index}`} style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: '12px', alignItems: 'start' }}>
            <span style={{ display: 'grid', placeItems: 'center', width: '32px', height: '32px', borderRadius: '50%', color: '#FFFFFF', background: '#3A9B9F', fontWeight: 700 }}>{index + 1}</span>
            <div style={{ padding: '8px 0' }}><strong>{step.label}</strong><div style={{ marginTop: '3px', color: '#6B7280', fontSize: '0.8rem' }}>{step.description}</div></div>
          </li>
        ))}
      </ol>
    );
  }
  if (type === 'simulations') return <SimulationPreview key={JSON.stringify(artifact)} artifact={artifact} />;
  return <AnimationPreview key={JSON.stringify(artifact)} artifact={artifact} />;
}

export default function CreationStudio() {
  const [type, setType] = useState('images');
  const [requirements, setRequirements] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  const [model, setModel] = useState('gpt-4o-mini');
  const [imageEndpoint, setImageEndpoint] = useState('https://api.openai.com/v1/images/generations');
  const [imageModel, setImageModel] = useState('gpt-image-1');
  const [artifact, setArtifact] = useState(null);
  const [generatedType, setGeneratedType] = useState('');
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    setArtifact(null);
    try {
      const config = { apiKey, endpoint, model, imageEndpoint, imageModel };
      const result = type === 'images'
        ? await generateImage(requirements, config)
        : await generateArtifact(type, requirements, config);
      setArtifact(result);
      setGeneratedType(type);
    } catch (generationError) {
      setError(generationError.message || 'Generation failed. Check your endpoint and try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card style={{ padding: '22px', marginBottom: '24px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '14px' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ color: '#3A9B9F', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em' }}>AI CREATION STUDIO</div>
        <h2 style={{ margin: '5px 0', color: '#1A1D26', fontSize: '1.2rem' }}>Turn requirements into interactive outputs</h2>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.5 }}>
          Create images and structured artifacts from your own requirements. Generated tables and workflows are validated before display; simulations and storyboards run in this page.
        </p>
      </div>

      <div role="group" aria-label="Output type" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
        {OUTPUT_TYPES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={type === item.id}
            disabled={generating}
            onClick={() => { setType(item.id); setArtifact(null); setError(''); }}
            style={{
              flex: '1 0 125px',
              padding: '10px',
              textAlign: 'left',
              borderRadius: '9px',
              border: `1px solid ${type === item.id ? '#3A9B9F' : '#E5E7EB'}`,
              background: type === item.id ? '#EFF8F8' : '#FFFFFF',
              cursor: 'pointer',
              color: '#1A1D26',
            }}
          >
            <span aria-hidden="true">{item.icon} </span><strong style={{ fontSize: '0.78rem' }}>{item.label}</strong>
            <span style={{ display: 'block', marginTop: '4px', color: '#6B7280', fontSize: '0.65rem' }}>{item.description}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px' }}>
        <div style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
          <Field label="Requirements">
            <textarea
              value={requirements}
              onChange={(event) => setRequirements(event.target.value)}
              placeholder="Describe the subject, audience, style, constraints, or data you want the output to cover…"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>
          <details>
            <summary style={{ color: '#4B5563', fontSize: '0.76rem', cursor: 'pointer' }}>AI connection settings</summary>
            <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
              <Field label="API key (kept in this page's memory)">
                <input type="password" autoComplete="off" value={apiKey} onChange={(event) => setApiKey(event.target.value)} style={inputStyle} />
              </Field>
              {type !== 'images' && <>
                <Field label="Chat completions endpoint">
                  <input type="url" value={endpoint} onChange={(event) => setEndpoint(event.target.value)} style={inputStyle} />
                </Field>
                <Field label="Text model">
                  <input value={model} onChange={(event) => setModel(event.target.value)} style={inputStyle} />
                </Field>
              </>}
              {type === 'images' && <>
                <Field label="Image generation endpoint">
                  <input type="url" value={imageEndpoint} onChange={(event) => setImageEndpoint(event.target.value)} style={inputStyle} />
                </Field>
                <Field label="Image model">
                  <input value={imageModel} onChange={(event) => setImageModel(event.target.value)} style={inputStyle} />
                </Field>
              </>}
            </div>
          </details>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.68rem', lineHeight: 1.5 }}>
            The API key is not saved by this feature and is sent from your browser to the endpoint you configure. Use a trusted HTTPS endpoint; compatible providers must allow browser requests.
          </p>
          <Button onClick={handleGenerate} disabled={generating || !requirements.trim() || !apiKey.trim()} loading={generating}>
            {generating ? 'Generating…' : `Generate ${OUTPUT_TYPES.find((item) => item.id === type)?.label}`}
          </Button>
          {error && <div role="alert" style={{ color: '#B42318', fontSize: '0.78rem', lineHeight: 1.5 }}>{error}</div>}
        </div>

        <div aria-live="polite" style={{ minWidth: 0 }}>
          {!artifact && !generating && (
            <div style={{ minHeight: '250px', display: 'grid', placeContent: 'center', textAlign: 'center', padding: '20px', border: '1px dashed #D1D5DB', borderRadius: '12px', color: '#6B7280' }}>
              <span style={{ fontSize: '2rem' }} aria-hidden="true">{OUTPUT_TYPES.find((item) => item.id === type)?.icon}</span>
              <strong style={{ marginTop: '8px', color: '#374151' }}>Your generated output appears here</strong>
              <span style={{ marginTop: '4px', fontSize: '0.76rem' }}>Describe the result you need, configure a compatible API, then generate.</span>
            </div>
          )}
          {generating && <div role="status" style={{ minHeight: '250px', display: 'grid', placeContent: 'center', color: '#3A9B9F' }}>Generating your {type}…</div>}
          {artifact && (
            <div style={{ padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FAFBFC' }}>
              {artifact.title && <h3 style={{ margin: '0 0 14px', color: '#1A1D26', fontSize: '1rem' }}>{artifact.title}</h3>}
              <ArtifactPreview type={generatedType} artifact={artifact} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
