import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes overall trust score, breakdown, and merged weights for the given signals.
 */
export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  // Avoid object spread allocation when no custom weights are provided
  let mergedWeights = defaultWeights
  for (const k in weights) {
    if (Object.prototype.hasOwnProperty.call(weights, k)) {
      mergedWeights = {
        ...defaultWeights,
        ...weights
      }
      break
    }
  }

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
