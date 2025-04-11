---
title: Employee Onboarding
sop_id: OPS-002
description: Standardized process for onboarding new employees
lastUpdated: 2024-03-21
version: 1.1
owner: Operations/HR Manager
tags: ['sop', 'operations', 'hr', 'onboarding', 'employee']
---

# Employee Onboarding

## Purpose

This procedure establishes a standardized process for onboarding new employees to ensure a smooth transition, proper system access setup, and successful integration into the team and company culture.

## Scope

This SOP applies to all new employee onboarding activities from offer acceptance through the first two weeks of employment. It covers HR orientation, system access, development environment setup, and initial team integration.

## Responsibilities

- **HR Manager**: Oversees the entire onboarding process
- **IT Support (VectorConnect)**: Handles system access and technical setup
- **Supervisor**: Provides team integration and role-specific training
- **New Employee**: Completes required tasks and training
- **Team Members**: Assist with integration and knowledge sharing

## Procedure

### 1. Pre-Onboarding Preparation
   - HR prepares new hire paperwork
   - IT creates necessary system accounts
   - Supervisor prepares workstation and equipment
   - Schedule orientation sessions
   - Prepare welcome package and documentation

### 2. Day 1: HR Orientation
   - Complete new employee paperwork
   - Review company policies and procedures
   - Set up Microsoft account for:
     - Outlook
     - Teams
     - Other Microsoft services
   - Initial supervisor meeting
   - Team introduction
   - Project overview
   - Training video completion

### 3. Day 2: System Access & Setup
   - Create GitLab account (required before receiving invite)
   - Request and obtain necessary access:
     - Claude API key (via Austin Franklin)
     - AWS Console access
     - Monday.com workspace
     - GitLab access (after account creation)
   - Install required software:
     - Code Editor (VS Code or Cursor recommended)
     - Development tools
     - Office applications
   - Set up development environment:
     - Install Xcode CLI tools
     - Configure Homebrew
     - Set up Docker and Colima
     - Configure Git and SSH keys

### 4. Development Environment Setup
   - Install preferred code editor:
     - VS Code or Cursor (recommended)
     - Required extensions:
       - Cline extension (for AI-assisted coding)
       - Dev Containers extension
   - Configure Dev Container settings:
     - Docker Path: `/opt/homebrew/bin/docker`
     - Docker Socket Path: `unix:///Users/[username]/.colima/default/docker.sock`
     - Disable "Optimistically launch docker daemon"
     - Disable "Docker Credential Helper"
   - Set up Git:
     - Generate SSH key
     - Add key to GitLab
     - Configure Git user settings

### 5. Required Software & Tools
   - **Admin-Required Installations**:
     - Homebrew
     - Browser of choice (Chrome, Firefox, Safari, etc.)
     - Office365 (F3 license)
   - **Development Tools**:
     - Docker (without Docker Desktop)
     - Colima
     - Fish shell (optional)
   - **Version Control**:
     - Git
     - GitLab account and access
   - **AI Development Assistance**:
     - Cline extension
     - Claude API access

### 6. Access Requests Process
   - **GitLab Account**:
     1. Create account at gitlab.com
     2. Notify supervisor of account creation
     3. Receive workspace invite
   - **Claude API Key**:
     1. Request from Austin Franklin
     2. Document purpose and access level
   - **AWS Console Access**:
     1. Contact VectorConnect IT
     2. Create access ticket
     3. Await Jeremy's approval
     4. Receive access credentials
   - **Monday.com**:
     1. Receive email invite from supervisor
     2. Complete account setup
   - **Version Control**:
     1. Set up SSH key
     2. Configure access after GitLab invite

### 7. Troubleshooting
   - **Admin Access Issues**:
     - Contact VectorConnect IT: (806) 853-7757
     - Request remote assistance
   - **Docker Configuration**:
     - Verify Colima is running
     - Check Docker socket path
     - Ensure correct permissions
   - **GitLab Access**:
     - Verify SSH key is properly added
     - Check key permissions
     - Contact supervisor if issues persist
   - **AWS Access**:
     - Verify IAM permissions
     - Check security group settings
     - Contact IT support if issues persist

## Security Considerations
   - Never share private SSH keys
   - Report any security concerns immediately
   - Follow least privilege principle for system access
   - Document all access requests and approvals
   - Follow AWS security best practices
   - Maintain proper IAM role management

## Compliance Requirements
   - Complete all required training videos
   - Review and acknowledge company policies
   - Follow IT security guidelines
   - Maintain proper documentation of access
   - Complete AWS security training
   - Review Monday.com usage guidelines

## Version History
- 1.1 (2024-03-21): Updated to reflect AWS as main platform, Monday.com for project management, and updated software recommendations
- 1.0 (2024-03-21): Initial SOP creation

## Related Documents
- [Support Escalation](/wiki/sop/operations/support-escalation)
- [Vendor Management](/wiki/sop/operations/vendor-management)
- [Business Continuity](/wiki/sop/operations/business-continuity)
- [AWS Security Guidelines](/wiki/sop/operations/aws-security) 