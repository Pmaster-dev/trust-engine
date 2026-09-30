import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

/**
 * Calculates contribution breakdown for each trust signal.
 * Performance Optimization: Replaces Object.values().reduce() and Object.keys() array allocations
 * with direct loop iterations over static SIGNAL_NAMES.
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

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    weightSum += weights[SIGNAL_NAMES[i]] ?? 0
  }

  const divisor = weightSum || 1

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const key = SIGNAL_NAMES[i]
    const w = weights[key] ?? 0
    const v = signals[key] ?? 0
    breakdown[key] = (v * w) / divisor
  }

  return breakdown
}
