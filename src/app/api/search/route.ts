/**
 * Enhanced Search API
 * 
 * Provides search functionality across content files with advanced features.
 * Supports searching by title, content, and tags with pagination.
 * 
 * #tags: api, search, content, pagination
 */
import { NextRequest } from 'next/server';
import { searchContent } from '@/lib/search';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import { PaginatedResponse, SearchParams } from '@/types/api';

// Default pagination values
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * GET - Search content with pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Get search parameters
    const query = request.nextUrl.searchParams.get('q') || '';
    const section = request.nextUrl.searchParams.get('section') || '';
    const tag = request.nextUrl.searchParams.get('tag') || '';
    
    // Parse pagination parameters
    const page = request.nextUrl.searchParams.has('page')
      ? Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10))
      : DEFAULT_PAGE;
      
    const limit = request.nextUrl.searchParams.has('limit')
      ? Math.min(MAX_LIMIT, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '20', 10)))
      : DEFAULT_LIMIT;
    
    if (!query && !tag) {
      return apiError(
        'MISSING_PARAMETERS',
        'Search query or tag is required',
        400
      );
    }
    
    // Create search params
    const searchParams: SearchParams = {
      q: query,
      section,
      tag,
      page,
      limit
    };
    
    // Search content
    const results = await searchContent(searchParams);
    const total = results.length; // Ideally this should be calculated by the search function
    
    // Apply pagination
    const paginatedResults = paginateResults(results, page, limit);
    
    // Format response with pagination metadata
    const response: PaginatedResponse<any> = {
      items: paginatedResults,
      total,
      page,
      limit,
      hasMore: page * limit < total
    };
    
    return apiSuccess(response, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Paginate search results
 */
function paginateResults<T>(results: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return results.slice(startIndex, startIndex + limit);
}
