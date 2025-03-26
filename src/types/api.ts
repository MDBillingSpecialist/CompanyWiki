/**
 * API Type Definitions
 * 
 * Type definitions for API requests and responses.
 * 
 * #tags: types, api
 */

// Standard API response structure
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  success: boolean;
}

// File operations

export interface FileOperationResponse {
  success: boolean;
  path?: string;
  message?: string;
}

export interface FileListItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  size?: number;
  lastModified?: string;
}

export interface DirectoryContents {
  path: string;
  items: FileListItem[];
}

export interface ContentCreateRequest {
  content: string;
  frontmatter?: Record<string, any>;
  overwrite?: boolean;
}

export interface ContentUpdateRequest {
  content?: string;
  frontmatter?: Record<string, any>;
  createIfNotExists?: boolean;
}

export interface ContentResponse {
  slug: string;
  path: string;
  content: string;
  frontmatter: Record<string, any>;
  lastModified?: string;
}

// Search
export interface SearchParams {
  q?: string;
  tag?: string;
  section?: string;
}

export interface SearchResult {
  slug: string;
  path: string;
  title: string;
  description?: string;
  excerpt?: string;
  matches?: {
    field: string;
    text: string;
  }[];
  score?: number;
  tags?: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: SearchParams;
}

// Upload
export interface UploadOptions {
  path: string;
  overwrite?: boolean;
  processMarkdown?: boolean;
}

export interface UploadResponse {
  success: boolean;
  path?: string;
  error?: string;
  file?: FileListItem;
}
