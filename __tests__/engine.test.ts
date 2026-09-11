import { describe, it, expect } from '@jest/globals'
import { computeTrust } from '../src/engine.js'

describe('Trust Engine', () => {
  it('computes a valid trust score', () => {
    const score = computeTrust({ identity: 0.9 })
    expect(score.score).toBeGreaterThan(0)
  })
})
