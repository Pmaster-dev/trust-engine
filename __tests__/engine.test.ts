import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9, behavior: 0.8 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
  })

  it('computes trust score with custom weights', () => {
    const customWeights = { identity: 0.5, behavior: 0.5 }
    const result = computeTrust({ identity: 1.0, behavior: 0.5 }, customWeights)
    expect(result.score).toBeCloseTo(0.75 / 1.7)
    expect(result.weights.identity).toBe(0.5)
  })

  it('handles signals with invalid or missing values', () => {
    const result = computeTrust({
      identity: NaN,
      behavior: 1.5,
      security: -0.5
    })
    expect(result.breakdown.identity).toBe(0)
    expect(result.breakdown.behavior).toBeGreaterThan(0)
    expect(result.breakdown.security).toBe(0)
  })

  it('handles custom weights with zero total weight', () => {
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
    const result = computeTrust({ identity: 1.0 }, zeroWeights)
    expect(result.score).toBe(0)
  })
})
