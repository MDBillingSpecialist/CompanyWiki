# AWS Amplify Setup Guide for Company Wiki

This guide will help you deploy your Next.js Company Wiki to AWS Amplify. We've already prepared your repository with the necessary configuration files.

## Pre-Deployment Tasks (Already Completed)

1. ✅ Created `amplify.yml` in the root of your repository
2. ✅ Updated `next.config.js` for Amplify compatibility
   - Changed output from 'export' to 'standalone'
   - Added proper configuration for images

## Step 1: Generate GitLab Access Token

1. Sign in to GitLab
2. Go to your profile settings (click your avatar → Settings)
3. In the left sidebar, navigate to "Access Tokens"
4. Create a new personal access token:
   - Name: `aws-amplify-token`
   - Expiration: Set an appropriate date (1 year is recommended)
   - Scopes: Select `api`, `read_repository`, `write_repository`
5. Click "Create personal access token"
6. **IMPORTANT**: Copy the generated token immediately - you won't see it again!

## Step 2: Create and Deploy to Amplify App

1. Sign in to the [AWS Management Console](https://console.aws.amazon.com/)
2. Search for "Amplify" and select the Amplify service
3. Click "New app" → "Host web app"
4. Select "GitLab" as your repository provider
5. Click "Connect to GitLab"
6. When prompted, paste the access token you generated
7. Select the repository: `intelligent-systems-and-development/company-wiki`
8. Choose the `main` branch for deployment
9. Configure build settings:
   - Amplify should automatically detect the `amplify.yml` file
   - Leave other settings at their defaults
10. Click "Save and deploy"

## Step 3: Monitor Deployment

1. Amplify will show you a deployment progress screen
2. The process takes approximately 5-10 minutes
3. You can view build logs in real-time by clicking on the deployment

## Step 4: Access Your Application

Once deployment is complete:

1. Amplify provides a default domain (e.g., `https://main.abc123def.amplifyapp.com`)
2. Click on the domain name to view your deployed Company Wiki

## Step 5: Add a Custom Domain (Optional)

1. In the Amplify console, select your app
2. Go to "Domain management" in the left sidebar
3. Click "Add domain"
4. Follow the instructions to connect your custom domain

## Troubleshooting

If you encounter build failures:

1. Check the build logs for specific errors
2. Common issues:
   - Missing dependencies in package.json
   - Incompatible Node.js version (Amplify uses Node 16 by default)
   - Environment variables not configured

## Automatic Deployments

Once set up, Amplify will automatically:
- Deploy changes when you push to the main branch
- Create preview environments for pull requests (if enabled)
- Run your build scripts and deploy the application

## Customizing Builds

If you need to customize the build process:
- Edit the `amplify.yml` file in your repository
- Add environment variables in the Amplify Console
- Configure branch-specific build settings

---

Your Company Wiki will be publicly accessible via the Amplify URL once deployed. For production use, consider adding authentication to protect sensitive information.