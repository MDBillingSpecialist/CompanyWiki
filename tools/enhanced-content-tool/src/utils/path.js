/**
 * Path utilities for content management
 */
const fs = require('fs');
const path = require('path');

/**
 * Create directories recursively if they don't exist
 * @param {string} dirPath - Directory path to create
 */
function createDirectories(dirPath) {
  if (fs.existsSync(dirPath)) {
    return;
  }
  
  // Create parent directories recursively
  createDirectories(path.dirname(dirPath));
  
  // Create this directory
  fs.mkdirSync(dirPath);
}

/**
 * Normalize a file path for the current OS
 * @param {string} filePath - File path to normalize
 * @returns {string} - Normalized file path
 */
function normalizePath(filePath) {
  return path.normalize(filePath);
}

/**
 * Convert a file path to a wiki URL path
 * @param {string} filePath - File path to convert
 * @param {string} contentDir - Content directory root
 * @returns {string} - Wiki URL path
 */
function filePathToWikiPath(filePath, contentDir) {
  // Get relative path from content directory
  const relativePath = path.relative(contentDir, filePath);
  
  // Convert to URL path format
  return '/wiki/' + relativePath
    .replace(/\.md$/, '')  // Remove .md extension
    .replace(/\\/g, '/');  // Convert backslashes to forward slashes
}

/**
 * Convert a wiki URL path to a file path
 * @param {string} wikiPath - Wiki URL path to convert
 * @param {string} contentDir - Content directory root
 * @returns {string} - File path
 */
function wikiPathToFilePath(wikiPath, contentDir) {
  // Remove /wiki/ prefix
  const relativePath = wikiPath.replace(/^\/wiki\//, '');
  
  // Convert to file path
  return path.join(contentDir, relativePath + '.md');
}

/**
 * Generate a filename from a title
 * @param {string} title - Document title
 * @returns {string} - Filename (without extension)
 */
function titleToFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

module.exports = {
  createDirectories,
  normalizePath,
  filePathToWikiPath,
  wikiPathToFilePath,
  titleToFilename
};
