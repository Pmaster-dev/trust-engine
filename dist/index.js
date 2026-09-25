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

// Lift signal names array to module scope to prevent array re-allocation on every normalize call.
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
 * Normalizes trust signals, clamping valid values to [0, 1] and default missing/NaN values to 0.
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
 * Calculates weighted average trust score.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    // Iterate directly over weight keys to avoid Object.keys() array allocation on each call.
    for (const key in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, key)) {
            const signalKey = key;
            const w = weights[signalKey];
            const v = signals[signalKey] ?? 0;
            sum += v * w;
            weightSum += w;
        }
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

/**
 * Explains trust score breakdown per signal.
 */
function explainScore(signals, weights) {
    const breakdown = {};
    // Compute total weight sum without Object.values() array allocation
    let weightSum = 0;
    for (const key in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, key)) {
            weightSum += weights[key];
        }
    }
    const effectiveWeightSum = weightSum || 1;
    // Compute breakdown without Object.keys() array allocation
    for (const key in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, key)) {
            const signalKey = key;
            const w = weights[signalKey];
            const v = signals[signalKey] ?? 0;
            breakdown[signalKey] = (v * w) / effectiveWeightSum;
        }
    }
    return breakdown;
}

/**
 * Computes overall trust score, breakdown, and merged weights for the given signals.
 */
function computeTrust(signals, weights = {}) {
    // Avoid object spread allocation when no custom weights are provided
    let mergedWeights = defaultWeights;
    for (const k in weights) {
        if (Object.prototype.hasOwnProperty.call(weights, k)) {
            mergedWeights = {
                ...defaultWeights,
                ...weights
            };
            break;
        }
    }
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
