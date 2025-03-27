#!/bin/bash
# Rollback script for AWS App Runner deployment

# Use strict error handling
set -eo pipefail

# Log functions with colors
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

# Configuration
APP_NAME=${APP_NAME:-"company-wiki"}
AWS_REGION=${AWS_REGION:-"us-east-1"}

# Banner
echo "======================================================"
echo "       COMPANY WIKI DEPLOYMENT ROLLBACK"
echo "======================================================"
log "Application: $APP_NAME"
log "AWS Region: $AWS_REGION"
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

# Get the service ARN
log "Finding App Runner service..."
SERVICE_ARN=$(aws apprunner list-services \
  --query "ServiceSummaryList[?ServiceName=='$APP_NAME'].ServiceArn" \
  --output text \
  --region "$AWS_REGION" 2>/dev/null)

if [ -z "$SERVICE_ARN" ]; then
  error "App Runner service '$APP_NAME' not found in region $AWS_REGION."
  exit 1
fi
success "Found service: $SERVICE_ARN"

# Get service details
log "Getting deployment details..."
DEPLOYMENTS=$(aws apprunner list-operations \
  --service-arn "$SERVICE_ARN" \
  --region "$AWS_REGION" \
  --query "OperationSummaryList[?Type=='START_DEPLOYMENT']" \
  --output json)

# Extract the previous deployment ID (second most recent)
DEPLOY_COUNT=$(echo "$DEPLOYMENTS" | jq '. | length')

if [ "$DEPLOY_COUNT" -lt 2 ]; then
  warn "No previous deployments found to roll back to."
  log "The service has only one deployment. Consider creating a new deployment instead."
  exit 1
fi

PREV_DEPLOY_ID=$(echo "$DEPLOYMENTS" | jq -r '.[1].Id')
success "Previous deployment ID: $PREV_DEPLOY_ID"

# Confirm rollback
echo "------------------------------------------------------"
log "This will roll back to the previous deployment."
log "All recent changes will be lost."
echo "------------------------------------------------------"
read -p "Do you want to proceed with rollback? (y/n): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  log "Rollback cancelled by user."
  exit 0
fi

# Perform rollback
log "Initiating rollback..."

aws apprunner start-deployment \
  --service-arn "$SERVICE_ARN" \
  --region "$AWS_REGION"

# Wait for deployment to complete
log "Waiting for rollback to complete..."
aws apprunner wait service-updated \
  --service-arn "$SERVICE_ARN" \
  --region "$AWS_REGION" || {
    warn "Rollback is still in progress. This will continue in the background."
  }

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --query "Service.ServiceUrl" \
  --output text \
  --region "$AWS_REGION")

echo "======================================================"
success "Rollback initiated successfully!"
log "Service URL: https://$SERVICE_URL"
echo "------------------------------------------------------"
log "Verify the rollback by checking:"
log "1. Visit https://$SERVICE_URL to confirm the application works"
log "2. Visit https://$SERVICE_URL/health to verify health endpoint"
log "3. Check CloudWatch logs for any errors"
echo "======================================================"