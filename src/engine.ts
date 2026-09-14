import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'

// Pre-defined signal names list to avoid re-allocating arrays or querying object keys per execution
const SIGNAL_NAMES: readonly TrustSignalName[] = [
  'identity',
  'behavior',
  'reputation',
  'contribution',
  'consistency',
  'accessibility',
  'security',
  'governance',
  'intent'
] as const

/**
 * Computes the overall trust score, breakdown, and weights.
 *
 * Performance Optimization:
 * Single-pass computation combining signal normalization, weighted aggregation,
 * and breakdown calculations. Replaces multiple object spreads, `Object.keys`,
 * `Object.values`, array iterations, and intermediate dictionary creations.
 */
export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  const mergedWeights: Record<TrustSignalName, number> = {
    ...defaultWeights,
    ...weights
  }

  const breakdown = {} as Record<TrustSignalName, number>
  let weightedSum = 0
  let weightSum = 0

  // Single pass loop over predefined signal names
  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const name = SIGNAL_NAMES[i]
    const raw = signals[name]

    let val = 0
    if (raw != null && !Number.isNaN(raw)) {
      val = raw < 0 ? 0 : raw > 1 ? 1 : raw
    }

    const weight = mergedWeights[name]
    const weightedVal = val * weight
    weightedSum += weightedVal
    weightSum += weight
    breakdown[name] = weightedVal
  }

  const score = weightSum === 0 ? 0 : weightedSum / weightSum
  const normalizer = weightSum === 0 ? 1 : weightSum

  // Scale breakdown values by total weight sum
  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const name = SIGNAL_NAMES[i]
    breakdown[name] = breakdown[name] / normalizer
  }

  return { score, breakdown, weights: mergedWeights }
}
