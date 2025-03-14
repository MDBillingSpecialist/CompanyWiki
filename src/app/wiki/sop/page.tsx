"use client";

import React from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';

export default function SopPage() {
  const staticContent = `
# Standard Operating Procedures

## Overview

Standard Operating Procedures (SOPs) are documented, step-by-step instructions that describe how to perform a routine activity. SOPs help maintain quality control, ensure compliance with industry regulations, and reduce miscommunication.

This section contains our organization's official SOPs across different departments and functions.

## Engineering SOPs

These procedures govern our software development, deployment, and maintenance processes.

- [Deployment Process](/wiki/sop/engineering/deployment)
- [Code Review Standards](/wiki/sop/engineering/code-review)
- [Incident Management](/wiki/sop/engineering/incident-management)
- [Testing Protocols](/wiki/sop/engineering/testing-protocols)
- [Database Management](/wiki/sop/engineering/database-management)

## Compliance SOPs

These procedures ensure we maintain regulatory compliance in all operations.

- [Incident Response](/wiki/sop/compliance/incident-response)
- [Audit Procedures](/wiki/sop/compliance/audit-procedures)
- [Risk Assessment](/wiki/sop/compliance/risk-assessment)
- [Security Monitoring](/wiki/sop/compliance/security-monitoring)
- [Training Requirements](/wiki/sop/compliance/training-requirements)

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

To propose a new SOP or update an existing one, please contact the relevant department head or the Compliance Officer.
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
          Last updated: March 13, 2025
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
