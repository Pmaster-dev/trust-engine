import { TrustSignalName } from '../types.js'

// Optimized: Calculates weightSum in the same for...in iteration without creating intermediate arrays via Object.values/Object.keys
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>
  let weightSum = 0

  for (const key in weights) {
    weightSum += weights[key as TrustSignalName]
  }

  const denominator = weightSum || 1

  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = (v * w) / denominator
  }

  return breakdown
}
