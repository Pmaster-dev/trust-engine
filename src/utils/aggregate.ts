import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

// Fast score aggregation iterating directly over SIGNAL_NAMES without Object.keys allocations
export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const key = SIGNAL_NAMES[i]
    const w = weights[key]
    if (w !== undefined) {
      const v = signals[key] ?? 0
      sum += v * w
      weightSum += w
    }
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
