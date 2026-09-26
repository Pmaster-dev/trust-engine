import { TrustSignalName } from '../types.js'

/**
 * Calculates breakdown scores for each signal based on normalized values and weights.
 * Optimized to avoid array allocations (`Object.values`, `Object.keys`, `reduce`)
 * by accepting an optional pre-computed `weightSum` and iterating using `for..in`.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>,
  precomputedWeightSum?: number
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  let totalWeight = precomputedWeightSum
  if (totalWeight === undefined) {
    totalWeight = 0
    for (const key in weights) {
      totalWeight += weights[key as TrustSignalName] ?? 0
    }
  }

  const divisor = totalWeight || 1

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / divisor
  }

  return breakdown
}
