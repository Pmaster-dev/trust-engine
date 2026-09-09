import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9, behavior: 0.8 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThanOrEqual(1)
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.breakdown.behavior).toBeGreaterThan(0)
  })

  it('handles empty signal input safely', () => {
    const result = computeTrust({})
    expect(result.score).toBe(0)
    expect(result.breakdown.identity).toBe(0)
  })

  it('clamps signal values outside [0, 1] range', () => {
    const result = computeTrust({ identity: 1.5, behavior: -0.5 })
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.breakdown.behavior).toBe(0)
  })

  it('supports custom weights override', () => {
    const customWeights = { identity: 1.0, behavior: 0.0 }
    const result = computeTrust({ identity: 0.5, behavior: 1.0 }, customWeights)
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(1.0)
  })

  it('handles zero weight sum gracefully', () => {
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
    const score = aggregateScore({ identity: 0.8 }, zeroWeights)
    expect(score).toBe(0)

    const breakdown = explainScore({ identity: 0.8 }, zeroWeights)
    expect(breakdown.identity).toBe(0)
  })
})
