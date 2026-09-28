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
 * Normalizes input signal values to [0, 1] range.
 * Uses module-constant SIGNAL_NAMES to avoid per-call array allocations
 * and direct branchless/ternary clamping instead of Math.max/Math.min function calls.
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
            // Clamp to [0, 1] without Math.max/Math.min function call overhead
            result[name] = raw <= 0 ? 0 : raw >= 1 ? 1 : raw;
        }
    }
    return result;
}

/**
 * Aggregates normalized signal values into a weighted score.
 * Iterates over static SIGNAL_NAMES to avoid Object.keys() array allocations.
 */
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        if (w !== 0) {
            const v = signals[key] ?? 0;
            sum += v * w;
            weightSum += w;
        }
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

/**
 * Explains the score breakdown per signal.
 * Replaces Object.values().reduce() and Object.keys() allocations
 * with direct iteration over SIGNAL_NAMES.
 */
function explainScore(signals, weights, precomputedWeightSum) {
    const breakdown = {};
    let weightSum = precomputedWeightSum;
    if (weightSum == null) {
        weightSum = 0;
        for (let i = 0; i < SIGNAL_NAMES.length; i++) {
            weightSum += weights[SIGNAL_NAMES[i]] ?? 0;
        }
    }
    const effectiveWeightSum = weightSum || 1;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        const v = signals[key] ?? 0;
        breakdown[key] = (v * w) / effectiveWeightSum;
    }
    return breakdown;
}

/**
 * Computes trust score and breakdown for a set of trust signals.
 * Optimizes performance by avoiding object copying when default weights are used.
 */
function computeTrust(signals, weights) {
    // Avoid allocating merged weights object when custom weights are not provided
    const mergedWeights = !weights || Object.keys(weights).length === 0
        ? defaultWeights
        : { ...defaultWeights, ...weights };
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { SIGNAL_NAMES, computeTrust };
//# sourceMappingURL=index.js.map
