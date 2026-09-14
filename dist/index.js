const defaultWeights = {
    identity: 0.18,
    behavior: 0.12,
    reputation: 0.14,
    contribution: 0.10,
    consistency: 0.10,
    accessibility: 0.12,
    security: 0.10,
    governance: 0.07,
    intent: 0.07,
};

// Pre-defined signal names list to avoid re-allocating arrays or querying object keys per execution
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
 * Computes the overall trust score, breakdown, and weights.
 *
 * Performance Optimization:
 * Single-pass computation combining signal normalization, weighted aggregation,
 * and breakdown calculations. Replaces multiple object spreads, `Object.keys`,
 * `Object.values`, array iterations, and intermediate dictionary creations.
 */
function computeTrust(signals, weights = {}) {
    const mergedWeights = {
        ...defaultWeights,
        ...weights
    };
    const breakdown = {};
    let weightedSum = 0;
    let weightSum = 0;
    // Single pass loop over predefined signal names
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        let val = 0;
        if (raw != null && !Number.isNaN(raw)) {
            val = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        }
        const weight = mergedWeights[name];
        const weightedVal = val * weight;
        weightedSum += weightedVal;
        weightSum += weight;
        breakdown[name] = weightedVal;
    }
    const score = weightSum === 0 ? 0 : weightedSum / weightSum;
    const normalizer = weightSum === 0 ? 1 : weightSum;
    // Scale breakdown values by total weight sum
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        breakdown[name] = breakdown[name] / normalizer;
    }
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
