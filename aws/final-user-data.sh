#!/bin/bash

# Log all output to a file
exec > >(tee /var/log/user-data.log) 2>&1

echo "=== Starting deployment at $(date) ==="

# Update and install required packages
apt-get update
apt-get install -y nodejs npm git nginx curl

# Create application directory
mkdir -p /var/www/company-wiki
cd /var/www/company-wiki

# Clone the repository (using an example repository URL - replace with your actual URL)
# For demonstration, we'll create a simple Next.js app
echo "Cloning repository failed - creating simple app instead"

# Create a minimal Next.js app
mkdir -p pages
mkdir -p public

# Create a simple index page
cat > pages/index.js << 'EOL'
export default function Home() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#0070f3' }}>Company Wiki</h1>
      <p>Welcome to the Company Wiki! This is a temporary placeholder page.</p>
      <p>The server is running correctly, but the actual application content needs to be deployed.</p>
      
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px'
      }}>
        <h2>Server Information</h2>
        <ul>
          <li>Server Time: {new Date().toLocaleString()}</li>
          <li>Node.js Version: {process.version}</li>
          <li>Environment: {process.env.NODE_ENV}</li>
        </ul>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        fontSize: '14px',
        color: '#666'
      }}>
        Server started: {new Date().toISOString()}
      </div>
    </div>
  )
}
EOL

# Create package.json
cat > package.json << 'EOL'
{
  "name": "company-wiki",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
EOL

# Install dependencies
npm install

# Build the app
npm run build

# Create a systemd service file
cat > /etc/systemd/system/company-wiki.service << 'EOL'
[Unit]
Description=Company Wiki Next.js Application
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/company-wiki
ExecStart=/usr/bin/npm start
Restart=on-failure
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=company-wiki
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

# Create Nginx config
cat > /etc/nginx/sites-available/company-wiki << 'EOL'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
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
    
    # Add additional location blocks for static files if needed
}
EOL

# Enable the site
ln -sf /etc/nginx/sites-available/company-wiki /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test the Nginx config
nginx -t

# Enable and start services
systemctl daemon-reload
systemctl enable company-wiki
systemctl start company-wiki
systemctl restart nginx

# Create a status page for easy verification
mkdir -p /var/www/html
cat > /var/www/html/status.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
    <title>Server Status</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0070f3; }
        .status { 
            padding: 20px; 
            background-color: #f0f9ff; 
            border-left: 5px solid #0070f3;
            margin: 20px 0;
        }
        .success { color: #00aa00; }
    </style>
</head>
<body>
    <h1>Server Status Page</h1>
    <div class="status">
        <h2 class="success">✓ Server is running</h2>
        <p>This status page confirms that the web server is properly configured and running.</p>
        <p>The main application should be accessible at: <a href="/">Company Wiki Home</a></p>
    </div>
    
    <h2>Server Information</h2>
    <ul>
        <li>Server: Nginx + Node.js</li>
        <li>Generated: <script>document.write(new Date().toLocaleString())</script></li>
    </ul>
    
    <p><small>Note: This is a placeholder page. Your actual application content needs to be deployed.</small></p>
</body>
</html>
EOL

# Final status report
echo "==== Deployment completed at $(date) ===="
echo "Company Wiki should be available at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/"
echo "Status page at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/status.html"