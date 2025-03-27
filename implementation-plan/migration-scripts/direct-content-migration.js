/**
 * Direct Wiki.js Content Migration Script
 * 
 * Migrates content directly to the Wiki.js database, bypassing the API
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Sequelize } = require('sequelize');
const { program } = require('commander');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './sample-content')
  .option('--dbHost <host>', 'Database host', 'localhost')
  .option('--dbPort <port>', 'Database port', '5432')
  .option('--dbUser <user>', 'Database user', 'wikijs')
  .option('--dbPass <password>', 'Database password', 'wikijs_password')
  .option('--dbName <name>', 'Database name', 'wiki')
  .option('--locale <locale>', 'Content locale', 'en')
  .option('--dryRun', 'Run without making changes', false)
  .parse(process.argv);

const options = program.opts();

// Helper function to generate hash for page ID
function generateHash(str, len = 8) {
  return crypto.createHash('md5').update(str).digest('hex').substring(0, len);
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
    
    console.log(`Starting direct content migration from ${contentDir}`);
    console.log(`Database: ${options.dbUser}@${options.dbHost}:${options.dbPort}/${options.dbName}`);
    console.log(`Dry run: ${options.dryRun}`);
    
    // Connect to database
    if (!options.dryRun) {
      console.log('Connecting to database...');
      var sequelize = new Sequelize({
        dialect: 'postgres',
        host: options.dbHost,
        port: options.dbPort,
        username: options.dbUser,
        password: options.dbPass,
        database: options.dbName,
        logging: false
      });
      
      // Test connection
      await sequelize.authenticate();
      console.log('Database connection established.');
    }
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files`);
    
    // Process files
    const results = {
      success: 0,
      failed: 0
    };
    
    // Get current timestamp
    const now = new Date();
    
    for (const file of files) {
      try {
        console.log(`Processing: ${file}`);
        
        // Read file content
        const content = fs.readFileSync(file, 'utf8');
        
        // Parse frontmatter
        const { data, content: markdownContent } = matter(content);
        
        // Extract metadata
        const title = data.title || path.basename(file, path.extname(file));
        const description = data.description || ' ';
        const tags = Array.isArray(data.tags) ? data.tags : 
                    (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []);
        
        // Create relative path for Wiki.js
        const relativePath = path.relative(contentDir, file);
        const wikijsPath = relativePath
          .replace(/index\.(md|mdx)$/, '') // Replace index.md with empty string
          .replace(/\.(md|mdx)$/, '') // Remove extension
          .replace(/\\/g, '/'); // Replace backslashes with forward slashes
        
        if (options.dryRun) {
          console.log(`[DRY RUN] Would create page at path: ${wikijsPath}`);
          console.log(`  Title: ${title}`);
          console.log(`  Description: ${description}`);
          console.log(`  Tags: ${tags.join(', ')}`);
          console.log(`  Content length: ${markdownContent.length} characters`);
          results.success++;
          continue;
        }
        
        // Check if page already exists
        const existingPage = await sequelize.query(
          'SELECT "id" FROM "pages" WHERE "path" = :path AND "localeCode" = :locale',
          {
            replacements: { path: wikijsPath, locale: options.locale },
            type: Sequelize.QueryTypes.SELECT
          }
        );
        
        if (existingPage.length > 0) {
          console.log(`Page already exists at path: ${wikijsPath}. Skipping.`);
          results.success++;
          continue;
        }
        
        // Insert page record
        const pageId = await sequelize.transaction(async (t) => {
          // Generate page ID based on path (for deterministic IDs)
          const pageHash = generateHash(`${wikijsPath}:${options.locale}`, 8);
          const pageId = parseInt(pageHash, 16) % 1000000; // Convert hash to numeric ID under 1M
          
          // Insert page
          await sequelize.query(
            `INSERT INTO "pages" ("id", "path", "hash", "title", "description", "createdAt", "updatedAt", "content", "contentType", "isPublished", "isPrivate", "privateNS", "publishStartDate", "publishEndDate", "authorId", "creatorId", "localeCode", "editorKey", "toc", "render")
            VALUES (:id, :path, :hash, :title, :description, :createdAt, :updatedAt, :content, :contentType, :isPublished, :isPrivate, :privateNS, :publishStartDate, :publishEndDate, 1, 1, :localeCode, :editorKey, :toc, :render)`,
            {
              replacements: {
                id: pageId,
                path: wikijsPath,
                hash: uuidv4(),
                title,
                description,
                createdAt: now,
                updatedAt: now,
                content: markdownContent,
                contentType: 'markdown',
                isPublished: true,
                isPrivate: false,
                privateNS: null,
                publishStartDate: null,
                publishEndDate: null,
                localeCode: options.locale,
                editorKey: 'markdown',
                toc: JSON.stringify([]),
                render: markdownContent
              },
              transaction: t
            }
          );
          
          // Create tags
          for (const tag of tags) {
            // Check if tag exists
            const existingTag = await sequelize.query(
              'SELECT "id" FROM "tags" WHERE "tag" = :tag',
              {
                replacements: { tag },
                type: Sequelize.QueryTypes.SELECT,
                transaction: t
              }
            );
            
            let tagId;
            if (existingTag.length > 0) {
              tagId = existingTag[0].id;
            } else {
              // Create tag
              const tagResult = await sequelize.query(
                `INSERT INTO "tags" ("tag", "title", "createdAt", "updatedAt") VALUES (:tag, :title, :createdAt, :updatedAt) RETURNING "id"`,
                {
                  replacements: {
                    tag,
                    title: tag.charAt(0).toUpperCase() + tag.slice(1), // Capitalize first letter
                    createdAt: now,
                    updatedAt: now
                  },
                  type: Sequelize.QueryTypes.INSERT,
                  transaction: t
                }
              );
              tagId = tagResult[0][0].id;
            }
            
            // Link tag to page
            await sequelize.query(
              `INSERT INTO "pageTags" ("pageId", "tagId", "createdAt", "updatedAt") VALUES (:pageId, :tagId, :createdAt, :updatedAt)`,
              {
                replacements: {
                  pageId,
                  tagId,
                  createdAt: now,
                  updatedAt: now
                },
                transaction: t
              }
            );
          }
          
          // Create page tree entry
          await sequelize.query(
            `INSERT INTO "pageTree" ("id", "path", "depth", "title", "isPrivate", "isFolder", "privateNS", "parent", "pageId", "localeCode", "createdAt", "updatedAt")
            VALUES (:id, :path, :depth, :title, :isPrivate, :isFolder, :privateNS, :parent, :pageId, :localeCode, :createdAt, :updatedAt)`,
            {
              replacements: {
                id: pageId,
                path: wikijsPath,
                depth: wikijsPath.split('/').filter(Boolean).length,
                title,
                isPrivate: false,
                isFolder: false,
                privateNS: null,
                parent: wikijsPath.split('/').slice(0, -1).join('/') || null,
                pageId,
                localeCode: options.locale,
                createdAt: now,
                updatedAt: now
              },
              transaction: t
            }
          );
          
          return pageId;
        });
        
        console.log(`Created page at path: ${wikijsPath} with ID: ${pageId}`);
        results.success++;
      } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
        results.failed++;
      }
    }
    
    console.log('\nMigration complete!');
    console.log(`Success: ${results.success}`);
    console.log(`Failed: ${results.failed}`);
    
    // Close database connection
    if (!options.dryRun && sequelize) {
      await sequelize.close();
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
main();