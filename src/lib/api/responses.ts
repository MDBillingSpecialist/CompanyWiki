/**
 * API Response Utilities
 * 
 * Standardized response formatting for API endpoints.
 * 
 * #tags: api, utilities
 */
import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

// Cache control headers
export const CACHE_HEADERS = {
  // No caching - for dynamic content
  NO_CACHE: { 'Cache-Control': 'no-store, must-revalidate' },
  
  // Short-lived cache - for semi-dynamic content
  SHORT_CACHE: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' },
  
  // Medium cache - for content that changes daily
  MEDIUM_CACHE: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  
  // Long cache - for stable content
  LONG_CACHE: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' }
};

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, status: number = 200, cache: string = 'NO_CACHE'): NextResponse {
  const headers = {
    'Content-Type': 'application/json',
    ...getCacheHeaders(cache)
  };
  
  const response: ApiResponse<T> = {
    data,
    success: true
  };
  
  return NextResponse.json(response, { status, headers });
}

/**
 * Create an error API response
 */
export function apiError(
  code: string,
  message: string,
  status: number = 400,
  details?: unknown
): NextResponse {
  const response: ApiResponse = {
    error: {
      code,
      message,
      details
    },
    success: false
  };
  
  return NextResponse.json(response, { 
    status, 
    headers: { 'Content-Type': 'application/json' } 
  });
}

/**
 * Get cache headers based on the cache type
 */
function getCacheHeaders(cacheType: string): Record<string, string> {
  switch (cacheType) {
    case 'SHORT_CACHE':
      return CACHE_HEADERS.SHORT_CACHE;
    case 'MEDIUM_CACHE':
      return CACHE_HEADERS.MEDIUM_CACHE;
    case 'LONG_CACHE':
      return CACHE_HEADERS.LONG_CACHE;
    case 'NO_CACHE':
    default:
      return CACHE_HEADERS.NO_CACHE;
  }
}

/**
 * Handle common API errors and return an appropriate response
 */
export function handleApiError(error: unknown, defaultStatus: number = 500): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('not found')) {
      return apiError('RESOURCE_NOT_FOUND', error.message, 404);
    }
    
    if (error.message.includes('already exists')) {
      return apiError('RESOURCE_EXISTS', error.message, 409);
    }
    
    if (error.message.includes('invalid') || error.message.includes('Invalid')) {
      return apiError('INVALID_REQUEST', error.message, 400);
    }
    
    if (error.message.includes('permission') || error.message.includes('access')) {
      return apiError('PERMISSION_DENIED', error.message, 403);
    }
    
    return apiError('SERVER_ERROR', error.message, defaultStatus);
  }
  
  // Handle unknown errors
  return apiError(
    'UNKNOWN_ERROR', 
    'An unexpected error occurred', 
    500,
    { error }
  );
}
