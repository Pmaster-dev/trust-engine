import { TrustSignalName } from '../types.js'

/**
 * Aggregates normalized trust signals using supplied weights.
 * Optimized with direct loop to avoid Object.keys array allocation.
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
