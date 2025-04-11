---
title: MCP Tool Development Guide
description: Comprehensive guide for developing Model Context Protocol (MCP) tools
lastUpdated: 2025-04-03
tags: ['mcp', 'development', 'tools', 'guide', 'integration']
---

# MCP Tools Development Guide

**Last Updated:** 2024-03-21  
**Version:** 1.0.0  
**Tags:** development, guidelines, mcp-tools, typescript  

## Overview

This guide outlines the development standards and practices for creating and maintaining MCP tools. It ensures consistency, maintainability, and security across all tools in our ecosystem.

## Technology Stack

### Core Technologies
- TypeScript (strict mode)
- Next.js 14+
- React 18+
- TailwindCSS
- Jest/Vitest for testing

### Required Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

## Project Structure

```
src/
├── components/
│   └── mcp-tools/
│       ├── McpToolCard.tsx
│       └── McpToolsDashboard.tsx
├── lib/
│   ├── types/
│   │   └── mcp-tools.ts
│   └── mock-data/
│       └── mcp-tools-data.ts
└── app/
    └── wiki/
        └── mcp-tools/
            └── page.tsx
```

## Type Definitions

### Core Types
```typescript
export type ToolCategory = 'api' | 'integration' | 'utility' | 'security' | 'monitoring';
export type ToolStatus = 'active' | 'maintenance' | 'inactive';

export interface McpTool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  status: ToolStatus;
  version: string;
  lastUpdated: string;
  documentationUrl?: string;
  repositoryUrl?: string;
  dependencies?: string[];
  configuration?: Record<string, unknown>;
}
```

## Component Development

### Best Practices
1. Use functional components with hooks
2. Implement proper TypeScript types
3. Follow React best practices
4. Use TailwindCSS for styling
5. Implement responsive design
6. Add proper error boundaries

### Example Component
```typescript
interface Props {
  tool: McpTool;
}

export function McpToolCard({ tool }: Props) {
  return (
    <Link href={`/wiki/mcp-tools/${tool.id}`}>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2>{tool.name}</h2>
        <p>{tool.description}</p>
      </div>
    </Link>
  );
}
```

## Testing Guidelines

### Unit Tests
- Test all components
- Test utility functions
- Test type guards
- Mock external dependencies

### Integration Tests
- Test component interactions
- Test routing
- Test data flow
- Test error handling

### Example Test
```typescript
describe('McpToolCard', () => {
  it('renders tool information correctly', () => {
    const tool = {
      id: 'test-tool',
      name: 'Test Tool',
      description: 'A test tool'
    };
    render(<McpToolCard tool={tool} />);
    expect(screen.getByText('Test Tool')).toBeInTheDocument();
  });
});
```

## Security Considerations

1. **Input Validation**
   - Validate all user inputs
   - Sanitize data before display
   - Use TypeScript for type safety

2. **Authentication**
   - Implement proper auth checks
   - Use secure session management
   - Follow OAuth best practices

3. **HIPAA Compliance**
   - Follow PHI handling guidelines
   - Implement audit logging
   - Regular security reviews

## Documentation Requirements

Each tool must include:
1. README.md with setup instructions
2. API documentation
3. Security considerations
```typescript
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

class MyMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'my-mcp-tool',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'my_tool',
          description: 'Description of what my tool does',
          inputSchema: {
            type: 'object',
            properties: {
              param1: {
                type: 'string',
                description: 'Description of parameter 1',
              },
              param2: {
                type: 'number',
                description: 'Description of parameter 2',
              },
            },
            required: ['param1'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'my_tool') {
        throw new Error(`Unknown tool: ${request.params.name}`);
      }

      const { param1, param2 } = request.params.arguments;
      
      // Implement your tool logic here
      const result = `Processed ${param1} with value ${param2 || 'default'}`;
      
      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP server running on stdio');
  }
}

const server = new MyMcpServer();
server.run().catch(console.error);
```

## Tool Development Best Practices

### Input Validation

Always validate input parameters:

```typescript
if (typeof param1 !== 'string' || param1.trim() === '') {
  throw new Error('param1 must be a non-empty string');
}

if (param2 !== undefined && (typeof param2 !== 'number' || isNaN(param2))) {
  throw new Error('param2 must be a number');
}
```

### Error Handling

Implement robust error handling:

```typescript
try {
  // Tool implementation
  return {
    content: [{ type: 'text', text: result }],
  };
} catch (error) {
  console.error('Tool execution error:', error);
  return {
    content: [{ type: 'text', text: `Error: ${error.message}` }],
    isError: true,
  };
}
```

### Security Considerations

- Validate all inputs thoroughly
- Limit file system access to specific directories
- Use environment variables for sensitive configuration
- Implement proper authentication for external services
- Follow the principle of least privilege

### Performance Optimization

- Cache expensive operations
- Use asynchronous operations for I/O-bound tasks
- Implement timeouts for external service calls
- Monitor and log performance metrics

## Advanced Features

### Resources

In addition to tools, MCP servers can provide resources:

```typescript
this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'myprotocol://resource1',
      name: 'My Resource',
      description: 'Description of my resource',
    },
  ],
}));

this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri !== 'myprotocol://resource1') {
    throw new Error(`Unknown resource: ${request.params.uri}`);
  }
  
  return {
    contents: [
      {
        uri: request.params.uri,
        mimeType: 'text/plain',
        text: 'Resource content here',
      },
    ],
  };
});
```

### Resource Templates

For dynamic resources:

```typescript
this.server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
  resourceTemplates: [
    {
      uriTemplate: 'myprotocol://{param}',
      name: 'Dynamic Resource',
      description: 'Resource with dynamic parameter',
    },
  ],
}));
```

## Testing

### Unit Testing

Use Jest or Mocha for unit testing:

```typescript
import { expect } from 'chai';
import { MyTool } from './my-tool';

describe('MyTool', () => {
  it('should process parameters correctly', async () => {
    const tool = new MyTool();
    const result = await tool.process('test', 42);
    expect(result).to.equal('Processed test with value 42');
  });
});
```

### Integration Testing

Test the MCP server with the MCP client:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client';
import { ChildProcessTransport } from '@modelcontextprotocol/sdk/client/child-process';

describe('MCP Server Integration', () => {
  let client;
  
  beforeAll(async () => {
    const transport = new ChildProcessTransport('node', ['./dist/index.js']);
    client = new Client();
    await client.connect(transport);
  });
  
  it('should call tool successfully', async () => {
    const result = await client.callTool('my_tool', { param1: 'test', param2: 42 });
    expect(result.content[0].text).to.equal('Processed test with value 42');
  });
  
  afterAll(async () => {
    await client.close();
  });
});
```

## Deployment

### Building for Production

```bash
# Compile TypeScript
tsc

# Make executable
chmod +x dist/index.js

# Test the build
node dist/index.js
```

### Configuration

Add your tool to the MCP settings file:

```json
{
  "mcpServers": {
    "my-mcp-tool": {
      "command": "node",
      "args": ["/path/to/my-mcp-tool/dist/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Debugging

### Logging

Implement detailed logging:

```typescript
console.error('[DEBUG] Tool called with params:', request.params);
```

### Troubleshooting

Common issues:

- **Tool not found**: Ensure the tool name matches exactly
- **Parameter validation errors**: Check input schema and validation
- **Connection issues**: Verify the transport is working correctly
- **Permission errors**: Check file system or API permissions

## Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [MCP Specification](https://github.com/modelcontextprotocol/spec)
- [Example MCP Servers](https://github.com/modelcontextprotocol/servers)

## Support

For MCP development support, contact the AI Engineering team at ai-engineering@example.com or create an issue in the MCP support portal.
