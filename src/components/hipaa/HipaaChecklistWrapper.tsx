"use client";

/**
 * Client-side wrapper for the HipaaChecklist component
 * 
 * Adds interactivity to the checklist items and provides state management
 * for updating completion status.
 * 
 * #tags: hipaa, checklist, client-component
 */
import React, { useCallback } from 'react';
import { HipaaChecklist, ChecklistCategory } from './HipaaChecklist';
import { useHipaaCompliance } from '@/lib/hooks/useHipaaComplianceContext';

export interface HipaaChecklistWrapperProps {
  title: string;
  description?: string;
  selectedCategory: string;
}

export function HipaaChecklistWrapper({
  title,
  description,
  selectedCategory
}: HipaaChecklistWrapperProps) {
  // Use the shared HIPAA compliance context
  const { checklistCategories, lastUpdated, updateChecklistItem } = useHipaaCompliance();
  
  // Filter categories based on the selected category
  const filteredCategories = selectedCategory === 'all' 
    ? checklistCategories 
    : checklistCategories.filter(category => {
        if (selectedCategory === 'technical' && category.id === 'technical-security') return true;
        if (selectedCategory === 'administrative' && category.id === 'administrative') return true;
        if (selectedCategory === 'physical' && category.id === 'physical') return true;
        if (selectedCategory === 'llm' && category.id === 'llm') return true;
        if (selectedCategory === 'ccm' && category.id === 'ccm') return true;
        return false;
      });
  
  // Handle click events on checklist items
  const handleClick = useCallback((event: React.MouseEvent) => {
    // Find the closest checkbox element
    const target = event.target as HTMLElement;
    const checkbox = target.closest('[role="checkbox"]');
    
    if (checkbox) {
      const itemId = checkbox.getAttribute('data-item-id');
      const isCompleted = checkbox.getAttribute('data-is-completed') === 'true';
      
      if (itemId) {
        updateChecklistItem(itemId, isCompleted);
      }
    }
  }, [updateChecklistItem]);
  
  return (
    <div onClick={handleClick}>
      <HipaaChecklist
        title={title}
        description={description}
        categories={filteredCategories}
        lastUpdated={lastUpdated}
      />
      
      {/* Action buttons */}
      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => alert('Progress saved automatically!')}
        >
          Save Progress
        </button>
      </div>
    </div>
  );
}
