// apps/api/jest.config.ts  (unchanged; unit tests only)
export default {
  displayName: 'api',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/api',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],   // ⬅ add this line to scope to unit tests
};
