#!/bin/bash
# EC2 User Data script for Company Wiki - Next.js application
# This will run on instance startup to set up your application

# Output all commands to the console and log file for debugging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1
echo "Starting user data script execution at $(date)"

# Update the system
echo "Updating system packages..."
yum update -y

# Install Node.js 18.x
echo "Installing Node.js 18.x..."
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Verify Node.js and npm installation
node -v
npm -v

# Install git
echo "Installing git..."
yum install -y git

# Install development tools for potential native module compilation
echo "Installing development tools..."
yum groupinstall -y "Development Tools"

# Set EC2 hostname
hostnamectl set-hostname company-wiki

# Create app directory
echo "Creating application directory..."
mkdir -p /var/www/company-wiki
cd /var/www/company-wiki

# Clone the repository
echo "Cloning repository..."
git clone https://gitlab.com/intelligent-systems-and-development/company-wiki.git .

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building Next.js application..."
npm run build

# Create a systemd service file
echo "Creating systemd service..."
cat > /etc/systemd/system/company-wiki.service << 'EOF'
[Unit]
Description=Company Wiki Next.js Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/var/www/company-wiki
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Fix ownership
echo "Setting correct file permissions..."
chown -R ec2-user:ec2-user /var/www/company-wiki

# Enable and start the service
echo "Enabling and starting the service..."
systemctl daemon-reload
systemctl enable company-wiki
systemctl start company-wiki

# Install and configure Nginx as a reverse proxy
echo "Installing and configuring Nginx..."
amazon-linux-extras install -y nginx1
systemctl start nginx
systemctl enable nginx

# Configure Nginx as reverse proxy for Node.js
cat > /etc/nginx/conf.d/company-wiki.conf << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Remove default nginx site
rm -f /etc/nginx/conf.d/default.conf

# Restart Nginx to apply configuration
systemctl restart nginx

# Output status information
echo "Deployment completed at $(date)"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"
echo "Application available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "Check logs at: /var/log/user-data.log"