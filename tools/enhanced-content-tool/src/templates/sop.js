/**
 * Template for Standard Operating Procedure (SOP) documents
 */
module.exports = function generateSOP(data) {
  // Format tags for frontmatter
  const formattedTags = data.tags
    .map(tag => `'${tag.trim()}'`)
    .join(', ');
  
  // Format responsibilities section
  const responsibilitiesSection = data.responsibilities && data.responsibilities.length > 0
    ? `## Responsibilities\n\n${data.responsibilities.map(r => `- **${r.role}**: ${r.responsibility}`).join('\n')}`
    : `## Responsibilities\n\n- **Document Owner**: Responsible for maintaining this document\n- **All Team Members**: Responsible for following this procedure`;
  
  // Format references section
  const referencesSection = data.references && data.references.length > 0
    ? `## References\n\n${data.references.map(ref => `- ${ref}`).join('\n')}`
    : `## References\n\n- No references at this time`;
  
  // Format definitions section
  const definitionsSection = data.definitions && data.definitions.length > 0
    ? `## Definitions\n\n${data.definitions.map(def => `- **${def.term}**: ${def.definition}`).join('\n')}`
    : `## Definitions\n\n- No specific terms defined for this procedure`;
  
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
sop_id: "${data.sopId}"
description: "${data.description}"
lastUpdated: "${data.lastUpdated}"
version: "${data.version || '1.0'}"
owner: "${data.department.charAt(0).toUpperCase() + data.department.slice(1)}/${data.author}"
tags: [${formattedTags}]
reviewCycle: "${data.reviewCycle || 'annual'}"
nextReviewDate: "${data.nextReviewDate || ''}"
approvedBy: "${data.approvedBy || ''}"
---

# ${data.title}

## Purpose

${data.purpose || 'This procedure establishes standardized processes for...'}

## Scope

${data.scope || 'This SOP applies to...'}

${responsibilitiesSection}

## Procedure

${data.procedure || 'Detailed procedure steps go here...'}

${referencesSection}

${definitionsSection}${relatedContentSection}

## Revision History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.0 | ${data.lastUpdated} | Initial version | ${data.author} |
`;
};
