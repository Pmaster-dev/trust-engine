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

// Hoisted signal names array to top-level module scope to avoid per-call heap allocation
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
    // Optimization: use for...in to avoid allocating Object.keys array per invocation
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
    // Optimization: use loops instead of Object.values().reduce() and Object.keys()
    // to eliminate heap array allocations and reducer closure overhead per call
    let weightSum = 0;
    for (const key in weights) {
        weightSum += weights[key] || 0;
    }
    const divisor = weightSum || 1;
    for (const key in weights) {
        const k = key;
        const w = weights[k];
        const v = signals[k] ?? 0;
        breakdown[k] = (v * w) / divisor;
    }
    return breakdown;
}

function computeTrust(signals, weights = {}) {
    // Optimization: avoid spreading object when custom weights are empty
    const hasCustomWeights = weights != null && Object.keys(weights).length > 0;
    const mergedWeights = hasCustomWeights
        ? { ...defaultWeights, ...weights }
        : defaultWeights;
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { computeTrust };
//# sourceMappingURL=index.js.map
