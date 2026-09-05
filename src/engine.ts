import { TrustSignals, TrustScoreResult, TrustSignalName } from './types'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes the overall trust score and breakdown for a given set of trust signals.
 *
 * Optimization: Reuses defaultWeights reference when no custom weights are passed
 * to avoid object spreading allocation.
 */
export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  const hasCustomWeights = weights != null && Object.keys(weights).length > 0
  const mergedWeights: Record<TrustSignalName, number> = hasCustomWeights
    ? { ...defaultWeights, ...weights }
    : defaultWeights

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
