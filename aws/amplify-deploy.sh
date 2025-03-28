#!/bin/bash
# Deploy Company Wiki to AWS Amplify
# This is a much better option for Next.js applications

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki"
AWS_REGION="us-east-1"
GITLAB_REPO="intelligent-systems-and-development/company-wiki"
BRANCH="main"

echo "==================================================="
echo "DEPLOYING COMPANY WIKI TO AWS AMPLIFY"
echo "==================================================="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "Repository: $GITLAB_REPO"
echo "Branch: $BRANCH"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Create Amplify app
echo "Step 2: Creating Amplify app..."

# Generate a unique app name with timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)
FULL_APP_NAME="${APP_NAME}-${TIMESTAMP}"

# Create Amplify app
echo "Creating Amplify app: $FULL_APP_NAME"
RESULT=$(aws amplify create-app \
  --name "$FULL_APP_NAME" \
  --region "$AWS_REGION" \
  --platform WEB \
  --description "Company Wiki - Next.js application" \
  --enable-auto-branch-creation \
  --enable-branch-auto-build \
  --enable-branch-auto-deletion \
  --auto-branch-creation-patterns $BRANCH \
  --auto-branch-creation-config "{
      \"BasicAuthConfig\": {
          \"EnableBasicAuth\": false
      },
      \"BuildSpec\": \"version: 1\nfrontend:\n  phases:\n    preBuild:\n      commands:\n        - npm ci\n    build:\n      commands:\n        - npm run build\n  artifacts:\n    baseDirectory: .next\n    files:\n      - '**/*'\n  cache:\n    paths:\n      - node_modules/**/*\",
      \"EnableAutoBuild\": true,
      \"EnablePullRequestPreview\": false,
      \"EnvironmentVariables\": {
          \"NODE_ENV\": \"production\",
          \"NEXT_TELEMETRY_DISABLED\": \"1\"
      }
  }")

APP_ID=$(echo $RESULT | jq -r '.app.appId')
DEFAULT_DOMAIN=$(echo $RESULT | jq -r '.app.defaultDomain')

echo "✅ Amplify app created!"
echo "App ID: $APP_ID"
echo "Default Domain: $DEFAULT_DOMAIN"

# 3. Set up repository access (manual step required)
echo "Step 3: Setting up repository access..."
echo ""
echo "⚠️ IMPORTANT: You need to manually connect your GitLab repository in the AWS Amplify console."
echo "Go to: https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
echo "Click 'Connect repository' and follow the steps to connect your GitLab repository."
echo ""

# 4. Save deployment details
echo "Saving details to amplify-deploy-details.txt"
cat > amplify-deploy-details.txt << EOF
AWS AMPLIFY DEPLOYMENT
================================
Deployment Date: $(date)
App Name: $FULL_APP_NAME
App ID: $APP_ID
Default Domain: $DEFAULT_DOMAIN
AWS Region: $AWS_REGION
================================

Next steps:
1. Go to https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID
2. Connect your GitLab repository
3. Your application will be automatically built and deployed

Once deployed, your app will be available at:
https://main.$DEFAULT_DOMAIN
================================
EOF

echo "==================================================="
echo "✅ AWS AMPLIFY SETUP COMPLETE!"
echo "==================================================="
echo "App Name: $FULL_APP_NAME"
echo "App ID: $APP_ID"
echo "Default Domain: $DEFAULT_DOMAIN"
echo ""
echo "Next steps:"
echo "1. Go to https://$AWS_REGION.console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
echo "2. Connect your GitLab repository"
echo "3. Your application will be automatically built and deployed"
echo ""
echo "Once deployed, your app will be available at:"
echo "https://main.$DEFAULT_DOMAIN"
echo "==================================================="