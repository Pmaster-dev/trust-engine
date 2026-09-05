import { TrustSignalName } from '../types'

/**
 * Computes the weighted aggregate trust score.
 *
 * Optimization: Unrolled property evaluation avoids Object.keys(weights) array allocation
 * and loop overhead, computing sum and weightSum in a single unrolled pass.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  const iw = weights.identity ?? 0
  const bw = weights.behavior ?? 0
  const rw = weights.reputation ?? 0
  const cw = weights.contribution ?? 0
  const cs = weights.consistency ?? 0
  const aw = weights.accessibility ?? 0
  const sw = weights.security ?? 0
  const gw = weights.governance ?? 0
  const itw = weights.intent ?? 0

  const weightSum = iw + bw + rw + cw + cs + aw + sw + gw + itw
  if (weightSum === 0) return 0

  const sum =
    (signals.identity ?? 0) * iw +
    (signals.behavior ?? 0) * bw +
    (signals.reputation ?? 0) * rw +
    (signals.contribution ?? 0) * cw +
    (signals.consistency ?? 0) * cs +
    (signals.accessibility ?? 0) * aw +
    (signals.security ?? 0) * sw +
    (signals.governance ?? 0) * gw +
    (signals.intent ?? 0) * itw

  return sum / weightSum
}
