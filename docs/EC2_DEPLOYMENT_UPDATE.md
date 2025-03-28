# EC2 Deployment Update - Company Wiki

## Instance Recovery Complete

The EC2 instance has been successfully recovered and should now be accessible via both the AWS EC2 Instance Connect console and SSH.

## Updated Connection Details

- **Instance ID**: i-0150ba41d072edd78
- **Instance Type**: t2.micro
- **AMI**: ami-0261755bbcb8c4a84 (Ubuntu 22.04 LTS)
- **Public IP**: 34.238.82.17
- **Public DNS**: Will be available in EC2 console
- **Security Group ID**: sg-07c95193d5528f25b
- **SSH Key Pair**: company-wiki-key (original), recovery-key (new)

## Accessing Your Application

Your Company Wiki application should be accessible at:
- http://34.238.82.17

## Connecting to the Instance

### Via AWS Console:
1. Go to EC2 service in AWS Console
2. Click on "Instances"
3. Select instance ID "i-0150ba41d072edd78"
4. Click "Connect" button
5. Choose "EC2 Instance Connect" tab
6. Click "Connect" button

### Via SSH:
You can connect using either key pair:
```bash
# Using original key
ssh -i company-wiki-key.pem ubuntu@34.238.82.17

# Using recovery key
ssh -i recovery-key.pem ubuntu@34.238.82.17
```

## Recovery Process Summary

1. Created a recovery key pair
2. Stopped the original instance
3. Detached the root volume
4. Launched a recovery instance
5. Attached the original volume to the recovery instance
6. Installed EC2 Instance Connect on the original volume
7. Configured SSH settings to allow connection via Instance Connect
8. Detached the volume from the recovery instance
9. Reattached the volume to the original instance
10. Started the original instance
11. Terminated the recovery instance

## Going Forward

You can now manage your instance directly from the AWS Console using EC2 Instance Connect, which provides a browser-based SSH connection without needing to download key files.

Your application should continue running as before, but now with improved connection options.

For any issues, refer to the logs in:
- `/var/log/cloud-init-output.log` - Initial setup logs
- `/var/log/nginx/error.log` - Nginx errors
- `journalctl -u company-wiki.service` - Application service logs