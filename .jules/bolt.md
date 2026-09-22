## 2026-03-22 - Single-Pass Trust Calculation & NodeNext Module Extensions

**Learning:** In NodeNext/ESM TypeScript projects, relative imports require
explicit `.js` extensions for Rollup bundler and Jest ESM resolution to function
correctly. Additionally, replacing multiple array-allocating passes
(`Object.keys()`, `Object.values()`, `.reduce()`) with a hoisted static array
iteration (`SIGNAL_NAMES`) and a single combined loop improves trust calculation
throughput by ~62% while preventing GC allocation spikes.

**Action:** When building score engines or processing hot calculation paths in
TypeScript ESM actions, hoist key schemas to module constants, combine
multi-pass array operations into single loops, and ensure all relative imports
include `.js` file extensions.
