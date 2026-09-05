import { TrustSignals, TrustSignalName } from '../types'

function clampSignal(raw: number | undefined): number {
  if (raw == null || Number.isNaN(raw)) {
    return 0
  }
  return raw < 0 ? 0 : raw > 1 ? 1 : raw
}

/**
 * Normalizes trust signals by clamping valid numeric values to [0, 1]
 * and defaulting missing/invalid inputs to 0.
 *
 * Optimization: Direct object literal initialization avoids dynamic property mutations
 * and temporary array allocations, giving V8 monomorphic shape site ICs.
 */
export function normalizeSignals(
  signals: TrustSignals
): Record<TrustSignalName, number> {
  return {
    identity: clampSignal(signals.identity),
    behavior: clampSignal(signals.behavior),
    reputation: clampSignal(signals.reputation),
    contribution: clampSignal(signals.contribution),
    consistency: clampSignal(signals.consistency),
    accessibility: clampSignal(signals.accessibility),
    security: clampSignal(signals.security),
    governance: clampSignal(signals.governance),
    intent: clampSignal(signals.intent)
  }
}
