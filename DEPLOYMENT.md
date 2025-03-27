# Company Wiki Deployment Guide

This document provides comprehensive instructions for deploying the Company Wiki application to AWS infrastructure.

## Deployment Options

The Company Wiki can be deployed using two primary methods:

1. **AWS App Runner** (Recommended) - Simplified deployment with minimal configuration
2. **ECS with CloudFormation** - Advanced deployment with more customization options

## Prerequisites

Before deploying, ensure you have:

- AWS CLI installed and configured with appropriate permissions
- Node.js 18.x or later
- Docker installed locally (for testing container builds)
- Access to the company's AWS account

## Basic Deployment with AWS App Runner

The simplest way to deploy the application is using the provided deployment script, which automates the AWS App Runner setup:

```bash
# Deploy to AWS App Runner (default configuration)
./deploy-aws.sh

# Deploy with custom configuration
AWS_REGION=us-west-2 APP_NAME=my-wiki-instance ./deploy-aws.sh
```

### App Runner Configuration Options

The `apprunner.yaml` file controls how the application is built and run:

- **Build Commands**: Customize the build process in the `build` section
- **Runtime Settings**: Modify Node.js version and environment variables in the `run` section
- **Health Checks**: Configure the health check behavior and endpoints
- **Resource Allocation**: Modify CPU and memory allocation

## Advanced Deployment with CloudFormation

For more control over the infrastructure, use the CloudFormation templates:

```bash
# Deploy the full stack
aws cloudformation deploy \
  --template-file aws/cloudformation.yml \
  --stack-name company-wiki \
  --parameter-overrides VpcId=vpc-123456 Subnets=subnet-123,subnet-456 \
  --capabilities CAPABILITY_IAM
```

The CloudFormation deployment creates:
- ECR Repository for container images
- ECS Cluster and Service
- Load Balancer with HTTPS support
- Auto-scaling configuration
- CloudWatch Logs and Alarms
- IAM Roles and Policies

## Monitoring and Alarms

The deployment includes CloudWatch alarms and a monitoring dashboard:

```bash
# Deploy CloudWatch alarms
aws cloudformation deploy \
  --template-file aws/cloudwatch-alarms.yml \
  --stack-name company-wiki-alarms \
  --parameter-overrides NotificationEmail=alerts@example.com

# Create dashboard
aws cloudwatch put-dashboard \
  --dashboard-name company-wiki-dashboard \
  --dashboard-body file://aws/cloudwatch-dashboard.json
```

## Verification and Rollback

After deployment, verify the application is running correctly:

```bash
# Verify deployment
./verify-deployment.sh

# If issues are found, perform a rollback
./rollback-deployment.sh
```

## Custom Domain Configuration

To use a custom domain with the deployment:

1. Create a certificate in AWS Certificate Manager
2. Update the CloudFormation template with your domain name and certificate ARN
3. Configure DNS records to point to the created load balancer

## Security Considerations

The deployment includes several security features:

- HTTPS-only access with TLS 1.2+
- IAM role-based access for services
- Security groups with minimal access
- Health checks to detect and replace unhealthy instances

## Troubleshooting

### Common Issues

1. **Deployment Fails**: Check CloudWatch Logs for build or runtime errors
2. **Health Checks Failing**: Verify the application can serve the /health endpoint
3. **Performance Issues**: Check CloudWatch metrics for resource utilization

### Log Access

Access logs through:

```bash
# For App Runner logs
aws logs get-log-events \
  --log-group-name aws/apprunner/company-wiki/application \
  --log-stream-name instance/1234/application
  
# For ECS logs
aws logs get-log-events \
  --log-group-name /ecs/company-wiki \
  --log-stream-name company-wiki/1234abcd
```

## Maintenance

### Scheduled Updates

We recommend scheduling regular maintenance and updates:

1. Test changes in a staging environment
2. Deploy during low-traffic periods
3. Monitor closely after updates
4. Use the rollback script if issues occur

### Scaling Considerations

The application will auto-scale based on CPU utilization. To modify scaling behavior:

1. Edit the CloudFormation template
2. Adjust the `TargetValue` parameter in the `AutoScalingPolicy` resource
3. Modify the `MaxCapacity` parameter to set upper limits

## Deployment Architecture

The deployed application follows this architecture:

```
User Request → CloudFront (optional) → ALB → ECS/App Runner → Application
                                              ↓
                             CloudWatch Logs & Metrics → Alarms
```

## Support and Maintenance

For deployment issues, contact:
- DevOps Team: devops@example.com
- Cloud Support: cloud-support@example.com

## Further Resources

- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)