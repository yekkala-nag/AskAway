// ============================================================================
// KERAS 3.0 MULTI-BACKEND DEEP LEARNING ENGINE
// Supporting PyTorch, JAX, and TensorFlow Backends + End-to-End NMT Project
// ============================================================================

export const BACKEND_COMPARISON_MATRIX = [
  {
    backend: "PyTorch (`torch`)",
    primaryUse: "Research & Production PyTorch Infrastructure Integration",
    pros: "Direct compatibility with PyTorch ecosystem, PyTorch DataLoader support, native autograd integration.",
    speedBenchmark: "1.00× (Baseline)",
    memoryUsage: "Low",
    configCode: "os.environ['KERAS_BACKEND'] = 'torch'"
  },
  {
    backend: "JAX (`jax`)",
    primaryUse: "High-Performance Accelerator Clusters (TPUs & Multi-GPU)",
    pros: "Automatic XLA compilation (jit), vectorized transforms (vmap), hardware parallelization, blazingly fast training speed.",
    speedBenchmark: "2.35× Faster (XLA JIT)",
    memoryUsage: "Optimal",
    configCode: "os.environ['KERAS_BACKEND'] = 'jax'"
  },
  {
    backend: "TensorFlow (`tensorflow`)",
    primaryUse: "Legacy Enterprise Production & TFLite / TF Serving Deployment",
    pros: "Native SavedModel format, C++ serving infrastructure, edge device deployment with TFLite.",
    speedBenchmark: "1.15× (XLA Graph)",
    memoryUsage: "Moderate",
    configCode: "os.environ['KERAS_BACKEND'] = 'tensorflow'"
  }
];

export const NMT_SAMPLE_DATASET = [
  {
    id: 1,
    sourceEn: "I'm really sorry.",
    targetEs: "Realmente lo siento.",
    tokenizedEn: [2, 34, 182, 0],
    tokenizedEs: [2, 289, 14, 18, 3]
  },
  {
    id: 2,
    sourceEn: "The rain lasted three days.",
    targetEs: "La lluvia duró tres días.",
    tokenizedEn: [3, 412, 891, 54, 120],
    tokenizedEs: [2, 9, 314, 621, 98, 142, 3]
  },
  {
    id: 3,
    sourceEn: "The refrigerator is closed.",
    targetEs: "El frigorífico está cerrado.",
    tokenizedEn: [3, 981, 8, 432],
    tokenizedEs: [2, 12, 843, 44, 219, 3]
  }
];

export const ENCODER_DECODER_FLOW_STEPS = [
  {
    step: 1,
    title: "Source Sequence Vectorization",
    description: "English source text is tokenized into integer ID sequences via TextVectorization layer.",
    tensorShape: "(batch_size, sequence_length = 50)"
  },
  {
    step: 2,
    title: "Encoder Embedding & LSTM",
    description: "Encoder passes token IDs to Embedding(output_dim=128) followed by LSTM(units=512, return_state=True).",
    output: "Outputs final hidden state (h_T) and cell state (c_T)."
  },
  {
    step: 3,
    title: "Decoder Initialization & Target Shift",
    description: "Decoder receives target text starting with 'startofseq' (SOS) placeholder. Encoder state (h_T, c_T) passed as initial_state.",
    output: "Initializes recurrent decoder memory."
  },
  {
    step: 4,
    title: "Dense Softmax Vocabulary Projection",
    description: "Decoder output passes to Dense(vocab_size=1000, activation='softmax') predicting probability distribution for next token.",
    output: "Calculated via Sparse Categorical Crossentropy Loss."
  }
];

export const KERAS3_PRODUCTION_CODE = `# ============================================================================
# END-TO-END DEEP LEARNING IN KERAS 3.0 (PYTORCH BACKEND)
# Subclassing API, Custom Layers & Serializability
# ============================================================================

import os
os.environ["KERAS_BACKEND"] = "torch"  # Configure multi-backend

import pickle
import numpy as np
import keras
from keras import layers, utils

# Set unified seed across Python, NumPy, and PyTorch in 1 line
utils.set_random_seed(42)

class Configure:
    VOCAB_SIZE: int = 1000
    MAX_LENGTH: int = 50
    SOS: str = 'startofseq'
    EOS: str = 'endofseq'

# ── 1. Custom Encoder Layer ──────────────────────────────────────────────────
@keras.saving.register_keras_serializable()
class Encoder(keras.layers.Layer):
    def __init__(self, embed_size: int = 128, **kwargs):
        super().__init__(**kwargs)
        self.embed_size = embed_size
        self.encoder_embedding = layers.Embedding(
            input_dim=Configure.VOCAB_SIZE,
            output_dim=self.embed_size,
            mask_zero=True
        )
        self.encoder_lstm = layers.LSTM(512, return_state=True)

    def call(self, inputs):
        x = self.encoder_embedding(inputs)
        encoder_outputs, *encoder_state = self.encoder_lstm(x)
        return encoder_outputs, encoder_state

    def get_config(self):
        config = {"embed_size": self.embed_size}
        return config | super().get_config()

# ── 2. Custom Decoder Layer ──────────────────────────────────────────────────
@keras.saving.register_keras_serializable()
class Decoder(keras.layers.Layer):
    def __init__(self, embed_size: int = 128, **kwargs):
        super().__init__(**kwargs)
        self.embed_size = embed_size
        self.decoder_embedding = layers.Embedding(
            input_dim=Configure.VOCAB_SIZE,
            output_dim=self.embed_size,
            mask_zero=True
        )
        self.decoder_lstm = layers.LSTM(512, return_sequences=True)

    def call(self, inputs, initial_state=None):
        x = self.decoder_embedding(inputs)
        return self.decoder_lstm(x, initial_state=initial_state)

    def get_config(self):
        config = {"embed_size": self.embed_size}
        return config | super().get_config()

# ── 3. Full NMT Model Subclass ───────────────────────────────────────────────
@keras.saving.register_keras_serializable()
class NMTModel(keras.models.Model):
    def __init__(self, embed_size: int = 128, **kwargs):
        super().__init__(**kwargs)
        self.embed_size = embed_size
        self.encoder = Encoder(self.embed_size)
        self.decoder = Decoder(self.embed_size)
        self.dense_out = layers.Dense(Configure.VOCAB_SIZE, activation='softmax')

    def call(self, inputs):
        encoder_inputs, decoder_inputs = inputs
        _, encoder_state = self.encoder(encoder_inputs)
        decoder_outputs = self.decoder(decoder_inputs, initial_state=encoder_state)
        return self.dense_out(decoder_outputs)

    def get_config(self):
        config = {"embed_size": self.embed_size}
        return config | super().get_config()

# Instantiate, Compile, and Train Model seamlessly on PyTorch backend
nmt_model = NMTModel(embed_size=128)
nmt_model.compile(
    loss='sparse_categorical_crossentropy',
    optimizer='nadam',
    metrics=['accuracy']
)

print(f"Keras 3.0 Active Backend: {keras.config.backend()}")  # Outputs: 'torch'
`;
