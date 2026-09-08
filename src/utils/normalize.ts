import { TrustSignals, TrustSignalName } from '../types.js'

// Pre-defined list of signal names to avoid array allocation on every function call
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
 * Normalizes input trust signals into clamped values in [0, 1].
 * Optimized to reuse static key array and inline clamping logic.
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
      // Inline clamping [0, 1] is faster than Math.max/Math.min function calls
      result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw
    }
  }

  return result
}
