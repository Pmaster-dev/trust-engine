import { computeTrust } from '../src/engine.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
  })

  it('handles custom weights and clamped inputs correctly', () => {
    const result = computeTrust(
      { identity: 1.5, behavior: -0.5, security: Number.NaN },
      { identity: 0.5, behavior: 0.5 }
    )
    expect(result.score).toBeCloseTo(0.5 / 1.7)
    expect(result.breakdown.identity).toBeCloseTo(0.5 / 1.7)
    expect(result.breakdown.behavior).toBe(0)
  })

  it('handles zero sum weights gracefully', () => {
    const result = computeTrust(
      { identity: 0.9 },
      {
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
    )
    expect(result.score).toBe(0)
  })
})
