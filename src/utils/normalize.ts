import { TrustSignals, TrustSignalName, SIGNAL_NAMES } from '../types.js'

// Fast normalization of signals with inline clamping and zero per-call array allocations
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
