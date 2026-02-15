// eslint.config.mjs
import nx from '@nx/eslint-plugin';

/**
 * Dependency constraints for @nx/enforce-module-boundaries
 * using your scope/type tagging strategy.
 */
const depConstraints = [
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:data-access',
      'type:ui',
      'type:util',
      'type:shared',
      'type:model',
    ],
  },

  {
    sourceTag: 'scope:shell',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:data-access',
      'type:ui',
      'type:util',
      'type:shared',
      'type:model',
    ],
  },
  {
    sourceTag: 'scope:feature',
    onlyDependOnLibsWithTags: ['scope:shared', 'scope:ui', 'scope:data', 'scope:models'],
  },
  {
    sourceTag: 'scope:data',
    onlyDependOnLibsWithTags: ['scope:models', 'scope:shared'],
  },
  { sourceTag: 'scope:ui', onlyDependOnLibsWithTags: ['scope:shared'] },
  { sourceTag: 'scope:shared', onlyDependOnLibsWithTags: [] },
  { sourceTag: 'scope:models', onlyDependOnLibsWithTags: [] },
];


export default [
  // Nx base presets
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  // Global ignores
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

  // Global Nx module boundaries (with your depConstraints)
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          // Keep eslint configs allowed as you had
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints,
        },
      ],
    },
  },

  // 🔓 Allow migrations to import via relative paths (e.g. libs/shared-models)
  {
    files: ['api/migrations/**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
