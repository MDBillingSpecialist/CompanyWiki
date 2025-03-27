// This file is used to start the Next.js application in production
// It's referenced by the Dockerfile and AWS App Runner configuration

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Environment configuration with detailed logging
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Log startup information
console.log('-------------------------------------');
console.log('Server starting with configuration:');
console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`- Hostname: ${hostname}`);
console.log(`- Port: ${port}`);
console.log(`- Current directory: ${process.cwd()}`);
console.log('-------------------------------------');

// Check if content directory exists and log status
const contentDir = path.join(process.cwd(), 'content');
if (fs.existsSync(contentDir)) {
  console.log(`✅ Content directory found at: ${contentDir}`);
  try {
    const contentFiles = fs.readdirSync(contentDir);
    console.log(`   Contains ${contentFiles.length} items`);
  } catch (err) {
    console.warn(`⚠️ Could not read content directory: ${err.message}`);
  }
} else {
  console.warn(`⚠️ Content directory not found at: ${contentDir}`);
}

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Create a function to check system health
const healthCheck = () => {
  const memoryUsage = process.memoryUsage();
  return {
    uptime: process.uptime(),
    timestamp: Date.now(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
    },
    env: process.env.NODE_ENV,
  };
};

app.prepare().then(() => {
  console.log('Next.js app prepared, setting up HTTP server...');
  
  createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;
      
      // Handle health check endpoint specifically for AWS health checks
      if (pathname === '/health' || pathname === '/healthz') {
        const health = healthCheck();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(health));
        return;
      }
      
      // Log API requests for debugging
      if (pathname?.startsWith('/api/')) {
        console.log(`API request: ${pathname}`, { 
          query: Object.keys(query).length ? query : 'none',
          timestamp: new Date().toISOString()
        });
      }
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Fatal server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Server ready on http://${hostname}:${port}`);
      console.log('-------------------------------------');
    });
});