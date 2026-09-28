## 2025-05-18 - NodeNext ESM Specifier Extensions

**Learning:** Under `NodeNext` module resolution, relative import and export
statements in TypeScript files must include `.js` extensions. Omission causes
build errors during Rollup bundling (`npm run package`). **Action:** Always
include `.js` extensions on relative imports in `src/` and `__tests__/`.
