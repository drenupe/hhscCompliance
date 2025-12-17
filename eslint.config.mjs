// eslint.config.mjs
import nx from '@nx/eslint-plugin';

/**
 * Enterprise module boundaries:
 * - type:* = architecture layering
 * - scope:* = domain grouping
 * - surface:* = platform (web/api)
 *
 * Key rule: type:app may depend on type:shell (and other layers),
 * and also on scope:* libs (since your libs carry scope tags).
 */
const depConstraints = [
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: [
      'type:shell',
      'type:feature',
      'type:ui',
      'type:data-access',
      'type:util',

      // allow scope-tagged libs (including web-shell)
      'scope:shell',
      'scope:feature',
      'scope:ui',
      'scope:data',
      'scope:shared',
      'scope:models',

      // allow same-surface libs if you want to keep surface tags in play
      'surface:web',
    ],
  },
  {
    sourceTag: 'scope:shell',
    onlyDependOnLibsWithTags: [
      'scope:shared',
      'scope:ui',
      'scope:data',
      'scope:feature',
      'scope:models',
    ],
  },
  {
    sourceTag: 'scope:feature',
    onlyDependOnLibsWithTags: [
      'scope:shared',
      'scope:ui',
      'scope:data',
      'scope:models',
    ],
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

  // Global Nx module boundaries (with depConstraints)
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
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints,
        },
      ],
    },
  },

  // Allow migrations to import via relative paths
  {
    files: ['api/migrations/**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
