import { TrustSignalName } from '../types.js'

/**
 * Calculates the contribution breakdown of each signal to the overall score.
 * Performance note: Uses for...in loops and reciprocal multiplication (invWeightSum)
 * to avoid Object.keys/Object.values array allocations and per-item divisions.
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

  const invWeightSum = weightSum === 0 ? 0 : 1 / weightSum

  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = v * w * invWeightSum
  }

  return breakdown
}
