import { TrustSignalName } from '../types.js'

export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>
  let weightSum = 0

  // Single pass calculation of weightSum and breakdown avoids Object.values/Object.keys array allocations
  for (const key in weights) {
    weightSum += weights[key as TrustSignalName]
  }

  const effectiveWeightSum = weightSum || 1

  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / effectiveWeightSum
  }

  return breakdown
}
