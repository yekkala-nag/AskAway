import React, { useState, useMemo, useRef } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import LossCurveChart from '../components/ui/LossCurveChart.jsx';
import LossHistoryChart from '../components/ui/LossHistoryChart.jsx';
import ScatterPlot from '../components/ui/ScatterPlot.jsx';
import {
  HOUSE_PRICE_DATASET,
  TARGET_MARK_HOUSE_SIZE,
  CALCULATE_LINE_FIT,
  GENERATE_LOSS_CURVE_DATA,
  GRADIENT_DESCENT_STEP,
  GET_OPTIMAL_WEIGHTS,
  PYTHON_LINEAR_REGRESSION_CODE
} from './linearRegressionEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: fit the line, measure residuals, descend the bowl. */
function LinearRegressionPanel() {
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12.5, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '8px 10px', marginTop: 8, lineHeight: 1.8, textAlign: 'center',
  };
  return (
    <Panel
      title="Linear Regression & Gradient Descent"
      sub="Fit house price to size, measure what the line misses, then walk the loss surface downhill."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
        <GlassCard color="#5EC4C8" icon="chart" title="1. Fit the Line">
          <ul style={pts}>
            <li>y = actual price, x = house size</li>
            <li>y-hat = predicted price; w = slope, b = intercept</li>
            <li>Residuals e[i] = y[i] − y-hat[i]</li>
          </ul>
          <div style={mono}>y_hat = w * x + b</div>
        </GlassCard>
        <GlassCard color="#E8C558" icon="zap" title="2. Cost = MSE">
          <ul style={pts}>
            <li>Mean squared error over all points</li>
            <li>One bowl, one global minimum</li>
          </ul>
          <div style={mono}>J = (1/n) * sum((y - y_hat)^2)</div>
        </GlassCard>
        <GlassCard color="#34D399" icon="refresh" title="3. Descend & Update">
          <ul style={pts}>
            <li>Step against the gradient by learning rate</li>
            <li>MAE as the companion metric</li>
          </ul>
          <div style={mono}>w = w - lr * dJ/dw{'\n'}b = b - lr * dJ/db</div>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function LinearRegressionTab() {
  const [activeSubTab, setActiveSubTab] = useState('fitting');
  const [costMetric, setCostMetric] = useState('mse'); // 'mse' | 'mae'

  // Get optimal weights analytically
  const { optimalW, optimalB } = GET_OPTIMAL_WEIGHTS();

  // Line fitting sliders - default to optimal values
  const [slopeW, setSlopeW] = useState(optimalW);
  const [interceptB, setInterceptB] = useState(optimalB);

  // Gradient descent stepper state
  const [gdW, setGdW] = useState(0);
  const [gdB, setGdB] = useState(0);
  const [learningRate, setLearningRate] = useState(0.05);
  const [gdStepCount, setGdStepCount] = useState(0);
  const [gdLossHistory, setGdLossHistory] = useState([]);
  const [lastGradients, setLastGradients] = useState({ dJ_dw: 0, dJ_db: 0 });

  const fitResult = CALCULATE_LINE_FIT(slopeW, interceptB);
  const lossCurveData = useMemo(() => GENERATE_LOSS_CURVE_DATA(slopeW), [slopeW]);
  const gdFitResult = CALCULATE_LINE_FIT(gdW, gdB);
  const optimalFitResult = CALCULATE_LINE_FIT(optimalW, optimalB);

  const handleStepGD = () => {
    const next = GRADIENT_DESCENT_STEP(gdW, gdB, learningRate);
    setGdW(next.nextW);
    setGdB(next.nextB);
    setGdStepCount(prev => prev + 1);
    setLastGradients({ dJ_dw: next.dJ_dw, dJ_db: next.dJ_db });
    setGdLossHistory(prev => [...prev, { step: gdStepCount + 1, mse: CALCULATE_LINE_FIT(next.nextW, next.nextB).mse, w: next.nextW, b: next.nextB }]);
  };

  const handleResetGD = () => {
    setGdW(0);
    setGdB(0);
    setGdStepCount(0);
    setGdLossHistory([]);
    setLastGradients({ dJ_dw: 0, dJ_db: 0 });
  };

  const handleRunToConvergence = () => {
    let w = gdW;
    let b = gdB;
    let steps = 0;
    const history = [...gdLossHistory];
    for (let i = 0; i < 500; i++) {
      const next = GRADIENT_DESCENT_STEP(w, b, learningRate);
      w = next.nextW;
      b = next.nextB;
      steps++;
      history.push({ step: gdStepCount + steps, mse: CALCULATE_LINE_FIT(w, b).mse, w, b });
      if (Math.abs(next.dJ_dw) < 0.01 && Math.abs(next.dJ_db) < 0.01) {
        setLastGradients({ dJ_dw: next.dJ_dw, dJ_db: next.dJ_db });
        break;
      }
    }
    setGdW(w);
    setGdB(b);
    setGdStepCount(prev => prev + steps);
    setGdLossHistory(history);
  };

  const handleResetToOptimal = () => {
    setGdW(optimalW);
    setGdB(optimalB);
    setGdLossHistory([]);
    setLastGradients({ dJ_dw: 0, dJ_db: 0 });
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Machine Learning Foundations]"
        title="Back to Basics: Linear Regression, Cost Function, and Gradient Descent"
        description="Shreya Rao's foundational deep-dive into machine learning optimization: solving Mark's 2,400 sq ft house pricing problem using linear line fitting y_hat = w*x + b, Mean Squared Error (MSE) cost functions, and Gradient Descent optimization."
        metrics={[
          { label: 'Model Type', value: 'Linear Regression' },
          { label: 'Line Equation', value: 'y_hat = w*x + b' },
          { label: 'Cost Metric', value: 'MSE & MAE Loss' },
          { label: 'Optimization', value: 'Gradient Descent' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <LinearRegressionPanel />
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'fitting', icon: '🏡', label: '1. House Pricing Line Fitter', desc: 'Slope & intercept line fitting' },
            { id: 'cost', icon: '🧮', label: '2. Cost Function Lab (MSE vs MAE)', desc: 'Parabolic error loss curves' },
            { id: 'gradient', icon: '📉', label: '3. Step-by-Step Gradient Descent', desc: 'Iterative weight update stepper' },
            { id: 'code', icon: '🐍', label: '4. Python & NumPy Engine', desc: 'Production Python code from scratch' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: LINE FITTING ─── */}
        {activeSubTab === 'fitting' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏡 Mark's 2,400 sq ft House Pricing Problem</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Mark wants to sell his 2,400 sq ft house. Using comparable nearby sales (1,000 sq ft = $170k, 1,500 sq ft = $210k, 2,000 sq ft = $300k), we fit a linear regression line $\hat{y} = w \cdot x + b$ to predict Mark's listing price!
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Slope / Weight w ({slopeW}):</label>
                    <input type="range" min="50" max="200" step="1" value={slopeW} onChange={e => setSlopeW(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Intercept / Bias b ({interceptB}):</label>
                    <input type="range" min="-50" max="150" step="1" value={interceptB} onChange={e => setInterceptB(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </Grid>

                <Flex gap={3} style={{ marginBottom: 'var(--ds-space-2)' }}>
                  <Button variant="subtle" size="sm" onClick={() => { setSlopeW(optimalW); setInterceptB(optimalB); }} style={{ borderColor: '#5EC4C8', color: '#5EC4C8' }}>
                    ✨ Reset to Optimal (w={optimalW}, b={optimalB})
                  </Button>
                  <Badge variant="subtle" style={{ alignSelf: 'center' }}>Optimal MSE: {optimalFitResult.mse}</Badge>
                </Flex>

                <ScatterPlot
                  points={fitResult.points}
                  slopeW={slopeW}
                  interceptB={interceptB}
                  title="House Price vs Size with Regression Line"
                />

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MEAN SQUARED ERROR (MSE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>{fitResult.mse}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #8b5cf6' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MEAN ABSOLUTE ERROR (MAE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#8b5cf6' }}>{fitResult.mae}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MARK'S 2,400 SQ FT PREDICTED PRICE:</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>${fitResult.markPredPrice}k</div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: COST FUNCTION ─── */}
        {activeSubTab === 'cost' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Cost Functions: Mean Squared Error (MSE) vs Mean Absolute Error (MAE)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    A Cost Function quantifies how "bad" a line fits the dataset. <strong>MAE</strong> computes (1/N) * sum(|y - y_hat|), while <strong>MSE</strong> squares residuals (1/N) * sum((y - y_hat)^2), penalizing large errors much more aggressively.
                  </p>
                </div>

                <Flex gap={3} align="center" style={{ marginBottom: 'var(--ds-space-2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                    <input
                      type="radio"
                      name="costMetric"
                      value="mse"
                      checked={costMetric === 'mse'}
                      onChange={e => setCostMetric(e.target.value)}
                      style={{ accentColor: 'var(--ds-color-module-foundations-primary)' }}
                    />
                    <span>MSE (Convex Parabola)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                    <input
                      type="radio"
                      name="costMetric"
                      value="mae"
                      checked={costMetric === 'mae'}
                      onChange={e => setCostMetric(e.target.value)}
                      style={{ accentColor: 'var(--ds-color-module-foundations-primary)' }}
                    />
                    <span>MAE (V-Shaped)</span>
                  </label>
                  <span style={{ marginLeft: 'auto', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                    Slope w fixed at: {slopeW}
                  </span>
                </Flex>

                <LossCurveChart
                  data={lossCurveData}
                  currentW={slopeW}
                  currentB={interceptB}
                  metric={costMetric}
                  title={`${costMetric.toUpperCase()} Loss vs Intercept (b)`}
                />

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>Mean Absolute Error (MAE):</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>
                      Calculates the average magnitude of absolute residuals. Provides linear penalties without heavily skewing for single extreme outliers.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F' }}>Mean Squared Error (MSE):</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>
                      Calculates average squared residuals. Produces a smooth convex parabola $J(w, b)$, making mathematical derivative gradient descent updates clean and tractable.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: GRADIENT DESCENT ─── */}
        {activeSubTab === 'gradient' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📉 Step-by-Step Gradient Descent Optimizer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of guessing weights via brute force, Gradient Descent takes partial derivative steps along the loss gradient nabla J(w, b) with learning rate alpha: w_(t+1) = w_t - alpha * (dJ/dw).
                  </p>
                </div>

                <div style={{ marginBottom: 'var(--ds-space-3)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                    Learning Rate α ({learningRate}):
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="0.1"
                    step="0.001"
                    value={learningRate}
                    onChange={e => setLearningRate(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>

                <Flex gap={3} align="center" flexWrap="wrap">
                  <Button variant="primary" size="sm" onClick={handleStepGD}>
                    ▶️ Step Gradient Descent (+1)
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleRunToConvergence} style={{ background: '#5EC4C8' }}>
                    ⏩ Run to Convergence (500 steps)
                  </Button>
                  <Button variant="subtle" size="sm" onClick={handleResetGD}>
                    🔄 Reset to (0, 0)
                  </Button>
                  <Button variant="subtle" size="sm" onClick={handleResetToOptimal} style={{ borderColor: '#5EC4C8', color: '#5EC4C8' }}>
                    ✨ Reset to Optimal ({optimalW}, {optimalB})
                  </Button>
                  <Badge variant="subtle">Total Steps: {gdStepCount}</Badge>
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT WEIGHT w (SLOPE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>{gdW}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT BIAS b (INTERCEPT):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#8b5cf6' }}>{gdB}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT MSE LOSS:</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>{gdFitResult.mse}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>OPTIMAL MSE:</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#5EC4C8' }}>{optimalFitResult.mse}</div>
                  </Card>
                </Grid>

                {/* Gradient Info */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)" style={{ marginTop: 'var(--ds-space-2)' }}>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3A9B9F' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>GRADIENT dJ/dw (∂loss/∂w):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F', fontFamily: 'DM Mono, monospace' }}>
                      {lastGradients.dJ_dw.toFixed(2)}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', margin: '4px 0 0 0' }}>
                      Steepness of loss w.r.t. slope
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #8b5cf6' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>GRADIENT dJ/db (∂loss/∂b):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#8b5cf6', fontFamily: 'DM Mono, monospace' }}>
                      {lastGradients.dJ_db.toFixed(2)}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', margin: '4px 0 0 0' }}>
                      Steepness of loss w.r.t. intercept
                    </p>
                  </Card>
                </Grid>

                {/* Loss History Chart */}
                {gdLossHistory.length > 0 && (
                  <LossHistoryChart history={gdLossHistory} title="MSE Loss Convergence History" />
                )}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production Python & NumPy Implementation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete Python implementation of Linear Regression, Mean Squared Error (MSE), Mean Absolute Error (MAE), and Gradient Descent optimization from scratch.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LINEAR_REGRESSION_CODE} />

                <Callout type="success">
                  <strong>Key Takeaway:</strong> Linear Regression and Gradient Descent form the foundation for all modern Machine Learning and Deep Learning optimization algorithms, including backpropagation in modern Deep Neural Networks.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: WORKFLOW + TABLE + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>📉 Interactive Regression Lab</h3>
            <Badge variant="module" moduleId="foundations">Data · Gradient Descent</Badge>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <DataTable
            caption="Mark's House Pricing Dataset (size → price in $1000s)"
            searchable={false}
            columns={[
              { key: 'label', label: 'House', sortable: false },
              { key: 'size', label: 'Size (sq ft)', numeric: true },
              { key: 'price', label: 'Price ($k)', numeric: true },
            ]}
            rows={HOUSE_PRICE_DATASET}
            rowKey={(r) => r.label}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <Workflow
            accent="foundations"
            accentLabel="Gradient Descent"
            title="Fitting the Best Line, Step by Step"
            description="How the model learns weights w and bias b. Hit ▶ Play to animate each iteration."
            steps={[
              { title: 'Initialize w, b', description: 'Start with random (or zero) slope w and intercept b. The initial line is a poor guess.', icon: '🎲' },
              { title: 'Compute Predictions', description: 'For every house, compute ŷ = w·x + b and measure the residual (actual − predicted).', icon: '🔮' },
              { title: 'Measure Loss (MSE)', description: 'Average the squared residuals. Lower MSE means a tighter fit to the data.', icon: '📏' },
              { title: 'Compute Gradients', description: 'Take the derivative of the loss w.r.t. w and b to find the steepest descent direction.', icon: '🧭' },
              { title: 'Update w, b', description: 'w ← w − α·∂L/∂w, b ← b − α·∂L/∂b with learning rate α. Repeat until convergence.', icon: '🔄' },
            ]}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Mark's 2400 sq ft Prediction</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-foundations-primary)' }}>
                $<AnimatedNumber value={optimalFitResult.markPredPrice} decimals={0} />k
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              With the fitted line, Mark's <strong>2400 sq ft</strong> house is predicted near the regression estimate
              (slope {optimalW}, bias {optimalB}, MSE {optimalFitResult.mse}).
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
