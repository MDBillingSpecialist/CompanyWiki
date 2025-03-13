/**
 * Dynamic Wiki Page Component
 * 
 * This component handles all dynamic routes in the wiki section.
 * It properly processes the slug parameter from the URL and attempts to load
 * the corresponding content file from the content directory.
 * 
 * #tags: dynamic-routing, mdx-content, wiki
 */
import { WikiLayout } from '@/components/layout/WikiLayout';
import { MDXContent as MDXContentComponent } from '@/components/content/MDXContent';
import { getContentBySlug, getAllContentFilePaths } from '@/utils/mdx';
import { Metadata } from 'next';
import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// Helper function to safely convert any value to a string
function safeToString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }
    return JSON.stringify(value);
  }
  
  return String(value);
}

// Process frontmatter data before using it in React components
function processFrontmatter(data: any): any {
  if (!data) return {};
  
  // Make a copy to avoid modifying the original
  const processed = { ...data };
  
  // Convert date fields to strings
  if (processed.lastUpdated) {
    processed.lastUpdated = safeToString(processed.lastUpdated);
  }
  
  return processed;
}

// Simple markdown to HTML conversion function
function markdownToHtml(markdown: string): string {
  // This is a very simple converter that handles basic markdown
  let html = markdown
    // Convert headers
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    
    // Convert bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    
    // Convert lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.+<\/li>\n)+/g, '<ul>$&</ul>')
    
    // Convert paragraphs (any line that's not a heading or list)
    .replace(/^([^<#].+)$/gm, '<p>$1</p>')
    
    // Convert links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>')
    
    // Convert code blocks
    .replace(/```(.+?)```/gs, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto">$1</pre>');
  
  return html;
}

// Error component for displaying error messages
function ErrorMessage({ title, message }: { title: string, message: string }) {
  return (
    <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-lg">
      <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">{title}</h1>
      <p className="text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}

// Wiki navigation menu component
function WikiNavigationMenu() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Wiki Navigation</h1>
      <p className="mb-4">Please select a wiki section from the navigation menu.</p>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Main Sections:</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li><a href="/wiki/hipaa" className="text-blue-600 hover:underline">HIPAA Documentation</a></li>
          <li><a href="/wiki/hipaa/documentation" className="text-blue-600 hover:underline">HIPAA Documentation</a></li>
          <li><a href="/wiki/hipaa/checklists" className="text-blue-600 hover:underline">HIPAA Checklists</a></li>
          <li><a href="/wiki/hipaa/dashboard" className="text-blue-600 hover:underline">HIPAA Dashboard</a></li>
          <li><a href="/wiki/sop" className="text-blue-600 hover:underline">Standard Operating Procedures</a></li>
          <li><a href="/wiki/company-wiki" className="text-blue-600 hover:underline">Company Wiki</a></li>
        </ul>
      </div>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  // Join the slug array to form a path
  const slugPath = params.slug.join('/');
  
  try {
    // Try to get content for this slug
    const content = await getContentBySlug(slugPath);
    
    if (content && content.frontmatter) {
      return {
        title: content.frontmatter.title || 'Wiki Page',
        description: content.frontmatter.description || 'Company Wiki Documentation',
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Default metadata if content not found
  return {
    title: 'Wiki Page',
    description: 'Company Wiki Documentation',
  };
}

// The content viewer component
export default async function WikiPage({ params }: { params: { slug: string[] } }) {
  // Join the slug array to form a path
  const slugPath = params.slug.join('/');
  console.log(`Loading content for slug path: ${slugPath}`);
  
  try {
    // Special routes - we'll handle them differently
    // Remove the HIPAA redirect since it's causing an infinite loop
    // The HIPAA page has its own dedicated route
    
    if (slugPath === 'hipaa/dashboard' || slugPath === 'hipaa/checklists') {
      // Let the dedicated pages handle these special routes
      return new Response(null, {
        status: 307,
        headers: { 'Location': `/wiki/${slugPath}` }
      });
    }
    
    // ===== DIRECT FILE HANDLING FOR HIPAA DOCUMENTATION =====
    if (slugPath.startsWith('hipaa/documentation')) {
      const contentDirectory = path.join(process.cwd(), 'content');
      
      // If it's just the documentation folder, check for index.md
      let mdPath;
      if (slugPath === 'hipaa/documentation') {
        mdPath = path.join(contentDirectory, 'hipaa/documentation/index.md');
      } else {
        mdPath = path.join(contentDirectory, `${slugPath}.md`);
      }
      
      console.log(`DOCS PATH CHECK: ${mdPath}`);
      
      // Check if file exists
      if (fs.existsSync(mdPath)) {
        // Read file directly
        const fileContent = fs.readFileSync(mdPath, 'utf8');
        const { data: rawData, content: markdownContent } = matter(fileContent);
        
        // Process the frontmatter data to handle dates and other potential issues
        const data = processFrontmatter(rawData);
        
        return (
          <WikiLayout>
            <article className="prose dark:prose-invert max-w-none">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                  {data.title || 'Documentation'}
                </h1>
                
                {data.description && (
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    {data.description}
                  </p>
                )}
                
                {data.lastUpdated && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Last updated: {data.lastUpdated}
                  </div>
                )}
                
                {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="markdown-content">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) }} />
              </div>
            </article>
          </WikiLayout>
        );
      }
    }
    
    // Also handle the comprehensive guide directly
    if (slugPath === 'hipaa/comprehensive-guide') {
      const mdPath = path.join(process.cwd(), 'content/hipaa/comprehensive-guide.md');
      
      if (fs.existsSync(mdPath)) {
        // Read file directly
        const fileContent = fs.readFileSync(mdPath, 'utf8');
        const { data: rawData, content: markdownContent } = matter(fileContent);
        
        // Process the frontmatter data to handle dates and other potential issues
        const data = processFrontmatter(rawData);
        
        return (
          <WikiLayout>
            <article className="prose dark:prose-invert max-w-none">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                  {data.title || 'HIPAA Comprehensive Guide'}
                </h1>
                
                {data.description && (
                  <p className="text-xl text-gray-500 dark:text-gray-400">
                    {data.description}
                  </p>
                )}
                
                {data.lastUpdated && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Last updated: {data.lastUpdated}
                  </div>
                )}
                
                {data.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="markdown-content">
                <div dangerouslySetInnerHTML={{ __html: markdownToHtml(markdownContent) }} />
              </div>
            </article>
          </WikiLayout>
        );
      }
    }
    
    // For all other paths, try to get content with the MDX processor
    const content = await getContentBySlug(slugPath);
    
    // If content was found, render it
    if (content) {
      try {
        // Process frontmatter data to handle dates
        if (content.frontmatter) {
          content.frontmatter = processFrontmatter(content.frontmatter);
        }
        
        return (
          <WikiLayout>
            <MDXContentComponent content={content} />
          </WikiLayout>
        );
      } catch (renderError) {
        console.error(`Error rendering content for ${slugPath}:`, renderError);
        // Fallback to a simpler approach
        return (
          <WikiLayout>
            <div className="prose dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold">{content.frontmatter.title || 'Content'}</h1>
              {content.frontmatter.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300">{content.frontmatter.description}</p>
              )}
              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-300">
                  This content couldn't be rendered properly. Please try viewing it directly from the markdown file.
                </p>
              </div>
              <pre className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
                {content.rawContent}
              </pre>
            </div>
          </WikiLayout>
        );
      }
    }
    
    // If no content was found, check if it's a directory with an index.md
    const indexContent = await getContentBySlug(`${slugPath}/index`);
    if (indexContent) {
      try {
        // Process frontmatter data to handle dates
        if (indexContent.frontmatter) {
          indexContent.frontmatter = processFrontmatter(indexContent.frontmatter);
        }
        
        return (
          <WikiLayout>
            <MDXContentComponent content={indexContent} />
          </WikiLayout>
        );
      } catch (renderError) {
        console.error(`Error rendering index content for ${slugPath}:`, renderError);
        // Fallback to a simpler approach
        return (
          <WikiLayout>
            <div className="prose dark:prose-invert max-w-none">
              <h1 className="text-3xl font-bold">{indexContent.frontmatter.title || 'Content'}</h1>
              {indexContent.frontmatter.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300">{indexContent.frontmatter.description}</p>
              )}
              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-300">
                  This content couldn't be rendered properly. Please try viewing it directly from the markdown file.
                </p>
              </div>
              <pre className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
                {indexContent.rawContent}
              </pre>
            </div>
          </WikiLayout>
        );
      }
    }
    
    // If still no content found, display more helpful navigation for HIPAA content
    console.warn(`No content found for slug: ${slugPath}`);
    
    if (slugPath.startsWith('hipaa/')) {
      return (
        <WikiLayout>
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">HIPAA Documentation</h1>
            
            <div className="p-4 mb-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                The page you requested couldn't be found. Here are some helpful links to our HIPAA documentation:
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Available Documentation</h2>
            
            <ul className="space-y-2 mb-8">
              <li>
                <a href="/wiki/hipaa" className="text-blue-600 hover:underline font-medium">
                  HIPAA Hub
                </a> - Main landing page for HIPAA documentation
              </li>
              <li>
                <a href="/wiki/hipaa/comprehensive-guide" className="text-blue-600 hover:underline font-medium">
                  Comprehensive Guide
                </a> - Complete overview of HIPAA compliance
              </li>
              <li>
                <a href="/wiki/hipaa/documentation" className="text-blue-600 hover:underline font-medium">
                  Documentation Index
                </a> - List of all documentation pages
              </li>
              <li>
                <a href="/wiki/hipaa/documentation/technical-security" className="text-blue-600 hover:underline font-medium">
                  Technical Security Standards
                </a> - Security requirements for systems handling PHI
              </li>
              <li>
                <a href="/wiki/hipaa/documentation/access-control" className="text-blue-600 hover:underline font-medium">
                  Access Control
                </a> - Guidelines for identity verification and access management
              </li>
              <li>
                <a href="/wiki/hipaa/documentation/incident-response" className="text-blue-600 hover:underline font-medium">
                  Incident Response
                </a> - Procedures for responding to security incidents
              </li>
              <li>
                <a href="/wiki/hipaa/documentation/ccm-specific-requirements" className="text-blue-600 hover:underline font-medium">
                  CCM Requirements
                </a> - Special considerations for Chronic Care Management systems
              </li>
              <li>
                <a href="/wiki/hipaa/documentation/llm-compliance" className="text-blue-600 hover:underline font-medium">
                  LLM Compliance
                </a> - Guidelines for implementing Large Language Models
              </li>
            </ul>
          </div>
        </WikiLayout>
      );
    }
    
    // For non-HIPAA content, show the standard error
    return (
      <WikiLayout>
        <ErrorMessage 
          title="Content Not Found" 
          message={`We couldn't find the requested content for "${slugPath}". Please check the URL or navigate using the sidebar.`} 
        />
      </WikiLayout>
    );
  } catch (error) {
    console.error(`Error rendering wiki page for slug "${slugPath}":`, error);
    
    // Return detailed error message component
    return (
      <WikiLayout>
        <div className="prose dark:prose-invert max-w-none">
          <div className="p-6 bg-red-100 dark:bg-red-900/30 rounded-lg mb-8">
            <h1 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-4">Error Loading Content</h1>
            <p className="text-red-700 dark:text-red-300 mb-4">
              There was a problem loading the requested content: {slugPath}
            </p>
            <p className="text-red-700 dark:text-red-300">
              Try using the sidebar navigation to find the content you're looking for.
            </p>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Available HIPAA Documentation</h2>
          
          <ul className="space-y-2 mb-8">
            <li>
              <a href="/wiki/hipaa" className="text-blue-600 hover:underline font-medium">
                HIPAA Hub
              </a> - Main landing page for HIPAA documentation
            </li>
            <li>
              <a href="/wiki/hipaa/documentation" className="text-blue-600 hover:underline font-medium">
                Documentation Index
              </a> - List of all documentation pages
            </li>
            <li>
              <a href="/wiki/hipaa/documentation/technical-security" className="text-blue-600 hover:underline font-medium">
                Technical Security Standards
              </a> - Security requirements for systems handling PHI
            </li>
            <li>
              <a href="/wiki/hipaa/documentation/access-control" className="text-blue-600 hover:underline font-medium">
                Access Control
              </a> - Guidelines for identity verification and access management
            </li>
            <li>
              <a href="/wiki/hipaa/documentation/incident-response" className="text-blue-600 hover:underline font-medium">
                Incident Response
              </a> - Procedures for responding to security incidents
            </li>
          </ul>
        </div>
      </WikiLayout>
    );
  }
}