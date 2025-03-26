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

Retrieves content by path, section, or as a list.

**Endpoint:** `GET /api/content`

**Query Parameters:**
- `path` (optional) - Path to the content file (without extension)
- `section` (optional) - Section name to list content from
- `list` (optional) - Set to "true" to list all content
- `q` (optional) - Search query
- `tag` (optional) - Filter by tag

**Examples:**

1. Get content by path:
```
GET /api/content?path=hipaa/core/technical-security
```

2. List all content in a section:
```
GET /api/content?section=hipaa
```

3. List all content:
```
GET /api/content?list=true
```

4. Search content:
```
GET /api/content?q=security&section=hipaa
```

## Files API

### List Files

Lists files and directories in the content directory.

**Endpoint:** `GET /api/files`

**Query Parameters:**
- `path` (optional) - Path to directory (defaults to root content directory)
- `recursive` (optional) - Set to "true" to list recursively

**Example:**
```
GET /api/files?path=hipaa&recursive=true
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

Searches content by query and/or tag.

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `q` (optional) - Search query
- `tag` (optional) - Filter by tag
- `section` (optional) - Limit search to a specific section

**Example:**
```
GET /api/search?q=security&section=hipaa
```

## Security Considerations

- All paths are validated to prevent path traversal attacks
- File operations are restricted to the content directory
- Uploads are validated for file type and size
