const defaultWeights = {
    identity: 0.18,
    behavior: 0.12,
    reputation: 0.14,
    contribution: 0.1,
    consistency: 0.1,
    accessibility: 0.12,
    security: 0.1,
    governance: 0.07,
    intent: 0.07
};

// Optimization: Lift signal name array to module scope to avoid re-allocating an array on every call
const ALL_SIGNAL_NAMES = [
    'identity',
    'behavior',
    'reputation',
    'contribution',
    'consistency',
    'accessibility',
    'security',
    'governance',
    'intent'
];
/**
 * Normalizes input signals into clamped values between [0, 1].
 *
 * Optimization: Uses module-scoped constant array and indexed loop to prevent array allocations.
 */
function normalizeSignals(signals) {
    const result = {};
    for (let i = 0; i < ALL_SIGNAL_NAMES.length; i++) {
        const name = ALL_SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
            continue;
        }
        // clamp to [0,1]
        result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    }
    return result;
}

/**
 * Explains trust score by calculating normalized per-signal weight contribution breakdown.
 *
 * Optimization: Accepts an optional pre-calculated `weightSum` to avoid re-summing weights.
 * Iterates directly without allocating `Object.values()` or `Object.keys()` arrays.
 */
function explainScore(signals, weights, weightSum) {
    const breakdown = {};
    // Optimization: Compute weightSum only when not pre-provided
    if (weightSum === undefined) {
        weightSum = 0;
        for (const key in weights) {
            weightSum += weights[key];
        }
    }
    const divisor = weightSum || 1;
    // Optimization: Direct loop avoids Object.keys() array allocation
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        breakdown[k] = (v * w) / divisor;
    }
    return breakdown;
}

/**
 * Computes the aggregate trust score and breakdown for a given set of signals.
 *
 * Optimization:
 * Avoids cloning `defaultWeights` when custom weights are omitted and pre-calculates
 * weightSum = 1.0 for default weights. Computes score by accumulating breakdown values
 * in a single pass to eliminate redundant iterations and intermediate array allocations.
 */
function computeTrust(signals, weights = {}) {
    // Optimization: Skip object spread if custom weights are empty to avoid object copy
    const hasCustomWeights = weights && Object.keys(weights).length > 0;
    let mergedWeights;
    let weightSum;
    if (hasCustomWeights) {
        mergedWeights = { ...defaultWeights, ...weights };
    }
    else {
        mergedWeights = defaultWeights;
        // Default weights sum to 1.0; pass pre-calculated weightSum to skip loop in explainScore
        weightSum = 1.0;
    }
    const normalized = normalizeSignals(signals);
    const breakdown = explainScore(normalized, mergedWeights, weightSum);
    // Sum breakdown scores directly to get overall score without re-calculating (score = sum of breakdown)
    let score = 0;
    for (const key in breakdown) {
        score += breakdown[key];
    }
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
