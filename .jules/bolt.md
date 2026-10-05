# Bolt's Journal - Critical Learnings

## 2025-05-18 - Avoid array allocation in hot calculation loops

**Learning:** Functions like `normalizeSignals`, `aggregateScore`, and
`explainScore` in performance-critical calculation engines can incur significant
GC overhead if they allocate intermediate arrays (`Object.keys`,
`Object.values`, or inline arrays) on every call. **Action:** Use static
constant arrays outside hot function scopes and direct `for...in` loops over
objects to avoid intermediate array allocations.
