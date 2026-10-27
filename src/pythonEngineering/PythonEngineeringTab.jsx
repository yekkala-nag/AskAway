import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import ContextManagersPanel from './ContextManagersPanel.jsx';
import {
  SIMULATE_PID_STEP,
  SIMULATE_HARMONIC_OSCILLATOR,
  CALCULATE_RANKINE_EFFICIENCY,
  PYTHON_ENGINEERING_TOOLKIT_SCRIPT
} from './engineeringEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PythonEngineeringTab() {
  const [activeSubTab, setActiveSubTab] = useState('pid'); 

  // PID Controls State
  const [kp, setKp] = useState(2.5);
  const [ki, setKi] = useState(0.8);
  const [kd, setKd] = useState(1.2);
  const pidResult = SIMULATE_PID_STEP(kp, ki, kd, 10.0, 40);

  // Harmonic Oscillator State
  const [damping, setDamping] = useState(0.4);
  const [springK, setSpringK] = useState(6.0);
  const oscResult = SIMULATE_HARMONIC_OSCILLATOR(1.0, damping, springK, 5.0, 50);

  // Rankine State
  const [boilerPressure, setBoilerPressure] = useState(10.0);
  const [superheatTemp, setSuperheatTemp] = useState(550);
  const rankineResult = CALCULATE_RANKINE_EFFICIENCY(boilerPressure, 10.0, superheatTemp);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Computational Engineering & Numerical Physics]"
        title="Python Engineering Simulators & Resource Lifecycles"
        description="Explore interactive numerical solvers for PID control, damped vibrations, thermodynamic cycles, and structural analysis, alongside Python context managers for reliable resource setup, transactions, and cleanup."
        metrics={[
          { label: 'Numerical Physics', value: 'ODE Integration (solve_ivp)' },
          { label: 'Control Systems', value: 'Live PID Step-Response Tuner' },
          { label: 'Structural Analysis', value: '2D Truss Stiffness Matrix' },
          { label: 'Python Runtime', value: 'Context Manager Lifecycle' }
        ]}
      />

      <Container size="wide">
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
            { id: 'pid', icon: '🎛️', label: '1. PID Controller Lab', desc: 'Kp, Ki, Kd step response' },
            { id: 'oscillator', icon: '〰️', label: '2. Harmonic Oscillator', desc: 'Under/critical/overdamping' },
            { id: 'rankine', icon: '🔥', label: '3. Rankine Steam Cycle', desc: 'Boiler pressure vs thermal η' },
            { id: 'fea', icon: '🏗️', label: '4. 2D Truss FEA Solver', desc: 'Displacements & bar tensions' },
            { id: 'code', icon: '💻', label: '5. NumPy / SciPy Toolkit', desc: 'Production engineering scripts' },
            { id: 'contexts', icon: '♻️', label: '6. Context Managers', desc: 'Scoped setup, cleanup & exceptions' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: PID CONTROLLER LAB ─── */}
        {activeSubTab === 'pid' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎛️ Live Closed-Loop PID Controller Step-Response Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Tune Proportional (Kp), Integral (Ki), and Derivative (Kd) gains in real time to reach setpoint = 10.0 without unstable oscillations.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Proportional Gain (Kp): {kp.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="10.0"
                      step="0.1"
                      value={kp}
                      onChange={e => setKp(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Integral Gain (Ki): {ki.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.0"
                      max="4.0"
                      step="0.1"
                      value={ki}
                      onChange={e => setKi(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Derivative Gain (Kd): {kd.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.0"
                      max="5.0"
                      step="0.1"
                      value={kd}
                      onChange={e => setKd(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Grid>

                {/* METRICS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>FINAL STEADY-STATE VALUE</div>
                    <div style={{ fontSize: '18px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                      {pidResult.steadyStateVal} (Target: 10.0)
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #ef4444' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>OVERSHOOT PERCENTAGE</div>
                    <div style={{ fontSize: '18px', color: Number(pidResult.overshootPct) > 20 ? '#ef4444' : '#5EC4C8', fontWeight: 'bold', marginTop: '4px' }}>
                      {pidResult.overshootPct}%
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>STABILITY STATUS</div>
                    <div style={{ fontSize: '18px', color: pidResult.isStable ? '#5EC4C8' : '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>
                      {pidResult.isStable ? '✓ STABLE CONVERGENCE' : '⚠️ UNSTABLE OSCILLATION'}
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: HARMONIC OSCILLATOR ─── */}
        {activeSubTab === 'oscillator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>〰️ Mechanical Damped Harmonic Oscillator Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Solves <code>m*d²x/dt² + c*dx/dt + k*x = 0</code> to visualize underdamped decay, critical damping, and overdamped motion.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Damping Coefficient (c): {damping.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.05"
                      max="6.0"
                      step="0.05"
                      value={damping}
                      onChange={e => setDamping(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Spring Stiffness (k): {springK.toFixed(1)} N/m
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="20.0"
                      step="0.5"
                      value={springK}
                      onChange={e => setSpringK(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Grid>

                <Card style={{ padding: '16px', background: '#090d16', borderLeft: '4px solid #F5A623' }}>
                  <Flex justify="space-between" align="center">
                    <div>
                      <strong style={{ fontSize: '13px', color: '#F5A623' }}>
                        Damping Ratio (ζ): {oscResult.dampingRatio}
                      </strong>
                      <div style={{ fontSize: '12px', color: 'white', marginTop: '4px' }}>
                        Regime: <strong>{oscResult.regime}</strong>
                      </div>
                    </div>
                    <Badge variant="subtle" style={{ color: '#3A9B9F', background: 'rgba(16,185,129,0.15)' }}>
                      Initial Displacement: 5.0m
                    </Badge>
                  </Flex>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: RANKINE STEAM CYCLE ─── */}
        {activeSubTab === 'rankine' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔥 Thermodynamic Rankine Power Cycle Efficiency Calculator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Computes thermal efficiency η_th of a steam power plant as a function of boiler operating pressure and turbine inlet superheat temperature.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Boiler Pressure: {boilerPressure.toFixed(1)} MPa
                    </label>
                    <input
                      type="range"
                      min="2.0"
                      max="20.0"
                      step="0.5"
                      value={boilerPressure}
                      onChange={e => setBoilerPressure(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Superheat Temperature: {superheatTemp} °C
                    </label>
                    <input
                      type="range"
                      min="400"
                      max="650"
                      step="10"
                      value={superheatTemp}
                      onChange={e => setSuperheatTemp(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Grid>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>TURBINE WORK OUTPUT</div>
                    <div style={{ fontSize: '18px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                      {rankineResult.turbineWorkKj} kJ/kg
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #ef4444' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>BOILER HEAT INPUT (Q_in)</div>
                    <div style={{ fontSize: '18px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>
                      {rankineResult.heatInputKj} kJ/kg
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #5EC4C8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>THERMAL EFFICIENCY (η_th)</div>
                    <div style={{ fontSize: '18px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                      {rankineResult.thermalEfficiency}%
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: 2D TRUSS FEA SOLVER ─── */}
        {activeSubTab === 'fea' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏗️ 2D Truss Finite Element Analysis (FEA) Solver</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Assembles elemental stiffness matrices into global <code>K u = F</code> to solve structural deformations and internal bar axial stresses.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      TRUSS ELEMENT STIFFNESS MATRIX (k_e):
                    </strong>
                    <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '11px', color: '#34d399', lineHeight: '1.6' }}>
{`k_e = (E*A/L) * [
  [ c^2,   c*s,  -c^2,  -c*s ],
  [ c*s,   s^2,  -c*s,  -s^2 ],
  [-c^2,  -c*s,   c^2,   c*s ],
  [-c*s,  -s^2,   c*s,   s^2 ]
]
where c = cos(θ), s = sin(θ)`}
                    </pre>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      NUMERICAL COMPUTATION PIPELINE:
                    </strong>
                    <Stack gap={2} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                      <div>1. Define node coordinates and element connectivity matrix</div>
                      <div>2. Assemble global stiffness matrix K (Degrees of Freedom: 2N)</div>
                      <div>3. Apply boundary constraints (Pinned vs Roller supports)</div>
                      <div>4. Solve linear system <code>u = K^-1 * F</code> via <code>np.linalg.solve()</code></div>
                      <div>5. Calculate axial bar stress: <code>σ = E * ε</code> (Tension vs Compression)</div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Python Computational Engineering Toolkit (NumPy & SciPy)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable scripts for numerical ODE integration, FEA assembly, and PID control loops.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_ENGINEERING_TOOLKIT_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
        {activeSubTab === 'contexts' && <ContextManagersPanel />}
      </Container>
    </div>
  );
}
