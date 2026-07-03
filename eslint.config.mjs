// eslint.config.mjs
import nx from '@nx/eslint-plugin';

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
    onlyDependOnLibsWithTags: [
      'scope:feature',
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

  {
    sourceTag: 'scope:ui',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },

  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: [],
  },

  {
    sourceTag: 'scope:models',
    onlyDependOnLibsWithTags: [],
  },
];

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },

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

  {
    files: ['api/migrations/**/*.{ts,tsx,cts,mts,js,jsx,cjs,mjs}'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];