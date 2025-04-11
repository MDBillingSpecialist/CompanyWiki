"use client";

import React from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';
import Link from 'next/link';

export default function SopPage() {
  const staticContent = `
# Standard Operating Procedures

## Overview

Standard Operating Procedures (SOPs) are documented, step-by-step instructions that describe how to perform routine activities. SOPs help maintain quality control, ensure compliance with industry regulations, and reduce miscommunication.

This section contains our organization's official SOPs across different departments and functions.

## Engineering SOPs

These procedures govern our software development, deployment, and maintenance processes.

- [Development Practices](/wiki/sop/engineering/development-practices)
- [Deployment Process](/wiki/sop/engineering/deployment)

## Operations SOPs

These procedures cover day-to-day business operations and administrative functions.

- [Employee Onboarding](/wiki/sop/operations/employee-onboarding)
- [Support Escalation](/wiki/sop/operations/support-escalation)

## Creating and Updating SOPs

All SOPs should follow our standard format:

1. **Title and ID**: Clear identification of the procedure
2. **Purpose**: Why the procedure exists
3. **Scope**: What the procedure covers (and doesn't cover)
4. **Responsibilities**: Who performs each step
5. **Procedure**: Step-by-step instructions
6. **References**: Related documents, tools, or regulations
7. **Definitions**: Terminology used in the procedure
8. **Revision History**: Record of changes

To propose a new SOP or update an existing one, please contact the relevant department head or the Operations Director.
`;

  const content = (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Standard Operating Procedures
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Company-wide standard operating procedures and best practices
        </p>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last updated: March 21, 2024
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {['sop', 'procedures', 'standards'].map((tag) => (
            <span 
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Engineering SOPs</h2>
          <div className="space-y-2">
            <Link href="/wiki/sop/engineering/development-practices" className="block hover:underline">
              Development Practices
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Operations SOPs</h2>
          <div className="space-y-2">
            <Link href="/wiki/sop/operations/employee-onboarding" className="block hover:underline">
              Employee Onboarding
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Compliance SOPs</h2>
          <div className="space-y-2">
            <Link href="/wiki/sop/compliance/hipaa" className="block hover:underline">
              HIPAA Compliance
            </Link>
          </div>
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
