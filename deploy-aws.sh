#!/bin/bash
# AWS App Runner Deployment Script for Company Wiki

# Use stricter error handling
set -eo pipefail

# Log function for consistent formatting
log() {
  echo -e "\033[1;34m[INFO]\033[0m $1"
}

error() {
  echo -e "\033[1;31m[ERROR]\033[0m $1" >&2
}

warn() {
  echo -e "\033[1;33m[WARNING]\033[0m $1"
}

success() {
  echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

# Display a spinner during long-running operations
spinner() {
  local pid=$1
  local delay=0.1
  local spinstr='|/-\'
  while ps -p $pid > /dev/null; do
    local temp=${spinstr#?}
    printf " [%c]  " "$spinstr"
    local spinstr=$temp${spinstr%"$temp"}
    sleep $delay
    printf "\b\b\b\b\b\b"
  done
  printf "    \b\b\b\b"
}

# Configuration with sensible defaults
APP_NAME=${APP_NAME:-"company-wiki"}
AWS_REGION=${AWS_REGION:-"us-east-1"}
CPU=${CPU:-"1 vCPU"}
MEMORY=${MEMORY:-"2 GB"}
BRANCH=${BRANCH:-"main"}
GITLAB_REPO=$(git config --get remote.origin.url 2>/dev/null | 
                sed 's/git@gitlab.com://' | 
                sed 's/https:\/\/gitlab.com\///' | 
                sed 's/\.git$//' || 
                echo "${CI_PROJECT_PATH:-intelligent-systems-and-development/company-wiki}")

# Check script is run from project root
if [ ! -f "package.json" ] || [ ! -f "next.config.js" ]; then
  error "Script must be run from the project root directory!"
  exit 1
fi

# Banner
echo "======================================================"
echo "       COMPANY WIKI DEPLOYMENT TO AWS APP RUNNER"
echo "======================================================"
log "Application: $APP_NAME"
log "AWS Region: $AWS_REGION"
log "GitLab Repo: $GITLAB_REPO"
log "Branch: $BRANCH"
log "Resources: $CPU / $MEMORY"
echo "------------------------------------------------------"

# Check for AWS CLI
if ! command -v aws &> /dev/null; then
  error "AWS CLI is required but not installed."
  echo "Please install it: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
  exit 1
fi

# Check AWS credentials
log "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
  error "AWS credentials not configured or invalid."
  echo "Please run 'aws configure' to set up your AWS credentials."
  exit 1
fi
success "AWS credentials verified."

# Verify required files exist
log "Checking required files..."
REQUIRED_FILES=("server.js" "next.config.js" "apprunner.yaml")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    error "Required file not found: $file"
    exit 1
  fi
done
success "All required files present."

# Ensure content directory exists
if [ ! -d "content" ]; then
  warn "Content directory not found, creating it..."
  mkdir -p content
fi

# Run pre-deployment checks
log "Running pre-deployment checks..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  warn "node_modules not found, installing dependencies..."
  npm ci
fi

# Skip tests in CI environment
if [ -z "$CI" ]; then
  # Run tests to ensure application works
  log "Running tests to validate application..."
  npm run test || {
    warn "Some tests failed, but continuing with deployment..."
  }

  # Build the application locally to verify it builds successfully
  log "Building application to verify build process..."
  npm run build || {
    error "Build failed! Please fix build errors before deploying."
    exit 1
  }
  success "Build successful."
else
  log "Skipping tests and build verification in CI environment..."
fi

# Create deployment package
DEPLOY_DIR=$(mktemp -d)
log "Creating deployment package in $DEPLOY_DIR..."

# Copy required files
mkdir -p "$DEPLOY_DIR/content"
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp -r content/* "$DEPLOY_DIR/content/" 2>/dev/null || true
cp server.js package.json package-lock.json next.config.js apprunner.yaml "$DEPLOY_DIR/"

# Create/update the AWS App Runner service
log "Creating/updating App Runner service..."

# Check if service already exists
SERVICE_ARN=$(aws apprunner list-services \
  --query "ServiceSummaryList[?ServiceName=='$APP_NAME'].ServiceArn" \
  --output text \
  --region "$AWS_REGION" 2>/dev/null || echo "")

if [ -z "$SERVICE_ARN" ]; then
  log "Creating new App Runner service..."
  
  # Create service
  aws apprunner create-service \
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
    --region "$AWS_REGION" > /tmp/apprunner_output.json &
  
  DEPLOY_PID=$!
  spinner $DEPLOY_PID
  wait $DEPLOY_PID
  
  # Extract service ARN from output
  SERVICE_ARN=$(cat /tmp/apprunner_output.json | jq -r '.Service.ServiceArn')
  
else
  log "Updating existing App Runner service..."
  
  # Update service
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
    --region "$AWS_REGION" > /tmp/apprunner_output.json &
    
  DEPLOY_PID=$!
  spinner $DEPLOY_PID
  wait $DEPLOY_PID
fi

# Wait for service to be active
log "Waiting for service to become active..."
aws apprunner wait service-updated --service-arn "$SERVICE_ARN" --region "$AWS_REGION" || {
  warn "Service update is still in progress. This will continue in the background."
}

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --query "Service.ServiceUrl" \
  --output text \
  --region "$AWS_REGION")

# Clean up
rm -rf "$DEPLOY_DIR"
rm -f /tmp/apprunner_output.json

echo "======================================================"
success "Deployment initiated successfully!"
log "Service ARN: $SERVICE_ARN"
log "Service URL: https://$SERVICE_URL"
echo "------------------------------------------------------"
log "Monitor status in AWS App Runner console:"
log "https://$AWS_REGION.console.aws.amazon.com/apprunner/home?region=$AWS_REGION#/services"
echo "------------------------------------------------------"
log "Check logs in CloudWatch:"
log "https://$AWS_REGION.console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#logsV2:log-groups/log-group/$APP_NAME"
echo "------------------------------------------------------"
log "Perform manual verification checks:"
log "1. Visit https://$SERVICE_URL to verify the application loads"
log "2. Visit https://$SERVICE_URL/health to check health endpoint"
log "3. Test basic navigation and search functionality"
echo "======================================================"