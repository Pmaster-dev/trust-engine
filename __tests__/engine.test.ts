import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const result = computeTrust({ identity: 0.9 })
    expect(result.score).toBeGreaterThan(0)
  })
})
