## 2025-05-10 - Avoid redundant array allocations and Object.keys/values in hot scoring calculations

**Learning:** Calling `Object.keys()` or `Object.values()` in hot functions
creates temporary array allocations on every call. Inlining static signal name
lists at module scope and avoiding redundant `weightSum` reductions yields ~19%
performance improvement in throughput (~529k ops/sec to ~631k ops/sec).
**Action:** Always hoist static property/name arrays to module scope and avoid
`Object.keys`/`Object.values` in hot loop computations.
