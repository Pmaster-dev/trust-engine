## 2026-03-30 - Object iteration memory allocations in calculation hot paths

**Learning:** Using `Object.values(obj).reduce(...)` and `Object.keys(obj)` in
frequently called calculation utility functions (`explainScore` and
`aggregateScore`) creates temporary array allocations and closure execution
overhead on every call. In V8, switching to direct `for...in` loops eliminates
array allocations and function callback frames, speeding up `explainScore` by
~26% and `aggregateScore` by ~27%. **Action:** In calculation hot paths over
small objects/maps, avoid helper methods like `Object.values().reduce()` or
`Object.keys()`. Use direct `for...in` or indexed loops to reduce GC pressure
and closure overhead.
