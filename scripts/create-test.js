#!/usr/bin/env node

/**
 * Test Generator Script
 * 
 * Usage:
 *   node scripts/create-test.js component path/to/Component.tsx
 *   node scripts/create-test.js util path/to/utility.ts
 * 
 * This script generates a basic test file template for a given component or utility.
 */

const fs = require('fs');
const path = require('path');

// Get arguments
const testType = process.argv[2];
const filePath = process.argv[3];

if (!testType || !filePath) {
  console.error('Usage: node scripts/create-test.js [component|util] path/to/file.tsx');
  process.exit(1);
}

// Validate test type
if (!['component', 'util'].includes(testType)) {
  console.error('Test type must be either "component" or "util"');
  process.exit(1);
}

// Process file path
const fullPath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(fullPath)) {
  console.error(`File not found: ${fullPath}`);
  process.exit(1);
}

// Extract component/utility name and file extension
const fileName = path.basename(fullPath);
const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.');
const fileExt = path.extname(fullPath);
const isTypeScript = fileExt === '.ts' || fileExt === '.tsx';
const isReactComponent = fileExt === '.jsx' || fileExt === '.tsx';

// Determine relative path from src
const srcPath = fullPath.replace(process.cwd(), '').replace(/^\/src\//, '');
const dirPath = path.dirname(srcPath);

// Create test directory if it doesn't exist
const testDir = path.join(process.cwd(), '__tests__', dirPath);
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Create test file path
const testFilePath = path.join(
  testDir,
  `${fileNameWithoutExt}.test${isTypeScript ? '.tsx' : '.js'}`
);

// Generate test template based on type
let testContent = '';

if (testType === 'component') {
  testContent = `/**
 * ${fileNameWithoutExt} Component Tests
 */
import React from 'react';
import { render, screen${isReactComponent ? ', fireEvent' : ''} } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ${fileNameWithoutExt} } from '@/${dirPath}/${fileNameWithoutExt}';

describe('${fileNameWithoutExt} Component', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<${fileNameWithoutExt} />);
    
    // Add assertions here
    // Example: expect(screen.getByText('Some text')).toBeInTheDocument();
  });

  it('handles user interactions', () => {
    render(<${fileNameWithoutExt} />);
    
    // Example: 
    // const button = screen.getByRole('button');
    // fireEvent.click(button);
    // expect(something).toHaveChanged();
  });

  it('handles error states appropriately', () => {
    // Test error handling
  });
});
`;
} else { // utility
  testContent = `/**
 * ${fileNameWithoutExt} Utility Tests
 */
${isTypeScript ? `import { ${fileNameWithoutExt} } from '@/${dirPath}/${fileNameWithoutExt}';` : `const { ${fileNameWithoutExt} } = require('@/${dirPath}/${fileNameWithoutExt}');`}

describe('${fileNameWithoutExt} Utility', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
    jest.clearAllMocks();
  });

  it('performs its primary function correctly', () => {
    // Test main functionality
    // Example: expect(${fileNameWithoutExt}(input)).toEqual(expectedOutput);
  });

  it('handles edge cases properly', () => {
    // Test with empty input
    // Test with invalid input
    // Test with boundary values
  });

  it('handles errors appropriately', () => {
    // Test error handling
  });
});
`;
}

// Write test file
fs.writeFileSync(testFilePath, testContent);
console.log(`Created test file: ${testFilePath}`);