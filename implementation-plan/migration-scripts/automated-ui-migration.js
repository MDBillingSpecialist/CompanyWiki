/**
 * Automated UI-based Content Migration Script
 * 
 * This script uses Playwright to automate content migration through the Wiki.js web interface
 * 
 * Prerequisites:
 * - npm install playwright
 * - npm install gray-matter
 * - npm install commander
 * - npm install dotenv
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { program } = require('commander');
const { chromium } = require('playwright');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './sample-content')
  .option('--wikiUrl <url>', 'URL of the Wiki.js instance', 'http://localhost:3200')
  .option('--username <username>', 'Wiki.js admin username', process.env.WIKI_ADMIN_USER || 'admin@example.com')
  .option('--password <password>', 'Wiki.js admin password', process.env.WIKI_ADMIN_PASSWORD || 'wikijsrocks')
  .option('--headless <boolean>', 'Run in headless mode', false)
  .parse(process.argv);

const options = program.opts();

/**
 * Main function to migrate content
 */
async function migrateContent() {
  const browser = await chromium.launch({ 
    headless: options.headless === 'true',
    slowMo: 100 // Slow down actions to avoid detection as bot
  });
  
  try {
    const contentDir = path.resolve(options.source);
    
    if (!fs.existsSync(contentDir)) {
      console.error(`Content directory not found: ${contentDir}`);
      process.exit(1);
    }
    
    console.log(`Starting UI-based migration from ${contentDir} to ${options.wikiUrl}`);
    console.log(`Using credentials: ${options.username} / ********`);
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files to migrate`);
    
    // Create browser context
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Login to Wiki.js
    await login(page);
    console.log('Successfully logged in to Wiki.js');
    
    // Import each content file
    const results = {
      success: 0,
      failed: 0
    };
    
    for (const file of files) {
      try {
        console.log(`Processing: ${file}`);
        const result = await importFile(page, file, contentDir);
        
        if (result) {
          results.success++;
          console.log(`✅ Successfully imported: ${file}`);
        } else {
          results.failed++;
          console.log(`❌ Failed to import: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
        results.failed++;
      }
      
      // Wait a bit between imports to avoid overwhelming the UI
      await page.waitForTimeout(1000);
    }
    
    // Print results
    console.log('\nMigration complete!');
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await browser.close();
  }
}

/**
 * Login to Wiki.js
 */
async function login(page) {
  await page.goto(`${options.wikiUrl}/login`);
  
  // Check if we're already on the login page
  const loginFormExists = await page.isVisible('input[type="email"]');
  
  if (loginFormExists) {
    // Fill in login form
    await page.fill('input[type="email"]', options.username);
    await page.fill('input[type="password"]', options.password);
    await page.click('button[type="submit"]');
    
    // Wait for navigation to complete
    await page.waitForNavigation();
    
    // Check if login was successful
    const loginError = await page.isVisible('.v-messages__message');
    if (loginError) {
      const errorText = await page.textContent('.v-messages__message');
      throw new Error(`Login failed: ${errorText}`);
    }
  } else {
    console.log('Already logged in or login page not found');
  }
}

/**
 * Import a Markdown file through the UI
 */
async function importFile(page, filePath, contentDir) {
  try {
    // Read and parse the file
    const content = fs.readFileSync(filePath, 'utf8');
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
    
    // Navigate to the new page form
    await page.goto(`${options.wikiUrl}/new`);
    
    // Wait for the new page form to load
    await page.waitForSelector('input[placeholder="Title"]');
    
    // Fill in the title
    await page.fill('input[placeholder="Title"]', title);
    
    // Fill in the path
    const pathInput = await page.locator('input[label="Path"]');
    await pathInput.clear();
    await pathInput.fill(wikijsPath);
    
    // Select Markdown editor
    await page.click('button:has-text("Select")');
    await page.click('div[role="menuitem"]:has-text("Markdown")');
    
    // Continue to editor
    await page.click('button:has-text("Continue")');
    
    // Wait for the editor to load
    await page.waitForSelector('.ace_content');
    
    // Clear any existing content and add our content
    await page.evaluate((content) => {
      const editor = ace.edit(document.querySelector('.ace_editor'));
      editor.setValue(content);
    }, markdownContent);
    
    // Fill description if present
    if (description) {
      await page.click('div[contenteditable="true"]');
      await page.evaluate((description) => {
        document.querySelector('div[contenteditable="true"]').innerText = description;
      }, description);
    }
    
    // Add tags if present
    if (tags.length > 0) {
      for (const tag of tags) {
        await page.click('input[placeholder="Add a tag..."]');
        await page.fill('input[placeholder="Add a tag..."]', tag);
        await page.press('input[placeholder="Add a tag..."]', 'Enter');
      }
    }
    
    // Save the page
    await page.click('button:has-text("Create")');
    
    // Wait for page creation to complete
    await page.waitForNavigation();
    
    return true;
  } catch (error) {
    console.error(`Failed to import ${filePath}:`, error);
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

// Run the migration
migrateContent().catch(console.error);