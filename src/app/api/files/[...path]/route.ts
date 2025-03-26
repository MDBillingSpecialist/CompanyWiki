/**
 * Files API - File Operations
 * 
 * Handles CRUD operations for individual files.
 * Supports GET, POST, PUT, and DELETE methods.
 * 
 * #tags: api, files, crud
 */
import { NextRequest } from 'next/server';
import { 
  getContentFile, 
  createContentFile, 
  updateContentFile, 
  deleteContentFile 
} from '@/lib/files/contentManager';
import { 
  validateContentPath, 
  sanitizePath,
  normalizePath
} from '@/lib/files/pathUtils';
import { 
  apiSuccess, 
  apiError, 
  handleApiError 
} from '@/lib/api/responses';
import { ContentCreateRequest, ContentUpdateRequest } from '@/types/api';

// Helper to get path from request
function getPathFromRequest(request: NextRequest): string {
  // Extract path from URL
  const pathParam = request.nextUrl.pathname.replace(/^\/api\/files\//, '');
  return decodeURIComponent(pathParam);
}

/**
 * GET - Retrieve file content
 */
export async function GET(request: NextRequest) {
  try {
    const path = getPathFromRequest(request);
    
    // Validate path
    const pathValidation = await validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Get file content
    const file = await getContentFile(path);
    if (!file) {
      return apiError(
        'FILE_NOT_FOUND',
        `No file found at path: ${path}`,
        404
      );
    }
    
    return apiSuccess(file, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST - Create a new file
 */
export async function POST(request: NextRequest) {
  try {
    const path = getPathFromRequest(request);
    
    // Validate path
    const pathValidation = await validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Parse request body
    const body: ContentCreateRequest = await request.json();
    
    if (!body.content) {
      return apiError(
        'MISSING_CONTENT',
        'File content is required',
        400
      );
    }
    
    // Create file with proper frontmatter
    const defaultTitle = path.split('/').pop() || 'Untitled';
    const file = await createContentFile({
      path,
      frontmatter: body.frontmatter ? 
        { title: body.frontmatter.title || defaultTitle, ...body.frontmatter } : 
        { title: defaultTitle },
      content: body.content,
      overwrite: body.overwrite || false
    });
    
    return apiSuccess(file, 201);
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error && error.message.includes('already exists')) {
      return apiError(
        'FILE_EXISTS',
        error.message,
        409 // Conflict
      );
    }
    
    return handleApiError(error);
  }
}

/**
 * PUT - Update an existing file
 */
export async function PUT(request: NextRequest) {
  try {
    const path = getPathFromRequest(request);
    
    // Validate path
    const pathValidation = await validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Parse request body
    const body: ContentUpdateRequest = await request.json();
    
    if (!body.content && !body.frontmatter) {
      return apiError(
        'MISSING_CONTENT',
        'Either content or frontmatter must be provided',
        400
      );
    }
    
    // Update file
    const file = await updateContentFile({
      path,
      frontmatter: body.frontmatter,
      content: body.content,
      createIfNotExists: body.createIfNotExists || false
    });
    
    return apiSuccess(file, 200);
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error && error.message.includes('not found')) {
      return apiError(
        'FILE_NOT_FOUND',
        error.message,
        404
      );
    }
    
    return handleApiError(error);
  }
}

/**
 * DELETE - Remove a file
 */
export async function DELETE(request: NextRequest) {
  try {
    const path = getPathFromRequest(request);
    
    // Validate path
    const pathValidation = await validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Delete file
    await deleteContentFile(path);
    
    return apiSuccess({ success: true, path }, 200);
  } catch (error) {
    // Handle specific errors
    if (error instanceof Error && error.message.includes('not found')) {
      return apiError(
        'FILE_NOT_FOUND',
        error.message,
        404
      );
    }
    
    return handleApiError(error);
  }
}
