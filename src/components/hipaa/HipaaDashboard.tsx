"use client";

/**
 * HIPAA Dashboard Component
 * 
 * Provides a visual overview of HIPAA compliance status
 * including progress cards, upcoming reviews, and status indicators.
 * 
 * #tags: hipaa, dashboard, compliance
 */
import React from 'react';
import { useHipaaCompliance } from '@/lib/hooks/useHipaaComplianceContext';

export interface ComplianceStatus {
  category: string;
  status: 'compliant' | 'at-risk' | 'non-compliant' | 'pending-review';
  lastReviewed?: string;
  nextReview?: string;
  progress: number;
  items: {
    total: number;
    completed: number;
  };
}

export interface ReviewItem {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export function HipaaDashboard() {
  // Use the shared HIPAA compliance context
  const { complianceStatus, upcomingReviews, lastUpdated } = useHipaaCompliance();
  // Calculate overall compliance
  const totalCategories = complianceStatus.length;
  const compliantCategories = complianceStatus.filter(
    status => status.status === 'compliant'
  ).length;
  
  const overallCompliancePercentage = totalCategories > 0 
    ? Math.round((compliantCategories / totalCategories) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Overall status card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            HIPAA Compliance Dashboard
          </h2>
          
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Overall Compliance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {compliantCategories} of {totalCategories} categories compliant
              </p>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {overallCompliancePercentage}%
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div 
              className={`h-2.5 rounded-full ${
                overallCompliancePercentage < 50 ? 'bg-red-500' : 
                overallCompliancePercentage < 80 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${overallCompliancePercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-end">
            <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Compliance status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complianceStatus.map((status) => (
          <div 
            key={status.category} 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {status.category === 'technical' ? 'Technical Security' :
                   status.category === 'administrative' ? 'Administrative Safeguards' :
                   status.category === 'physical' ? 'Physical Safeguards' :
                   status.category === 'llm' ? 'LLM Implementation' :
                   status.category === 'ccm' ? 'CCM Requirements' :
                   status.category}
                </h3>
                
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${status.status === 'compliant' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : status.status === 'at-risk' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                      : status.status === 'non-compliant' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}
                >
                  {status.status === 'compliant' 
                    ? 'Compliant' 
                    : status.status === 'at-risk' 
                    ? 'At Risk' 
                    : status.status === 'non-compliant' 
                    ? 'Non-Compliant'
                    : 'Pending Review'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div>
                  {status.items.completed} of {status.items.total} items
                </div>
                <div>{status.progress}% complete</div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                <div 
                  className={`h-1.5 rounded-full ${
                    status.status === 'compliant' 
                      ? 'bg-green-500' 
                      : status.status === 'at-risk' 
                      ? 'bg-yellow-500' 
                      : status.status === 'non-compliant' 
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
              
              {/* Review dates */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                {status.lastReviewed && (
                  <div>
                    <span className="font-medium">Last reviewed:</span> {status.lastReviewed}
                  </div>
                )}
                
                {status.nextReview && (
                  <div>
                    <span className="font-medium">Next review:</span> {status.nextReview}
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <a 
                href={`/wiki/hipaa/checklists?category=${encodeURIComponent(status.category)}`} 
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View Checklist →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Upcoming reviews */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Reviews
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {upcomingReviews.length > 0 ? (
            upcomingReviews.map((review) => (
              <div key={review.id} className="px-6 py-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                      {review.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Due:</span> {review.dueDate}
                      </div>
                      
                      <div>
                        <span className="font-medium">Category:</span> {
                          review.category === 'technical' ? 'Technical Security' :
                          review.category === 'administrative' ? 'Administrative Safeguards' :
                          review.category === 'physical' ? 'Physical Safeguards' :
                          review.category === 'llm' ? 'LLM Implementation' :
                          review.category === 'ccm' ? 'CCM Requirements' :
                          review.category
                        }
                      </div>
                      
                      {review.assignedTo && (
                        <div>
                          <span className="font-medium">Assigned to:</span> {review.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium
                        ${review.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : review.priority === 'medium' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                    >
                      {review.priority.charAt(0).toUpperCase() + review.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
              No upcoming reviews scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
