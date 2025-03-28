// Simple Express server for AWS App Runner deployment
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple root handler
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Company Wiki - Temporary Page</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; }
          h1 { color: #333; }
          .success { color: green; }
          .info { background: #f4f4f4; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Company Wiki <span class="success">✓</span></h1>
          <p>This is a temporary landing page for the Company Wiki.</p>
          <p>The deployment was successful, but we're still setting up the full application.</p>
          
          <div class="info">
            <h2>Server Information</h2>
            <ul>
              <li>Node.js Version: ${process.version}</li>
              <li>Server Time: ${new Date().toISOString()}</li>
              <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
            </ul>
          </div>
          
          <p>The full wiki application will be available soon.</p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Health check available at http://0.0.0.0:${port}/health`);
});