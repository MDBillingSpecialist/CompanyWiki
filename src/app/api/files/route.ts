/**
 * Files API - List Files
 * 
 * Lists files and directories in the content directory.
 * Supports recursive listing and filtering by path.
 * 
 * #tags: api, files, list
 */
import { NextRequest } from 'next/server';
import { listDirectory } from '@/lib/files/fileSystem';
import { 
  validateContentPath, 
  resolveContentPath 
} from '@/lib/files/pathUtils';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';

/**
 * GET handler for listing files and directories
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const path = request.nextUrl.searchParams.get('path') || '';
    const recursive = request.nextUrl.searchParams.get('recursive') === 'true';
    
    // Validate path
    const pathValidation = validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Resolve and list directory
    const resolvedPath = resolveContentPath(path);
    const contents = await listDirectory(resolvedPath, recursive);
    
    return apiSuccess(contents, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}
