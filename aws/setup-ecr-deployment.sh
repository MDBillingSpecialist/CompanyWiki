#!/bin/bash
# Deploy to AWS App Runner using ECR (alternative to GitHub-based deployment)
# This approach uses a container image in ECR instead of a code repository

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki-ecr"
AWS_REGION="us-east-1"
CPU="1 vCPU"
MEMORY="2 GB"
ECR_REPO_NAME="company-wiki"
IMAGE_TAG="latest"

echo "==================================================="
echo "CREATING AWS APP RUNNER SERVICE USING ECR CONTAINER"
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

# 2. Build and push Docker image to ECR
echo "Step 2: Building and pushing Docker image to ECR..."

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

# Build Docker image
echo "Building Docker image..."
docker build -t "$ECR_REPO_NAME:$IMAGE_TAG" .

# Tag and push image to ECR
echo "Tagging and pushing image to ECR..."
docker tag "$ECR_REPO_NAME:$IMAGE_TAG" "$ECR_REPO_URI:$IMAGE_TAG"
docker push "$ECR_REPO_URI:$IMAGE_TAG"

echo "✅ Image successfully pushed to ECR: $ECR_REPO_URI:$IMAGE_TAG"

# 3. Create IAM role for App Runner
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

# 4. Create App Runner service from ECR image
echo "Step 4: Creating App Runner service from ECR image..."

# Generate unique service name with timestamp if needed
if aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='$APP_NAME'].ServiceArn" --output text --region "$AWS_REGION" | grep -q .; then
  TIMESTAMP=$(date +%Y%m%d%H%M%S)
  APP_NAME="${APP_NAME}-${TIMESTAMP}"
  echo "Service name already exists. Using new name: $APP_NAME"
fi

# Create the service
echo "Creating new App Runner service: $APP_NAME"
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
          \"RoleArn\": \"$ROLE_ARN\"
      }
  }" \
  --instance-configuration "{
      \"Cpu\": \"$CPU\",
      \"Memory\": \"$MEMORY\"
  }" \
  --health-check-configuration "{
      \"Protocol\": \"HTTP\",
      \"Path\": \"/health\",
      \"Interval\": 15,
      \"Timeout\": 5,
      \"HealthyThreshold\": 2,
      \"UnhealthyThreshold\": 3
  }" \
  --tags Key=Environment,Value=production Key=Project,Value=CompanyWiki \
  --region "$AWS_REGION")

# Extract service details
SERVICE_ARN=$(echo $RESULT | jq -r '.Service.ServiceArn')

echo "✅ Service creation initiated!"
echo "Service ARN: $SERVICE_ARN"

# 5. Wait for service to become active
echo "Step 5: Waiting for service to become active..."
echo "This may take several minutes..."

# Wait for service to be created
aws apprunner wait service-created --service-arn "$SERVICE_ARN" --region "$AWS_REGION" || {
  echo "Service creation is still in progress. This will continue in the background."
  echo "Check status in the AWS console: https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
}

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --query "Service.ServiceUrl" \
  --output text \
  --region "$AWS_REGION")

echo "==================================================="
echo "✅ NEW APP RUNNER SERVICE CREATED SUCCESSFULLY!"
echo "==================================================="
echo "Service Name: $APP_NAME"
echo "Service ARN: $SERVICE_ARN"
echo "Service URL: https://$SERVICE_URL"
echo ""
echo "Monitor in AWS console:"
echo "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo ""
echo "Check health at: https://$SERVICE_URL/health"
echo "==================================================="

# Save details to a file
echo "Saving deployment details to app-runner-ecr-details.txt"
cat > app-runner-ecr-details.txt << EOF
AWS APP RUNNER DEPLOYMENT DETAILS (ECR)
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

echo "✅ Details saved to app-runner-ecr-details.txt"