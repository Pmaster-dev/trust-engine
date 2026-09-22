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

function computeTrust(signals, weights) {
    // Optimization: avoid shallow copying defaultWeights when custom weights are not supplied
    const mergedWeights = weights != null && Object.keys(weights).length > 0
        ? { ...defaultWeights, ...weights }
        : defaultWeights;
    const breakdown = {};
    let sum = 0;
    let weightSum = 0;
    // Single pass to normalize signals, compute weighted sum, and store unscaled breakdown
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        const raw = signals[key];
        const v = raw == null || Number.isNaN(raw) ? 0 : Math.max(0, Math.min(1, raw));
        const w = mergedWeights[key] ?? 0;
        const weighted = v * w;
        sum += weighted;
        weightSum += w;
        breakdown[key] = weighted;
    }
    // Scale breakdown by denominator
    const denominator = weightSum || 1;
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
        const key = SIGNAL_NAMES[i];
        breakdown[key] /= denominator;
    }
    const score = weightSum === 0 ? 0 : sum / weightSum;
    return { score, breakdown, weights: mergedWeights };
}

export { SIGNAL_NAMES, computeTrust };
//# sourceMappingURL=index.js.map
