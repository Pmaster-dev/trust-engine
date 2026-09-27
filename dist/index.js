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

// Fast normalization of signals with inline clamping and zero per-call array allocations
function normalizeSignals(signals) {
    const result = {};
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const name = SIGNAL_NAMES[i];
        const raw = signals[name];
        if (raw == null || Number.isNaN(raw)) {
            result[name] = 0;
        }
        else if (raw <= 0) {
            result[name] = 0;
        }
        else if (raw >= 1) {
            result[name] = 1;
        }
        else {
            result[name] = raw;
        }
    }
    return result;
}

// Optimized aggregateScore using static SIGNAL_NAMES loop without Object.keys() allocations
function aggregateScore(signals, weights) {
    let sum = 0;
    let weightSum = 0;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        const v = signals[key] ?? 0;
        sum += v * w;
        weightSum += w;
    }
    if (weightSum === 0)
        return 0;
    return sum / weightSum;
}

// Optimized explainScore using static SIGNAL_NAMES loop and optional precalculated weightSum
function explainScore(signals, weights, weightSum) {
    const breakdown = {};
    if (weightSum === undefined) {
        weightSum = 0;
        for (let i = 0; i < SIGNAL_NAMES.length; i++) {
            weightSum += weights[SIGNAL_NAMES[i]] ?? 0;
        }
    }
    const divisor = weightSum || 1;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const w = weights[key] ?? 0;
        const v = signals[key] ?? 0;
        breakdown[key] = (v * w) / divisor;
    }
    return breakdown;
}

function computeTrust(signals, weights = {}) {
    const mergedWeights = {
        ...defaultWeights,
        ...weights
    };
    const normalized = normalizeSignals(signals);
    const score = aggregateScore(normalized, mergedWeights);
    const breakdown = explainScore(normalized, mergedWeights);
    return { score, breakdown, weights: mergedWeights };
}

export { SIGNAL_NAMES, computeTrust };
//# sourceMappingURL=index.js.map
