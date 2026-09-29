import { TrustSignalName } from '../types.js'

export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  // Direct for...in loop avoids Object.keys array allocation on every call
  for (const key in weights) {
    const w = weights[key as TrustSignalName]
    const v = signals[key as TrustSignalName] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
