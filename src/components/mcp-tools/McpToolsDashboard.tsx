"use client";

import React, { useState, useMemo } from 'react';
import { McpToolCard } from '@/components/mcp-tools/McpToolCard';
import { McpTool, ToolCategory, ToolStatus } from '@/lib/types/mcp-tools';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

interface McpToolsDashboardProps {
  tools: McpTool[];
}

type SortField = 'name' | 'lastUpdated' | 'version';
type SortOrder = 'asc' | 'desc';

export function McpToolsDashboard({ tools }: McpToolsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ToolCategory[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ToolStatus[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get unique categories and statuses
  const categories = useMemo(() => 
    Array.from(new Set(tools.map(tool => tool.category))), 
    [tools]
  );
  
  const statuses = useMemo(() => 
    Array.from(new Set(tools.map(tool => tool.status))), 
    [tools]
  );

  // Filter and sort tools
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(tool => 
        selectedCategories.includes(tool.category)
      );
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      result = result.filter(tool => 
        selectedStatuses.includes(tool.status)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case 'version':
          comparison = a.version.localeCompare(b.version);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tools, searchQuery, selectedCategories, selectedStatuses, sortField, sortOrder]);

  const toggleCategory = (category: ToolCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status: ToolStatus) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">MCP Tools Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => toggleSort('name')}
            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span>Sort</span>
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">Categories:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(category)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedStatuses.includes(status)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <McpToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 