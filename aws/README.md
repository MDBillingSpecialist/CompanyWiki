# AWS Deployment for Company Wiki

This directory contains all the AWS infrastructure configuration files and utilities for deploying the Company Wiki application to AWS.

## Overview

The deployment infrastructure has been designed with the following principles:

1. **Reliability** - Redundant systems and robust error handling
2. **Scalability** - Auto-scaling based on load metrics
3. **Observability** - Comprehensive monitoring and alerting
4. **Security** - HTTPS-only access and principle of least privilege
5. **Cost Efficiency** - Resource-appropriate sizing and idle cost reduction

## Deployment Options

### Option 1: AWS App Runner (Recommended)

The simplest deployment method using `deploy-aws.sh` script. App Runner automatically handles:

- Building and deploying from source code
- Auto-scaling based on traffic
- Load balancing
- HTTPS termination
- Health checks

#### Configuration Files:
- `apprunner.yaml` - Defines build and runtime configuration
- `server.js` - Custom server implementation with health checks

### Option 2: ECS with CloudFormation

For more advanced infrastructure needs, a complete CloudFormation stack:

#### Configuration Files:
- `cloudformation.yml` - Main infrastructure stack
- `cloudwatch-alarms.yml` - Monitoring and alerting
- `cloudwatch-dashboard.json` - Visual monitoring dashboard
- `github-oidc-role.yml` - IAM role for CI/CD integration

## Deployment Utilities

### Scripts

1. **deploy-aws.sh**
   - Main deployment script for App Runner
   - Handles all aspects of provisioning/updating
   - Configurable via environment variables

2. **verify-deployment.sh**
   - Post-deployment validation
   - Checks multiple endpoints and functionality
   - Reports results in an easy-to-understand format

3. **rollback-deployment.sh**
   - Emergency rollback to previous deployment
   - Minimal downtime recovery path
   - Can be triggered automatically or manually

## Monitoring and Alerting

The deployment includes comprehensive monitoring:

1. **CloudWatch Dashboard**
   - Real-time metrics visualization
   - Consolidated view of all application components
   - Custom metrics for business KPIs

2. **CloudWatch Alarms**
   - CPU/Memory utilization alerts
   - Error rate monitoring
   - Response time thresholds
   - Health check status notifications

## CI/CD Integration

The AWS infrastructure integrates with GitLab CI/CD via:

1. **IAM Role-based Authentication**
   - Secure, temporary credentials
   - No hardcoded secrets in CI/CD pipeline

2. **Multi-environment Support**
   - Staging and production environments
   - Isolated resources per environment
   - Manual promotion between environments

## Security Measures

1. **HTTPS Everywhere**
   - TLS 1.2+ for all traffic
   - HTTP to HTTPS redirection

2. **IAM Least Privilege**
   - Service-specific roles with minimal permissions
   - Temporary credentials for deployments

3. **Network Security**
   - Security groups with restricted access
   - Internal services not exposed to internet

## Cost Optimization

1. **Auto-scaling**
   - Scale down during low traffic periods
   - Scale up to handle traffic spikes

2. **Resource Right-sizing**
   - Different resource allocations for staging/production
   - Optimized memory/CPU ratios for Node.js

3. **App Runner Pause Feature**
   - Pause services during extended idle periods
   - Resume automatically on traffic

## Usage Instructions

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) document for detailed deployment instructions and examples.