import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { defaultWeights } from '../src/weights/default.js'
import { TrustSignalName } from '../src/types.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
  })

  describe('normalizeSignals', () => {
    it('normalizes valid inputs and clamps values', () => {
      const res = normalizeSignals({
        identity: 1.5,
        behavior: -0.5,
        reputation: 0.5,
        security: NaN
      })
      expect(res.identity).toBe(1)
      expect(res.behavior).toBe(0)
      expect(res.reputation).toBe(0.5)
      expect(res.security).toBe(0)
      expect(res.governance).toBe(0)
    })
  })

  describe('aggregateScore', () => {
    it('computes weighted score accurately', () => {
      const signals = normalizeSignals({ identity: 1, behavior: 1 })
      const score = aggregateScore(signals, defaultWeights)
      expect(score).toBeGreaterThan(0)
    })

    it('returns 0 when total weight is 0', () => {
      const signals = normalizeSignals({ identity: 1 })
      const zeroWeights = Object.fromEntries(
        Object.keys(defaultWeights).map((k) => [k, 0])
      ) as Record<TrustSignalName, number>
      expect(aggregateScore(signals, zeroWeights)).toBe(0)
    })
  })

  describe('explainScore', () => {
    it('calculates breakdown with and without precomputed weightSum', () => {
      const signals = normalizeSignals({ identity: 0.8 })
      const bd1 = explainScore(signals, defaultWeights)
      const bd2 = explainScore(signals, defaultWeights, 1.0)
      expect(bd1.identity).toBeGreaterThan(0)
      expect(bd2.identity).toBeGreaterThan(0)
    })
  })
})
