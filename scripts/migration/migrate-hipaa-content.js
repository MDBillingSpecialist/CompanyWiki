#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path configurations
const ASSETS_DIR = path.join(process.cwd(), '../assets');
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Mapping of source files to destination paths
const FILE_MAPPING = {
  // Core documentation files
  'HIPAA_Wiki_Home.md': 'hipaa/index.md',
  'HIPAA_Comprehensive_Guide.md': 'hipaa/comprehensive-guide.md',
  'Technical_Security_Standards.md': 'hipaa/core/technical-security.md',
  'Access_Control_Authentication.md': 'hipaa/core/access-control.md',
  'Incident_Response.md': 'hipaa/core/incident-response.md',
  'CCM_Specific_Requirements.md': 'hipaa/core/ccm-specific-requirements.md',
  'HIPAA_Compliance_Documentation.md': 'hipaa/compliance-documentation.md',
  'LLM_HIPAA_Compliance.md': 'hipaa/llm-compliance.md',
  
  // Tools files
  'tools/Compliance_Dashboard.md': 'hipaa/tools/compliance-dashboard.md',
  'tools/Interactive_Checklists.md': 'hipaa/tools/checklists.md',
  'tools/Role_Based_Guides.md': 'hipaa/tools/role-based-guides.md',
  'tools/Documentation_Templates.md': 'hipaa/tools/documentation-templates.md'
};

// Generate frontmatter for markdown files
function generateFrontmatter(title, description, tags) {
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return `---
title: ${title}
description: ${description}
lastUpdated: ${now}
tags: [${tags}]
---

`;
}

// Extract title from markdown content
function extractTitle(content) {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 'HIPAA Documentation';
}

// Generate description from markdown content
function extractDescription(content) {
  // First try to find an overview section
  const descriptionMatch = content.match(/^##\s+Overview\s*\n\s*(.+)$/m);
  
  // If not found, try to get the first paragraph after the title
  if (descriptionMatch) {
    return descriptionMatch[1].substring(0, 160);
  } else {
    const firstParaMatch = content.replace(/^#\s+.+\n+/m, '').match(/^([^\n]+)/);
    return firstParaMatch 
      ? firstParaMatch[1].substring(0, 160) 
      : 'HIPAA compliance documentation and guidelines';
  }
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

// Generate tags based on file path and content
function generateTags(sourceFile, content) {
  const baseTags = ["'hipaa'", "'compliance'", "'healthcare'"];
  
  // Add specific tags based on filename
  if (sourceFile.includes('Security')) {
    baseTags.push("'security'");
  }
  if (sourceFile.includes('Checklist') || sourceFile.includes('Interactive')) {
    baseTags.push("'checklist'");
  }
  if (sourceFile.includes('Template')) {
    baseTags.push("'template'");
  }
  if (sourceFile.includes('Dashboard')) {
    baseTags.push("'dashboard'");
  }
  if (sourceFile.includes('Access_Control')) {
    baseTags.push("'access-control'");
  }
  if (sourceFile.includes('Incident')) {
    baseTags.push("'incident-response'");
  }
  if (sourceFile.includes('LLM')) {
    baseTags.push("'llm'", "'ai'");
  }
  
  return baseTags.join(', ');
}

// Fix markdown content to ensure proper structure
function processMarkdownContent(content) {
  // Ensure there's a title at the top
  if (!content.match(/^#\s+/m)) {
    content = `# HIPAA Documentation\n\n${content}`;
  }
  
  // Fix Markdown list formatting
  content = content
    // Ensure space after list markers
    .replace(/^([\*\-])([\w])/gm, '$1 $2')
    // Ensure proper line breaks before lists
    .replace(/([^\n])\n^([\*\-] )/gm, '$1\n\n$2');
    
  return content;
}

// Migrate a single file
function migrateFile(sourceFile, destFile) {
  try {
    // Read source file
    const sourcePath = path.join(ASSETS_DIR, sourceFile);
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${sourcePath}`);
      return false;
    }
    
    let content = fs.readFileSync(sourcePath, 'utf8');
    
    // Process content to ensure proper structure
    content = processMarkdownContent(content);
    
    // Extract metadata
    const title = extractTitle(content);
    const description = extractDescription(content);
    const tags = generateTags(sourceFile, content);
    
    // Generate frontmatter
    const frontmatter = generateFrontmatter(title, description, tags);
    
    // Create destination directory if it doesn't exist
    const destPath = path.join(CONTENT_DIR, destFile);
    createDirectories(path.dirname(destPath));
    
    // Process content to fix links and other adjustments
    let processedContent = content
      // Update internal links
      .replace(/\]\(\.\/([^)]+)\.md\)/g, (match, p1) => {
        // Convert links like ./File_Name.md to /wiki/hipaa/file-name
        const fileName = p1.toLowerCase().replace(/_/g, '-');
        return `](/wiki/hipaa/${fileName})`;
      });
    
    // Write to destination
    fs.writeFileSync(destPath, frontmatter + processedContent, 'utf8');
    console.log(`✅ Migrated: ${sourceFile} → ${destFile}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error migrating ${sourceFile}: ${error.message}`);
    return false;
  }
}

// Main execution function
function migrateContent() {
  console.log('\n🚀 Starting HIPAA content migration\n');
  
  let successCount = 0;
  let failCount = 0;
  
  // Process each file in the mapping
  Object.entries(FILE_MAPPING).forEach(([source, destination]) => {
    const success = migrateFile(source, destination);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  });
  
  // Create index files for core and tools
  createIndexFiles();
  
  console.log(`\n📊 Migration complete: ${successCount} succeeded, ${failCount} failed\n`);
}

// Create index files for subsections
function createIndexFiles() {
  // Core index
  const coreIndexPath = path.join(CONTENT_DIR, 'hipaa/core/index.md');
  const coreIndexContent = generateFrontmatter(
    "HIPAA Core Requirements", 
    "Overview of core HIPAA compliance requirements covering technical security, access control, data integrity, and incident response.",
    "'hipaa', 'compliance', 'security', 'core-requirements'"
  ) + `# HIPAA Core Requirements

## Overview

This section contains detailed documentation on the core compliance requirements for HIPAA. These guides cover the fundamental technical and procedural aspects that healthcare organizations must implement.

## Key Sections

* [Technical Security Standards](/wiki/hipaa/core/technical-security)
* [Access Control & Authentication](/wiki/hipaa/core/access-control)
* [Incident Response Procedures](/wiki/hipaa/core/incident-response)
* [CCM Specific Requirements](/wiki/hipaa/core/ccm-specific-requirements)

## Implementation Approach

The documentation in this section provides both regulatory requirements and practical implementation guidance. Each article covers the specific HIPAA regulations along with recommended approaches for implementation.
`;

  // Tools index
  const toolsIndexPath = path.join(CONTENT_DIR, 'hipaa/tools/index.md');
  const toolsIndexContent = generateFrontmatter(
    "HIPAA Tools & Resources", 
    "Interactive tools and resources to help implement and maintain HIPAA compliance, including checklists, templates, and role-based guides.",
    "'hipaa', 'compliance', 'tools', 'resources', 'checklists'"
  ) + `# HIPAA Tools & Resources

## Overview

This section provides interactive tools and practical resources to help your organization implement and maintain HIPAA compliance.

## Available Tools

* [Compliance Dashboard](/wiki/hipaa/tools/compliance-dashboard) - Track your compliance status
* [Interactive Checklists](/wiki/hipaa/tools/checklists) - Comprehensive checklists for different aspects of compliance
* [Role-Based Guides](/wiki/hipaa/tools/role-based-guides) - Tailored guidance for different roles in your organization
* [Documentation Templates](/wiki/hipaa/tools/documentation-templates) - Templates for policies, procedures, and other required documentation

## Getting Started

Select the appropriate tool from the list above based on your current needs. The interactive checklists are a good starting point for evaluating your current compliance status.
`;

  try {
    createDirectories(path.dirname(coreIndexPath));
    createDirectories(path.dirname(toolsIndexPath));
    
    fs.writeFileSync(coreIndexPath, coreIndexContent, 'utf8');
    fs.writeFileSync(toolsIndexPath, toolsIndexContent, 'utf8');
    
    console.log('✅ Created index files for subsections');
  } catch (error) {
    console.error(`❌ Error creating index files: ${error.message}`);
  }
}

// Run the migration
migrateContent();