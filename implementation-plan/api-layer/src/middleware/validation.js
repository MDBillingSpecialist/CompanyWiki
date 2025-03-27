/**
 * Validation Middleware
 * 
 * Provides request validation using Joi schemas
 */
const Joi = require('joi');
const createError = require('http-errors');

/**
 * Middleware to validate request data against a Joi schema
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: {
          message: 'Invalid request data',
          details: errors
        }
      });
    }
    
    // Replace req.body with validated data
    req.body = value;
    next();
  };
};

/**
 * Middleware to validate query parameters against a Joi schema
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: {
          message: 'Invalid query parameters',
          details: errors
        }
      });
    }
    
    // Replace req.query with validated data
    req.query = value;
    next();
  };
};

module.exports = {
  validateSchema,
  validateQuery
};