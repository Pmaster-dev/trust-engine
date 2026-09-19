import { TrustSignalName } from '../types.js'

export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown: Record<TrustSignalName, number> = {} as Record<
    TrustSignalName,
    number
  >

  // Optimize: Compute weight sum via direct loop instead of Object.values(weights).reduce() which allocates a temporary array
  let weightSum = 0
  for (const key in weights) {
    weightSum += weights[key as TrustSignalName] || 0
  }

  const normWeightSum = weightSum || 1

  // Optimize: Direct for...in loop avoids calling Object.keys(weights) which allocates a temporary array
  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = (v * w) / normWeightSum
  }

  return breakdown
}
