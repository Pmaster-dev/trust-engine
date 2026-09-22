import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

// Fast score breakdown calculation iterating directly over SIGNAL_NAMES without Object.values or Object.keys allocations
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>
  let weightSum = 0

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const w = weights[SIGNAL_NAMES[i]]
    if (w !== undefined) weightSum += w
  }

  const denominator = weightSum || 1

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const key = SIGNAL_NAMES[i]
    const w = weights[key]
    if (w !== undefined) {
      const v = signals[key] ?? 0
      breakdown[key] = (v * w) / denominator
    }
  }

  return breakdown
}
