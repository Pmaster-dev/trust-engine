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

function clampSignal(raw) {
    if (raw == null || Number.isNaN(raw)) {
        return 0;
    }
    return raw < 0 ? 0 : raw > 1 ? 1 : raw;
}
/**
 * Normalizes trust signals by clamping valid numeric values to [0, 1]
 * and defaulting missing/invalid inputs to 0.
 *
 * Optimization: Direct object literal initialization avoids dynamic property mutations
 * and temporary array allocations, giving V8 monomorphic shape site ICs.
 */
function normalizeSignals(signals) {
    return {
        identity: clampSignal(signals.identity),
        behavior: clampSignal(signals.behavior),
        reputation: clampSignal(signals.reputation),
        contribution: clampSignal(signals.contribution),
        consistency: clampSignal(signals.consistency),
        accessibility: clampSignal(signals.accessibility),
        security: clampSignal(signals.security),
        governance: clampSignal(signals.governance),
        intent: clampSignal(signals.intent)
    };
}

/**
 * Computes the weighted aggregate trust score.
 *
 * Optimization: Unrolled property evaluation avoids Object.keys(weights) array allocation
 * and loop overhead, computing sum and weightSum in a single unrolled pass.
 */
function aggregateScore(signals, weights) {
    const iw = weights.identity ?? 0;
    const bw = weights.behavior ?? 0;
    const rw = weights.reputation ?? 0;
    const cw = weights.contribution ?? 0;
    const cs = weights.consistency ?? 0;
    const aw = weights.accessibility ?? 0;
    const sw = weights.security ?? 0;
    const gw = weights.governance ?? 0;
    const itw = weights.intent ?? 0;
    const weightSum = iw + bw + rw + cw + cs + aw + sw + gw + itw;
    if (weightSum === 0)
        return 0;
    const sum = (signals.identity ?? 0) * iw +
        (signals.behavior ?? 0) * bw +
        (signals.reputation ?? 0) * rw +
        (signals.contribution ?? 0) * cw +
        (signals.consistency ?? 0) * cs +
        (signals.accessibility ?? 0) * aw +
        (signals.security ?? 0) * sw +
        (signals.governance ?? 0) * gw +
        (signals.intent ?? 0) * itw;
    return sum / weightSum;
}

/**
 * Computes a signal-by-signal score breakdown normalized by total weight sum.
 *
 * Optimization: Direct object initialization avoids double array allocations
 * (Object.values + Object.keys) and computes breakdown in a single pass.
 */
function explainScore(signals, weights) {
    const iw = weights.identity ?? 0;
    const bw = weights.behavior ?? 0;
    const rw = weights.reputation ?? 0;
    const cw = weights.contribution ?? 0;
    const cs = weights.consistency ?? 0;
    const aw = weights.accessibility ?? 0;
    const sw = weights.security ?? 0;
    const gw = weights.governance ?? 0;
    const itw = weights.intent ?? 0;
    const weightSum = iw + bw + rw + cw + cs + aw + sw + gw + itw || 1;
    return {
        identity: ((signals.identity ?? 0) * iw) / weightSum,
        behavior: ((signals.behavior ?? 0) * bw) / weightSum,
        reputation: ((signals.reputation ?? 0) * rw) / weightSum,
        contribution: ((signals.contribution ?? 0) * cw) / weightSum,
        consistency: ((signals.consistency ?? 0) * cs) / weightSum,
        accessibility: ((signals.accessibility ?? 0) * aw) / weightSum,
        security: ((signals.security ?? 0) * sw) / weightSum,
        governance: ((signals.governance ?? 0) * gw) / weightSum,
        intent: ((signals.intent ?? 0) * itw) / weightSum
    };
}

/**
 * Computes the overall trust score and breakdown for a given set of trust signals.
 *
 * Optimization: Reuses defaultWeights reference when no custom weights are passed
 * to avoid object spreading allocation.
 */
function computeTrust(signals, weights = {}) {
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
