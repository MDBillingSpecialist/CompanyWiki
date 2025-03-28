# S3 Static Website Deployment for Company Wiki

I've created a static website demonstration on S3, but it needs additional configuration to be accessible. Here's how to make it publicly available:

## S3 Bucket Information
- **Bucket Name:** company-wiki-static-site-1743175456
- **Index Document:** index.html
- **Static Website URL (when configured):** http://company-wiki-static-site-1743175456.s3-website-us-east-1.amazonaws.com/

## Complete the Setup (in AWS Console)

1. **Log in to the AWS Management Console**
   - Go to https://console.aws.amazon.com/

2. **Navigate to S3 Service**
   - Search for "S3" in the services search bar and select it

3. **Select the Bucket**
   - Click on the bucket named `company-wiki-static-site-1743175456`

4. **Edit Block Public Access settings**
   - Go to the "Permissions" tab
   - Click "Edit" in the "Block public access" section
   - Uncheck "Block all public access"
   - Save changes (confirm when prompted)

5. **Configure Static Website Hosting**
   - Stay in the bucket and go to the "Properties" tab
   - Scroll down to "Static website hosting"
   - Click "Edit"
   - Select "Enable"
   - For Index document, enter `index.html`
   - Save changes

6. **Add Bucket Policy for Public Access**
   - Return to the "Permissions" tab
   - Scroll down to "Bucket policy" and click "Edit"
   - Copy and paste the following policy:
   
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::company-wiki-static-site-1743175456/*"
       }
     ]
   }
   ```
   
   - Click "Save changes"

7. **Access Your Website**
   - Go back to the "Properties" tab
   - Scroll down to "Static website hosting"
   - Find the "Bucket website endpoint" URL - this is your website URL!
   - Click the URL to open your website
   
## Alternative Solution: AWS Amplify Hosting

For a more comprehensive hosting solution that can handle dynamic content like Next.js applications, I recommend following the AWS Amplify deployment instructions provided in the separate document.

AWS Amplify offers:
- Continuous deployment from your GitLab repository
- Full support for Next.js applications
- Custom domains and SSL certificates
- Built-in CI/CD pipeline

See the `amplify-deploy-instructions.md` file for detailed steps on setting up Amplify hosting.