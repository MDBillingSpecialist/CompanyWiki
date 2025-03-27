/**
 * Master Migration Script for Wiki.js Hybrid Architecture
 * 
 * This script tries multiple approaches to migrate content to Wiki.js:
 * 1. Direct REST API import
 * 2. GraphQL API import with authentication
 * 3. Fallback to UI automation with Playwright
 * 
 * Usage: 
 * node master-migration.js --source=./sample-content --wikiUrl=http://localhost:3200
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const axios = require('axios');
const { program } = require('commander');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './sample-content')
  .option('--wikiUrl <url>', 'URL of the Wiki.js instance', 'http://localhost:3200')
  .option('--apiUrl <url>', 'URL of the API integration layer', 'http://localhost:3100')
  .option('--email <email>', 'Admin email', process.env.WIKI_ADMIN_USER || 'admin@example.com')
  .option('--password <password>', 'Admin password', process.env.WIKI_ADMIN_PASSWORD || 'wikijsrocks')
  .option('--skipPlaywright', 'Skip Playwright installation if it fails', false)
  .parse(process.argv);

const options = program.opts();

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
 * Parse a markdown file to extract its content and metadata
 */
function parseMarkdownFile(filePath, contentDir) {
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
  
  return {
    path: wikijsPath,
    title,
    content: markdownContent,
    description,
    tags
  };
}

/**
 * Attempt to import content using direct API
 */
async function tryDirectApiImport(parsedContent) {
  try {
    console.log(`[REST API] Attempting to import ${parsedContent.path}`);
    
    // Create a direct HTTP request
    const response = await axios({
      method: 'post',
      url: `${options.wikiUrl}/api/pages`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        path: parsedContent.path,
        title: parsedContent.title,
        content: parsedContent.content,
        description: parsedContent.description,
        tags: parsedContent.tags,
        editor: 'markdown',
        locale: 'en',
        isPublished: true,
        isPrivate: false
      }
    });
    
    console.log(`[REST API] Successfully imported ${parsedContent.path}`);
    return true;
  } catch (error) {
    console.error(`[REST API] Failed to import ${parsedContent.path}:`, error.message);
    return false;
  }
}

/**
 * Attempt to import content using GraphQL API with authentication
 */
async function tryGraphQLImport(parsedContent) {
  try {
    console.log(`[GraphQL] Attempting to import ${parsedContent.path}`);
    
    // First login to get JWT token
    const loginResponse = await axios.post(`${options.wikiUrl}/graphql`, {
      query: `
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
            }
          }
        }
      `,
      variables: {
        username: options.email,
        password: options.password
      }
    });
    
    if (loginResponse.data.errors || !loginResponse.data.data?.authentication?.login?.responseResult?.succeeded) {
      throw new Error('Login failed');
    }
    
    const jwt = loginResponse.data.data.authentication.login.jwt;
    
    // Now create the page with JWT authentication
    const createResponse = await axios.post(
      `${options.wikiUrl}/graphql`,
      {
        query: `
          mutation CreatePage($content: String!, $description: String!, $editor: String!, $isPublished: Boolean!, $isPrivate: Boolean!, $locale: String!, $path: String!, $tags: [String]!, $title: String!) {
            pages {
              create(content: $content, description: $description, editor: $editor, isPublished: $isPublished, isPrivate: $isPrivate, locale: $locale, path: $path, tags: $tags, title: $title) {
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
        `,
        variables: {
          content: parsedContent.content,
          description: parsedContent.description,
          editor: "markdown",
          isPublished: true,
          isPrivate: false,
          locale: "en",
          path: parsedContent.path,
          tags: parsedContent.tags,
          title: parsedContent.title
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      }
    );
    
    if (createResponse.data.errors || !createResponse.data.data?.pages?.create?.responseResult?.succeeded) {
      throw new Error('Page creation failed');
    }
    
    console.log(`[GraphQL] Successfully imported ${parsedContent.path}`);
    return true;
  } catch (error) {
    console.error(`[GraphQL] Failed to import ${parsedContent.path}:`, error.message);
    return false;
  }
}

/**
 * Attempt to import content using Playwright
 */
async function tryPlaywrightImport(parsedContent) {
  try {
    console.log(`[Playwright] Attempting to install dependencies...`);
    
    // First ensure Playwright is installed
    try {
      await execAsync('npm list playwright || npm install playwright');
      await execAsync('npx playwright install chromium');
    } catch (installError) {
      if (options.skipPlaywright) {
        console.error('[Playwright] Failed to install, skipping as requested');
        return false;
      }
      throw installError;
    }
    
    console.log(`[Playwright] Setting up automated UI import for ${parsedContent.path}`);
    
    // Create a temporary script to execute
    const tempScriptPath = path.join(__dirname, 'temp-import.js');
    
    const scriptContent = `
      const { chromium } = require('playwright');
      
      async function importPage() {
        const browser = await chromium.launch({ headless: false });
        try {
          const context = await browser.newContext();
          const page = await context.newPage();
          
          // Login to Wiki.js
          await page.goto('${options.wikiUrl}/login');
          await page.fill('input[type="email"]', '${options.email}');
          await page.fill('input[type="password"]', '${options.password}');
          await page.click('button[type="submit"]');
          await page.waitForNavigation();
          
          // Create new page
          await page.goto('${options.wikiUrl}/new');
          await page.waitForSelector('input[placeholder="Title"]');
          await page.fill('input[placeholder="Title"]', ${JSON.stringify(parsedContent.title)});
          
          // Fill path
          const pathInput = await page.locator('input[placeholder="Path"]');
          await pathInput.click();
          await pathInput.fill(${JSON.stringify(parsedContent.path)});
          
          // Select Markdown editor
          await page.click('button:has-text("Select")');
          await page.click('div[role="menuitem"]:has-text("Markdown")');
          
          // Continue to editor
          await page.click('button:has-text("Continue")');
          
          // Wait for editor to load
          await page.waitForSelector('.ace_content');
          
          // Fill editor with content
          await page.evaluate(content => {
            const editor = ace.edit(document.querySelector('.ace_editor'));
            editor.setValue(content);
          }, ${JSON.stringify(parsedContent.content)});
          
          // Save the page
          await page.click('button:has-text("Create")');
          await page.waitForNavigation();
          
          console.log('Page created successfully');
          return true;
        } catch (error) {
          console.error('Error:', error);
          return false;
        } finally {
          await browser.close();
        }
      }
      
      importPage().then(process.exit);
    `;
    
    fs.writeFileSync(tempScriptPath, scriptContent);
    
    // Execute the script
    console.log(`[Playwright] Running automated UI import...`);
    await execAsync(`node ${tempScriptPath}`);
    
    // Clean up
    fs.unlinkSync(tempScriptPath);
    
    console.log(`[Playwright] Successfully imported ${parsedContent.path}`);
    return true;
  } catch (error) {
    console.error(`[Playwright] Failed to import ${parsedContent.path}:`, error.message);
    return false;
  }
}

/**
 * Create HIPAA sample data in the API layer
 */
async function createHipaaData() {
  try {
    console.log(`Creating HIPAA sample data via API layer at ${options.apiUrl}`);
    
    // Sample compliance status data
    const complianceStatus = [
      {
        category: 'technical',
        status: 'compliant',
        lastReviewed: new Date('2025-01-15'),
        nextReview: new Date('2025-07-15'),
        progress: 100,
        itemsTotal: 25,
        itemsCompleted: 25
      },
      {
        category: 'administrative',
        status: 'at-risk',
        lastReviewed: new Date('2025-02-10'),
        nextReview: new Date('2025-08-10'),
        progress: 85,
        itemsTotal: 20,
        itemsCompleted: 17
      },
      {
        category: 'physical',
        status: 'at-risk',
        lastReviewed: new Date('2025-01-20'),
        nextReview: new Date('2025-07-20'),
        progress: 80,
        itemsTotal: 15,
        itemsCompleted: 12
      },
      {
        category: 'llm',
        status: 'non-compliant',
        lastReviewed: new Date('2025-02-05'),
        nextReview: new Date('2025-05-05'),
        progress: 60,
        itemsTotal: 10,
        itemsCompleted: 6
      },
      {
        category: 'ccm',
        status: 'pending-review',
        lastReviewed: null,
        nextReview: new Date('2025-04-01'),
        progress: 0,
        itemsTotal: 12,
        itemsCompleted: 0
      }
    ];
    
    // Upload compliance status data
    for (const status of complianceStatus) {
      try {
        await axios.post(`${options.apiUrl}/api/hipaa/status`, status);
        console.log(`Created compliance status for category: ${status.category}`);
      } catch (error) {
        console.error(`Failed to create compliance status for ${status.category}:`, error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Failed to create HIPAA data:', error.message);
    return false;
  }
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
    
    console.log(`Starting master migration from ${contentDir} to ${options.wikiUrl}`);
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files`);
    
    // Process files
    const results = {
      success: 0,
      failed: 0
    };
    
    for (const file of files) {
      console.log(`\nProcessing: ${file}`);
      const parsedContent = parseMarkdownFile(file, contentDir);
      
      // Try each method in sequence until one succeeds
      let succeeded = false;
      
      // Method 1: Direct API
      succeeded = await tryDirectApiImport(parsedContent);
      
      // Method 2: GraphQL API with auth (if Method 1 failed)
      if (!succeeded) {
        succeeded = await tryGraphQLImport(parsedContent);
      }
      
      // Method 3: Playwright UI automation (if Methods 1 & 2 failed)
      if (!succeeded && !options.skipPlaywright) {
        succeeded = await tryPlaywrightImport(parsedContent);
      }
      
      // Update results
      if (succeeded) {
        results.success++;
        console.log(`✅ Successfully imported: ${file}`);
      } else {
        results.failed++;
        console.log(`❌ Failed to import: ${file}`);
      }
    }
    
    // Create HIPAA sample data
    await createHipaaData();
    
    // Print results
    console.log('\nMigration complete!');
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
main();