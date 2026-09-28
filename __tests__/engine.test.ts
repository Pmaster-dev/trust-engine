import { describe, expect, it } from '@jest/globals'
import { computeTrust } from '../src/engine.js'
import { normalizeSignals } from '../src/utils/normalize.js'
import { aggregateScore } from '../src/utils/aggregate.js'
import { explainScore } from '../src/utils/explain.js'
import { TrustSignalName } from '../src/types.js'
import { computeIdentitySignal } from '../src/signals/*.ts'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown.identity).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.18)
  })

  it('handles custom weights and boundary signal values correctly', () => {
    const signals = {
      identity: 1.5, // clamped to 1
      behavior: -0.5, // clamped to 0
      reputation: NaN, // mapped to 0
      contribution: 0.5
    }
    const customWeights = { identity: 0.5, behavior: 0.5 }
    const result = computeTrust(signals, customWeights)

    expect(result.score).toBeGreaterThan(0)
    expect(result.weights.identity).toBe(0.5)
    expect(result.breakdown.behavior).toBe(0)
  })

  it('handles empty signals and zero weight sum edge cases', () => {
    const normalized = normalizeSignals({})
    const zeroWeights = { identity: 0 } as Record<TrustSignalName, number>
    expect(aggregateScore(normalized, zeroWeights)).toBe(0)
    expect(explainScore(normalized, zeroWeights).identity).toBe(0)
  })

  it('computes identity signal correctly', () => {
    expect(
      computeIdentitySignal({ verified: true, mfa: true, riskScore: 0.2 })
    ).toBe(0.98)
    expect(computeIdentitySignal({ verified: false, mfa: false })).toBe(0)
  })

  it('performance benchmark - 100,000 iterations', () => {
    const signals = {
      identity: 0.8,
      behavior: 0.6,
      reputation: 0.9,
      security: 0.95
    }
    const start = performance.now()
    for (let i = 0; i < 100_000; i++) {
      computeTrust(signals)
    }
    const duration = performance.now() - start
    expect(duration).toBeLessThan(1000)
  })
})
