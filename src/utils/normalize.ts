import { TrustSignals, TrustSignalName } from '../types.js'

export const SIGNAL_NAMES: readonly TrustSignalName[] = [
  'identity',
  'behavior',
  'reputation',
  'contribution',
  'consistency',
  'accessibility',
  'security',
  'governance',
  'intent'
] as const

/**
 * Normalizes trust signals by clamping raw values to [0, 1].
 * Lifts `SIGNAL_NAMES` array to module scope to avoid allocating an array on every call.
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
    } else if (raw <= 0) {
      result[name] = 0
    } else if (raw >= 1) {
      result[name] = 1
    } else {
      result[name] = raw
    }
  }

  return result
}
