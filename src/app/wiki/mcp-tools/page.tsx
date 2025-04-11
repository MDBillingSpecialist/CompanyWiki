"use client";

import React from 'react';
import { McpToolsDashboard } from '@/components/mcp-tools/McpToolsDashboard';
import { WikiLayout } from '@/components/layout/WikiLayout';
import { mcpToolsData } from '@/lib/mock-data/mcp-tools-data';

export default function McpToolsPage() {
  return (
    <WikiLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">MCP Tools</h1>
        <McpToolsDashboard tools={mcpToolsData} />
      </div>
    </WikiLayout>
  );
} 