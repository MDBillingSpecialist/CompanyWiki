"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChecklistCategory, ChecklistItem } from '@/components/hipaa/HipaaChecklist';
import { ComplianceStatus, ReviewItem } from '@/components/hipaa/HipaaDashboard';
import { hipaaChecklistCategories } from '@/lib/mock-data/hipaa-checklist-data';
import { upcomingReviewsData, lastUpdatedTimestamp } from '@/lib/mock-data/hipaa-dashboard-data';

// Define the context shape
interface HipaaComplianceContextType {
  checklistCategories: ChecklistCategory[];
  complianceStatus: ComplianceStatus[];
  upcomingReviews: ReviewItem[];
  lastUpdated: string;
  updateChecklistItem: (itemId: string, completed: boolean) => void;
}

// Create the context with a default value
const HipaaComplianceContext = createContext<HipaaComplianceContextType | undefined>(undefined);

// Storage key for localStorage
const STORAGE_KEY = 'hipaa-compliance-data';

// Calculate compliance status based on checklist data
function calculateComplianceStatus(categories: ChecklistCategory[]): ComplianceStatus[] {
  return [
    {
      category: 'technical',
      status: getStatusFromItems(categories.find(c => c.id === 'technical-security')?.items || []),
      lastReviewed: '2025-02-15',
      nextReview: '2025-05-15',
      progress: getProgressFromItems(categories.find(c => c.id === 'technical-security')?.items || []),
      items: getItemCountsFromItems(categories.find(c => c.id === 'technical-security')?.items || [])
    },
    {
      category: 'administrative',
      status: getStatusFromItems(categories.find(c => c.id === 'administrative')?.items || []),
      lastReviewed: '2025-02-10',
      nextReview: '2025-03-25',
      progress: getProgressFromItems(categories.find(c => c.id === 'administrative')?.items || []),
      items: getItemCountsFromItems(categories.find(c => c.id === 'administrative')?.items || [])
    },
    {
      category: 'physical',
      status: getStatusFromItems(categories.find(c => c.id === 'physical')?.items || []),
      lastReviewed: '2025-02-05',
      nextReview: '2025-05-05',
      progress: getProgressFromItems(categories.find(c => c.id === 'physical')?.items || []),
      items: getItemCountsFromItems(categories.find(c => c.id === 'physical')?.items || [])
    },
    {
      category: 'llm',
      status: getStatusFromItems(categories.find(c => c.id === 'llm')?.items || []),
      lastReviewed: '2025-01-25',
      nextReview: '2025-03-15',
      progress: getProgressFromItems(categories.find(c => c.id === 'llm')?.items || []),
      items: getItemCountsFromItems(categories.find(c => c.id === 'llm')?.items || [])
    },
    {
      category: 'ccm',
      status: getStatusFromItems(categories.find(c => c.id === 'ccm')?.items || []),
      lastReviewed: '2025-02-12',
      nextReview: '2025-03-20',
      progress: getProgressFromItems(categories.find(c => c.id === 'ccm')?.items || []),
      items: getItemCountsFromItems(categories.find(c => c.id === 'ccm')?.items || [])
    }
  ];
}

// Helper functions to calculate status, progress, and item counts
function getStatusFromItems(items: ChecklistItem[]): 'compliant' | 'at-risk' | 'non-compliant' | 'pending-review' {
  if (items.length === 0) return 'pending-review';
  
  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const completionPercentage = (completedCount / totalCount) * 100;
  
  if (completionPercentage === 100) return 'compliant';
  if (completionPercentage >= 70) return 'at-risk';
  return 'non-compliant';
}

function getProgressFromItems(items: ChecklistItem[]): number {
  if (items.length === 0) return 0;
  
  const completedCount = items.filter(item => item.completed).length;
  return Math.round((completedCount / items.length) * 100);
}

function getItemCountsFromItems(items: ChecklistItem[]): { total: number; completed: number } {
  return {
    total: items.length,
    completed: items.filter(item => item.completed).length
  };
}

// Load data from localStorage
function loadFromStorage(): ChecklistCategory[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  
  return null;
}

// Save data to localStorage
function saveToStorage(categories: ChecklistCategory[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
}

// Provider component
export function HipaaComplianceProvider({ children }: { children: ReactNode }) {
  // Initialize state with data from localStorage or default data
  const [checklistCategories, setChecklistCategories] = useState<ChecklistCategory[]>(hipaaChecklistCategories);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(lastUpdatedTimestamp);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const storedCategories = loadFromStorage();
    if (storedCategories) {
      setChecklistCategories(storedCategories);
    }
  }, []);
  
  // Update compliance status whenever checklist categories change
  useEffect(() => {
    setComplianceStatus(calculateComplianceStatus(checklistCategories));
  }, [checklistCategories]);
  
  // Function to update a checklist item
  const updateChecklistItem = (itemId: string, completed: boolean) => {
    setChecklistCategories(prevCategories => {
      const newCategories = prevCategories.map(category => {
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
      
      // Update the last updated timestamp
      const newTimestamp = new Date().toISOString().split('T')[0];
      setLastUpdated(newTimestamp);
      
      // Save to localStorage
      saveToStorage(newCategories);
      
      return newCategories;
    });
  };
  
  return (
    <HipaaComplianceContext.Provider
      value={{
        checklistCategories,
        complianceStatus,
        upcomingReviews: upcomingReviewsData,
        lastUpdated,
        updateChecklistItem
      }}
    >
      {children}
    </HipaaComplianceContext.Provider>
  );
}

// Hook to use the context
export function useHipaaCompliance() {
  const context = useContext(HipaaComplianceContext);
  
  if (context === undefined) {
    throw new Error('useHipaaCompliance must be used within a HipaaComplianceProvider');
  }
  
  return context;
}
