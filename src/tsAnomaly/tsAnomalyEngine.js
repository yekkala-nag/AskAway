// ============================================================================
// TIME SERIES ANOMALY DETECTION USING AUTOENCODERS ENGINE
// ============================================================================

export const ANOMALY_DETECTION_THEORY = [
  {
    step: 1,
    title: "Normal Training Corpus (No Anomalies)",
    description: "The 1D CNN Autoencoder is trained strictly on normal baseline signals. It learns to compress normal sine frequencies and amplitudes into a bottleneck latent space."
  },
  {
    step: 2,
    title: "Latent Space Compression Bottleneck",
    description: "The Encoder compresses N-dimensional signal inputs into a lower-dimensional latent representation (e.g., k=16 features), filtering out high-frequency noise."
  },
  {
    step: 3,
    title: "Reconstruction Error (MSE)",
    description: "The Decoder reconstructs signal x_hat. On normal signals, Mean Squared Error MSE(x, x_hat) is very small (~0.005)."
  },
  {
    step: 4,
    title: "Percentile Thresholding & Anomaly Alert",
    description: "An anomaly threshold T is set at the 99th percentile of normal MSE values. When an anomalous signal arrives, the Autoencoder fails to reconstruct its unlearned frequency/spikes, resulting in MSE > T and triggering an Anomaly Alert!"
  }
];

export const GENERATE_SYNTHETIC_SIGNAL = (type = 'normal', numPoints = 100, ampMult = 1.0, freqMult = 1.0) => {
  const points = [];
  for (let i = 0; i < numPoints; i++) {
    const x = -8 * Math.PI + (i / numPoints) * 16 * Math.PI;
    // Normal signal: sum of 3 sine components
    let y = 1.0 * Math.sin(0.5 * x * freqMult) + 0.5 * Math.sin(1.2 * x * freqMult) + 0.3 * Math.sin(2.0 * x * freqMult);
    y *= ampMult;

    if (type === 'anomalous') {
      // Add high-frequency high-amplitude spike perturbation
      y += 3.5 * Math.sin(7.5 * x * freqMult);
    }
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(3)) });
  }
  return points;
};

export const SIMULATE_AUTOENCODER_RECONSTRUCTION = (signalPoints, isAnomalous, thresholdPercentile = 99) => {
  // Simulate reconstruction:
  // Normal signals reconstruct closely (low residual error)
  // Anomalous signals retain un-reconstructed high frequency spikes (high residual error)
  let totalMse = 0;
  const reconstructedPoints = signalPoints.map(pt => {
    let recY = pt.y;
    if (isAnomalous) {
      // Autoencoder smooths out high frequency anomaly spikes (fails to reconstruct)
      recY = pt.y * 0.25; // High reconstruction residual
    } else {
      recY = pt.y + (Math.random() - 0.5) * 0.08; // Small reconstruction noise
    }
    const diff = pt.y - recY;
    totalMse += diff * diff;
    return { x: pt.x, y: Number(recY.toFixed(3)) };
  });

  const mse = totalMse / signalPoints.length;
  // Threshold T: Normal MSE 99th percentile is approx 0.02
  const threshold = 0.02 * (thresholdPercentile / 99);
  const isAlert = mse > threshold;

  return {
    mse: mse.toFixed(4),
    threshold: threshold.toFixed(4),
    isAlert,
    reconstructedPoints
  };
};

export const PYTORCH_1DCNN_AUTOENCODER_CODE = `# ============================================================================
# TIME SERIES ANOMALY DETECTION USING 1D CNN AUTOENCODER (PYTORCH)
# ============================================================================

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

# ── 1. Define 1D Convolutional Autoencoder Architecture ──────────────────────
class Conv1DAutoencoder(nn.Module):
    def __init__(self, sequence_length=100):
        super().__init__()
        # Encoder: Compress (B, 1, 100) -> Bottleneck Latent Space (B, 32, 25)
        self.encoder = nn.Sequential(
            nn.Conv1d(in_channels=1, out_channels=16, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool1d(kernel_size=2),  # Shape: (B, 16, 50)
            nn.Conv1d(in_channels=16, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool1d(kernel_size=2)   # Shape: (B, 32, 25) [Bottleneck Latent]
        )

        # Decoder: Reconstruct (B, 32, 25) -> Original Signal (B, 1, 100)
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(in_channels=32, out_channels=16, kernel_size=2, stride=2), # (B, 16, 50)
            nn.ReLU(inplace=True),
            nn.ConvTranspose1d(in_channels=16, out_channels=1, kernel_size=2, stride=2)   # (B, 1, 100)
        )

    def forward(self, x):
        latent = self.encoder(x)
        reconstruction = self.decoder(latent)
        return reconstruction

# ── 2. Synthetic Time Series Data Generator ──────────────────────────────────
def generate_signals(num_samples=1000, sequence_length=100, is_anomalous=False):
    x_range = np.linspace(-8 * np.pi, 8 * np.pi, sequence_length)
    signals = []
    for _ in range(num_samples):
        a1, a2, a3 = np.random.uniform(-2, 2, 3)
        f1, f2, f3 = np.random.uniform(-2, 2, 3)
        signal = a1 * np.sin(f1 * x_range) + a2 * np.sin(f2 * x_range) + a3 * np.sin(f3 * x_range)
        if is_anomalous:
            a_anom = np.random.choice([-4, 4])
            f_anom = np.random.uniform(5, 10)
            signal += a_anom * np.sin(f_anom * x_range)
        signals.append(signal)
    return torch.tensor(np.array(signals), dtype=torch.float32).unsqueeze(1)

# Generate Normal Training Data & Anomalous Test Data
train_normal = generate_signals(num_samples=1000, is_anomalous=False)
test_anomalies = generate_signals(num_samples=200, is_anomalous=True)

# ── 3. Train Autoencoder ONLY on Normal Data ────────────────────────────────
model = Conv1DAutoencoder(sequence_length=100)
criterion = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=1e-3)

model.train()
for epoch in range(15):
    optimizer.zero_grad()
    reconstructed = model(train_normal)
    loss = criterion(reconstructed, train_normal)
    loss.backward()
    optimizer.step()

# ── 4. Calculate 99th Percentile Threshold & Predict Anomalies ───────────────
model.eval()
with torch.no_grad():
    normal_rec = model(train_normal)
    normal_mse = torch.mean((train_normal - normal_rec) ** 2, dim=[1, 2]).numpy()
    threshold = np.percentile(normal_mse, 99)

    anom_rec = model(test_anomalies)
    anom_mse = torch.mean((test_anomalies - anom_rec) ** 2, dim=[1, 2]).numpy()
    detected_anomalies = np.sum(anom_mse > threshold)

print(f"99th Percentile Anomaly Threshold T: {threshold:.5f}")
print(f"Detected Anomalies: {detected_anomalies} / {len(test_anomalies)} ({detected_anomalies/len(test_anomalies)*100:.1f}%)")
`;
