## 2025-05-18 - Optimized Trust Score Engine Calculations

**Learning:** Array allocations (`Object.keys`, `Object.values`, array literals
in loops) and `Math.max`/`Math.min` function call overhead inside hot
computational loops (`normalizeSignals`, `aggregateScore`, `explainScore`)
account for measurable execution latency. Avoid `Object.keys` / `Object.values`
and unnecessary default object spreads in hot calculation paths.

**Action:** Hoist static signal arrays, use direct `for...in` key iteration or
index-based loops with explicit conditional clamping, and short-circuit default
object spread when default weights are used.
