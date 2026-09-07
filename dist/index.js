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

// Static array of signal names to avoid per-invocation allocation
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
    // Fast indexed loop avoiding array allocation, function calls, & iterator overhead
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (typeof raw !== 'number' || raw !== raw) {
            result[name] = 0;
        }
        else {
            // Clamp to [0, 1] without Math.max/min function call overhead
            result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw;
        }
    }
    return result;
}

function aggregateScore(signals, weights) {
    let sum = 0;
    // Fast-path for defaultWeights where total weight sum is pre-calculated to 1.0
    if (weights === defaultWeights) {
        for (const key in weights) {
            const k = key;
            sum += (signals[k] ?? 0) * weights[k];
        }
        return sum;
    }
    let weightSum = 0;
    // Direct property iteration avoiding Object.keys array allocation
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
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
    // Fast-path for defaultWeights where total weight sum is 1.0
    if (weights === defaultWeights) {
        weightSum = 1;
    }
    else {
        for (const key in weights) {
            weightSum += weights[key];
        }
    }
    const denominator = weightSum || 1;
    // Direct property iteration avoiding Object.keys array allocation
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        breakdown[k] = (v * w) / denominator;
    }
    return breakdown;
}

const EMPTY_WEIGHTS = {};
function computeTrust(signals, weights = EMPTY_WEIGHTS) {
    // Fast path: avoid Object.keys() allocation when default or empty weights are passed
    const mergedWeights = weights === EMPTY_WEIGHTS ||
        weights === defaultWeights ||
        Object.keys(weights).length === 0
        ? defaultWeights
        : { ...defaultWeights, ...weights };
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
