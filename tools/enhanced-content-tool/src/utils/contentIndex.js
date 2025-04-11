/**
 * Content indexing for finding related content
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Main content index with document metadata
const contentIndex = {
  documents: [],  // All document metadata
  tagIndex: {},   // Maps tags to documents
  categoryIndex: {} // Maps categories/sections to documents
};

/**
 * Scan all content and build searchable indexes
 */
async function buildContentIndex() {
  const contentDir = path.join(process.cwd(), 'content');
  
  // Reset indexes
  contentIndex.documents = [];
  contentIndex.tagIndex = {};
  contentIndex.categoryIndex = {};
  
  // Scan content directory
  await scanDirectory(contentDir);
  
  // Build tag and category indexes
  buildTagIndex();
  buildCategoryIndex();
  
  return contentIndex;
}

/**
 * Recursively scan directories for markdown content
 * @param {string} dirPath - Directory path to scan
 * @param {string} relativePath - Relative path from content root
 */
async function scanDirectory(dirPath, relativePath = '') {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        await indexDocument(fullPath, relPath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Parse and index an individual document
 * @param {string} filePath - File path to index
 * @param {string} relativePath - Relative path from content root
 */
async function indexDocument(filePath, relativePath) {
  try {
    // Read and parse frontmatter
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdown } = matter(content);
    
    // Calculate path for wiki links
    const pathParts = relativePath.split(path.sep);
    pathParts[pathParts.length - 1] = pathParts[pathParts.length - 1].replace('.md', '');
    const wikiPath = `/wiki/${pathParts.join('/')}`;
    
    // Create document entry
    const document = {
      title: data.title || 'Untitled',
      description: data.description || '',
      path: wikiPath,
      filePath,
      relativePath,
      tags: normalizeTags(data.tags || []),
      category: pathParts[0] || 'general',
      subcategory: pathParts.length > 1 ? pathParts[1] : null,
      lastUpdated: data.lastUpdated,
      docType: getDocumentType(relativePath, data),
      content: markdown,
      metadata: { ...data }
    };
    
    contentIndex.documents.push(document);
    
    return document;
  } catch (error) {
    console.error(`Error indexing document ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Normalize tags to a consistent format
 * @param {Array|string} tags - Tags to normalize
 * @returns {Array} - Normalized tags
 */
function normalizeTags(tags) {
  if (!tags) return [];
  
  // Handle string format (comma-separated)
  if (typeof tags === 'string') {
    return tags.split(',').map(tag => normalizeTag(tag));
  }
  
  // Handle array format
  if (Array.isArray(tags)) {
    return tags.map(tag => normalizeTag(tag));
  }
  
  return [];
}

/**
 * Normalize a single tag
 * @param {string} tag - Tag to normalize
 * @returns {string} - Normalized tag
 */
function normalizeTag(tag) {
  if (typeof tag !== 'string') return '';
  
  // Remove quotes and trim whitespace
  return tag.replace(/['"]/g, '').toLowerCase().trim();
}

/**
 * Determine document type from path and frontmatter
 * @param {string} path - Document path
 * @param {Object} frontmatter - Document frontmatter
 * @returns {string} - Document type
 */
function getDocumentType(path, frontmatter) {
  if (path.startsWith('sop/')) return 'sop';
  if (path.startsWith('hipaa/')) return 'hipaa';
  if (path.startsWith('company-wiki/')) return 'general';
  
  if (frontmatter.sop_id) return 'sop';
  if (frontmatter.category === 'HIPAA') return 'hipaa';
  
  return 'general';
}

/**
 * Build index mapping tags to documents
 */
function buildTagIndex() {
  contentIndex.documents.forEach(doc => {
    if (doc.tags && Array.isArray(doc.tags)) {
      doc.tags.forEach(tag => {
        if (!contentIndex.tagIndex[tag]) {
          contentIndex.tagIndex[tag] = [];
        }
        contentIndex.tagIndex[tag].push(doc);
      });
    }
  });
}

/**
 * Build index mapping categories to documents
 */
function buildCategoryIndex() {
  contentIndex.documents.forEach(doc => {
    // Primary category
    if (!contentIndex.categoryIndex[doc.category]) {
      contentIndex.categoryIndex[doc.category] = [];
    }
    contentIndex.categoryIndex[doc.category].push(doc);
    
    // Subcategory if present
    if (doc.subcategory) {
      const subcatKey = `${doc.category}/${doc.subcategory}`;
      if (!contentIndex.categoryIndex[subcatKey]) {
        contentIndex.categoryIndex[subcatKey] = [];
      }
      contentIndex.categoryIndex[subcatKey].push(doc);
    }
  });
}

module.exports = {
  buildContentIndex,
  getContentIndex: () => contentIndex
};
