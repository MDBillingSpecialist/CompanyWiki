---
title: Security Monitoring
sop_id: COMP-004
description: Procedures for ongoing security surveillance
lastUpdated: 2024-03-21
version: 1.3
owner: Austin (Project Manager/Developer)
tags: ['sop', 'compliance', 'security', 'monitoring', 'surveillance']
---

# Security Monitoring

## Purpose

This procedure establishes standardized processes for monitoring, detecting, and responding to security events across the organization's systems and networks, with specific focus on BAA-protected services and HIPAA compliance.

## Scope

This SOP applies to all security monitoring activities across the organization's IT infrastructure, with specific focus on BAA-protected services. It covers monitoring implementation, alert management, event analysis, and response coordination.

## Responsibilities

- **Project Manager/Developer (Austin)**:
  - Oversees monitoring program and escalations
  - Implements and manages security monitoring systems
  - Reviews alerts and performs initial triage
  - Ensures monitoring tools have appropriate access
  - Responds to confirmed security incidents
  - Ensures monitoring meets regulatory requirements
  - Maintains software development-specific documentation
  - Documents technical security procedures and configurations
  - Tracks security-related code changes and deployments
- **Lead Developer (Alex)**:
  - Assists with monitoring implementation
  - Reviews critical security alerts
  - Supports incident response
  - Provides technical guidance
  - Documents technical findings and solutions
- **Junior Developer**:
  - Assists with monitoring tasks as assigned
  - Reports security concerns
  - Follows established procedures
  - Documents assigned tasks and findings
- **HR**:
  - Maintains personnel-related security documentation
  - Handles training records and certifications
  - Manages access control documentation
  - Maintains policy acknowledgments

## Procedure

### 1. Monitoring Infrastructure Setup
   - Implement centralized security monitoring platform using BAA-protected services
   - Deploy monitoring agents and collectors across infrastructure
   - Configure log sources to forward to central platform:
     * Network devices (firewalls, routers, switches)
     * Servers (Windows, Linux, Unix)
     * Cloud environments (AWS, Azure, GCP - BAA-protected services only)
     * Applications and databases
     * Identity and access management systems
     * Endpoint protection solutions
   - Establish baseline monitoring requirements for each system type
   - Verify monitoring coverage across all critical systems
   - Document monitoring architecture and data flows

### 2. Log Collection and Management
   - Collect the following log types:
     * Authentication events (success/failure)
     * Account management activities
     * Privilege use and escalation
     * System events (startup, shutdown, errors)
     * Application events
     * Security software alerts
     * Network traffic logs
   - Standardize log formats where possible
   - Implement log integrity controls
   - Establish log retention periods based on requirements:
     * General logs: 90 days online, 1 year archived
     * Security-relevant logs: 1 year online, 7 years archived
     * HIPAA logs: 6 years retention
   - Implement log rotation and archiving procedures
   - Verify log collection is functioning properly daily

### 3. Alert Configuration and Tuning
   - Define alert rules based on:
     * Known threat indicators
     * Suspicious behavior patterns
     * Compliance requirements
     * Industry best practices
   - Categorize alerts by severity:
     * Critical: Immediate response required
     * High: Response required within 1 hour
     * Medium: Response required within 8 hours
     * Low: Response required within 24 hours
   - Establish thresholds to minimize false positives
   - Document alert logic and expected response
   - Review and tune alerts monthly
   - Test new alert rules in staging environment

### 4. Monitoring Operations
   - Staff Security Operations Center (SOC) according to schedule:
     * 24x7 coverage for critical environments
     * Business hours with on-call for standard environments
   - Follow alert triage workflow:
     * Acknowledge alert
     * Gather additional context
     * Determine if legitimate security event
     * Escalate or close as appropriate
   - Document all alert investigations
   - Maintain monitoring dashboard for real-time visibility
   - Conduct shift handovers for continuous coverage
   - Perform regular health checks on monitoring systems

### 5. Security Event Analysis
   - For potential security events:
     * Collect relevant logs and artifacts
     * Establish timeline of activities
     * Identify affected systems and accounts
     * Determine potential impact
     * Assess if incident declaration is warranted
   - Use threat intelligence to enhance analysis
   - Document analysis methodology and findings
   - Preserve evidence according to forensic standards
   - Update detection rules based on findings

### 6. Response Coordination
   - For confirmed security incidents:
     * Escalate to Incident Response Team
     * Provide all relevant information and evidence
     * Support ongoing investigation as needed
     * Document handoff in incident management system
   - For non-incident events requiring remediation:
     * Notify appropriate system owners
     * Track remediation activities
     * Verify resolution
     * Document lessons learned

### 7. Continuous Improvement
   - Track key metrics:
     * Alert volume by severity
     * False positive rate
     * Mean time to detect (MTTD)
     * Mean time to respond (MTTR)
     * Coverage gaps
   - Conduct weekly review of significant events
   - Perform monthly review of monitoring effectiveness
   - Update monitoring rules based on:
     * New threat intelligence
     * Incident lessons learned
     * Technology changes
     * Compliance requirements
   - Document all changes to monitoring configuration

## Security Monitoring Standards

### Minimum Logging Requirements

| System Type | Required Log Types | Retention Period | Review Frequency |
|-------------|-------------------|------------------|------------------|
| Firewalls | Connection logs, rule changes, authentication | 1 year | Daily |
| Servers | Authentication, system events, application logs, security events | 1 year | Daily |
| Databases | Authentication, schema changes, privilege changes, query logs | 1 year | Daily |
| Identity Systems | All authentication attempts, account changes, privilege changes | 1 year | Daily |
| Cloud Services | API calls, configuration changes, authentication, data access | 1 year | Daily |
| Endpoints | Security software alerts, application installation, authentication | 90 days | Weekly |

### Alert Categories and Examples

#### Authentication Alerts
- Multiple failed login attempts
- Login from unusual locations
- Login outside business hours
- Privileged account usage
- Password changes for sensitive accounts

#### Network Alerts
- Unusual outbound connections
- Communication with known malicious IPs
- Unusual data transfer patterns
- Port scanning activity
- DNS request anomalies

#### System Alerts
- Critical file modifications
- Registry/configuration changes
- Service/process creation
- Scheduled task creation
- Privilege escalation attempts

#### Application Alerts
- Application errors
- Unusual API usage
- Input validation failures
- Authorization bypasses
- Unusual query patterns

## References

- Information Security Policy
- Incident Response Procedure
- Log Management Policy
- Data Retention Policy
- Threat Intelligence Program

## Definitions

- **Security Event**: Observable occurrence in a system or network
- **Security Incident**: Event that actually or potentially jeopardizes confidentiality, integrity, or availability
- **False Positive**: Alert triggered when no actual security issue exists
- **SIEM**: Security Information and Event Management system
- **SOC**: Security Operations Center
- **IoC**: Indicator of Compromise
- **BAA**: Business Associate Agreement

## Revision History

| Version | Date | Description | Author |
|---------|------|-------------|--------|
| 1.3 | 2024-03-21 | Clarified documentation responsibilities between HR and Austin | Austin |
| 1.2 | 2024-03-21 | Updated roles to reflect actual team structure | Austin |
| 1.1 | 2024-03-21 | Updated to focus on BAA-protected services and clarified PHI handling | Thomas Wilson |
| 1.0 | 2025-03-13 | Initial version | Thomas Wilson |
