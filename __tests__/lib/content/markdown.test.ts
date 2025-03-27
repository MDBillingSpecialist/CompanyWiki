/**
 * Markdown Utility Tests
 */
import { 
  markdownToHtml, 
  extractTitleFromMarkdown,
  extractFrontmatter
} from '@/lib/content/markdown';

// Mock the marked library
jest.mock('marked', () => {
  const markedMock = {
    parse: jest.fn().mockImplementation(markdown => {
      // Very simple mock implementation
      if (markdown.includes('## Header')) {
        return '<h2>Header</h2>';
      }
      if (markdown.includes('error_trigger')) {
        throw new Error('Mock parsing error');
      }
      return '<p>Converted content</p>';
    }),
    setOptions: jest.fn()
  };
  return { marked: markedMock };
});

describe('Markdown Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('markdownToHtml', () => {
    it('converts markdown to HTML correctly', () => {
      const markdown = '## Header\nSome content';
      const result = markdownToHtml(markdown);
      
      expect(result).toBe('<h2>Header</h2>');
    });

    it('handles parsing errors gracefully', () => {
      const markdown = 'Some content with error_trigger';
      const result = markdownToHtml(markdown);
      
      // Should return error HTML that contains the original markdown
      expect(result).toContain('Error parsing markdown content');
      expect(result).toContain(markdown);
    });
  });

  describe('extractTitleFromMarkdown', () => {
    it('extracts title from a markdown header', () => {
      const markdown = '# My Document Title\n\nSome content';
      const result = extractTitleFromMarkdown(markdown);
      
      expect(result).toBe('My Document Title');
    });

    it('returns default title when no header is found', () => {
      const markdown = 'Some content without a header';
      const result = extractTitleFromMarkdown(markdown);
      
      expect(result).toBe('Untitled Document');
    });

    it('ignores lower level headers when extracting title', () => {
      const markdown = '## Secondary Header\n# Main Title\nContent';
      const result = extractTitleFromMarkdown(markdown);
      
      expect(result).toBe('Main Title');
    });
  });

  describe('extractFrontmatter', () => {
    it('extracts frontmatter and content correctly', () => {
      const markdown = `---
title: Test Document
author: Test Author
---

Content here`;

      const result = extractFrontmatter(markdown);
      
      expect(result.frontmatter).toEqual({
        title: 'Test Document',
        author: 'Test Author'
      });
      expect(result.content).toBe('Content here');
    });

    it('returns empty frontmatter when none is present', () => {
      const markdown = 'Just content without frontmatter';
      const result = extractFrontmatter(markdown);
      
      expect(result.frontmatter).toEqual({});
      expect(result.content).toBe(markdown);
    });

    it('handles array values in frontmatter', () => {
      const markdown = `---
title: Test Document
tags: [tag1, tag2, tag3]
---

Content here`;

      const result = extractFrontmatter(markdown);
      
      expect(result.frontmatter).toEqual({
        title: 'Test Document',
        tags: ['tag1', 'tag2', 'tag3']
      });
    });

    it('handles malformed frontmatter gracefully', () => {
      const markdown = `---
title: Test Document
tags: unclosed value
---

Content here`;

      const result = extractFrontmatter(markdown);
      
      // Should extract values as strings
      expect(result.frontmatter.title).toBe('Test Document');
      expect(result.frontmatter.tags).toBe('unclosed value');
    });
  });
});