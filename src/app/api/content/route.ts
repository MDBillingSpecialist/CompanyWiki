/**
 * Content API Route (Enhanced)
 * 
 * Provides a REST API for retrieving content files with MDX transformation.
 * Used by client components that need to fetch content dynamically.
 * 
 * #tags: api, content, mdx
 */
import { NextRequest } from 'next/server';
import { getContentFile, listContentFiles } from '@/lib/files/contentManager';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import { searchContent } from '@/lib/search';

/**
 * GET handler for retrieving content by path
 */
export async function GET(request: NextRequest) {
  try {
    // Get the content path from query params
    const contentPath = request.nextUrl.searchParams.get('path');
    const section = request.nextUrl.searchParams.get('section');
    const listAll = request.nextUrl.searchParams.get('list');
    const query = request.nextUrl.searchParams.get('q');
    const tag = request.nextUrl.searchParams.get('tag');
    
    // Handle search mode if query or tag parameters are provided
    if (query || tag) {
      const searchParams = { q: query || '', section: section || '', tag: tag || '' };
      const results = await searchContent(searchParams);
      
      return apiSuccess({
        items: results,
        count: results.length,
        query: searchParams
      }, 200, 'SHORT_CACHE');
    }
    
    // Handle list mode
    if (listAll === 'true') {
      // Return a list of all content metadata
      const allContent = await listContentFiles('', true);
      return apiSuccess({
        items: allContent.map(item => ({
          frontmatter: item.frontmatter,
          path: item.path,
          slug: item.slug
        }))
      }, 200, 'SHORT_CACHE');
    }
    
    // Handle section mode
    if (section) {
      // Return all content in a specific section
      const sectionContent = await listContentFiles(section, false);
      return apiSuccess({
        items: sectionContent.map(item => ({
          frontmatter: item.frontmatter,
          path: item.path,
          slug: item.slug
        }))
      }, 200, 'SHORT_CACHE');
    }
    
    // Require a path parameter if not in list or section mode
    if (!contentPath) {
      return apiError(
        'MISSING_PARAMETER',
        'Please provide one of: path, section, list=true, or q/tag for search',
        400
      );
    }
    
    // Get the slug from the path (remove extension)
    const slug = contentPath.replace(/\.(md|mdx)$/, '');
    
    // Get content by slug
    const content = await getContentFile(slug);
    
    if (!content) {
      // Try with index.md in the directory
      const indexContent = await getContentFile(`${slug}/index`);
      
      if (indexContent) {
        return apiSuccess({
          frontmatter: indexContent.frontmatter,
          content: indexContent.content,
          path: `${slug}/index`,
          slug: slug,
        }, 200, 'SHORT_CACHE');
      }
      
      return apiError(
        'CONTENT_NOT_FOUND',
        `No content found for path: ${contentPath}`,
        404
      );
    }
    
    // Return the content data
    return apiSuccess({
      frontmatter: content.frontmatter,
      content: content.content,
      path: contentPath,
      slug: slug,
    }, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}
