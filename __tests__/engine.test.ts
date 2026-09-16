import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { explainScore } from '../src/utils/explain.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('correctly explains score with explainScore', () => {
    const signals = { identity: 0.8, behavior: 0.6 }
    const weights = { identity: 0.5, behavior: 0.5 }
    const breakdown = explainScore(signals, weights)

    expect(breakdown.identity).toBeCloseTo(0.4)
    expect(breakdown.behavior).toBeCloseTo(0.3)
  })

  it('handles zero weight sum gracefully', () => {
    const signals = { identity: 0.8 }
    const weights = { identity: 0 }
    const breakdown = explainScore(signals, weights)

    expect(breakdown.identity).toBe(0)
  })
})
