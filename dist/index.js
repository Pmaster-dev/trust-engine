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

// Hoisted constant array to avoid re-allocating array on every function invocation.
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
 * Normalizes input trust signals to values within [0, 1].
 * Performance optimization: Uses module-level signal name array to avoid allocations per call.
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
 * Computes a weighted average score from normalized signals.
 * Performance optimization: Iterates over weight keys directly with for...in to avoid intermediate Object.keys() array allocations.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (const key in weights) {
        const signalKey = key;
        const w = weights[signalKey];
        const v = signals[signalKey] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

/**
 * Returns a breakdown of score contributions by signal.
 * Performance optimization: Uses direct for...in loops instead of Object.values().reduce() and Object.keys() to avoid temporary array allocations and callback overhead.
 */
function explainScore(signals, weights) {
    const breakdown = {};
    let weightSum = 0;
    for (const key in weights) {
        weightSum += weights[key];
    }
    const denominator = weightSum || 1;
    for (const key in weights) {
        const signalKey = key;
        const w = weights[signalKey];
        const v = signals[signalKey] ?? 0;
        breakdown[signalKey] = (v * w) / denominator;
    }
    return breakdown;
}

function computeTrust(signals, weights = {}) {
    const mergedWeights = {
        ...defaultWeights,
        ...weights
    };
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
