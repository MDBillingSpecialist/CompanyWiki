/**
 * Path Utilities
 * 
 * Functions for handling and validating file paths.
 * Ensures security by preventing path traversal attacks.
 * 
 * #tags: files, paths, security
 */
import path from 'path';
import fs from 'fs';

// Base content directory for the wiki
const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get the absolute path to the content directory
 */
export function getContentDirectory(): string {
  return contentDirectory;
}

/**
 * Check if a path is valid and within the content directory
 */
export function isValidContentPath(pathToCheck: string): boolean {
  // Normalize the path to resolve .. and . segments
  const normalizedPath = normalizePath(pathToCheck);
  
  // Check if the path is within the content directory
  const absolutePath = resolveContentPath(normalizedPath);
  return absolutePath.startsWith(contentDirectory);
}

/**
 * Normalize a path by resolving .. and . segments
 */
export function normalizePath(pathToNormalize: string): string {
  // Remove leading and trailing slashes
  const trimmedPath = pathToNormalize.trim().replace(/^\/+|\/+$/g, '');
  
  // Normalize path to resolve . and .. segments
  const normalizedPath = path.normalize(trimmedPath);
  
  // Handle empty path
  return normalizedPath === '.' ? '' : normalizedPath;
}

/**
 * Resolve a relative path to an absolute path within the content directory
 */
export function resolveContentPath(relativePath: string): string {
  // Normalize the path first
  const normalizedPath = normalizePath(relativePath);
  
  // Join with the content directory
  return path.join(contentDirectory, normalizedPath);
}

/**
 * Convert an absolute path to a relative path from the content directory
 */
export function getRelativePath(absolutePath: string): string {
  // Check if the path is within the content directory
  if (!absolutePath.startsWith(contentDirectory)) {
    throw new Error('Path is not within the content directory');
  }
  
  // Get the relative path
  return path.relative(contentDirectory, absolutePath);
}

/**
 * Sanitize a path to prevent path traversal attacks
 */
export function sanitizePath(pathToSanitize: string): string {
  // Normalize the path
  const normalizedPath = normalizePath(pathToSanitize);
  
  // Remove any segments that try to navigate up the directory tree
  const segments = normalizedPath.split(path.sep).filter(segment => segment !== '..');
  
  // Join the segments back together
  return segments.join(path.sep);
}

/**
 * Get the file extension from a path
 */
export function getFileExtension(filePath: string): string | null {
  const extname = path.extname(filePath);
  return extname ? extname.toLowerCase() : null;
}

/**
 * Check if a path points to a markdown file
 */
export function isMarkdownFile(filePath: string): boolean {
  const extension = getFileExtension(filePath);
  return extension === '.md' || extension === '.mdx';
}

/**
 * Split a path into its segments
 */
export function getPathSegments(pathToSplit: string): string[] {
  return normalizePath(pathToSplit).split(path.sep).filter(Boolean);
}

/**
 * Join path segments into a path
 */
export function joinPathSegments(segments: string[]): string {
  return segments.join(path.sep);
}

/**
 * Validate a content path and return validation result
 */
export function validateContentPath(pathToValidate: string): { valid: boolean; message?: string } {
  // Check if the path is empty
  if (!pathToValidate) {
    return { valid: true };
  }
  
  // Sanitize the path
  const sanitizedPath = sanitizePath(pathToValidate);
  
  // Check if the path was modified during sanitization
  if (sanitizedPath !== normalizePath(pathToValidate)) {
    return { 
      valid: false, 
      message: 'Path contains invalid components' 
    };
  }
  
  // Check if the path is within the content directory
  if (!isValidContentPath(pathToValidate)) {
    return { 
      valid: false, 
      message: 'Path is outside the content directory' 
    };
  }
  
  return { valid: true };
}

/**
 * Check if a file or directory exists
 */
export function exists(pathToCheck: string): boolean {
  return fs.existsSync(pathToCheck);
}

/**
 * Check if a path is a directory
 */
export function isDirectory(pathToCheck: string): boolean {
  try {
    return fs.existsSync(pathToCheck) && fs.statSync(pathToCheck).isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * Check if a path is a file
 */
export function isFile(pathToCheck: string): boolean {
  try {
    return fs.existsSync(pathToCheck) && fs.statSync(pathToCheck).isFile();
  } catch (error) {
    return false;
  }
}

/**
 * Generate a slug from a file path
 */
export function generateSlugFromPath(filePath: string): string {
  const relativePath = filePath.startsWith(contentDirectory) 
    ? getRelativePath(filePath) 
    : normalizePath(filePath);
    
  return relativePath.replace(/\.(md|mdx)$/, '');
}
