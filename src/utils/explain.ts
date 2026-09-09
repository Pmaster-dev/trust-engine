import { TrustSignalName } from '../types.js'

/**
 * Computes individual score contribution breakdown per trust signal.
 * Uses index-based loop over weight keys to avoid intermediate array allocations and closure calls.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>
  const keys = Object.keys(weights) as TrustSignalName[]
  let weightSum = 0

  for (let i = 0; i < keys.length; i++) {
    weightSum += weights[keys[i]]
  }

  const divisor = weightSum || 1

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const w = weights[key]
    const v = signals[key] ?? 0
    breakdown[key] = (v * w) / divisor
  }

  return breakdown
}
