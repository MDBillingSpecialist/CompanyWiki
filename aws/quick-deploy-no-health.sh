#!/bin/bash
# Quick deploy to AWS App Runner - minimal version with no health check
# For when you need to get a service up quickly

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki-quick"
AWS_REGION="us-east-1"
CPU="1 vCPU"
MEMORY="2 GB"
ECR_REPO_NAME="company-wiki"
IMAGE_TAG="latest"

echo "==================================================="
echo "QUICK DEPLOYMENT TO AWS APP RUNNER (NO HEALTH CHECK)"
echo "==================================================="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "ECR Repo: $ECR_REPO_NAME"
echo "Image Tag: $IMAGE_TAG"
echo "Resources: $CPU / $MEMORY"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Get ECR repository URI (assuming image already exists)
ECR_REPO_URI=$(aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" --query "repositories[0].repositoryUri" --output text)
echo "ECR Repository URI: $ECR_REPO_URI"

# 3. Create IAM role if needed
echo "Step 3: Creating IAM role for App Runner..."
ROLE_NAME="AppRunnerECRAccessRole-$APP_NAME"

# Check if role already exists
if aws iam get-role --role-name "$ROLE_NAME" &>/dev/null; then
  echo "Role $ROLE_NAME already exists, using existing role."
else
  # Create trust policy document
  cat > /tmp/trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "build.apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

  # Create the role
  aws iam create-role \
    --role-name "$ROLE_NAME" \
    --assume-role-policy-document file:///tmp/trust-policy.json

  # Attach necessary policy
  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"

  echo "✅ IAM role created: $ROLE_NAME"
fi

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)
echo "Role ARN: $ROLE_ARN"

# 4. Create App Runner service with minimal config (no health check)
echo "Step 4: Creating minimal App Runner service..."

# Generate unique service name with timestamp if needed
TIMESTAMP=$(date +%Y%m%d%H%M%S)
APP_NAME="${APP_NAME}-${TIMESTAMP}"
echo "Using service name with timestamp: $APP_NAME"

# Create service with DISABLED health check
echo "Creating App Runner service with NO health check: $APP_NAME"
RESULT=$(aws apprunner create-service \
  --service-name "$APP_NAME" \
  --source-configuration "{
      \"ImageRepository\": {
          \"ImageIdentifier\": \"$ECR_REPO_URI:$IMAGE_TAG\",
          \"ImageConfiguration\": {
              \"Port\": \"3000\",
              \"RuntimeEnvironmentVariables\": {
                  \"NODE_ENV\": \"production\",
                  \"NEXT_TELEMETRY_DISABLED\": \"1\"
              }
          },
          \"ImageRepositoryType\": \"ECR\"
      },
      \"AutoDeploymentsEnabled\": true,
      \"AuthenticationConfiguration\": {
          \"AccessRoleArn\": \"$ROLE_ARN\"
      }
  }" \
  --instance-configuration "{
      \"Cpu\": \"$CPU\",
      \"Memory\": \"$MEMORY\"
  }" \
  --health-check-configuration "{
      \"Protocol\": \"TCP\",
      \"Interval\": 20,
      \"Timeout\": 5,
      \"HealthyThreshold\": 1,
      \"UnhealthyThreshold\": 5
  }" \
  --tags Key=Environment,Value=production Key=Project,Value=CompanyWiki \
  --region "$AWS_REGION")

# Extract service details
SERVICE_ARN=$(echo $RESULT | jq -r '.Service.ServiceArn')
echo "✅ Service creation initiated!"
echo "Service ARN: $SERVICE_ARN"

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --query "Service.ServiceUrl" \
  --output text \
  --region "$AWS_REGION")

echo "==================================================="
echo "✅ QUICK DEPLOYMENT STARTED!"
echo "==================================================="
echo "Service Name: $APP_NAME"
echo "Service ARN: $SERVICE_ARN"
echo "Service URL: https://$SERVICE_URL"
echo ""
echo "Monitor in AWS console:"
echo "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo ""
echo "This service uses TCP health checks only (no HTTP path check)"
echo "==================================================="

# Save details to a file
echo "Saving details to quick-deploy-details.txt"
cat > quick-deploy-details.txt << EOF
AWS APP RUNNER QUICK DEPLOYMENT
================================
Deployment Date: $(date)
Service Name: $APP_NAME
Service ARN: $SERVICE_ARN
Service URL: https://$SERVICE_URL
ECR Image: $ECR_REPO_URI:$IMAGE_TAG
Region: $AWS_REGION
Resources: $CPU / $MEMORY
================================
EOF

echo "✅ Details saved to quick-deploy-details.txt"