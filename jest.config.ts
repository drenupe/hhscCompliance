/* eslint-disable */
export default {
  displayName: 'api',
  preset: '../jest.preset.js',            // repo-root -> api/ relative path
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/api',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
