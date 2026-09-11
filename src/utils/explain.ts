import { TrustSignalName } from '../types.js'

export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown: Record<TrustSignalName, number> = {} as Record<
    TrustSignalName,
    number
  >
  const keys = Object.keys(weights) as TrustSignalName[]
  let weightSum = 0

  for (let i = 0; i < keys.length; i++) {
    weightSum += weights[keys[i]]
  }
  if (weightSum === 0) weightSum = 1

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const w = weights[key]
    const v = signals[key] ?? 0
    breakdown[key] = (v * w) / weightSum
  }

  return breakdown
}
