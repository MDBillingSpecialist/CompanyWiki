#!/bin/bash
# Deploy Company Wiki to AWS Elastic Beanstalk
# A more reliable option for Next.js applications

set -e  # Exit on any error

# Configuration variables
APP_NAME="company-wiki"
AWS_REGION="us-east-1"
ENVIRONMENT_NAME="company-wiki-prod"
SOLUTION_STACK="64bit Amazon Linux 2023 v6.0.3 running Node.js 18"

echo "==================================================="
echo "DEPLOYING COMPANY WIKI TO AWS ELASTIC BEANSTALK"
echo "==================================================="
echo "App name: $APP_NAME"
echo "AWS Region: $AWS_REGION"
echo "Environment: $ENVIRONMENT_NAME"
echo "Platform: $SOLUTION_STACK"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Package the application
echo "Step 2: Packaging the application..."

# Create a deployment package
TIMESTAMP=$(date +%Y%m%d%H%M%S)
ZIP_FILE="company-wiki-$TIMESTAMP.zip"

# Create Procfile for Elastic Beanstalk
echo "Creating Procfile..."
echo "web: node server.js" > Procfile

# Create .ebignore file to control what gets deployed
echo "Creating .ebignore..."
cat > .ebignore << EOF
.git
.github
.gitlab
node_modules
.next/cache
e2e
__tests__
.env*
*.log
*.md
EOF

# Create elastic beanstalk config
mkdir -p .ebextensions
cat > .ebextensions/nodecommand.config << EOF
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node server.js"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: 1
    PORT: 8081
  aws:elasticbeanstalk:container:nodejs:staticfiles:
    /public: public
EOF

cat > .ebextensions/options.config << EOF
option_settings:
  aws:elasticbeanstalk:environment:proxy:staticfiles:
    /public: public
  aws:autoscaling:launchconfiguration:
    InstanceType: t3.small
    RootVolumeSize: 16
  aws:elasticbeanstalk:environment:
    LoadBalancerType: application
  aws:elbv2:listener:default:
    ListenerEnabled: true
    Protocol: HTTP
    DefaultProcess: default
  aws:elasticbeanstalk:environment:process:default:
    Port: 8081
    Protocol: HTTP
    HealthCheckPath: /health
EOF

# Package the application
echo "Creating deployment package: $ZIP_FILE"
zip -r "$ZIP_FILE" . -x "node_modules/*" ".git/*" ".next/cache/*" "e2e/*" "__tests__/*"

echo "✅ Application packaged successfully: $ZIP_FILE"

# 3. Create Elastic Beanstalk application (if it doesn't exist)
echo "Step 3: Creating/updating Elastic Beanstalk application..."

# Check if application exists
if ! aws elasticbeanstalk describe-applications --application-names "$APP_NAME" --region "$AWS_REGION" 2>/dev/null | grep -q "$APP_NAME"; then
  echo "Creating Elastic Beanstalk application: $APP_NAME"
  aws elasticbeanstalk create-application \
    --application-name "$APP_NAME" \
    --description "Company Wiki - Next.js application" \
    --region "$AWS_REGION"
else
  echo "Using existing Elastic Beanstalk application: $APP_NAME"
fi

# 4. Create an application version
echo "Step 4: Creating application version..."

# Generate a unique version label
VERSION_LABEL="v-$TIMESTAMP"

# Create S3 bucket if it doesn't exist (or use existing one)
BUCKET_NAME="elasticbeanstalk-$AWS_REGION-$(aws sts get-caller-identity --query 'Account' --output text)"
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  echo "Creating S3 bucket: $BUCKET_NAME"
  aws s3 mb "s3://$BUCKET_NAME" --region "$AWS_REGION"
else
  echo "Using existing S3 bucket: $BUCKET_NAME"
fi

# Upload the deployment package to S3
echo "Uploading deployment package to S3..."
aws s3 cp "$ZIP_FILE" "s3://$BUCKET_NAME/$ZIP_FILE" --region "$AWS_REGION"

# Create the application version
echo "Creating application version: $VERSION_LABEL"
aws elasticbeanstalk create-application-version \
  --application-name "$APP_NAME" \
  --version-label "$VERSION_LABEL" \
  --description "Deployment $TIMESTAMP" \
  --source-bundle "S3Bucket=$BUCKET_NAME,S3Key=$ZIP_FILE" \
  --auto-create-application \
  --region "$AWS_REGION"

# 5. Create or update environment
echo "Step 5: Creating/updating Elastic Beanstalk environment..."

# Check if environment exists
if ! aws elasticbeanstalk describe-environments --application-name "$APP_NAME" --environment-names "$ENVIRONMENT_NAME" --region "$AWS_REGION" 2>/dev/null | grep -q "$ENVIRONMENT_NAME"; then
  echo "Creating new Elastic Beanstalk environment: $ENVIRONMENT_NAME"
  # Create the environment
  ENV_RESULT=$(aws elasticbeanstalk create-environment \
    --application-name "$APP_NAME" \
    --environment-name "$ENVIRONMENT_NAME" \
    --solution-stack-name "$SOLUTION_STACK" \
    --version-label "$VERSION_LABEL" \
    --option-settings file://.ebextensions/options.config \
    --region "$AWS_REGION")
else
  echo "Updating existing Elastic Beanstalk environment: $ENVIRONMENT_NAME"
  # Update the environment
  ENV_RESULT=$(aws elasticbeanstalk update-environment \
    --application-name "$APP_NAME" \
    --environment-name "$ENVIRONMENT_NAME" \
    --version-label "$VERSION_LABEL" \
    --region "$AWS_REGION")
fi

# Extract environment details
ENVIRONMENT_ID=$(echo $ENV_RESULT | jq -r '.EnvironmentId')
ENVIRONMENT_URL=$(echo $ENV_RESULT | jq -r '.CNAME')

echo "✅ Environment update initiated!"
echo "Environment ID: $ENVIRONMENT_ID"
echo "Environment URL: $ENVIRONMENT_URL"

# Clean up temporary files
echo "Cleaning up temporary files..."
rm -f Procfile
rm -rf .ebextensions

# 6. Save deployment details
echo "Saving details to elastic-beanstalk-deploy-details.txt"
cat > elastic-beanstalk-deploy-details.txt << EOF
AWS ELASTIC BEANSTALK DEPLOYMENT
================================
Deployment Date: $(date)
Application Name: $APP_NAME
Environment Name: $ENVIRONMENT_NAME
Version Label: $VERSION_LABEL
Environment URL: http://$ENVIRONMENT_URL
AWS Region: $AWS_REGION
================================

Monitor deployment status:
https://$AWS_REGION.console.aws.amazon.com/elasticbeanstalk/home?region=$AWS_REGION#/environment/dashboard?applicationName=$APP_NAME&environmentId=$ENVIRONMENT_ID
================================
EOF

echo "==================================================="
echo "✅ AWS ELASTIC BEANSTALK DEPLOYMENT INITIATED!"
echo "==================================================="
echo "Application Name: $APP_NAME"
echo "Environment Name: $ENVIRONMENT_NAME"
echo "Version Label: $VERSION_LABEL"
echo "Environment URL: http://$ENVIRONMENT_URL"
echo ""
echo "Monitor deployment status:"
echo "https://$AWS_REGION.console.aws.amazon.com/elasticbeanstalk/home?region=$AWS_REGION#/environment/dashboard?applicationName=$APP_NAME&environmentId=$ENVIRONMENT_ID"
echo ""
echo "Deployment will take several minutes to complete."
echo "==================================================="