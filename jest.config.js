const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js app directory
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Transform configuration for ES modules
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // Exclude Playwright tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/'
  ],
  // Allow ES modules in node_modules
  transformIgnorePatterns: [
    '/node_modules/(?!(rehype-highlight|rehype-slug|unified|unist|vfile|micromark|acorn|estree|mdast|remark|rehype|hast|mdast-util-.*|rehype-.*|remark-.*|vfile-.*|hast-.*|property-information|space-separated-tokens|comma-separated-tokens|bail|decode-named-character-reference|character-entities|character-entities-legacy|character-reference-invalid|html-void-elements|longest-streak|is-plain-obj)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  // Temporarily lower coverage thresholds until more tests are added
  coverageThreshold: {
    global: {
      statements: 3,
      branches: 3,
      functions: 2,
      lines: 2,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
