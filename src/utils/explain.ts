import { TrustSignalName, SIGNAL_NAMES } from '../types.js'

// Optimized explainScore using static SIGNAL_NAMES loop and optional precalculated weightSum
export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>,
  weightSum?: number
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>

  if (weightSum === undefined) {
    weightSum = 0
    for (let i = 0; i < SIGNAL_NAMES.length; i++) {
      weightSum += weights[SIGNAL_NAMES[i]] ?? 0
    }
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
