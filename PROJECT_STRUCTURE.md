# Company Wiki Project Structure

This document outlines the structure of the Company Wiki project, providing an overview of its organization and key components.

## Directory Structure

```
/company-wiki
├── /content                # Wiki content in Markdown/MDX format
│   ├── /company-wiki       # Company information
│   ├── /hipaa              # HIPAA compliance documentation
│   └── /sop                # Standard operating procedures
├── /public                 # Static assets
├── /scripts                # Utility scripts
└── /src
    ├── /app                # Next.js App Router pages and API routes
    │   ├── /api            # REST API endpoints
    │   │   ├── /content    # Content retrieval API
    │   │   ├── /files      # File operations API
    │   │   ├── /search     # Search API
    │   │   └── /upload     # File upload API
    │   └── /wiki           # Wiki page routes
    ├── /components         # React components
    │   ├── /content        # Content display components
    │   ├── /hipaa          # HIPAA-specific components
    │   ├── /layout         # Layout components
    │   ├── /navigation     # Navigation components
    │   ├── /search         # Search components
    │   ├── /sidebar        # Sidebar components
    │   └── /theme          # Theming components
    ├── /lib                # Core library code
    │   ├── /api            # API utilities
    │   ├── /content        # Content processing (MDX, Markdown)
    │   ├── /files          # File system operations
    │   ├── /mock-data      # Mock data for development
    │   └── /search         # Search functionality
    ├── /styles             # Global styles
    └── /types              # TypeScript type definitions
```

## Key Components

### API Endpoints

- **/api/content** - Get content by path, section, or list all content
- **/api/files** - List, create, update, and delete files
- **/api/files/[...path]** - File operations on specific paths
- **/api/search** - Search content by query or tag
- **/api/upload** - Upload files to the content directory

### Library Modules

- **lib/api** - API response formatting and error handling
- **lib/content** - MDX and Markdown processing utilities
- **lib/files** - File system operations and content management
- **lib/search** - Content search functionality

### React Components

- **components/content/MDXContent** - Renders MDX content with frontmatter
- **components/layout/WikiLayout** - Main layout for wiki pages
- **components/navigation/Breadcrumb** - Navigation breadcrumbs
- **components/sidebar/Sidebar** - Wiki navigation sidebar

## Type Definitions

- **types/api.ts** - API request/response type definitions
- **types/content.ts** - Content-related type definitions

## Flow Diagrams

### Content Retrieval Flow

```mermaid
graph LR
    A[Client] --> B[GET /api/content]
    B --> C{Path Type?}
    C -->|Path| D[getContentBySlug]
    C -->|Section| E[getContentBySection]
    C -->|List All| F[getAllContentMeta]
    D --> G[Return Content]
    E --> G
    F --> G
    G --> A
```

### File Operations Flow

```mermaid
graph LR
    A[Client] --> B{Operation}
    B -->|Create| C[POST /api/files/path]
    B -->|Read| D[GET /api/files/path]
    B -->|Update| E[PUT /api/files/path]
    B -->|Delete| F[DELETE /api/files/path]
    B -->|List| G[GET /api/files?path=dir]
    C --> H[contentManager.createContentFile]
    D --> I[contentManager.getContentFile]
    E --> J[contentManager.updateContentFile]
    F --> K[contentManager.deleteContentFile]
    G --> L[fileSystem.listDirectory]
    H --> M[Return Result]
    I --> M
    J --> M
    K --> M
    L --> M
    M --> A
```

### Search Flow

```mermaid
graph LR
    A[Client] --> B[GET /api/search]
    B --> C[searchContent]
    C --> D[Collect Files]
    D --> E[Filter by Tag]
    E --> F[Search by Query]
    F --> G[Score & Sort Results]
    G --> H[Return Results]
    H --> A
```

## Configuration Files

- **next.config.js** - Next.js configuration
- **tailwind.config.js** - Tailwind CSS configuration
- **postcss.config.js** - PostCSS configuration
- **eslint.config.js** - ESLint configuration
- **tsconfig.json** - TypeScript configuration

All configuration files are now stored directly in the root directory following standard Next.js best practices, making it easier for developers to find and modify them.

## Documentation

- **API.md** - API documentation
- **README.md** - Project overview and setup instructions
- **PROJECT_STRUCTURE.md** - Project structure documentation
