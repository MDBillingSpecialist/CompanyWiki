# Company Wiki API Documentation

This document provides detailed information about the API endpoints available in the Company Wiki application.

## Base URL

All API endpoints are relative to the base URL of your deployment. In development, this is typically:

```
http://localhost:3000
```

## API Response Format

All API endpoints follow a consistent response format:

### Success Response

```json
{
  "data": {
    // Response data specific to the endpoint
  },
  "success": true
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  },
  "success": false
}
```

## Common Error Codes

- `INVALID_PATH` - The provided path is invalid or insecure
- `FILE_NOT_FOUND` - The requested file was not found
- `FILE_EXISTS` - A file already exists at the specified path
- `MISSING_CONTENT` - Required content was not provided
- `INVALID_REQUEST` - The request format is invalid
- `SERVER_ERROR` - An unexpected server error occurred

## Content API

### Get Content

Retrieves content by path, section, or as a list with advanced filtering, pagination, and sorting capabilities.

**Endpoint:** `GET /api/content`

**Query Parameters:**
- `path` (optional) - Path to the content file (without extension)
- `section` (optional) - Section name to list content from
- `list` (optional) - Set to "true" to list all content
- `q` (optional) - Search query
- `tag` (optional) - Filter by a single tag
- `tags` (optional, repeatable) - Filter by multiple tags (can be used multiple times)
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of items per page (default: 20, max: 100)
- `sortBy` (optional) - Field to sort by (e.g., 'path', 'frontmatter.title', 'lastModified')
- `sortOrder` (optional) - Sort order ('asc' or 'desc', default: 'asc')
- `after` (optional) - Cursor for cursor-based pagination (use instead of page)

**Pagination:**

The API supports both page-based and cursor-based pagination:

- **Page-based** - Use `page` and `limit` parameters
- **Cursor-based** - Use `after` and `limit` parameters (useful for infinite scrolling UIs)

The response will include:
- `total` - Total number of items matching the query
- `page` - Current page number (for page-based pagination)
- `limit` - Number of items per page
- `hasMore` - Whether there are more items to fetch
- `nextCursor` - Cursor to use for the next page (for cursor-based pagination)

**Examples:**

1. Get content by path:
```
GET /api/content?path=hipaa/core/technical-security
```

2. List content in a section with pagination:
```
GET /api/content?section=hipaa&page=1&limit=10
```

3. List all content sorted by last modified date:
```
GET /api/content?list=true&sortBy=lastModified&sortOrder=desc
```

4. Search content with pagination:
```
GET /api/content?q=security&section=hipaa&page=1&limit=20
```

5. Filter content by multiple tags:
```
GET /api/content?section=hipaa&tags=security&tags=compliance
```

6. Cursor-based pagination:
```
GET /api/content?list=true&limit=10&after=encoded_cursor_value
```

## Files API

### List Files

Lists files and directories in the content directory with sorting and filtering capabilities.

**Endpoint:** `GET /api/files`

**Query Parameters:**
- `path` (optional) - Path to directory (defaults to root content directory)
- `recursive` (optional) - Set to "true" to list recursively
- `sortBy` (optional) - Field to sort by (default: 'name')
  - Valid values: 'name', 'path', 'type', 'size', 'lastModified'
- `sortOrder` (optional) - Sort order (default: 'asc')
  - Valid values: 'asc', 'desc'
- `fileType` (optional) - Filter by file type
  - Valid values: 'file', 'directory'
- `extension` (optional) - Filter by file extension (e.g., 'md', '.md')

**Response:**

The response includes:
- `path` - The directory path
- `items` - Array of files and directories
- `filter` - Applied filters
- `sort` - Applied sorting
- `total` - Total number of items after filtering

**Examples:**

1. List all files in a directory:
```
GET /api/files?path=hipaa&recursive=true
```

2. List only markdown files sorted by last modified date:
```
GET /api/files?path=hipaa&extension=md&sortBy=lastModified&sortOrder=desc
```

3. List only directories:
```
GET /api/files?path=content&fileType=directory
```

### Get File

Retrieves a file's content and metadata.

**Endpoint:** `GET /api/files/{path}`

**Example:**
```
GET /api/files/hipaa/core/technical-security.md
```

### Create File

Creates a new file.

**Endpoint:** `POST /api/files/{path}`

**Request Body:**
```json
{
  "content": "# New Document\n\nContent goes here...",
  "frontmatter": {
    "title": "New Document",
    "description": "Description of the document",
    "tags": ["tag1", "tag2"]
  },
  "overwrite": false
}
```

**Example:**
```
POST /api/files/hipaa/new-document.md
```

### Update File

Updates an existing file.

**Endpoint:** `PUT /api/files/{path}`

**Request Body:**
```json
{
  "content": "Updated content...",
  "frontmatter": {
    "title": "Updated Title",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "createIfNotExists": false
}
```

**Example:**
```
PUT /api/files/hipaa/core/technical-security.md
```

### Delete File

Deletes a file.

**Endpoint:** `DELETE /api/files/{path}`

**Example:**
```
DELETE /api/files/hipaa/obsolete-document.md
```

## Upload API

Uploads a file to the content directory.

**Endpoint:** `POST /api/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Form Fields:
  - `file` - The file to upload
  - `path` (optional) - Destination path
  - `overwrite` (optional) - Set to "true" to overwrite existing files

**Example:**
```
POST /api/upload
Form Data:
  file: [file data]
  path: hipaa/images/
```

## Search API

Searches content by query and/or tag with pagination.

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `q` (optional) - Search query
- `tag` (optional) - Filter by tag
- `section` (optional) - Limit search to a specific section
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Number of items per page (default: 20, max: 100)

**Pagination:**

The response includes pagination metadata:
- `total` - Total number of search results
- `page` - Current page number
- `limit` - Number of items per page
- `hasMore` - Whether there are more results to fetch

**Examples:**

1. Basic search:
```
GET /api/search?q=security&section=hipaa
```

2. Search with pagination:
```
GET /api/search?q=compliance&page=2&limit=10
```

3. Tag-based search:
```
GET /api/search?tag=security&section=hipaa&page=1&limit=20
```

## Security Considerations

- All paths are validated to prevent path traversal attacks
- File operations are restricted to the content directory
- Uploads are validated for file type and size
