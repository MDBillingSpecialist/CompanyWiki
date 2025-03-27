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
  // Generate JUnit XML report for CI
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
    }]
  ],
  // Set higher coverage thresholds to ensure better test quality
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 25,
      functions: 30,
      lines: 30,
    },
    // Set specific thresholds for critical code
    'src/lib/**/*.{ts,tsx}': {
      statements: 60,
      branches: 50,
      functions: 60,
      lines: 60,
    },
    'src/components/**/*.{ts,tsx}': {
      statements: 40,
      branches: 35,
      functions: 50,
      lines: 40,
    }
  },
}

module.exports = createJestConfig(customJestConfig)
