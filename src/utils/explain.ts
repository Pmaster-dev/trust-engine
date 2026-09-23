import { TrustSignalName } from '../types.js'

/**
 * Calculates breakdown scores for each signal based on normalized signals and merged weights.
 * Performance optimization: Direct property iteration avoids creating temporary
 * Object.values() and Object.keys() arrays on every call.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown: Record<TrustSignalName, number> = {} as Record<
    TrustSignalName,
    number
  >
  let weightSum = 0

  for (const key in weights) {
    weightSum += weights[key as TrustSignalName] ?? 0
  }

  const totalWeight = weightSum || 1

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / totalWeight
  }

  return breakdown
}
