/**
 * Fixed Migration Script
 * 
 * Migrates content from Markdown/MDX files to Wiki.js with correct API parameters
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './sample-content')
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
      const errorMessage = response.data.errors.map(e => e.message).join(', ');
      console.error('GraphQL Errors:', errorMessage);
      throw new Error(`GraphQL Errors: ${errorMessage}`);
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Wiki API Query Error:', error.message);
    if (error.response?.data) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
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
  
  const query = `
    mutation CreatePage(
      $content: String!,
      $description: String,
      $editor: String!,
      $isPublished: Boolean!,
      $isPrivate: Boolean,
      $locale: String!,
      $path: String!,
      $tags: [String]!,
      $title: String!
    ) {
      pages {
        create(
          content: $content,
          description: $description,
          editor: $editor,
          isPublished: $isPublished,
          isPrivate: $isPrivate,
          locale: $locale,
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
    editor: "markdown",
    isPublished: true,
    isPrivate: false,
    locale: "en",
    path,
    tags: tags || [],
    title
  };
  
  const data = await executeQuery(query, variables);
  
  if (!data?.pages?.create?.responseResult?.succeeded) {
    throw new Error(data?.pages?.create?.responseResult?.message || 'Failed to create page');
  }
  
  return data?.pages?.create?.page;
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