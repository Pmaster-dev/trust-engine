import { TrustSignals, TrustSignalName, SIGNAL_NAMES } from '../types.js'

// Hoisted array iteration over fixed SIGNAL_NAMES to avoid array allocation per call
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
      // clamp to [0,1]
      result[name] = Math.max(0, Math.min(1, raw))
    }
  }

  return result
}
