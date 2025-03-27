/**
 * HIPAA Extensions Service
 * 
 * Provides HIPAA-specific functionality for compliance tracking and reporting.
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const winston = require('winston');
const jwt = require('jsonwebtoken');

// Initialize logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3300;

// Initialize database connection
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'wikijs',
  password: process.env.DB_PASS || 'wikijs',
  database: process.env.DB_NAME || 'wiki',
  logging: msg => logger.debug(msg)
});

// Load models (would import from separate files in a full implementation)
const ComplianceStatus = sequelize.define('ComplianceStatus', {
  category: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  status: {
    type: Sequelize.ENUM('compliant', 'at-risk', 'non-compliant', 'pending-review'),
    defaultValue: 'pending-review'
  },
  lastReviewed: Sequelize.DATE,
  nextReview: Sequelize.DATE,
  progress: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  itemsTotal: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  itemsCompleted: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

const ChecklistCategory = sequelize.define('ChecklistCategory', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  category: Sequelize.STRING
});

const ChecklistItem = sequelize.define('ChecklistItem', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  categoryId: Sequelize.STRING,
  label: Sequelize.STRING,
  description: Sequelize.TEXT,
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: Sequelize.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },
  notes: Sequelize.TEXT
});

const Review = sequelize.define('Review', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  title: Sequelize.STRING,
  category: Sequelize.STRING,
  description: Sequelize.TEXT,
  dueDate: Sequelize.DATE,
  assignedTo: Sequelize.STRING,
  priority: {
    type: Sequelize.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium'
  },
  status: {
    type: Sequelize.ENUM('pending', 'completed', 'overdue'),
    defaultValue: 'pending'
  }
});

// Define relationships
ChecklistCategory.hasMany(ChecklistItem, { foreignKey: 'categoryId', as: 'items' });
ChecklistItem.belongsTo(ChecklistCategory, { foreignKey: 'categoryId' });

// Authentication middleware
const authenticateJWT = (req, res, next) => {
  // For development/demo, allow bypassing authentication
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    // Add a mock user for development
    req.user = { id: 'development-user', roles: ['admin'] };
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
      req.user = decoded;
      next();
    } catch (err) {
      logger.error('JWT verification error:', err);
      return res.status(403).json({ error: { message: 'Invalid or expired token' } });
    }
  } else {
    // For easier testing/development, also accept API key as basic auth
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (apiKey && apiKey === (process.env.API_KEY || 'dev_api_key')) {
      req.user = { id: 'api-user', roles: ['admin'] };
      return next();
    }
    
    return res.status(401).json({ error: { message: 'Authentication required' } });
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public route for health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'hipaa-extensions'
  });
});

// Apply authentication middleware to all API routes
app.use('/api', authenticateJWT);

// Routes (would be in separate files in a full implementation)

// Get dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const complianceStatus = await ComplianceStatus.findAll();
    const upcomingReviews = await Review.findAll({
      where: {
        dueDate: {
          [Sequelize.Op.gte]: new Date()
        },
        status: 'pending'
      },
      order: [['dueDate', 'ASC']],
      limit: 5
    });
    
    res.json({
      complianceStatus: complianceStatus.map(status => ({
        category: status.category,
        status: status.status,
        lastReviewed: status.lastReviewed,
        nextReview: status.nextReview,
        progress: status.progress,
        items: {
          total: status.itemsTotal,
          completed: status.itemsCompleted
        }
      })),
      upcomingReviews,
      lastUpdated: new Date()
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: { message: 'Failed to fetch dashboard data' } });
  }
});

// Get checklist by category
app.get('/api/checklists/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const categories = await ChecklistCategory.findAll({
      where: { category },
      include: [{ model: ChecklistItem, as: 'items' }]
    });
    
    if (categories.length === 0) {
      return res.status(404).json({ error: { message: `No checklists found for category: ${category}` } });
    }
    
    res.json({
      id: `checklist-${category}`,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Safeguards Checklist`,
      description: `Checklist for HIPAA ${category} Safeguards`,
      categories,
      lastUpdated: new Date()
    });
  } catch (error) {
    logger.error(`Error fetching checklist for category ${req.params.category}:`, error);
    res.status(500).json({ error: { message: 'Failed to fetch checklist' } });
  }
});

// Get all checklists
app.get('/api/checklists', async (req, res) => {
  try {
    const categories = await ChecklistCategory.findAll({
      include: [{ model: ChecklistItem, as: 'items' }]
    });
    
    res.json({ categories });
  } catch (error) {
    logger.error('Error fetching all checklists:', error);
    res.status(500).json({ error: { message: 'Failed to fetch checklists' } });
  }
});

// Update checklist item
app.patch('/api/checklists/:category/items/:itemId', async (req, res) => {
  try {
    const { category, itemId } = req.params;
    const { completed, notes } = req.body;
    const userId = req.user.id;
    
    const item = await ChecklistItem.findOne({
      where: { id: itemId },
      include: [{ model: ChecklistCategory, where: { category } }]
    });
    
    if (!item) {
      return res.status(404).json({ error: { message: `Item not found: ${itemId} in category ${category}` } });
    }
    
    // Update the item
    item.completed = completed;
    if (notes !== undefined) {
      item.notes = notes;
    }
    await item.save();
    
    // Update compliance status
    const categoryItems = await ChecklistItem.findAll({
      include: [{ model: ChecklistCategory, where: { category } }]
    });
    
    const totalItems = categoryItems.length;
    const completedItems = categoryItems.filter(item => item.completed).length;
    const progress = Math.round((completedItems / totalItems) * 100);
    
    await ComplianceStatus.upsert({
      category,
      progress,
      itemsTotal: totalItems,
      itemsCompleted: completedItems,
      status: progress === 100 ? 'compliant' : progress >= 80 ? 'at-risk' : 'non-compliant',
      lastReviewed: new Date()
    });
    
    res.json({
      id: item.id,
      category,
      label: item.label,
      description: item.description,
      completed: item.completed,
      notes: item.notes,
      priority: item.priority,
      updatedAt: new Date(),
      updatedBy: userId
    });
  } catch (error) {
    logger.error(`Error updating checklist item ${req.params.itemId}:`, error);
    res.status(500).json({ error: { message: 'Failed to update checklist item' } });
  }
});

// Create a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { title, category, description, dueDate, assignedTo, priority } = req.body;
    const userId = req.user.id;
    
    const review = await Review.create({
      id: `rev-${Date.now()}`,
      title,
      category,
      description,
      dueDate,
      assignedTo,
      priority,
      status: 'pending'
    });
    
    res.status(201).json(review);
  } catch (error) {
    logger.error('Error creating review:', error);
    res.status(500).json({ error: { message: 'Failed to create review' } });
  }
});

// Get upcoming reviews
app.get('/api/reviews/upcoming', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const reviews = await Review.findAll({
      where: {
        dueDate: {
          [Sequelize.Op.gte]: new Date()
        },
        status: 'pending'
      },
      order: [['dueDate', 'ASC']],
      limit: parseInt(limit)
    });
    
    res.json({ reviews });
  } catch (error) {
    logger.error('Error fetching upcoming reviews:', error);
    res.status(500).json({ error: { message: 'Failed to fetch upcoming reviews' } });
  }
});

// Get compliance status by category
app.get('/api/status/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const status = await ComplianceStatus.findByPk(category);
    
    if (!status) {
      return res.status(404).json({ error: { message: `No compliance status found for category: ${category}` } });
    }
    
    res.json({
      category: status.category,
      status: status.status,
      lastReviewed: status.lastReviewed,
      nextReview: status.nextReview,
      progress: status.progress,
      items: {
        total: status.itemsTotal,
        completed: status.itemsCompleted
      }
    });
  } catch (error) {
    logger.error(`Error fetching compliance status for category ${req.params.category}:`, error);
    res.status(500).json({ error: { message: 'Failed to fetch compliance status' } });
  }
});

// Generate compliance report
app.get('/api/reports/compliance', async (req, res) => {
  try {
    const statuses = await ComplianceStatus.findAll();
    const checklists = await ChecklistCategory.findAll({
      include: [{ model: ChecklistItem, as: 'items' }]
    });
    
    // Generate a simple report - in a real implementation, this would be more sophisticated
    const report = {
      generatedAt: new Date(),
      overallStatus: statuses.every(s => s.status === 'compliant') ? 'compliant' : 'non-compliant',
      categories: statuses.map(status => ({
        category: status.category,
        status: status.status,
        progress: status.progress,
        itemsTotal: status.itemsTotal,
        itemsCompleted: status.itemsCompleted,
        lastReviewed: status.lastReviewed,
        nextReview: status.nextReview
      })),
      details: checklists.map(cat => ({
        category: cat.category,
        name: cat.name,
        itemsTotal: cat.items.length,
        itemsCompleted: cat.items.filter(item => item.completed).length,
        highPriorityItems: cat.items.filter(item => item.priority === 'high').length,
        highPriorityCompleted: cat.items.filter(item => item.priority === 'high' && item.completed).length
      }))
    };
    
    res.json(report);
  } catch (error) {
    logger.error('Error generating compliance report:', error);
    res.status(500).json({ error: { message: 'Failed to generate compliance report' } });
  }
});

// Create compliance status (for testing)
app.post('/api/status', async (req, res) => {
  try {
    const status = await ComplianceStatus.create(req.body);
    res.status(201).json(status);
  } catch (error) {
    logger.error('Error creating compliance status:', error);
    res.status(500).json({ error: { message: 'Failed to create compliance status' } });
  }
});

// Create checklist category (for testing)
app.post('/api/checklists', async (req, res) => {
  try {
    const { id, name, description, category, items } = req.body;
    
    // Create the category
    const checklistCategory = await ChecklistCategory.create({
      id: id || `cat-${Date.now()}`,
      name,
      description,
      category
    });
    
    // Create the items
    if (items && Array.isArray(items)) {
      for (const itemData of items) {
        await ChecklistItem.create({
          id: itemData.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          categoryId: checklistCategory.id,
          label: itemData.label,
          description: itemData.description,
          completed: itemData.completed || false,
          priority: itemData.priority || 'medium',
          notes: itemData.notes
        });
      }
    }
    
    // Return the full category with items
    const fullCategory = await ChecklistCategory.findByPk(checklistCategory.id, {
      include: [{ model: ChecklistItem, as: 'items' }]
    });
    
    res.status(201).json(fullCategory);
  } catch (error) {
    logger.error('Error creating checklist category:', error);
    res.status(500).json({ error: { message: 'Failed to create checklist category' } });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message
    }
  });
});

// Set development environment for easier testing
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
  process.env.BYPASS_AUTH = 'true';
}

// Start the server
async function start() {
  try {
    // Sync database models
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized');
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`HIPAA Extensions service running on port ${PORT}`);
      logger.info(`Authentication ${process.env.BYPASS_AUTH === 'true' ? 'bypassed' : 'required'} for API calls`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();