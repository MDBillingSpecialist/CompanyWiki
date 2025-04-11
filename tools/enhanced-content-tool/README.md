# Enhanced Content Tool for Company Wiki

A powerful content creation and management tool for the company wiki that provides:

- Structured templates for different document types
- Auto-generation of document IDs
- Smart suggestions for related content
- Bidirectional link management
- Consistent metadata handling

## Features

### Document Type Templates

The tool provides specialized templates for different types of content:

- **Standard Operating Procedures (SOPs)** - With structured sections for purpose, scope, responsibilities, etc.
- **HIPAA Documentation** - With regulatory references and implementation guidelines
- **General Wiki Pages** - For company information and documentation
- **Index Pages** - Auto-generated listings of section content

### Smart Content Relationships

The tool automatically suggests related content based on:

- Tag matching
- Category/section relationships
- Content similarity
- Document type-specific relationships (e.g., SOPs that implement HIPAA requirements)

### Bidirectional Links

When you link to a document, the tool automatically adds a reciprocal link back to your document, ensuring:

- Complete navigation paths
- Comprehensive relationship tracking
- No dead-end pages

### Consistent Metadata

The tool enforces consistent metadata across all documents:

- Required fields based on document type
- Standardized formatting
- Proper tagging

## Installation

```bash
cd company-wiki/tools/enhanced-content-tool
npm install
```

## Usage

```bash
cd company-wiki
node tools/enhanced-content-tool/src/index.js
```

Or add it to your package.json scripts:

```json
"scripts": {
  "create-content": "node tools/enhanced-content-tool/src/index.js"
}
```

Then run:

```bash
npm run create-content
```

## Workflow

1. Select document type (SOP, HIPAA, General, Index)
2. Choose section/department
3. Enter document details
4. Review and select related content suggestions
5. Generate document with proper metadata and structure

## Requirements

- Node.js 14+
- npm or yarn

## Dependencies

- inquirer - Interactive command line interface
- gray-matter - YAML frontmatter parsing
- string-similarity - Content similarity detection
- chalk - Terminal styling
- date-fns - Date formatting and manipulation
