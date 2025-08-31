// apps/api/jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'api-unit',
      preset: '../jest.preset.js',
      testEnvironment: 'node',
      transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
      },
      moduleFileExtensions: ['ts', 'js', 'html'],
      coverageDirectory: '../coverage/api',
      testMatch: ['<rootDir>/src/**/*.spec.ts'],
    },
    {
      displayName: 'api-e2e',
      preset: '../jest.preset.js',
      testEnvironment: 'node',
      setupFiles: ['dotenv/config'],
      transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
      },
      moduleFileExtensions: ['ts', 'js', 'html'],
      testMatch: ['<rootDir>/test/**/*.e2e.spec.ts'],
    },
  ],
};

export default config;
