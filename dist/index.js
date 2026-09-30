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

const SIGNAL_NAMES = [
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
 * Normalizes trust signals by clamping valid numbers to [0, 1] and defaulting missing/NaN values to 0.
 * Performance Optimization: Uses static SIGNAL_NAMES array to avoid array allocations on every call.
 */
function normalizeSignals(signals) {
    const result = {};
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
        }
        else {
            // Clamp to [0, 1]
            result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        }
    }
    return result;
}

/**
 * Aggregates normalized signals into a weighted average trust score.
 * Performance Optimization: Iterates over static SIGNAL_NAMES array to avoid Object.keys() allocation.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        const v = signals[key] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

/**
 * Calculates contribution breakdown for each trust signal.
 * Performance Optimization: Replaces Object.values().reduce() and Object.keys() array allocations
 * with direct loop iterations over static SIGNAL_NAMES.
 */
function explainScore(signals, weights) {
    const breakdown = {};
    let weightSum = 0;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        weightSum += weights[SIGNAL_NAMES[i]] ?? 0;
    }
    const divisor = weightSum || 1;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        const v = signals[key] ?? 0;
        breakdown[key] = (v * w) / divisor;
    }
    return breakdown;
}

/**
 * Computes trust score, score breakdown, and final weights.
 * Performance Optimization: Avoids object copy allocation when no custom weights are supplied.
 */
function computeTrust(signals, weights = {}) {
    const mergedWeights = Object.keys(weights).length === 0
        ? defaultWeights
        : {
            ...defaultWeights,
            ...weights
        };
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { SIGNAL_NAMES, computeTrust };
//# sourceMappingURL=index.js.map
