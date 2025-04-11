#!/usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { format } = require('date-fns');

// Import utility modules
const templates = require('./templates');
const generators = require('./generators/ids');
const contentIndex = require('./utils/contentIndex');
const relatedContent = require('./utils/relatedContent');
const bidirectionalLinks = require('./utils/bidirectionalLinks');
const pathUtils = require('./utils/path');

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content');

// Document type definitions
const DOCUMENT_TYPES = {
  sop: {
    name: 'Standard Operating Procedure (SOP)',
    value: 'sop',
    sections: ['engineering', 'compliance', 'operations']
  },
  hipaa: {
    name: 'HIPAA Documentation',
    value: 'hipaa',
    sections: ['core', 'documentation', 'tools']
  },
  general: {
    name: 'Company Wiki Page',
    value: 'general',
    sections: ['about', 'teams', 'policies', 'onboarding']
  },
  index: {
    name: 'Index Page',
    value: 'index'
  }
};

/**
 * Main function to run the content creation tool
 */
async function main() {
  console.log(chalk.blue.bold('\n📝 Enhanced Wiki Content Generator\n'));
  
  try {
    // Build content index for related content suggestions
    console.log(chalk.gray('Indexing existing content...'));
    await contentIndex.buildContentIndex();
    console.log(chalk.green('✓ Content indexed successfully\n'));
    
    // Select document type
    const { docType } = await inquirer.prompt([{
      type: 'list',
      name: 'docType',
      message: 'Select document type:',
      choices: Object.values(DOCUMENT_TYPES).map(type => ({
        name: type.name,
        value: type.value
      }))
    }]);
    
    // Get template-specific information
    let templateData = {};
    
    // Handle different document types
    if (docType === 'sop') {
      templateData = await collectSOPData();
    } else if (docType === 'hipaa') {
      templateData = await collectHIPAAData();
    } else if (docType === 'general') {
      templateData = await collectGeneralData();
    } else if (docType === 'index') {
      templateData = await collectIndexData();
    }
    
    // Add common metadata
    templateData.lastUpdated = format(new Date(), 'yyyy-MM-dd');
    
    // Find related content
    templateData.relatedContent = await suggestRelatedContent({
      title: templateData.title,
      description: templateData.description,
      tags: templateData.tags,
      category: docType,
      subcategory: templateData.department?.toLowerCase() || templateData.section,
      docType: docType
    });
    
    // Generate content using appropriate template
    const content = templates[docType](templateData);
    
    // Determine file path
    const filePath = determineFilePath(docType, templateData);
    
    // Ensure directory exists
    pathUtils.createDirectories(path.dirname(filePath));
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      const { overwrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: chalk.yellow('⚠️ File already exists. Overwrite?'),
        default: false
      }]);
      
      if (!overwrite) {
        console.log(chalk.red('\n❌ Operation cancelled'));
        return;
      }
    }
    
    // Write file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(chalk.green(`\n✅ Content created successfully at: ${filePath}`));
    
    // Calculate wiki URL path
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const urlPath = '/wiki/' + relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
    console.log(chalk.blue(`\n📂 URL path: ${urlPath}`));
    
    // Update bidirectional links in referenced documents
    if (templateData.relatedContent && templateData.relatedContent.length > 0) {
      console.log(chalk.gray('\nUpdating related documents with bidirectional links...'));
      await bidirectionalLinks.updateReferencedDocuments({
        title: templateData.title,
        path: urlPath,
        filePath
      }, templateData.relatedContent);
      console.log(chalk.green('✓ Related documents updated successfully'));
    }
    
    // Offer to create related documents
    await handleNextAction(docType, templateData);
    
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error);
  }
}

/**
 * Collect data for SOP documents
 */
async function collectSOPData() {
  // Get department
  const { department } = await inquirer.prompt([{
    type: 'list',
    name: 'department',
    message: 'Select department:',
    choices: DOCUMENT_TYPES.sop.sections.map(section => ({
      name: section.charAt(0).toUpperCase() + section.slice(1),
      value: section
    }))
  }]);
  
  // Get basic info
  const baseInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter document title:',
      validate: input => input.trim() !== '' ? true : 'Title is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter brief description:',
      validate: input => input.trim() !== '' ? true : 'Description is required'
    }
  ]);
  
  // Generate SOP ID
  const nextId = await generators.getNextSopId(department);
  
  const { sopId } = await inquirer.prompt([{
    type: 'input',
    name: 'sopId',
    message: `Next available ID is ${nextId}. Press enter to accept, or enter custom ID:`,
    default: nextId
  }]);
  
  // Get purpose & scope
  const purposeScope = await inquirer.prompt([
    {
      type: 'editor',
      name: 'purpose',
      message: 'Enter Purpose (describe what this procedure aims to accomplish):'
    },
    {
      type: 'editor',
      name: 'scope',
      message: 'Enter Scope (who/what this procedure applies to):'
    }
  ]);
  
  // Get responsibilities
  const roles = [];
  let addingRoles = true;
  
  console.log(chalk.blue('\nAdd responsibilities (roles and their responsibilities):'));
  
  while (addingRoles) {
    const { role } = await inquirer.prompt([{
      type: 'input',
      name: 'role',
      message: 'Enter responsibility role (or leave empty to finish adding):'
    }]);
    
    if (!role.trim()) {
      addingRoles = false;
      continue;
    }
    
    const { responsibility } = await inquirer.prompt([{
      type: 'input',
      name: 'responsibility',
      message: `Enter responsibility for ${role}:`
    }]);
    
    roles.push({
      role: role,
      responsibility: responsibility
    });
  }
  
  // Get procedure steps
  const { procedure } = await inquirer.prompt([{
    type: 'editor',
    name: 'procedure',
    message: 'Enter Procedure steps (use markdown formatting):'
  }]);
  
  // Get references
  const references = [];
  let addingReferences = true;
  
  console.log(chalk.blue('\nAdd references to related documents:'));
  
  while (addingReferences) {
    const { reference } = await inquirer.prompt([{
      type: 'input',
      name: 'reference',
      message: 'Enter reference (or leave empty to finish adding):'
    }]);
    
    if (!reference.trim()) {
      addingReferences = false;
      continue;
    }
    
    references.push(reference);
  }
  
  // Get definitions
  const definitions = [];
  let addingDefinitions = true;
  
  console.log(chalk.blue('\nAdd definitions for key terms:'));
  
  while (addingDefinitions) {
    const { term } = await inquirer.prompt([{
      type: 'input',
      name: 'term',
      message: 'Enter term (or leave empty to finish adding):'
    }]);
    
    if (!term.trim()) {
      addingDefinitions = false;
      continue;
    }
    
    const { definition } = await inquirer.prompt([{
      type: 'input',
      name: 'definition',
      message: `Enter definition for ${term}:`
    }]);
    
    definitions.push({
      term: term,
      definition: definition
    });
  }
  
  // Get common fields
  const commonFields = await inquirer.prompt([
    {
      type: 'input',
      name: 'tags',
      message: 'Enter tags (comma-separated):',
      filter: input => input.split(',').map(tag => tag.trim()).filter(Boolean)
    },
    {
      type: 'input',
      name: 'author',
      message: 'Enter document author:',
      default: 'Jane Doe'
    },
    {
      type: 'list',
      name: 'reviewCycle',
      message: 'Select review cycle:',
      choices: ['annual', 'biannual', 'quarterly'],
      default: 'annual'
    },
    {
      type: 'input',
      name: 'approvedBy',
      message: 'Enter approver name:',
      default: 'John Smith'
    }
  ]);
  
  return {
    department,
    ...baseInfo,
    sopId,
    ...purposeScope,
    responsibilities: roles,
    procedure,
    references,
    definitions,
    ...commonFields,
    version: '1.0'
  };
}

/**
 * Collect data for HIPAA documents
 */
async function collectHIPAAData() {
  // Get section
  const { section } = await inquirer.prompt([{
    type: 'list',
    name: 'section',
    message: 'Select HIPAA section:',
    choices: DOCUMENT_TYPES.hipaa.sections.map(section => ({
      name: section.charAt(0).toUpperCase() + section.slice(1),
      value: section
    }))
  }]);
  
  // Get basic info
  const baseInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter document title:',
      validate: input => input.trim() !== '' ? true : 'Title is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter brief description:',
      validate: input => input.trim() !== '' ? true : 'Description is required'
    }
  ]);
  
  // Get regulation reference
  const { regulationReference } = await inquirer.prompt([{
    type: 'input',
    name: 'regulationReference',
    message: 'Enter regulation reference (e.g., 45 CFR § 164.308):',
    default: ''
  }]);
  
  // Get applicability
  const { applicability } = await inquirer.prompt([{
    type: 'input',
    name: 'applicability',
    message: 'Enter roles/teams this applies to:',
    default: 'All staff handling PHI'
  }]);
  
  // Get content sections
  const contentSections = await inquirer.prompt([
    {
      type: 'editor',
      name: 'overview',
      message: 'Enter Overview section:'
    },
    {
      type: 'editor',
      name: 'requirements',
      message: 'Enter Regulatory Requirements section:'
    },
    {
      type: 'editor',
      name: 'implementation',
      message: 'Enter Implementation Guidelines section:'
    },
    {
      type: 'editor',
      name: 'monitoring',
      message: 'Enter Monitoring and Compliance section:'
    }
  ]);
  
  // Get common fields
  const commonFields = await inquirer.prompt([
    {
      type: 'input',
      name: 'tags',
      message: 'Enter tags (comma-separated):',
      filter: input => input.split(',').map(tag => tag.trim()).filter(Boolean)
    },
    {
      type: 'input',
      name: 'author',
      message: 'Enter document author:',
      default: 'Jane Doe'
    }
  ]);
  
  return {
    section,
    ...baseInfo,
    regulationReference,
    applicability,
    ...contentSections,
    ...commonFields,
    category: 'HIPAA'
  };
}

/**
 * Collect data for general wiki documents
 */
async function collectGeneralData() {
  // Get section
  const { section } = await inquirer.prompt([{
    type: 'list',
    name: 'section',
    message: 'Select wiki section:',
    choices: DOCUMENT_TYPES.general.sections.map(section => ({
      name: section.charAt(0).toUpperCase() + section.slice(1),
      value: section
    }))
  }]);
  
  // Get basic info
  const baseInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter document title:',
      validate: input => input.trim() !== '' ? true : 'Title is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter brief description:',
      validate: input => input.trim() !== '' ? true : 'Description is required'
    }
  ]);
  
  // Get content
  const { content } = await inquirer.prompt([{
    type: 'editor',
    name: 'content',
    message: 'Enter document content (use markdown formatting):'
  }]);
  
  // Get common fields
  const commonFields = await inquirer.prompt([
    {
      type: 'input',
      name: 'tags',
      message: 'Enter tags (comma-separated):',
      filter: input => input.split(',').map(tag => tag.trim()).filter(Boolean)
    },
    {
      type: 'input',
      name: 'author',
      message: 'Enter document author:',
      default: 'Jane Doe'
    }
  ]);
  
  return {
    section,
    ...baseInfo,
    content,
    ...commonFields
  };
}

/**
 * Collect data for index pages
 */
async function collectIndexData() {
  // Get section path
  const { sectionPath } = await inquirer.prompt([{
    type: 'input',
    name: 'sectionPath',
    message: 'Enter section path (e.g., sop/engineering):',
    validate: input => {
      const fullPath = path.join(CONTENT_DIR, input);
      return fs.existsSync(fullPath) ? true : 'Section path does not exist';
    }
  }]);
  
  // Get basic info
  const baseInfo = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter index title:',
      validate: input => input.trim() !== '' ? true : 'Title is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter brief description:',
      validate: input => input.trim() !== '' ? true : 'Description is required'
    }
  ]);
  
  // Get introduction
  const { introduction } = await inquirer.prompt([{
    type: 'editor',
    name: 'introduction',
    message: 'Enter introduction text:'
  }]);
  
  // Auto-generate document list from the directory
  const fullPath = path.join(CONTENT_DIR, sectionPath);
  const files = fs.readdirSync(fullPath)
    .filter(file => file.endsWith('.md') && file !== 'index.md');
  
  const documents = [];
  
  for (const file of files) {
    const filePath = path.join(fullPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = require('gray-matter')(content);
    
    documents.push({
      title: data.title || path.basename(file, '.md'),
      description: data.description || '',
      path: `/wiki/${sectionPath}/${path.basename(file, '.md')}`,
      lastUpdated: data.lastUpdated || ''
    });
  }
  
  // Get common fields
  const commonFields = await inquirer.prompt([
    {
      type: 'input',
      name: 'tags',
      message: 'Enter tags (comma-separated):',
      filter: input => input.split(',').map(tag => tag.trim()).filter(Boolean)
    },
    {
      type: 'input',
      name: 'category',
      message: 'Enter category:',
      default: sectionPath.split('/').pop().charAt(0).toUpperCase() + sectionPath.split('/').pop().slice(1)
    }
  ]);
  
  return {
    sectionPath,
    ...baseInfo,
    introduction,
    documents,
    ...commonFields
  };
}

/**
 * Suggest related content based on document data
 */
async function suggestRelatedContent(docData) {
  // Find related content
  const relatedSuggestions = relatedContent.findRelatedContent(docData, 10);
  
  if (relatedSuggestions.length === 0) {
    console.log(chalk.yellow("\nNo related content found."));
    return [];
  }
  
  console.log(chalk.blue("\nSuggested related content:"));
  relatedSuggestions.forEach((item, index) => {
    console.log(`${index + 1}. ${chalk.green(item.document.title)} (${chalk.gray(item.matchReason)})`);
  });
  
  // Let user select which suggestions to include
  const { selectedIndices } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selectedIndices',
    message: 'Select related content to include:',
    choices: relatedSuggestions.map((item, index) => ({
      name: `${item.document.title} (${item.matchReason})`,
      value: index
    }))
  }]);
  
  // Allow user to add custom related links
  const { addCustom } = await inquirer.prompt([{
    type: 'confirm',
    name: 'addCustom',
    message: 'Would you like to add custom related links?',
    default: false
  }]);
  
  let customLinks = [];
  if (addCustom) {
    let addingLinks = true;
    while (addingLinks) {
      const { title } = await inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: 'Enter link title (leave empty to finish):'
      }]);
      
      if (!title.trim()) {
        addingLinks = false;
        continue;
      }
      
      const { path, reason } = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          message: 'Enter document path (e.g., /wiki/hipaa/core):',
          validate: input => input.startsWith('/wiki/') ? true : 'Path must start with /wiki/'
        },
        {
          type: 'input',
          name: 'reason',
          message: 'Enter relationship description:',
          default: 'Related document'
        }
      ]);
      
      customLinks.push({
        document: { title, path },
        matchReason: reason
      });
    }
  }
  
  // Return selected related content
  return [
    ...selectedIndices.map(i => relatedSuggestions[i]),
    ...customLinks
  ];
}

/**
 * Determine file path based on document type and data
 */
function determineFilePath(docType, templateData) {
  let filePath;
  
  if (docType === 'sop') {
    const department = templateData.department.toLowerCase();
    const filename = templateData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    filePath = path.join(CONTENT_DIR, 'sop', department, `${filename}.md`);
  } else if (docType === 'hipaa') {
    const section = templateData.section.toLowerCase();
    const filename = templateData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    filePath = path.join(CONTENT_DIR, 'hipaa', section, `${filename}.md`);
  } else if (docType === 'general') {
    const section = templateData.section.toLowerCase();
    const filename = templateData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    filePath = path.join(CONTENT_DIR, 'company-wiki', section, `${filename}.md`);
  } else if (docType === 'index') {
    filePath = path.join(CONTENT_DIR, templateData.sectionPath, 'index.md');
  }
  
  return filePath;
}

/**
 * Handle next action after document creation
 */
async function handleNextAction(docType, templateData) {
  const { nextAction } = await inquirer.prompt([{
    type: 'list',
    name: 'nextAction',
    message: 'Would you like to:',
    choices: [
      { name: 'Create another document in the same category', value: 'same' },
      { name: 'Create a related document', value: 'related' },
      { name: 'Create an index for these documents', value: 'index' },
      { name: 'Exit', value: 'exit' }
    ]
  }]);
  
  if (nextAction === 'exit') {
    console.log(chalk.blue('\nThank you for using the Enhanced Wiki Content Generator!'));
    return;
  } else if (nextAction === 'same') {
    // Restart the process with the same document type
    console.log(chalk.blue('\nCreating another document in the same category...\n'));
    
    // We would ideally call main() here, but for simplicity in this implementation,
    // we'll just exit and tell the user to run the tool again
    console.log(chalk.yellow('Please run the tool again to create another document.'));
    
  } else if (nextAction === 'related') {
    console.log(chalk.blue('\nCreating a related document...\n'));
    console.log(chalk.yellow('Please run the tool again to create a related document.'));
    
  } else if (nextAction === 'index') {
    console.log(chalk.blue('\nCreating an index document...\n'));
    console.log(chalk.yellow('Please run the tool again and select "Index Page" as the document type.'));
  }
}

// Run the main function
main().catch(err => {
  console.error(chalk.red('\n❌ Error:'), err);
});
