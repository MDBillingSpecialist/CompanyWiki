"use client";

/**
 * Create Wiki Page Component
 * 
 * A page for creating new wiki content with different templates:
 * - Basic template with title, description, and basic structure
 * - Markdown editor for direct content creation
 * - AI-generated documentation using firecrawl
 * 
 * #tags: wiki content-creation templates ai-generation
 */
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WikiLayout } from '@/components/layout/WikiLayout';
import { use_mcp_tool } from '@/lib/mcp/mcp-client';

// Template types
type TemplateType = 'basic' | 'markdown' | 'ai-generated';

// Basic template form data
interface BasicTemplateForm {
  title: string;
  description: string;
  tags: string;
  content: string;
}

// AI generation form data
interface AIGenerationForm {
  apiName: string;
  apiUrl: string;
  specificFeatures: string;
  isGenerating: boolean;
  generatedContent: string;
}

export default function CreateWikiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const section = searchParams.get('section') || '';
  const templateType = (searchParams.get('template') as TemplateType) || 'basic';
  
  // State for the selected template type
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(templateType);
  
  // State for the basic template form
  const [basicForm, setBasicForm] = useState<BasicTemplateForm>({
    title: '',
    description: '',
    tags: '',
    content: '## Introduction\n\nAdd your content here.\n\n## Details\n\nProvide more information here.'
  });
  
  // State for the markdown editor
  const [markdownContent, setMarkdownContent] = useState<string>('---\ntitle: \ndescription: \ntags: []\n---\n\n# Title\n\nAdd your content here.');
  
  // State for AI generation
  const [aiForm, setAIForm] = useState<AIGenerationForm>({
    apiName: '',
    apiUrl: '',
    specificFeatures: '',
    isGenerating: false,
    generatedContent: ''
  });

  // State for the file path/name
  const [fileName, setFileName] = useState<string>('');
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Update the file name when the title changes
  useEffect(() => {
    if (basicForm.title) {
      // Convert title to kebab-case for the file name
      const kebabCase = basicForm.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
      
      setFileName(kebabCase);
    } else if (aiForm.apiName) {
      // Convert API name to kebab-case for the file name
      const kebabCase = aiForm.apiName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
        
      setFileName(`${kebabCase}-api-documentation`);
    }
  }, [basicForm.title, aiForm.apiName]);

  // Handle basic template form changes
  const handleBasicFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle AI form changes
  const handleAIFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAIForm(prev => ({ ...prev, [name]: value }));
  };

  // Generate documentation using firecrawl
  const generateDocumentation = async () => {
    if (!aiForm.apiName || !aiForm.apiUrl) {
      setSubmitError('API name and URL are required');
      return;
    }

    setAIForm(prev => ({ ...prev, isGenerating: true }));
    setSubmitError(null);

    try {
      // Use firecrawl to scrape the API documentation
      const scrapedContent = await use_mcp_tool({
        server_name: 'github.com/mendableai/firecrawl-mcp-server',
        tool_name: 'firecrawl_scrape',
        arguments: {
          url: aiForm.apiUrl,
          formats: ['markdown'],
          onlyMainContent: true
        }
      });

      // Generate structured API documentation using the scraped content
      const prompt = `
        Create comprehensive API documentation for ${aiForm.apiName} API.
        
        Focus on these aspects:
        1. Overview of the API
        2. Authentication methods
        3. Available endpoints
        4. Request/response formats
        5. Parameters
        6. Error handling
        ${aiForm.specificFeatures ? `7. Specific features: ${aiForm.specificFeatures}` : ''}
        
        Format the documentation in markdown with proper headings, code blocks for examples, and tables where appropriate.
      `;

      const extractedDocs = await use_mcp_tool({
        server_name: 'github.com/mendableai/firecrawl-mcp-server',
        tool_name: 'firecrawl_extract',
        arguments: {
          urls: [aiForm.apiUrl],
          prompt: prompt
        }
      });

      // Create frontmatter and format the content
      const frontmatter = `---
title: ${aiForm.apiName} API Documentation
description: Comprehensive documentation for ${aiForm.apiName} API
lastUpdated: ${new Date().toISOString().split('T')[0]}
tags: ['api', 'documentation', '${aiForm.apiName.toLowerCase()}']
---

`;

      // Set the generated content
      setAIForm(prev => ({
        ...prev,
        isGenerating: false,
        generatedContent: frontmatter + extractedDocs
      }));
    } catch (error) {
      console.error('Error generating documentation:', error);
      setSubmitError('Failed to generate documentation. Please try again.');
      setAIForm(prev => ({ ...prev, isGenerating: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName) {
      setSubmitError('File name is required');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Determine the content based on the selected template
      let content = '';
      let filePath = '';
      
      if (selectedTemplate === 'basic') {
        // Format the basic template content with frontmatter
        content = `---
title: ${basicForm.title}
description: ${basicForm.description}
lastUpdated: ${new Date().toISOString().split('T')[0]}
tags: [${basicForm.tags.split(',').map(tag => `'${tag.trim()}'`).join(', ')}]
---

# ${basicForm.title}

${basicForm.content}
`;
        
        // Set the file path
        filePath = `${section.replace('/wiki/', '')}/${fileName}.md`;
      } else if (selectedTemplate === 'markdown') {
        // Use the markdown content directly
        content = markdownContent;
        
        // Set the file path
        filePath = `${section.replace('/wiki/', '')}/${fileName}.md`;
      } else if (selectedTemplate === 'ai-generated') {
        // Use the generated content
        content = aiForm.generatedContent;
        
        // Set the file path
        filePath = `${section.replace('/wiki/', '')}/${fileName}.md`;
      }
      
      // Create a file object from the content
      const file = new File([content], `${fileName}.md`, { type: 'text/markdown' });
      
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', filePath);
      formData.append('overwrite', 'false');
      
      // Upload the file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create page');
      }
      
      // Set success state
      setSubmitSuccess(true);
      
      // Redirect to the new page
      setTimeout(() => {
        router.push(`/wiki/${filePath.replace('.md', '')}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating page:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create page');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate template form
  const renderTemplateForm = () => {
    switch (selectedTemplate) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={basicForm.title}
                onChange={handleBasicFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={basicForm.description}
                onChange={handleBasicFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={basicForm.tags}
                onChange={handleBasicFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="tag1, tag2, tag3"
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                name="content"
                value={basicForm.content}
                onChange={handleBasicFormChange}
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
              />
            </div>
          </div>
        );
      
      case 'markdown':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="markdownContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Markdown Content (including frontmatter)
              </label>
              <textarea
                id="markdownContent"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                rows={20}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white font-mono"
              />
            </div>
            
            <div>
              <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                File Name (without extension)
              </label>
              <input
                type="text"
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
        );
      
      case 'ai-generated':
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="apiName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                API Name
              </label>
              <input
                type="text"
                id="apiName"
                name="apiName"
                value={aiForm.apiName}
                onChange={handleAIFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="e.g., Llama Index"
                required
              />
            </div>
            
            <div>
              <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                API Documentation URL
              </label>
              <input
                type="url"
                id="apiUrl"
                name="apiUrl"
                value={aiForm.apiUrl}
                onChange={handleAIFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="https://docs.llamaindex.ai/"
                required
              />
            </div>
            
            <div>
              <label htmlFor="specificFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specific Features to Focus On (optional)
              </label>
              <textarea
                id="specificFeatures"
                name="specificFeatures"
                value={aiForm.specificFeatures}
                onChange={handleAIFormChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="e.g., Query Engine, Vector Stores, Retrievers"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={generateDocumentation}
                disabled={aiForm.isGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {aiForm.isGenerating ? 'Generating...' : 'Generate Documentation'}
              </button>
            </div>
            
            {aiForm.isGenerating && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                <p className="text-blue-700 dark:text-blue-300">
                  Generating documentation... This may take a minute.
                </p>
              </div>
            )}
            
            {aiForm.generatedContent && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Generated Documentation
                </h3>
                
                <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                  <textarea
                    value={aiForm.generatedContent}
                    onChange={(e) => setAIForm(prev => ({ ...prev, generatedContent: e.target.value }))}
                    rows={15}
                    className="w-full bg-transparent border-0 focus:ring-0 font-mono text-sm"
                    aria-label="Generated API documentation content"
                    placeholder="Generated documentation will appear here"
                  />
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <WikiLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Wiki Page
        </h1>
        
        <div className="mb-8">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
            <p className="text-blue-700 dark:text-blue-300">
              Creating page in: <strong>{section.replace('/wiki/', '')}</strong>
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Template
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedTemplate('basic')}
              className={`px-4 py-2 rounded-md ${
                selectedTemplate === 'basic'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Basic Template
            </button>
            
            <button
              onClick={() => setSelectedTemplate('markdown')}
              className={`px-4 py-2 rounded-md ${
                selectedTemplate === 'markdown'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Markdown Editor
            </button>
            
            <button
              onClick={() => setSelectedTemplate('ai-generated')}
              className={`px-4 py-2 rounded-md ${
                selectedTemplate === 'ai-generated'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              AI-Generated Documentation
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderTemplateForm()}
          
          {submitError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-md">
              <p className="text-red-700 dark:text-red-300">
                {submitError}
              </p>
            </div>
          )}
          
          {submitSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
              <p className="text-green-700 dark:text-green-300">
                Page created successfully! Redirecting...
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || (selectedTemplate === 'ai-generated' && !aiForm.generatedContent)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>
    </WikiLayout>
  );
}
