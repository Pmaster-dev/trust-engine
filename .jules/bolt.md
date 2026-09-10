## 2026-03-31 - Trust Engine Calculation Bottlenecks & Memory Allocations

**Learning:** `Object.values(weights).reduce()` and `Object.keys()` in hot
evaluation loops create significant GC overhead via intermediate array and
closure allocations. In Node/V8, using `for...in` loops and passing pre-computed
`weightSum` from `aggregateScore` to `explainScore` improved `computeTrust`
throughput by ~22% (from ~547k to ~698k ops/sec). **Action:** Always prefer
reusing pre-computed values (like `weightSum`) across calculation pipelines and
avoid array allocation helpers (`Object.values`, `Object.keys`) inside hot
computation utilities.
