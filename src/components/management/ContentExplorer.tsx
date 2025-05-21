"use client";

/**
 * Content Explorer Component
 * 
 * A tree view component for managing wiki content with drag-and-drop capabilities.
 * Allows for moving, renaming, and deleting content through a visual interface.
 * 
 * #tags: content-management wiki-explorer drag-drop
 */
import React, { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider, useDrag, useDrop, DropTargetMonitor, DragSourceMonitor } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  DocumentTextIcon, 
  FolderIcon, 
  PencilIcon,
  PencilSquareIcon,
  TrashIcon, 
  ArrowPathIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { ContentItem } from '@/lib/hooks/useContentStructure';
import { ContextMenu } from './ContextMenu';

// Item types for drag and drop
const ItemTypes = {
  CONTENT_ITEM: 'contentItem'
};

interface ContentNodeProps {
  item: ContentItem;
  depth: number;
  onMove: (source: ContentItem, targetPath: string) => void;
  onRename: (item: ContentItem, newName: string) => void;
  onDelete: (item: ContentItem) => void;
  onAddPage: (parentPath: string) => void;
  onAddSection: (parentPath: string) => void;
}

/**
 * Individual node in the content tree
 */
const ContentNode: React.FC<ContentNodeProps> = ({
  item,
  depth,
  onMove,
  onRename,
  onDelete,
  onAddPage,
  onAddSection
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const hasChildren = item.children && item.children.length > 0;
  const isSection = hasChildren;
  
  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CONTENT_ITEM,
    item: () => ({ ...item }),
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Set up drop target
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.CONTENT_ITEM,
    drop: (draggedItem: ContentItem, monitor: DropTargetMonitor) => {
      if (monitor.didDrop()) {
        return; // Don't handle if a child already handled it
      }
      
      // Handle the drop
      onMove(draggedItem, item.path);
    },
    canDrop: (draggedItem: ContentItem, monitor: DropTargetMonitor) => {
      // Can't drop on itself or its children
      if (draggedItem.path === item.path) return false;
      if (item.path.startsWith(draggedItem.path + '/')) return false;
      
      // Can only drop on sections
      return isSection === true;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });
  
  // Combine drag and drop refs
  const dragDropRef = (el: HTMLDivElement | null) => {
    drag(el);
    drop(el);
  };
  
  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  
  // Handle context menu close
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  
  // Handle rename
  const handleRename = () => {
    const newName = prompt('Enter new name:', item.title);
    if (newName && newName !== item.title) {
      onRename(item, newName);
    }
    handleCloseContextMenu();
  };
  
  // Handle delete
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      onDelete(item);
    }
    handleCloseContextMenu();
  };
  
  // Handle add page
  const handleAddPage = () => {
    onAddPage(item.path);
    handleCloseContextMenu();
  };
  
  // Handle add section
  const handleAddSection = () => {
    onAddSection(item.path);
    handleCloseContextMenu();
  };

  // Handle edit page
  const handleEdit = () => {
    router.push(`/wiki/edit/${item.path.replace(/^\/wiki\//, '')}`);
    handleCloseContextMenu();
  };
  
  // Context menu items
  const menuItems = [
    { label: 'Rename', icon: <PencilIcon className="w-4 h-4" />, onClick: handleRename },
    { label: 'Delete', icon: <TrashIcon className="w-4 h-4" />, onClick: handleDelete },
    ...(isSection
      ? [
          { label: 'Add Page', icon: <DocumentTextIcon className="w-4 h-4" />, onClick: handleAddPage },
          { label: 'Add Section', icon: <FolderIcon className="w-4 h-4" />, onClick: handleAddSection }
        ]
      : [
          { label: 'Edit', icon: <PencilSquareIcon className="w-4 h-4" />, onClick: handleEdit }
        ])
  ];
  
  // Determine node style based on drag and drop state
  const nodeStyle = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver && canDrop ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    borderColor: isOver && canDrop ? 'rgb(59, 130, 246)' : 'transparent',
    paddingLeft: `${depth * 1.5}rem`,
    cursor: 'pointer',
  };
  
  return (
    <div>
      <div 
        ref={dragDropRef}
        className={`flex items-center py-2 px-2 rounded-md border hover:bg-gray-100 dark:hover:bg-gray-800 ${
          isOver && canDrop ? 'border-blue-500' : 'border-transparent'
        }`}
        style={nodeStyle}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        onContextMenu={handleContextMenu}
      >
        {/* Icon based on item type */}
        {isSection ? (
          isOpen ? (
            <ChevronDownIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRightIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          )
        ) : (
          <DocumentTextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
        )}
        
        {/* Item title */}
        <span className="flex-grow truncate">{item.title}</span>
        
        {/* Action buttons */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100">
          <button 
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
            title="Rename"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          <button 
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            title="Delete"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
          
          {isSection && (
            <button 
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                handleAddPage();
              }}
              title="Add Page"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems}
          onClose={handleCloseContextMenu}
        />
      )}
      
      {/* Children */}
      {isOpen && hasChildren && (
        <div className="pl-4 border-l border-gray-200 dark:border-gray-700 ml-2">
          {item.children?.map((child) => (
            <ContentNode
              key={child.path}
              item={child}
              depth={depth + 1}
              onMove={onMove}
              onRename={onRename}
              onDelete={onDelete}
              onAddPage={onAddPage}
              onAddSection={onAddSection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ContentExplorerProps {
  structure: ContentItem[];
  onRefresh: () => void;
  onMove: (source: ContentItem, targetPath: string) => Promise<void>;
  onRename: (item: ContentItem, newName: string) => Promise<void>;
  onDelete: (item: ContentItem) => Promise<void>;
  onAddPage: (parentPath: string) => void;
  onAddSection: (parentPath: string) => void;
}

/**
 * Content Explorer component
 */
export const ContentExplorer: React.FC<ContentExplorerProps> = ({
  structure,
  onRefresh,
  onMove,
  onRename,
  onDelete,
  onAddPage,
  onAddSection
}) => {
  const handleMove = useCallback((source: ContentItem, targetPath: string) => {
    onMove(source, targetPath);
  }, [onMove]);
  
  const handleRename = useCallback((item: ContentItem, newName: string) => {
    onRename(item, newName);
  }, [onRename]);
  
  const handleDelete = useCallback((item: ContentItem) => {
    onDelete(item);
  }, [onDelete]);
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Content Explorer</h2>
        <button
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onRefresh}
          title="Refresh"
        >
          <ArrowPathIcon className="w-5 h-5" />
        </button>
      </div>
      
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {structure.map((item) => (
            <ContentNode
              key={item.path}
              item={item}
              depth={0}
              onMove={handleMove}
              onRename={handleRename}
              onDelete={handleDelete}
              onAddPage={onAddPage}
              onAddSection={onAddSection}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  );
};
