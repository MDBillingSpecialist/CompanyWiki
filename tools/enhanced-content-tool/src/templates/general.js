/**
 * Template for general wiki pages
 */
module.exports = function generateGeneral(data) {
  // Format tags for frontmatter
  const formattedTags = data.tags
    .map(tag => `'${tag.trim()}'`)
    .join(', ');
  
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
title: "${data.title}"
description: "${data.description}"
lastUpdated: "${data.lastUpdated}"
tags: [${formattedTags}]
---

# ${data.title}

## Overview

${data.content || 'This document provides information about...'}${relatedContentSection}

## Document History

| Date | Description | Author |
|------|-------------|--------|
| ${data.lastUpdated} | Initial version | ${data.author} |
`;
};
