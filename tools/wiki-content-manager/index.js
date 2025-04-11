#!/usr/bin/env node
/**
 * Wiki Content Manager MCP Server
 * 
 * An MCP server that provides tools for wiki content management:
 * - Analyzing content structure
 * - Finding broken links
 * - Suggesting related content
 * - Generating content
 * - Summarizing content
 * 
 * #tags: mcp content-management ai
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import stringSimilarity from 'string-similarity';

// Base directory for content
const CONTENT_DIR = path.join(process.cwd(), 'content');

class WikiContentManagerServer {
  constructor() {
    this.server = new Server(
      {
        name: 'wiki-content-manager',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_content_structure',
          description: 'Analyze the content structure of the wiki and suggest improvements',
          inputSchema: {
            type: 'object',
            properties: {
              directory: {
                type: 'string',
                description: 'Directory to analyze (relative to content directory)',
              }
            },
            required: [],
          },
        },
        {
          name: 'find_broken_links',
          description: 'Find broken internal links in the wiki',
          inputSchema: {
            type: 'object',
            properties: {
              directory: {
                type: 'string',
                description: 'Directory to analyze (relative to content directory)',
              }
            },
            required: [],
          },
        },
        {
          name: 'suggest_related_content',
          description: 'Suggest related content for a given page',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the content file',
              },
              maxSuggestions: {
                type: 'number',
                description: 'Maximum number of suggestions to return',
              }
            },
            required: ['path'],
          },
        },
        {
          name: 'generate_section_content',
          description: 'Generate content for a new section based on existing content',
          inputSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Title of the new section',
              },
              context: {
                type: 'string',
                description: 'Context for the new section (e.g., parent section, related content)',
              }
            },
            required: ['title'],
          },
        },
        {
          name: 'summarize_content',
          description: 'Generate a summary of wiki content',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Path to the content file or directory',
              }
            },
            required: ['path'],
          },
        }
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'analyze_content_structure':
          return this.analyzeContentStructure(request.params.arguments);
        case 'find_broken_links':
          return this.findBrokenLinks(request.params.arguments);
        case 'suggest_related_content':
          return this.suggestRelatedContent(request.params.arguments);
        case 'generate_section_content':
          return this.generateSectionContent(request.params.arguments);
        case 'summarize_content':
          return this.summarizeContent(request.params.arguments);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  /**
   * Analyze the content structure of the wiki and suggest improvements
   */
  async analyzeContentStructure(args) {
    const { directory = '' } = args;
    const contentDir = path.join(CONTENT_DIR, directory);
    
    try {
      // Check if directory exists
      if (!fs.existsSync(contentDir)) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Directory not found: ${contentDir}` }, null, 2)
            }
          ]
        };
      }
      
      // Analyze content structure
      const structure = await this.buildContentStructure(contentDir);
      
      // Analyze section balance
      const sectionAnalysis = this.analyzeSectionBalance(structure);
      
      // Analyze content depth
      const depthAnalysis = this.analyzeContentDepth(structure);
      
      // Analyze naming consistency
      const namingAnalysis = this.analyzeNamingConsistency(structure);
      
      // Generate suggestions
      const suggestions = [
        ...sectionAnalysis.suggestions,
        ...depthAnalysis.suggestions,
        ...namingAnalysis.suggestions
      ];
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              structure: structure,
              analysis: {
                sectionBalance: sectionAnalysis.metrics,
                contentDepth: depthAnalysis.metrics,
                namingConsistency: namingAnalysis.metrics
              },
              suggestions: suggestions
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * Build the content structure from the file system
   */
  async buildContentStructure(directory) {
    const structure = [];
    
    // Get all files and directories
    const items = await fs.readdir(directory);
    
    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        // Recursively build structure for subdirectory
        const children = await this.buildContentStructure(itemPath);
        
        structure.push({
          type: 'directory',
          name: item,
          path: itemPath.replace(CONTENT_DIR, '').replace(/\\/g, '/'),
          children: children
        });
      } else if (stats.isFile() && (item.endsWith('.md') || item.endsWith('.mdx'))) {
        // Read file content and extract frontmatter
        const content = await fs.readFile(itemPath, 'utf8');
        const { data } = matter(content);
        
        structure.push({
          type: 'file',
          name: item,
          path: itemPath.replace(CONTENT_DIR, '').replace(/\\/g, '/'),
          title: data.title || item.replace(/\.(md|mdx)$/, ''),
          frontmatter: data
        });
      }
    }
    
    return structure;
  }

  /**
   * Analyze section balance
   */
  analyzeSectionBalance(structure) {
    const metrics = {
      totalSections: 0,
      sectionsWithFewPages: 0,
      sectionsWithManyPages: 0,
      averagePagesPerSection: 0
    };
    
    const suggestions = [];
    
    // Count sections and pages
    const sections = structure.filter(item => item.type === 'directory');
    metrics.totalSections = sections.length;
    
    // Count pages per section
    const pagesPerSection = sections.map(section => {
      const pages = section.children.filter(item => item.type === 'file');
      return {
        section: section.name,
        pageCount: pages.length
      };
    });
    
    // Calculate average
    const totalPages = pagesPerSection.reduce((sum, section) => sum + section.pageCount, 0);
    metrics.averagePagesPerSection = totalPages / metrics.totalSections;
    
    // Identify imbalanced sections
    const threshold = metrics.averagePagesPerSection * 0.5;
    metrics.sectionsWithFewPages = pagesPerSection.filter(section => section.pageCount < threshold).length;
    metrics.sectionsWithManyPages = pagesPerSection.filter(section => section.pageCount > threshold * 3).length;
    
    // Generate suggestions
    if (metrics.sectionsWithFewPages > 0) {
      const fewPagesSections = pagesPerSection
        .filter(section => section.pageCount < threshold)
        .map(section => section.section);
      
      suggestions.push({
        type: 'section_balance',
        severity: 'medium',
        message: `Sections with few pages: ${fewPagesSections.join(', ')}. Consider merging these sections or adding more content.`
      });
    }
    
    if (metrics.sectionsWithManyPages > 0) {
      const manyPagesSections = pagesPerSection
        .filter(section => section.pageCount > threshold * 3)
        .map(section => section.section);
      
      suggestions.push({
        type: 'section_balance',
        severity: 'medium',
        message: `Sections with many pages: ${manyPagesSections.join(', ')}. Consider splitting these sections into smaller, more focused sections.`
      });
    }
    
    return { metrics, suggestions };
  }

  /**
   * Analyze content depth
   */
  analyzeContentDepth(structure) {
    const metrics = {
      maxDepth: 0,
      averageDepth: 0,
      depthDistribution: {}
    };
    
    const suggestions = [];
    
    // Calculate depth for each item
    const calculateDepth = (items, currentDepth = 0) => {
      let maxDepth = currentDepth;
      
      for (const item of items) {
        if (item.type === 'directory' && item.children.length > 0) {
          const childDepth = calculateDepth(item.children, currentDepth + 1);
          maxDepth = Math.max(maxDepth, childDepth);
        } else {
          maxDepth = Math.max(maxDepth, currentDepth);
        }
        
        // Update depth distribution
        metrics.depthDistribution[currentDepth] = (metrics.depthDistribution[currentDepth] || 0) + 1;
      }
      
      return maxDepth;
    };
    
    metrics.maxDepth = calculateDepth(structure);
    
    // Calculate average depth
    let totalItems = 0;
    let depthSum = 0;
    
    for (const [depth, count] of Object.entries(metrics.depthDistribution)) {
      totalItems += count;
      depthSum += parseInt(depth) * count;
    }
    
    metrics.averageDepth = depthSum / totalItems;
    
    // Generate suggestions
    if (metrics.maxDepth > 4) {
      suggestions.push({
        type: 'content_depth',
        severity: 'medium',
        message: `Content structure is quite deep (${metrics.maxDepth} levels). Consider flattening the structure for easier navigation.`
      });
    }
    
    if (metrics.maxDepth === 1) {
      suggestions.push({
        type: 'content_depth',
        severity: 'low',
        message: 'Content structure is very flat. Consider adding more hierarchy to organize related content.'
      });
    }
    
    return { metrics, suggestions };
  }

  /**
   * Analyze naming consistency
   */
  analyzeNamingConsistency(structure) {
    const metrics = {
      inconsistentNames: 0,
      namingPatterns: {}
    };
    
    const suggestions = [];
    
    // Analyze file naming patterns
    const fileNames = this.getAllFileNames(structure);
    
    // Check for kebab-case, camelCase, snake_case, etc.
    const patterns = {
      kebabCase: /^[a-z0-9]+(-[a-z0-9]+)*$/,
      camelCase: /^[a-z][a-zA-Z0-9]*$/,
      snakeCase: /^[a-z0-9]+(_[a-z0-9]+)*$/,
      pascalCase: /^[A-Z][a-zA-Z0-9]*$/
    };
    
    for (const fileName of fileNames) {
      const baseName = path.basename(fileName, path.extname(fileName));
      
      for (const [pattern, regex] of Object.entries(patterns)) {
        if (regex.test(baseName)) {
          metrics.namingPatterns[pattern] = (metrics.namingPatterns[pattern] || 0) + 1;
          break;
        }
      }
    }
    
    // Find dominant pattern
    let dominantPattern = '';
    let maxCount = 0;
    
    for (const [pattern, count] of Object.entries(metrics.namingPatterns)) {
      if (count > maxCount) {
        maxCount = count;
        dominantPattern = pattern;
      }
    }
    
    // Count inconsistent names
    for (const [pattern, count] of Object.entries(metrics.namingPatterns)) {
      if (pattern !== dominantPattern) {
        metrics.inconsistentNames += count;
      }
    }
    
    // Generate suggestions
    if (metrics.inconsistentNames > 0) {
      suggestions.push({
        type: 'naming_consistency',
        severity: 'medium',
        message: `Found ${metrics.inconsistentNames} files with inconsistent naming patterns. Consider standardizing on ${dominantPattern} for all files.`
      });
    }
    
    return { metrics, suggestions };
  }

  /**
   * Get all file names from the structure
   */
  getAllFileNames(structure, fileNames = []) {
    for (const item of structure) {
      if (item.type === 'file') {
        fileNames.push(item.name);
      } else if (item.type === 'directory' && item.children) {
        this.getAllFileNames(item.children, fileNames);
      }
    }
    
    return fileNames;
  }

  /**
   * Find broken internal links in the wiki
   */
  async findBrokenLinks(args) {
    const { directory = '' } = args;
    const contentDir = path.join(CONTENT_DIR, directory);
    
    try {
      // Check if directory exists
      if (!fs.existsSync(contentDir)) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Directory not found: ${contentDir}` }, null, 2)
            }
          ]
        };
      }
      
      // Get all markdown files
      const files = await this.getAllMarkdownFiles(contentDir);
      
      // Build a map of all valid paths
      const validPaths = new Set();
      for (const file of files) {
        const relativePath = file.replace(CONTENT_DIR, '').replace(/\\/g, '/');
        validPaths.add(relativePath);
        validPaths.add(relativePath.replace(/\.(md|mdx)$/, ''));
        validPaths.add(`/wiki${relativePath.replace(/\.(md|mdx)$/, '')}`);
      }
      
      // Find broken links
      const brokenLinks = [];
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf8');
        const relativePath = file.replace(CONTENT_DIR, '').replace(/\\/g, '/');
        
        // Find markdown links
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;
        
        while ((match = markdownLinkRegex.exec(content)) !== null) {
          const linkText = match[1];
          const linkUrl = match[2];
          
          // Check if it's an internal link
          if (!linkUrl.startsWith('http') && !linkUrl.startsWith('#')) {
            // Normalize the link path
            const normalizedLink = linkUrl.startsWith('/') ? linkUrl : path.join(path.dirname(relativePath), linkUrl).replace(/\\/g, '/');
            
            // Check if the link is valid
            if (!validPaths.has(normalizedLink)) {
              brokenLinks.push({
                file: relativePath,
                linkText,
                linkUrl,
                normalizedLink
              });
            }
          }
        }
      }
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              brokenLinks,
              totalFiles: files.length,
              totalBrokenLinks: brokenLinks.length
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * Get all markdown files in a directory recursively
   */
  async getAllMarkdownFiles(directory, files = []) {
    const items = await fs.readdir(directory);
    
    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        await this.getAllMarkdownFiles(itemPath, files);
      } else if (stats.isFile() && (item.endsWith('.md') || item.endsWith('.mdx'))) {
        files.push(itemPath);
      }
    }
    
    return files;
  }

  /**
   * Suggest related content for a given page
   */
  async suggestRelatedContent(args) {
    const { path: contentPath, maxSuggestions = 5 } = args;
    
    try {
      // Resolve the full path
      const fullPath = path.join(CONTENT_DIR, contentPath);
      
      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `File not found: ${fullPath}` }, null, 2)
            }
          ]
        };
      }
      
      // Read the file content
      const content = await fs.readFile(fullPath, 'utf8');
      const { data, content: fileContent } = matter(content);
      
      // Get all markdown files
      const files = await this.getAllMarkdownFiles(CONTENT_DIR);
      
      // Calculate similarity scores
      const similarities = [];
      
      for (const file of files) {
        // Skip the current file
        if (file === fullPath) continue;
        
        // Read the file content
        const otherContent = await fs.readFile(file, 'utf8');
        const { data: otherData, content: otherFileContent } = matter(otherContent);
        
        // Calculate similarity based on content
        const contentSimilarity = stringSimilarity.compareTwoStrings(fileContent, otherFileContent);
        
        // Calculate similarity based on tags
        let tagSimilarity = 0;
        if (data.tags && otherData.tags) {
          const tags = Array.isArray(data.tags) ? data.tags : [data.tags];
          const otherTags = Array.isArray(otherData.tags) ? otherData.tags : [otherData.tags];
          
          const commonTags = tags.filter(tag => otherTags.includes(tag));
          tagSimilarity = commonTags.length / Math.max(tags.length, otherTags.length);
        }
        
        // Calculate overall similarity
        const overallSimilarity = contentSimilarity * 0.7 + tagSimilarity * 0.3;
        
        similarities.push({
          file: file.replace(CONTENT_DIR, '').replace(/\\/g, '/'),
          title: otherData.title || path.basename(file, path.extname(file)),
          similarity: overallSimilarity,
          contentSimilarity,
          tagSimilarity
        });
      }
      
      // Sort by similarity and take top N
      similarities.sort((a, b) => b.similarity - a.similarity);
      const topSimilarities = similarities.slice(0, maxSuggestions);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              suggestions: topSimilarities.map(item => ({
                path: item.file,
                title: item.title,
                similarity: item.similarity,
                wikiPath: `/wiki${item.file.replace(/\.(md|mdx)$/, '')}`
              }))
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * Generate content for a new section based on existing content
   */
  async generateSectionContent(args) {
    const { title, context = '' } = args;
    
    try {
      // Generate content based on title and context
      // In a real implementation, this would use an LLM to generate content
      
      const generatedContent = `# ${title}

## Overview

This section provides information about ${title}.

${context ? `\n## Context\n\n${context}\n` : ''}

## Details

Add more details about ${title} here.

## Related Information

- Link to related page 1
- Link to related page 2
`;
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              title,
              content: generatedContent
            }, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ]
      };
    }
  }

  /**
   * Generate a summary of wiki content
   */
  async summarizeContent(args) {
    const { path: contentPath } = args;
    
    try {
      // Resolve the full path
      const fullPath = path.join(CONTENT_DIR, contentPath);
      
      // Check if path exists
      if (!fs.existsSync(fullPath)) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: `Path not found: ${fullPath}` }, null, 2)
            }
          ]
        };
      }
      
      // Check if it's a file or directory
      const stats = await fs.stat(fullPath);
      
      if (stats.isFile()) {
        // Summarize a single file
        const content = await fs.readFile(fullPath, 'utf8');
        const { data, content: fileContent } = matter(content);
        
        // In a real implementation, this would use an LLM to generate a summary
        const summary = `Summary of ${data.title || path.basename(fullPath, path.extname(fullPath))}:
        
This document covers ${data.description || 'various topics related to ' + (data.title || path.basename(fullPath, path.extname(fullPath)))}.

Key points:
- First key point
- Second key point
- Third key point

${data.tags ? `Tags: ${Array.isArray(data.tags) ? data.tags.join(', ') : data.tags}` : ''}`;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                title: data.title || path.basename(fullPath, path.extname(fullPath)),
                summary
              }, null, 2)
            }
          ]
        };
      } else {
        // Summarize a directory
        const files = await this.getAllMarkdownFiles(fullPath);
        
        // In a real implementation, this would use an LLM to generate a summary
        const summary = `Summary of ${path.basename(fullPath)} section:
        
This section contains ${files.length} documents covering various topics.

Key areas:
- First key area
- Second key area
- Third key area`;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                title: path.basename(fullPath),
                summary,
                fileCount: files.length
              }, null, 2)
            }
          ]
        };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: error.message }, null, 2)
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Wiki Content Manager MCP server running on stdio');
  }
}

const server = new WikiContentManagerServer();
server.run().catch(console.error);
