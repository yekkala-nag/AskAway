// ============================================================================
// LINEAR REGRESSION, COST FUNCTION & GRADIENT DESCENT ENGINE
// ============================================================================

// Mark's House Pricing Dataset (Size in sq ft vs Price in $1000s)
export const HOUSE_PRICE_DATASET = [
  { size: 1000, price: 170, label: "House 1 (1000 sq ft)" },
  { size: 1500, price: 210, label: "House 2 (1500 sq ft)" },
  { size: 2000, price: 300, label: "House 3 (2000 sq ft)" }
];

export const TARGET_MARK_HOUSE_SIZE = 2400; // Mark's 2400 sq ft house

export const CALCULATE_LINE_FIT = (slopeW, interceptB) => {
  // Line equation: y_hat = w * x + b
  let totalMse = 0;
  let totalMae = 0;

  const points = HOUSE_PRICE_DATASET.map(house => {
    // x in thousands of sq ft for scale stability
    const xSqFtK = house.size / 1000;
    const yHat = slopeW * xSqFtK + interceptB; // Predicted price in $1000s
    const diff = house.price - yHat;
    totalMse += diff * diff;
    totalMae += Math.abs(diff);

    return {
      size: house.size,
      actualPrice: house.price,
      predictedPrice: Number(yHat.toFixed(1)),
      residual: Number(diff.toFixed(1))
    };
  });

  const n = HOUSE_PRICE_DATASET.length;
  const mse = totalMse / n;
  const mae = totalMae / n;

  // Prediction for Mark's 2,400 sq ft house
  const markPredPrice = slopeW * (TARGET_MARK_HOUSE_SIZE / 1000) + interceptB;

  return {
    slopeW,
    interceptB,
    mse: Number(mse.toFixed(1)),
    mae: Number(mae.toFixed(1)),
    markPredPrice: Number(markPredPrice.toFixed(1)),
    points
  };
};

export const GENERATE_LOSS_CURVE_DATA = (slopeW = 69) => {
  // Generate loss parabolic curve J(b) for intercept b ranging from 0 to 200
  const data = [];
  for (let b = 0; b <= 200; b += 10) {
    const fit = CALCULATE_LINE_FIT(slopeW, b);
    data.push({ interceptB: b, mse: fit.mse, mae: fit.mae });
  }
  return data;
};

export const GRADIENT_DESCENT_STEP = (currentW, currentB, learningRateAlpha = 0.05) => {
  // Gradient calculation:
  // dJ/dw = (-2/N) * sum( (y_i - y_hat_i) * x_i )
  // dJ/db = (-2/N) * sum( (y_i - y_hat_i) )
  const n = HOUSE_PRICE_DATASET.length;
  let dJ_dw = 0;
  let dJ_db = 0;

  HOUSE_PRICE_DATASET.forEach(house => {
    const xK = house.size / 1000;
    const yHat = currentW * xK + currentB;
    const diff = house.price - yHat;
    dJ_dw += -2 * diff * xK;
    dJ_db += -2 * diff;
  });

  dJ_dw /= n;
  dJ_db /= n;

  const nextW = currentW - learningRateAlpha * dJ_dw;
  const nextB = currentB - learningRateAlpha * dJ_db;

  return {
    nextW: Number(nextW.toFixed(2)),
    nextB: Number(nextB.toFixed(2)),
    dJ_dw: Number(dJ_dw.toFixed(2)),
    dJ_db: Number(dJ_db.toFixed(2))
  };
};

export const GET_OPTIMAL_WEIGHTS = () => {
  // Analytical solution using Normal Equation: w = (X^T X)^-1 X^T y
  // For simple linear regression with one feature:
  // w = sum((x_i - x_mean)(y_i - y_mean)) / sum((x_i - x_mean)^2)
  // b = y_mean - w * x_mean
  const n = HOUSE_PRICE_DATASET.length;
  const xValues = HOUSE_PRICE_DATASET.map(h => h.size / 1000);
  const yValues = HOUSE_PRICE_DATASET.map(h => h.price);

  const xMean = xValues.reduce((a, b) => a + b, 0) / n;
  const yMean = yValues.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += (xValues[i] - xMean) ** 2;
  }

  const optimalW = numerator / denominator;
  const optimalB = yMean - optimalW * xMean;

  return {
    optimalW: Number(optimalW.toFixed(2)),
    optimalB: Number(optimalB.toFixed(2)),
  };
};

export const GENERATE_LOSS_SURFACE_DATA = (wRange = { min: 0, max: 150, step: 5 }, bRange = { min: 0, max: 200, step: 10 }) => {
  // Generate 2D loss surface J(w, b) for both MSE and MAE
  const data = [];
  for (let w = wRange.min; w <= wRange.max; w += wRange.step) {
    for (let b = bRange.min; b <= bRange.max; b += bRange.step) {
      const fit = CALCULATE_LINE_FIT(w, b);
      data.push({ w, b, mse: fit.mse, mae: fit.mae });
    }
  }
  return data;
};

export const PYTHON_LINEAR_REGRESSION_CODE = `# ============================================================================
# LINEAR REGRESSION, COST FUNCTION & GRADIENT DESCENT FROM SCRATCH
# ============================================================================

import numpy as np

# ── 1. Dataset: House Size (in 1000 sq ft) vs Price (in $1000s) ─────────────
X = np.array([1.0, 1.5, 2.0])   # 1000, 1500, 2000 sq ft
y = np.array([170, 210, 300])   # $170k, $210k, $300k

# ── 2. Cost Functions: Mean Squared Error (MSE) & Mean Absolute Error (MAE) ─
def compute_mse_cost(X, y, w, b):
    """Calculate Mean Squared Error J(w, b) = (1/N) * sum((y - y_hat)^2)"""
    y_hat = w * X + b
    return np.mean((y - y_hat) ** 2)

def compute_mae_cost(X, y, w, b):
    """Calculate Mean Absolute Error (1/N) * sum(|y - y_hat|)"""
    y_hat = w * X + b
    return np.mean(np.abs(y - y_hat))

# ── 3. Gradient Descent Optimization Algorithm ────────────────────────────────
def gradient_descent(X, y, w_init=0.0, b_init=0.0, alpha=0.01, iterations=1000):
    """
    Iterative weight update:
    w = w - alpha * (dJ/dw)
    b = b - alpha * (dJ/db)
    """
    w, b = w_init, b_init
    N = len(X)

    for step in range(iterations):
        y_hat = w * X + b
        error = y - y_hat

        # Compute partial derivatives
        dj_dw = (-2 / N) * np.sum(error * X)
        dj_db = (-2 / N) * np.sum(error)

        # Update weights and bias
        w -= alpha * dj_dw
        b -= alpha * dj_db

        if step % 200 == 0:
            mse = compute_mse_cost(X, y, w, b)
            print(f"Step {step:4d} | w: {w:.2f}, b: {b:.2f} | MSE Cost: {mse:.2f}")

    return w, b

# Train Linear Regression Model
optimal_w, optimal_b = gradient_descent(X, y, alpha=0.05, iterations=1000)

# Predict price for Mark's 2,400 sq ft house (X = 2.4)
mark_house_size = 2.4
predicted_price = optimal_w * mark_house_size + optimal_b

print("\\n" + "="*50)
print(f"Optimal Weight (Slope w): {optimal_w:.2f}")
print(f"Optimal Bias (Intercept b): {optimal_b:.2f}")
print(f"Predicted Price for Mark's 2,400 sq ft house: \${predicted_price:.1f}k (\${predicted_price*1000:,.0f})")
`;
