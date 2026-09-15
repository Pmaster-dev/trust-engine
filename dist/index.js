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
function normalizeSignals(signals) {
    const result = {};
    for (const name of SIGNAL_NAMES) {
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
        return 0;
    return sum / weightSum;
}

function explainScore(signals, weights) {
    const breakdown = {};
    let weightSum = 0;
    for (const key in weights) {
        weightSum += weights[key];
    }
    const denominator = weightSum || 1;
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        breakdown[k] = (v * w) / denominator;
    }
    return breakdown;
}

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
