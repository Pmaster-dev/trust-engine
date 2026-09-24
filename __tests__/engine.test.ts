import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
  })

  it('computes a valid trust score with custom weights', () => {
    const result = computeTrust(
      { identity: 0.8, behavior: 0.6 },
      { identity: 0.5, behavior: 0.5 }
    )
    expect(result.score).toBeCloseTo(0.7 / 1.7)
    expect(result.weights.identity).toBe(0.5)
  })

  it('normalizes signals clamping to [0, 1] and handling null/NaN', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.2,
      security: NaN,
      reputation: null as unknown as number
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.security).toBe(0)
    expect(normalized.reputation).toBe(0)
  })

  it('handles zero weight sum in aggregateScore', () => {
    const score = aggregateScore({ identity: 0.5 }, { identity: 0 })
    expect(score).toBe(0)
  })

  it('explains score correctly', () => {
    const breakdown = explainScore(
      { identity: 1 },
      { identity: 0.5, behavior: 0.5 }
    )
    expect(breakdown.identity).toBe(0.5)
    expect(breakdown.behavior).toBe(0)
  })
})
