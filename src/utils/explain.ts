import { TrustSignalName } from '../types.js'

/**
 * Calculates the score breakdown per signal.
 * Optimized to avoid Object.values/Object.keys array allocations and callback closure allocations.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>,
  weightSum?: number
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  let denominator = weightSum
  if (denominator === undefined) {
    denominator = 0
    for (const key in weights) {
      denominator += weights[key as TrustSignalName]
    }
  }
  if (denominator === 0) denominator = 1

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / denominator
  }

  return breakdown
}
