# AWS Amplify Deployment Instructions

Since we're having trouble with EC2 connectivity, AWS Amplify is an excellent alternative that offers simplified hosting for web applications. Here's how to set it up:

## Step 1: Create a GitLab Access Token

1. Log into your GitLab account
2. Go to your profile settings (click on your avatar in the top-right corner → Settings)
3. In the left sidebar, click "Access Tokens"
4. Create a new token with the following settings:
   - Name: `aws-amplify-access`
   - Expiration: Set a date (e.g., 1 year from now)
   - Scopes: Select `api`, `read_repository`, `write_repository`
5. Click "Create personal access token"
6. **Important**: Copy the generated token immediately - you won't be able to see it again!

## Step 2: Deploy to AWS Amplify (via AWS Console)

1. Open AWS Management Console in your browser
2. Search for "Amplify" and select the Amplify service
3. Click "New app" → "Host web app"
4. Select "GitLab" as your repository provider
5. Click "Connect to GitLab"
6. When prompted, enter the access token you created
7. Select your repository: `intelligent-systems-and-development/company-wiki`
8. Select the branch you want to deploy (usually `main` or `master`)

## Step 3: Configure Build Settings

Amplify will automatically detect that this is a Next.js app, but you may need to customize the build settings.

Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 4: Configure Domain (Optional)

1. In your Amplify app dashboard, go to "Domain Management"
2. Click "Add domain"
3. Enter your domain name and follow the instructions to set up DNS

## Benefits of Using AWS Amplify

1. **Simplified Deployment**: CI/CD built in, just push to your repository
2. **SSL Included**: Automatic HTTPS with free SSL certificates
3. **Global CDN**: Content delivery network for faster loading
4. **Preview Branches**: Test changes before merging to production
5. **Custom Domains**: Easy setup with your own domain name
6. **Authentication**: Can add authentication services easily if needed

## Troubleshooting

If you encounter issues with the build, you can view build logs directly in the Amplify Console to diagnose any problems.

## Cost Considerations

AWS Amplify pricing is based on:
- Build minutes used
- Storage of your application
- Data served to visitors

For a simple company wiki, costs are typically very low (often under $5/month).