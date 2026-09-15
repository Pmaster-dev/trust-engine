import { TrustSignals, TrustSignalName } from '../types.js'

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

  for (const name of SIGNAL_NAMES) {
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
