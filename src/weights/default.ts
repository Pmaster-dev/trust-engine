import { TrustSignalName } from '../types.js'

export const defaultWeights: Record<TrustSignalName, number> = {
  identity: 0.18,
  behavior: 0.12,
  reputation: 0.14,
  contribution: 0.1,
  consistency: 0.1,
  accessibility: 0.12,
  security: 0.1,
  governance: 0.07,
  intent: 0.07
}
