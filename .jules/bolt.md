## 2026-03-30 - Single-pass computation fusion in score calculation engine

**Learning:** In pipelines processing small fixed schema objects (e.g., trust
signal maps), chaining separate helper functions (`normalizeSignals` ->
`aggregateScore` -> `explainScore`) creates intermediate object allocations and
repeats `Object.keys()` iterations over the same set of keys multiple times.
Fusing the calculation into a single pass and skipping object copy when default
weights are used reduced `computeTrust` execution time by ~48%. **Action:**
Identify multi-stage utility pipelines operating on the same key-value object
structures and fuse them into single-pass loops where appropriate.
