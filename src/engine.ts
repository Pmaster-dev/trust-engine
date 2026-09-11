import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

export function computeTrust(
  signals: TrustSignals,
  weights?: Partial<Record<TrustSignalName, number>>
): TrustScoreResult {
  // Fast path: reuse defaultWeights directly if no custom weights passed or if empty
  let mergedWeights: Record<TrustSignalName, number>
  if (!weights || Object.keys(weights).length === 0) {
    mergedWeights = defaultWeights
  } else {
    mergedWeights = {
      ...defaultWeights,
      ...weights
    }
  }

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
