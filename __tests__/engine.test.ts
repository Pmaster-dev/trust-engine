import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { normalizeSignals } from '../src/utils/normalize.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const { score, breakdown, weights } = computeTrust({ identity: 0.9 })
    expect(score).toBeGreaterThan(0)
    expect(breakdown.identity).toBeGreaterThan(0)
    expect(weights.identity).toBe(0.18)
  })

  it('handles custom weights', () => {
    const { score, weights } = computeTrust(
      { identity: 0.8 },
      { identity: 0.5 }
    )
    expect(score).toBeGreaterThan(0)
    expect(weights.identity).toBe(0.5)
  })

  it('aggregateScore computes weighted average', () => {
    const score = aggregateScore({ identity: 1 }, { identity: 0.5 })
    expect(score).toBe(1)
  })

  it('aggregateScore handles zero weightSum', () => {
    const score = aggregateScore({ identity: 1 }, { identity: 0 })
    expect(score).toBe(0)
  })

  it('explainScore handles unprovided weightSum and zero weightSum', () => {
    const breakdown1 = explainScore({ identity: 1 }, { identity: 0.5 })
    expect(breakdown1.identity).toBe(1)

    const breakdown2 = explainScore({ identity: 1 }, { identity: 0 })
    expect(breakdown2.identity).toBe(0)
  })

  it('normalizeSignals clamps values and handles invalid inputs', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: NaN,
      security: undefined as unknown as number
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
    expect(normalized.security).toBe(0)
  })
})
