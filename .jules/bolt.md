# Bolt's Journal

## 2026-09-27 - Static Array Iteration for Trust Signal Calculation
**Learning:** Calling `Object.keys()`, `Object.values()`, or creating array literals inside hot calculation functions (`normalizeSignals`, `aggregateScore`, `explainScore`) creates unnecessary heap allocations and GC pressure on every score calculation.
**Action:** Use a static `SIGNAL_NAMES` constant array for iterating over predefined signal properties and fast inline conditional branching for clamping.
