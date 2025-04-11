/**
 * Bidirectional link management for content relationships
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Update referenced documents to include a link back to the new document
 * @param {Object} newDocument - The newly created document
 * @param {Array} relatedContent - The selected related content
 */
async function updateReferencedDocuments(newDocument, relatedContent) {
  for (const related of relatedContent) {
    const filePath = related.document.filePath;
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    
    try {
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdown } = matter(content);
      
      // Check if "Related Content" section exists
      let newContent;
      const relatedSectionRegex = /## Related Content\s+([^#]*)/;
      const match = markdown.match(relatedSectionRegex);
      
      // Generate the new link
      const newLink = `- [${newDocument.title}](${newDocument.path}) - ${getReciprocalReason(related.matchReason)}`;
      
      if (match) {
        // Section exists, add the new link if not already present
        const relatedSection = match[0];
        
        if (!relatedSection.includes(newDocument.path)) {
          // Add link if it doesn't exist
          const updatedSection = relatedSection.replace(
            /## Related Content\s+/,
            `## Related Content\n\n${newLink}\n`
          );
          newContent = markdown.replace(relatedSectionRegex, updatedSection);
        } else {
          // Link already exists
          console.log(`Link to ${newDocument.path} already exists in ${filePath}`);
          continue;
        }
      } else {
        // No section exists, add it at the end before any h2 headings
        const newSection = `\n## Related Content\n\n${newLink}\n`;
        
        // Find the last content section before any potential h2
        const lastSectionIndex = markdown.lastIndexOf('##');
        
        if (lastSectionIndex > 0) {
          // Insert before the last section
          newContent = markdown.slice(0, lastSectionIndex) + newSection + markdown.slice(lastSectionIndex);
        } else {
          // Or append to the end
          newContent = markdown + newSection;
        }
      }
      
      // Write back to file with updated frontmatter
      const updatedContent = matter.stringify(newContent, data);
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`Updated related content in: ${filePath}`);
    } catch (error) {
      console.error(`Error updating related content in ${filePath}: ${error.message}`);
    }
  }
}

/**
 * Generate a reciprocal relationship description
 * @param {string} originalReason - Original relationship reason
 * @returns {string} - Reciprocal relationship reason
 */
function getReciprocalReason(originalReason) {
  const reciprocalMap = {
    'Tags in common': 'Related by common tags',
    'Same section': 'Related document in same section',
    'Similar content': 'Similar content',
    'Related departmental SOP': 'Related to this SOP',
    'SOP related to this HIPAA requirement': 'Implements this procedure',
    'Related compliance document': 'Provides compliance context',
    'Related HIPAA document': 'Related HIPAA requirement'
  };
  
  return reciprocalMap[originalReason] || 'Related document';
}

module.exports = {
  updateReferencedDocuments
};
