import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  const mergedWeights: Record<TrustSignalName, number> =
    Object.keys(weights).length === 0
      ? defaultWeights
      : {
          ...defaultWeights,
          ...weights
        }

  const normalized = normalizeSignals(signals)
  const { score, weightSum } = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights, weightSum)

  return { score, breakdown, weights: mergedWeights }
}
