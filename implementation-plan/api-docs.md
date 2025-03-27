# Hybrid Wiki API Documentation

This document provides detailed information about the API endpoints available in the hybrid wiki architecture.

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer your-jwt-token
```

## Wiki API

### Get Page by Path

```
GET /api/wiki/pages/:path
```

Retrieves a page by its path.

**Parameters:**
- `path` (string, required) - The path of the page

**Response:**
```json
{
  "page": {
    "id": 123,
    "path": "example/page",
    "title": "Example Page",
    "description": "This is an example page",
    "content": "# Example Page\n\nThis is the content of the page.",
    "tags": ["example", "documentation"],
    "isPublished": true,
    "createdAt": "2025-03-15T12:00:00Z",
    "updatedAt": "2025-03-16T09:30:00Z"
  }
}
```

### List Pages

```
GET /api/wiki/pages
```

Lists pages with optional filtering.

**Query Parameters:**
- `locale` (string, optional) - The locale to filter by (default: "en")
- `tags` (array of strings, optional) - Tags to filter by
- `limit` (number, optional) - Maximum number of pages to return (default: 20)
- `orderBy` (string, optional) - Field to sort by (default: "title")

**Response:**
```json
{
  "pages": [
    {
      "id": 123,
      "path": "example/page",
      "title": "Example Page",
      "description": "This is an example page",
      "tags": ["example", "documentation"],
      "isPublished": true,
      "createdAt": "2025-03-15T12:00:00Z",
      "updatedAt": "2025-03-16T09:30:00Z"
    },
    {...}
  ]
}
```

### Create Page

```
POST /api/wiki/pages
```

Creates a new page.

**Request Body:**
```json
{
  "path": "example/new-page",
  "title": "New Page",
  "content": "# New Page\n\nThis is a new page.",
  "description": "This is a new page",
  "tags": ["example", "new"],
  "isPublished": true
}
```

**Response:**
```json
{
  "page": {
    "id": 124,
    "path": "example/new-page",
    "title": "New Page"
  }
}
```

## HIPAA API

### Get Dashboard Data

```
GET /api/hipaa/dashboard
```

Retrieves HIPAA compliance dashboard data.

**Response:**
```json
{
  "complianceStatus": [
    {
      "category": "technical",
      "status": "compliant",
      "lastReviewed": "2025-02-15",
      "nextReview": "2025-08-15",
      "progress": 100,
      "items": {
        "total": 25,
        "completed": 25
      }
    },
    {...}
  ],
  "upcomingReviews": [
    {
      "id": "rev-001",
      "title": "Technical Safeguards Review",
      "dueDate": "2025-08-15",
      "category": "technical",
      "priority": "high",
      "assignedTo": "John Doe"
    },
    {...}
  ],
  "lastUpdated": "2025-03-20T14:30:00Z"
}
```

### Get Checklist by Category

```
GET /api/hipaa/checklists/:category
```

Retrieves a HIPAA checklist by category.

**Parameters:**
- `category` (string, required) - The category of the checklist (e.g., "technical", "administrative")

**Response:**
```json
{
  "id": "checklist-001",
  "title": "Technical Safeguards Checklist",
  "description": "Checklist for HIPAA Technical Safeguards",
  "categories": [
    {
      "id": "cat-001",
      "name": "Access Controls",
      "description": "Measures for granting access to ePHI",
      "items": [
        {
          "id": "item-001",
          "category": "technical",
          "label": "Implement unique user identification",
          "description": "Assign a unique name and/or number for identifying and tracking user identity",
          "completed": true,
          "priority": "high"
        },
        {...}
      ]
    },
    {...}
  ],
  "lastUpdated": "2025-03-15T10:30:00Z"
}
```

### Update Checklist Item

```
PATCH /api/hipaa/checklists/:category/items/:itemId
```

Updates the status of a checklist item.

**Parameters:**
- `category` (string, required) - The category of the checklist
- `itemId` (string, required) - The ID of the checklist item

**Request Body:**
```json
{
  "completed": true,
  "notes": "Implemented as specified in security policy document"
}
```

**Response:**
```json
{
  "id": "item-001",
  "category": "technical",
  "label": "Implement unique user identification",
  "description": "Assign a unique name and/or number for identifying and tracking user identity",
  "completed": true,
  "notes": "Implemented as specified in security policy document",
  "priority": "high",
  "updatedAt": "2025-03-20T15:45:00Z",
  "updatedBy": "user-123"
}
```

## LLM API

### Generate Content

```
POST /api/llm/generate
```

Generates content using LLM.

**Request Body:**
```json
{
  "content": "Create a documentation page about password policies for healthcare applications",
  "title": "Password Policies",
  "targetSection": "hipaa/documentation",
  "contentType": "markdown",
  "instructions": "Include HIPAA compliance requirements and best practices"
}
```

**Response:**
```json
{
  "draftId": "draft-001",
  "content": "# Password Policies for Healthcare Applications\n\n...",
  "metadata": {
    "title": "Password Policies for Healthcare Applications",
    "description": "HIPAA-compliant password policies and best practices",
    "tags": ["hipaa", "security", "passwords"],
    "targetSection": "hipaa/documentation",
    "contentType": "markdown"
  }
}
```

### Get Content Drafts

```
GET /api/llm/drafts
```

Retrieves content drafts.

**Query Parameters:**
- `status` (string, optional) - Filter by status (e.g., "draft", "published", "rejected")
- `limit` (number, optional) - Maximum number of drafts to return (default: 10)
- `offset` (number, optional) - Number of drafts to skip (default: 0)
- `all` (boolean, optional) - If true, retrieves all drafts; if false, only user's drafts (default: false)

**Response:**
```json
{
  "drafts": [
    {
      "id": "draft-001",
      "title": "Password Policies for Healthcare Applications",
      "status": "draft",
      "createdAt": "2025-03-20T16:30:00Z",
      "updatedAt": "2025-03-20T16:30:00Z",
      "createdBy": "user-123",
      "targetSection": "hipaa/documentation"
    },
    {...}
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### Publish Draft

```
POST /api/llm/drafts/:id/publish
```

Publishes a draft to the wiki.

**Parameters:**
- `id` (string, required) - The ID of the draft

**Request Body:**
```json
{
  "path": "hipaa/documentation/password-policies",
  "comment": "Added documentation for password policies"
}
```

**Response:**
```json
{
  "success": true,
  "pageId": 125,
  "path": "hipaa/documentation/password-policies"
}
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error message",
    "details": [
      {
        "field": "field_name",
        "message": "Specific error for this field"
      }
    ]
  }
}
```

Common HTTP status codes:
- `200 OK` - Request succeeded
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error