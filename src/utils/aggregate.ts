import { TrustSignalName } from '../types.js'

/**
 * Calculates weighted average trust score.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  // Iterate directly over weight keys to avoid Object.keys() array allocation on each call.
  for (const key in weights) {
    if (Object.prototype.hasOwnProperty.call(weights, key)) {
      const signalKey = key as TrustSignalName
      const w = weights[signalKey]
      const v = signals[signalKey] ?? 0
      sum += v * w
      weightSum += w
    }
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
