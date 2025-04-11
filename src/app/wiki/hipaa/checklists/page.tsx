"use client";

/**
 * HIPAA Checklists Page
 * 
 * Displays interactive HIPAA compliance checklists with completion tracking.
 * 
 * #tags: hipaa, checklists, compliance
 */
import { useState, useEffect } from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';
import { HipaaChecklistWrapper } from '@/components/hipaa/HipaaChecklistWrapper';
import { useSearchParams } from 'next/navigation';
import { HipaaComplianceProvider } from '@/lib/hooks/useHipaaComplianceContext';

// Map of category filter to checklist data
const checklistData: Record<string, { title: string, description: string }> = {
  'technical': {
    title: 'Technical Security Safeguards Checklist',
    description: 'Verify implementation of technical security safeguards for ePHI.',
  },
  'administrative': {
    title: 'Administrative Safeguards Checklist',
    description: 'Verify implementation of administrative security safeguards for ePHI.',
  },
  'physical': {
    title: 'Physical Safeguards Checklist',
    description: 'Verify implementation of physical security safeguards for ePHI.',
  },
  'llm': {
    title: 'LLM and AI Safeguards Checklist',
    description: 'Verify implementation of safeguards for using LLMs and AI with PHI.',
  },
  'ccm': {
    title: 'CCM Specific Requirements Checklist',
    description: 'Verify implementation of HIPAA safeguards for CCM services.',
  },
  'all': {
    title: 'All HIPAA Safeguards Checklist',
    description: 'Comprehensive checklist for all HIPAA security safeguards.',
  },
};

export default function HipaaChecklistsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('technical');
  
  useEffect(() => {
    // Get the category from the URL query parameters
    const categoryParam = searchParams.get('category');
    
    if (categoryParam) {
      const lcCategory = categoryParam.toLowerCase();
      // First try direct matching with category IDs
      if (Object.keys(checklistData).includes(lcCategory)) {
        setSelectedCategory(lcCategory);
      } 
      // Then try term mapping for more flexibility
      else if (lcCategory.includes('technical') || 
          lcCategory.includes('security rule') ||
          lcCategory.includes('transmission')) {
        setSelectedCategory('technical');
      } else if (lcCategory.includes('admin')) {
        setSelectedCategory('administrative');
      } else if (lcCategory.includes('physical')) {
        setSelectedCategory('physical');
      } else if (lcCategory.includes('llm') ||
                lcCategory.includes('ai')) {
        setSelectedCategory('llm');
      } else if (lcCategory.includes('ccm') ||
                lcCategory.includes('chronic')) {
        setSelectedCategory('ccm');
      }
    }
  }, [searchParams]);
  
  return (
    <WikiLayout>
      <HipaaComplianceProvider>
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              HIPAA Compliance Checklists
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Interactive checklists to verify and track HIPAA compliance implementation
            </p>
          </div>
          
          {/* Category filter buttons */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('technical')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'technical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Technical Safeguards
              </button>
              <button
                onClick={() => setSelectedCategory('administrative')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'administrative'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Administrative Safeguards
              </button>
              <button
                onClick={() => setSelectedCategory('physical')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'physical'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Physical Safeguards
              </button>
              <button
                onClick={() => setSelectedCategory('llm')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'llm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                LLM Safeguards
              </button>
              <button
                onClick={() => setSelectedCategory('ccm')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'ccm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                CCM Requirements
              </button>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All Safeguards
              </button>
            </div>
          </div>
          
          {/* Render the selected checklist */}
          <HipaaChecklistWrapper
            title={checklistData[selectedCategory].title}
            description={checklistData[selectedCategory].description}
            selectedCategory={selectedCategory}
          />
        </div>
      </HipaaComplianceProvider>
    </WikiLayout>
  );
}
