import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // Existing event-driven UI intentionally syncs browser state from effects.
      'react-hooks/set-state-in-effect': 'off',
      // The animated strands component keeps current render inputs in a ref.
      'react-hooks/refs': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'tailwind.config.js',
  ]),
]);
