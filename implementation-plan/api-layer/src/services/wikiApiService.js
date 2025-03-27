/**
 * Wiki.js API Service
 * 
 * Handles communication with the Wiki.js GraphQL API
 */
const axios = require('axios');
const { logger } = require('../utils/logger');

class WikiApiService {
  constructor() {
    this.apiUrl = process.env.WIKI_API_URL || 'http://wiki:3000/graphql';
    this.apiKey = process.env.WIKI_API_KEY || '';
    this.username = process.env.WIKI_ADMIN_USER || 'admin@example.com';
    this.password = process.env.WIKI_ADMIN_PASSWORD || 'wikijsrocks';
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        logger.error('Wiki API Error:', error?.response?.data || error.message);
        return Promise.reject(error);
      }
    );
    
    // Initially login to get JWT token
    this.login().catch(err => {
      logger.error('Failed to login to Wiki.js during service initialization:', err.message);
    });
  }
  
  /**
   * Login to Wiki.js and get JWT token
   */
  async login() {
    try {
      logger.info(`Attempting to login to Wiki.js with user: ${this.username}`);
      
      const loginQuery = `
        mutation Login($username: String!, $password: String!) {
          authentication {
            login(username: $username, password: $password) {
              responseResult {
                succeeded
                errorCode
                slug
                message
              }
              jwt
            }
          }
        }
      `;
      
      const loginResponse = await this.client.post('', {
        query: loginQuery,
        variables: {
          username: this.username,
          password: this.password
        }
      });
      
      if (loginResponse.data.errors || !loginResponse.data.data?.authentication?.login?.responseResult?.succeeded) {
        const errorMessage = loginResponse.data.errors 
          ? loginResponse.data.errors.map(e => e.message).join(', ') 
          : loginResponse.data.data?.authentication?.login?.responseResult?.message || 'Unknown login error';
        throw new Error(`Login failed: ${errorMessage}`);
      }
      
      const jwt = loginResponse.data.data.authentication.login.jwt;
      logger.info('Successfully logged in to Wiki.js and obtained JWT token');
      
      // Update client headers with JWT token
      this.client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      
      return jwt;
    } catch (error) {
      logger.error('Login to Wiki.js failed:', error.message);
      throw error;
    }
  }
  
  /**
   * Execute a GraphQL query
   */
  async executeQuery(query, variables = {}) {
    try {
      const response = await this.client.post('', {
        query,
        variables
      });
      
      if (response.data.errors) {
        const errorMessage = response.data.errors.map(e => e.message).join(', ');
        logger.error('GraphQL Errors:', errorMessage);
        throw new Error(`GraphQL Errors: ${errorMessage}`);
      }
      
      return response.data.data;
    } catch (error) {
      // If unauthorized, try to login again and retry
      if (error.response && error.response.status === 401) {
        logger.info('Token expired, attempting to login again');
        await this.login();
        
        // Retry the query
        return this.executeQuery(query, variables);
      }
      
      logger.error('Wiki API Query Error:', error.message);
      throw error;
    }
  }
  
  /**
   * Get a page by its path
   */
  async getPageByPath(path) {
    const query = `
      query GetPageByPath($path: String!) {
        pages {
          singleByPath(path: $path) {
            id
            path
            title
            description
            isPublished
            isPrivate
            createdAt
            updatedAt
            content
            contentType
            editor
            locale
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { path });
    return data?.pages?.singleByPath || null;
  }
  
  /**
   * Get a page by its ID
   */
  async getPageById(id) {
    const query = `
      query GetPageById($id: Int!) {
        pages {
          single(id: $id) {
            id
            path
            title
            description
            isPublished
            isPrivate
            createdAt
            updatedAt
            content
            contentType
            editor
            locale
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { id: parseInt(id) });
    return data?.pages?.single || null;
  }
  
  /**
   * List pages with optional filtering
   */
  async listPages({ locale = 'en', tags = [], limit = 20, orderBy = 'TITLE' } = {}) {
    const query = `
      query ListPages($locale: String!, $tags: [String!], $limit: Int, $orderBy: PageOrderBy!) {
        pages {
          list(locale: $locale, tags: $tags, limit: $limit, orderBy: $orderBy) {
            id
            path
            title
            description
            isPublished
            isPrivate
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { locale, tags, limit: parseInt(limit), orderBy });
    return data?.pages?.list || [];
  }
  
  /**
   * Search pages
   */
  async searchPages(query, limit = 20) {
    const gqlQuery = `
      query SearchPages($query: String!, $limit: Int) {
        pages {
          search(query: $query, limit: $limit) {
            id
            path
            title
            description
            isPublished
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const data = await this.executeQuery(gqlQuery, { query, limit: parseInt(limit) });
    return data?.pages?.search || [];
  }
  
  /**
   * Create a new page
   */
  async createPage({ path, title, content, description = '', tags = [], isPublished = true }) {
    const query = `
      mutation CreatePage(
        $content: String!, 
        $description: String!, 
        $editor: String!, 
        $isPublished: Boolean!, 
        $isPrivate: Boolean!, 
        $locale: String!, 
        $path: String!, 
        $tags: [String]!, 
        $title: String!
      ) {
        pages {
          create(
            content: $content,
            description: $description,
            editor: $editor,
            isPublished: $isPublished,
            isPrivate: $isPrivate,
            locale: $locale,
            path: $path,
            tags: $tags,
            title: $title
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            page {
              id
              path
              title
            }
          }
        }
      }
    `;
    
    const variables = {
      content,
      description: description || 'No description provided',
      editor: "markdown",
      isPublished,
      isPrivate: false,
      locale: "en",
      path,
      tags,
      title
    };
    
    const data = await this.executeQuery(query, variables);
    
    if (!data?.pages?.create?.responseResult?.succeeded) {
      throw new Error(data?.pages?.create?.responseResult?.message || 'Failed to create page');
    }
    
    return data?.pages?.create?.page || null;
  }
  
  /**
   * Update an existing page
   */
  async updatePage(id, { title, content, description, tags, isPublished }) {
    // First get the existing page to get its editor and locale
    const existingPage = await this.getPageById(id);
    if (!existingPage) {
      throw new Error(`Page not found with ID: ${id}`);
    }
    
    const query = `
      mutation UpdatePage(
        $id: Int!, 
        $content: String, 
        $description: String!, 
        $editor: String!, 
        $isPublished: Boolean!, 
        $isPrivate: Boolean!, 
        $locale: String!, 
        $tags: [String]!, 
        $title: String!
      ) {
        pages {
          update(
            id: $id,
            content: $content,
            description: $description,
            editor: $editor,
            isPublished: $isPublished,
            isPrivate: $isPrivate,
            locale: $locale,
            tags: $tags,
            title: $title
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            page {
              id
              path
              title
            }
          }
        }
      }
    `;
    
    const variables = {
      id: parseInt(id),
      content: content !== undefined ? content : existingPage.content,
      description: description !== undefined ? description : (existingPage.description || 'No description provided'),
      editor: existingPage.editor || 'markdown',
      isPublished: isPublished !== undefined ? isPublished : existingPage.isPublished,
      isPrivate: existingPage.isPrivate || false,
      locale: existingPage.locale || 'en',
      tags: tags !== undefined ? tags : [],
      title: title !== undefined ? title : existingPage.title
    };
    
    const data = await this.executeQuery(query, variables);
    
    if (!data?.pages?.update?.responseResult?.succeeded) {
      throw new Error(data?.pages?.update?.responseResult?.message || 'Failed to update page');
    }
    
    return data?.pages?.update?.page || null;
  }
  
  /**
   * Delete a page
   */
  async deletePage(id) {
    const query = `
      mutation DeletePage($id: Int!) {
        pages {
          delete(id: $id) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { id: parseInt(id) });
    
    if (!data?.pages?.delete?.responseResult?.succeeded) {
      throw new Error(data?.pages?.delete?.responseResult?.message || 'Failed to delete page');
    }
    
    return true;
  }
  
  /**
   * Get asset by path
   */
  async getAssetByPath(path) {
    const query = `
      query GetAssetByPath($path: String!) {
        assets {
          singleByPath(path: $path) {
            id
            filename
            ext
            kind
            mime
            fileSize
            metadata
            createdAt
            updatedAt
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { path });
    return data?.assets?.singleByPath || null;
  }
  
  /**
   * Get navigation tree
   */
  async getNavigationTree(locale = 'en') {
    const query = `
      query GetNavigationTree($locale: String!) {
        navigation {
          tree(locale: $locale) {
            items {
              id
              kind
              label
              icon
              targetType
              target
              visibleExpr
              visibleOn
              parent
            }
          }
        }
      }
    `;
    
    const data = await this.executeQuery(query, { locale });
    return data?.navigation?.tree?.items || [];
  }
}

// Create singleton instance
const wikiApiService = new WikiApiService();

module.exports = { wikiApiService };