/**
 * Content API Route (Enhanced)
 * 
 * Provides a REST API for retrieving content files with MDX transformation.
 * Used by client components that need to fetch content dynamically.
 * Supports advanced filtering, pagination, and sorting.
 * 
 * #tags: api, content, mdx
 */
import { NextRequest } from 'next/server';
import { getContentFile, listContentFiles } from '@/lib/files/contentManager';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import { searchContent } from '@/lib/search';
import { ContentQueryParams, PaginatedResponse, SearchParams } from '@/types/api';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * GET handler for retrieving content by path
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const queryParams = parseQueryParams(request);
    const { path, section, list, q, tag, page, limit, sortBy, sortOrder, tags, after } = queryParams;
    
    // Handle search mode if query or tag parameters are provided
    if (q || tag) {
      const searchParams: SearchParams = { 
        q: q || '', 
        section: section || '', 
        tag: tag || '',
        page: page || DEFAULT_PAGE,
        limit: limit || DEFAULT_LIMIT
      };
      
      const results = await searchContent(searchParams);
      const total = results.length; // This would ideally come from search function
      const pageResults = paginateResults(results, page || DEFAULT_PAGE, limit || DEFAULT_LIMIT);
      
      return apiSuccess({
        items: pageResults,
        total,
        page: page || DEFAULT_PAGE,
        limit: limit || DEFAULT_LIMIT,
        hasMore: (page || DEFAULT_PAGE) * (limit || DEFAULT_LIMIT) < total
      }, 200, 'SHORT_CACHE');
    }
    
    // Handle list mode
    if (list) {
      // Return a list of all content metadata with pagination and sorting
      const allContent = await listContentFiles('', true);
      
      // Apply filtering by tags if provided
      let filtered = allContent;
      if (tags && tags.length > 0) {
        filtered = allContent.filter(item => {
          const itemTags = item.frontmatter?.tags || [];
          return tags.some(tag => itemTags.includes(tag));
        });
      }
      
      // Apply sorting
      const sorted = sortContent(filtered, sortBy, sortOrder);
      
      // Apply pagination
      const total = sorted.length;
      let results;
      
      if (after) {
        // Cursor-based pagination
        results = applyCursorPagination(sorted, after, limit || DEFAULT_LIMIT);
      } else {
        // Page-based pagination
        results = applyPagePagination(sorted, page || DEFAULT_PAGE, limit || DEFAULT_LIMIT);
      }
      
      // Calculate next cursor
      const nextCursor = results.length > 0 && results.length === (limit || DEFAULT_LIMIT) 
        ? encodeURIComponent(results[results.length - 1].path)
        : undefined;
      
      // Format response
      const response: PaginatedResponse<any> = {
        items: results.map(item => ({
          frontmatter: item.frontmatter,
          path: item.path,
          slug: item.slug,
          lastModified: item.lastModified
        })),
        total,
        page: after ? undefined : page || DEFAULT_PAGE,
        limit: limit || DEFAULT_LIMIT,
        hasMore: nextCursor !== undefined,
        nextCursor
      };
      
      return apiSuccess(response, 200, 'SHORT_CACHE');
    }
    
    // Handle section mode
    if (section) {
      // Return all content in a specific section
      const sectionContent = await listContentFiles(section, false);
      
      // Apply filtering by tags if provided
      let filtered = sectionContent;
      if (tags && tags.length > 0) {
        filtered = sectionContent.filter(item => {
          const itemTags = item.frontmatter?.tags || [];
          return tags.some(tag => itemTags.includes(tag));
        });
      }
      
      // Apply sorting
      const sorted = sortContent(filtered, sortBy, sortOrder);
      
      // Apply pagination
      const total = sorted.length;
      let results;
      
      if (after) {
        // Cursor-based pagination
        results = applyCursorPagination(sorted, after, limit || DEFAULT_LIMIT);
      } else {
        // Page-based pagination
        results = applyPagePagination(sorted, page || DEFAULT_PAGE, limit || DEFAULT_LIMIT);
      }
      
      // Calculate next cursor
      const nextCursor = results.length > 0 && results.length === (limit || DEFAULT_LIMIT) 
        ? encodeURIComponent(results[results.length - 1].path)
        : undefined;
      
      // Format response
      const response: PaginatedResponse<any> = {
        items: results.map(item => ({
          frontmatter: item.frontmatter,
          path: item.path,
          slug: item.slug,
          lastModified: item.lastModified
        })),
        total,
        page: after ? undefined : page || DEFAULT_PAGE,
        limit: limit || DEFAULT_LIMIT,
        hasMore: nextCursor !== undefined,
        nextCursor
      };
      
      return apiSuccess(response, 200, 'SHORT_CACHE');
    }
    
    // Require a path parameter if not in list or section mode
    if (!path) {
      return apiError(
        'MISSING_PARAMETER',
        'Please provide one of: path, section, list=true, or q/tag for search',
        400
      );
    }
    
    // Get the slug from the path (remove extension)
    const slug = path.replace(/\.(md|mdx)$/, '');
    
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
          lastModified: indexContent.lastModified
        }, 200, 'SHORT_CACHE');
      }
      
      return apiError(
        'CONTENT_NOT_FOUND',
        `No content found for path: ${path}`,
        404
      );
    }
    
    // Return the content data
    return apiSuccess({
      frontmatter: content.frontmatter,
      content: content.content,
      path: path,
      slug: slug,
      lastModified: content.lastModified
    }, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Parse query parameters from the request and convert them to the appropriate types
 */
function parseQueryParams(request: NextRequest): ContentQueryParams {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse basic string parameters
  const path = searchParams.get('path') || undefined;
  const section = searchParams.get('section') || undefined;
  const q = searchParams.get('q') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const sortBy = searchParams.get('sortBy') || undefined;
  const after = searchParams.get('after') || undefined;
  
  // Parse boolean parameters
  const list = searchParams.get('list') === 'true';
  
  // Parse numeric parameters
  const page = searchParams.has('page') 
    ? Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    : undefined;
    
  const limit = searchParams.has('limit')
    ? Math.min(MAX_LIMIT, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    : undefined;
  
  // Parse enum parameters
  const sortOrder = (searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';
  
  // Parse array parameters
  const tags = searchParams.getAll('tags');
  
  return {
    path,
    section,
    list,
    q,
    tag,
    page,
    limit,
    sortBy,
    sortOrder,
    tags: tags.length > 0 ? tags : undefined,
    after
  };
}

/**
 * Sort content by the specified field and order
 */
function sortContent(content: any[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'asc'): any[] {
  if (!sortBy) return content;
  
  return [...content].sort((a, b) => {
    let valueA: any;
    let valueB: any;
    
    // Handle nested properties in frontmatter
    if (sortBy.startsWith('frontmatter.')) {
      const frontmatterField = sortBy.substring('frontmatter.'.length);
      valueA = a.frontmatter?.[frontmatterField];
      valueB = b.frontmatter?.[frontmatterField];
    } else {
      // Direct properties
      valueA = a[sortBy];
      valueB = b[sortBy];
    }
    
    // Handle different types
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Default comparison
    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Apply page-based pagination
 */
function applyPagePagination<T>(items: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return items.slice(startIndex, startIndex + limit);
}

/**
 * Apply cursor-based pagination
 */
function applyCursorPagination<T extends { path: string }>(items: T[], cursor: string, limit: number): T[] {
  const decodedCursor = decodeURIComponent(cursor);
  const cursorIndex = items.findIndex(item => item.path === decodedCursor);
  
  if (cursorIndex === -1) {
    // Cursor not found, return first page
    return items.slice(0, limit);
  }
  
  // Return items after the cursor
  return items.slice(cursorIndex + 1, cursorIndex + 1 + limit);
}

/**
 * Paginate search results (simple implementation)
 */
function paginateResults<T>(results: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return results.slice(startIndex, startIndex + limit);
}
