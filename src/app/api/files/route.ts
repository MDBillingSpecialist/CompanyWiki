/**
 * Enhanced Files API - List Files
 * 
 * Lists files and directories in the content directory with advanced options.
 * Supports recursive listing, filtering, and sorting capabilities.
 * 
 * #tags: api, files, list, sorting, filtering
 */
import { NextRequest } from 'next/server';
import { listDirectory } from '@/lib/files/fileSystem';
import { 
  validateContentPath, 
  resolveContentPath 
} from '@/lib/files/pathUtils';
import { apiSuccess, apiError, handleApiError } from '@/lib/api/responses';
import { FileListItem } from '@/types/api';

// Valid sort fields
const VALID_SORT_FIELDS = ['name', 'path', 'type', 'size', 'lastModified'];
// Valid sort orders
const VALID_SORT_ORDERS = ['asc', 'desc'];

/**
 * GET handler for listing files and directories with sorting and filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Get base query parameters
    const path = request.nextUrl.searchParams.get('path') || '';
    const recursive = request.nextUrl.searchParams.get('recursive') === 'true';
    
    // Get sorting parameters
    const sortBy = request.nextUrl.searchParams.get('sortBy') || 'name';
    const sortOrder = request.nextUrl.searchParams.get('sortOrder') || 'asc';
    
    // Get filtering parameters
    const fileType = request.nextUrl.searchParams.get('fileType') || null; // 'file' or 'directory'
    const extension = request.nextUrl.searchParams.get('extension') || null;
    
    // Validate sort parameters
    if (!VALID_SORT_FIELDS.includes(sortBy)) {
      return apiError(
        'INVALID_SORT_FIELD',
        `Sort field must be one of: ${VALID_SORT_FIELDS.join(', ')}`,
        400
      );
    }
    
    if (!VALID_SORT_ORDERS.includes(sortOrder)) {
      return apiError(
        'INVALID_SORT_ORDER',
        `Sort order must be one of: ${VALID_SORT_ORDERS.join(', ')}`,
        400
      );
    }
    
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
    
    // Apply filtering
    let filteredItems = contents.items;
    
    if (fileType) {
      filteredItems = filteredItems.filter(item => item.type === fileType);
    }
    
    if (extension) {
      filteredItems = filteredItems.filter(item => {
        // Only filter files (directories don't have extensions)
        if (item.type === 'directory') return false;
        
        // Handle both cases: with and without dot
        const extensionWithoutDot = extension.startsWith('.') ? extension.slice(1) : extension;
        const itemExtensionWithoutDot = item.extension ? (
          item.extension.startsWith('.') ? item.extension.slice(1) : item.extension
        ) : '';
        
        return itemExtensionWithoutDot.toLowerCase() === extensionWithoutDot.toLowerCase();
      });
    }
    
    // Apply sorting
    const sortedItems = sortItems(filteredItems, sortBy, sortOrder as 'asc' | 'desc');
    
    // Return filtered and sorted contents
    return apiSuccess({
      path: contents.path,
      items: sortedItems,
      filter: {
        fileType: fileType || undefined,
        extension: extension || undefined
      },
      sort: {
        field: sortBy,
        order: sortOrder
      },
      total: sortedItems.length
    }, 200, 'SHORT_CACHE');
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Sort items by the specified field and order
 */
function sortItems(items: FileListItem[], sortBy: string, sortOrder: 'asc' | 'desc'): FileListItem[] {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    // Special case for type as we want directories first, then files
    if (sortBy === 'type') {
      if (a.type !== b.type) {
        comparison = a.type === 'directory' ? -1 : 1;
      } else {
        // If both are the same type, sort by name
        comparison = a.name.localeCompare(b.name);
      }
    } 
    // Handle size (need to handle directories which don't have size)
    else if (sortBy === 'size') {
      const aSize = a.size ?? 0;
      const bSize = b.size ?? 0;
      comparison = aSize - bSize;
    }
    // Handle dates
    else if (sortBy === 'lastModified') {
      const aDate = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const bDate = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      comparison = aDate - bDate;
    }
    // Handle strings
    else {
      const aValue = a[sortBy as keyof FileListItem] as string || '';
      const bValue = b[sortBy as keyof FileListItem] as string || '';
      comparison = typeof aValue === 'string' && typeof bValue === 'string'
        ? aValue.localeCompare(bValue)
        : 0;
    }
    
    // Apply sort order
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}
