/**
 * MDX Content Utilities
 * 
 * Provides functions for loading and processing MDX/markdown content.
 * 
 * #tags: mdx, content, utilities
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { ReactElement } from 'react';

// Define the content directory path
const contentDirectory = path.join(process.cwd(), 'content');

// Define the frontmatter type
export interface Frontmatter {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  [key: string]: any;
}

export interface MDXContent {
  frontmatter: Frontmatter;
  content: ReactElement | null;
  rawContent: string;
  slug: string;
}

export interface MDXListItem {
  frontmatter: Frontmatter;
  slug: string;
  path: string;
}

/**
 * Get all content files from a directory recursively
 */
export function getAllContentFilePaths(dir: string = contentDirectory): string[] {
  const files: string[] = [];
  
  try {
    // Get all files from the directory
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    // Loop through each item
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // If directory, recurse and get files
        files.push(...getAllContentFilePaths(itemPath));
      } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
        // If markdown file, add to list
        files.push(itemPath);
      }
    }
  } catch (error) {
    console.error(`Error getting content files from ${dir}:`, error);
  }
  
  return files;
}

/**
 * Get content from a markdown file
 */
export async function getMDXContent(filePath: string): Promise<MDXContent> {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter with options to prevent automatic date parsing
    const { data, content } = matter(fileContent, {
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
    
    // Get slug from file path
    const relativePath = filePath.replace(contentDirectory, '');
    const slug = relativePath
      .replace(/^\//, '') // Remove leading slash
      .replace(/\.(md|mdx)$/, ''); // Remove extension
      
    try {
      // Compile MDX - this can throw errors with RSC
      const compiled = await compileMDX({
        source: content,
        options: {
          parseFrontmatter: true,
          mdxOptions: {
            rehypePlugins: [
              rehypeHighlight,
              // Add type assertion to rehypeSlug to fix VFile type incompatibility
              rehypeSlug as any
            ],
            remarkPlugins: [
              remarkGfm
            ],
          }
        }
      });
      
      return {
        frontmatter: data as Frontmatter,
        content: compiled.content,
        rawContent: content,
        slug,
      };
    } catch (mdxError) {
      console.error(`Error compiling MDX for ${filePath}:`, mdxError);
      
      // Return a partial result with null content, will be handled by the MDXContent component
      return {
        frontmatter: data as Frontmatter,
        content: null,
        rawContent: content,
        slug,
      };
    }
  } catch (error) {
    console.error(`Error loading content file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Get all content metadata (frontmatter) from a directory
 */
export async function getAllContentMeta(directory: string = ''): Promise<MDXListItem[]> {
  const dir = path.join(contentDirectory, directory);
  
  // Check if directory exists
  if (!fs.existsSync(dir)) {
    return [];
  }
  
  // Get all markdown files in the directory
  const files = getAllContentFilePaths(dir);
  
  // Extract frontmatter from each file
  const contentMeta = files.map(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent, {
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
    
    // Get slug from file path
    const relativePath = filePath.replace(contentDirectory, '');
    const slug = relativePath
      .replace(/^\//, '') // Remove leading slash
      .replace(/\.(md|mdx)$/, ''); // Remove extension
    
    return {
      frontmatter: data as Frontmatter,
      slug,
      path: relativePath,
    };
  });
  
  // Sort by title
  return contentMeta.sort((a, b) => {
    if (a.frontmatter.title < b.frontmatter.title) return -1;
    if (a.frontmatter.title > b.frontmatter.title) return 1;
    return 0;
  });
}

/**
 * Get content by slug
 */
export async function getContentBySlug(slug: string): Promise<MDXContent | null> {
  // Log the slug for debugging
  console.log(`Looking for content with slug: ${slug}`);
  
  // Construct possible file paths (.md or .mdx)
  const mdPath = path.join(contentDirectory, `${slug}.md`);
  const mdxPath = path.join(contentDirectory, `${slug}.mdx`);
  const indexMdPath = path.join(contentDirectory, slug, 'index.md');
  const indexMdxPath = path.join(contentDirectory, slug, 'index.mdx');
  
  // Check if any of the possible files exist
  let filePath: string | null = null;
  
  // Try all possible file paths
  if (fs.existsSync(mdPath)) {
    console.log(`Found file at: ${mdPath}`);
    filePath = mdPath;
  } else if (fs.existsSync(mdxPath)) {
    console.log(`Found file at: ${mdxPath}`);
    filePath = mdxPath;
  } else if (fs.existsSync(indexMdPath)) {
    console.log(`Found index file at: ${indexMdPath}`);
    filePath = indexMdPath;
  } else if (fs.existsSync(indexMdxPath)) {
    console.log(`Found index file at: ${indexMdxPath}`);
    filePath = indexMdxPath;
  } else {
    console.error(`No content file found for slug: ${slug}`);
    return null;
  }
  
  // Read and parse the content
  try {
    return await getMDXContent(filePath);
  } catch (error) {
    console.error(`Error parsing content for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get content by section
 */
export async function getContentBySection(section: string): Promise<MDXListItem[]> {
  return await getAllContentMeta(section);
}

/**
 * Organize content into sections
 */
export async function getContentSections(): Promise<Record<string, MDXListItem[]>> {
  // Get all top-level directories in the content directory
  const items = fs.readdirSync(contentDirectory, { withFileTypes: true });
  const sections: Record<string, MDXListItem[]> = {};
  
  // For each directory, get content metadata
  for (const item of items) {
    if (item.isDirectory()) {
      const sectionItems = await getContentBySection(item.name);
      sections[item.name] = sectionItems;
    }
  }
  
  return sections;
}
