#!/bin/bash
# Deploy Company Wiki using Serverless Framework to AWS Lambda/API Gateway
# This is ideal for Next.js applications with API routes

set -e  # Exit on any error

# Configuration variables
STAGE="prod"
AWS_REGION="us-east-1"
SERVICE_NAME="company-wiki"

echo "==================================================="
echo "DEPLOYING COMPANY WIKI USING SERVERLESS FRAMEWORK"
echo "==================================================="
echo "Service: $SERVICE_NAME"
echo "Stage: $STAGE"
echo "AWS Region: $AWS_REGION"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Create serverless.yml file
echo "Step 2: Creating serverless configuration..."

cat > serverless.yml << EOF
service: ${SERVICE_NAME}

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${STAGE}
  region: ${AWS_REGION}
  memorySize: 1024
  timeout: 30
  environment:
    NODE_ENV: production

package:
  individually: true
  excludeDevDependencies: true

plugins:
  - serverless-next.js

custom:
  serverless-next:
    assetsBucketName: ${SERVICE_NAME}-assets-\${self:provider.stage}
    cloudFront: true
EOF

# 3. Install Serverless Framework and plugins
echo "Step 3: Installing Serverless Framework and plugins..."

# Check if serverless is installed globally
if ! command -v serverless &> /dev/null; then
  echo "Installing Serverless Framework globally..."
  npm install -g serverless
fi

# Install the serverless-next.js plugin
echo "Installing serverless-next.js plugin..."
npm install --save-dev serverless-next.js

echo "✅ Serverless Framework and plugins installed."

# 4. Deploy to AWS
echo "Step 4: Deploying to AWS..."
echo "This may take 10-15 minutes for the first deployment."

serverless deploy --verbose

echo "✅ Deployment initiated! Check the AWS console for details."

# 5. Save deployment information
echo "Step 5: Saving deployment information..."

# Get CloudFront distribution URL from serverless output
CLOUDFRONT_URL=$(serverless info --verbose | grep -i "domain name" | awk '{print $NF}')

# Save to file
cat > serverless-deploy-details.txt << EOF
AWS SERVERLESS DEPLOYMENT
================================
Deployment Date: $(date)
Service: ${SERVICE_NAME}
Stage: ${STAGE}
AWS Region: ${AWS_REGION}
URL: https://${CLOUDFRONT_URL}
================================

Your company wiki should be available at:
https://${CLOUDFRONT_URL}

For more details, run:
serverless info --verbose
================================
EOF

echo "==================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "==================================================="
echo "Service: ${SERVICE_NAME}"
echo "Stage: ${STAGE}"
echo "AWS Region: ${AWS_REGION}"
echo "URL: https://${CLOUDFRONT_URL}"
echo ""
echo "Your company wiki should be available shortly at:"
echo "https://${CLOUDFRONT_URL}"
echo ""
echo "For more details, run:"
echo "serverless info --verbose"
echo "==================================================="