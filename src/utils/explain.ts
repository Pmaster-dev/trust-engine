import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

/**
 * Explains the score breakdown per signal.
 * Replaces Object.values().reduce() and Object.keys() allocations
 * with direct iteration over SIGNAL_NAMES.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>,
  precomputedWeightSum?: number
): Record<TrustSignalName, number> {
  const breakdown: Record<TrustSignalName, number> = {} as Record<
    TrustSignalName,
    number
  >

  let weightSum = precomputedWeightSum
  if (weightSum == null) {
    weightSum = 0
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
      weightSum += weights[SIGNAL_NAMES[i]] ?? 0
    }
  }

  const effectiveWeightSum = weightSum || 1

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const key = SIGNAL_NAMES[i]
    const w = weights[key] ?? 0
    const v = signals[key] ?? 0
    breakdown[key] = (v * w) / effectiveWeightSum
  }

  return breakdown
}
