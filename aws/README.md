# AWS Deployment Guide for Company Wiki

This guide explains how to deploy the Company Wiki application to AWS using CloudFormation, ECS, and GitLab CI/CD.

## Prerequisites

1. AWS CLI installed and configured with appropriate permissions
2. AWS IAM Role for GitLab CI/CD with permissions for:
   - ECR
   - ECS
   - CloudFormation
   - CloudWatch
   - IAM (for service roles)
   - Route53
   - VPC
   - Load Balancer

3. SSL Certificate in AWS Certificate Manager for your domain
4. Registered domain name in Route53

## CloudFormation Templates

The `cloudformation.yml` file defines the following AWS resources:

- Amazon ECR Repository for Docker images
- Amazon ECS Cluster, Task Definition, and Service
- Application Load Balancer with HTTPS support
- Auto Scaling configuration
- CloudWatch Logs group
- IAM Roles and Security Groups
- Route53 DNS records

## Deployment Process

### 1. Set up GitLab CI/CD Variables

Add the following variables to your GitLab repository:

- `AWS_ACCESS_KEY_ID`: Access key for AWS IAM user
- `AWS_SECRET_ACCESS_KEY`: Secret access key for AWS IAM user
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `AWS_DEFAULT_REGION`: AWS region (e.g., us-east-1)

### 2. Create IAM Role for GitLab CI/CD

Use the `gitlab-iam-role.yml` template to create an IAM role with the necessary permissions:

```bash
aws cloudformation create-stack \
  --stack-name gitlab-cicd-role \
  --template-body file://gitlab-iam-role.yml \
  --parameters \
    ParameterKey=GitLabAccountId,ParameterValue=GITLAB_AWS_ACCOUNT_ID \
  --capabilities CAPABILITY_NAMED_IAM
```

### 3. Create SSL Certificate

1. Create a certificate in AWS Certificate Manager for your domain
2. Ensure certificate is in the `us-east-1` region if using CloudFront, or in the deployment region otherwise

### 4. Deploy Infrastructure

```bash
# Get your VPC ID
aws ec2 describe-vpcs

# Get your subnet IDs
aws ec2 describe-subnets

# Deploy the CloudFormation stack
aws cloudformation create-stack \
  --stack-name company-wiki \
  --template-body file://cloudformation.yml \
  --parameters \
    ParameterKey=VpcId,ParameterValue=vpc-xxxxxxxx \
    ParameterKey=Subnets,ParameterValue=subnet-xxxxxxxx,subnet-yyyyyyyy \
    ParameterKey=DomainName,ParameterValue=wiki.yourcompany.com \
    ParameterKey=CertificateArn,ParameterValue=arn:aws:acm:region:account-id:certificate/xxxxxxxx \
  --capabilities CAPABILITY_IAM
```

### 5. GitLab CI/CD Pipeline

The `.gitlab-ci.yml` file defines the CI/CD pipeline with the following stages:

1. Build: Builds the Next.js application
2. Test: Runs linting and tests
3. Deploy: Builds and pushes the Docker image to ECR, then deploys to ECS

For production deployment, push to the `main` branch.
For staging deployment, push to the `develop` branch.

## Monitoring

The `cloudwatch-dashboard.json` file defines a comprehensive dashboard for monitoring:

- CPU and Memory Utilization
- Request counts and HTTP status codes
- Response times
- Target health
- CloudWatch Alarms

To create the dashboard:

```bash
aws cloudwatch put-dashboard \
  --dashboard-name company-wiki-dashboard \
  --dashboard-body file://cloudwatch-dashboard.json
```

## Alarms and Notifications

Deploy CloudWatch alarms to receive notifications for critical events:

```bash
aws cloudformation create-stack \
  --stack-name company-wiki-alarms \
  --template-body file://cloudwatch-alarms.yml \
  --parameters \
    ParameterKey=NotificationEmail,ParameterValue=your-email@example.com
```

## Troubleshooting

- **Deployment Failures**: Check CloudWatch Logs at `/ecs/company-wiki`
- **Container Health Issues**: Check the ECS Task health and events in the AWS Console
- **Load Balancer Issues**: Verify target group health and listener configuration
- **CI/CD Pipeline Issues**: Review the GitLab CI/CD pipeline logs

## Cost Optimization

This setup uses Fargate Spot instances alongside regular Fargate to reduce costs. You can adjust the capacity provider weights in the CloudFormation template to control the mix.

## Security Considerations

- The configuration includes security headers on the load balancer
- All traffic is redirected to HTTPS
- Containers run as non-root users
- IAM roles follow the principle of least privilege

## Cleanup

To remove all resources:

```bash
aws cloudformation delete-stack --stack-name company-wiki
aws cloudformation delete-stack --stack-name company-wiki-alarms
aws cloudformation delete-stack --stack-name gitlab-cicd-role
```