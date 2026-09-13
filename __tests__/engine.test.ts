import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { computeIdentitySignal } from '../src/signals/*.js'
import { TrustSignalName } from '../src/types.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('aggregates score correctly without allocating arrays', () => {
    const signals = normalizeSignals({ identity: 1, behavior: 0.5 })
    const weights: Record<TrustSignalName, number> = {
      identity: 0.5,
      behavior: 0.5,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const score = aggregateScore(signals, weights)
    expect(score).toBe(0.75)
  })

  it('handles zero weight sum in aggregateScore and explainScore', () => {
    const signals = normalizeSignals({ identity: 1 })
    const zeroWeights: Record<TrustSignalName, number> = {
      identity: 0,
      behavior: 0,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    expect(aggregateScore(signals, zeroWeights)).toBe(0)
    const breakdown = explainScore(signals, zeroWeights)
    expect(breakdown.identity).toBe(0)
  })

  it('explains score breakdown correctly without allocating arrays', () => {
    const signals = normalizeSignals({ identity: 1, behavior: 0.5 })
    const weights: Record<TrustSignalName, number> = {
      identity: 0.5,
      behavior: 0.5,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const breakdown = explainScore(signals, weights)
    expect(breakdown.identity).toBe(0.5)
    expect(breakdown.behavior).toBe(0.25)
  })

  it('computes identity signal correctly', () => {
    const score = computeIdentitySignal({
      verified: true,
      mfa: true,
      riskScore: 0.2
    })
    expect(score).toBeCloseTo(0.98)
  })
})
