import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

const EMPTY_WEIGHTS = {}

export function computeTrust(
  signals: TrustSignals,
  weights: Partial<Record<TrustSignalName, number>> = EMPTY_WEIGHTS
): TrustScoreResult {
  // Fast path: avoid Object.keys() allocation when default or empty weights are passed
  const mergedWeights: Record<TrustSignalName, number> =
    weights === EMPTY_WEIGHTS ||
    weights === defaultWeights ||
    Object.keys(weights).length === 0
      ? defaultWeights
      : { ...defaultWeights, ...weights }

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
