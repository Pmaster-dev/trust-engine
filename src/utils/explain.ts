import { TrustSignalName } from '../types.js'
import { defaultWeights } from '../weights/default.js'

export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  let weightSum = 0
  // Fast-path for defaultWeights where total weight sum is 1.0
  if (weights === defaultWeights) {
    weightSum = 1
  } else {
    for (const key in weights) {
      weightSum += weights[key as TrustSignalName]
    }
  }

  const denominator = weightSum || 1

  // Direct property iteration avoiding Object.keys array allocation
  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    breakdown[k] = (v * w) / denominator
  }

  return breakdown
}
