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
 * Normalizes trust signals by clamping raw values to [0, 1].
 * Lifts `SIGNAL_NAMES` array to module scope to avoid allocating an array on every call.
 */
function normalizeSignals(signals) {
    const result = {};
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
        }
        else if (raw <= 0) {
            result[name] = 0;
        }
        else if (raw >= 1) {
            result[name] = 1;
        }
        else {
            result[name] = raw;
        }
    }
    return result;
}

/**
 * Aggregates weighted scores into a final normalized score.
 * Uses index-based loop over weight keys to eliminate iterator allocation overhead.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    const keys = Object.keys(weights);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const w = weights[key];
        const v = signals[key] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

/**
 * Computes individual score contribution breakdown per trust signal.
 * Uses index-based loop over weight keys to avoid intermediate array allocations and closure calls.
 */
function explainScore(signals, weights) {
    const breakdown = {};
    const keys = Object.keys(weights);
    let weightSum = 0;
    for (let i = 0; i < keys.length; i++) {
        weightSum += weights[keys[i]];
    }
    const divisor = weightSum || 1;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const w = weights[key];
        const v = signals[key] ?? 0;
        breakdown[key] = (v * w) / divisor;
    }
    return breakdown;
}

/**
 * Computes trust score and breakdown for input signals.
 * Avoids object allocation when custom weights are omitted or empty.
 */
function computeTrust(signals, weights) {
    const mergedWeights = weights && Object.keys(weights).length > 0
        ? { ...defaultWeights, ...weights }
        : defaultWeights;
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
