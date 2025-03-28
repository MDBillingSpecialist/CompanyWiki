#!/bin/bash
# EC2 User Data script for a Next.js application
# This script will run on instance launch and set up your Next.js application

# Update the system
yum update -y

# Install Node.js 18.x
curl -sL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install git
yum install -y git

# Create app directory
mkdir -p /var/www/company-wiki
cd /var/www/company-wiki

# Clone the repository (replace with your repository URL)
git clone https://github.com/your-org/company-wiki.git .

# Install dependencies
npm ci

# Build the application
npm run build

# Create a systemd service file
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

# Enable and start the service
systemctl enable company-wiki
systemctl start company-wiki

# Install and configure Nginx as a reverse proxy
yum install -y nginx
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
    }
}
EOF

# Start Nginx and enable it to start on boot
systemctl enable nginx
systemctl start nginx

# End of script
echo "Company Wiki deployment complete!"