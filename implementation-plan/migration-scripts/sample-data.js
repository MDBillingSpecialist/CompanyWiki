/**
 * Sample Data Generator
 * 
 * Creates sample HIPAA content for testing the hybrid wiki architecture.
 * 
 * Usage:
 * NODE_ENV=production node sample-data.js --apiUrl=http://localhost:3100 --apiKey=your-api-key
 */
require('dotenv').config();
const axios = require('axios');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--apiUrl <url>', 'URL of the API integration layer', 'http://localhost:3100')
  .option('--apiKey <key>', 'API key for authentication')
  .option('--dryRun', 'Run without making changes', false)
  .parse(process.argv);

const options = program.opts();

// API client
const client = axios.create({
  baseURL: options.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${options.apiKey || process.env.API_KEY}`
  }
});

// Sample compliance status data
const sampleComplianceStatus = [
  {
    category: 'technical',
    status: 'compliant',
    lastReviewed: new Date('2025-01-15'),
    nextReview: new Date('2025-07-15'),
    progress: 100,
    itemsTotal: 25,
    itemsCompleted: 25
  },
  {
    category: 'administrative',
    status: 'at-risk',
    lastReviewed: new Date('2025-02-10'),
    nextReview: new Date('2025-08-10'),
    progress: 85,
    itemsTotal: 20,
    itemsCompleted: 17
  },
  {
    category: 'physical',
    status: 'at-risk',
    lastReviewed: new Date('2025-01-20'),
    nextReview: new Date('2025-07-20'),
    progress: 80,
    itemsTotal: 15,
    itemsCompleted: 12
  },
  {
    category: 'llm',
    status: 'non-compliant',
    lastReviewed: new Date('2025-02-05'),
    nextReview: new Date('2025-05-05'),
    progress: 60,
    itemsTotal: 10,
    itemsCompleted: 6
  },
  {
    category: 'ccm',
    status: 'pending-review',
    lastReviewed: null,
    nextReview: new Date('2025-04-01'),
    progress: 0,
    itemsTotal: 12,
    itemsCompleted: 0
  }
];

// Sample checklist categories
const sampleChecklistCategories = [
  {
    id: 'cat-001',
    name: 'Access Controls',
    description: 'Measures to ensure only authorized users can access ePHI',
    category: 'technical',
    items: [
      {
        id: 'item-001',
        label: 'Implement unique user identification',
        description: 'Assign a unique name and/or number for identifying and tracking user identity',
        completed: true,
        priority: 'high'
      },
      {
        id: 'item-002',
        label: 'Establish emergency access procedures',
        description: 'Implement procedures for obtaining necessary ePHI during an emergency',
        completed: true,
        priority: 'high'
      },
      {
        id: 'item-003',
        label: 'Implement automatic logoff',
        description: 'Terminate an electronic session after a predetermined time of inactivity',
        completed: true,
        priority: 'medium'
      },
      {
        id: 'item-004',
        label: 'Implement encryption and decryption',
        description: 'Implement mechanisms to encrypt and decrypt ePHI',
        completed: true,
        priority: 'high'
      }
    ]
  },
  {
    id: 'cat-002',
    name: 'Audit Controls',
    description: 'Mechanisms to record and examine activity in systems containing ePHI',
    category: 'technical',
    items: [
      {
        id: 'item-005',
        label: 'Implement audit logging',
        description: 'Record and examine activity in information systems that contain or use ePHI',
        completed: true,
        priority: 'high'
      },
      {
        id: 'item-006',
        label: 'Establish audit trail review procedures',
        description: 'Create procedures for regularly reviewing records of information system activity',
        completed: true,
        priority: 'medium'
      }
    ]
  },
  {
    id: 'cat-003',
    name: 'LLM Implementation',
    description: 'Controls for implementing Large Language Models in healthcare applications',
    category: 'llm',
    items: [
      {
        id: 'item-007',
        label: 'Implement LLM content filtering',
        description: 'Ensure LLMs cannot generate content containing PHI identifiers',
        completed: true,
        priority: 'high'
      },
      {
        id: 'item-008',
        label: 'Establish LLM prompt security',
        description: 'Implement protocols to prevent PHI from being included in prompts',
        completed: true,
        priority: 'high'
      },
      {
        id: 'item-009',
        label: 'Create LLM output validation',
        description: 'Establish procedures for validating LLM outputs before use in clinical settings',
        completed: false,
        priority: 'high'
      },
      {
        id: 'item-010',
        label: 'Implement LLM audit logging',
        description: 'Record all LLM interactions for compliance auditing',
        completed: false,
        priority: 'medium'
      }
    ]
  }
];

// Sample upcoming reviews
const sampleUpcomingReviews = [
  {
    id: 'rev-001',
    title: 'Technical Safeguards Review',
    category: 'technical',
    description: 'Annual review of technical safeguards implementation',
    dueDate: new Date('2025-07-15'),
    assignedTo: 'John Smith',
    priority: 'high'
  },
  {
    id: 'rev-002',
    title: 'Administrative Safeguards Review',
    category: 'administrative',
    description: 'Annual review of administrative safeguards',
    dueDate: new Date('2025-08-10'),
    assignedTo: 'Jane Doe',
    priority: 'medium'
  },
  {
    id: 'rev-003',
    title: 'LLM Compliance Audit',
    category: 'llm',
    description: 'Quarterly review of LLM implementation compliance',
    dueDate: new Date('2025-05-05'),
    assignedTo: 'Alex Johnson',
    priority: 'high'
  },
  {
    id: 'rev-004',
    title: 'CCM Requirements Review',
    category: 'ccm',
    description: 'Initial assessment of CCM compliance requirements',
    dueDate: new Date('2025-04-01'),
    assignedTo: 'Lisa Chen',
    priority: 'medium'
  }
];

// Create compliance status
async function createComplianceStatus() {
  try {
    for (const status of sampleComplianceStatus) {
      if (options.dryRun) {
        console.log(`[DRY RUN] Would create compliance status for category: ${status.category}`);
        continue;
      }
      
      await client.post('/api/hipaa/status', status);
      console.log(`Created compliance status for category: ${status.category}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating compliance status:', error.message);
    return false;
  }
}

// Create checklist categories
async function createChecklistCategories() {
  try {
    for (const category of sampleChecklistCategories) {
      if (options.dryRun) {
        console.log(`[DRY RUN] Would create checklist category: ${category.name}`);
        continue;
      }
      
      await client.post('/api/hipaa/checklists', category);
      console.log(`Created checklist category: ${category.name}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating checklist categories:', error.message);
    return false;
  }
}

// Create upcoming reviews
async function createUpcomingReviews() {
  try {
    for (const review of sampleUpcomingReviews) {
      if (options.dryRun) {
        console.log(`[DRY RUN] Would create review: ${review.title}`);
        continue;
      }
      
      await client.post('/api/hipaa/reviews', review);
      console.log(`Created review: ${review.title}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating upcoming reviews:', error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log(`Starting sample data creation at ${options.apiUrl}`);
    console.log(`Dry run: ${options.dryRun}`);
    
    // Create compliance status
    const statusResult = await createComplianceStatus();
    
    // Create checklist categories
    const checklistResult = await createChecklistCategories();
    
    // Create upcoming reviews
    const reviewsResult = await createUpcomingReviews();
    
    console.log('\nSample data creation complete!');
    console.log(`Compliance status: ${statusResult ? 'Success' : 'Failed'}`);
    console.log(`Checklist categories: ${checklistResult ? 'Success' : 'Failed'}`);
    console.log(`Upcoming reviews: ${reviewsResult ? 'Success' : 'Failed'}`);
    
  } catch (error) {
    console.error('Sample data creation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();