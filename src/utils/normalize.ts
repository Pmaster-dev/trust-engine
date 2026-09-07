import { TrustSignals, TrustSignalName } from '../types.js'

// Static array of signal names to avoid per-invocation allocation
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

  // Fast indexed loop avoiding array allocation, function calls, & iterator overhead
  for (let i = 0; i < SIGNAL_NAMES.length; i++) {
    const name = SIGNAL_NAMES[i]
    const raw = signals[name]
    if (typeof raw !== 'number' || raw !== raw) {
      result[name] = 0
    } else {
      // Clamp to [0, 1] without Math.max/min function call overhead
      result[name] = raw < 0 ? 0 : raw > 1 ? 1 : raw
    }
  }

  return result
}
