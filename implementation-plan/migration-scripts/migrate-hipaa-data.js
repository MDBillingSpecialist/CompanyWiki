/**
 * HIPAA Data Migration Script
 * 
 * Migrates HIPAA-specific data like checklists and dashboard status
 * from the Next.js wiki to the hybrid architecture
 * 
 * Usage:
 * NODE_ENV=production node migrate-hipaa-data.js --source=/path/to/src --apiUrl=http://localhost:3100 --apiKey=your-api-key
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the src directory of Next.js wiki', './src')
  .option('--apiUrl <url>', 'URL of the API integration layer', 'http://localhost:3100')
  .option('--apiKey <key>', 'API key for authentication')
  .option('--dryRun', 'Run without making changes', false)
  .parse(process.argv);

const options = program.opts();

// API client
const client = axios.create({
  baseURL: options.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${options.apiKey || process.env.API_KEY}`
  }
});

/**
 * Load JSON file
 */
function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading JSON file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Migrate HIPAA dashboard data
 */
async function migrateDashboardData(sourcePath) {
  try {
    const dashboardDataPath = path.join(sourcePath, 'lib/mock-data/hipaa-dashboard-data.ts');
    
    if (!fs.existsSync(dashboardDataPath)) {
      console.log(`Dashboard data file not found: ${dashboardDataPath}`);
      return false;
    }
    
    // Read dashboard data file
    const fileContent = fs.readFileSync(dashboardDataPath, 'utf8');
    
    // Extract the JSON data using regex (since it's a TypeScript file, not pure JSON)
    const complianceStatusMatch = fileContent.match(/export const complianceStatus\s*=\s*(\[[\s\S]*?\]);/);
    const upcomingReviewsMatch = fileContent.match(/export const upcomingReviews\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!complianceStatusMatch || !upcomingReviewsMatch) {
      console.error('Failed to extract dashboard data from TypeScript file');
      return false;
    }
    
    // Parse the extracted JSON
    const complianceStatus = eval(`(${complianceStatusMatch[1]})`);
    const upcomingReviews = eval(`(${upcomingReviewsMatch[1]})`);
    
    // Create dashboard data in the API
    if (options.dryRun) {
      console.log('[DRY RUN] Would migrate dashboard data:', { 
        complianceStatus: complianceStatus.length,
        upcomingReviews: upcomingReviews.length
      });
      return true;
    }
    
    // Upload compliance status
    for (const status of complianceStatus) {
      await client.post('/api/hipaa/status', status);
      console.log(`Migrated compliance status for category: ${status.category}`);
    }
    
    // Upload upcoming reviews
    for (const review of upcomingReviews) {
      await client.post('/api/hipaa/reviews', review);
      console.log(`Migrated review: ${review.title}`);
    }
    
    console.log('Dashboard data migration complete');
    return true;
  } catch (error) {
    console.error('Error migrating dashboard data:', error.message);
    return false;
  }
}

/**
 * Migrate HIPAA checklist data
 */
async function migrateChecklistData(sourcePath) {
  try {
    const checklistDataPath = path.join(sourcePath, 'lib/mock-data/hipaa-checklist-data.ts');
    
    if (!fs.existsSync(checklistDataPath)) {
      console.log(`Checklist data file not found: ${checklistDataPath}`);
      return false;
    }
    
    // Read checklist data file
    const fileContent = fs.readFileSync(checklistDataPath, 'utf8');
    
    // Extract the JSON data using regex
    const checklistCategoriesMatch = fileContent.match(/export const checklistCategories\s*=\s*(\[[\s\S]*?\]);/);
    
    if (!checklistCategoriesMatch) {
      console.error('Failed to extract checklist data from TypeScript file');
      return false;
    }
    
    // Parse the extracted JSON
    const checklistCategories = eval(`(${checklistCategoriesMatch[1]})`);
    
    // Create checklist data in the API
    if (options.dryRun) {
      console.log('[DRY RUN] Would migrate checklist data:', { 
        categories: checklistCategories.length,
        items: checklistCategories.reduce((total, cat) => total + cat.items.length, 0)
      });
      return true;
    }
    
    // Upload each checklist category
    for (const category of checklistCategories) {
      await client.post('/api/hipaa/checklists', category);
      console.log(`Migrated checklist category: ${category.name}`);
    }
    
    console.log('Checklist data migration complete');
    return true;
  } catch (error) {
    console.error('Error migrating checklist data:', error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const sourcePath = path.resolve(options.source);
    
    if (!fs.existsSync(sourcePath)) {
      console.error(`Source directory not found: ${sourcePath}`);
      process.exit(1);
    }
    
    console.log(`Starting HIPAA data migration from ${sourcePath} to ${options.apiUrl}`);
    console.log(`Dry run: ${options.dryRun}`);
    
    // Migrate dashboard data
    const dashboardResult = await migrateDashboardData(sourcePath);
    
    // Migrate checklist data
    const checklistResult = await migrateChecklistData(sourcePath);
    
    console.log('\nHIPAA data migration complete!');
    console.log(`Dashboard migration: ${dashboardResult ? 'Success' : 'Failed'}`);
    console.log(`Checklist migration: ${checklistResult ? 'Success' : 'Failed'}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the script
main();