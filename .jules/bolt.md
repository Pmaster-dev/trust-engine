## 2025-05-18 - Eliminating Heap Allocations in Hot Compute Loops

**Learning:** High-frequency compute functions like `computeTrust` suffer from
heap allocation overhead when using `Object.keys()`, `Object.values()`,
`.reduce()`, or local array literals inside function bodies. Replacing these
with top-level constant arrays, direct `for...in` key iteration, and simple
loops reduced allocation pressure and sped up computation by ~24%. **Action:**
Avoid `Object.keys/values` and closures in core calculation pipelines; hoist
constant arrays and use direct loops.
