"use client";

/**
 * MDX Content Renderer Component
 * 
 * A client component that renders MDX content with frontmatter metadata,
 * handling various error cases gracefully.
 * 
 * #tags: mdx, content, client-component
 */
import React from 'react';
import { MDXContent as MDXContentType } from '@/utils/mdx';
import '@/styles/markdown.css';

interface MDXContentProps {
  content: MDXContentType | null;
}

// Error UI for when content is missing
const ContentErrorMessage = () => (
  <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
    <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Content Error</h1>
    <p className="text-red-700 dark:text-red-300">
      The content could not be loaded properly. Please check the markdown file format.
    </p>
  </div>
);

// Main component with enhanced error handling
export const MDXContent = ({ content }: MDXContentProps) => {
  // First check if content exists at all
  if (!content) {
    console.error("MDXContent received null or undefined content");
    return <ContentErrorMessage />;
  }
  
  // Safely access frontmatter
  const frontmatter = content.frontmatter || {};
  const mdxContent = content.content || null;
  
  // Convert any date objects to strings to prevent rendering errors
  if (frontmatter.lastUpdated && typeof frontmatter.lastUpdated === 'object') {
    if (frontmatter.lastUpdated instanceof Date) {
      frontmatter.lastUpdated = frontmatter.lastUpdated.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } else {
      frontmatter.lastUpdated = String(frontmatter.lastUpdated);
    }
  }
  
  // Render tags safely if they exist
  const renderTags = () => {
    if (!frontmatter.tags || !Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {frontmatter.tags.map((tag: string) => (
          <span 
            key={tag}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            {tag}
          </span>
        ))}
      </div>
    );
  };
  
  // Check if we have actual MDX content, otherwise display error
  if (!mdxContent) {
    console.error("MDXContent received content without rendered MDX content");
    return <ContentErrorMessage />;
  }
  
  // Safely render the full content
  return (
    <article className="prose dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          {frontmatter.title || 'Untitled Content'}
        </h1>
        
        {frontmatter.description && (
          <p className="text-xl text-gray-500 dark:text-gray-400">
            {frontmatter.description}
          </p>
        )}
        
        {frontmatter.lastUpdated && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: {frontmatter.lastUpdated}
          </div>
        )}
        
        {renderTags()}
      </div>
      
      <div className="mdx-content markdown-content">
        {mdxContent}
      </div>
      
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="mb-2 sm:mb-0">
            {frontmatter.category && (
              <span>Category: {frontmatter.category}</span>
            )}
          </div>
          
          <div>
            {frontmatter.lastUpdated && (
              <span>Updated: {frontmatter.lastUpdated}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
