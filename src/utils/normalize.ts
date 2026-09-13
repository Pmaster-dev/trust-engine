import { TrustSignals, TrustSignalName } from '../types.js'

const SIGNAL_NAMES: readonly TrustSignalName[] = [
  'identity',
  'behavior',
  'reputation',
  'contribution',
  'consistency',
  'accessibility',
  'security',
  'governance',
  'intent'
]

/**
 * Normalizes raw trust signal inputs into values clamped between 0 and 1.
 * Performance note: SIGNAL_NAMES is static at module scope to prevent heap allocation per call.
 */
export function normalizeSignals(
  signals: TrustSignals
): Record<TrustSignalName, number> {
  const result = {} as Record<TrustSignalName, number>

  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const name = SIGNAL_NAMES[i]
    const raw = signals[name]
    if (raw == null || Number.isNaN(raw)) {
      result[name] = 0
    } else {
      result[name] = Math.max(0, Math.min(1, raw))
    }
  }

  return result
}
