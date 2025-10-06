import nx from '@nx/eslint-plugin';

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
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
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
    // Override or add rules here
    rules: {},
  },
];

// eslint.config.mjs (or project .eslintrc)
const depConstraints = [
  { sourceTag: 'type:app', onlyDependOnLibsWithTags: [] },
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
