/**
 * HIPAA Checklist Component
 * 
 * Server component that renders interactive checklists for HIPAA compliance verification.
 * 
 * #tags: hipaa, checklist, compliance
 */
import React from 'react';

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistCategory {
  id: string;
  name: string;
  description?: string;
  items: ChecklistItem[];
}

export interface HipaaChecklistProps {
  title: string;
  description?: string;
  categories: ChecklistCategory[];
  lastUpdated?: string;
  onItemToggle?: (itemId: string, completed: boolean) => void;
}

// Server component that renders the checklist UI
export function HipaaChecklist({ 
  title, 
  description, 
  categories, 
  lastUpdated,
  onItemToggle = () => {}
}: HipaaChecklistProps) {
  // Calculate total progress
  const totalItems = categories.reduce((acc, category) => acc + category.items.length, 0);
  const completedItems = categories.reduce(
    (acc, category) => acc + category.items.filter(item => item.completed).length, 
    0
  );
  
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg overflow-hidden">
      {/* Header section */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        
        {description && (
          <p className="mt-2 text-gray-600 dark:text-gray-300">{description}</p>
        )}
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {completedItems} of {totalItems} items completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                progressPercentage < 30 ? 'bg-red-500' : 
                progressPercentage < 70 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
      
      {/* Checklist categories */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="border-b border-gray-200 dark:border-gray-800 last:border-b-0"
          >
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              )}
            </div>
            
            {/* Category items */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {category.items.map((item) => (
                <li key={item.id} className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-start">
                    {/* Checkbox (rendered as a div for server component) */}
                    <div className="flex items-center h-5 mt-1">
                      <div 
                        className={`w-4 h-4 rounded border ${
                          item.completed 
                            ? 'bg-blue-600 border-blue-600 flex items-center justify-center' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        data-item-id={item.id}
                        data-is-completed={item.completed.toString()}
                        aria-checked={item.completed}
                        role="checkbox"
                      >
                        {item.completed && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Item content */}
                    <div className="ml-3 text-sm">
                      <div className="flex items-center">
                        <label className="font-medium text-gray-700 dark:text-gray-200">
                          {item.label}
                        </label>
                        
                        {/* Priority indicator */}
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full
                          ${item.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                          {item.priority === 'high' ? 'High' : 
                            item.priority === 'medium' ? 'Medium' : 'Low'} priority
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}