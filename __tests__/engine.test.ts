import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const res = computeTrust({ identity: 0.9 })
    expect(res.score).toBeGreaterThan(0)
  })

  it('computes trust score with custom weights', () => {
    const res = computeTrust({ identity: 0.9 }, { identity: 0.5 })
    expect(res.score).toBeGreaterThan(0)
    expect(res.weights.identity).toBe(0.5)
  })
})
