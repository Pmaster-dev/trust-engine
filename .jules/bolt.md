# Bolt's Journal - Critical Learnings

## 2025-05-10 - Avoid allocations in hot paths for signal scoring

**Learning:** Functions like `normalizeSignals`, `aggregateScore`, and
`explainScore` in the trust calculation engine repeatedly allocated key/value
arrays via `Object.keys()` and `Object.values()` as well as signal name arrays
inside the function scope on every invocation. **Action:** Lift immutable arrays
to module scope and use direct object iteration/loops to avoid temporary array
allocations and garbage collection overhead.
