import { TrustSignals, TrustScoreResult, TrustSignalName } from './types.js'
import { defaultWeights } from './weights/default.js'
import { normalizeSignals } from './utils/normalize.js'
import { explainScore } from './utils/explain.js'

/**
 * Computes trust score and breakdown from raw signals and optional weight overrides.
 * Performance note: Reuses defaultWeights reference when no overrides are passed,
 * and derives total score directly from breakdown components to eliminate duplicate loops.
 */
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
  const breakdown = explainScore(normalized, mergedWeights)

  let score = 0
  for (const key in breakdown) {
    score += breakdown[key as TrustSignalName]
  }

  return { score, breakdown, weights: mergedWeights }
}
