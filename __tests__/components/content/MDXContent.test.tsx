/**
 * MDX Content Component Tests
 * 
 * Tests for the MDXContent component that renders MDX content with frontmatter.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MDXContent } from '@/components/content/MDXContent';
import { MDXContent as MDXContentType, Frontmatter } from '@/lib/content/mdx';

// Mock the content type
jest.mock('@/lib/content/mdx', () => ({
  // Just need to mock the type, not the actual implementation
}));

// Silence console.error during tests
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Generic test content creator to ensure type safety
const createMockContent = (frontmatter: Partial<Frontmatter>): MDXContentType => ({
  frontmatter: {
    title: 'Default Title',
    ...frontmatter
  },
  content: <div>Test content</div>,
  rawContent: 'Test content',
  slug: 'test-slug',
});

describe('MDXContent Component', () => {
  it('renders the title and description from frontmatter', () => {
    // Setup mock data using our helper
    const mockContent = createMockContent({
      title: 'Test Title',
      description: 'Test Description',
    });
    
    render(<MDXContent content={mockContent} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles null content by showing error message', () => {
    render(<MDXContent content={null} />);
    
    expect(screen.getByText('Content Error')).toBeInTheDocument();
    expect(screen.getByText(/The content could not be loaded properly/)).toBeInTheDocument();
  });

  it('handles content without MDX by showing error message', () => {
    const mockContentWithoutMDX = createMockContent({ title: 'Test Title' });
    // Override the content to be null
    mockContentWithoutMDX.content = null;
    
    render(<MDXContent content={mockContentWithoutMDX} />);
    
    expect(screen.getByText('Content Error')).toBeInTheDocument();
    expect(screen.getByText(/The content could not be loaded properly/)).toBeInTheDocument();
  });

  it('safely renders tags as an array', () => {
    const mockContentWithTags = createMockContent({
      title: 'Test Title',
      tags: ['tag1', 'tag2', 'tag3'],
    });
    
    render(<MDXContent content={mockContentWithTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('safely renders tags as a comma-separated string', () => {
    // Using type assertion to test how the component handles string tags
    // This is intentional for testing purposes, even though the type is defined as string[]
    const mockContentWithStringTags = createMockContent({
      title: 'Test Title',
    });
    
    // Use type assertion to bypass type checking for this test case
    (mockContentWithStringTags.frontmatter as any).tags = 'tag1, tag2, tag3';
    
    render(<MDXContent content={mockContentWithStringTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('tag3')).toBeInTheDocument();
  });

  it('handles Date objects in lastUpdated field', () => {
    // Using type assertion to test how the component handles Date objects
    // This is intentional for testing purposes, even though the type is defined as string
    const mockContentWithDate = createMockContent({
      title: 'Test Title',
    });
    
    // Use type assertion to bypass type checking for this test case
    (mockContentWithDate.frontmatter as any).lastUpdated = new Date('2025-03-26');
    
    render(<MDXContent content={mockContentWithDate} />);
    
    // Should convert date to YYYY-MM-DD format
    // Use more specific selector to avoid multiple matches
    expect(screen.getByText('Last updated: 2025-03-26')).toBeInTheDocument();
  });

  it('renders category if present', () => {
    const mockContentWithCategory = createMockContent({
      title: 'Test Title',
      category: 'Test Category',
    });
    
    render(<MDXContent content={mockContentWithCategory} />);
    
    expect(screen.getByText(/Category: Test Category/)).toBeInTheDocument();
  });
});
