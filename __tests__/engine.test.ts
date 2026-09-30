import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { computeIdentitySignal } from '../src/signals/*.ts'
import { TrustSignals, TrustSignalName } from '../src/types.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('handles empty signals and custom weights', () => {
    const result = computeTrust({}, { identity: 0.5 })
    expect(result.score).toBe(0)
    expect(result.weights.identity).toBe(0.5)
  })

  it('handles edge cases in normalizeSignals', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: NaN,
      contribution: undefined
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
    expect(normalized.contribution).toBe(0)
  })

  it('handles zero total weight in aggregateScore and explainScore', () => {
    const zeroWeights = {
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
    const normalized = normalizeSignals({ identity: 0.9 })
    expect(aggregateScore(normalized, zeroWeights)).toBe(0)
    const breakdown = explainScore(normalized, zeroWeights)
    expect(breakdown.identity).toBe(0)
  })

  it('handles partial or empty weights/signals in aggregateScore and explainScore', () => {
    const partialSignals: TrustSignals = {}
    const partialWeights: Partial<Record<TrustSignalName, number>> = {}
    expect(
      aggregateScore(
        normalizeSignals(partialSignals),
        partialWeights as Record<TrustSignalName, number>
      )
    ).toBe(0)
    const breakdown = explainScore(
      normalizeSignals(partialSignals),
      partialWeights as Record<TrustSignalName, number>
    )
    expect(breakdown.identity).toBe(0)
  })

  it('computes identity signal accurately', () => {
    expect(
      computeIdentitySignal({ verified: true, mfa: true, riskScore: 0.2 })
    ).toBeCloseTo(0.98)
    expect(computeIdentitySignal({ verified: false, mfa: false })).toBe(0)
  })
})
