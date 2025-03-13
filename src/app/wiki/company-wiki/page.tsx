"use client";

import React from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';

export default function CompanyWikiPage() {
  const staticContent = `
# Company Wiki

## Welcome to Our Company Wiki

This is the central repository for all company-wide information and resources. Here you'll find details about our organization structure, teams, policies, and general company information.

## Company Overview

Our company is dedicated to developing healthcare software solutions with a focus on Electronic Health Records (EHR) and Chronic Care Management (CCM) systems. We are committed to maintaining the highest standards of security, privacy, and compliance in all our operations.

### Mission Statement

To transform healthcare through secure, compliant, and user-friendly software solutions that improve patient outcomes and streamline provider workflows.

### Core Values

- **Patient Privacy First**: We prioritize the protection of patient information above all else
- **Continuous Compliance**: We maintain rigorous standards that exceed regulatory requirements
- **Technical Excellence**: We develop robust, reliable, and scalable solutions
- **Collaborative Innovation**: We work together to solve complex healthcare challenges
- **Ongoing Education**: We commit to continuous learning and knowledge sharing

## Team Structure

Our organization is structured into several key departments:

- **Product Development**
  - Software Engineering
  - Quality Assurance
  - Product Management
  - UX/UI Design

- **Compliance & Security**
  - HIPAA Compliance
  - Security Operations
  - Risk Management
  - Audit & Documentation

- **Customer Success**
  - Implementation
  - Training
  - Support
  - Account Management

- **Business Operations**
  - Finance
  - Human Resources
  - Marketing
  - Legal

## Key Resources

### For New Employees

- [Onboarding Guide](/wiki/company-wiki/onboarding)
- [Company Handbook](/wiki/company-wiki/handbook)
- [IT Setup](/wiki/company-wiki/it-setup)
- [Required Training](/wiki/company-wiki/training)

### Company Policies

- [Code of Conduct](/wiki/company-wiki/policies/code-of-conduct)
- [Remote Work Policy](/wiki/company-wiki/policies/remote-work)
- [Security Policy](/wiki/company-wiki/policies/security)
- [Data Privacy Policy](/wiki/company-wiki/policies/data-privacy)

### Departments and Teams

- [Engineering Team](/wiki/company-wiki/teams/engineering)
- [Compliance Team](/wiki/company-wiki/teams/compliance)
- [Customer Success](/wiki/company-wiki/teams/customer-success)
- [Business Operations](/wiki/company-wiki/teams/business-operations)
`;

  const content = (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Company Wiki
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400">
          General company information, team structure, and organizational resources
        </p>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last updated: March 13, 2025
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {['company', 'organization', 'resources'].map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mdx-content" dangerouslySetInnerHTML={{ __html: staticContent }}></div>
    </div>
  );

  return (
    <WikiLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </article>
    </WikiLayout>
  );
}
