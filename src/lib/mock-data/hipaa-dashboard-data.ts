/**
 * Mock data for HIPAA Dashboard
 * 
 * This file provides structured data for the HIPAA compliance dashboard,
 * including compliance status for different categories and upcoming reviews.
 * 
 * #tags: hipaa, dashboard, mock-data
 */

import { ComplianceStatus, ReviewItem } from '@/components/hipaa/HipaaDashboard';

// HIPAA compliance status by category
export const complianceStatusData: ComplianceStatus[] = [
  {
    category: 'technical',
    status: 'at-risk',
    lastReviewed: '2025-02-15',
    nextReview: '2025-05-15',
    progress: 38,
    items: {
      total: 8,
      completed: 3
    }
  },
  {
    category: 'administrative',
    status: 'non-compliant',
    lastReviewed: '2025-02-10',
    nextReview: '2025-03-25',
    progress: 0,
    items: {
      total: 8,
      completed: 0
    }
  },
  {
    category: 'physical',
    status: 'non-compliant',
    lastReviewed: '2025-02-05',
    nextReview: '2025-05-05',
    progress: 0,
    items: {
      total: 6,
      completed: 0
    }
  },
  {
    category: 'llm',
    status: 'non-compliant',
    lastReviewed: '2025-01-25',
    nextReview: '2025-03-15',
    progress: 0,
    items: {
      total: 8,
      completed: 0
    }
  },
  {
    category: 'ccm',
    status: 'non-compliant',
    lastReviewed: '2025-02-12',
    nextReview: '2025-03-20',
    progress: 0,
    items: {
      total: 6,
      completed: 0
    }
  }
];

// Upcoming HIPAA compliance reviews
export const upcomingReviewsData: ReviewItem[] = [
  {
    id: 'review-1',
    title: 'LLM Implementation Security Review',
    dueDate: '2025-03-15',
    category: 'technical',
    priority: 'high',
    assignedTo: 'Security Officer'
  },
  {
    id: 'review-2',
    title: 'Administrative Safeguards Gap Assessment',
    dueDate: '2025-03-25',
    category: 'administrative',
    priority: 'high',
    assignedTo: 'Compliance Manager'
  },
  {
    id: 'review-3',
    title: 'CCM Requirements Compliance Update',
    dueDate: '2025-03-20',
    category: 'ccm',
    priority: 'medium',
    assignedTo: 'CCM Program Manager'
  },
  {
    id: 'review-4',
    title: 'Quarterly Business Associate Agreement Review',
    dueDate: '2025-04-01',
    category: 'administrative',
    priority: 'medium',
    assignedTo: 'Compliance Manager'
  },
  {
    id: 'review-5',
    title: 'Security Awareness Training Update',
    dueDate: '2025-04-15',
    category: 'administrative',
    priority: 'medium',
    assignedTo: 'Training Coordinator'
  }
];

// Last updated timestamp
export const lastUpdatedTimestamp = '2025-03-13';

// Get a filtered list of compliance statuses by category
export function getComplianceByCategory(categories: string[]): ComplianceStatus[] {
  return complianceStatusData.filter(status => 
    categories.includes(status.category)
  );
}

// Get a filtered list of upcoming reviews by priority
export function getUpcomingReviewsByPriority(priority: 'high' | 'medium' | 'low'): ReviewItem[] {
  return upcomingReviewsData.filter(review => 
    review.priority === priority
  );
}

// Get the overall compliance percentage
export function getOverallCompliancePercentage(): number {
  const totalItems = complianceStatusData.reduce((sum, status) => sum + status.items.total, 0);
  const completedItems = complianceStatusData.reduce((sum, status) => sum + status.items.completed, 0);
  
  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
}

// Get compliance status by status type
export function getComplianceByStatus(status: 'compliant' | 'at-risk' | 'non-compliant' | 'pending-review'): ComplianceStatus[] {
  return complianceStatusData.filter(item => 
    item.status === status
  );
}
