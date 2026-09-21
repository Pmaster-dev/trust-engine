import { TrustSignalName } from '../types.js'

/**
 * Computes a weighted average score from normalized signals.
 * Performance optimization: Iterates over weight keys directly with for...in to avoid intermediate Object.keys() array allocations.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
