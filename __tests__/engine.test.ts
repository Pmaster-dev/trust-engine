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
    expect(result.weights.identity).toBe(0.18)
  })

  it('normalizes signals correctly', () => {
    const normalized = normalizeSignals({
      identity: 0.9,
      behavior: -0.5,
      reputation: 1.5,
      contribution: NaN
    })
    expect(normalized.identity).toBe(0.9)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(1)
    expect(normalized.contribution).toBe(0)
    expect(normalized.governance).toBe(0)
  })

  it('aggregates score accurately', () => {
    const signals = normalizeSignals({ identity: 1.0 })
    const weights = {
      identity: 0.5,
      behavior: 0.5,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const score = aggregateScore(signals, weights)
    expect(score).toBe(0.5)
  })

  it('explains score breakdown', () => {
    const signals = normalizeSignals({ identity: 1.0, behavior: 1.0 })
    const weights = {
      identity: 0.5,
      behavior: 0.5,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const breakdown = explainScore(signals, weights)
    expect(breakdown.identity).toBe(0.5)
    expect(breakdown.behavior).toBe(0.5)
  })
})
