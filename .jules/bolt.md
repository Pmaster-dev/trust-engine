# Bolt's Journal - Performance Insights

## 2025-05-18 - Single-Pass Streaming for Multi-Stage Score Engine
**Learning:** Pipeline functions that normalize data, aggregate weighted sums, and calculate breakdowns independently create multiple intermediate object allocations and perform duplicate loop iterations (`Object.keys`, `Object.values`, array maps/filters). Combining these into a single pass over a const array of domain keys yields significant throughput improvement (~1.7x to 2.5x speedup) and reduces GC memory pressure.
**Action:** When designing data scoring engines or mathematical aggregators, combine normalization, sum accumulation, and relative breakdown scaling into a single indexed loop over constant signal keys rather than multi-pass pipe functions.
