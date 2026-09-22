import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { defaultWeights } from '../src/weights/default.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('handles custom weights correctly', () => {
    const result = computeTrust(
      { identity: 0.8 },
      { identity: 0.5, behavior: 0.5 }
    )
    expect(result.weights.identity).toBe(0.5)
    expect(result.weights.behavior).toBe(0.5)
    expect(result.score).toBeGreaterThan(0)
  })

  it('handles edge cases (empty signals, NaN, negative, out-of-bounds values)', () => {
    const result = computeTrust({
      identity: -0.5,
      behavior: 1.5,
      reputation: NaN
    })
    expect(result.breakdown.identity).toBe(0)
    expect(result.breakdown.reputation).toBe(0)
    expect(result.score).toBeGreaterThan(0)
  })

  it('normalizes signals correctly', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.2,
      reputation: NaN
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
  })

  it('aggregates score correctly', () => {
    const normalized = normalizeSignals({ identity: 0.8, behavior: 0.6 })
    const score = aggregateScore(normalized, defaultWeights)
    expect(score).toBeGreaterThan(0)
  })

  it('explains score correctly', () => {
    const normalized = normalizeSignals({ identity: 0.8, behavior: 0.6 })
    const breakdown = explainScore(normalized, defaultWeights)
    expect(breakdown.identity).toBeGreaterThan(0)
    expect(breakdown.behavior).toBeGreaterThan(0)
  })
})
