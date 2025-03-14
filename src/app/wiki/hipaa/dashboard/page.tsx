/**
 * HIPAA Dashboard Page
 * 
 * Displays the HIPAA compliance dashboard with status metrics and upcoming reviews.
 * 
 * #tags: hipaa, dashboard, compliance
 */
import { WikiLayout } from '@/components/layout/WikiLayout';
import { HipaaDashboard } from '@/components/hipaa/HipaaDashboard';
import { Metadata } from 'next';

// Define metadata for the page
export const metadata: Metadata = {
  title: 'HIPAA Compliance Dashboard',
  description: 'Monitor HIPAA compliance status and upcoming reviews',
};

// Import the mock data
import { complianceStatusData, upcomingReviewsData, lastUpdatedTimestamp } from '@/lib/mock-data/hipaa-dashboard-data';

export default function HipaaDashboardPage() {
  return (
    <WikiLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            HIPAA Compliance Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Monitor compliance status, track progress, and manage upcoming reviews
          </p>
        </div>
        
        <HipaaDashboard
          complianceStatus={complianceStatusData}
          upcomingReviews={upcomingReviewsData}
          lastUpdated={lastUpdatedTimestamp}
        />
      </div>
    </WikiLayout>
  );
}