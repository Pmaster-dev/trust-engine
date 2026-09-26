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

function normalizeSignals(signals) {
    const result = {};
    const names = [
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
    for (const name of names) {
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
 * Computes the weighted aggregate trust score and total weight sum.
 * Optimized using `for..in` to avoid allocating an intermediate `Object.keys` array.
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
    const score = weightSum === 0 ? 0 : sum / weightSum;
    return { score, weightSum };
}

/**
 * Calculates breakdown scores for each signal based on normalized values and weights.
 * Optimized to avoid array allocations (`Object.values`, `Object.keys`, `reduce`)
 * by accepting an optional pre-computed `weightSum` and iterating using `for..in`.
 */
function explainScore(signals, weights, precomputedWeightSum) {
    const breakdown = {};
    let totalWeight = precomputedWeightSum;
    if (totalWeight === undefined) {
        totalWeight = 0;
        for (const key in weights) {
            totalWeight += weights[key] ?? 0;
        }
    }
    const divisor = totalWeight || 1;
    for (const key in weights) {
        const signalKey = key;
        const w = weights[signalKey];
        const v = signals[signalKey] ?? 0;
        breakdown[signalKey] = (v * w) / divisor;
    }
    return breakdown;
}

function computeTrust(signals, weights) {
    // Avoid cloning defaultWeights when no custom overrides are provided
    const mergedWeights = weights && Object.keys(weights).length > 0
        ? { ...defaultWeights, ...weights }
        : defaultWeights;
    const normalized = normalizeSignals(signals);
    const { score, weightSum } = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights, weightSum);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
