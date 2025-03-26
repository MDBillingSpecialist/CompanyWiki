/**
 * Search Utilities
 * 
 * Provides search functionality across content files.
 * 
 * #tags: search, content
 */
import { ContentFile, ContentMeta } from '@/types/content';
import { SearchParams, SearchResult } from '@/types/api';
import { getContentFile, listContentFiles } from '@/lib/files/contentManager';
import { normalizePath } from '@/lib/files/pathUtils';

/**
 * Search content files based on query parameters
 */
export async function searchContent(params: SearchParams): Promise<SearchResult[]> {
  try {
    const { q, tag, section } = params;
    
    if (!q && !tag) {
      return [];
    }
    
    // Get all content metadata from the specified section (or all sections)
    const allContent = await listContentFiles(section || '', true);
    
    // Filter by tag if provided
    let filteredContent = allContent;
    if (tag) {
      filteredContent = allContent.filter(item => 
        item.frontmatter.tags && 
        (Array.isArray(item.frontmatter.tags) 
          ? item.frontmatter.tags.includes(tag)
          : String(item.frontmatter.tags).split(',').map(t => t.trim()).includes(tag))
      );
    }
    
    // Search by query if provided
    if (q) {
      const lowerQuery = q.toLowerCase();
      
      // Map content files to search results with score
      const results: SearchResult[] = [];
      
      for (const item of filteredContent) {
        let score = 0;
        const matches: { field: string; text: string }[] = [];
        
        // Search in title (highest weight)
        if (item.frontmatter.title && item.frontmatter.title.toLowerCase().includes(lowerQuery)) {
          score += 10;
          matches.push({ 
            field: 'title', 
            text: highlightMatch(item.frontmatter.title, lowerQuery)
          });
        }
        
        // Search in description
        if (item.frontmatter.description && item.frontmatter.description.toLowerCase().includes(lowerQuery)) {
          score += 5;
          matches.push({ 
            field: 'description', 
            text: highlightMatch(item.frontmatter.description, lowerQuery)
          });
        }
        
        // Search in content
        if (item.content && item.content.toLowerCase().includes(lowerQuery)) {
          score += 3;
          
          // Extract context around the match
          const context = extractContext(item.content, lowerQuery);
          matches.push({ field: 'content', text: context });
        }
        
        // Search in tags
        if (item.frontmatter.tags) {
          const tags = Array.isArray(item.frontmatter.tags) 
            ? item.frontmatter.tags 
            : String(item.frontmatter.tags).split(',').map(t => t.trim());
            
          if (tags.some(t => t.toLowerCase().includes(lowerQuery))) {
            score += 4;
            matches.push({ 
              field: 'tags', 
              text: `Tags: ${tags.join(', ')}`
            });
          }
        }
        
        // If matches found, add to results
        if (score > 0) {
          results.push({
            slug: item.slug,
            path: item.path,
            title: item.frontmatter.title,
            description: item.frontmatter.description,
            excerpt: extractExcerpt(item.content),
            matches,
            score,
            tags: Array.isArray(item.frontmatter.tags) 
              ? item.frontmatter.tags 
              : item.frontmatter.tags 
                ? String(item.frontmatter.tags).split(',').map(t => t.trim())
                : undefined
          });
        }
      }
      
      // Sort by score (highest first)
      return results.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    
    // If only filtered by tag, convert content items to search results
    return filteredContent.map(item => ({
      slug: item.slug,
      path: item.path,
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      excerpt: extractExcerpt(item.content),
      tags: Array.isArray(item.frontmatter.tags) 
        ? item.frontmatter.tags 
        : item.frontmatter.tags 
          ? String(item.frontmatter.tags).split(',').map(t => t.trim())
          : undefined
    }));
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}

/**
 * Extract a short excerpt from content
 */
function extractExcerpt(content: string, maxLength: number = 150): string {
  if (!content) return '';
  
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/^---\s*[\s\S]*?---\s*/m, '');
  
  // Remove markdown formatting
  const plainText = contentWithoutFrontmatter
    .replace(/#+\s+/g, '') // Remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .trim();
  
  // Get first non-empty paragraph
  const firstParagraph = plainText
    .split('\n\n')
    .filter(p => p.trim().length > 0)[0] || '';
  
  // Truncate if too long
  if (firstParagraph.length > maxLength) {
    return firstParagraph.substring(0, maxLength) + '...';
  }
  
  return firstParagraph;
}

/**
 * Extract context around a match in content
 */
function extractContext(content: string, query: string, contextLength: number = 200): string {
  const lowerContent = content.toLowerCase();
  const matchIndex = lowerContent.indexOf(query);
  
  if (matchIndex === -1) {
    return extractExcerpt(content, contextLength);
  }
  
  // Calculate start and end indices for context
  let start = Math.max(0, matchIndex - contextLength / 2);
  let end = Math.min(content.length, matchIndex + query.length + contextLength / 2);
  
  // Adjust to avoid cutting words
  while (start > 0 && content[start - 1] !== ' ' && content[start - 1] !== '\n') {
    start--;
  }
  
  while (end < content.length && content[end] !== ' ' && content[end] !== '\n') {
    end++;
  }
  
  // Extract context
  let context = content.substring(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) {
    context = '...' + context;
  }
  
  if (end < content.length) {
    context = context + '...';
  }
  
  // Highlight the match
  const matchStart = matchIndex - start + (start > 0 ? 3 : 0); // Adjust for ellipsis
  const matchEnd = matchStart + query.length;
  const highlighted = context.substring(0, matchStart) + 
                     '**' + context.substring(matchStart, matchEnd) + '**' + 
                     context.substring(matchEnd);
  
  return highlighted;
}

/**
 * Highlight matches in text
 */
function highlightMatch(text: string, query: string): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);
  
  if (matchIndex === -1) {
    return text;
  }
  
  return text.substring(0, matchIndex) + 
         '**' + text.substring(matchIndex, matchIndex + query.length) + '**' + 
         text.substring(matchIndex + query.length);
}
