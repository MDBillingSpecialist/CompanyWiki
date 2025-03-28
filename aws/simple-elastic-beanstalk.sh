#!/bin/bash
# Very simple Elastic Beanstalk deployment for Next.js
# More reliable than App Runner and works with API routes

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki"
ENV_NAME="company-wiki-env"
AWS_REGION="us-east-1"
NODE_VERSION="18"  # Must match your local Node version

echo "=================================================="
echo "  DEPLOYING NEXT.JS TO AWS ELASTIC BEANSTALK"
echo "=================================================="
echo "App: $APP_NAME"
echo "Environment: $ENV_NAME"
echo "Region: $AWS_REGION"
echo "Node version: $NODE_VERSION"
echo "=================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Set up Elastic Beanstalk files
echo "Step 2: Setting up Elastic Beanstalk configuration files..."

# Create .ebignore (to control what gets deployed)
echo "Creating .ebignore..."
cat > .ebignore << EOF
node_modules/
.git/
.github/
.gitlab/
__tests__/
e2e/
.next/cache/
EOF

# Create Procfile
echo "Creating Procfile..."
cat > Procfile << EOF
web: npm start
EOF

# Create .ebextensions directory and config files
mkdir -p .ebextensions

# Create nodecommand.config
echo "Creating node command configuration..."
cat > .ebextensions/nodecommand.config << EOF
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: ${NODE_VERSION}
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    NPM_USE_PRODUCTION: false
EOF

# Create staticfiles.config
echo "Creating static files configuration..."
cat > .ebextensions/staticfiles.config << EOF
option_settings:
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /public: public
    /_next/static: .next/static
EOF

# 3. Build the Next.js application
echo "Step 3: Building the Next.js application..."
npm run build

# 4. Create deployment package
echo "Step 4: Creating deployment package..."
TIMESTAMP=$(date +%Y%m%d%H%M%S)
ZIP_FILE="${APP_NAME}-${TIMESTAMP}.zip"

echo "Creating ZIP file: $ZIP_FILE"
zip -r "$ZIP_FILE" . -x "node_modules/*" ".git/*" ".next/cache/*"

# 5. Set up Elastic Beanstalk application
echo "Step 5: Setting up Elastic Beanstalk application..."

# Check if application exists
if ! aws elasticbeanstalk describe-applications --application-names "$APP_NAME" 2>&1 | grep -q "$APP_NAME"; then
  echo "Creating Elastic Beanstalk application..."
  aws elasticbeanstalk create-application --application-name "$APP_NAME"
else
  echo "Using existing Elastic Beanstalk application."
fi

# 6. Create S3 bucket for deployment artifacts
echo "Step 6: Setting up S3 bucket for deployment artifacts..."
S3_BUCKET="elasticbeanstalk-${AWS_REGION}-$(aws sts get-caller-identity --query 'Account' --output text)"

# Check if bucket exists
if ! aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  echo "Creating S3 bucket: $S3_BUCKET"
  aws s3 mb "s3://$S3_BUCKET" --region "$AWS_REGION"
else
  echo "Using existing S3 bucket: $S3_BUCKET"
fi

# 7. Upload deployment package to S3
echo "Step 7: Uploading deployment package to S3..."
aws s3 cp "$ZIP_FILE" "s3://$S3_BUCKET/$ZIP_FILE"

# 8. Create application version
echo "Step 8: Creating application version..."
VERSION_LABEL="v-$TIMESTAMP"

aws elasticbeanstalk create-application-version \
  --application-name "$APP_NAME" \
  --version-label "$VERSION_LABEL" \
  --source-bundle "S3Bucket=$S3_BUCKET,S3Key=$ZIP_FILE"

# 9. Check for existing environment
echo "Step 9: Checking for existing environment..."
ENVIRONMENT_EXISTS=$(aws elasticbeanstalk describe-environments \
  --application-name "$APP_NAME" \
  --environment-names "$ENV_NAME" \
  --query "Environments[?Status!='Terminated'].Status" \
  --output text)

if [ -z "$ENVIRONMENT_EXISTS" ]; then
  # Create new environment
  echo "Creating new Elastic Beanstalk environment..."
  aws elasticbeanstalk create-environment \
    --application-name "$APP_NAME" \
    --environment-name "$ENV_NAME" \
    --solution-stack-name "64bit Amazon Linux 2023 v6.0.3 running Node.js 18" \
    --version-label "$VERSION_LABEL" \
    --option-settings \
      "Namespace=aws:autoscaling:launchconfiguration,OptionName=IamInstanceProfile,Value=aws-elasticbeanstalk-ec2-role" \
      "Namespace=aws:elasticbeanstalk:environment,OptionName=EnvironmentType,Value=SingleInstance"
else
  # Update existing environment
  echo "Updating existing Elastic Beanstalk environment..."
  aws elasticbeanstalk update-environment \
    --application-name "$APP_NAME" \
    --environment-name "$ENV_NAME" \
    --version-label "$VERSION_LABEL"
fi

# 10. Wait for deployment to complete
echo "Step 10: Waiting for deployment to complete..."
echo "This may take several minutes..."

aws elasticbeanstalk wait environment-updated \
  --application-name "$APP_NAME" \
  --environment-names "$ENV_NAME"

# 11. Get environment URL
ENVIRONMENT_URL=$(aws elasticbeanstalk describe-environments \
  --application-name "$APP_NAME" \
  --environment-names "$ENV_NAME" \
  --query "Environments[0].CNAME" \
  --output text)

# 12. Save deployment details
echo "Saving deployment details to eb-deploy-details.txt"
cat > eb-deploy-details.txt << EOF
AWS ELASTIC BEANSTALK DEPLOYMENT
================================
Deployment Date: $(date)
Application: $APP_NAME
Environment: $ENV_NAME
Version: $VERSION_LABEL
URL: http://$ENVIRONMENT_URL
AWS Region: $AWS_REGION
================================

Your company wiki is now available at:
http://$ENVIRONMENT_URL

To check deployment status:
https://$AWS_REGION.console.aws.amazon.com/elasticbeanstalk/home?region=$AWS_REGION#/environment/dashboard?applicationName=$APP_NAME&environmentId=$ENV_NAME
================================
EOF

# Clean up temporary files
echo "Cleaning up temporary files..."
rm -f Procfile
rm -rf .ebextensions

echo "=================================================="
echo "  DEPLOYMENT COMPLETE!"
echo "=================================================="
echo "Application: $APP_NAME"
echo "Environment: $ENV_NAME"
echo "URL: http://$ENVIRONMENT_URL"
echo ""
echo "Your company wiki is now available at:"
echo "http://$ENVIRONMENT_URL"
echo ""
echo "Deployment details saved to: eb-deploy-details.txt"
echo "=================================================="