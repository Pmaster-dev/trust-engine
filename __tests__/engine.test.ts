import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
    expect(result.breakdown.identity).toBeCloseTo(0.162)
  })

  it('computes a valid trust score with custom weights', () => {
    const result = computeTrust({ identity: 0.9 }, { identity: 0.5 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.5)
  })

  it('handles zero weights safely', () => {
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
    const result = computeTrust({ identity: 0.9 }, zeroWeights)
    expect(result.score).toBe(0)
  })
})
