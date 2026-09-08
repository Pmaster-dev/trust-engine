import { TrustSignalName } from '../types.js'

/**
 * Explains the contribution of each trust signal to the overall score.
 * Optimized with key loops instead of Object.values().reduce() and Object.keys() array allocations.
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
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = (v * w) / denominator
  }

  return breakdown
}
