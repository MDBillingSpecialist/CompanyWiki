#!/bin/bash

# This is a simplified bootstrap script for quick troubleshooting

# Update system
apt-get update
apt-get install -y nginx nodejs npm git

# Set up a simple static website for testing
mkdir -p /var/www/html
cat > /var/www/html/index.html << 'EOL'
<!DOCTYPE html>
<html>
<head>
    <title>Server is Working!</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #0070f3; }
        .status { padding: 20px; background-color: #f0f9ff; border-left: 5px solid #0070f3; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Server is Working!</h1>
    <div class="status">
        <p>This page confirms that the Nginx web server is running correctly.</p>
        <p>Server time: <script>document.write(new Date().toLocaleString())</script></p>
    </div>
</body>
</html>
EOL

# Configure Nginx to serve the static site
cat > /etc/nginx/sites-available/default << 'EOL'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/html;
    index index.html;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOL

# Restart Nginx
systemctl restart nginx

# Output debug info
echo "Debug info at $(date)" > /var/www/html/debug.txt
echo "Nginx status:" >> /var/www/html/debug.txt
systemctl status nginx >> /var/www/html/debug.txt
echo "Listening ports:" >> /var/www/html/debug.txt
netstat -tulpn >> /var/www/html/debug.txt
echo "IP address:" >> /var/www/html/debug.txt
curl -s http://169.254.169.254/latest/meta-data/public-ipv4 >> /var/www/html/debug.txt

# Create a debug script that users can run
cat > /home/ubuntu/debug.sh << 'EOL'
#!/bin/bash
echo "=== Nginx Status ==="
systemctl status nginx
echo ""
echo "=== Web Server Port ==="
sudo netstat -tulpn | grep :80
echo ""
echo "=== Server Logs ==="
tail -n 20 /var/log/nginx/error.log
EOL
chmod +x /home/ubuntu/debug.sh