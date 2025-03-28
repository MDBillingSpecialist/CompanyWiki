#!/bin/bash
# Simple packaging script for Next.js app to deploy manually

set -e  # Exit on any error

echo "=================================================="
echo "  PACKAGING NEXT.JS APP FOR AWS DEPLOYMENT"
echo "=================================================="

# 1. Build the application
echo "Step 1: Building the Next.js application..."
npm run build

# 2. Create a package.json for production
echo "Step 2: Creating production package.json..."
cat > package.prod.json << EOF
{
  "name": "company-wiki",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# 3. Create deployment directory
echo "Step 3: Creating deployment directory..."
DEPLOY_DIR="deployment-package"
mkdir -p "$DEPLOY_DIR"

# 4. Copy necessary files
echo "Step 4: Copying necessary files..."
cp -r .next "$DEPLOY_DIR/"
cp -r public "$DEPLOY_DIR/"
cp -r content "$DEPLOY_DIR/"
cp server.js "$DEPLOY_DIR/"
cp package.prod.json "$DEPLOY_DIR/package.json"
cp next.config.js "$DEPLOY_DIR/"

# 5. Create zip archive
echo "Step 5: Creating zip archive..."
TIMESTAMP=$(date +%Y%m%d%H%M%S)
cd "$DEPLOY_DIR"
zip -r "../company-wiki-$TIMESTAMP.zip" .
cd ..

# 6. Cleanup
echo "Step 6: Cleaning up..."
rm -rf "$DEPLOY_DIR"
rm package.prod.json

echo "=================================================="
echo "  PACKAGING COMPLETE!"
echo "=================================================="
echo "Package: company-wiki-$TIMESTAMP.zip"
echo ""
echo "You can now manually upload this package to:"
echo "- AWS Elastic Beanstalk"
echo "- AWS Lambda (with a custom handler)"
echo "- AWS EC2 (via SSH)"
echo ""
echo "Or run the following command to deploy to Elastic Beanstalk:"
echo "aws elasticbeanstalk create-application-version \\"
echo "  --application-name \"company-wiki\" \\"
echo "  --version-label \"v-$TIMESTAMP\" \\"
echo "  --source-bundle \"S3Bucket=YOUR_BUCKET,S3Key=company-wiki-$TIMESTAMP.zip\""
echo "=================================================="