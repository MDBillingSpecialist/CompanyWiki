// Super minimal server - just to pass health checks
const http = require('http');
const port = process.env.PORT || 3000;

// Create a very simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Received request for ${req.url}`);
  
  // Set headers for all responses
  res.setHeader('Content-Type', 'text/html');
  
  // Basic routing
  if (req.url === '/health' || req.url === '/healthz') {
    console.log('Health check requested');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
  } else {
    // Default response
    res.statusCode = 200;
    res.end(`
      <html>
        <head><title>Super Minimal Server</title></head>
        <body>
          <h1>Server is running!</h1>
          <p>This is a super minimal server just to verify AWS App Runner connectivity.</p>
          <p>Current time: ${new Date().toISOString()}</p>
          <p><a href="/health">Check health endpoint</a></p>
        </body>
      </html>
    `);
  }
});

// Start the server with extensive logging
server.listen(port, '0.0.0.0', () => {
  console.log('============================================');
  console.log(`Server is running on port ${port}`);
  console.log(`Health check available at http://0.0.0.0:${port}/health`);
  console.log('Environment variables:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- PORT: ${process.env.PORT || '3000 (default)'}`);
  console.log('============================================');
});