/**
 * ESLint Configuration
 * 
 * This file contains the configuration for ESLint.
 * Previously, this was a bridge file that imported from the config directory.
 * Now the configuration is directly in this file following best practices.
 */

const { FlatCompat } = require("@eslint/eslintrc");
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
