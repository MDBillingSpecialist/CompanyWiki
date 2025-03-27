#!/bin/bash
# AWS App Runner Deployment Script for Company Wiki

set -e  # Exit on error

# Configuration
APP_NAME="company-wiki"
AWS_REGION=${AWS_REGION:-"us-east-1"}  # Default to us-east-1 if not set
GITHUB_REPO=$(git config --get remote.origin.url | sed 's/git@github.com://' | sed 's/\.git$//')

echo "==== Company Wiki Deployment to AWS App Runner ===="
echo "Application: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "GitHub Repo: $GITHUB_REPO"
echo

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is required but not installed."
    echo "Please install it: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
echo "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "Error: AWS credentials not configured or invalid."
    echo "Please run 'aws configure' to set up your AWS credentials."
    exit 1
fi
echo "AWS credentials verified."
echo

# Build and prepare the application
echo "Running tests to ensure everything works..."
npm run test

echo "Building application..."
npm run build

# Create the AWS App Runner service
echo "Creating/updating App Runner service..."
aws apprunner create-service \
    --service-name "$APP_NAME" \
    --source-configuration "{
        \"CodeRepository\": {
            \"RepositoryUrl\": \"https://github.com/$GITHUB_REPO\",
            \"SourceCodeVersion\": {
                \"Type\": \"BRANCH\",
                \"Value\": \"main\"
            },
            \"CodeConfiguration\": {
                \"ConfigurationSource\": \"REPOSITORY\",
                \"CodeConfigurationValues\": {
                    \"Runtime\": \"NODEJS_18\",
                    \"BuildCommand\": \"npm ci && npm run build\",
                    \"StartCommand\": \"node server.js\",
                    \"Port\": \"3000\",
                    \"RuntimeEnvironmentVariables\": {
                        \"NODE_ENV\": \"production\",
                        \"NEXT_TELEMETRY_DISABLED\": \"1\"
                    }
                }
            }
        },
        \"AutoDeploymentsEnabled\": true
    }" \
    --instance-configuration "{
        \"Cpu\": \"1 vCPU\",
        \"Memory\": \"2 GB\"
    }" \
    --health-check-configuration "{
        \"Protocol\": \"HTTP\",
        \"Path\": \"/\",
        \"Interval\": 10,
        \"Timeout\": 5,
        \"HealthyThreshold\": 3,
        \"UnhealthyThreshold\": 5
    }" \
    --region "$AWS_REGION"

echo
echo "Deployment initiated. It may take a few minutes for the service to be fully deployed."
echo "You can check the status in the AWS App Runner console:"
echo "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo
echo "Once deployed, your application will be available at the URL shown in the AWS console."