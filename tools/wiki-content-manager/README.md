# Wiki Content Manager

A comprehensive content management system for the Company Wiki, providing tools for managing wiki content through a user-friendly interface.

## Features

### Content Explorer UI
- Tree view with drag-and-drop for content reorganization
- Context menus for operations (rename, delete, add page, add section)
- Visual indicators for drag operations

### Content Operations API
- Endpoints for move, rename, delete operations
- Transaction-like behavior for multi-file operations
- Automatic updating of references when content changes

### Relationship Management
- Link graph database for tracking content relationships
- Automatic updating of references when content changes
- Visualization tools for content relationships

### Inline Editing
- Section-based editing with floating toolbar
- Split-screen editing with real-time preview
- Rich editing capabilities for markdown content

### Management Mode Toggle
- UI switch to enable advanced management features
- Visual indicators for management mode
- Keyboard shortcuts for toggling mode (Ctrl+M)

### MCP Integration
- Wiki content management MCP server
- AI-powered content analysis and suggestion tools
- Integration with the wiki web app

## Usage

### Management Mode

To enable management mode, click the "Manage Wiki" button in the header or press Ctrl+M. This will display the Wiki Management Console, which provides access to all content management features.

### Content Operations

- **Move Content**: Drag and drop content items in the Content Explorer
- **Rename Content**: Right-click on a content item and select "Rename"
- **Delete Content**: Right-click on a content item and select "Delete"
- **Add Page**: Right-click on a section and select "Add Page"
- **Add Section**: Right-click on a section and select "Add Section"

### MCP Tools

The wiki content manager MCP server provides the following tools:

- `analyze_content_structure`: Analyze the content structure of the wiki and suggest improvements
- `find_broken_links`: Find broken internal links in the wiki
- `suggest_related_content`: Suggest related content for a given page
- `generate_section_content`: Generate content for a new section based on existing content
- `summarize_content`: Generate a summary of wiki content

## Development

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
cd tools/wiki-content-manager
npm install
```

### Running the MCP Server

```bash
node index.js
```

### Adding to MCP Settings

Add the following to your MCP settings configuration file:

```json
"wiki-content-manager": {
  "autoApprove": [],
  "disabled": false,
  "timeout": 60,
  "command": "node",
  "args": [
    "/path/to/tools/wiki-content-manager/index.js"
  ],
  "transportType": "stdio"
}
```

## Architecture

The wiki content management system consists of the following components:

1. **Frontend Components**:
   - `ContentExplorer.tsx`: Tree view for content management
   - `ContextMenu.tsx`: Context menu for content operations
   - `ManagementModeToggle.tsx`: Toggle switch for management mode
   - `WikiManagementConsole.tsx`: Main interface for content management

2. **API Endpoints**:
   - `/api/content/operations`: Endpoints for content operations

3. **MCP Server**:
   - `wiki-content-manager`: MCP server for content analysis and generation

4. **Client Library**:
   - `wiki-content-manager.ts`: Client for interacting with the MCP server
