/**
 * Cache Middleware
 * 
 * Provides Redis-based caching for API responses
 */
const { logger } = require('../utils/logger');

/**
 * Middleware to cache API responses in Redis
 * @param {string} keyPrefix - Prefix for the cache key
 * @param {number} ttlSeconds - Time to live in seconds
 */
const cacheMiddleware = (keyPrefix, ttlSeconds = 300) => {
  return async (req, res, next) => {
    if (!req.redis) {
      logger.warn('Redis client not available, skipping cache');
      return next();
    }
    
    // Generate cache key based on route and query params
    const cacheKey = `${keyPrefix}:${req.originalUrl}`;
    
    try {
      // Try to get cached response
      const cachedResponse = await req.redis.get(cacheKey);
      
      if (cachedResponse) {
        const parsedResponse = JSON.parse(cachedResponse);
        return res.json(parsedResponse);
      }
      
      // If not cached, intercept the response to store in cache
      const originalSend = res.send;
      res.send = function(body) {
        try {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const responseBody = JSON.parse(body);
            req.redis.set(cacheKey, body, 'EX', ttlSeconds).catch(err => {
              logger.error('Redis cache set error:', err);
            });
          }
        } catch (error) {
          logger.error('Error caching response:', error);
        }
        
        originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

/**
 * Middleware to clear cache entries by pattern
 * @param {string} pattern - Pattern to match cache keys
 */
const clearCache = (pattern) => {
  return async (req, res, next) => {
    if (!req.redis) {
      logger.warn('Redis client not available, skipping cache clear');
      return next();
    }
    
    try {
      // Use Redis SCAN to find keys matching the pattern
      let cursor = '0';
      let keys = [];
      
      do {
        const result = await req.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = result[0];
        keys = keys.concat(result[1]);
      } while (cursor !== '0');
      
      if (keys.length > 0) {
        await req.redis.del(...keys);
        logger.info(`Cleared ${keys.length} cache entries with pattern: ${pattern}`);
      }
      
      next();
    } catch (error) {
      logger.error('Cache clear error:', error);
      next();
    }
  };
};

module.exports = {
  cacheMiddleware,
  clearCache
};