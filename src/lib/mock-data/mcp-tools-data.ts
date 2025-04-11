import { McpTool } from '@/lib/types/mcp-tools';

export const mcpToolsData: McpTool[] = [
  {
    id: 'monday-api',
    name: 'Monday.com API Tool',
    description: 'Integration with Monday.com for project management and task tracking',
    category: 'api',
    status: 'active',
    version: '1.0.0',
    lastUpdated: '2024-03-21',
    documentationUrl: '/wiki/mcp-tools/monday-api',
    repositoryUrl: 'https://gitlab.com/company/mcp-tools/monday-api',
    dependencies: ['@monday/api-sdk', 'axios'],
    configuration: {
      apiKey: 'process.env.MONDAY_API_KEY',
      boardId: 'process.env.MONDAY_BOARD_ID'
    }
  },
  {
    id: 'hipaa-compliance',
    name: 'HIPAA Compliance Tool',
    description: 'Automated HIPAA compliance checks and reporting',
    category: 'security',
    status: 'active',
    version: '2.1.0',
    lastUpdated: '2024-03-20',
    documentationUrl: '/wiki/mcp-tools/hipaa-compliance',
    repositoryUrl: 'https://gitlab.com/company/mcp-tools/hipaa-compliance'
  },
  {
    id: 'aws-deploy',
    name: 'AWS Deployment Tool',
    description: 'Automated deployment pipeline for AWS CloudFormation',
    version: '2.1.0',
    status: 'active',
    category: 'integration',
    lastUpdated: '2024-03-20',
    repository: 'https://gitlab.com/intelligent-systems-and-development/monday.com_mcp',
    documentation: '/wiki/mcp-tools/aws-deploy'
  },
  {
    id: 'hipaa-monitor',
    name: 'HIPAA Compliance Monitor',
    description: 'Real-time monitoring of HIPAA compliance status',
    version: '1.2.0',
    status: 'active',
    category: 'monitoring',
    lastUpdated: '2024-03-19',
    repository: 'https://gitlab.com/intelligent-systems-and-development/monday.com_mcp',
    documentation: '/wiki/mcp-tools/hipaa-monitor'
  },
  {
    id: 'llm-validator',
    name: 'LLM Input Validator',
    description: 'Validates and sanitizes inputs for LLM interactions',
    version: '1.0.0',
    status: 'maintenance',
    category: 'utility',
    lastUpdated: '2024-03-18',
    repository: 'https://gitlab.com/intelligent-systems-and-development/monday.com_mcp',
    documentation: '/wiki/mcp-tools/llm-validator'
  },
  {
    id: 'baa-tracker',
    name: 'BAA Tracker',
    description: 'Manages Business Associate Agreements and compliance',
    version: '1.1.0',
    status: 'active',
    category: 'monitoring',
    lastUpdated: '2024-03-17',
    repository: 'https://gitlab.com/intelligent-systems-and-development/monday.com_mcp',
    documentation: '/wiki/mcp-tools/baa-tracker'
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    description: 'Centralized API management and routing',
    version: '2.0.0',
    status: 'active',
    category: 'api',
    lastUpdated: '2024-03-16',
    repository: 'https://gitlab.com/intelligent-systems-and-development/monday.com_mcp',
    documentation: '/wiki/mcp-tools/api-gateway'
  }
];

export function getToolById(id: string): McpTool | undefined {
  return mcpToolsData.find(tool => tool.id === id);
}

export function getToolsByCategory(category: string): McpTool[] {
  return mcpToolsData.filter(tool => tool.category === category);
}

export function getToolsByStatus(status: string): McpTool[] {
  return mcpToolsData.filter(tool => tool.status === status);
} 