#!/bin/bash
# Simple AWS App Runner Deployment Script for Company Wiki

set -e  # Exit on any error

# Configuration variables
APP_NAME=${APP_NAME:-"company-wiki"}
AWS_REGION=${AWS_REGION:-"us-east-1"}
CPU=${CPU:-"1 vCPU"}
MEMORY=${MEMORY:-"2 GB"}
BRANCH=${BRANCH:-"main"}
GITLAB_REPO=${CI_PROJECT_PATH:-"intelligent-systems-and-development/company-wiki"}

# Simple logging
echo "===== COMPANY WIKI DEPLOYMENT ====="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "GitLab Repo: $GITLAB_REPO"
echo "Branch: $BRANCH"
echo "Resources: $CPU / $MEMORY"
echo "====================================="

# Check AWS CLI is configured
echo "Verifying AWS credentials..."
aws sts get-caller-identity

# Verify required files exist
if [ ! -f "apprunner.yaml" ]; then
  echo "ERROR: apprunner.yaml file not found!"
  exit 1
fi

echo "Required configuration files verified."

# Check if service exists
SERVICE_ARN=$(aws apprunner list-services \
  --query "ServiceSummaryList[?ServiceName=='$APP_NAME'].ServiceArn" \
  --output text \
  --region "$AWS_REGION")

if [ -z "$SERVICE_ARN" ]; then
  echo "Creating new App Runner service: $APP_NAME"
  
  # Create a new service
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
            }
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
  
  # Extract service ARN from result
  SERVICE_ARN=$(echo $RESULT | jq -r '.Service.ServiceArn')
  echo "Service created with ARN: $SERVICE_ARN"
  
else
  echo "Updating existing App Runner service: $APP_NAME"
  
  # Update existing service
  aws apprunner update-service \
    --service-arn "$SERVICE_ARN" \
    --source-configuration "{
        \"CodeRepository\": {
            \"RepositoryUrl\": \"https://gitlab.com/$GITLAB_REPO\",
            \"SourceCodeVersion\": {
                \"Type\": \"BRANCH\",
                \"Value\": \"$BRANCH\"
            },
            \"CodeConfiguration\": {
                \"ConfigurationSource\": \"REPOSITORY\"
            }
        },
        \"AutoDeploymentsEnabled\": true
    }" \
    --health-check-configuration "{
        \"Protocol\": \"HTTP\",
        \"Path\": \"/health\",
        \"Interval\": 15,
        \"Timeout\": 5,
        \"HealthyThreshold\": 2,
        \"UnhealthyThreshold\": 3
    }" \
    --region "$AWS_REGION"
    
  echo "Service updated: $SERVICE_ARN"
fi

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --query "Service.ServiceUrl" \
  --output text \
  --region "$AWS_REGION")

echo "===== DEPLOYMENT COMPLETE ====="
echo "Service ARN: $SERVICE_ARN"
echo "Service URL: https://$SERVICE_URL"
echo ""
echo "Monitor in AWS console:"
echo "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo ""
echo "Check health at: https://$SERVICE_URL/health"
echo "====================================="

# Export the service URL for GitLab CI
echo "SERVICE_URL=$SERVICE_URL" > /builds/intelligent-systems-and-development/company-wiki/deploy.env