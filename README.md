# Company Wiki

A modern, Next.js-based wiki application for company documentation, HIPAA compliance resources, and standard operating procedures.

## Features

- **Modern Architecture**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Content Management**: Markdown/MDX-based content with frontmatter metadata
- **Full API Support**: RESTful API for content management and search
- **Navigation**: Intuitive sidebar navigation with collapsible sections and breadcrumbs
- **Documentation**: Comprehensive HIPAA resources and company SOPs
- **Responsive Design**: Works well on all devices
- **Search Functionality**: Full-text search across all content
- **Testing**: Comprehensive unit, component, and E2E testing

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
├── /scripts            # Utility scripts
└── /src
    ├── /app            # Next.js App Router pages
    │   ├── /api        # API routes
    ├── /components     # React components
    ├── /lib            # Core library code
    │   ├── /api        # API utilities
    │   ├── /content    # Content processing
    │   ├── /files      # File operations
    │   └── /search     # Search functionality
    ├── /styles         # Global styles
    └── /types          # TypeScript definitions
```

## API Documentation

The wiki provides a comprehensive API for content management and search. See [API.md](API.md) for detailed documentation.

### Key API Endpoints

- **Content**: `/api/content` - Get content by path, section, or list all
- **Files**: `/api/files` - List, create, update, and delete files
- **Upload**: `/api/upload` - Upload files
- **Search**: `/api/search` - Search content by query or tag

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

Alternatively, you can use the API to create content programmatically.

## Content Organization

The wiki content is organized into three main sections:

- **Company Wiki**: General company information, team structure, and organizational resources
- **HIPAA**: HIPAA compliance documentation, technical requirements, and implementation guides
- **SOPs**: Standard operating procedures for engineering, compliance, and operational tasks

Each section can have nested subdirectories for better organization.

## Deployment

### Local Deployment

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

### AWS Deployment

The application is set up for deployment to AWS App Runner with multiple deployment options:

#### 1. GitHub-based Deployment
For deploying directly from a GitHub repository:
```bash
./aws/create-new-app-github.sh
```
This method:
- Creates a GitHub connection (requires manual authentication in AWS console)
- Deploys directly from your GitHub repository
- Uses the configuration in apprunner.yaml

#### 2. ECR-based Deployment
For deploying using Docker and Amazon ECR:
```bash
./aws/setup-ecr-deployment.sh
```
This method:
- Builds and pushes a Docker image to Amazon ECR
- Creates an App Runner service using the container image
- Does not require a GitHub connection

#### 3. GitLab CI/CD Pipeline
For automatic deployments via GitLab CI/CD:
- Push to the `develop` branch to deploy to staging
- Push to the `main` branch to trigger production deployment (manual approval required)

#### Deployment Prerequisites
- AWS CLI installed and configured with appropriate credentials
- Docker installed (for ECR deployment)
- Appropriate IAM permissions to create roles and App Runner services

For detailed deployment instructions, see [AWS Deployment Steps](docs/AWS_DEPLOYMENT_STEPS.md).

### Docker Deployment

The application can also be deployed using Docker:

```bash
docker build -t company-wiki .
docker run -p 3005:3000 company-wiki
```

For more deployment options, see [DEPLOYMENT.md](DEPLOYMENT.md).

## License

[Specify your license here]
