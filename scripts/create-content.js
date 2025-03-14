#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Root content directory
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Available sections
const SECTIONS = {
  'company-wiki': 'Company Wiki',
  'hipaa': 'HIPAA Documentation',
  'sop': 'Standard Operating Procedures'
};

// Available subsections
const SUBSECTIONS = {
  'company-wiki': ['about', 'teams', 'policies', 'onboarding'],
  'hipaa': ['core', 'tools', 'llm-compliance'],
  'sop': ['engineering', 'compliance', 'operations']
};

// Core section more nested directories
const CORE_SECTIONS = ['technical-security', 'access-control', 'data-integrity', 'privacy', 'incident-response'];

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Generate frontmatter template
function generateFrontmatter(title, description, tags) {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return `---
title: ${title}
description: ${description}
lastUpdated: ${now}
tags: [${tags}]
---

# ${title}

## Overview

${description}

`;
}

// Create directories recursively if they don't exist
function createDirectories(dirPath) {
  const dirname = path.dirname(dirPath);
  if (!fs.existsSync(dirname)) {
    createDirectories(dirname);
  }
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
}

// Main function
async function main() {
  console.log('\n📝 Company Wiki Content Generator\n');
  
  // Select section
  console.log('Available sections:');
  Object.entries(SECTIONS).forEach(([key, value]) => {
    console.log(`  ${key} - ${value}`);
  });
  
  const section = await prompt('\nSelect section: ');
  if (!SECTIONS[section]) {
    console.error('❌ Invalid section!');
    rl.close();
    return;
  }
  
  // Select subsection if applicable
  let subsection = '';
  if (SUBSECTIONS[section]) {
    console.log('\nAvailable subsections:');
    SUBSECTIONS[section].forEach(sub => {
      console.log(`  ${sub}`);
    });
    
    subsection = await prompt('\nSelect subsection (or press Enter to skip): ');
    
    // For HIPAA core, we can go deeper
    let subsubsection = '';
    if (section === 'hipaa' && subsection === 'core') {
      console.log('\nAvailable core sections:');
      CORE_SECTIONS.forEach(sub => {
        console.log(`  ${sub}`);
      });
      
      subsubsection = await prompt('\nSelect core section (or press Enter to skip): ');
    }
    
    if (subsubsection) {
      subsection = `${subsection}/${subsubsection}`;
    }
  }
  
  // Get content details
  const filename = await prompt('\nEnter filename (without extension): ');
  const title = await prompt('Enter document title: ');
  const description = await prompt('Enter brief description: ');
  const tags = await prompt('Enter tags (comma-separated): ');
  
  // Format tags
  const formattedTags = tags
    .split(',')
    .map(tag => `'${tag.trim()}'`)
    .join(', ');
  
  // Create content path
  let contentPath = path.join(CONTENT_DIR, section);
  if (subsection) {
    contentPath = path.join(contentPath, subsection);
  }
  
  // Create directory if it doesn't exist
  createDirectories(contentPath);
  
  // Create file path
  const filePath = path.join(contentPath, `${filename}.md`);
  
  // Check if file already exists
  if (fs.existsSync(filePath)) {
    const overwrite = await prompt('\n⚠️ File already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n❌ Operation cancelled');
      rl.close();
      return;
    }
  }
  
  // Generate frontmatter and content
  const content = generateFrontmatter(title, description, formattedTags);
  
  // Write to file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`\n✅ Content created successfully at: ${filePath}`);
  console.log(`\n📂 URL path: /wiki/${section}${subsection ? '/' + subsection : ''}/${filename}`);
  
  rl.close();
}

// Run the script
main().catch(err => {
  console.error('Error:', err);
  rl.close();
});
