/**
 * Search API
 * 
 * Provides search functionality across content files.
 * Supports searching by title, content, and tags.
 * 
 * #tags: api, search, content
 */
import { NextRequest } from 'next/server';
import { searchContent } from '@/lib/search';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import { SearchParams } from '@/types/api';

/**
 * GET - Search content
 */
export async function GET(request: NextRequest) {
  try {
    // Get search parameters
    const query = request.nextUrl.searchParams.get('q') || '';
    const section = request.nextUrl.searchParams.get('section') || '';
    const tag = request.nextUrl.searchParams.get('tag') || '';
    
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
      tag
    };
    
    // Search content
    const results = await searchContent(searchParams);
    
    return apiSuccess({
      results,
      total: results.length,
      query: searchParams
    }, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}
