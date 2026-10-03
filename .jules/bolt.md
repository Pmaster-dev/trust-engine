## 2025-05-10 - Trust Engine Micro-optimizations

**Learning:**

- In TypeScript/Node.js hot paths, re-creating array literals (like key or name
  lists) inside frequently called functions creates unnecessary heap allocation
  overhead.
- Using `for...in` on trusted dictionary objects avoids allocating key/value
  arrays (`Object.keys`, `Object.values`) during aggregation/breakdown loops.
- Avoid spreading constant objects (`{ ...defaultWeights, ...weights }`) when
  optional arguments are omitted or empty.

**Action:**

- Move static array declarations to module scope.
- Use `for...in` directly on objects when calculating weighted sums.
- Check if optional override objects are supplied before merging with default
  maps.
