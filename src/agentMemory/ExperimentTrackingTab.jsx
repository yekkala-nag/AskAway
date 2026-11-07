import React, { useState } from 'react';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';

const frameworkTables = {
  mlflow: {
    title: "MLflow Tracking & Model Registry Workflow",
    description: "End-to-end experiment tracking for scikit-learn pipelines with LLM components",
    keyComponents: [
      "Experiment tracking with unique run IDs",
      "Parameter logging (LLM model, backend, configuration)",
      "Metric tracking (accuracy, loss, etc.)",
      "Artifact storage (models, data, plots)",
      "Model registry for versioned deployment"
    ],
    visualDescription: "Three-phase workflow: experiment logging → comparison → production registration"
  },
  pipeline: {
    title: "Pipeline Versioning Strategy",
    description: "Managing multiple LLM backend versions in a single scikit-learn pipeline",
    keyComponents: [
      "Baseline pipeline with lightweight LLM",
      "Upgraded pipeline with heavier LLM",
      "Parameter comparison across versions",
      "Automated model selection based on metrics"
    ],
    visualDescription: "Side-by-side comparison showing parameter differences and performance metrics"
  }
};

const codeSamples = {
  mlflowSetup: `import mlflow
import mlflow.sklearn
from sklearn.pipeline import Pipeline
from skllm.models.gpt.classification.zero_shot import ZeroShotGPTClassifier

# Configure MLflow tracking
mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("Scikit-LLM-Experiments")

# Define LLM models for comparison
LLM_V1 = "gpt4all::orca-mini-3k-71m-q4_0.gguf"
LLM_V2 = "gpt4all::ggml-model-gpt4all-falcon-q4_0.bin"

# Create pipelines
pipeline_v1 = Pipeline([
    ('classifier', ZeroShotGPTClassifier(model=LLM_V1))
])

pipeline_v2 = Pipeline([
    ('classifier', ZeroShotGPTClassifier(model=LLM_V2))
])

# Track experiments and log models
with mlflow.start_run(run_name="Baseline_Orca_Mini") as run_v1:
    mlflow.log_param("llm_model", LLM_V1)
    mlflow.log_param("llm_backend", "gpt4all")
    pipeline_v1.fit(X_train, y_train)
    mlflow.sklearn.log_model(pipeline_v1, "model", serialization_format="cloudpickle")

with mlflow.start_run(run_name="Upgraded_Falcon") as run_v2:
    mlflow.log_param("llm_model", LLM_V2)
    mlflow.log_param("llm_backend", "gpt4all")
    pipeline_v2.fit(X_train, y_train)
    mlflow.sklearn.log_model(pipeline_v2, "model", serialization_format="cloudpickle")`,
  
  compareRuns: `experiment = mlflow.get_experiment_by_name("Scikit-LLM-Experiments")
  runs_df = mlflow.search_runs(experiment.experiment_id)
  comparison_df = runs_df[['run_id', 'tags.mlflow.runName', 'params.llm_model', 'params.llm_backend', 'status']]
  print("Experiment Versioning Audit:")
  display(comparison_df)`,
  registry: `best_run_id = runs_df[runs_df['tags.mlflow.runName'] == 'Upgraded_Falcon'].iloc[0]['run_id']
  model_uri = f"runs:/{best_run_id}/model"
  registered_model = mlflow.register_model(model_uri=model_uri, name="Production_ZeroShot_Classifier")
  print(f"Successfully registered model '{registered_model.name}'")
  print(f"Current Registry Version: {registered_model.version}`,
  visualElements: [
    "MLflow tracking UI showing experiment comparison",
    "Model registry interface with version history",
    "Pipeline comparison table showing parameter differences"
  ]
};

const contentSections = [
  {
    title: "Introduction",
    content: "This tab demonstrates how to implement versioned experiment tracking for scikit-learn pipelines that integrate large language models using MLflow. The workflow ensures reproducible model development and deployment."
  },
  {
    title: "Setup & Configuration",
    content: "Initialize MLflow tracking with a local SQLite database and define experiment name. Configure scikit-learn pipelines with different LLM backends for comparison."
  },
  {
    title: "Experiment Logging",
    content: "Use MLflow context managers to track runs, log parameters (LLM model file, backend type), and save pipeline artifacts with cloudpickle serialization."
  },
  {
    title: "Version Comparison",
    content: "Retrieve and compare runs using MLflow's search API to evaluate different LLM backends based on performance metrics and configuration parameters."
  },
  {
    title: "Model Registry",
    content: "Register the best-performing model version to MLflow's Model Registry for formal deployment and version management."
  }
];

const tabs = [
  { id: 'setup', icon: '⚙️', label: '1. Setup & Configuration', desc: 'Initialize MLflow and define pipeline structure' },
  { id: 'logging', icon: '📝', label: '2. Experiment Logging', desc: 'Track parameters and save pipeline artifacts' },
  { id: 'comparison', icon: '📊', label: '3. Version Comparison', desc: 'Analyze different LLM backends' },
  { id: 'registry', icon: '🏷️', label: '4. Model Registry', desc: 'Register best model for production' }
];

export default function ExperimentTrackingTab() {
  const [sub, setSub] = useState('setup');
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero 
        moduleId="context_memory" 
        moduleLabel="Production & Frontiers [Experiment Tracking]"
        title="Versioned Experiment Tracking for LLM Pipelines"
        description="Track, compare, and register scikit-learn pipelines with LLM components using MLflow"
        metrics={[
          { label: 'Experiment Tracking', value: 'Unique run IDs, parameter logging' },
          { label: 'Model Comparison', value: 'Evaluate LLM backends objectively' },
          { label: 'Production Ready', value: 'Formal model versioning' }
        ]}
      />
      
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)' }}>
        <div style={{ marginBottom: 'var(--ds-space-4)' }}>
          <h3>Versioned Experiment Workflow</h3>
          <p>Track model development across LLM backend versions with full parameter and metric logging.</p>
        </div>
        
        {sub === 'setup' && (
          <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16', color: 'white' }}>
            <h4>Setup & Configuration</h4>
            <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
import mlflow
import mlflow.sklearn
from sklearn.pipeline import Pipeline
from skllm.models.gpt.classification.zero_shot import ZeroShotGPTClassifier

# Configure MLflow tracking
mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("Scikit-LLM-Experiments")

# Define LLM models for comparison
LLM_V1 = "gpt4all::orca-mini-3k-71m-q4_0.gguf"
LLM_V2 = "gpt4all::ggml-model-gpt4all-falcon-q4_0.bin"

# Create pipelines
pipeline_v1 = Pipeline([
    ('classifier', ZeroShotGPTClassifier(model=LLM_V1))
])

pipeline_v2 = Pipeline([
    ('classifier', ZeroShotGPTClassifier(model=LLM_V2))
])
            </pre>
          </Card>
        )}
        
        {sub === 'logging' && (
          <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16', color: 'white' }}>
            <h4>Experiment Logging</h4>
            <p>Use MLflow context managers to track runs, log parameters, and save pipeline models with cloudpickle serialization.</p>
            <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
with mlflow.start_run(run_name="Baseline_Orca_Mini") as run_v1:
    mlflow.log_param("llm_model", LLM_V1)
    mlflow.log_param("llm_backend", "gpt4all")
    pipeline_v1.fit(X_train, y_train)
    mlflow.sklearn.log_model(pipeline_v1, "model", serialization_format="cloudpickle")
            </pre>
          </Card>
        )}
        
        {sub === 'comparison' && (
          <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16', color: 'white' }}>
            <h4>Version Comparison</h4>
            <p>Retrieve and compare runs to evaluate different LLM backends based on performance and configuration.</p>
            <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
experiment = mlflow.get_experiment_by_name("Scikit-LLM-Experiments")
runs_df = mlflow.search_runs(experiment.experiment_id)
comparison_df = runs_df[['run_id', 'tags.mlflow.runName', 'params.llm_model', 'params.llm_backend', 'status']]
print("Experiment Versioning Audit:")
display(comparison_df)
            </pre>
          </Card>
        )}
        
        {sub === 'registry' && (
          <Card style={{ padding: 'var(--ds-space-4)', background: '#090d16', color: 'white' }}>
            <h4>Model Registry</h4>
            <p>Register the optimal model version to MLflow's Model Registry for formal deployment.</p>
            <pre style={{ background: '#0f172a', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px' }}>
best_run_id = runs_df[runs_df['tags.mlflow.runName'] == 'Upgraded_Falcon'].iloc[0]['run_id']
model_uri = f"runs:/{best_run_id}/model"
registered_model = mlflow.register_model(model_uri=model_uri, name="Production_ZeroShot_Classifier")
print(f"Successfully registered model '{registered_model.name}'")
print(f"Current Registry Version: {registered_model.version}")
            </pre>
          </Card>
        )}
        
        <Callout type="success">
          <strong>Key Benefit:</strong> Enables objective model comparison and ensures production-ready versioning for LLM-integrated pipelines
        </Callout>
      </Card>
      
      {showCode && (
        <CodeBlock language="python" code={codeSamples.mlflowSetup} />
      )}
    </div>
  );
}