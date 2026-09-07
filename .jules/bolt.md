## 2026-05-21 - Hot-Path Loop Optimization in Trust Engine

**Learning:** In TypeScript NodeNext ESM projects, explicit `.js` extensions are
required on relative specifiers. For hot-path calculations like `computeTrust`,
repeatedly allocating key/value arrays (`Object.keys`, `Object.values`),
creating closures (`.reduce`), calling `Math.max/min`, and spreading objects
introduces significant GC and execution overhead. Fast-pathing default weights,
static signal name arrays, direct `for..in` iteration, and branch-based clamping
reduced execution time by ~25%. **Action:** Fast-path default/static
configurations early, avoid `Object.keys()`/`Object.values()` inside tight
loops, and prefer manual clamping over function calls in hot paths.
