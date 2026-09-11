import { TrustSignals, TrustSignalName } from '../types.js'

// Cache array of signal names outside function to avoid allocation overhead per call
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
