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
import { ChecklistCategory } from '@/components/hipaa/HipaaChecklist';
import { useSearchParams } from 'next/navigation';
import { hipaaChecklistCategories, getChecklistCategory } from '@/lib/mock-data/hipaa-checklist-data';
import { useEffect as useEffectKey } from 'react';

// Technical Security safeguards checklist data
const technicalSecurityChecklist: ChecklistCategory[] = [
  {
    id: 'access-control',
    name: 'Access Control',
    description: 'Technical policies and procedures for electronic information systems that maintain ePHI.',
    items: [
      {
        id: 'unique-user-id',
        category: 'access-control',
        label: 'Unique user identification for all system users',
        description: 'Assign a unique name and/or number for identifying and tracking user identity.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'emergency-access',
        category: 'access-control',
        label: 'Emergency access procedure',
        description: 'Establish procedures for obtaining necessary ePHI during an emergency.',
        completed: false,
        priority: 'high',
      },
      {
        id: 'auto-logoff',
        category: 'access-control',
        label: 'Automatic logoff implemented',
        description: 'Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.',
        completed: false,
        priority: 'medium',
      },
      {
        id: 'encryption-decryption',
        category: 'access-control',
        label: 'Encryption and decryption',
        description: 'Implement a mechanism to encrypt and decrypt ePHI.',
        completed: true,
        priority: 'high',
      },
    ],
  },
  {
    id: 'audit-controls',
    name: 'Audit Controls',
    description: 'Hardware, software, and/or procedural mechanisms that record and examine activity in information systems.',
    items: [
      {
        id: 'activity-logs',
        category: 'audit-controls',
        label: 'System activity logs implemented',
        description: 'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use ePHI.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'audit-review',
        category: 'audit-controls',
        label: 'Regular audit log review procedure',
        description: 'Establish procedures for regularly reviewing records of information system activity.',
        completed: true,
        priority: 'medium',
      },
      {
        id: 'audit-retention',
        category: 'audit-controls',
        label: 'Audit log retention policy',
        description: 'Establish policies for audit log retention that comply with regulatory requirements.',
        completed: false,
        priority: 'medium',
      },
    ],
  },
  {
    id: 'integrity',
    name: 'Integrity',
    description: 'Policies and procedures to protect ePHI from improper alteration or destruction.',
    items: [
      {
        id: 'integrity-controls',
        category: 'integrity',
        label: 'Data integrity controls implemented',
        description: 'Implement electronic mechanisms to corroborate that ePHI has not been altered or destroyed in an unauthorized manner.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'data-validation',
        category: 'integrity',
        label: 'Data validation procedures',
        description: 'Implement procedures to verify the integrity of ePHI during storage and transmission.',
        completed: false,
        priority: 'medium',
      },
    ],
  },
  {
    id: 'transmission',
    name: 'Transmission Security',
    description: 'Technical security measures to guard against unauthorized access to ePHI being transmitted over a network.',
    items: [
      {
        id: 'transmission-encryption',
        category: 'transmission',
        label: 'Encryption for transmission',
        description: 'Implement a mechanism to encrypt ePHI whenever deemed appropriate.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'integrity-checks',
        category: 'transmission',
        label: 'Integrity controls for transmission',
        description: 'Implement security measures to ensure that electronically transmitted ePHI is not improperly modified.',
        completed: false,
        priority: 'high',
      },
      {
        id: 'transmission-monitoring',
        category: 'transmission',
        label: 'Transmission monitoring',
        description: 'Implement procedures to monitor and log all transmissions of ePHI.',
        completed: false,
        priority: 'medium',
      },
    ],
  },
];

// Administrative safeguards checklist data
const administrativeChecklist: ChecklistCategory[] = [
  {
    id: 'risk-analysis',
    name: 'Risk Analysis',
    description: 'Conduct an accurate and thorough assessment of potential risks and vulnerabilities.',
    items: [
      {
        id: 'risk-assessment',
        category: 'risk-analysis',
        label: 'Conduct risk assessment',
        description: 'Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'risk-management',
        category: 'risk-analysis',
        label: 'Implement risk management program',
        description: 'Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level.',
        completed: false,
        priority: 'high',
      },
      {
        id: 'sanction-policy',
        category: 'risk-analysis',
        label: 'Sanction policy',
        description: 'Apply appropriate sanctions against workforce members who fail to comply with security policies and procedures.',
        completed: true,
        priority: 'medium',
      },
      {
        id: 'review-procedures',
        category: 'risk-analysis',
        label: 'Information system activity review',
        description: 'Implement procedures to regularly review records of information system activity.',
        completed: false,
        priority: 'medium',
      },
    ],
  },
  {
    id: 'assigned-security',
    name: 'Assigned Security Responsibility',
    description: 'Identify the security official responsible for HIPAA Security compliance.',
    items: [
      {
        id: 'security-officer',
        category: 'assigned-security',
        label: 'Designate security official',
        description: 'Identify the security official who is responsible for the development and implementation of the security policies and procedures.',
        completed: true,
        priority: 'high',
      },
      {
        id: 'role-documentation',
        category: 'assigned-security',
        label: 'Document roles and responsibilities',
        description: 'Clearly document the security official\'s roles and responsibilities.',
        completed: true,
        priority: 'medium',
      },
    ],
  },
  {
    id: 'workforce-security',
    name: 'Workforce Security',
    description: 'Ensure that workforce members have appropriate access to ePHI.',
    items: [
      {
        id: 'authorization',
        category: 'workforce-security',
        label: 'Authorization procedures',
        description: 'Implement procedures for the authorization and/or supervision of workforce members who work with ePHI.',
        completed: false,
        priority: 'high',
      },
      {
        id: 'workforce-clearance',
        category: 'workforce-security',
        label: 'Workforce clearance procedure',
        description: 'Implement procedures to determine that the access of a workforce member to ePHI is appropriate.',
        completed: true,
        priority: 'medium',
      },
      {
        id: 'termination-procedures',
        category: 'workforce-security',
        label: 'Termination procedures',
        description: 'Implement procedures for terminating access to ePHI when employment ends.',
        completed: false,
        priority: 'high',
      },
    ],
  },
];

// Map of category filter to checklist data
const checklistData: Record<string, { title: string, description: string, categories: ChecklistCategory[] }> = {
  'technical': {
    title: 'Technical Security Safeguards Checklist',
    description: 'Verify implementation of technical security safeguards for ePHI.',
    categories: [hipaaChecklistCategories[0]],
  },
  'administrative': {
    title: 'Administrative Safeguards Checklist',
    description: 'Verify implementation of administrative security safeguards for ePHI.',
    categories: [hipaaChecklistCategories[1]],
  },
  'llm': {
    title: 'LLM and AI Safeguards Checklist',
    description: 'Verify implementation of safeguards for using LLMs and AI with PHI.',
    categories: [hipaaChecklistCategories[3]],
  },
  'ccm': {
    title: 'CCM Specific Requirements Checklist',
    description: 'Verify implementation of HIPAA safeguards for CCM services.',
    categories: [hipaaChecklistCategories[4]],
  },
  'all': {
    title: 'All HIPAA Safeguards Checklist',
    description: 'Comprehensive checklist for all HIPAA security safeguards.',
    categories: hipaaChecklistCategories,
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
      } else if (lcCategory.includes('admin') ||
                lcCategory.includes('physical')) {
        setSelectedCategory('administrative');
      } else if (lcCategory.includes('llm') ||
                lcCategory.includes('ai')) {
        setSelectedCategory('llm');
      } else if (lcCategory.includes('ccm') ||
                lcCategory.includes('chronic')) {
        setSelectedCategory('ccm');
      }
    }
  }, [searchParams]);
  
  // Handle saving checklist progress
  const handleSaveChecklist = (categories: ChecklistCategory[]) => {
    console.log('Saving checklist:', categories);
    // In a real app, this would save to a database or localStorage
    alert('Checklist progress saved!');
  };
  
  // Force re-rendering when category changes to ensure the component is refreshed
  const [resetKey, setResetKey] = useState(0);
  useEffectKey(() => {
    setResetKey(prev => prev + 1);
  }, [selectedCategory]);
  
  return (
    <WikiLayout>
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
        <div key={resetKey}>
          <HipaaChecklistWrapper
            title={checklistData[selectedCategory].title}
            description={checklistData[selectedCategory].description}
            initialCategories={checklistData[selectedCategory].categories}
            lastUpdated="March 13, 2025"
            onSave={handleSaveChecklist}
          />
        </div>
      </div>
    </WikiLayout>
  );
}