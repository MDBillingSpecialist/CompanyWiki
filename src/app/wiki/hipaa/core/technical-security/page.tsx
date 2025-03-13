"use client";

import React from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';

export default function TechnicalSecurityPage() {
  const staticContent = `
# Technical Security Standards

## 1. Encryption Requirements

### 1.1 Data at Rest
- **[MANDATORY]** All PHI stored in databases must be encrypted using AES-256 encryption.
- **[MANDATORY]** Encryption keys must be stored separately from the encrypted data.
- **[RECOMMENDED]** Implement database column-level encryption for sensitive PHI fields.

### 1.2 Data in Transit
- **[MANDATORY]** All data transmission must use TLS 1.2 or higher.
- **[MANDATORY]** Implement certificate validation to prevent man-in-the-middle attacks.
- **[MANDATORY]** Disable insecure cipher suites.

## 2. Audit Logging

### 2.1 Required Audit Events
- **[MANDATORY]** Log all access to PHI, including read, write, modify, and delete operations.
- **[MANDATORY]** Log all authentication attempts (successful and failed).
- **[MANDATORY]** Log all system and security configuration changes.

### 2.2 Audit Log Content
- **[MANDATORY]** Each log entry must include: timestamp, user ID, action performed, data accessed, and source IP.
- **[MANDATORY]** Audit logs must be tamper-proof and immutable.
- **[RECOMMENDED]** Implement digital signatures for log entries.

## 3. Network Security

- **[MANDATORY]** Implement network segmentation to isolate systems containing PHI.
- **[MANDATORY]** Deploy intrusion detection and prevention systems.
- **[MANDATORY]** Conduct regular vulnerability scans and penetration testing.

## 4. Access Controls

### 4.1 Authentication
- **[MANDATORY]** Implement multi-factor authentication for all administrative access.
- **[MANDATORY]** Enforce strong password policies (complexity, expiration, history).
- **[MANDATORY]** Lock accounts after multiple failed login attempts.

### 4.2 Authorization
- **[MANDATORY]** Implement role-based access control (RBAC).
- **[MANDATORY]** Apply the principle of least privilege.
- **[MANDATORY]** Review access rights quarterly.

## 5. Endpoint Security

- **[MANDATORY]** Implement endpoint protection on all devices accessing PHI.
- **[MANDATORY]** Enforce device encryption for mobile devices.
- **[MANDATORY]** Implement remote wipe capabilities for lost or stolen devices.

## 6. Backup and Recovery

- **[MANDATORY]** Perform regular backups of all systems containing PHI.
- **[MANDATORY]** Encrypt all backups.
- **[MANDATORY]** Test backup restoration quarterly.
- **[MANDATORY]** Store backups in a secure, offsite location.

## 7. Security Monitoring

- **[MANDATORY]** Implement 24/7 security monitoring.
- **[MANDATORY]** Deploy security information and event management (SIEM) solutions.
- **[MANDATORY]** Establish incident detection and response procedures.

## 8. Vulnerability Management

- **[MANDATORY]** Perform regular vulnerability assessments.
- **[MANDATORY]** Implement a patch management process.
- **[MANDATORY]** Conduct annual penetration testing.

## 9. Application Security

- **[MANDATORY]** Follow secure coding practices.
- **[MANDATORY]** Perform security code reviews.
- **[MANDATORY]** Conduct security testing before production deployment.

## 10. Compliance Verification

- **[MANDATORY]** Conduct regular security risk assessments.
- **[MANDATORY]** Perform annual HIPAA compliance audits.
- **[MANDATORY]** Document all security measures and controls.

## Implementation Guidelines

For implementation details and technical specifications, refer to the following resources:

- [NIST Special Publication 800-66](https://csrc.nist.gov/publications/detail/sp/800-66/rev-1/final) - An Introductory Resource Guide for Implementing the HIPAA Security Rule
- [HHS Guidance on Risk Analysis](https://www.hhs.gov/hipaa/for-professionals/security/guidance/guidance-risk-analysis/index.html)
- [OCR Audit Protocol](https://www.hhs.gov/hipaa/for-professionals/compliance-enforcement/audit/protocol/index.html)

## Contact

For questions or clarification on technical security standards, contact the Security Officer at security@example.com.
`;

  const content = (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          Technical Security Standards
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400">
          HIPAA technical security requirements for healthcare software
        </p>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last updated: March 13, 2025
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {['hipaa', 'security', 'encryption', 'audit'].map((tag) => (
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
