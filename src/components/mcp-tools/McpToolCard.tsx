"use client";

import React from 'react';
import { McpTool } from '@/lib/types/mcp-tools';
import Link from 'next/link';
import { Gitlab, BookOpen, ExternalLink } from 'lucide-react';

interface McpToolCardProps {
  tool: McpTool;
}

export function McpToolCard({ tool }: McpToolCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api':
        return 'bg-blue-100 text-blue-800';
      case 'integration':
        return 'bg-purple-100 text-purple-800';
      case 'utility':
        return 'bg-orange-100 text-orange-800';
      case 'monitoring':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link
      href={`/wiki/mcp-tools/${tool.id}`}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{tool.name}</h2>
        <span className={`px-2 py-1 rounded-full text-sm ${
          tool.status === 'active' ? 'bg-green-100 text-green-800' :
          tool.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {tool.status}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{tool.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Version {tool.version}</span>
        <span>Last updated: {tool.lastUpdated}</span>
      </div>
    </Link>
  );
} 