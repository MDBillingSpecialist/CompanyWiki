# Manual Content Migration to Wiki.js

Since direct API migration is encountering issues, follow this guide to manually migrate your content to Wiki.js.

## Prerequisites

1. Wiki.js instance running at http://localhost:3200
2. Admin access to Wiki.js
3. Your source content files in Markdown format

## Step 1: Create Content Pages Manually

### Creating Pages via Wiki.js UI

1. Log in to Wiki.js admin interface at http://localhost:3200
2. Click the "+" button in the top navigation bar
3. Select "New Page"
4. Fill in the following fields:
   - **Title**: Use the title from your source file's frontmatter
   - **Path**: Match the path from your source structure (e.g., "hipaa/technical")
   - **Editor**: Select "Markdown"
   - **Content**: Copy and paste the content from your source Markdown file

### Sample Pages to Create

#### 1. HIPAA Overview

- **Title**: HIPAA Overview
- **Path**: hipaa-overview
- **Tags**: hipaa, compliance, healthcare, security, privacy
- **Content**: Copy from [sample-content/hipaa-overview.md]

#### 2. HIPAA Technical Safeguards

- **Title**: HIPAA Technical Safeguards
- **Path**: hipaa-technical
- **Tags**: hipaa, security, technical, compliance
- **Content**: Copy from [sample-content/hipaa-technical.md]

#### 3. LLM Implementation in Healthcare

- **Title**: LLM Implementation in Healthcare
- **Path**: llm-compliance
- **Tags**: llm, ai, hipaa, security, compliance
- **Content**: Copy from [sample-content/llm-compliance.md]

## Step 2: Set Up HIPAA Dashboard

Once content is imported, you can set up the HIPAA dashboard:

1. Open http://localhost:3100 (API Integration Layer)
2. Navigate to HIPAA extensions at http://localhost:3300
3. The dashboard will display compliance status, checklists, and upcoming reviews

## Step 3: Test LLM Pipeline

To test the LLM content generation pipeline:

1. Navigate to http://localhost:3400 (LLM Pipeline)
2. Submit a content generation request with:
   - **Content**: Brief description of what you want to create
   - **Title**: Suggested title for the content
   - **Target Section**: Where the content should be placed (e.g., "hipaa/guidelines")

## Alternative Bulk Import

If you have many files to import, Wiki.js offers a built-in bulk import feature:

1. Go to Administration → Storage → Import
2. Select your source format (Markdown)
3. Upload a ZIP file containing your content
4. Follow the import wizard

## Troubleshooting

- **API Issues**: Ensure your API key has proper permissions
- **GraphQL Errors**: Check Wiki.js logs for detailed error messages
- **Content Format**: Ensure Markdown is properly formatted

## Next Steps

After migration, you should:

1. Verify all content has been imported correctly
2. Set up proper navigation structure
3. Configure user permissions
4. Test all features of the hybrid architecture