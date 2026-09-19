## 2025-05-18 - Eliminating Temporary Array Allocations in Calculation Hot Paths

**Learning:** Functions like `normalizeSignals`, `aggregateScore`, and
`explainScore` were allocating 4 temporary arrays (`SIGNAL_NAMES`,
`Object.keys()`, `Object.values()`) on every calculation. In high-throughput
scoring engines, hoisting static array constants and using `for...in` key
iteration eliminates GC pressure and heap allocation overhead without
sacrificing readability. **Action:** Look for `Object.keys()`,
`Object.values()`, and inline array literals inside repeatedly called math/data
processing utility functions.
