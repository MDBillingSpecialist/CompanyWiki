/**
 * LLM Content Pipeline API Routes
 * 
 * Provides API endpoints for the LLM content generation pipeline
 */
const express = require('express');
const { llmService } = require('../services/llmService');
const { validateSchema } = require('../middleware/validation');
const { llmSchemas } = require('../utils/validationSchemas');
const router = express.Router();

/**
 * Generate content from document/idea
 */
router.post('/generate', 
  validateSchema(llmSchemas.contentGeneration), 
  async (req, res, next) => {
    try {
      const { content, title, targetSection, contentType, instructions } = req.body;
      
      // Generate draft using LLM
      const generatedContent = await llmService.generateContent({
        content,
        title,
        targetSection,
        contentType,
        instructions,
        userId: req.user.id
      });
      
      return res.json({
        draftId: generatedContent.id,
        content: generatedContent.content,
        metadata: generatedContent.metadata
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get all content drafts
 */
router.get('/drafts', async (req, res, next) => {
  try {
    const { status, limit, offset } = req.query;
    
    const drafts = await llmService.getContentDrafts({
      status,
      limit: parseInt(limit) || 10,
      offset: parseInt(offset) || 0,
      userId: req.query.all === 'true' ? undefined : req.user.id
    });
    
    return res.json({ drafts });
  } catch (error) {
    next(error);
  }
});

/**
 * Get content draft by ID
 */
router.get('/drafts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const draft = await llmService.getContentDraftById(id);
    
    if (!draft) {
      return res.status(404).json({
        error: {
          message: `Draft not found with ID: ${id}`
        }
      });
    }
    
    return res.json(draft);
  } catch (error) {
    next(error);
  }
});

/**
 * Update draft content
 */
router.put('/drafts/:id',
  validateSchema(llmSchemas.draftUpdate),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content, metadata } = req.body;
      
      const draft = await llmService.getContentDraftById(id);
      
      if (!draft) {
        return res.status(404).json({
          error: {
            message: `Draft not found with ID: ${id}`
          }
        });
      }
      
      const updatedDraft = await llmService.updateContentDraft(id, {
        content,
        metadata,
        updatedBy: req.user.id
      });
      
      return res.json(updatedDraft);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Approve draft and publish to wiki
 */
router.post('/drafts/:id/publish',
  validateSchema(llmSchemas.publishRequest),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { path, comment } = req.body;
      
      const draft = await llmService.getContentDraftById(id);
      
      if (!draft) {
        return res.status(404).json({
          error: {
            message: `Draft not found with ID: ${id}`
          }
        });
      }
      
      const publishedPage = await llmService.publishContentToWiki(id, {
        path,
        comment,
        publishedBy: req.user.id
      });
      
      return res.json({
        success: true,
        pageId: publishedPage.id,
        path: publishedPage.path
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Reject draft
 */
router.post('/drafts/:id/reject',
  validateSchema(llmSchemas.rejectRequest),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      const draft = await llmService.getContentDraftById(id);
      
      if (!draft) {
        return res.status(404).json({
          error: {
            message: `Draft not found with ID: ${id}`
          }
        });
      }
      
      await llmService.rejectContentDraft(id, {
        reason,
        rejectedBy: req.user.id
      });
      
      return res.json({
        success: true,
        status: 'rejected'
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Request LLM improvements for draft
 */
router.post('/drafts/:id/improve',
  validateSchema(llmSchemas.improvementRequest),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { instructions } = req.body;
      
      const draft = await llmService.getContentDraftById(id);
      
      if (!draft) {
        return res.status(404).json({
          error: {
            message: `Draft not found with ID: ${id}`
          }
        });
      }
      
      const improvedDraft = await llmService.improveContentDraft(id, {
        instructions,
        requestedBy: req.user.id
      });
      
      return res.json({
        draftId: improvedDraft.id,
        content: improvedDraft.content,
        metadata: improvedDraft.metadata
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;