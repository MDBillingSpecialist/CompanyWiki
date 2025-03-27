/**
 * LLM Service
 * 
 * Handles communication with the LLM content pipeline
 */
const axios = require('axios');
const { logger } = require('../utils/logger');
const { wikiApiService } = require('./wikiApiService');

class LlmService {
  constructor() {
    this.llmPipelineUrl = process.env.LLM_PIPELINE_URL || 'http://llm-pipeline:3400';
    
    this.client = axios.create({
      baseURL: this.llmPipelineUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        logger.error('LLM Service Error:', error?.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Generate content using LLM
   */
  async generateContent({ content, title, targetSection, contentType, instructions, userId }) {
    try {
      const response = await this.client.post('/api/generate', {
        content,
        title,
        targetSection,
        contentType,
        instructions,
        userId
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error generating content with LLM:', error.message);
      throw error;
    }
  }
  
  /**
   * Get all content drafts
   */
  async getContentDrafts({ status, limit = 10, offset = 0, userId }) {
    try {
      const response = await this.client.get('/api/drafts', {
        params: {
          status,
          limit,
          offset,
          userId
        }
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error fetching content drafts:', error.message);
      throw error;
    }
  }
  
  /**
   * Get content draft by ID
   */
  async getContentDraftById(id) {
    try {
      const response = await this.client.get(`/api/drafts/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      
      logger.error(`Error fetching content draft with ID ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Update content draft
   */
  async updateContentDraft(id, { content, metadata, updatedBy }) {
    try {
      const response = await this.client.put(`/api/drafts/${id}`, {
        content,
        metadata,
        updatedBy
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Error updating content draft with ID ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Publish content to wiki
   */
  async publishContentToWiki(draftId, { path, comment, publishedBy }) {
    try {
      // First get the draft
      const draft = await this.getContentDraftById(draftId);
      
      if (!draft) {
        throw new Error(`Draft not found with ID: ${draftId}`);
      }
      
      // Update draft status to publishing
      await this.client.post(`/api/drafts/${draftId}/status`, {
        status: 'publishing',
        userId: publishedBy
      });
      
      try {
        // Create or update page in Wiki.js
        let wikiPage;
        const existingPage = await wikiApiService.getPageByPath(path);
        
        if (existingPage) {
          // Update existing page
          wikiPage = await wikiApiService.updatePage(existingPage.id, {
            title: draft.metadata.title,
            content: draft.content,
            description: draft.metadata.description,
            tags: draft.metadata.tags || [],
            isPublished: true
          });
        } else {
          // Create new page
          wikiPage = await wikiApiService.createPage({
            path,
            title: draft.metadata.title,
            content: draft.content,
            description: draft.metadata.description,
            tags: draft.metadata.tags || [],
            isPublished: true
          });
        }
        
        // Update draft status to published
        await this.client.post(`/api/drafts/${draftId}/status`, {
          status: 'published',
          pageId: wikiPage.id,
          userId: publishedBy,
          comment
        });
        
        return {
          id: wikiPage.id,
          path: wikiPage.path,
          title: wikiPage.title
        };
      } catch (error) {
        // If publishing fails, revert draft status
        await this.client.post(`/api/drafts/${draftId}/status`, {
          status: 'draft',
          error: error.message,
          userId: publishedBy
        });
        
        throw error;
      }
    } catch (error) {
      logger.error(`Error publishing content draft with ID ${draftId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Reject content draft
   */
  async rejectContentDraft(id, { reason, rejectedBy }) {
    try {
      const response = await this.client.post(`/api/drafts/${id}/status`, {
        status: 'rejected',
        reason,
        userId: rejectedBy
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Error rejecting content draft with ID ${id}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Improve content draft using LLM
   */
  async improveContentDraft(id, { instructions, requestedBy }) {
    try {
      const response = await this.client.post(`/api/drafts/${id}/improve`, {
        instructions,
        userId: requestedBy
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Error improving content draft with ID ${id}:`, error.message);
      throw error;
    }
  }
}

// Create singleton instance
const llmService = new LlmService();

module.exports = { llmService };