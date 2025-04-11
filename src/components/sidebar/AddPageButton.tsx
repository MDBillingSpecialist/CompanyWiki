"use client";

/**
 * Add Page Button Component
 * 
 * A button component that appears next to section headers in the sidebar
 * allowing users to quickly add new pages to that section.
 * 
 * #tags: sidebar navigation add-page
 */
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface AddPageButtonProps {
  section: string;
  sectionPath: string;
}

export const AddPageButton: React.FC<AddPageButtonProps> = ({ section, sectionPath }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleAddPage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click events
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreatePage = (templateType: 'basic' | 'markdown' | 'ai-generated') => {
    // Navigate to the page creation form with the appropriate parameters
    router.push(`/wiki/create?section=${encodeURIComponent(sectionPath)}&template=${templateType}`);
    closeModal();
  };

  return (
    <>
      <button
        onClick={handleAddPage}
        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 ml-1"
        title={`Add page to ${section}`}
        aria-label={`Add page to ${section}`}
      >
        <PlusIcon className="w-4 h-4" />
      </button>

      {/* Modal for template selection */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Add page to {section}
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => handleCreatePage('basic')}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">Basic Template</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Start with a simple template with title, description, and basic structure.
                </p>
              </button>
              
              <button
                onClick={() => handleCreatePage('markdown')}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">Markdown Editor</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create content directly using the markdown editor.
                </p>
              </button>
              
              <button
                onClick={() => handleCreatePage('ai-generated')}
                className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">AI-Generated Documentation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generate API documentation automatically using AI tools.
                </p>
              </button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
