# AWS Deployment Steps for Company Wiki

This document provides detailed steps to deploy the Company Wiki to AWS App Runner.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured on your machine
3. **GitHub** repository with your code
4. **Node.js** (v18+) installed on your machine

## Deployment Options

You have three ways to deploy the application:

### Option 1: Automatic GitHub Actions Deployment (Recommended)

This method uses GitHub Actions to automatically deploy when you push to the main branch.

1. **Set up GitHub Secrets** in your repository:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AWS_ROLE_ARN` - ARN of the IAM role with App Runner permissions

2. **Configure OIDC (OpenID Connect) in AWS**:
   - This allows GitHub Actions to authenticate with AWS without storing secrets
   - Follow the steps in [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-idp_oidc.html)
   - Use the CloudFormation template in `/aws/github-oidc-role.yml` to create this role

3. **Push to main branch** or manually trigger the workflow in GitHub Actions:
   - The workflow will run tests, build the application, and deploy to App Runner

### Option 2: Manual Deployment Script

Use the included deployment script for manual deployments.

1. **Configure AWS CLI** if you haven't already:
   ```
   aws configure
   ```

2. **Run the deployment script**:
   ```
   ./deploy-aws.sh
   ```

3. The script will:
   - Verify AWS credentials
   - Run tests to ensure application is working
   - Build the application
   - Create or update the App Runner service

### Option 3: AWS Console Deployment

Deploy directly through the AWS Console.

1. **Log in to AWS Console** and go to App Runner service

2. **Create a new service**:
   - Select "Source code repository"
   - Connect your GitHub repository
   - Select the main branch

3. **Configure build**:
   - Runtime: Node.js 18
   - Build command: `npm ci && npm run build`
   - Start command: `node server.js`
   - Port: 3000

4. **Configure service**:
   - Service name: company-wiki
   - CPU: 1 vCPU
   - Memory: 2 GB

5. **Review and create** the service

## Post-Deployment Steps

After deployment is complete:

1. **Verify the application** by visiting the URL provided by App Runner

2. **Set up monitoring** using the CloudWatch dashboard:
   - Deploy the CloudWatch dashboard using the template in `/aws/cloudwatch-dashboard.json`
   - Set up alarms using the template in `/aws/cloudwatch-alarms.yml`

3. **Set up a custom domain** (optional):
   - In App Runner console, go to your service → Custom domains
   - Add your domain and follow the verification steps

## Troubleshooting

If you encounter issues during deployment:

1. **Check the logs** in App Runner:
   - Go to your service in App Runner console
   - Select the "Logs" tab

2. **Check build logs** if deployment fails during build:
   - In App Runner console, go to Activity → View build logs

3. **Common issues**:
   - Missing server.js file - Ensure you have this file in your project root
   - Health check failing - Make sure the application runs correctly on port 3000
   - Memory issues - Consider upgrading to a larger instance size

For more help, refer to the AWS App Runner documentation or contact your team's AWS administrator.