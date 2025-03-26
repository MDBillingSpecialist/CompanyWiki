/**
 * Upload API
 * 
 * Handles file uploads to the content directory.
 * Supports markdown files and other content assets.
 * 
 * #tags: api, upload, files
 */
import { NextRequest } from 'next/server';
import { processFileUpload } from '@/lib/files/upload';
import { validateContentPath } from '@/lib/files/pathUtils';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';

/**
 * POST - Handle file upload
 */
export async function POST(request: NextRequest) {
  try {
    // Check if request is multipart form data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return apiError(
        'INVALID_REQUEST',
        'Request must be multipart/form-data',
        400
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return apiError(
        'MISSING_FILE',
        'No file provided in the request',
        400
      );
    }
    
    // Get destination path
    const path = formData.get('path') as string || '';
    const overwrite = formData.get('overwrite') === 'true';
    
    // Validate path
    const pathValidation = await validateContentPath(path);
    if (!pathValidation.valid) {
      return apiError(
        'INVALID_PATH',
        pathValidation.message || 'Invalid path',
        400
      );
    }
    
    // Process upload
    const result = await processFileUpload(file, {
      destinationPath: path,
      overwrite,
      allowedExtensions: ['.md', '.mdx', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.pdf', '.docx', '.xlsx', '.csv', '.json'],
      maxSizeBytes: 10 * 1024 * 1024, // 10MB max file size
      processMarkdown: file.name.endsWith('.md') || file.name.endsWith('.mdx')
    });
    
    if (!result.success) {
      return apiError(
        'UPLOAD_FAILED',
        result.error || 'Failed to upload file',
        400
      );
    }
    
    return apiSuccess(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * OPTIONS - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
