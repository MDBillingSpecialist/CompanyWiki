"use client";

/**
 * Management Mode Toggle Component
 * 
 * A toggle switch that enables/disables the wiki management mode.
 * When management mode is active, additional UI components for content management are displayed.
 * 
 * #tags: management ui toggle
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

// Management mode context
interface WikiManagementContextType {
  isManagementMode: boolean;
  setManagementMode: (mode: boolean) => void;
  canEdit: boolean;
}

const WikiManagementContext = createContext<WikiManagementContextType>({
  isManagementMode: false,
  setManagementMode: () => {},
  canEdit: true
});

// Hook to use the management mode context
export const useWikiManagement = () => useContext(WikiManagementContext);

interface WikiManagementProviderProps {
  children: ReactNode;
}

// Provider component for management mode
export const WikiManagementProvider: React.FC<WikiManagementProviderProps> = ({ children }) => {
  const [isManagementMode, setManagementMode] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(true); // In a real app, this would be based on user permissions
  
  // Load preference from localStorage on mount
  useEffect(() => {
    const savedPreference = localStorage.getItem('wikiManagementMode');
    if (savedPreference === 'true') {
      setManagementMode(true);
    }
  }, []);
  
  // Save preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('wikiManagementMode', isManagementMode.toString());
  }, [isManagementMode]);
  
  // Handle keyboard shortcut (Ctrl+M) to toggle management mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        setManagementMode(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <WikiManagementContext.Provider value={{ isManagementMode, setManagementMode, canEdit }}>
      {children}
    </WikiManagementContext.Provider>
  );
};

// Toggle switch component
export const ManagementModeToggle: React.FC = () => {
  const { isManagementMode, setManagementMode, canEdit } = useWikiManagement();
  
  if (!canEdit) return null; // Don't show the toggle if the user can't edit
  
  return (
    <div className="flex items-center space-x-2">
      <button
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isManagementMode
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={() => setManagementMode(!isManagementMode)}
        title={`${isManagementMode ? 'Disable' : 'Enable'} Management Mode (Ctrl+M)`}
      >
        <Cog6ToothIcon className={`w-5 h-5 ${isManagementMode ? 'animate-spin-slow' : ''}`} />
        <span className="text-sm font-medium">
          {isManagementMode ? 'Exit Management Mode' : 'Manage Wiki'}
        </span>
      </button>
    </div>
  );
};
