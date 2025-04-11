/**
 * Template for HIPAA documentation
 */
module.exports = function generateHIPAA(data) {
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
category: "${data.category}"
regulationReference: "${data.regulationReference || ''}"
applicability: "${data.applicability || 'All staff handling PHI'}"
tags: [${formattedTags}]
---

# ${data.title}

## Overview

${data.overview || 'This document provides guidance on HIPAA compliance requirements...'}

## Regulatory Requirements

${data.requirements || 'The following regulatory requirements apply...'}

## Implementation Guidelines

${data.implementation || 'To implement these requirements, follow these guidelines...'}

## Monitoring and Compliance

${data.monitoring || 'Monitoring procedures to ensure ongoing compliance include...'}${relatedContentSection}

## Document History

| Date | Description | Author |
|------|-------------|--------|
| ${data.lastUpdated} | Initial version | ${data.author} |
`;
};
