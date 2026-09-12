import { TrustSignalName } from '../types.js'

/**
 * Calculates weighted aggregate score across all signals.
 * Performance: Uses direct `for...in` iteration to avoid creating array allocations
 * (`Object.keys()`) on every calculation in hot execution paths.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
