/**
 * Related content finder for suggesting document relationships
 */
const contentIndex = require('./contentIndex');
const stringSimilarity = require('string-similarity');

/**
 * Find related documents for a document
 * @param {Object} documentData - Document metadata and content
 * @param {number} limit - Maximum number of suggestions to return
 * @returns {Array} Related document suggestions
 */
function findRelatedContent(documentData, limit = 5) {
  const index = contentIndex.getContentIndex();
  const results = [];
  
  // 1. Tag-based matching (highest relevance)
  const tagMatches = findTagMatches(documentData.tags, index);
  tagMatches.forEach(match => {
    if (!results.some(r => r.document.path === match.document.path)) {
      results.push({
        document: match.document,
        relevance: match.relevance * 1.5, // Prioritize tag matches
        matchReason: 'Tags in common'
      });
    }
  });
  
  // 2. Category/subcategory matching
  const categoryMatches = findCategoryMatches(
    documentData.category,
    documentData.subcategory,
    index
  );
  categoryMatches.forEach(match => {
    if (!results.some(r => r.document.path === match.document.path)) {
      results.push({
        document: match.document,
        relevance: match.relevance * 1.2, // Good relevance for category matches
        matchReason: 'Same section'
      });
    }
  });
  
  // 3. Title/description similarity
  const textMatches = findTextMatches(
    documentData.title,
    documentData.description,
    index
  );
  textMatches.forEach(match => {
    if (!results.some(r => r.document.path === match.document.path)) {
      results.push({
        document: match.document,
        relevance: match.relevance,
        matchReason: 'Similar content'
      });
    }
  });
  
  // 4. Document type specific relations
  const typeSpecificMatches = findTypeSpecificMatches(documentData, index);
  typeSpecificMatches.forEach(match => {
    if (!results.some(r => r.document.path === match.document.path)) {
      results.push({
        document: match.document,
        relevance: match.relevance * 1.3, // Domain specific matches are valuable
        matchReason: match.matchReason
      });
    }
  });
  
  // Sort by relevance and limit results
  return results
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

/**
 * Find documents with matching tags
 * @param {Array} tags - Tags to match
 * @param {Object} index - Content index
 * @returns {Array} - Matching documents
 */
function findTagMatches(tags, index) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return [];
  }

  const matches = [];
  const normalizedTags = tags.map(tag => 
    typeof tag === 'string' ? tag.replace(/['"]/g, '').toLowerCase().trim() : ''
  ).filter(Boolean);
  
  // For each document, count matching tags
  index.documents.forEach(doc => {
    const docTags = (doc.tags || []).map(tag => 
      typeof tag === 'string' ? tag.replace(/['"]/g, '').toLowerCase().trim() : ''
    ).filter(Boolean);
    
    if (docTags.length === 0) return;
    
    // Count matching tags
    const matchingTags = normalizedTags.filter(tag => docTags.includes(tag));
    
    if (matchingTags.length > 0) {
      // Calculate relevance score - more matching tags = higher relevance
      const relevance = matchingTags.length / Math.max(normalizedTags.length, docTags.length);
      matches.push({
        document: doc,
        relevance,
        matchingTags
      });
    }
  });
  
  return matches;
}

/**
 * Find documents in the same category/subcategory
 * @param {string} category - Category to match
 * @param {string} subcategory - Subcategory to match
 * @param {Object} index - Content index
 * @returns {Array} - Matching documents
 */
function findCategoryMatches(category, subcategory, index) {
  const matches = [];
  
  if (!category) return matches;
  
  // Get documents from same exact subcategory first (highest relevance)
  if (subcategory && index.categoryIndex[`${category}/${subcategory}`]) {
    index.categoryIndex[`${category}/${subcategory}`].forEach(doc => {
      matches.push({
        document: doc,
        relevance: 0.9, // High relevance for exact subcategory match
      });
    });
  }
  
  // Get documents from same category
  if (index.categoryIndex[category]) {
    index.categoryIndex[category].forEach(doc => {
      // Skip if already matched by subcategory
      if (!matches.some(m => m.document.path === doc.path)) {
        matches.push({
          document: doc,
          relevance: 0.7, // Medium relevance for category match
        });
      }
    });
  }
  
  return matches;
}

/**
 * Find documents with similar titles/descriptions
 * @param {string} title - Title to match
 * @param {string} description - Description to match
 * @param {Object} index - Content index
 * @returns {Array} - Matching documents
 */
function findTextMatches(title, description, index) {
  const matches = [];
  const searchText = `${title} ${description}`.toLowerCase();
  
  index.documents.forEach((doc) => {
    const docText = `${doc.title} ${doc.description}`.toLowerCase();
    
    // Calculate string similarity
    const similarity = stringSimilarity.compareTwoStrings(searchText, docText);
    
    if (similarity > 0.3) { // Only include if reasonably similar
      matches.push({
        document: doc,
        relevance: similarity,
      });
    }
  });
  
  return matches;
}

/**
 * Find matches based on document type specific rules
 * @param {Object} documentData - Document data
 * @param {Object} index - Content index
 * @returns {Array} - Matching documents
 */
function findTypeSpecificMatches(documentData, index) {
  const matches = [];
  
  // Handle SOP specific relationships
  if (documentData.docType === 'sop') {
    // For SOPs, find related SOPs within same department
    const department = (documentData.subcategory || '').toLowerCase();
    
    index.documents.forEach(doc => {
      if (doc.docType === 'sop' && doc.subcategory && doc.subcategory.toLowerCase() === department) {
        matches.push({
          document: doc,
          relevance: 0.85,
          matchReason: 'Related departmental SOP'
        });
      }
    });
    
    // Find related compliance docs for any SOP
    index.documents.forEach(doc => {
      if (doc.category === 'hipaa' && doc.title.toLowerCase().includes('compliance')) {
        matches.push({
          document: doc,
          relevance: 0.5,
          matchReason: 'Related compliance document'
        });
      }
    });
  }
  
  // Handle HIPAA specific relationships
  if (documentData.docType === 'hipaa') {
    // Connect to related SOPs and other HIPAA docs
    const keywords = extractKeywords(documentData.title + ' ' + documentData.description);
    
    index.documents.forEach(doc => {
      if (doc.docType === 'sop' && containsAnyKeyword(doc.title + ' ' + doc.description, keywords)) {
        matches.push({
          document: doc,
          relevance: 0.75,
          matchReason: 'SOP related to this HIPAA requirement'
        });
      }
      
      if (doc.docType === 'hipaa' && doc.path !== documentData.path) {
        const docKeywords = extractKeywords(doc.title + ' ' + doc.description);
        const keywordOverlap = keywords.filter(k => docKeywords.includes(k)).length;
        
        if (keywordOverlap > 0) {
          matches.push({
            document: doc,
            relevance: 0.6 + (0.1 * keywordOverlap),
            matchReason: 'Related HIPAA document'
          });
        }
      }
    });
  }
  
  return matches;
}

/**
 * Extract keywords from text
 * @param {string} text - Text to extract keywords from
 * @returns {Array} - Extracted keywords
 */
function extractKeywords(text) {
  // Simple keyword extraction - remove stop words and tokenize
  const stopWords = ['and', 'or', 'the', 'a', 'an', 'in', 'for', 'of', 'to', 'with'];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
}

/**
 * Check if text contains any of the keywords
 * @param {string} text - Text to check
 * @param {Array} keywords - Keywords to check for
 * @returns {boolean} - Whether text contains any of the keywords
 */
function containsAnyKeyword(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

module.exports = {
  findRelatedContent
};
