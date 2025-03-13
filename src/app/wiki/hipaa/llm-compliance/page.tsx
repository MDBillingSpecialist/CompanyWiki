"use client";

import React from 'react';
import { WikiLayout } from '@/components/layout/WikiLayout';

export default function LlmCompliancePage() {
  const staticContent = `
# HIPAA Compliance for LLMs in Healthcare

## Overview

Large Language Models (LLMs) offer powerful capabilities for healthcare applications, but their use must comply with HIPAA regulations to protect patient privacy and security. This document provides comprehensive guidance on implementing LLMs in healthcare settings while maintaining HIPAA compliance.

## Regulatory Compliance & Legal Requirements

### HIPAA Rules Applicable to LLMs

When implementing LLMs in healthcare, you must comply with all relevant HIPAA regulations:

- **Privacy Rule**: Governs how Protected Health Information (PHI) can be used or disclosed
- **Security Rule**: Mandates safeguards to protect electronic PHI (ePHI)
- **Breach Notification Rule**: Requires notifying affected parties if PHI is compromised
- **HITECH Act**: Strengthened HIPAA enforcement and introduced incentives/penalties related to PHI security

### HIPAA Privacy Rule (Use/Disclosure of PHI)

Before using PHI with an LLM, determine if the use is permitted under HIPAA's Privacy Rule:

- PHI use is generally allowed without patient authorization only for Treatment, Payment, or Healthcare Operations (TPO), or certain public interest exceptions
- Using PHI to directly care for patients (treatment) or for care coordination and quality improvement (operations) can be permissible without additional consent
- If PHI will be used to train or develop an AI model, it may not fall under TPO and could be considered a secondary use (or "research")
- In such cases, patient authorization (consent) is usually required unless the data is fully de-identified

### Business Associate Agreements (BAAs)

Determine if your LLM or its provider is a Business Associate under HIPAA:

- A Business Associate is any person or entity that "creates, receives, maintains, or transmits" PHI on behalf of a covered entity
- If you are using a third-party LLM service or API that involves PHI, that service qualifies as a Business Associate
- Cloud service providers hosting ePHI – even if only storing encrypted PHI and lacking the decryption key – are considered Business Associates
- Before integrating any external LLM, execute a HIPAA-compliant BAA with the vendor
- If a vendor will not sign a BAA, do not use real PHI with that service

## PHI Handling and Data Anonymization

### De-identify PHI Whenever Possible

The best way to protect patient privacy when using LLMs is to remove identifying information:

- De-identified data is not subject to HIPAA regulations
- HIPAA provides two accepted methods for de-identification:
  1. **Safe Harbor method**: Remove 18 types of identifiers and any other information that could identify the individual or their relatives/household
  2. **Expert Determination method**: A qualified expert uses statistical methods to conclude that the risk of re-identifying individuals is very small

### Approved Anonymization Techniques

Follow HHS guidance for de-identification:

- **Removal or Masking of Identifiers**: Strip out personal data like names, phone numbers, emails, medical record numbers, device identifiers, biometric identifiers, photographs, etc.
- **Aggregation and Generalization**: Use ranges or categories instead of specific values
- **Data Masking/Pseudonymization**: Mask data fields needed for context so that the model still gets structured input without real PHI
- **Expert Statistical De-identification**: Apply k-anonymity, l-diversity, differential privacy, or other techniques to ensure that combinations of health data cannot single out a person
`;

  const content = (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          HIPAA Compliance for LLMs in Healthcare
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Guidelines for implementing Large Language Models in healthcare while maintaining HIPAA compliance
        </p>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Last updated: March 13, 2025
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {['hipaa', 'compliance', 'ai', 'llm', 'healthcare'].map((tag) => (
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
