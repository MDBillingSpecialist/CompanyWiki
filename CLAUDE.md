# CLAUDE.md - Guidelines for Company Wiki

## Commands
- **Build**: `npm run build` - Build the Next.js application
- **Dev**: `npm run dev` - Run development server
- **Lint**: `npm run lint` - Run ESLint
- **Test**: `npm run test` - Run all Jest tests
- **Test single file**: `npx jest path/to/test.ts(x)` - Run a specific test
- **E2E Test**: `npm run test:e2e` - Run Playwright tests

## Code Style
- **Imports**: Group by type (React, libraries, local) with blank line between groups
- **Typing**: Use TypeScript interfaces for component props and strict typing
- **Components**: Client components must use "use client" directive
- **Error handling**: Use defensive coding with proper error UI fallbacks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Comments**: JSDoc style with descriptive purpose and tags
- **File organization**: Follow Next.js app directory structure
- **Path aliases**: Use `@/` prefix for imports from src directory

## Component Patterns
- Always provide defensive null/undefined checks
- Use Tailwind CSS for styling following dark mode patterns
- Handle all error states gracefully with user-friendly messages