import React, { useState } from 'react';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Callout } from '../components/ui/Core.jsx';

const pipelineFlows = [
  {
    step: 1,
    icon: '📄',
    title: 'Input Text',
    description: 'Long, noisy documents requiring summarization before classification'
  },
  {
    step: 2,
    icon: '✨',
    title: 'LLM Summarization',
    description: 'GPTSummarizer condenses text via LLM to canonical keywords and signals'
  },
  {
    step: 3,
    icon: '🧮',
    title: 'Vectorization',
    description: 'TF-IDF transforms concise summaries into numerical vectors'
  },
  {
    step: 4,
    icon: '🎯',
    title: 'Classification',
    description: 'Logistic regression learns from summarized representations'
  }
];

const trainingData = [
  {
    label: 'Energy',
    original: "The new solar panel technology efficiency has increased by 15% due to the novel perovskite layer, significantly lowering the barrier to entry for residential use and driving green energy adoption by making installations cheaper and faster than ever before.",
    summary: "New perovskite solar panels boost efficiency by 15%, reducing costs and accelerating residential green energy adoption."
  },
  {
    label: 'Finance',
    original: "Financial markets saw a sharp downturn today following the central bank's unexpected interest rate hike, leading to massive sell-offs in the tech sector and triggering volatility indices to reach their highest points in over three years.",
    summary: "Markets plunged after unexpected rate hike, causing tech sell-offs and high volatility."
  },
  {
    label: 'Healthcare',
    original: "The clinical trial for the new arthritis medication showed promising results, reducing joint swelling by 40% in the control group without severe side effects, awaiting FDA approval which could bring relief to millions suffering from autoimmune disorders.",
    summary: "New arthritis drug trial reduces swelling by 40% with no severe side effects, pending FDA approval."
  }
];

const testPredictions = [
  {
    original: "A breakthrough mRNA vaccine targeting seasonal flu strains showed 85% efficacy across diverse patient demographics in stage 3 clinical trials, paving the way for a more robust global immune defense next winter.",
    summary: "New mRNA flu vaccine achieved 85% efficacy in diverse patients, promising stronger global immunity next winter.",
    prediction: 'Healthcare'
  },
  {
    original: "Researchers have developed a grid-scale sodium-ion battery that promises to store surplus wind and solar power at a fraction of lithium's cost, potentially resolving the intermittency issue of renewables.",
    summary: "New grid-scale sodium-ion battery can store excess wind/solar power cheaply, easing renewable intermittency.",
    prediction: 'Energy'
  },
  {
    original: "Stocks rallied in late trading as technology shares recovered from yesterday's losses, driven by strong earnings reports from major semiconductor manufacturers and optimistic GDP growth forecasts.",
    summary: "Tech stocks rebound late, fueled by strong semiconductor earnings and hopeful GDP growth, boosting overall market rally.",
    prediction: 'Finance'
  }
];

const testCases = [
  { input: 'The new solar panel technology efficiency has increased by 15% due to the novel perovskite layer, significantly lowering the barrier to entry for residential use and driving green energy adoption by making installations cheaper and faster than ever before.', expected: 'Energy' },
  { input: 'Financial markets saw a sharp downturn today following the central bank\'s unexpected interest rate hike, leading to massive sell-offs in the tech sector and triggering volatility indices to reach their highest points in over three years.', expected: 'Finance' },
  { input: 'The clinical trial for the new arthritis medication showed promising results, reducing joint swelling by 40% in the control group without severe side effects, awaiting FDA approval which could bring relief to millions suffering from autoimmune disorders.', expected: 'Healthcare' }
];

export default function SummarizationTab() {
  const [sub, setSub] = useState('pipeline');
  
  const tabs = [
    { id: 'pipeline', icon: '🔗', label: '1. The Integrated Pipeline', desc: 'LLM summarization + TF-IDF + classifier' },
    { id: 'training', icon: '📊', label: '2. Training Data & Summaries', desc: 'Three example documents with summaries' },
    { id: 'predictions', icon: '🎯', label: '3. Unseen Predictions', desc: 'Pipeline classifies with prior summarization' }
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero 
        moduleId="data_platform" 
        moduleLabel="Data & Platform Layers [Summarization Integration]"
        title="LLM-Powered Text Summarization in ML Pipelines"
        description="Seamlessly integrate LLM-driven summarization as a preprocessing stage in scikit-learn pipelines for improved classification accuracy and efficiency."
        metrics={[
          { label: 'Pipeline Efficiency', value: 'TF-IDF on summaries' },
          { label: 'Accuracy', value: 'Near-zero training data' },
          { label: 'Cost', value: 'Free tools available' }
        ]}
      />

      <div style={{ marginBottom: 'var(--ds-space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-data_platform-primary' : 'transparent', color: sub === t.id ? 'white' : 'var(--color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
          </button>))}
        </div>
      </div>

      {sub === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          {pipelineFlows.map(s => (
            <Card key={s.step} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #5EC4C8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{s.title}</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: '14px' }}>{s.description}</p>
            </Card>
          ))}
          
          <Card style={{ padding: 'var(--ds-space-5)', background: '#090d16', color: 'white' }}>
            <h4>Complete ML Pipeline Implementation</h4>
            <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto' }}>
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from skllm.models.gpt.text2text.summarization import GPTSummarizer

text_pipeline = Pipeline([
    ('summarizer', GPTSummarizer(
        model="custom_url::openai/gpt-oss-20b",
        max_words=20
    )),
    ('vectorizer', TfidfVectorizer()),
    ('classifier', LogisticRegression())
])

text_pipeline.fit(X_long_texts, y_labels)
            </pre>
            <Callout type="info">
              <strong>Key Insight:</strong> The LLM acts as a precise filter that condenses noisy text into canonical keywords before TF-IDF vectorization.
            </Callout>
          </Card>
        </div>
      )}

      {sub === 'training' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          {trainingData.map((t, i) => (
            <Card key={i} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{t.label} Classification</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ds-space-4)' }}>
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>Original Text</h4>
                  <p style={{ fontSize: '13px', color: 'var(--ds-color-text)', margin: 0, lineHeight: 1.6 }}>{t.original}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>LLM Summary</h4>
                  <p style={{ fontSize: '13px', color: 'var(--ds-color-text)', margin: 0, lineHeight: 1.6 }}>{t.summary}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {sub === 'predictions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          {testPredictions.map((t, i) => (
            <Card key={i} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Prediction: {t.prediction}</h3>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>Original Document</h4>
                <p style={{ fontSize: '13px', color: 'var(--ds-color-text)', margin: 0, lineHeight: 1.6 }}>{t.original}</p>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>Intermediate Summary</h4>
                <p style={{ fontSize: '13px', color: 'var(--ds-color-text)', margin: 0, lineHeight: 1.6 }}>{t.summary}</p>
              </div>
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>
                <strong>Predicted Category: </strong><span style={{ color: 'white', fontWeight: 'bold' }}>{t.prediction}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Callout type="success">
        <strong>Key Benefit:</strong> Combines LLM's reasoning power with classical ML efficiency — lightweight and surprisingly effective for classification tasks.
      </Callout>
    </div>
  );
}