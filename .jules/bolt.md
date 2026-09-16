## 2026-05-21 - Single Pass Object.entries for Breakdown Calculations

**Learning:** Using `Object.values().reduce()` alongside `Object.keys()` in object aggregation functions creates double reflection overhead and allocates intermediate closure functions on every iteration.
**Action:** Replace separate `Object.values().reduce()` + `Object.keys()` iterations with a single `Object.entries()` traversal when computing values normalized by key weights.
