"use client";

/**
 * Content Structure Hook
 * 
 * A custom hook that fetches the content structure from the API.
 * This hook is used to dynamically build the sidebar navigation.
 * 
 * #tags: hooks content-structure navigation
 */
import { useState, useEffect } from 'react';

export interface ContentItem {
  title: string;
  path: string;
  children?: ContentItem[];
}

/**
 * Custom hook to fetch the content structure
 * @returns The content structure and loading state
 */
export function useContentStructure() {
  const [structure, setStructure] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContentStructure() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all content
        const response = await fetch('/api/content?list=true&limit=1000');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.data.items) {
          throw new Error('Invalid response format');
        }
        
        // Build the content structure
        const items = data.data.items;
        const structure = buildContentStructure(items);
        
        setStructure(structure);
      } catch (error) {
        console.error('Error fetching content structure:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        
        // Fallback to hardcoded structure
        setStructure(getHardcodedStructure());
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchContentStructure();
  }, []);
  
  return { structure, isLoading, error };
}

/**
 * Build the content structure from the API response
 * @param items - The content items from the API
 * @returns The content structure
 */
function buildContentStructure(items: any[]): ContentItem[] {
  // Group items by section
  const sections: Record<string, any[]> = {};
  
  items.forEach(item => {
    const path = item.path;
    const parts = path.split('/');
    
    // Skip files that don't have a section
    if (parts.length < 2) return;
    
    const section = parts[0];
    
    if (!sections[section]) {
      sections[section] = [];
    }
    
    sections[section].push(item);
  });
  
  // Build the structure
  const structure: ContentItem[] = [
    {
      title: 'Home',
      path: '/'
    }
  ];
  
  // Add sections
  Object.entries(sections).forEach(([section, items]) => {
    // Skip hidden sections
    if (section.startsWith('_')) return;
    
    const sectionItem: ContentItem = {
      title: formatSectionTitle(section),
      path: `/wiki/${section}`,
      children: []
    };

    // Add special routes for HIPAA section
    if (section === 'hipaa') {
      // Add Dashboard and Checklists which are implemented as special routes
      sectionItem.children?.push(
        {
          title: 'Dashboard',
          path: '/wiki/hipaa/dashboard'
        },
        {
          title: 'Checklists',
          path: '/wiki/hipaa/checklists'
        }
      );
      
      // Add Documentation section with all its children
      const documentationItem: ContentItem = {
        title: 'Documentation',
        path: '/wiki/hipaa/documentation',
        children: [
          {
            title: 'Access Control',
            path: '/wiki/hipaa/documentation/access-control'
          },
          {
            title: 'CCM Requirements',
            path: '/wiki/hipaa/documentation/ccm-specific-requirements'
          },
          {
            title: 'Incident Response',
            path: '/wiki/hipaa/documentation/incident-response'
          }
        ]
      };
      
      sectionItem.children?.push(documentationItem);
    }
    
    // Add items to the section
    items.forEach(item => {
      const path = item.path;
      const parts = path.split('/');
      
      // Skip index files and specific files
      if (parts[parts.length - 1] === 'index.md') return;
      
      // Skip specific files
      if (section === 'hipaa') {
        // Skip HIPAA Comprehensive Guide (it's redundant with the main HIPAA Documentation page)
        if (parts[parts.length - 1] === 'comprehensive-guide.md') return;
        
        // Skip any other files that should be hidden
        const filenamesToSkip = ['llm-compliance.md'];
        if (filenamesToSkip.includes(parts[parts.length - 1])) return;
        
        // Debug log for HIPAA documentation files
        if (parts.length > 1 && parts[1] === 'documentation') {
          console.log('HIPAA Documentation file:', path, parts);
        }
      }
      
      // Handle nested paths
      if (parts.length > 2) {
        // This is a nested item
        let currentLevel = sectionItem.children;
        let currentPath = `/wiki/${section}`;
        
        // Build the path for each level
        for (let i = 1; i < parts.length - 1; i++) {
          const part = parts[i];
          currentPath += `/${part}`;
          
          // Find or create the parent item
          let parentItem = currentLevel?.find(item => item.path === currentPath);
          
          if (!parentItem) {
            parentItem = {
              title: formatTitle(part),
              path: currentPath,
              children: []
            };
            
            currentLevel?.push(parentItem);
          }
          
          currentLevel = parentItem.children;
        }
        
        // Add the item to the current level
        const fileName = parts[parts.length - 1];
        const itemTitle = item.frontmatter?.title || formatTitle(fileName.replace(/\.md$/, ''));
        
        currentLevel?.push({
          title: itemTitle,
          path: `/wiki/${path.replace(/\.md$/, '')}`
        });
      } else {
        // This is a top-level item
        const fileName = parts[parts.length - 1];
        const itemTitle = item.frontmatter?.title || formatTitle(fileName.replace(/\.md$/, ''));
        
        sectionItem.children?.push({
          title: itemTitle,
          path: `/wiki/${path.replace(/\.md$/, '')}`
        });
      }
    });
    
    // Sort children
    if (sectionItem.children) {
      sectionItem.children = sortItems(sectionItem.children);
    }
    
    structure.push(sectionItem);
  });
  
  return structure;
}

/**
 * Format a section title
 * @param section - The section name
 * @returns The formatted section title
 */
function formatSectionTitle(section: string): string {
  // Handle special cases
  if (section === 'api-docs') return 'API Documentation';
  if (section === 'sop') return 'SOPs';
  
  // Default formatting
  return section
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format a title from a file name
 * @param fileName - The file name
 * @returns The formatted title
 */
function formatTitle(fileName: string): string {
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Sort items by title
 * @param items - The items to sort
 * @returns The sorted items
 */
function sortItems(items: ContentItem[]): ContentItem[] {
  return [...items].sort((a, b) => {
    // Sort index items first
    if (a.title === 'Overview' || a.path.endsWith('/index')) return -1;
    if (b.title === 'Overview' || b.path.endsWith('/index')) return 1;
    
    // Sort by title
    return a.title.localeCompare(b.title);
  });
}

/**
 * Get the hardcoded structure as a fallback
 * @returns The hardcoded structure
 */
function getHardcodedStructure(): ContentItem[] {
  return [
    {
      title: 'Home',
      path: '/'
    },
    {
      title: 'Company Wiki',
      path: '/wiki/company-wiki',
      children: [
        {
          title: 'About',
          path: '/wiki/company-wiki/about'
        },
        {
          title: 'Teams',
          path: '/wiki/company-wiki/teams'
        }
      ]
    },
    {
      title: 'HIPAA',
      path: '/wiki/hipaa',
      children: [
        {
          title: 'Dashboard',
          path: '/wiki/hipaa/dashboard'
        },
        {
          title: 'Checklists',
          path: '/wiki/hipaa/checklists'
        },
        {
          title: 'Documentation',
          path: '/wiki/hipaa/documentation',
          children: [
            {
              title: 'Access Control',
              path: '/wiki/hipaa/documentation/access-control'
            },
            {
              title: 'CCM Requirements',
              path: '/wiki/hipaa/documentation/ccm-specific-requirements'
            },
            {
              title: 'Incident Response',
              path: '/wiki/hipaa/documentation/incident-response'
            }
          ]
        }
      ]
    },
    {
      title: 'SOPs',
      path: '/wiki/sop',
      children: [
        {
          title: 'Engineering',
          path: '/wiki/sop/engineering',
          children: [
            {
              title: 'Deployment',
              path: '/wiki/sop/engineering/deployment'
            },
            {
              title: 'Code Review',
              path: '/wiki/sop/engineering/code-review'
            },
            {
              title: 'Database Management',
              path: '/wiki/sop/engineering/database-management'
            },
            {
              title: 'Incident Management',
              path: '/wiki/sop/engineering/incident-management'
            },
            {
              title: 'Testing Protocols',
              path: '/wiki/sop/engineering/testing-protocols'
            }
          ]
        },
        {
          title: 'Compliance',
          path: '/wiki/sop/compliance',
          children: [
            {
              title: 'Incident Response',
              path: '/wiki/sop/compliance/incident-response'
            },
            {
              title: 'Audit Procedures',
              path: '/wiki/sop/compliance/audit-procedures'
            },
            {
              title: 'Risk Assessment',
              path: '/wiki/sop/compliance/risk-assessment'
            },
            {
              title: 'Security Monitoring',
              path: '/wiki/sop/compliance/security-monitoring'
            },
            {
              title: 'Training Requirements',
              path: '/wiki/sop/compliance/training-requirements'
            }
          ]
        },
        {
          title: 'Operations',
          path: '/wiki/sop/operations',
          children: [
            {
              title: 'Business Continuity',
              path: '/wiki/sop/operations/business-continuity'
            },
            {
              title: 'Customer Onboarding',
              path: '/wiki/sop/operations/customer-onboarding'
            },
            {
              title: 'Support Escalation',
              path: '/wiki/sop/operations/support-escalation'
            },
            {
              title: 'Vendor Management',
              path: '/wiki/sop/operations/vendor-management'
            }
          ]
        }
      ]
    },
    {
      title: 'API Documentation',
      path: '/wiki/api-docs',
      children: [
        {
          title: 'Overview',
          path: '/wiki/api-docs'
        },
        {
          title: 'Content API',
          path: '/wiki/api-docs/content'
        },
        {
          title: 'Search API',
          path: '/wiki/api-docs/search'
        },
        {
          title: 'User API',
          path: '/wiki/api-docs/user'
        },
        {
          title: 'Analytics API',
          path: '/wiki/api-docs/analytics'
        },
        {
          title: 'OpenAI API',
          path: '/wiki/api-docs/openai-api-documentation'
        },
        {
          title: 'LlamaIndex API',
          path: '/wiki/api-docs/llamaindex-api-documentation'
        }
      ]
    },
    {
      title: 'MCP Tools',
      path: '/wiki/mcp-tools',
      children: [
        {
          title: 'Overview',
          path: '/wiki/mcp-tools'
        },
        {
          title: 'Dashboard',
          path: '/wiki/mcp-tools/dashboard'
        },
        {
          title: 'Development Guide',
          path: '/wiki/mcp-tools/development-guide'
        },
        {
          title: 'Configuration',
          path: '/wiki/mcp-tools/configuration'
        }
      ]
    }
  ];
}
