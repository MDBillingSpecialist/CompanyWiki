/**
 * Wiki Content Manager MCP Client
 * 
 * Client for interacting with the wiki content management MCP server.
 * Provides functions for analyzing content structure, finding broken links,
 * suggesting related content, and generating content.
 * 
 * #tags: mcp content-management ai
 */
import { use_mcp_tool } from './mcp-client';

/**
 * Analyze the content structure of the wiki and suggest improvements
 * @param directory The directory to analyze
 * @returns Analysis results
 */
export async function analyzeContentStructure(directory: string = 'content'): Promise<any> {
  try {
    const result = await use_mcp_tool({
      server_name: 'wiki-content-manager',
      tool_name: 'analyze_content_structure',
      arguments: {
        directory
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error analyzing content structure:', error);
    throw error;
  }
}

/**
 * Find broken internal links in the wiki
 * @param directory The directory to analyze
 * @returns List of broken links
 */
export async function findBrokenLinks(directory: string = 'content'): Promise<any> {
  try {
    const result = await use_mcp_tool({
      server_name: 'wiki-content-manager',
      tool_name: 'find_broken_links',
      arguments: {
        directory
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error finding broken links:', error);
    throw error;
  }
}

/**
 * Suggest related content for a given page
 * @param path Path to the content file
 * @param maxSuggestions Maximum number of suggestions to return
 * @returns List of related content suggestions
 */
export async function suggestRelatedContent(path: string, maxSuggestions: number = 5): Promise<any> {
  try {
    const result = await use_mcp_tool({
      server_name: 'wiki-content-manager',
      tool_name: 'suggest_related_content',
      arguments: {
        path,
        maxSuggestions
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error suggesting related content:', error);
    throw error;
  }
}

/**
 * Generate content for a new section based on existing content
 * @param title Title of the new section
 * @param context Context for the new section (e.g., parent section, related content)
 * @returns Generated content
 */
export async function generateSectionContent(title: string, context: string): Promise<any> {
  try {
    const result = await use_mcp_tool({
      server_name: 'wiki-content-manager',
      tool_name: 'generate_section_content',
      arguments: {
        title,
        context
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error generating section content:', error);
    throw error;
  }
}

/**
 * Generate a summary of wiki content
 * @param path Path to the content file or directory
 * @returns Generated summary
 */
export async function summarizeContent(path: string): Promise<any> {
  try {
    const result = await use_mcp_tool({
      server_name: 'wiki-content-manager',
      tool_name: 'summarize_content',
      arguments: {
        path
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error summarizing content:', error);
    throw error;
  }
}
