import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes trust score and breakdown for a set of trust signals.
 * Optimizes performance by avoiding object copying when default weights are used.
 */
export function computeTrust(
  signals: TrustSignals,
  weights?: Partial<Record<TrustSignalName, number>>
): TrustScoreResult {
  // Avoid allocating merged weights object when custom weights are not provided
  const mergedWeights: Record<TrustSignalName, number> =
    !weights || Object.keys(weights).length === 0
      ? defaultWeights
      : { ...defaultWeights, ...weights }

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
