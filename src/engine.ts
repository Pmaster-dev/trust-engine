import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { aggregateScore } from './utils/aggregate.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes trust score and breakdown for input signals.
 * Avoids object allocation when custom weights are omitted or empty.
 */
export function computeTrust(
  signals: TrustSignals,
  weights?: Partial<Record<TrustSignalName, number>>
): TrustScoreResult {
  const mergedWeights: Record<TrustSignalName, number> =
    weights && Object.keys(weights).length > 0
      ? { ...defaultWeights, ...weights }
      : defaultWeights

  const normalized = normalizeSignals(signals)
  const score = aggregateScore(normalized, mergedWeights)
  const breakdown = explainScore(normalized, mergedWeights)

  return { score, breakdown, weights: mergedWeights }
}
