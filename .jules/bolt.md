## 2026-03-31 - V8 Hidden Class & Allocation Optimization in Hot Loop Math Pipelines

**Learning:** Dynamically building fixed-schema objects key-by-key in loops
using `Object.keys()` / `Object.values()` prevents V8 from optimizing property
lookup sites via Inline Caches (ICs) and generates heavy temporary array
allocations per invocation. Replacing dynamic key loops with explicit property
initialization for fixed-schema signal math reduced runtime from ~10,026ms to
~768ms for 5M operations (>13x throughput gain). **Action:** When operating on
hot paths with known fixed object schemas, prefer explicit property
initialization and direct property access over `Object.keys()` loop allocations
to allow V8 hidden class monomorphism.
