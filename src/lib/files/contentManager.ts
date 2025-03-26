/**
 * Content Management Utilities
 * 
 * Higher-level functions for managing wiki content files.
 * Handles content-specific operations like frontmatter extraction and validation.
 * 
 * #tags: content, files, management
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ContentFile } from '@/types/content';
import { Frontmatter } from '@/types/content';
import { 
  getContentDirectory, 
  resolveContentPath, 
  generateSlugFromPath,
  exists,
  isFile,
  isDirectory,
  getFileExtension,
  isMarkdownFile
} from './pathUtils';
import { 
  readFile, 
  writeFile, 
  deleteFile, 
  getFileStats,
  listDirectory 
} from './fileSystem';

/**
 * Get content file with parsed frontmatter and content
 */
export async function getContentFile(path: string): Promise<ContentFile | null> {
  try {
    // Convert to possible file paths (.md or .mdx)
    const possiblePaths = [
      resolveContentPath(`${path}.md`),
      resolveContentPath(`${path}.mdx`),
      resolveContentPath(path),
      resolveContentPath(`${path}/index.md`),
      resolveContentPath(`${path}/index.mdx`)
    ];
    
    // Find the first path that exists and is a file
    let filePath: string | null = null;
    for (const p of possiblePaths) {
      if (exists(p) && isFile(p)) {
        filePath = p;
        break;
      }
    }
    
    if (!filePath) {
      return null;
    }
    
    // Read the file
    const content = (await readFile(filePath)).toString('utf-8');
    
    // Parse frontmatter
    const { data, content: contentWithoutFrontmatter } = matter(content, {
      engines: {
        yaml: {
          // Disable date parsing to prevent unexpected Date objects
          parse: (str) => {
            // Use the standard YAML parser but prevent it from automatically converting dates
            const yaml = require('js-yaml');
            return yaml.load(str, { schema: yaml.CORE_SCHEMA });
          }
        }
      }
    });
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    return {
      slug: generateSlugFromPath(filePath),
      path: filePath.replace(getContentDirectory(), '').replace(/^\//, ''),
      content: contentWithoutFrontmatter,
      frontmatter: data as Frontmatter,
      lastModified: stats.mtime.toISOString()
    };
  } catch (error) {
    console.error(`Error getting content file ${path}:`, error);
    throw error;
  }
}

/**
 * Options for creating a content file
 */
export interface CreateContentOptions {
  path: string;
  frontmatter: Frontmatter;
  content: string;
  overwrite?: boolean;
}

/**
 * Create a new content file with frontmatter
 */
export async function createContentFile(options: CreateContentOptions): Promise<ContentFile> {
  try {
    const { path: contentPath, frontmatter, content, overwrite = false } = options;
    
    // Determine file extension (.md by default)
    let filePath = resolveContentPath(contentPath);
    if (!getFileExtension(filePath)) {
      filePath += '.md';
    }
    
    // Check if file already exists
    if (exists(filePath) && !overwrite) {
      throw new Error(`File already exists: ${filePath}`);
    }
    
    // Generate frontmatter block
    const fileContent = matter.stringify(content, frontmatter);
    
    // Write the file
    await writeFile(filePath, fileContent);
    
    // Get the created file
    const createdFile = await getContentFile(contentPath);
    if (!createdFile) {
      throw new Error(`Failed to get created file: ${filePath}`);
    }
    
    return createdFile;
  } catch (error) {
    console.error(`Error creating content file:`, error);
    throw error;
  }
}

/**
 * Options for updating a content file
 */
export interface UpdateContentOptions {
  path: string;
  frontmatter?: Partial<Frontmatter>;
  content?: string;
  createIfNotExists?: boolean;
}

/**
 * Update an existing content file
 */
export async function updateContentFile(options: UpdateContentOptions): Promise<ContentFile> {
  try {
    const { path: contentPath, frontmatter, content, createIfNotExists = false } = options;
    
    // Get the existing file
    const existingFile = await getContentFile(contentPath);
    
    // If file doesn't exist and createIfNotExists is true, create it
    if (!existingFile && createIfNotExists) {
      return createContentFile({
        path: contentPath,
        frontmatter: frontmatter as Frontmatter || { title: path.basename(contentPath) },
        content: content || '',
      });
    }
    
    // If file doesn't exist and createIfNotExists is false, throw error
    if (!existingFile) {
      throw new Error(`File not found: ${contentPath}`);
    }
    
    // Merge frontmatter
    const updatedFrontmatter = {
      ...existingFile.frontmatter,
      ...frontmatter,
    };
    
    // Update content if provided, otherwise keep existing
    const updatedContent = content !== undefined ? content : existingFile.content;
    
    // Generate frontmatter block
    const fileContent = matter.stringify(updatedContent, updatedFrontmatter);
    
    // Get file path
    const filePath = resolveContentPath(existingFile.path);
    
    // Write the file
    await writeFile(filePath, fileContent);
    
    // Get the updated file
    const updatedFile = await getContentFile(contentPath);
    if (!updatedFile) {
      throw new Error(`Failed to get updated file: ${filePath}`);
    }
    
    return updatedFile;
  } catch (error) {
    console.error(`Error updating content file:`, error);
    throw error;
  }
}

/**
 * Delete a content file
 */
export async function deleteContentFile(contentPath: string): Promise<void> {
  try {
    // Get the existing file
    const existingFile = await getContentFile(contentPath);
    
    // If file doesn't exist, throw error
    if (!existingFile) {
      throw new Error(`File not found: ${contentPath}`);
    }
    
    // Get file path
    const filePath = resolveContentPath(existingFile.path);
    
    // Delete the file
    await deleteFile(filePath);
  } catch (error) {
    console.error(`Error deleting content file:`, error);
    throw error;
  }
}

/**
 * List content files in a directory
 */
export async function listContentFiles(
  directory: string = '', 
  recursive: boolean = false
): Promise<ContentFile[]> {
  try {
    const dirPath = resolveContentPath(directory);
    
    // Check if directory exists
    if (!exists(dirPath) || !isDirectory(dirPath)) {
      throw new Error(`Directory not found: ${dirPath}`);
    }
    
    // Get directory contents
    const contents = await listDirectory(dirPath, recursive);
    
    // Filter for markdown files
    const markdownFiles = contents.items.filter(item => 
      item.type === 'file' && isMarkdownFile(item.path)
    );
    
    // Get content files
    const contentFiles = await Promise.all(
      markdownFiles.map(async file => {
        const contentFile = await getContentFile(file.path);
        if (!contentFile) {
          throw new Error(`Failed to get content file: ${file.path}`);
        }
        return contentFile;
      })
    );
    
    return contentFiles;
  } catch (error) {
    console.error(`Error listing content files:`, error);
    throw error;
  }
}

/**
 * Validate a content file path
 */
export async function validateContentPath(
  path: string
): Promise<{ valid: boolean; message?: string }> {
  // Empty path is invalid
  if (!path) {
    return { valid: false, message: 'Path cannot be empty' };
  }
  
  // Maximum path length
  if (path.length > 255) {
    return { valid: false, message: 'Path is too long' };
  }
  
  // Check for invalid characters
  const invalidCharsRegex = /[<>:"|?*]/;
  if (invalidCharsRegex.test(path)) {
    return { 
      valid: false, 
      message: 'Path contains invalid characters: < > : " | ? *' 
    };
  }
  
  return { valid: true };
}
