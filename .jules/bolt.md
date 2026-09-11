## 2026-03-08 - Array allocation caching in hot normalize function
**Learning:** Defining static signal name arrays outside function scope reduces garbage collection pressure during high-throughput signal evaluations.
**Action:** Always hoist fixed key/name arrays outside function execution contexts in performance-critical signal processing loops.
