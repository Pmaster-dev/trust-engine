import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = {}
): TrustScoreResult {
  // Optimization: avoid spreading object when custom weights are empty
  const hasCustomWeights = weights != null && Object.keys(weights).length > 0
  const mergedWeights: Record<TrustSignalName, number> = hasCustomWeights
    ? { ...defaultWeights, ...weights }
    : defaultWeights

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
