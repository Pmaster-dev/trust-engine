import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
    expect(result.breakdown).toBeDefined()
    expect(result.weights).toBeDefined()
  })
})
