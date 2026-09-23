import { TrustSignalName } from '../types.js'

/**
 * Calculates aggregated score based on normalized signals and merged weights.
 * Performance optimization: Direct property iteration avoids creating temporary
 * Object.keys() array allocations on every call.
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
