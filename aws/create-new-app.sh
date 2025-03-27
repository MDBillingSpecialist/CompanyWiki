#!/bin/bash
# Create a brand new AWS App Runner application from scratch
# This script handles the entire process of setting up a new service

set -e  # Exit on any error

# Configuration variables - edit these for your deployment
APP_NAME="company-wiki-new"
AWS_REGION="us-east-1"
CPU="1 vCPU"
MEMORY="2 GB"
GITLAB_REPO="intelligent-systems-and-development/company-wiki"
BRANCH="main"
CONNECTION_NAME="gitlab-connection"

echo "==================================================="
echo "    CREATING NEW AWS APP RUNNER APPLICATION"
echo "==================================================="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "GitLab Repo: $GITLAB_REPO"
echo "Branch: $BRANCH"
echo "Resources: $CPU / $MEMORY"
echo "==================================================="

# 1. Make sure AWS CLI is properly configured
echo "Step 1: Verifying AWS credentials..."

if ! aws sts get-caller-identity &>/dev/null; then
  echo "ERROR: AWS credentials not configured!"
  echo "Please run 'aws configure' to set up your AWS credentials."
  exit 1
fi

echo "✅ AWS credentials verified."

# 2. Create AWS IAM role for App Runner
echo "Step 2: Creating IAM role for App Runner..."

ROLE_NAME="AppRunnerServiceRole-$APP_NAME"

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

  # Attach necessary policies
  aws iam attach-role-policy \
    --role-name "$ROLE_NAME" \
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"

  echo "✅ IAM role created: $ROLE_NAME"
fi

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query "Role.Arn" --output text)
echo "Role ARN: $ROLE_ARN"

# 3. Set up connection to GitLab (if needed)
echo "Step 3: Setting up connection to GitLab..."

# Check if connection already exists
CONNECTION_ARN=$(aws apprunner list-connections --query "ConnectionSummaryList[?ConnectionName=='$CONNECTION_NAME'].ConnectionArn" --output text --region "$AWS_REGION")

if [ -z "$CONNECTION_ARN" ]; then
  echo "Creating new connection to GitLab..."
  
  # Create new connection
  RESULT=$(aws apprunner create-connection \
    --connection-name "$CONNECTION_NAME" \
    --provider-type "GITLAB" \
    --region "$AWS_REGION")
  
  CONNECTION_ARN=$(echo $RESULT | jq -r '.Connection.ConnectionArn')
  
  echo "⚠️ IMPORTANT: You need to complete the connection setup in the AWS console!"
  echo "Go to: https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/connections"
  echo "Find the connection named '$CONNECTION_NAME' and click 'Complete setup'"
  echo "Then press Enter to continue..."
  read -p "Press Enter after completing the connection setup..."
else
  echo "Using existing GitLab connection: $CONNECTION_NAME"
fi

# 4. Create App Runner service
echo "Step 4: Creating App Runner service..."

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
      \"CodeRepository\": {
          \"RepositoryUrl\": \"https://gitlab.com/$GITLAB_REPO\",
          \"SourceCodeVersion\": {
              \"Type\": \"BRANCH\",
              \"Value\": \"$BRANCH\"
          },
          \"CodeConfiguration\": {
              \"ConfigurationSource\": \"REPOSITORY\"
          },
          \"ConnectionArn\": \"$CONNECTION_ARN\"
      },
      \"AutoDeploymentsEnabled\": true
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
echo "Saving deployment details to app-runner-details.txt"
cat > app-runner-details.txt << EOF
AWS APP RUNNER DEPLOYMENT DETAILS
================================
Deployment Date: $(date)
Service Name: $APP_NAME
Service ARN: $SERVICE_ARN
Service URL: https://$SERVICE_URL
GitLab Repo: $GITLAB_REPO
Branch: $BRANCH
Region: $AWS_REGION
Resources: $CPU / $MEMORY
================================
EOF

echo "✅ Details saved to app-runner-details.txt"