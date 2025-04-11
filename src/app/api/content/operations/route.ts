/**
 * Content Operations API Route
 * 
 * Provides endpoints for content management operations:
 * - Move/rename content
 * - Delete content
 * - Update content relationships
 * 
 * #tags: api content-management operations
 */
import { NextRequest } from 'next/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import fs from 'fs';
import path from 'path';
import { 
  getContentFile, 
  updateContentFile, 
  deleteContentFile 
} from '@/lib/files/contentManager';
import { resolveContentPath } from '@/lib/files/pathUtils';

/**
 * POST handler for content operations
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, params } = body;
    
    if (!operation) {
      return apiError('MISSING_PARAMETER', 'Operation parameter is required', 400);
    }
    
    switch (operation) {
      case 'move':
        return handleMoveOperation(params);
      case 'rename':
        return handleRenameOperation(params);
      case 'delete':
        return handleDeleteOperation(params);
      default:
        return apiError('INVALID_OPERATION', `Unknown operation: ${operation}`, 400);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Handle move operation
 */
async function handleMoveOperation(params: any) {
  const { sourcePath, destinationPath } = params;
  
  if (!sourcePath || !destinationPath) {
    return apiError('MISSING_PARAMETER', 'Source and destination paths are required', 400);
  }
  
  try {
    // Get the source content
    const sourceContent = await getContentFile(sourcePath);
    if (!sourceContent) {
      return apiError('CONTENT_NOT_FOUND', `Source content not found: ${sourcePath}`, 404);
    }
    
    // Resolve the full file paths
    const sourceFilePath = resolveContentPath(sourceContent.path);
    const destinationFilePath = resolveContentPath(path.join(destinationPath, path.basename(sourceContent.path)));
    
    // Check if destination already exists
    if (fs.existsSync(destinationFilePath)) {
      return apiError('DESTINATION_EXISTS', 'Destination already exists', 409);
    }
    
    // Ensure destination directory exists
    const destinationDir = path.dirname(destinationFilePath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(sourceFilePath, destinationFilePath);
    
    // Update references in other files (in a real implementation, this would scan all content for links to the moved file)
    // await updateReferences(sourcePath, destinationPath);
    
    return apiSuccess({
      message: 'Content moved successfully',
      sourcePath,
      destinationPath
    });
  } catch (error) {
    console.error('Error moving content:', error);
    return apiError('MOVE_FAILED', `Failed to move content: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}

/**
 * Handle rename operation
 */
async function handleRenameOperation(params: any) {
  const { path: contentPath, newName } = params;
  
  if (!contentPath || !newName) {
    return apiError('MISSING_PARAMETER', 'Path and new name are required', 400);
  }
  
  try {
    // Get the content
    const content = await getContentFile(contentPath);
    if (!content) {
      return apiError('CONTENT_NOT_FOUND', `Content not found: ${contentPath}`, 404);
    }
    
    // Update the frontmatter with the new title
    const updatedContent = await updateContentFile({
      path: contentPath,
      frontmatter: {
        title: newName
      }
    });
    
    return apiSuccess({
      message: 'Content renamed successfully',
      path: contentPath,
      newName,
      content: updatedContent
    });
  } catch (error) {
    console.error('Error renaming content:', error);
    return apiError('RENAME_FAILED', `Failed to rename content: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}

/**
 * Handle delete operation
 */
async function handleDeleteOperation(params: any) {
  const { path: contentPath, recursive } = params;
  
  if (!contentPath) {
    return apiError('MISSING_PARAMETER', 'Path is required', 400);
  }
  
  try {
    // Delete the content
    await deleteContentFile(contentPath);
    
    return apiSuccess({
      message: 'Content deleted successfully',
      path: contentPath
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return apiError('DELETE_FAILED', `Failed to delete content: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
  }
}
