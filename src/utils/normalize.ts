import { TrustSignals, TrustSignalName } from '../types.js'

// Lift signal names array to module scope to prevent array re-allocation on every normalize call.
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
 * Normalizes trust signals, clamping valid values to [0, 1] and default missing/NaN values to 0.
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
      continue
    }
    // clamp to [0,1]
    result[name] = Math.max(0, Math.min(1, raw))
  }

  return result
}
