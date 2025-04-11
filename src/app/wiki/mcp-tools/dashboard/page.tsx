'use client';

import React from 'react';
import { McpToolsDashboard } from '@/components/mcp-tools/McpToolsDashboard';
import { mcpToolsData } from '@/lib/mock-data/mcp-tools-data';
import { WikiLayout } from '@/components/layout/WikiLayout';

export default function McpToolsDashboardPage() {
  return (
    <WikiLayout>
      <div className="container mx-auto px-4 py-8">
        <McpToolsDashboard tools={mcpToolsData} />
      </div>
    </WikiLayout>
  );
} 