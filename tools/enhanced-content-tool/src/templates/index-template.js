/**
 * Template for index pages
 */
module.exports = function generateIndex(data) {
  // Format tags for frontmatter
  const formattedTags = data.tags
    .map(tag => `'${tag.trim()}'`)
    .join(', ');
  
  // Generate document table
  let documentsTable = '';
  if (data.documents && data.documents.length > 0) {
    documentsTable = `
## Available Documents

| Document | Description | Last Updated |
|----------|-------------|--------------|
${data.documents.map(doc => 
  `| [${doc.title}](${doc.path}) | ${doc.description} | ${doc.lastUpdated} |`
).join('\n')}
`;
  }
  
  // Add Related Content section if available
  let relatedContentSection = '';
  if (data.relatedContent && data.relatedContent.length > 0) {
    relatedContentSection = `
## Related Content

${data.relatedContent.map(related => 
  `- [${related.document.title}](${related.document.path}) - ${related.matchReason}`
).join('\n')}
`;
  }
  
  // Generate the complete document
  return `---
title: ${data.title}
description: ${data.description}
lastUpdated: ${data.lastUpdated}
tags: [${formattedTags}]
category: '${data.category}'
---

# ${data.title}

## Overview

${data.introduction || 'This section contains documentation about...'}
${documentsTable}${relatedContentSection}
`;
};
