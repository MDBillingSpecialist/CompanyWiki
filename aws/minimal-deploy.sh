#!/bin/bash
# Minimal deployment to AWS App Runner with a simple Express server
# This approach is for debugging and ensuring AWS App Runner works

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki-minimal"
AWS_REGION="us-east-1"
ECR_REPO_NAME="company-wiki-minimal"
IMAGE_TAG="latest"

TIMESTAMP=$(date +%Y%m%d%H%M%S)
APP_NAME="${APP_NAME}-${TIMESTAMP}"

echo "==================================================="
echo "MINIMAL DEPLOYMENT TO AWS APP RUNNER"
echo "==================================================="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "ECR Repo: $ECR_REPO_NAME"
echo "Image Tag: $IMAGE_TAG"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Build and push minimal Docker image to ECR
echo "Step 2: Building and pushing minimal Docker image to ECR..."

# Check if ECR repository exists, create if not
if ! aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" &>/dev/null; then
  echo "Creating ECR repository: $ECR_REPO_NAME"
  aws ecr create-repository --repository-name "$ECR_REPO_NAME" --region "$AWS_REGION"
fi

# Get ECR repository URI
ECR_REPO_URI=$(aws ecr describe-repositories --repository-names "$ECR_REPO_NAME" --region "$AWS_REGION" --query "repositories[0].repositoryUri" --output text)
echo "ECR Repository URI: $ECR_REPO_URI"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$ECR_REPO_URI"

# Build Docker image from minimal Dockerfile
echo "Building minimal Docker image..."
docker build -t "$ECR_REPO_NAME:$IMAGE_TAG" -f aws/minimal-dockerfile .

# Tag and push image to ECR
echo "Tagging and pushing image to ECR..."
docker tag "$ECR_REPO_NAME:$IMAGE_TAG" "$ECR_REPO_URI:$IMAGE_TAG"
docker push "$ECR_REPO_URI:$IMAGE_TAG"

echo "✅ Minimal image successfully pushed to ECR: $ECR_REPO_URI:$IMAGE_TAG"

# 3. Create IAM role for App Runner
echo "Step 3: Creating IAM role for App Runner..."

ROLE_NAME="AppRunnerMinimalRole-$APP_NAME"

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

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)
echo "Role ARN: $ROLE_ARN"

# 4. Create App Runner service from minimal ECR image
echo "Step 4: Creating App Runner service from minimal image..."

# Create the service with very basic configuration
echo "Creating new App Runner service: $APP_NAME"
RESULT=$(aws apprunner create-service \
  --service-name "$APP_NAME" \
  --source-configuration "{
      \"ImageRepository\": {
          \"ImageIdentifier\": \"$ECR_REPO_URI:$IMAGE_TAG\",
          \"ImageConfiguration\": {
              \"Port\": \"3000\",
              \"RuntimeEnvironmentVariables\": {
                  \"NODE_ENV\": \"production\"
              }
          },
          \"ImageRepositoryType\": \"ECR\"
      },
      \"AutoDeploymentsEnabled\": false,
      \"AuthenticationConfiguration\": {
          \"AccessRoleArn\": \"$ROLE_ARN\"
      }
  }" \
  --instance-configuration "{
      \"Cpu\": \"1 vCPU\",
      \"Memory\": \"2 GB\"
  }" \
  --tags Key=Environment,Value=debug Key=Project,Value=CompanyWiki \
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
echo "✅ MINIMAL DEPLOYMENT STARTED!"
echo "==================================================="
echo "Service Name: $APP_NAME"
echo "Service ARN: $SERVICE_ARN"
echo "Service URL: https://$SERVICE_URL"
echo ""
echo "Monitor in AWS console:"
echo "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo ""
echo "This is a minimal deployment for testing purposes only."
echo "==================================================="

# Save details to a file
echo "Saving details to minimal-deploy-details.txt"
cat > minimal-deploy-details.txt << EOF
AWS APP RUNNER MINIMAL DEPLOYMENT
================================
Deployment Date: $(date)
Service Name: $APP_NAME
Service ARN: $SERVICE_ARN
Service URL: https://$SERVICE_URL
ECR Image: $ECR_REPO_URI:$IMAGE_TAG
Region: $AWS_REGION
================================
EOF

echo "✅ Details saved to minimal-deploy-details.txt"