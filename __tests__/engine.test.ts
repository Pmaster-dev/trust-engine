import { describe, expect, it } from '@jest/globals'
import { computeTrust } from '../src/engine.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.breakdown.behavior).toBe(0)
  })

  it('handles custom weights correctly when all weights are overridden', () => {
    const customWeights = {
      identity: 1,
      behavior: 1,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const result = computeTrust({ identity: 1 }, customWeights)
    expect(result.weights.identity).toBe(1)
    expect(result.weights.behavior).toBe(1)
    expect(result.score).toBe(0.5) // (1*1 + 0*1) / (1 + 1) = 0.5
    expect(result.breakdown.identity).toBe(0.5)
  })

  it('clamps invalid or out-of-bound signal values', () => {
    const result = computeTrust({
      identity: 2.0,
      behavior: -1.0,
      reputation: NaN
    })
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.breakdown.behavior).toBe(0)
    expect(result.breakdown.reputation).toBe(0)
  })

  it('handles zero weight sum gracefully', () => {
    const customWeights = {
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
    const result = computeTrust({ identity: 1 }, customWeights)
    expect(result.score).toBe(0)
    expect(result.breakdown.identity).toBe(0)
  })
})
