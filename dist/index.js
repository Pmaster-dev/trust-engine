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
 * Normalizes raw trust signal inputs into values clamped between 0 and 1.
 * Performance note: SIGNAL_NAMES is static at module scope to prevent heap allocation per call.
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
            result[name] = Math.max(0, Math.min(1, raw));
        }
    }
    return result;
}

/**
 * Calculates the contribution breakdown of each signal to the overall score.
 * Performance note: Uses for...in loops and reciprocal multiplication (invWeightSum)
 * to avoid Object.keys/Object.values array allocations and per-item divisions.
 */
function explainScore(signals, weights) {
    const breakdown = {};
    let weightSum = 0;
    for (const key in weights) {
        weightSum += weights[key];
    }
    const invWeightSum = weightSum === 0 ? 0 : 1 / weightSum;
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        breakdown[k] = v * w * invWeightSum;
    }
    return breakdown;
}

/**
 * Computes trust score and breakdown from raw signals and optional weight overrides.
 * Performance note: Reuses defaultWeights reference when no overrides are passed,
 * and derives total score directly from breakdown components to eliminate duplicate loops.
 */
function computeTrust(signals, weights = {}) {
    const mergedWeights = Object.keys(weights).length === 0
        ? defaultWeights
        : {
            ...defaultWeights,
            ...weights
        };
    const normalized = normalizeSignals(signals);
    const breakdown = explainScore(normalized, mergedWeights);
    let score = 0;
    for (const key in breakdown) {
        score += breakdown[key];
    }
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
