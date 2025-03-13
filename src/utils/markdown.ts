/**
 * Simple Markdown Processor
 * 
 * A lightweight utility for processing Markdown without
 * the complexity of MDX and React Server Components.
 * 
 * #tags: markdown, utility
 */
import { marked } from 'marked';

// Configure marked for secure rendering
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert \n to <br>
  headerIds: true, // Generate IDs for headings
  mangle: false, // Don't escape HTML
  sanitize: false, // Don't sanitize HTML
});

/**
 * Convert markdown to HTML
 */
export function markdownToHtml(markdown: string): string {
  try {
    return marked.parse(markdown);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return `<div class="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
      <p class="text-red-700 dark:text-red-300">Error parsing markdown content.</p>
    </div>
    <pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4 overflow-auto">${markdown}</pre>`;
  }
}

/**
 * Extract title from markdown content
 */
export function extractTitleFromMarkdown(markdown: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1] : 'Untitled Document';
}

/**
 * Simple frontmatter extraction
 */
export function extractFrontmatter(markdown: string): { 
  frontmatter: Record<string, any>; 
  content: string 
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = markdown.match(frontmatterRegex);
  
  if (!match) {
    return { 
      frontmatter: {}, 
      content: markdown 
    };
  }
  
  const frontmatterStr = match[1];
  const content = markdown.replace(frontmatterRegex, '');
  
  // Parse YAML-like frontmatter
  const frontmatter: Record<string, any> = {};
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Handle lists in frontmatter
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = value.slice(1, -1).split(',').map(item => item.trim());
        } catch (e) {
          // If parsing fails, keep as string
          console.error('Error parsing frontmatter array:', e);
        }
      }
      
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, content };
}