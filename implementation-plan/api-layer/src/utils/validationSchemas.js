/**
 * Validation Schemas
 * 
 * Joi schemas for request validation
 */
const Joi = require('joi');

// Content schemas for Wiki.js
const contentSchemas = {
  // Schema for page creation
  pageCreate: Joi.object({
    path: Joi.string().required().min(1).max(255),
    title: Joi.string().required().min(1).max(255),
    content: Joi.string().required(),
    description: Joi.string().allow('', null).max(500),
    tags: Joi.array().items(Joi.string().max(50)).max(20),
    isPublished: Joi.boolean().default(true)
  }),
  
  // Schema for page updates
  pageUpdate: Joi.object({
    title: Joi.string().min(1).max(255),
    content: Joi.string(),
    description: Joi.string().allow('', null).max(500),
    tags: Joi.array().items(Joi.string().max(50)).max(20),
    isPublished: Joi.boolean()
  }).min(1) // Require at least one field to be updated
};

// HIPAA-specific schemas
const hipaaSchemas = {
  // Schema for checklist item updates
  checklistItemUpdate: Joi.object({
    completed: Joi.boolean().required(),
    notes: Joi.string().allow('', null).max(1000)
  }),
  
  // Schema for review creation
  reviewCreate: Joi.object({
    title: Joi.string().required().min(3).max(255),
    category: Joi.string().required().valid(
      'technical', 'administrative', 'physical', 'llm', 'ccm'
    ),
    description: Joi.string().allow('', null).max(1000),
    dueDate: Joi.date().iso().required(),
    assignedTo: Joi.string().allow('', null).max(255),
    priority: Joi.string().valid('high', 'medium', 'low').default('medium')
  })
};

// LLM content pipeline schemas
const llmSchemas = {
  // Schema for content generation
  contentGeneration: Joi.object({
    content: Joi.string().required().min(10),
    title: Joi.string().min(3).max(255),
    targetSection: Joi.string().allow('', null).max(255),
    contentType: Joi.string().valid('markdown', 'wiki', 'hipaa-checklist', 'sop').default('markdown'),
    instructions: Joi.string().allow('', null).max(2000)
  }),
  
  // Schema for draft updates
  draftUpdate: Joi.object({
    content: Joi.string().min(10),
    metadata: Joi.object({
      title: Joi.string().min(3).max(255),
      description: Joi.string().allow('', null).max(500),
      tags: Joi.array().items(Joi.string().max(50)).max(20),
      targetSection: Joi.string().allow('', null).max(255),
      contentType: Joi.string().valid('markdown', 'wiki', 'hipaa-checklist', 'sop')
    })
  }).min(1), // Require at least one field to be updated
  
  // Schema for publish request
  publishRequest: Joi.object({
    path: Joi.string().required().min(1).max(255),
    comment: Joi.string().allow('', null).max(500)
  }),
  
  // Schema for reject request
  rejectRequest: Joi.object({
    reason: Joi.string().required().min(1).max(1000)
  }),
  
  // Schema for improvement request
  improvementRequest: Joi.object({
    instructions: Joi.string().required().min(5).max(2000)
  })
};

module.exports = {
  contentSchemas,
  hipaaSchemas,
  llmSchemas
};