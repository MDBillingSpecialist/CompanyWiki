import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Breadcrumb } from '../navigation/Breadcrumb';
import { SearchBar } from '../search/SearchBar';

type WikiLayoutProps = {
  children: React.ReactNode;
};

export const WikiLayout = ({ children }: WikiLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 h-screen flex flex-col overflow-auto">
        {/* Header with Breadcrumb and Search */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3">
            <Breadcrumb />
            <div className="mt-3 md:mt-0">
              <SearchBar />
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear().toString()} Company Wiki • HIPAA Compliant
          </div>
        </footer>
      </div>
    </div>
  );
};
