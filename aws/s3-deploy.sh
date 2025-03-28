#!/bin/bash
# Deploy Company Wiki to AWS S3 and CloudFront (simplest option)
# This is a highly reliable option for static Next.js sites

set -e  # Exit on any error

# Configuration variables
S3_BUCKET_NAME="company-wiki-$RANDOM"
AWS_REGION="us-east-1"
CLOUDFRONT_COMMENT="Company Wiki Distribution"

echo "==================================================="
echo "DEPLOYING COMPANY WIKI TO AWS S3 & CLOUDFRONT"
echo "==================================================="
echo "S3 Bucket: $S3_BUCKET_NAME"
echo "AWS Region: $AWS_REGION"
echo "==================================================="

# 1. Verify AWS credentials
echo "Step 1: Verifying AWS credentials..."
aws sts get-caller-identity

# 2. Build the Next.js application for static export
echo "Step 2: Building the Next.js application..."
echo "⚠️ This will modify your next.config.js temporarily"

# Backup the original next.config.js
cp next.config.js next.config.js.backup

# Update next.config.js to enable static exports
cat > next.config.js << EOF
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

module.exports = nextConfig
EOF

# Build the application
npm run build

# Restore the original next.config.js
mv next.config.js.backup next.config.js

echo "✅ Build complete"

# 3. Create S3 bucket for hosting
echo "Step 3: Creating S3 bucket for hosting..."

# Create S3 bucket
aws s3api create-bucket \
  --bucket "$S3_BUCKET_NAME" \
  --region "$AWS_REGION" || {
  echo "⚠️ Bucket creation failed. Trying different bucket name..."
  S3_BUCKET_NAME="company-wiki-$(date +%Y%m%d%H%M%S)"
  aws s3api create-bucket \
    --bucket "$S3_BUCKET_NAME" \
    --region "$AWS_REGION"
}

# Configure bucket for static website hosting
aws s3 website "s3://$S3_BUCKET_NAME" \
  --index-document index.html \
  --error-document 404.html

# Set bucket policy to allow public access
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$S3_BUCKET_NAME/*"
    }
  ]
}
EOF

# Apply the bucket policy
aws s3api put-bucket-policy \
  --bucket "$S3_BUCKET_NAME" \
  --policy file:///tmp/bucket-policy.json

echo "✅ S3 bucket created and configured for static website hosting"

# 4. Upload the build to S3
echo "Step 4: Uploading build to S3..."

# Upload the build to S3
aws s3 sync ./out/ "s3://$S3_BUCKET_NAME/" \
  --delete \
  --acl public-read

echo "✅ Build uploaded to S3"

# 5. Create CloudFront distribution (optional)
echo "Step 5: Creating CloudFront distribution..."

# Create CloudFront distribution
DISTRIBUTION_RESULT=$(aws cloudfront create-distribution \
  --origin-domain-name "$S3_BUCKET_NAME.s3.amazonaws.com" \
  --default-root-object "index.html" \
  --comment "$CLOUDFRONT_COMMENT" \
  --enabled)

# Extract distribution details
DISTRIBUTION_ID=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.DomainName')

echo "✅ CloudFront distribution created"

# 6. Save deployment details
echo "Saving details to s3-deploy-details.txt"
cat > s3-deploy-details.txt << EOF
AWS S3 & CLOUDFRONT DEPLOYMENT
================================
Deployment Date: $(date)
S3 Bucket: $S3_BUCKET_NAME
S3 Website URL: http://$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com
CloudFront Distribution ID: $DISTRIBUTION_ID
CloudFront URL: https://$DISTRIBUTION_DOMAIN
AWS Region: $AWS_REGION
================================

Your site is now available at:
- S3 Website URL: http://$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com
- CloudFront URL (preferred): https://$DISTRIBUTION_DOMAIN

Notes:
- CloudFront may take 10-15 minutes to fully deploy
- Use the CloudFront URL for better performance and HTTPS
================================
EOF

echo "==================================================="
echo "✅ DEPLOYMENT COMPLETE!"
echo "==================================================="
echo "S3 Bucket: $S3_BUCKET_NAME"
echo "S3 Website URL: http://$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo "CloudFront Distribution ID: $DISTRIBUTION_ID"
echo "CloudFront URL: https://$DISTRIBUTION_DOMAIN"
echo ""
echo "Your site is now available at:"
echo "- S3 Website URL: http://$S3_BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
echo "- CloudFront URL (preferred): https://$DISTRIBUTION_DOMAIN"
echo ""
echo "Notes:"
echo "- CloudFront may take 10-15 minutes to fully deploy"
echo "- Use the CloudFront URL for better performance and HTTPS"
echo "==================================================="