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

// Hoisted array avoids re-allocating array on every function call
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
function normalizeSignals(signals) {
    const result = {};
    // Index loop with explicit clamping avoids Math.max/Math.min call overhead
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
        }
        else if (raw < 0) {
            result[name] = 0;
        }
        else if (raw > 1) {
            result[name] = 1;
        }
        else {
            result[name] = raw;
        }
    }
    return result;
}

function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    // Direct for...in loop avoids Object.keys array allocation on every call
    for (const key in weights) {
        const w = weights[key];
        const v = signals[key] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

function explainScore(signals, weights) {
    const breakdown = {};
    let weightSum = 0;
    // Single pass calculation of weightSum and breakdown avoids Object.values/Object.keys array allocations
    for (const key in weights) {
        weightSum += weights[key];
    }
    const effectiveWeightSum = weightSum || 1;
    for (const key in weights) {
        const signalKey = key;
        const w = weights[signalKey];
        const v = signals[signalKey] ?? 0;
        breakdown[signalKey] = (v * w) / effectiveWeightSum;
    }
    return breakdown;
}

function computeTrust(signals, weights) {
    // Fast path: avoid object spread when no custom weights are provided
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
