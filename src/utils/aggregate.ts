import { TrustSignalName } from '../types.js'

export interface AggregateResult {
  score: number
  weightSum: number
}

/**
 * Calculates the weighted aggregate trust score and weight sum.
 * Optimized using `for...in` loop to avoid Object.keys array allocations.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): AggregateResult {
  let sum = 0
  let weightSum = 0

  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return { score: 0, weightSum: 0 }
  return { score: sum / weightSum, weightSum }
}
