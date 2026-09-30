import { TrustSignals, TrustSignalName, SIGNAL_NAMES } from '../types.js'

/**
 * Normalizes trust signals by clamping valid numbers to [0, 1] and defaulting missing/NaN values to 0.
 * Performance Optimization: Uses static SIGNAL_NAMES array to avoid array allocations on every call.
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
      // Clamp to [0, 1]
      result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw
    }
  }

  return result
}
