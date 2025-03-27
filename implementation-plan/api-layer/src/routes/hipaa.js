/**
 * HIPAA Extension API Routes
 * 
 * Provides API endpoints for HIPAA-specific functionality
 */
const express = require('express');
const { hipaaService } = require('../services/hipaaService');
const { validateSchema } = require('../middleware/validation');
const { hipaaSchemas } = require('../utils/validationSchemas');
const router = express.Router();

/**
 * Get compliance dashboard data
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const dashboardData = await hipaaService.getDashboardData();
    return res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

/**
 * Get checklist by category
 */
router.get('/checklists/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const checklist = await hipaaService.getChecklistByCategory(category);
    
    if (!checklist) {
      return res.status(404).json({
        error: {
          message: `Checklist not found for category: ${category}`
        }
      });
    }
    
    return res.json(checklist);
  } catch (error) {
    next(error);
  }
});

/**
 * Get all checklists
 */
router.get('/checklists', async (req, res, next) => {
  try {
    const checklists = await hipaaService.getAllChecklists();
    return res.json({ checklists });
  } catch (error) {
    next(error);
  }
});

/**
 * Update checklist item status
 */
router.patch('/checklists/:category/items/:itemId', 
  validateSchema(hipaaSchemas.checklistItemUpdate), 
  async (req, res, next) => {
    try {
      const { category, itemId } = req.params;
      const { completed, notes } = req.body;
      
      const updatedItem = await hipaaService.updateChecklistItem(
        category, 
        itemId, 
        { completed, notes },
        req.user.id
      );
      
      if (!updatedItem) {
        return res.status(404).json({
          error: {
            message: `Checklist item not found: ${itemId} in category ${category}`
          }
        });
      }
      
      return res.json(updatedItem);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get upcoming reviews
 */
router.get('/reviews/upcoming', async (req, res, next) => {
  try {
    const { limit } = req.query;
    const reviews = await hipaaService.getUpcomingReviews(limit);
    return res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

/**
 * Schedule a new review
 */
router.post('/reviews', 
  validateSchema(hipaaSchemas.reviewCreate), 
  async (req, res, next) => {
    try {
      const reviewData = req.body;
      const newReview = await hipaaService.scheduleReview({
        ...reviewData,
        createdBy: req.user.id
      });
      
      return res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * Get compliance status by category
 */
router.get('/status/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const status = await hipaaService.getComplianceStatus(category);
    
    if (!status) {
      return res.status(404).json({
        error: {
          message: `Compliance status not found for category: ${category}`
        }
      });
    }
    
    return res.json(status);
  } catch (error) {
    next(error);
  }
});

/**
 * Get compliance report
 */
router.get('/reports/compliance', async (req, res, next) => {
  try {
    const report = await hipaaService.generateComplianceReport();
    return res.json(report);
  } catch (error) {
    next(error);
  }
});

module.exports = router;