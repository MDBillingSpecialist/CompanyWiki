# Company Wiki

A modern, Next.js-based wiki application for company documentation, HIPAA compliance resources, and standard operating procedures.

## Features

- **Modern Architecture**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Content Management**: Markdown/MDX-based content with frontmatter metadata
- **Navigation**: Intuitive sidebar navigation with collapsible sections and breadcrumbs
- **Documentation**: Comprehensive HIPAA resources and company SOPs
- **Responsive Design**: Works well on all devices

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Navigate to the project directory
```bash
cd company-wiki
```

3. Install dependencies
```bash
npm install
# or
yarn install
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
/company-wiki
├── /content            # Wiki content in Markdown/MDX format
│   ├── /company-wiki   # Company information
│   ├── /hipaa          # HIPAA compliance documentation
│   └── /sop            # Standard operating procedures
├── /public             # Static assets
└── /src
    ├── /app            # Next.js App Router pages
    ├── /components     # React components
    │   ├── /content    # Content display components
    │   ├── /layout     # Layout components
    │   ├── /navigation # Navigation components
    │   └── /sidebar    # Sidebar components
    └── /utils          # Utility functions
        └── mdx.ts      # MDX processing utilities
```

## Adding New Content

To add new content to the wiki:

1. Create a new Markdown (.md) or MDX (.mdx) file in the appropriate directory under `/content`
2. Add frontmatter metadata at the top of the file:
   ```yaml
   ---
   title: Your Document Title
   description: Brief description of the document
   lastUpdated: YYYY-MM-DD
   tags: ['tag1', 'tag2']
   ---
   ```
3. Add your content using Markdown syntax
4. The file will automatically appear in the navigation sidebar and be accessible via URL

## Content Organization

The wiki content is organized into three main sections:

- **Company Wiki**: General company information, team structure, and organizational resources
- **HIPAA**: HIPAA compliance documentation, technical requirements, and implementation guides
- **SOPs**: Standard operating procedures for engineering, compliance, and operational tasks

Each section can have nested subdirectories for better organization.

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## Future Enhancements

- Search functionality
- User authentication
- Content editing interface
- API integrations with Monday.com and Microsoft Teams

## License

[Specify your license here]
