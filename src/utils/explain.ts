import { TrustSignalName } from '../types'

/**
 * Computes a signal-by-signal score breakdown normalized by total weight sum.
 *
 * Optimization: Direct object initialization avoids double array allocations
 * (Object.values + Object.keys) and computes breakdown in a single pass.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const iw = weights.identity ?? 0
  const bw = weights.behavior ?? 0
  const rw = weights.reputation ?? 0
  const cw = weights.contribution ?? 0
  const cs = weights.consistency ?? 0
  const aw = weights.accessibility ?? 0
  const sw = weights.security ?? 0
  const gw = weights.governance ?? 0
  const itw = weights.intent ?? 0

  const weightSum = iw + bw + rw + cw + cs + aw + sw + gw + itw || 1

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
  }
}
