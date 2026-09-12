## 2025-05-18 - Avoid array allocations in hot math/aggregation loops

**Learning:** Calling `Object.keys()` and `Object.values()` inside hot math
evaluation functions like `aggregateScore` or `explainScore` creates unnecessary
heap allocations and garbage collector pressure per evaluation. Using direct
`for...in` loops eliminates array allocations entirely while keeping code clean
and readable. **Action:** Prefer direct key iteration (`for...in`) or
single-pass loops over `Object.keys()` / `Object.values()` when computing scores
over objects in engine utility functions.
