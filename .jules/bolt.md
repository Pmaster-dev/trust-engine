# Bolt's Journal

## 2025-05-10 - Avoiding Heap Allocations in Hot Signal Calculation Paths

**Learning:** Re-declaring arrays (e.g. key lists) and using `Object.keys()` /
`Object.values()` inside hot loops like `computeTrust` and `normalizeSignals`
causes significant unnecessary heap allocations and garbage collection overhead.
**Action:** Lift constant arrays to module scope and iterate object keys
directly without temporary array creation in core engine utilities.
