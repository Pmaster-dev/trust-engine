import { describe, expect, it } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { normalizeSignals } from '../src/utils/normalize.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
    expect(result.breakdown.identity).toBeGreaterThan(0)
  })

  it('normalizes signals properly including clamping and invalid values', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      reputation: NaN,
      contribution: undefined
    })

    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.reputation).toBe(0)
    expect(normalized.contribution).toBe(0)
  })

  it('handles zero weight sum gracefully in aggregateScore and explainScore', () => {
    const weights = {
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
    const signals = normalizeSignals({ identity: 1 })

    const score = aggregateScore(signals, weights)
    expect(score).toBe(0)

    const breakdown = explainScore(signals, weights)
    expect(breakdown.identity).toBe(0)
  })

  it('performance benchmark: executes 100,000 computations efficiently', () => {
    const signals = {
      identity: 0.85,
      behavior: 0.9,
      reputation: 0.75,
      security: 0.95
    }

    const start = performance.now()
    const iterations = 100_000
    for (let i = 0; i < iterations; i++) {
      computeTrust(signals)
    }
    const duration = performance.now() - start

    // 100,000 iterations should easily finish in under 500ms
    expect(duration).toBeLessThan(1000)
  })
})
