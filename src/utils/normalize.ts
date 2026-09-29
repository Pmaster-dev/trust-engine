import { TrustSignals, TrustSignalName } from '../types.js'

// Hoisted array avoids re-allocating array on every function call
const SIGNAL_NAMES: TrustSignalName[] = [
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

  // Index loop with explicit clamping avoids Math.max/Math.min call overhead
  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const name = SIGNAL_NAMES[i]
    const raw = signals[name]
    if (raw == null || Number.isNaN(raw)) {
      result[name] = 0
    } else if (raw < 0) {
      result[name] = 0
    } else if (raw > 1) {
      result[name] = 1
    } else {
      result[name] = raw
    }
  }

  return result
}
