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

  it('normalizes signals correctly', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: 0.5
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0.5)
    expect(normalized.consistency).toBe(0)
  })

  it('calculates aggregate score correctly', () => {
    const score = aggregateScore(
      { identity: 1, behavior: 0.5 },
      { identity: 0.5, behavior: 0.5 }
    )
    expect(score).toBe(0.75)
  })

  it('handles zero weights gracefully in aggregateScore and explainScore', () => {
    const score = aggregateScore({ identity: 1 }, { identity: 0 })
    expect(score).toBe(0)

    const breakdown = explainScore({ identity: 1 }, { identity: 0 })
    expect(breakdown.identity).toBe(0)
  })
})
