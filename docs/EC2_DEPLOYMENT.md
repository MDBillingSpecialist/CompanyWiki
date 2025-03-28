# EC2 Deployment - Company Wiki

This document provides comprehensive information about the EC2 deployment for the Company Wiki application.

## Deployment Details

- **Instance ID**: i-0150ba41d072edd78
- **Instance Type**: t2.micro
- **AMI**: ami-0261755bbcb8c4a84 (Ubuntu 22.04 LTS)
- **Public IP**: 44.201.118.87
- **Public DNS**: ec2-44-201-118-87.compute-1.amazonaws.com
- **Security Group ID**: sg-07c95193d5528f25b
- **SSH Key Pair**: company-wiki-key

## Accessing Your Application

Once the deployment is complete, you can access your Company Wiki at:
- http://44.201.118.87

For production, you should set up a proper domain name and SSL certificate.

## Server Configuration

The EC2 instance is configured with:

1. **Node.js 18.x** - For running the Next.js application
2. **Nginx** - As a reverse proxy to handle HTTP requests
3. **PM2** - For process management and auto-restart
4. **Systemd service** - For automatic startup on system boot

## Security

The security group allows the following inbound traffic:
- SSH (Port 22): For administrative access
- HTTP (Port 80): For web access
- HTTPS (Port 443): For secure web access (when you set up SSL)

## Deployment Process

The deployment uses a user data script that automatically:
1. Updates the system packages
2. Installs Node.js, Git, and Nginx
3. Clones the repository from your Git source
4. Installs dependencies and builds the application
5. Sets up a systemd service for automatic startup
6. Configures Nginx as a reverse proxy

## Monitoring Deployment

To check if your application is deployed successfully:
1. Visit http://44.201.118.87 in your browser
2. Run the check-deployment.sh script in the aws directory

## Accessing the Server

To SSH into the server:
```bash
ssh -i company-wiki-key.pem ubuntu@44.201.118.87
```

## Troubleshooting

If the application is not accessible, you can check the following logs:

1. **User Data Script Log**:
   ```bash
   sudo cat /var/log/cloud-init-output.log
   ```

2. **Application Logs**:
   ```bash
   sudo journalctl -u company-wiki.service
   ```

3. **Nginx Logs**:
   ```bash
   sudo cat /var/log/nginx/error.log
   sudo cat /var/log/nginx/access.log
   ```

## Maintenance

### Updating the Application

To update your application:

1. SSH into the server
2. Navigate to the application directory:
   ```bash
   cd /var/www/company-wiki
   ```
3. Pull the latest changes:
   ```bash
   git pull
   ```
4. Install dependencies and rebuild:
   ```bash
   npm ci
   npm run build
   ```
5. Restart the service:
   ```bash
   sudo systemctl restart company-wiki
   ```

### Server Maintenance

For server maintenance:

1. **Updating Packages**:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Checking Disk Space**:
   ```bash
   df -h
   ```

3. **Monitoring System Resources**:
   ```bash
   htop
   ```

## Backup and Disaster Recovery

For backup and disaster recovery:

1. Create an AMI of your running instance for backup
2. Consider setting up automated backups of your content
3. Document the deployment process for quick recovery

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)