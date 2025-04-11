---
title: LlamaIndex API Documentation
description: Comprehensive documentation for LlamaIndex API
lastUpdated: 2025-04-03
tags: ['api', 'documentation', 'llamaindex']
---

# LlamaIndex API Documentation

## Overview

LlamaIndex is a powerful API that allows developers to integrate various functionalities into their applications.

## Authentication

Authentication is done via API keys. You can obtain an API key by registering on the LlamaIndex website.

## Endpoints

### GET /api/v1/resources

Retrieves a list of resources.

#### Parameters

- `limit` (optional): Maximum number of resources to return. Default: 10.
- `offset` (optional): Number of resources to skip. Default: 0.

#### Response

```json
{
  "resources": [
    {
      "id": "resource-id",
      "name": "Resource Name",
      "description": "Resource Description"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

### POST /api/v1/resources

Creates a new resource.

#### Request Body

```json
{
  "name": "Resource Name",
  "description": "Resource Description"
}
```

#### Response

```json
{
  "id": "resource-id",
  "name": "Resource Name",
  "description": "Resource Description",
  "created_at": "2025-04-03T12:00:00Z"
}
```

## Error Handling

The API returns standard HTTP status codes to indicate the success or failure of a request.

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a JSON body with an error message:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Rate Limiting

The API is rate limited to 100 requests per minute per API key. If you exceed this limit, you will receive a 429 Too Many Requests response.
