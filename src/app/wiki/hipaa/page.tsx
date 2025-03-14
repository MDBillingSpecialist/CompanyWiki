/**
 * HIPAA Wiki Page
 * 
 * Server component that displays the main HIPAA documentation hub.
 * Uses a static fallback approach to bypass MDX rendering issues.
 * 
 * #tags: hipaa, documentation, server-component
 */
import { WikiLayout } from '@/components/layout/WikiLayout';
import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Define metadata for the page
export const metadata: Metadata = {
  title: 'HIPAA Documentation',
  description: 'Comprehensive guide to HIPAA compliance for healthcare software development',
};

// Error component for displaying error messages
function ErrorMessage({ title, message }: { title: string, message: string }) {
  return (
    <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
      <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">{title}</h1>
      <p className="text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}

export default async function HipaaPage() {
  try {
    // Static fallback content (guaranteed to work)
    return (
      <WikiLayout>
        <article className="prose dark:prose-invert max-w-none">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              HIPAA Documentation
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Comprehensive guide to HIPAA compliance for healthcare software development
            </p>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Last updated: March 13, 2025
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {['hipaa', 'compliance', 'healthcare', 'security', 'privacy'].map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mdx-content markdown-content">
            <h2>Overview</h2>
            <p>
              This HIPAA Compliance Hub serves as the central resource for ensuring our organization 
              maintains strict adherence to HIPAA regulations in our healthcare software development 
              and operations. All team members are required to follow these guidelines without exception.
            </p>
            
            <h2>Interactive Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <Link 
                href="/wiki/hipaa/dashboard" 
                className="block p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Compliance Dashboard</h3>
                <p className="text-blue-700 dark:text-blue-200">Monitor compliance status, upcoming reviews, and overall implementation progress</p>
              </Link>
              <Link 
                href="/wiki/hipaa/checklists" 
                className="block p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Interactive Checklists</h3>
                <p className="text-green-700 dark:text-green-200">Track implementation progress with interactive Technical and Administrative safeguard checklists</p>
              </Link>
            </div>
            
            <h2>Key HIPAA Rules</h2>
            <p>HIPAA consists of several key rules that govern how we handle protected health information:</p>
            <ul>
              <li><strong>Privacy Rule</strong>: Establishes standards for how PHI can be used and disclosed, and gives patients rights over their health information</li>
              <li><strong>Security Rule</strong>: Requires covered entities and business associates to implement administrative, physical, and technical safeguards to ensure the confidentiality, integrity, and availability of ePHI</li>
              <li><strong>Breach Notification Rule</strong>: Mandates that if unsecured PHI is breached, individuals must be notified and, in significant cases, HHS and media as well</li>
              <li><strong>HITECH Act</strong>: Strengthened HIPAA enforcement by extending compliance obligations to business associates and increasing penalties</li>
            </ul>
            
            <h2>Quick Navigation</h2>
            <h3>Documentation</h3>
            <table className="w-full border-collapse mb-8">
              <thead>
                <tr>
                  <th className="text-left border-b p-2">Section</th>
                  <th className="text-left border-b p-2">Description</th>
                  <th className="text-left border-b p-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b p-2">
                    <Link href="/wiki/hipaa/documentation/technical-security" className="text-blue-600 hover:underline">
                      Technical Security Standards
                    </Link>
                  </td>
                  <td className="border-b p-2">Security requirements for systems handling PHI</td>
                  <td className="border-b p-2">March 13, 2025</td>
                </tr>
                <tr>
                  <td className="border-b p-2">
                    <Link href="/wiki/hipaa/documentation/access-control" className="text-blue-600 hover:underline">
                      Access Control and Authentication
                    </Link>
                  </td>
                  <td className="border-b p-2">Guidelines for identity verification and access management</td>
                  <td className="border-b p-2">March 13, 2025</td>
                </tr>
                <tr>
                  <td className="border-b p-2">
                    <Link href="/wiki/hipaa/documentation/incident-response" className="text-blue-600 hover:underline">
                      Incident Response
                    </Link>
                  </td>
                  <td className="border-b p-2">Procedures for responding to security incidents</td>
                  <td className="border-b p-2">March 13, 2025</td>
                </tr>
                <tr>
                  <td className="border-b p-2">
                    <Link href="/wiki/hipaa/documentation/ccm-specific-requirements" className="text-blue-600 hover:underline">
                      CCM-Specific Requirements
                    </Link>
                  </td>
                  <td className="border-b p-2">Special considerations for Chronic Care Management systems</td>
                  <td className="border-b p-2">March 13, 2025</td>
                </tr>
                <tr>
                  <td className="border-b p-2">
                    <Link href="/wiki/hipaa/documentation/llm-compliance" className="text-blue-600 hover:underline">
                      LLM Compliance
                    </Link>
                  </td>
                  <td className="border-b p-2">Guidelines for implementing Large Language Models in healthcare</td>
                  <td className="border-b p-2">March 13, 2025</td>
                </tr>
              </tbody>
            </table>

            <h3>Implementation Tools</h3>
            <ul>
              <li>
                <Link href="/wiki/hipaa/dashboard" className="text-blue-600 hover:underline">
                  Compliance Dashboard
                </Link> - Real-time monitoring of compliance status
              </li>
              <li>
                <Link href="/wiki/hipaa/checklists" className="text-blue-600 hover:underline">
                  Interactive Checklists
                </Link> - Step-by-step guides for implementation
              </li>
              <li>
                <Link href="/wiki/hipaa/tools/role-based-guides" className="text-blue-600 hover:underline">
                  Role-Based Guides
                </Link> - Department-specific compliance instructions
              </li>
              <li>
                <Link href="/wiki/hipaa/tools/documentation-templates" className="text-blue-600 hover:underline">
                  Documentation Templates
                </Link> - Standardized formats for compliance documentation
              </li>
            </ul>
            
          </div>
        </article>
      </WikiLayout>
    );
  } catch (error) {
    console.error('Error rendering HIPAA page:', error);
    
    return (
      <WikiLayout>
        <ErrorMessage 
          title="Error Loading Content" 
          message="There was a problem loading the HIPAA documentation content. Please try again later." 
        />
      </WikiLayout>
    );
  }
}
