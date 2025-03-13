/**
 * Content API Route
 * 
 * Provides a REST API for retrieving content files with MDX transformation.
 * Used by client components that need to fetch content dynamically.
 * 
 * #tags: api, content, mdx
 */
import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug, getAllContentMeta, getContentBySection } from '@/utils/mdx';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// Configure caching for content responses
const CACHE_CONTROL_HEADER = 'public, max-age=60, stale-while-revalidate=300';

/**
 * GET handler for retrieving content by path
 */
export async function GET(request: NextRequest) {
  try {
    // Get the content path from query params
    const contentPath = request.nextUrl.searchParams.get('path');
    const section = request.nextUrl.searchParams.get('section');
    const listAll = request.nextUrl.searchParams.get('list');
    
    // Handle different API modes
    if (listAll === 'true') {
      // Return a list of all content metadata
      const allContent = await getAllContentMeta();
      return new NextResponse(
        JSON.stringify({ items: allContent }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': CACHE_CONTROL_HEADER
          } 
        }
      );
    }
    
    if (section) {
      // Return all content in a specific section
      const sectionContent = await getContentBySection(section);
      return new NextResponse(
        JSON.stringify({ items: sectionContent }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': CACHE_CONTROL_HEADER 
          } 
        }
      );
    }
    
    if (!contentPath) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing parameter', 
          message: 'Please provide one of: path, section, or list=true' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Get the slug from the path (remove extension)
    const slug = contentPath.replace(/\.(md|mdx)$/, '');
    
    // Use the existing utility to get content
    const content = await getContentBySlug(slug);
    
    if (!content) {
      // Try with index.md in the directory
      const indexContent = await getContentBySlug(`${slug}/index`);
      
      if (indexContent) {
        return new NextResponse(
          JSON.stringify({
            frontmatter: indexContent.frontmatter,
            content: indexContent.rawContent,
            path: `${slug}/index`,
            slug: slug,
          }),
          { 
            status: 200, 
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL_HEADER
            } 
          }
        );
      }
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Content not found',
          message: `No content found for path: ${contentPath}`
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Return the data with proper caching headers
    return new NextResponse(
      JSON.stringify({
        frontmatter: content.frontmatter,
        content: content.rawContent,
        path: contentPath,
        slug: slug,
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': CACHE_CONTROL_HEADER
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching content:', error);
    
    // Determine if the error is a known type for a better error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to fetch content',
        message: errorMessage
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
