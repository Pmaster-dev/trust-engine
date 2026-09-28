import { TrustSignals, TrustSignalName, SIGNAL_NAMES } from '../types.js'

/**
 * Normalizes input signal values to [0, 1] range.
 * Uses module-constant SIGNAL_NAMES to avoid per-call array allocations
 * and direct branchless/ternary clamping instead of Math.max/Math.min function calls.
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
      // Clamp to [0, 1] without Math.max/Math.min function call overhead
      result[name] = raw <= 0 ? 0 : raw >= 1 ? 1 : raw
    }
  }

  return result
}
