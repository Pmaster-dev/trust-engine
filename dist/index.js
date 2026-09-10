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
 * Normalizes trust signals to [0, 1] range.
 * Uses module-scoped constant array for signal names to prevent array allocation on every function call.
 */
function normalizeSignals(signals) {
    const result = {};
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
            continue;
        }
        // clamp to [0,1]
        result[name] = Math.max(0, Math.min(1, raw));
    }
    return result;
}

/**
 * Calculates the weighted aggregate trust score and weight sum.
 * Optimized using `for...in` loop to avoid Object.keys array allocations.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return { score: 0, weightSum: 0 };
    return { score: sum / weightSum, weightSum };
}

/**
 * Calculates the score breakdown per signal.
 * Optimized to avoid Object.values/Object.keys array allocations and callback closure allocations.
 */
function explainScore(signals, weights, weightSum) {
    const breakdown = {};
    let denominator = weightSum;
    if (denominator === undefined) {
        denominator = 0;
        for (const key in weights) {
            denominator += weights[key];
        }
    }
    if (denominator === 0)
        denominator = 1;
    for (const key in weights) {
        const signalKey = key;
        const w = weights[signalKey];
        const v = signals[signalKey] ?? 0;
        breakdown[signalKey] = (v * w) / denominator;
    }
    return breakdown;
}

function computeTrust(signals, weights = {}) {
    const mergedWeights = Object.keys(weights).length === 0
        ? defaultWeights
        : {
            ...defaultWeights,
            ...weights
        };
    const normalized = normalizeSignals(signals);
    const { score, weightSum } = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights, weightSum);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
