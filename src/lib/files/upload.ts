/**
 * File Upload Utilities
 * 
 * Functions for handling file uploads with validation and processing.
 * 
 * #tags: upload, files
 */
import path from 'path';
import { existsSync } from 'fs';
import { FileListItem, UploadResponse } from '@/types/api';
import { 
  resolveContentPath, 
  getFileExtension,
  sanitizePath,
  getContentDirectory
} from './pathUtils';
import { writeFile, getFileStats } from './fileSystem';
import matter from 'gray-matter';

/**
 * Options for file uploads
 */
export interface UploadOptions {
  allowedExtensions?: string[];
  maxSizeBytes?: number;
  destinationPath: string;
  overwrite?: boolean;
  processMarkdown?: boolean;
}

/**
 * Process and save an uploaded file
 */
export async function processFileUpload(
  file: File,
  options: UploadOptions
): Promise<UploadResponse> {
  try {
    // Validate the file first
    const validation = await validateUpload(file, options);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.message
      };
    }
    
    // Determine the destination path
    let destPath = sanitizePath(options.destinationPath);
    
    // If destination is a directory, append the filename
    if (!destPath.includes('.')) {
      destPath = path.join(destPath, file.name);
    }
    
    // Resolve the path relative to the content directory
    const fullPath = resolveContentPath(destPath);
    
    // Check if file already exists
    if (existsSync(fullPath) && !options.overwrite) {
      return {
        success: false,
        error: `File already exists: ${destPath}`
      };
    }
    
    // Process content if it's a markdown file and processMarkdown is true
    let fileContent: Buffer | string;
    
    if (options.processMarkdown && (file.name.endsWith('.md') || file.name.endsWith('.mdx'))) {
      // Read file as text
      const text = await file.text();
      
      // Check if frontmatter exists
      const hasFrontmatter = text.startsWith('---');
      
      if (!hasFrontmatter) {
        // If no frontmatter, add a basic one
        const basename = path.basename(file.name, path.extname(file.name));
        const title = basename
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
          
        const frontmatter = {
          title,
          description: '',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Add frontmatter to content
        fileContent = matter.stringify(text, frontmatter);
      } else {
        fileContent = text;
      }
    } else {
      // For non-markdown files, use the raw binary data
      fileContent = Buffer.from(await file.arrayBuffer());
    }
    
    // Write the file
    await writeFile(fullPath, fileContent);
    
    // Get file stats for the response
    const fileInfo = await getFileStats(fullPath);
    
    return {
      success: true,
      path: destPath,
      file: fileInfo
    };
  } catch (error) {
    console.error('Error processing file upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Validate a file upload against the provided options
 */
export async function validateUpload(
  file: File, 
  options: UploadOptions
): Promise<{ valid: boolean; message?: string }> {
  // Check file size
  if (options.maxSizeBytes && file.size > options.maxSizeBytes) {
    const maxSizeMB = Math.round(options.maxSizeBytes / (1024 * 1024) * 10) / 10;
    return {
      valid: false,
      message: `File too large. Maximum size is ${maxSizeMB}MB.`
    };
  }
  
  // Check file extension
  if (options.allowedExtensions && options.allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name);
    
    if (!extension || !options.allowedExtensions.includes(extension)) {
      return {
        valid: false,
        message: `Invalid file type. Allowed extensions: ${options.allowedExtensions.join(', ')}`
      };
    }
  }
  
  // Validate destination path
  const destPath = sanitizePath(options.destinationPath);
  
  // Check if the destination is within the content directory
  const fullPath = resolveContentPath(destPath);
  if (!fullPath.startsWith(getContentDirectory())) {
    return {
      valid: false,
      message: 'Destination path is outside the content directory'
    };
  }
  
  return { valid: true };
}

/**
 * Save an uploaded file to the specified destination
 */
export async function saveUploadedFile(
  file: File,
  destination: string
): Promise<FileListItem> {
  try {
    // Set up options for the upload
    const options: UploadOptions = {
      destinationPath: destination,
      overwrite: false,
      processMarkdown: file.name.endsWith('.md') || file.name.endsWith('.mdx')
    };
    
    // Process the upload
    const result = await processFileUpload(file, options);
    
    if (!result.success || !result.file) {
      throw new Error(result.error || 'Failed to save file');
    }
    
    return result.file;
  } catch (error) {
    console.error('Error saving uploaded file:', error);
    throw error;
  }
}
