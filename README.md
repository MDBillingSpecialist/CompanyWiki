# Company Wiki

**Version:** 1.0.0  
**Last Updated:** 2024-03-21  
**Tags:** documentation, wiki, next.js, typescript  

## Overview

A comprehensive internal documentation platform built with Next.js and TypeScript, featuring HIPAA compliance tracking, MCP tools management, and integrated project documentation.

## Features

- 📚 **Documentation Management**
  - Markdown-based content
  - Real-time preview
  - Version control integration
  - Search functionality

- 🔒 **HIPAA Compliance**
  - Compliance dashboard
  - Automated checks
  - Audit logging
  - Review tracking

- 🛠 **MCP Tools**
  - Monday.com integration
  - Tool configuration management
  - Security controls
  - Usage analytics

- 🔐 **Security**
  - Role-based access control
  - Audit trails
  - Secure authentication
  - PHI protection

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Content:** Markdown
- **Testing:** Jest/Vitest

## Prerequisites

- Node.js 18+
- npm/yarn
- Git

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://gitlab.com/company/company-wiki.git
   cd company-wiki
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
company-wiki/
├── content/              # Documentation content
│   ├── sop/             # Standard Operating Procedures
│   ├── mcp-tools/       # MCP Tools documentation
│   └── hipaa/           # HIPAA compliance docs
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── lib/             # Utilities and helpers
│   └── styles/          # Global styles
├── public/              # Static assets
└── tools/              # Development tools
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Content Management

1. **Adding Content**
   - Create `.md` files in the appropriate content directory
   - Include required frontmatter
   - Add necessary assets to `public/`

2. **Updating Documentation**
   - Edit existing markdown files
   - Run local server to preview changes
   - Commit changes following guidelines

### Component Development

1. **Creating Components**
   - Use TypeScript for type safety
   - Follow project structure
   - Include tests and documentation

2. **Styling**
   - Use TailwindCSS utilities
   - Follow design system
   - Ensure responsive design

## Deployment

1. **Build Process**
   ```bash
   npm run build
   ```

2. **Production Start**
   ```bash
   npm run start
   ```

3. **Environment Variables**
   Required for production:
   - `NODE_ENV=production`
   - `API_BASE_URL`
   - `MONDAY_API_KEY`
   - `SESSION_SECRET`

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Submit merge request

## Security

- Follow HIPAA guidelines
- Use secure environment variables
- Implement access controls
- Regular security audits

## Support

- **Technical Issues:** Alex (Lead Developer)
- **Content Management:** Documentation Team
- **Security Concerns:** Security Team

## License

Proprietary - All rights reserved

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-03-21 | Initial release |
| 1.0.1 | 2024-03-22 | Added MCP tools |
