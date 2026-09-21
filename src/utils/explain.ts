import { TrustSignalName } from '../types.js'

/**
 * Returns a breakdown of score contributions by signal.
 * Performance optimization: Uses direct for...in loops instead of Object.values().reduce() and Object.keys() to avoid temporary array allocations and callback overhead.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  let weightSum = 0
  for (const key in weights) {
    weightSum += weights[key as TrustSignalName]
  }

  const denominator = weightSum || 1

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / denominator
  }

  return breakdown
}
