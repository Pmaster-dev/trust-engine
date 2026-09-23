# Bolt's Journal - Performance Learnings

## 2025-05-18 - Avoid array allocations in hot utility paths

**Learning:** Functions called frequently during signal computation (like
`normalizeSignals`, `aggregateScore`, `explainScore`) shouldn't allocate
temporary arrays (`Object.keys`, `Object.values`, or in-function array literals)
in their hot loops. **Action:** Hoist constant arrays to module scope and use
direct property iteration (`for...in`) instead of
`Object.keys()`/`Object.values()` for hot object iteration.
