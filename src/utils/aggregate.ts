import { TrustSignalName } from '../types.js'
import { defaultWeights } from '../weights/default.js'

export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0

  // Fast-path for defaultWeights where total weight sum is pre-calculated to 1.0
  if (weights === defaultWeights) {
    for (const key in weights) {
      const k = key as TrustSignalName
      sum += (signals[k] ?? 0) * weights[k]
    }
    return sum
  }

  let weightSum = 0
  // Direct property iteration avoiding Object.keys array allocation
  for (const key in weights) {
    const k = key as TrustSignalName
    const w = weights[k]
    const v = signals[k] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
