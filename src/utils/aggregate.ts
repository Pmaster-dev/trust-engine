import { TrustSignalName } from '../types.js'

/**
 * Aggregates weighted scores into a final normalized score.
 * Uses index-based loop over weight keys to eliminate iterator allocation overhead.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  const keys = Object.keys(weights) as TrustSignalName[]
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const w = weights[key]
    const v = signals[key] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
