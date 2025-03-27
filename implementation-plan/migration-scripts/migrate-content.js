/**
 * Content Migration Script
 * 
 * Migrates content from the Next.js wiki's Markdown/MDX files to Wiki.js
 * 
 * Usage:
 * NODE_ENV=production node migrate-content.js --source=/path/to/content --wikiUrl=http://localhost:3200 --apiKey=your-api-key
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './content')
  .option('--wikiUrl <url>', 'URL of the Wiki.js instance', 'http://localhost:3200')
  .option('--apiKey <key>', 'API key for Wiki.js')
  .option('--dryRun', 'Run without making changes', false)
  .parse(process.argv);

const options = program.opts();

// GraphQL client for Wiki.js
const client = axios.create({
  baseURL: `${options.wikiUrl}/graphql`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${options.apiKey || process.env.WIKI_API_KEY}`
  }
});

/**
 * Execute a GraphQL query
 */
async function executeQuery(query, variables = {}) {
  try {
    const response = await client.post('', {
      query,
      variables
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors.map(e => e.message).join(', '));
    }
    
    return response.data.data;
  } catch (error) {
    console.error('GraphQL Error:', error.message);
    throw error;
  }
}

/**
 * Create a page in Wiki.js
 */
async function createPage({ path, title, content, description = '', tags = [] }) {
  if (options.dryRun) {
    console.log(`[DRY RUN] Would create page at path: ${path}`);
    return { id: 0, path, title };
  }
  
  // First create tags if needed
  const tagIds = await createTagsIfNeeded(tags);
  
  const query = `
    mutation CreatePage($content: String!, $description: String, $isPublished: Boolean!, $isPrivate: Boolean, $path: String!, $tags: [Int], $title: String!) {
      pages {
        create(
          content: $content,
          description: $description,
          isPublished: $isPublished,
          isPrivate: false,
          path: $path,
          tags: $tags,
          title: $title
        ) {
          responseResult {
            succeeded
            errorCode
            slug
            message
          }
          page {
            id
            path
            title
          }
        }
      }
    }
  `;
  
  const variables = {
    content,
    description,
    isPublished: true,
    isPrivate: false,
    path,
    tags: tagIds,
    title
  };
  
  const data = await executeQuery(query, variables);
  
  if (!data?.pages?.create?.responseResult?.succeeded) {
    throw new Error(data?.pages?.create?.responseResult?.message || 'Failed to create page');
  }
  
  return data?.pages?.create?.page;
}

/**
 * Create tags if they don't exist
 */
async function createTagsIfNeeded(tagNames) {
  if (!tagNames || tagNames.length === 0) {
    return [];
  }
  
  // Get existing tags
  const existingTagsQuery = `
    query GetTags {
      tags {
        list {
          id
          tag
          title
        }
      }
    }
  `;
  
  const existingTagsData = await executeQuery(existingTagsQuery);
  const existingTags = existingTagsData?.tags?.list || [];
  
  // Map of lowercase tag names to tag objects
  const tagMap = {};
  existingTags.forEach(tag => {
    tagMap[tag.tag.toLowerCase()] = tag;
  });
  
  // Create tags that don't exist
  const tagIds = [];
  
  for (const tagName of tagNames) {
    const normalizedTag = tagName.trim().toLowerCase();
    
    if (tagMap[normalizedTag]) {
      tagIds.push(tagMap[normalizedTag].id);
      continue;
    }
    
    if (options.dryRun) {
      console.log(`[DRY RUN] Would create tag: ${tagName}`);
      tagIds.push(0);
      continue;
    }
    
    // Create tag
    const createTagQuery = `
      mutation CreateTag($tag: String!) {
        tags {
          create(
            tag: $tag
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            tag {
              id
              tag
            }
          }
        }
      }
    `;
    
    const createTagData = await executeQuery(createTagQuery, { tag: tagName });
    
    if (createTagData?.tags?.create?.responseResult?.succeeded) {
      tagIds.push(createTagData.tags.create.tag.id);
      console.log(`Created tag: ${tagName}`);
    } else {
      console.error(`Failed to create tag: ${tagName}`);
    }
  }
  
  return tagIds;
}

/**
 * Process a markdown file and create a page in Wiki.js
 */
async function processFile(filePath, contentDir) {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    
    // Extract metadata
    const title = data.title || path.basename(filePath, path.extname(filePath));
    const description = data.description || '';
    const tags = Array.isArray(data.tags) ? data.tags : 
                (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []);
    
    // Create relative path for Wiki.js
    const relativePath = path.relative(contentDir, filePath);
    const wikijsPath = relativePath
      .replace(/index\.(md|mdx)$/, '') // Replace index.md with empty string
      .replace(/\.(md|mdx)$/, '') // Remove extension
      .replace(/\\/g, '/'); // Replace backslashes with forward slashes
    
    // Create page in Wiki.js
    console.log(`Processing: ${relativePath} -> ${wikijsPath}`);
    
    const page = await createPage({
      path: wikijsPath,
      title,
      content: markdownContent,
      description,
      tags
    });
    
    console.log(`Created page: ${page.path} (ID: ${page.id})`);
    return page;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Recursively scan directory for markdown files
 */
function scanDirectory(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...scanDirectory(itemPath));
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(itemPath);
    }
  }
  
  return files;
}

/**
 * Main function
 */
async function main() {
  try {
    const contentDir = path.resolve(options.source);
    
    if (!fs.existsSync(contentDir)) {
      console.error(`Content directory not found: ${contentDir}`);
      process.exit(1);
    }
    
    console.log(`Starting migration from ${contentDir} to ${options.wikiUrl}`);
    console.log(`Dry run: ${options.dryRun}`);
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files`);
    
    // Process files
    const results = {
      success: 0,
      failed: 0,
      skipped: 0
    };
    
    for (const file of files) {
      const result = await processFile(file, contentDir);
      
      if (result) {
        results.success++;
      } else {
        results.failed++;
      }
    }
    
    console.log('\nMigration complete!');
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Skipped: ${results.skipped}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
main();