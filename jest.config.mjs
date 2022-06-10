const targetCoverage = 0

export default {
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.mjs'],
  testPathIgnorePatterns: ['jest-helpers.mjs'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.mjs', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: targetCoverage,
      functions: targetCoverage,
      lines: targetCoverage
    }
  },
  transform: {}
}
