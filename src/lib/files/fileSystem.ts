/**
 * File System Utilities
 * 
 * Provides low-level file system operations for content management.
 * Handles file reading, writing, listing, and deletion with proper error handling.
 * 
 * #tags: files, filesystem, utilities
 */
import fs from 'fs';
import path from 'path';
import { FileListItem, DirectoryContents } from '@/types/api';
import { exists, isDirectory, isFile, getRelativePath, resolveContentPath } from './pathUtils';

/**
 * List the contents of a directory
 */
export async function listDirectory(
  dirPath: string, 
  recursive: boolean = false
): Promise<DirectoryContents> {
  try {
    // Check if the directory exists
    if (!exists(dirPath) || !isDirectory(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    
    // Get all items in the directory
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    // Convert to FileListItem format
    const fileList: FileListItem[] = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(dirPath, item.name);
        const stats = fs.statSync(itemPath);
        
        const fileItem: FileListItem = {
          name: item.name,
          path: getRelativePath(itemPath),
          type: item.isDirectory() ? 'directory' : 'file',
          lastModified: stats.mtime.toISOString(),
        };
        
        // Add file-specific properties
        if (item.isFile()) {
          fileItem.size = stats.size;
          fileItem.extension = path.extname(item.name).toLowerCase();
        }
        
        return fileItem;
      })
    );
    
    // Sort: directories first, then files, both alphabetically
    fileList.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
    
    // If recursive, add subdirectory contents
    if (recursive) {
      for (const item of fileList.filter(item => item.type === 'directory')) {
        const fullPath = resolveContentPath(item.path);
        const subDirContents = await listDirectory(fullPath, true);
        
        // Add subdirectory items with adjusted paths
        subDirContents.items.forEach(subItem => {
          fileList.push(subItem);
        });
      }
    }
    
    return {
      path: getRelativePath(dirPath),
      items: fileList
    };
  } catch (error) {
    console.error(`Error listing directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Read a file from the filesystem
 */
export async function readFile(filePath: string): Promise<Buffer> {
  try {
    // Check if the file exists
    if (!exists(filePath) || !isFile(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    return fs.readFileSync(filePath);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write content to a file, creating directories if necessary
 */
export async function writeFile(filePath: string, content: string | Buffer): Promise<void> {
  try {
    // Create directory if it doesn't exist
    const dirPath = path.dirname(filePath);
    if (!exists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, content);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Delete a file or directory
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    // Check if the file/directory exists
    if (!exists(filePath)) {
      throw new Error(`File or directory not found: ${filePath}`);
    }
    
    if (isDirectory(filePath)) {
      // Delete directory recursively
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      // Delete file
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Error deleting ${filePath}:`, error);
    throw error;
  }
}

/**
 * Create a directory, including parent directories if needed
 */
export async function createDirectory(dirPath: string): Promise<void> {
  try {
    if (!exists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

/**
 * Get detailed file information
 */
export async function getFileStats(filePath: string): Promise<FileListItem> {
  try {
    // Check if the file exists
    if (!exists(filePath)) {
      throw new Error(`File or directory not found: ${filePath}`);
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const name = path.basename(filePath);
    
    const fileItem: FileListItem = {
      name,
      path: getRelativePath(filePath),
      type: stats.isDirectory() ? 'directory' : 'file',
      lastModified: stats.mtime.toISOString(),
    };
    
    // Add file-specific properties
    if (stats.isFile()) {
      fileItem.size = stats.size;
      fileItem.extension = path.extname(name).toLowerCase();
    }
    
    return fileItem;
  } catch (error) {
    console.error(`Error getting file stats for ${filePath}:`, error);
    throw error;
  }
}

/**
 * Move or rename a file or directory
 */
export async function moveFile(sourcePath: string, destinationPath: string): Promise<void> {
  try {
    // Check if source exists
    if (!exists(sourcePath)) {
      throw new Error(`Source not found: ${sourcePath}`);
    }
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destinationPath);
    if (!exists(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Move the file or directory
    fs.renameSync(sourcePath, destinationPath);
  } catch (error) {
    console.error(`Error moving ${sourcePath} to ${destinationPath}:`, error);
    throw error;
  }
}

/**
 * Copy a file or directory
 */
export async function copyFile(sourcePath: string, destinationPath: string): Promise<void> {
  try {
    // Check if source exists
    if (!exists(sourcePath)) {
      throw new Error(`Source not found: ${sourcePath}`);
    }
    
    // Create destination directory if it doesn't exist
    const destDir = path.dirname(destinationPath);
    if (!exists(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (isDirectory(sourcePath)) {
      // Create destination directory
      if (!exists(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      
      // Copy all contents
      const items = fs.readdirSync(sourcePath);
      for (const item of items) {
        const srcItemPath = path.join(sourcePath, item);
        const destItemPath = path.join(destinationPath, item);
        await copyFile(srcItemPath, destItemPath);
      }
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destinationPath);
    }
  } catch (error) {
    console.error(`Error copying ${sourcePath} to ${destinationPath}:`, error);
    throw error;
  }
}
