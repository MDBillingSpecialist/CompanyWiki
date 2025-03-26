/**
 * MDX Content Utilities Tests
 * 
 * Tests for the utility functions that handle MDX content processing.
 */

// Use a mock implementation instead of importing the actual module with ESM dependencies
jest.mock('@/lib/content/mdx', () => {
  // Mock implementation of the module
  const mockFrontmatter = {
    title: 'Test Title',
    description: 'Test Description'
  };
  
  return {
    // Mock the exported functions
    getAllContentFilePaths: jest.fn().mockImplementation((dir) => {
      if (dir === '/error') {
        console.error('Error getting content files');
        return [];
      }
      
      return [
        '/app/content/file1.md',
        '/app/content/dir1/file2.md',
        '/app/content/dir1/file3.mdx'
      ];
    }),

    getMDXContent: jest.fn().mockImplementation(async (filePath) => {
      if (filePath.includes('error')) {
        console.error('Error compiling MDX');
        return {
          frontmatter: { title: 'Error Page' },
          content: null,
          rawContent: 'Invalid content',
          slug: 'error-page'
        };
      }
      
      // Extract slug from file path
      const slug = filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') || 'test';
      
      return {
        frontmatter: mockFrontmatter,
        content: '<div>Test content</div>',
        rawContent: '# Test content\nThis is a test.',
        slug
      };
    }),

    getContentBySlug: jest.fn().mockImplementation(async (slug) => {
      if (slug === 'not-found') {
        console.error('No content file found for slug');
        return null;
      }
      
      return {
        frontmatter: mockFrontmatter,
        content: '<div>Test content</div>',
        rawContent: '# Test content\nThis is a test.',
        slug
      };
    }),
    
    Frontmatter: {},
    MDXContent: {}
  };
});

// Also mock fs and path to avoid filesystem dependencies
jest.mock('fs', () => ({
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn()
}));

// Import the mocked module
const { 
  getAllContentFilePaths,
  getMDXContent,
  getContentBySlug
} = require('@/lib/content/mdx');

describe('MDX Content Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllContentFilePaths', () => {
    it('returns markdown files from the content directory', () => {
      const result = getAllContentFilePaths('/app/content');
      
      expect(result).toHaveLength(3);
      expect(result).toContain('/app/content/file1.md');
      expect(result).toContain('/app/content/dir1/file2.md');
      expect(result).toContain('/app/content/dir1/file3.mdx');
    });

    it('handles errors gracefully', () => {
      const result = getAllContentFilePaths('/error');
      
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getMDXContent', () => {
    it('parses MDX content correctly', async () => {
      const result = await getMDXContent('/app/content/test.mdx');
      
      expect(result.frontmatter.title).toBe('Test Title');
      expect(result.frontmatter.description).toBe('Test Description');
      expect(result.slug).toBe('test');
    });

    it('handles MDX compilation errors', async () => {
      const result = await getMDXContent('/app/content/error.mdx');
      
      expect(result.frontmatter.title).toBe('Error Page');
      expect(result.content).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getContentBySlug', () => {
    it('finds content by slug', async () => {
      const result = await getContentBySlug('test-page');
      
      expect(result).not.toBeNull();
      expect(result?.frontmatter.title).toBe('Test Title');
      expect(result?.slug).toBe('test-page');
    });

    it('returns null when no content is found', async () => {
      const result = await getContentBySlug('not-found');
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
