/**
 * Content Type Definitions
 * 
 * Type definitions for content-related data structures.
 * 
 * #tags: types, content
 */

// Frontmatter for markdown/MDX files
export interface Frontmatter {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  [key: string]: any;
}

// Content file metadata
export interface ContentMeta {
  slug: string;
  path: string;
  frontmatter: Frontmatter;
}

// Full content file with both metadata and content
export interface ContentFile extends ContentMeta {
  content: string;
  contentHtml?: string;
  lastModified?: string;
}

// Content section for organizing content into categories
export interface ContentSection {
  name: string;
  title: string;
  description?: string;
  items: ContentMeta[];
}

// Table of contents item generated from content headings
export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

// Navigation item for sidebar and breadcrumbs
export interface NavItem {
  title: string;
  path: string;
  slug?: string;
  children?: NavItem[];
  isActive?: boolean;
  isExpanded?: boolean;
  icon?: string;
}
