/**
 * API Integration Layer
 * 
 * This service provides a unified API gateway for both Wiki.js and custom extensions.
 * It handles authentication, caching, and routing between services.
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const Redis = require('ioredis');
const createError = require('http-errors');
const { logger } = require('./utils/logger');
const wikiRoutes = require('./routes/wiki');
const hipaaRoutes = require('./routes/hipaa');
const llmRoutes = require('./routes/llm');
const authMiddleware = require('./middleware/auth');

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3100;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make Redis client available to route handlers
app.use((req, res, next) => {
  req.redis = redis;
  next();
});

// Routes
app.use('/api/wiki', wikiRoutes);
app.use('/api/hipaa', authMiddleware.requireAuth, hipaaRoutes);
app.use('/api/llm', authMiddleware.requireAuth, llmRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Endpoint not found'));
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  
  // Don't leak stack traces in production
  const error = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  };
  
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  
  res.status(status).json({
    error: {
      message: error.message,
      ...(error.stack && { stack: error.stack })
    }
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`API layer running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  redis.quit().then(() => {
    logger.info('Redis client disconnected');
    process.exit(0);
  });
});

module.exports = app; // For testing purposes