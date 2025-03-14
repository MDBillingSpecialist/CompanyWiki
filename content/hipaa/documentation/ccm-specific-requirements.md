---
title: CCM-Specific Compliance Requirements
description: Detailed requirements for implementing HIPAA-compliant chronic care management software and services
lastUpdated: 2025-03-13
tags: ['hipaa', 'compliance', 'ccm', 'medicare', 'healthcare', 'chronic-care', 'time-tracking']
---

# CCM-Specific Compliance Requirements [MANDATORY]

## Overview
This page outlines the specific compliance requirements for Chronic Care Management (CCM) software that **must** be implemented in addition to general HIPAA requirements. These requirements address the unique aspects of CCM services, including time tracking, documentation, and Medicare billing compliance.

## Accurate Time Tracking for Billing

### Time Tracking Requirements [MANDATORY]
- **Standard**: Accurate tracking of clinician time spent on CCM activities
- **Implementation**: Auditable time logging system
- **Scope**: All billable CCM activities
- **Verification**: Monthly time log audit

#### Medicare CCM Billing Requirements:
1. At least 20 minutes per month of qualifying CCM services to bill CPT 99490 (basic non-complex CCM)
2. Higher codes require more time (e.g., 60 minutes for complex CCM)
3. Time must be spent on qualifying CCM activities
4. Only one provider can bill CCM for a patient in a given month

#### Implementation Requirements:
1. Implement precise timers or logging mechanisms for CCM activities
2. Record patient identifier, date/time, staff member, activity description, and duration
3. Prevent unauthorized manipulation of time logs
4. Implement validation checks (e.g., cannot log more than 60 minutes in a single hour)
5. Track all modifications to logged time with before/after values and user information

#### Compliance Verification:
- [ ] Time tracking system verified for accuracy
- [ ] Validation controls tested
- [ ] Modification tracking verified
- [ ] Audit trail for time logs confirmed
- [ ] Monthly time reports tested for accuracy

## Clinician Activity Documentation

### Activity Documentation [MANDATORY]
- **Standard**: Detailed documentation of all CCM activities
- **Implementation**: Structured activity logging
- **Scope**: All billable CCM activities
- **Verification**: Monthly documentation review

#### Documentation Requirements:
1. Document specific care coordination activities performed
2. Include topic, outcome, and follow-up needed
3. Store activity notes in the EHR or system of record
4. Tag entries with clinician name/role and timestamp
5. Ensure documentation substantiates the service provided

#### Implementation Requirements:
1. Create structured templates for common CCM activities
2. Implement fields for all required documentation elements
3. Ensure documentation is stored in or linked to the legal medical record
4. Provide ability to generate reports of activities by patient
5. Implement validation to ensure complete documentation

#### Compliance Verification:
- [ ] Documentation templates verified for completeness
- [ ] Storage in/linkage to medical record confirmed
- [ ] Reporting functionality tested
- [ ] Documentation validation controls verified
- [ ] Documentation retrieval for audit purposes tested

## Care Plan Integration

### Care Plan Management [MANDATORY]
- **Standard**: Maintenance of electronic, up-to-date care plans
- **Implementation**: Care plan creation, access, and updates
- **Scope**: All CCM patients
- **Verification**: Quarterly care plan audit

#### Care Plan Requirements:
1. Comprehensive, electronic care plan for each patient's chronic conditions
2. Accessible to all care team members
3. Regularly updated and maintained
4. Available to be shared with the patient
5. Includes problem list, goals, and interventions

#### Implementation Requirements:
1. Implement care plan creation and management functionality
2. Enable care plan updates and version tracking
3. Provide access controls for care team members
4. Implement prompts for regular care plan reviews
5. Enable care plan sharing with patients

#### Compliance Verification:
- [ ] Care plan functionality verified
- [ ] Access controls tested
- [ ] Update and version tracking confirmed
- [ ] Review prompts tested
- [ ] Patient sharing capability verified

## One Practitioner per Patient per Month

### Billing Coordination [MANDATORY]
- **Standard**: Prevent duplicate CCM billing
- **Implementation**: Patient enrollment tracking
- **Scope**: All CCM patients
- **Verification**: Monthly billing verification

#### Implementation Requirements:
1. Track patient enrollment with specific providers
2. Implement controls to prevent duplicate billing
3. Document patient consent for specific provider's CCM services
4. Maintain records of current CCM provider for each patient
5. Implement process for handling provider changes

#### Compliance Verification:
- [ ] Enrollment tracking verified
- [ ] Duplicate billing controls tested
- [ ] Consent documentation process verified
- [ ] Provider change process tested
- [ ] Monthly billing verification process confirmed

## Storing Screenshots of EHR Data

### Screenshot Management [MANDATORY]
- **Standard**: Secure handling of EHR screenshots
- **Implementation**: Encryption, access control, minimization
- **Scope**: All screenshots containing PHI
- **Verification**: Monthly screenshot audit

#### Implementation Requirements:
1. Capture only the minimum necessary information in screenshots
2. Store screenshots in encrypted storage with access control
3. Add watermark or notice "Confidential Patient Information – for care coordination use only"
4. Implement retention and secure destruction policies
5. Limit access to only the care team for that patient or compliance auditors

#### Compliance Verification:
- [ ] Screenshot capture process reviewed for minimization
- [ ] Screenshot storage encryption verified
- [ ] Watermarking/notice implementation confirmed
- [ ] Retention policy implementation verified
- [ ] Access controls tested

### Data Minimization [MANDATORY]
- **Standard**: Minimize PHI in screenshots
- **Implementation**: Targeted capture, masking
- **Scope**: All screenshots
- **Verification**: Monthly screenshot content review

#### Implementation Requirements:
1. Design software to capture only needed information rather than full screens
2. Extract specific data elements when possible instead of images
3. Mask or redact unnecessary PHI in screenshots
4. Implement controls to prevent unnecessary screenshot capture
5. Train users on minimizing PHI in screenshots

#### Compliance Verification:
- [ ] Targeted capture functionality verified
- [ ] Data extraction alternatives tested
- [ ] Masking/redaction capabilities verified
- [ ] Screenshot controls tested
- [ ] User training materials reviewed

## Audit and Compliance Reports

### CCM Reporting [MANDATORY]
- **Standard**: Comprehensive reporting for compliance verification
- **Implementation**: Automated report generation
- **Scope**: All CCM activities
- **Verification**: Monthly report validation

#### Required Reports:
1. Monthly CCM report per patient (patient name, provider, consent date, minutes, services, staff)
2. Exception report (patients not meeting minimum time threshold)
3. Consent status report
4. Care plan status report
5. Billing verification report

#### Implementation Requirements:
1. Develop automated reporting functionality
2. Ensure reports are exportable and human-readable
3. Include all required data elements in reports
4. Implement report scheduling
5. Secure report distribution and storage

#### Compliance Verification:
- [ ] Report generation functionality verified
- [ ] Report content validated for completeness
- [ ] Export functionality tested
- [ ] Report scheduling confirmed
- [ ] Report security controls verified

## Patient Consent for CCM

### Consent Management [MANDATORY]
- **Standard**: Documented patient consent for CCM services
- **Implementation**: Consent capture and storage
- **Scope**: All CCM patients
- **Verification**: Monthly consent audit

#### Consent Requirements:
1. Informed consent before initiating CCM services
2. Documentation of consent in the medical record
3. Information about CCM services, cost-sharing, and right to revoke
4. One-time consent (unless provider changes)
5. Process for handling consent revocation

#### Implementation Requirements:
1. Implement consent documentation functionality
2. Store consent records securely
3. Link consent to patient record
4. Track consent status and date
5. Implement process for handling revocations

#### Compliance Verification:
- [ ] Consent documentation functionality verified
- [ ] Secure storage confirmed
- [ ] Patient record linkage tested
- [ ] Status tracking verified
- [ ] Revocation process tested

## Quality and Safety Considerations

### Data Accuracy [MANDATORY]
- **Standard**: Ensure accuracy of CCM data for patient safety
- **Implementation**: Validation, verification, alerts
- **Scope**: All CCM data
- **Verification**: Monthly data quality review

#### Implementation Requirements:
1. Implement data validation controls
2. Alert for potential documentation gaps (e.g., month closing with zero minutes)
3. Implement verification steps for critical information
4. Provide clear error messages for invalid data
5. Implement periodic data quality reviews

#### Compliance Verification:
- [ ] Data validation controls tested
- [ ] Alert functionality verified
- [ ] Verification steps confirmed
- [ ] Error messaging reviewed
- [ ] Data quality review process documented

## User Training on CCM Software

### Training Requirements [MANDATORY]
- **Standard**: Comprehensive training on CCM software and compliance
- **Implementation**: Training program, materials, verification
- **Scope**: All CCM software users
- **Verification**: Quarterly training review

#### Training Content:
1. CCM billing requirements and documentation standards
2. Proper time tracking and activity documentation
3. Care plan management
4. Privacy and security considerations
5. Legal and compliance implications of documentation

#### Implementation Requirements:
1. Develop comprehensive training materials
2. Implement training verification (tests, certifications)
3. Provide refresher training periodically
4. Update training for software changes
5. Document completion of training

#### Compliance Verification:
- [ ] Training materials reviewed for completeness
- [ ] Verification process tested
- [ ] Refresher schedule confirmed
- [ ] Update process verified
- [ ] Training documentation reviewed

## Technical Implementation Guidance

### Time Tracking Implementation
- Use server-side timestamps for start/stop events
- Implement automatic inactivity detection
- Store raw timestamp data along with calculated durations
- Implement database-level constraints on time values
- Create audit triggers for time modification events

### Documentation System
- Use structured data fields whenever possible
- Implement templates for common activities
- Enable version control for documentation
- Implement search functionality for audits
- Ensure all documentation is linked to patient records

### Care Plan Management
- Implement care plan templates for common conditions
- Enable collaborative editing with attribution
- Implement review date tracking and reminders
- Enable PDF generation for patient sharing
- Track care plan changes over time

## Responsible Parties

| Role | Responsibilities |
|------|------------------|
| CCM Program Manager | Overall accountability for CCM compliance |
| Clinical Lead | Oversight of clinical documentation standards |
| Billing Compliance Officer | Verification of time tracking and billing compliance |
| Software Developer | Implementation of technical controls |
| Training Coordinator | Development and delivery of user training |

## Related Documentation
- [Technical Security Standards](/wiki/hipaa/documentation/technical-security)
- [Access Control & Authentication](/wiki/hipaa/documentation/access-control)
- [Incident Response](/wiki/hipaa/documentation/incident-response)

## Regulatory References
- Medicare Chronic Care Management Services (CPT 99490, 99487, 99489)
- CMS Chronic Care Management Requirements
- HIPAA Privacy Rule § 164.506 - Uses and disclosures for treatment, payment, and operations
- HIPAA Security Rule § 164.312(b) - Audit controls