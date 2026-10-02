import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { defaultWeights } from '../src/weights/default.js'
import { TrustSignalName } from '../src/types.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with defaults', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights).toEqual(defaultWeights)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('computes a valid trust score with custom weights', () => {
    const result = computeTrust({ identity: 0.9 }, { identity: 0.5 })
    expect(result.weights.identity).toBe(0.5)
    expect(result.score).toBeGreaterThan(0)
  })

  it('handles zero weight sum gracefully in aggregateScore and explainScore', () => {
    const zeroWeights = { identity: 0, behavior: 0 } as Record<
      TrustSignalName,
      number
    >
    const normalized = normalizeSignals({ identity: 0.8 })
    expect(aggregateScore(normalized, zeroWeights)).toBe(0)
    const breakdown = explainScore(normalized, zeroWeights)
    expect(breakdown.identity).toBe(0)
  })

  it('correctly normalizes signals including clamping and fallback for NaN / null', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: NaN,
      contribution: null as unknown as number
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
    expect(normalized.contribution).toBe(0)
  })
})
