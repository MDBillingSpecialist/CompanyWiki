#!/bin/bash
# Script to reinstall the application on the EC2 instance

# 1. Connect to the instance using EC2 Instance Connect Endpoint
echo "Setting up a direct SSH connection to update the server..."

# Create a script to be executed on the server
cat > server-setup.sh << 'EOF'
#!/bin/bash

set -e
exec > >(tee /var/log/server-setup.log) 2>&1

echo "=== Starting server setup at $(date) ==="

# Update system and install required packages
echo "Updating system packages..."
sudo apt update
sudo apt install -y nodejs npm git nginx

# Create directory for application
echo "Setting up application directory..."
sudo mkdir -p /var/www/company-wiki
sudo chown ubuntu:ubuntu /var/www/company-wiki

# Clone repository
echo "Cloning repository..."
cd /var/www/company-wiki
git clone https://github.com/yourusername/company-wiki.git .

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

# Create systemd service
echo "Setting up systemd service..."
sudo tee /etc/systemd/system/company-wiki.service > /dev/null << 'EOL'
[Unit]
Description=Company Wiki Next.js Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/company-wiki
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=company-wiki
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

# Configure Nginx
echo "Setting up Nginx..."
sudo tee /etc/nginx/sites-available/company-wiki > /dev/null << 'EOL'
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
EOL

# Enable the site
sudo ln -sf /etc/nginx/sites-available/company-wiki /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Start services
echo "Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable company-wiki
sudo systemctl start company-wiki
sudo systemctl restart nginx

echo "=== Setup completed at $(date) ==="
EOF

# Make the script executable
chmod +x server-setup.sh

# Run this command to install the AWS CLI Session Manager plugin if needed
# macOS: brew install --cask session-manager-plugin
# Ubuntu: curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb" && sudo dpkg -i session-manager-plugin.deb

# SSH to instance and run the script (you'll need to do this manually)
echo "Now connect to your instance using AWS Console's EC2 Instance Connect and run the script:"
echo "1. Go to EC2 > Instances in AWS Console"
echo "2. Select instance i-0150ba41d072edd78"
echo "3. Click Connect > EC2 Instance Connect"
echo "4. Once connected, run these commands:"
echo "   sudo apt update && sudo apt install -y git"
echo "   git clone https://github.com/yourusername/company-wiki.git /tmp/company-wiki"
echo "   bash /tmp/company-wiki/aws/server-setup.sh"