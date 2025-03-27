#!/bin/bash
# Deployment verification script for AWS App Runner

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
SERVICE_URL=${SERVICE_URL:-""}  # Can be provided or will be looked up

# Banner
echo "======================================================"
echo "       COMPANY WIKI DEPLOYMENT VERIFICATION"
echo "======================================================"
log "Application: $APP_NAME"
log "AWS Region: $AWS_REGION"
echo "------------------------------------------------------"

# Check required tools
if ! command -v curl &> /dev/null; then
  error "curl is required but not installed."
  exit 1
fi

if ! command -v jq &> /dev/null; then
  error "jq is required but not installed."
  exit 1
fi

# If no service URL is provided, look it up
if [ -z "$SERVICE_URL" ]; then
  # Check for AWS CLI
  if ! command -v aws &> /dev/null; then
    error "AWS CLI is required but not installed."
    exit 1
  fi

  # Check AWS credentials
  log "Checking AWS credentials..."
  if ! aws sts get-caller-identity &> /dev/null; then
    error "AWS credentials not configured or invalid."
    exit 1
  fi

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

  # Get service URL
  SERVICE_URL=$(aws apprunner describe-service \
    --service-arn "$SERVICE_ARN" \
    --query "Service.ServiceUrl" \
    --output text \
    --region "$AWS_REGION")
fi

if [ -z "$SERVICE_URL" ]; then
  error "Could not determine service URL!"
  exit 1
fi

log "Service URL: https://$SERVICE_URL"
echo "------------------------------------------------------"

# Verify health endpoint
log "Checking health endpoint..."
HEALTH_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVICE_URL/health")

if [ "$HEALTH_RESULT" == "200" ]; then
  success "Health endpoint is responding correctly (200 OK)"
  HEALTH_DATA=$(curl -s "https://$SERVICE_URL/health")
  echo "Health data:"
  echo "$HEALTH_DATA" | jq . || echo "$HEALTH_DATA"
else
  warn "Health endpoint returned HTTP $HEALTH_RESULT instead of 200"
fi

# Verify main page
log "Checking main page..."
MAIN_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVICE_URL/")

if [ "$MAIN_RESULT" == "200" ]; then
  success "Main page is loading correctly (200 OK)"
else
  error "Main page returned HTTP $MAIN_RESULT instead of 200"
fi

# Check HIPAA page
log "Checking HIPAA section..."
HIPAA_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVICE_URL/wiki/hipaa")

if [ "$HIPAA_RESULT" == "200" ]; then
  success "HIPAA section is loading correctly (200 OK)"
else
  warn "HIPAA section returned HTTP $HIPAA_RESULT instead of 200"
fi

# Check API endpoint
log "Checking API endpoint..."
API_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "https://$SERVICE_URL/api/content?path=hipaa")

if [ "$API_RESULT" == "200" ]; then
  success "API endpoint is responding correctly (200 OK)"
else
  warn "API endpoint returned HTTP $API_RESULT instead of 200"
fi

# Overall status
echo "------------------------------------------------------"
log "Verification results:"
if [ "$HEALTH_RESULT" == "200" ] && [ "$MAIN_RESULT" == "200" ]; then
  success "Deployment appears to be SUCCESSFUL"
  log "The application is accessible and responding to requests."
else
  warn "Deployment verification found ISSUES"
  log "Some endpoints are not responding correctly."
fi
echo "======================================================"