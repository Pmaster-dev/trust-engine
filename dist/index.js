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

// Cache array of signal names outside function to avoid allocation overhead per call
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
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
        }
        else {
            // clamp to [0,1]
            result[name] = Math.max(0, Math.min(1, raw));
        }
    }
    return result;
}

function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (const key of Object.keys(weights)) {
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
    const keys = Object.keys(weights);
    let weightSum = 0;
    for (let i = 0; i < keys.length; i++) {
        weightSum += weights[keys[i]];
    }
    if (weightSum === 0)
        weightSum = 1;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const w = weights[key];
        const v = signals[key] ?? 0;
        breakdown[key] = (v * w) / weightSum;
    }
    return breakdown;
}

function computeTrust(signals, weights) {
    // Fast path: reuse defaultWeights directly if no custom weights passed or if empty
    let mergedWeights;
    if (!weights || Object.keys(weights).length === 0) {
        mergedWeights = defaultWeights;
    }
    else {
        mergedWeights = {
            ...defaultWeights,
            ...weights
        };
    }
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
