import { TrustSignalName } from '../types.js'

/**
 * Computes score breakdown per signal.
 * Performance: Calculates weight sum and breakdown values in direct `for...in`
 * loops to avoid temporary array allocations (`Object.keys()`, `Object.values()`).
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
