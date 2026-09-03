import { TrustSignalName } from '../types.js'

/**
 * Explains trust score by calculating normalized per-signal weight contribution breakdown.
 *
 * Optimization: Accepts an optional pre-calculated `weightSum` to avoid re-summing weights.
 * Iterates directly without allocating `Object.values()` or `Object.keys()` arrays.
 */
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>,
  weightSum?: number
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  // Optimization: Compute weightSum only when not pre-provided
  if (weightSum === undefined) {
    weightSum = 0
    for (const key in weights) {
      weightSum += weights[key as TrustSignalName]
    }
  }

  const divisor = weightSum || 1

  // Optimization: Direct loop avoids Object.keys() array allocation
  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = (v * w) / divisor
  }

  return breakdown
}
