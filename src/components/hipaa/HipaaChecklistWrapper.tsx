"use client";

/**
 * Client-side wrapper for the HipaaChecklist component
 * 
 * Adds interactivity to the checklist items and provides state management
 * for updating completion status.
 * 
 * #tags: hipaa, checklist, client-component
 */
import React, { useState, useEffect, useCallback } from 'react';
import { HipaaChecklist, ChecklistCategory, ChecklistItem } from './HipaaChecklist';

export interface HipaaChecklistWrapperProps {
  title: string;
  description?: string;
  initialCategories: ChecklistCategory[];
  lastUpdated?: string;
  onSave?: (categories: ChecklistCategory[]) => void;
}

export function HipaaChecklistWrapper({
  title,
  description,
  initialCategories,
  lastUpdated,
  onSave
}: HipaaChecklistWrapperProps) {
  // State to track the checklist categories and items
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialCategories);
  
  // Update categories when initialCategories changes
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);
  
  // Handle toggling a checklist item with useCallback to prevent infinite loops
  const handleItemToggle = useCallback((itemId: string, completed: boolean) => {
    setCategories(prevCategories => {
      const updatedCategories = prevCategories.map(category => {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        
        return {
          ...category,
          items: updatedItems
        };
      });
      
      if (onSave) {
        onSave(updatedCategories);
      }
      
      return updatedCategories;
    });
  }, [onSave]);
  
  // Handle click events on checklist items
  const handleClick = (event: React.MouseEvent) => {
    // Find the closest checkbox element
    const target = event.target as HTMLElement;
    const checkbox = target.closest('[role="checkbox"]');
    
    if (checkbox) {
      const itemId = checkbox.getAttribute('data-item-id');
      const isCompleted = checkbox.getAttribute('data-is-completed') === 'true';
      
      if (itemId) {
        handleItemToggle(itemId, isCompleted);
      }
    }
  };
  
  return (
    <div onClick={handleClick}>
      <HipaaChecklist
        title={title}
        description={description}
        categories={categories}
        lastUpdated={lastUpdated}
      />
      
      {/* Action buttons */}
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onSave && onSave(categories)}
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}