import { TrustSignalName } from '../types'

export function aggregateScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): number {
  let sum = 0
  let weightSum = 0

  // Use for...in to iterate without allocating key arrays via Object.keys()
  for (const key in weights) {
    const w = weights[key as TrustSignalName]
    if (w === undefined) continue
    const v = signals[key as TrustSignalName] ?? 0
    sum += v * w
    weightSum += w
  }

  if (weightSum === 0) return 0
  return sum / weightSum
}
