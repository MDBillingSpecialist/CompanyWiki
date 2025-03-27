/**
 * HIPAA Service
 * 
 * Handles HIPAA-specific functionality such as compliance tracking and checklists
 */
const axios = require('axios');
const { logger } = require('../utils/logger');

class HipaaService {
  constructor() {
    this.hipaaExtUrl = process.env.HIPAA_EXT_URL || 'http://hipaa-extensions:3300';
    
    this.client = axios.create({
      baseURL: this.hipaaExtUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        logger.error('HIPAA Service Error:', error?.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Get dashboard data with compliance status
   */
  async getDashboardData() {
    try {
      const response = await this.client.get('/api/dashboard');
      return response.data;
    } catch (error) {
      logger.error('Error fetching HIPAA dashboard data:', error.message);
      throw error;
    }
  }
  
  /**
   * Get checklist by category
   */
  async getChecklistByCategory(category) {
    try {
      const response = await this.client.get(`/api/checklists/${category}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      
      logger.error(`Error fetching HIPAA checklist for category ${category}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get all checklists
   */
  async getAllChecklists() {
    try {
      const response = await this.client.get('/api/checklists');
      return response.data;
    } catch (error) {
      logger.error('Error fetching all HIPAA checklists:', error.message);
      throw error;
    }
  }
  
  /**
   * Update checklist item status
   */
  async updateChecklistItem(category, itemId, { completed, notes }, userId) {
    try {
      const response = await this.client.patch(`/api/checklists/${category}/items/${itemId}`, {
        completed,
        notes,
        updatedBy: userId
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      
      logger.error(`Error updating HIPAA checklist item ${itemId}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Get upcoming reviews
   */
  async getUpcomingReviews(limit = 10) {
    try {
      const response = await this.client.get('/api/reviews/upcoming', {
        params: { limit }
      });
      
      return response.data;
    } catch (error) {
      logger.error('Error fetching upcoming HIPAA reviews:', error.message);
      throw error;
    }
  }
  
  /**
   * Schedule a new review
   */
  async scheduleReview(reviewData) {
    try {
      const response = await this.client.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      logger.error('Error scheduling HIPAA review:', error.message);
      throw error;
    }
  }
  
  /**
   * Get compliance status by category
   */
  async getComplianceStatus(category) {
    try {
      const response = await this.client.get(`/api/status/${category}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      
      logger.error(`Error fetching compliance status for category ${category}:`, error.message);
      throw error;
    }
  }
  
  /**
   * Generate compliance report
   */
  async generateComplianceReport() {
    try {
      const response = await this.client.get('/api/reports/compliance');
      return response.data;
    } catch (error) {
      logger.error('Error generating compliance report:', error.message);
      throw error;
    }
  }
}

// Create singleton instance
const hipaaService = new HipaaService();

module.exports = { hipaaService };