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