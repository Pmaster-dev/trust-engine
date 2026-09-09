import { TrustSignals, TrustSignalName } from '../types.js'

// Optimization: Lift signal name array to module scope to avoid re-allocating an array on every call
const ALL_SIGNAL_NAMES: readonly TrustSignalName[] = [
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
 * Normalizes input signals into clamped values between [0, 1].
 *
 * Optimization: Uses module-scoped constant array and indexed loop to prevent array allocations.
 */
export function normalizeSignals(
  signals: TrustSignals
): Record<TrustSignalName, number> {
  const result = {} as Record<TrustSignalName, number>

  for (let i = 0; i < ALL_SIGNAL_NAMES.length; i++) {
    const name = ALL_SIGNAL_NAMES[i]
    const raw = signals[name]
    if (raw == null || Number.isNaN(raw)) {
      result[name] = 0
      continue
    }
    // clamp to [0,1]
    result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw
  }

  return result
}
