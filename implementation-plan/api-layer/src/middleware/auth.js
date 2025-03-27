/**
 * Authentication Middleware
 * 
 * Handles JWT verification and user authentication
 */
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { logger } = require('../utils/logger');

// JWT Secret - should be set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

/**
 * Middleware to verify JWT tokens
 */
const requireAuth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'No authentication token provided'));
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || []
    };
    
    next();
  } catch (error) {
    logger.error('JWT Verification Error:', error.message);
    return next(createError(401, 'Invalid or expired token'));
  }
};

/**
 * Middleware to check if user has required role
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }
    
    if (!req.user.roles.includes(role)) {
      return next(createError(403, 'Insufficient permissions'));
    }
    
    next();
  };
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  return requireRole('admin')(req, res, next);
};

module.exports = {
  requireAuth,
  requireRole,
  requireAdmin
};