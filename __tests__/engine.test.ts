import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('handles empty signals and weights gracefully', () => {
    const result = computeTrust({})
    expect(result.score).toBe(0)
  })

  it('normalizes signals correctly clamping values to [0, 1]', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: NaN
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
  })

  it('aggregates and explains scores accurately', () => {
    const weights = { identity: 0.5, behavior: 0.5 }
    const signals = { identity: 1, behavior: 0.8 }
    const score = aggregateScore(signals, weights)
    const breakdown = explainScore(signals, weights)

    expect(score).toBeCloseTo(0.9)
    expect(breakdown.identity).toBeCloseTo(0.5)
    expect(breakdown.behavior).toBeCloseTo(0.4)
  })
})
