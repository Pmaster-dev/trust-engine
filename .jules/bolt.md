## 2025-05-17 - Allocation Overhead in Trust Engine Hot Path

**Learning:** `Object.keys()`, `Object.values().reduce()`, and inner array
allocations in engine calculations create significant GC pressure and overhead
(~22% slower execution over 1M iterations). Fast-pathing immutable default
weights and using `for...in` loops without array allocation eliminates redundant
iterations and object copies. **Action:** Avoid
`Object.keys()`/`Object.values()` in tight calculation loops; reuse static key
arrays and fast-path default configurations.
