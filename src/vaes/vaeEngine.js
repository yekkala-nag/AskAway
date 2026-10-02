// ============================================================================
// VARIATIONAL AUTOENCODERS (VAEs) ENGINE
// Theory, ELBO Derivation & Reparameterization Trick
// Based on Kingma & Welling (2013)
// ============================================================================

export const VAE_VS_VANILLA_COMPARISON = [
  {
    feature: "Latent Space Structure",
    vanilla: "Discrete unconstrained points. Unregularized, full of empty gaps and holes.",
    vae: "Continuous probability distributions N(μ, σ²). Smoothly regularized around N(0, I).",
    impact: "VAEs allow continuous sampling & linear interpolation without generating artifacts."
  },
  {
    feature: "Encoder Output",
    vanilla: "Deterministic single latent vector z = Encoder(x).",
    vae: "Parameters of a latent probability distribution: Mean vector μ and Log Variance vector log(σ²).",
    impact: "Encodes uncertainty and ensures neighboring latent vectors produce realistic variations."
  },
  {
    feature: "Similarity Preservation",
    vanilla: "Poor. Similar inputs can map to distant points because loss only measures reconstruction.",
    vae: "High. KL divergence forces representations into overlapping Gaussian clusters.",
    impact: "Geometric distances in latent space represent semantic similarities."
  },
  {
    feature: "Generative Ability",
    vanilla: "Fails. Sampling random points z ~ Uniform/Normal produces low-quality garbage.",
    vae: "Excellent. Sampling z ~ N(0, I) yields realistic new synthetic data samples.",
    impact: "VAEs serve as foundational generative models for computer vision and generative AI."
  }
];

export const CALCULATE_ELBO = (mu, sigma, mseLoss) => {
  // KL Divergence for 1D Gaussian vs N(0, 1): -0.5 * (1 + log(sigma^2) - mu^2 - sigma^2)
  const varVal = Math.pow(sigma, 2);
  const logVar = Math.log(Math.max(varVal, 1e-8));
  const klDivergence = -0.5 * (1 + logVar - Math.pow(mu, 2) - varVal);
  const reconstructionLoss = mseLoss;
  const elboValue = -(reconstructionLoss + klDivergence); // Maximizing ELBO = Minimizing Loss
  const totalLoss = reconstructionLoss + klDivergence;

  return {
    mu,
    sigma,
    varVal: varVal.toFixed(4),
    logVar: logVar.toFixed(4),
    klDivergence: Math.max(0, klDivergence).toFixed(4),
    reconstructionLoss: reconstructionLoss.toFixed(4),
    totalLoss: totalLoss.toFixed(4),
    elboValue: elboValue.toFixed(4)
  };
};

export const REPARAMETERIZATION_STEPS = [
  {
    step: 1,
    title: "The Problem: Non-Differentiable Sampling",
    description: "In direct sampling z ~ N(μ, σ²), the random node z breaks backpropagation gradient flow. Gradients cannot pass from Decoder back to Encoder parameters.",
    formula: "z \\sim \\mathcal{N}(\\mu, \\sigma^2) \\quad \\Rightarrow \\quad \\frac{\\partial z}{\\partial \\mu} \\text{ is undefined (stochastic node)}",
    status: "🛑 Backprop Blocked"
  },
  {
    step: 2,
    title: "The Trick: Isolate Stochasticity via Auxiliary Noise",
    description: "Sample independent standard normal noise ε ~ N(0, I) outside the network computational graph.",
    formula: "\\epsilon \\sim \\mathcal{N}(0, I)",
    status: "⚙️ External Random Noise"
  },
  {
    step: 3,
    title: "Deterministic Linear Transformation",
    description: "Shift and scale the noise using predicted Mean μ and Standard Deviation σ.",
    formula: "z = \\mu + \\sigma \\odot \\epsilon",
    status: "✅ Differentiable Computation Graph"
  },
  {
    step: 4,
    title: "Full Gradient Flow",
    description: "Now ∂z/∂μ = 1 and ∂z/∂σ = ε. Gradients flow smoothly through μ and σ during PyTorch loss.backward().",
    formula: "\\frac{\\partial z}{\\partial \\mu} = 1, \\quad \\frac{\\partial z}{\\partial \\sigma} = \\epsilon",
    status: "🚀 End-to-End Backprop Enabled"
  }
];

export const PYTORCH_VAE_CODE = `# ============================================================================
# PYTORCH VARIATIONAL AUTOENCODER (VAE) IMPLEMENTATION
# Includes Encoder, Decoder, Reparameterization Trick & ELBO Loss
# ============================================================================

import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim=784, hidden_dim=400, latent_dim=20):
        super(VAE, self).__init__()
        
        # Encoder Networks
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)      # Predict Mean vector mu
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)  # Predict Log-Variance vector log(sigma^2)
        
        # Decoder Networks
        self.fc3 = nn.Linear(latent_dim, hidden_dim)
        self.fc4 = nn.Linear(hidden_dim, input_dim)

    def encode(self, x):
        h1 = F.relu(self.fc1(x))
        return self.fc_mu(h1), self.fc_logvar(h1)

    def reparameterize(self, mu, logvar):
        """
        Reparameterization Trick: z = mu + std * epsilon
        Allows backpropagation through stochastic node
        """
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std) # Auxiliary noise epsilon ~ N(0, I)
        return mu + eps * std

    def decode(self, z):
        h3 = F.relu(self.fc3(z))
        return torch.sigmoid(self.fc4(h3))

    def forward(self, x):
        mu, logvar = self.encode(x.view(-1, 784))
        z = self.reparameterize(mu, logvar)
        return self.decode(z), mu, logvar

def vae_loss_function(recon_x, x, mu, logvar):
    """
    ELBO Loss = Reconstruction Loss + KL Divergence Regularization
    """
    # 1. Reconstruction Loss (Binary Cross-Entropy or MSE)
    BCE = F.binary_cross_entropy(recon_x, x.view(-1, 784), reduction='sum')
    
    # 2. KL Divergence: 0.5 * sum(1 + log(sigma^2) - mu^2 - sigma^2)
    KLD = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    
    return BCE + KLD, BCE, KLD

# Example Usage
model = VAE()
x = torch.randn(64, 784) # Batch of 64 images
recon_x, mu, logvar = model(x)
loss, bce, kld = vae_loss_function(recon_x, x, mu, logvar)
print(f"Total ELBO Loss: {loss.item():.2f} (BCE: {bce.item():.2f}, KLD: {kld.item():.2f})")
`;
