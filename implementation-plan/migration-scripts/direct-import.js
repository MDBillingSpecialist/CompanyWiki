/**
 * Direct Import Script for Wiki.js
 * 
 * This script directly creates content in Wiki.js using GraphQL API through admin authentication
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
  .option('--email <email>', 'Admin email', process.env.WIKI_ADMIN_USER || 'admin@example.com')
  .option('--password <password>', 'Admin password', process.env.WIKI_ADMIN_PASSWORD || 'wikijsrocks')
  .parse(process.argv);

const options = program.opts();

// GraphQL client for Wiki.js
const client = axios.create({
  baseURL: `${options.wikiUrl}/graphql`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API client for Wiki.js
const apiClient = axios.create({
  baseURL: options.wikiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Login to Wiki.js and get authentication token
 */
async function login() {
  try {
    const query = `
      mutation Login($username: String!, $password: String!) {
        authentication {
          login(username: $username, password: $password) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            jwt
            mustChangePwd
            mustProvideTFA
            mustSetupTFA
            continuationToken
          }
        }
      }
    `;

    const variables = {
      username: options.email,
      password: options.password
    };

    const response = await client.post('', {
      query,
      variables
    });

    if (response.data.errors) {
      throw new Error(response.data.errors.map(e => e.message).join(', '));
    }

    if (!response.data.data.authentication.login.responseResult.succeeded) {
      throw new Error(response.data.data.authentication.login.responseResult.message);
    }

    const jwt = response.data.data.authentication.login.jwt;
    console.log('Successfully logged in to Wiki.js');
    return jwt;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}

/**
 * Create content in Wiki.js
 */
async function createContent(jwt, { path: pagePath, title, content, description, tags }) {
  try {
    console.log(`Creating page at path: ${pagePath}`);

    // Set up authentication header
    client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

    const query = `
      mutation CreatePage(
        $content: String!,
        $description: String!,
        $editor: String!,
        $isPublished: Boolean!,
        $isPrivate: Boolean!,
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
            path: $pagePath,
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
      description: description || "No description provided",
      editor: "markdown",
      isPublished: true,
      isPrivate: false,
      locale: "en",
      pagePath,
      tags: tags || [],
      title
    };

    const response = await client.post('', {
      query,
      variables
    });

    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      throw new Error(response.data.errors.map(e => e.message).join(', '));
    }

    console.log(`Created page: ${pagePath}`);
    return true;
  } catch (error) {
    console.error(`Error creating page ${pagePath}:`, error.message);
    return false;
  }
}

/**
 * Process a markdown file and create a page in Wiki.js
 */
async function processFile(jwt, filePath, contentDir) {
  try {
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data, content: markdownContent } = matter(content);
    
    // Extract metadata
    const title = data.title || path.basename(filePath, path.extname(filePath));
    const description = data.description || 'No description provided';
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
    
    const result = await createContent(jwt, {
      path: wikijsPath,
      title,
      content: markdownContent,
      description,
      tags
    });
    
    return result;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
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
    
    console.log(`Starting direct import from ${contentDir} to ${options.wikiUrl}`);
    
    // Login to Wiki.js
    const jwt = await login();
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files`);
    
    // Process files
    const results = {
      success: 0,
      failed: 0
    };
    
    for (const file of files) {
      const result = await processFile(jwt, file, contentDir);
      
      if (result) {
        results.success++;
      } else {
        results.failed++;
      }
    }
    
    console.log('\nImport complete!');
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run the script
main();