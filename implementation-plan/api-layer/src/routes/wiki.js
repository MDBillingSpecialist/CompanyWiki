/**
 * Wiki.js API Integration Routes
 * 
 * Provides RESTful interfaces for Wiki.js GraphQL API operations
 */
const express = require('express');
const { wikiApiService } = require('../services/wikiApiService');
const { validateSchema } = require('../middleware/validation');
const { cacheMiddleware } = require('../middleware/cache');
const { contentSchemas } = require('../utils/validationSchemas');
const router = express.Router();

/**
 * Get page by path
 */
router.get('/pages/:path(*)', cacheMiddleware('wiki:page', 60), async (req, res, next) => {
  try {
    const path = req.params.path;
    const page = await wikiApiService.getPageByPath(path);
    
    if (!page) {
      return res.status(404).json({
        error: {
          message: `Page not found: ${path}`
        }
      });
    }
    
    return res.json({ page });
  } catch (error) {
    next(error);
  }
});

/**
 * List pages
 */
router.get('/pages', cacheMiddleware('wiki:pages', 120), async (req, res, next) => {
  try {
    const { locale, tags, limit, orderBy } = req.query;
    const pages = await wikiApiService.listPages({ locale, tags, limit, orderBy });
    
    return res.json({ pages });
  } catch (error) {
    next(error);
  }
});

/**
 * Search pages
 */
router.get('/search', async (req, res, next) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({
        error: {
          message: 'Search query is required'
        }
      });
    }
    
    const results = await wikiApiService.searchPages(query, limit);
    return res.json({ results });
  } catch (error) {
    next(error);
  }
});

/**
 * Create page
 */
router.post('/pages', validateSchema(contentSchemas.pageCreate), async (req, res, next) => {
  try {
    const { path, title, content, description, tags, isPublished } = req.body;
    
    // Check if page already exists
    const existingPage = await wikiApiService.getPageByPath(path);
    if (existingPage) {
      return res.status(409).json({
        error: {
          message: `Page already exists at path: ${path}`
        }
      });
    }
    
    const newPage = await wikiApiService.createPage({
      path,
      title,
      content,
      description,
      tags,
      isPublished: isPublished !== false
    });
    
    return res.status(201).json({ page: newPage });
  } catch (error) {
    next(error);
  }
});

/**
 * Update page
 */
router.put('/pages/:id', validateSchema(contentSchemas.pageUpdate), async (req, res, next) => {
  try {
    const pageId = req.params.id;
    const { title, content, description, tags, isPublished } = req.body;
    
    // Check if page exists
    const existingPage = await wikiApiService.getPageById(pageId);
    if (!existingPage) {
      return res.status(404).json({
        error: {
          message: `Page not found with ID: ${pageId}`
        }
      });
    }
    
    const updatedPage = await wikiApiService.updatePage(pageId, {
      title,
      content,
      description,
      tags,
      isPublished
    });
    
    return res.json({ page: updatedPage });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete page
 */
router.delete('/pages/:id', async (req, res, next) => {
  try {
    const pageId = req.params.id;
    
    // Check if page exists
    const existingPage = await wikiApiService.getPageById(pageId);
    if (!existingPage) {
      return res.status(404).json({
        error: {
          message: `Page not found with ID: ${pageId}`
        }
      });
    }
    
    await wikiApiService.deletePage(pageId);
    
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

/**
 * Get asset by path
 */
router.get('/assets/:path(*)', async (req, res, next) => {
  try {
    const path = req.params.path;
    const asset = await wikiApiService.getAssetByPath(path);
    
    if (!asset) {
      return res.status(404).json({
        error: {
          message: `Asset not found: ${path}`
        }
      });
    }
    
    return res.json({ asset });
  } catch (error) {
    next(error);
  }
});

/**
 * Get navigation tree
 */
router.get('/navigation', cacheMiddleware('wiki:nav', 300), async (req, res, next) => {
  try {
    const { locale } = req.query;
    const navigation = await wikiApiService.getNavigationTree(locale);
    
    return res.json({ navigation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;