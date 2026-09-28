import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

/**
 * Aggregates normalized signal values into a weighted score.
 * Iterates over static SIGNAL_NAMES to avoid Object.keys() array allocations.
 */
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const key = SIGNAL_NAMES[i]
    const w = weights[key] ?? 0
    if (w !== 0) {
      const v = signals[key] ?? 0
      sum += v * w
      weightSum += w
    }
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
