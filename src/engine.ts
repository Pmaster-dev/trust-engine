import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes the aggregate trust score and breakdown for a given set of signals.
 *
 * Optimization:
 * Avoids cloning `defaultWeights` when custom weights are omitted and pre-calculates
 * weightSum = 1.0 for default weights. Computes score by accumulating breakdown values
 * in a single pass to eliminate redundant iterations and intermediate array allocations.
 */
export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  // Optimization: Skip object spread if custom weights are empty to avoid object copy
  const hasCustomWeights = weights && Object.keys(weights).length > 0
  let mergedWeights: Record<TrustSignalName, number>
  let weightSum: number | undefined

  if (hasCustomWeights) {
    mergedWeights = { ...defaultWeights, ...weights }
  } else {
    mergedWeights = defaultWeights
    // Default weights sum to 1.0; pass pre-calculated weightSum to skip loop in explainScore
    weightSum = 1.0
  }

  const normalized = normalizeSignals(signals)
  const breakdown = explainScore(normalized, mergedWeights, weightSum)

  // Sum breakdown scores directly to get overall score without re-calculating (score = sum of breakdown)
  let score = 0
  for (const key in breakdown) {
    score += breakdown[key as TrustSignalName]
  }

  return { score, breakdown, weights: mergedWeights }
}
