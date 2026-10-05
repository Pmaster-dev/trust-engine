import { TrustSignalName } from '../types'

export function explainScore(
  signals: Record<TrustSignalName, number>,
  weights: Record<TrustSignalName, number>
): Record<TrustSignalName, number> {
  const breakdown = {} as Record<TrustSignalName, number>
  let weightSum = 0

  // Calculate sum of weights without allocating intermediate array from Object.values()
  for (const key in weights) {
    weightSum += weights[key as TrustSignalName] ?? 0
  }

  const norm = weightSum || 1

  // Populate breakdown without allocating key array via Object.keys()
  for (const key in weights) {
    const signalKey = key as TrustSignalName
    const w = weights[signalKey]
    if (w === undefined) continue
    const v = signals[signalKey] ?? 0
    breakdown[signalKey] = (v * w) / norm
  }

  return breakdown
}
