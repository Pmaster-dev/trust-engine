import { TrustSignalName } from '../types.js'

/**
 * Explains trust score breakdown per signal.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  // Compute total weight sum without Object.values() array allocation
  let weightSum = 0
  for (const key in weights) {
    if (Object.prototype.hasOwnProperty.call(weights, key)) {
      weightSum += weights[key as TrustSignalName]
    }
  }

  const effectiveWeightSum = weightSum || 1

  // Compute breakdown without Object.keys() array allocation
  for (const key in weights) {
    if (Object.prototype.hasOwnProperty.call(weights, key)) {
      const signalKey = key as TrustSignalName
      const w = weights[signalKey]
      const v = signals[signalKey] ?? 0
      breakdown[signalKey] = (v * w) / effectiveWeightSum
    }
  }

  return breakdown
}
