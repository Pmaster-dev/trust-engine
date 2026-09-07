import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { defaultWeights } from '../src/weights/default.js'
import { TrustSignalName } from '../src/types.js'

describe('Trust Engine', () => {
  it('computes a valid trust score with default weights', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.weights).toBeDefined()
  })

  it('computes trust score when passing empty object or defaultWeights explicitly', () => {
    const res1 = computeTrust({ identity: 0.9 }, {})
    const res2 = computeTrust({ identity: 0.9 }, defaultWeights)
    expect(res1.score).toBe(res2.score)
  })

  it('computes trust score with custom weights overriding defaults', () => {
    const customWeights = {
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
    const result = computeTrust({ identity: 0.8, behavior: 0.6 }, customWeights)
    expect(result.score).toBeCloseTo(0.7)
    expect(result.breakdown.identity).toBeCloseTo(0.4)
    expect(result.breakdown.behavior).toBeCloseTo(0.3)
  })

  it('handles custom non-default weights in aggregateScore and explainScore with missing signals', () => {
    const customWeights = {
      identity: 0.4,
      behavior: 0.6,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const signals: Record<TrustSignalName, number> = {
      identity: 0.5,
      behavior: 0,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const score = aggregateScore(signals, customWeights)
    expect(score).toBeCloseTo(0.2) // (0.5 * 0.4 + 0) / 1.0 = 0.2

    const breakdown = explainScore(signals, customWeights)
    expect(breakdown.identity).toBeCloseTo(0.2)
    expect(breakdown.behavior).toBe(0)
  })

  it('handles default weights in aggregateScore and explainScore with missing signals', () => {
    const signals: Record<TrustSignalName, number> = {
      identity: 0.5,
      behavior: 0,
      reputation: 0,
      contribution: 0,
      consistency: 0,
      accessibility: 0,
      security: 0,
      governance: 0,
      intent: 0
    }
    const score = aggregateScore(signals, defaultWeights)
    expect(score).toBeGreaterThan(0)

    const breakdown = explainScore(signals, defaultWeights)
    expect(breakdown.identity).toBeGreaterThan(0)
    expect(breakdown.behavior).toBe(0)
  })

  it('handles zero sum weights gracefully in aggregateScore and explainScore', () => {
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
    const normalized = normalizeSignals({ identity: 0.9 })
    expect(aggregateScore(normalized, zeroWeights)).toBe(0)
    const breakdown = explainScore(normalized, zeroWeights)
    expect(breakdown.identity).toBe(0)
  })

  it('normalizes signals clamping between 0 and 1 and handling NaN / null / undefined', () => {
    const normalized = normalizeSignals({
      identity: 1.5,
      behavior: -0.5,
      security: NaN,
      reputation: null as unknown as number
    })
    expect(normalized.identity).toBe(1)
    expect(normalized.behavior).toBe(0)
    expect(normalized.security).toBe(0)
    expect(normalized.reputation).toBe(0)
    expect(normalized.governance).toBe(0)
  })
})
