# Hybrid Wiki Architecture Setup

This directory contains the Docker Compose setup for the hybrid wiki architecture, combining Wiki.js with custom HIPAA extensions and LLM content generation capabilities.

## Quick Start

1. Copy the `.env.example` file to `.env` and customize the values:

```bash
cp .env.example .env
```

2. Start the system using Docker Compose:

```bash
docker-compose up -d
```

3. Access the Wiki.js admin interface at http://localhost:3200 to complete the initial setup.

4. Run the content migration script to import existing Markdown/MDX content:

```bash
cd ../migration-scripts
npm install
node migrate-content.js --source=/path/to/content --wikiUrl=http://localhost:3200 --apiKey=your-api-key
```

5. Run the HIPAA data migration script to import HIPAA-specific data:

```bash
node migrate-hipaa-data.js --source=/path/to/src --apiUrl=http://localhost:3100 --apiKey=your-api-key
```

## Architecture Components

The system consists of several containerized services:

- **Wiki.js** - Core wiki functionality (port 3200)
- **PostgreSQL** - Database for content storage
- **Redis** - Caching and session management
- **API Layer** - Unified API gateway (port 3100)
- **HIPAA Extensions** - Custom compliance tracking extensions (port 3300)
- **LLM Pipeline** - Content generation service (port 3400)

## API Documentation

The API layer provides a unified interface for interacting with all system components:

- **Wiki API**: `/api/wiki/*` - Content management
- **HIPAA API**: `/api/hipaa/*` - Compliance tracking
- **LLM API**: `/api/llm/*` - Content generation

See the [API documentation](../api-docs.md) for detailed API reference.

## User Roles and Permissions

The system supports the following user roles:

- **Admin** - Full access to all features
- **Editor** - Can create and edit content
- **Reviewer** - Can review and approve content
- **Compliance Officer** - Special access to HIPAA tools
- **Reader** - Read-only access to content

## Maintenance

### Backing Up Data

To backup the system:

```bash
# Backup PostgreSQL database
docker-compose exec db pg_dump -U wikijs wiki > wiki_backup_$(date +%Y%m%d).sql

# Backup Wiki.js uploads
docker cp company_wiki_wiki_1:/wiki/uploads ./backups/uploads_$(date +%Y%m%d)
```

### Updating the System

To update the system to the latest version:

```bash
# Pull latest changes
git pull

# Rebuild and restart containers
docker-compose down
docker-compose build
docker-compose up -d
```

## Troubleshooting

- **Wiki.js not starting**: Check PostgreSQL connection and permissions
- **API errors**: Check Redis connection and API keys
- **LLM pipeline issues**: Verify API keys for OpenAI/Anthropic