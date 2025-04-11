"use client";

/**
 * Wiki Management Console Component
 * 
 * The main interface for wiki content management.
 * Provides a unified UI for managing wiki content, including:
 * - Content explorer with drag-and-drop
 * - Operations for moving, renaming, and deleting content
 * - Content relationship management
 * 
 * #tags: management console content-management
 */
import React, { useState, useCallback } from 'react';
import { ContentExplorer } from './ContentExplorer';
import { useContentStructure, ContentItem } from '@/lib/hooks/useContentStructure';
import { useWikiManagement } from './ManagementModeToggle';
import { useRouter } from 'next/navigation';

export const WikiManagementConsole: React.FC = () => {
  const { structure, isLoading, error } = useContentStructure();
  const { isManagementMode } = useWikiManagement();
  const router = useRouter();
  const [operationStatus, setOperationStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Don't render if not in management mode
  if (!isManagementMode) return null;
  
  // Handle refresh
  const handleRefresh = useCallback(() => {
    router.refresh();
  }, [router]);
  
  // Handle move operation
  const handleMove = useCallback(async (source: ContentItem, targetPath: string) => {
    try {
      setOperationStatus(null);
      
      const response = await fetch('/api/content/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operation: 'move',
          params: {
            sourcePath: source.path.replace(/^\/wiki\//, ''),
            destinationPath: targetPath.replace(/^\/wiki\//, '')
          }
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to move content');
      }
      
      setOperationStatus({
        type: 'success',
        message: `Successfully moved ${source.title} to ${targetPath}`
      });
      
      // Refresh the content structure
      router.refresh();
    } catch (error) {
      console.error('Error moving content:', error);
      setOperationStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to move content'
      });
    }
  }, [router]);
  
  // Handle rename operation
  const handleRename = useCallback(async (item: ContentItem, newName: string) => {
    try {
      setOperationStatus(null);
      
      const response = await fetch('/api/content/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operation: 'rename',
          params: {
            path: item.path.replace(/^\/wiki\//, ''),
            newName
          }
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to rename content');
      }
      
      setOperationStatus({
        type: 'success',
        message: `Successfully renamed ${item.title} to ${newName}`
      });
      
      // Refresh the content structure
      router.refresh();
    } catch (error) {
      console.error('Error renaming content:', error);
      setOperationStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to rename content'
      });
    }
  }, [router]);
  
  // Handle delete operation
  const handleDelete = useCallback(async (item: ContentItem) => {
    try {
      setOperationStatus(null);
      
      const response = await fetch('/api/content/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operation: 'delete',
          params: {
            path: item.path.replace(/^\/wiki\//, '')
          }
        })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete content');
      }
      
      setOperationStatus({
        type: 'success',
        message: `Successfully deleted ${item.title}`
      });
      
      // Refresh the content structure
      router.refresh();
    } catch (error) {
      console.error('Error deleting content:', error);
      setOperationStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete content'
      });
    }
  }, [router]);
  
  // Handle add page
  const handleAddPage = useCallback((parentPath: string) => {
    router.push(`/wiki/create?section=${encodeURIComponent(parentPath)}`);
  }, [router]);
  
  // Handle add section
  const handleAddSection = useCallback((parentPath: string) => {
    // For now, just redirect to the create page
    // In a more complete implementation, this would open a dialog to create a section
    router.push(`/wiki/create?section=${encodeURIComponent(parentPath)}&isSection=true`);
  }, [router]);
  
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Wiki Management Console
      </h2>
      
      {/* Status message */}
      {operationStatus && (
        <div className={`p-4 mb-4 rounded-md ${
          operationStatus.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {operationStatus.message}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Loading content structure...
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500 dark:text-red-400">
          Error loading content structure: {error}
        </div>
      ) : (
        <ContentExplorer
          structure={structure}
          onRefresh={handleRefresh}
          onMove={handleMove}
          onRename={handleRename}
          onDelete={handleDelete}
          onAddPage={handleAddPage}
          onAddSection={handleAddSection}
        />
      )}
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Tip: Use drag and drop to move content between sections.</p>
        <p>Keyboard shortcut: Press Ctrl+M to toggle management mode.</p>
      </div>
    </div>
  );
};
