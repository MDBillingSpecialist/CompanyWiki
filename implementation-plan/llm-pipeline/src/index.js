/**
 * LLM Content Pipeline Service
 * 
 * Provides automated content generation using LLMs (OpenAI/Anthropic)
 */
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

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
const PORT = process.env.PORT || 3400;

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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
const ContentDraft = sequelize.define('ContentDraft', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
  originalContent: Sequelize.TEXT,
  metadata: Sequelize.JSON,
  status: {
    type: Sequelize.ENUM('draft', 'reviewing', 'published', 'rejected'),
    defaultValue: 'draft'
  },
  createdBy: Sequelize.STRING,
  updatedBy: Sequelize.STRING,
  publishedBy: Sequelize.STRING,
  publishedPageId: Sequelize.INTEGER,
  publishedPath: Sequelize.STRING,
  rejectionReason: Sequelize.TEXT
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure content cache directory exists
const contentCacheDir = path.join(__dirname, '../content-cache');
if (!fs.existsSync(contentCacheDir)) {
  fs.mkdirSync(contentCacheDir, { recursive: true });
}

// Routes (would be in separate files in a full implementation)

// Generate content
app.post('/api/generate', async (req, res) => {
  try {
    const { content, title, targetSection, contentType, instructions, userId } = req.body;
    
    // Log generation request
    logger.info('Content generation request received', {
      title,
      targetSection,
      contentType,
      contentLength: content.length,
      userId
    });
    
    // Choose AI provider (would implement more sophisticated routing in production)
    const provider = process.env.DEFAULT_AI_PROVIDER || 'openai';
    
    // Build prompt for content generation
    const prompt = buildGenerationPrompt(content, title, targetSection, contentType, instructions);
    
    // Generate content
    let generatedContent;
    if (provider === 'anthropic') {
      generatedContent = await generateWithAnthropic(prompt);
    } else {
      generatedContent = await generateWithOpenAI(prompt);
    }
    
    // Process and clean up the generated content
    const { processedContent, extractedMetadata } = processGeneratedContent(generatedContent, contentType);
    
    // Create draft in database
    const draftId = uuidv4();
    const draft = await ContentDraft.create({
      id: draftId,
      title: extractedMetadata.title || title,
      content: processedContent,
      originalContent: content,
      metadata: {
        title: extractedMetadata.title || title,
        description: extractedMetadata.description || '',
        tags: extractedMetadata.tags || [],
        targetSection,
        contentType,
        instructions,
        sourcePrompt: prompt,
        provider
      },
      status: 'draft',
      createdBy: userId
    });
    
    // Save content to file cache (for backup)
    fs.writeFileSync(
      path.join(contentCacheDir, `${draftId}.md`),
      processedContent
    );
    
    res.status(201).json({
      draftId,
      content: processedContent,
      metadata: draft.metadata
    });
  } catch (error) {
    logger.error('Error generating content:', error);
    res.status(500).json({ error: { message: 'Failed to generate content' } });
  }
});

// Get content drafts
app.get('/api/drafts', async (req, res) => {
  try {
    const { status, limit = 10, offset = 0, userId } = req.query;
    
    // Build query conditions
    const where = {};
    if (status) {
      where.status = status;
    }
    if (userId && req.query.all !== 'true') {
      where.createdBy = userId;
    }
    
    // Get drafts from database
    const drafts = await ContentDraft.findAndCountAll({
      where,
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      drafts: drafts.rows,
      total: drafts.count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Error fetching drafts:', error);
    res.status(500).json({ error: { message: 'Failed to fetch drafts' } });
  }
});

// Get draft by ID
app.get('/api/drafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const draft = await ContentDraft.findByPk(id);
    
    if (!draft) {
      return res.status(404).json({ error: { message: `Draft not found with ID: ${id}` } });
    }
    
    res.json(draft);
  } catch (error) {
    logger.error(`Error fetching draft ${req.params.id}:`, error);
    res.status(500).json({ error: { message: 'Failed to fetch draft' } });
  }
});

// Update draft
app.put('/api/drafts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, metadata, updatedBy } = req.body;
    
    const draft = await ContentDraft.findByPk(id);
    
    if (!draft) {
      return res.status(404).json({ error: { message: `Draft not found with ID: ${id}` } });
    }
    
    // Update draft
    if (content) {
      draft.content = content;
      
      // Update cache file
      fs.writeFileSync(
        path.join(contentCacheDir, `${id}.md`),
        content
      );
    }
    
    if (metadata) {
      draft.metadata = { ...draft.metadata, ...metadata };
    }
    
    draft.updatedBy = updatedBy;
    await draft.save();
    
    res.json(draft);
  } catch (error) {
    logger.error(`Error updating draft ${req.params.id}:`, error);
    res.status(500).json({ error: { message: 'Failed to update draft' } });
  }
});

// Update draft status
app.post('/api/drafts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pageId, path, reason, error, userId } = req.body;
    
    const draft = await ContentDraft.findByPk(id);
    
    if (!draft) {
      return res.status(404).json({ error: { message: `Draft not found with ID: ${id}` } });
    }
    
    // Update status
    draft.status = status;
    
    // Update additional fields based on status
    if (status === 'published' && pageId) {
      draft.publishedPageId = pageId;
      draft.publishedPath = path;
      draft.publishedBy = userId;
    } else if (status === 'rejected' && reason) {
      draft.rejectionReason = reason;
    }
    
    // Store error if provided
    if (error) {
      draft.metadata = {
        ...draft.metadata,
        error
      };
    }
    
    await draft.save();
    
    res.json({
      id: draft.id,
      status: draft.status,
      updatedAt: draft.updatedAt
    });
  } catch (error) {
    logger.error(`Error updating draft status ${req.params.id}:`, error);
    res.status(500).json({ error: { message: 'Failed to update draft status' } });
  }
});

// Improve draft
app.post('/api/drafts/:id/improve', async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions, userId } = req.body;
    
    const draft = await ContentDraft.findByPk(id);
    
    if (!draft) {
      return res.status(404).json({ error: { message: `Draft not found with ID: ${id}` } });
    }
    
    // Build prompt for improvement
    const prompt = buildImprovementPrompt(draft.content, instructions, draft.metadata);
    
    // Choose AI provider
    const provider = process.env.DEFAULT_AI_PROVIDER || 'openai';
    
    // Generate improved content
    let improvedContent;
    if (provider === 'anthropic') {
      improvedContent = await generateWithAnthropic(prompt);
    } else {
      improvedContent = await generateWithOpenAI(prompt);
    }
    
    // Process and clean up the generated content
    const { processedContent, extractedMetadata } = processGeneratedContent(
      improvedContent,
      draft.metadata.contentType
    );
    
    // Create new draft based on the original
    const newDraftId = uuidv4();
    const newDraft = await ContentDraft.create({
      id: newDraftId,
      title: extractedMetadata.title || draft.title,
      content: processedContent,
      originalContent: draft.content,
      metadata: {
        ...draft.metadata,
        title: extractedMetadata.title || draft.metadata.title,
        description: extractedMetadata.description || draft.metadata.description,
        tags: extractedMetadata.tags || draft.metadata.tags,
        improvementInstructions: instructions,
        previousDraftId: draft.id,
        provider
      },
      status: 'draft',
      createdBy: userId
    });
    
    // Save content to file cache
    fs.writeFileSync(
      path.join(contentCacheDir, `${newDraftId}.md`),
      processedContent
    );
    
    res.status(201).json({
      draftId: newDraftId,
      content: processedContent,
      metadata: newDraft.metadata
    });
  } catch (error) {
    logger.error(`Error improving draft ${req.params.id}:`, error);
    res.status(500).json({ error: { message: 'Failed to improve draft' } });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'llm-pipeline'
  });
});

// Helper functions

// Build prompt for content generation
function buildGenerationPrompt(content, title, targetSection, contentType, instructions) {
  let prompt = 'You are a professional technical writer for a company wiki. ';
  
  if (contentType === 'hipaa-checklist') {
    prompt += 'Your task is to create a detailed HIPAA compliance checklist. ';
  } else if (contentType === 'sop') {
    prompt += 'Your task is to create a standard operating procedure (SOP) document. ';
  } else {
    prompt += 'Your task is to create high-quality documentation content. ';
  }
  
  prompt += 'Format your response in Markdown.\n\n';
  
  if (title) {
    prompt += `The title of the document should be: "${title}"\n\n`;
  }
  
  if (targetSection) {
    prompt += `This content will be placed in the ${targetSection} section of the wiki.\n\n`;
  }
  
  if (instructions) {
    prompt += `Special instructions: ${instructions}\n\n`;
  }
  
  prompt += 'Here is the content to transform into professional documentation:\n\n';
  prompt += content;
  
  prompt += '\n\nPlease include appropriate frontmatter with title, description, and tags.';
  
  return prompt;
}

// Build prompt for content improvement
function buildImprovementPrompt(content, instructions, metadata) {
  let prompt = 'You are a professional technical writer for a company wiki. ';
  prompt += 'Your task is to improve the following documentation content based on specific instructions.\n\n';
  
  if (metadata?.contentType) {
    if (metadata.contentType === 'hipaa-checklist') {
      prompt += 'This is a HIPAA compliance checklist that needs improvement.\n\n';
    } else if (metadata.contentType === 'sop') {
      prompt += 'This is a standard operating procedure (SOP) document that needs improvement.\n\n';
    }
  }
  
  prompt += 'Format your response in Markdown and maintain any existing structure.\n\n';
  
  prompt += `Improvement instructions: ${instructions}\n\n`;
  
  prompt += 'Here is the content to improve:\n\n';
  prompt += content;
  
  prompt += '\n\nPlease include appropriate frontmatter with title, description, and tags.';
  
  return prompt;
}

// Generate content with OpenAI
async function generateWithOpenAI(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 4000
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    logger.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Generate content with Anthropic
async function generateWithAnthropic(prompt) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    return response.content[0].text;
  } catch (error) {
    logger.error('Anthropic API error:', error);
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

// Process generated content
function processGeneratedContent(content, contentType) {
  // Extract frontmatter
  const frontmatterMatch = content.match(/---\n([\s\S]*?)\n---/);
  let processedContent = content;
  const extractedMetadata = {
    title: '',
    description: '',
    tags: []
  };
  
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    
    // Extract title
    const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?\s*\n/);
    if (titleMatch) {
      extractedMetadata.title = titleMatch[1].trim();
    }
    
    // Extract description
    const descriptionMatch = frontmatter.match(/description:\s*["']?(.*?)["']?\s*\n/);
    if (descriptionMatch) {
      extractedMetadata.description = descriptionMatch[1].trim();
    }
    
    // Extract tags
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);
    if (tagsMatch) {
      extractedMetadata.tags = tagsMatch[1]
        .split(',')
        .map(tag => tag.trim().replace(/['"]/g, ''))
        .filter(Boolean);
    }
  }
  
  return { processedContent, extractedMetadata };
}

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

// Start the server
async function start() {
  try {
    // Sync database models
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized');
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`LLM Pipeline service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();