import { TrustSignalName } from '../types.js'

export interface AggregateScoreResult {
  score: number
  weightSum: number
}

/**
 * Computes the weighted aggregate trust score and total weight sum.
 * Optimized using `for..in` to avoid allocating an intermediate `Object.keys` array.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): AggregateScoreResult {
  let sum = 0
  let weightSum = 0

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    sum += v * w
    weightSum += w
  }

  const score = weightSum === 0 ? 0 : sum / weightSum
  return { score, weightSum }
}
