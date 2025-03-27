/**
 * HIPAA Sample Data Population Script
 * 
 * Directly populates the HIPAA database with sample data
 */
require('dotenv').config();
const { Sequelize } = require('sequelize');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--dbHost <host>', 'Database host', 'localhost')
  .option('--dbPort <port>', 'Database port', '5432')
  .option('--dbUser <user>', 'Database user', 'wikijs')
  .option('--dbPass <password>', 'Database password', 'wikijs_password')
  .option('--dbName <name>', 'Database name', 'wiki')
  .parse(process.argv);

const options = program.opts();

/**
 * Main function
 */
async function main() {
  try {
    console.log('Connecting to database...');
    
    // Connect to database
    const sequelize = new Sequelize({
      dialect: 'postgres',
      host: options.dbHost,
      port: options.dbPort,
      username: options.dbUser,
      password: options.dbPass,
      database: options.dbName,
      logging: false
    });
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Define models
    const ComplianceStatus = sequelize.define('ComplianceStatus', {
      category: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      status: {
        type: Sequelize.ENUM('compliant', 'at-risk', 'non-compliant', 'pending-review'),
        defaultValue: 'pending-review'
      },
      lastReviewed: Sequelize.DATE,
      nextReview: Sequelize.DATE,
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      itemsTotal: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      itemsCompleted: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'ComplianceStatuses'
    });
    
    const ChecklistCategory = sequelize.define('ChecklistCategory', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name: Sequelize.STRING,
      description: Sequelize.TEXT,
      category: Sequelize.STRING
    }, {
      tableName: 'ChecklistCategories'
    });
    
    const ChecklistItem = sequelize.define('ChecklistItem', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      categoryId: Sequelize.STRING,
      label: Sequelize.STRING,
      description: Sequelize.TEXT,
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium'
      },
      notes: Sequelize.TEXT
    }, {
      tableName: 'ChecklistItems'
    });
    
    const Review = sequelize.define('Review', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      title: Sequelize.STRING,
      category: Sequelize.STRING,
      description: Sequelize.TEXT,
      dueDate: Sequelize.DATE,
      assignedTo: Sequelize.STRING,
      priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        defaultValue: 'medium'
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'overdue'),
        defaultValue: 'pending'
      }
    }, {
      tableName: 'Reviews'
    });
    
    // Define relationships
    ChecklistCategory.hasMany(ChecklistItem, { foreignKey: 'categoryId', as: 'items' });
    ChecklistItem.belongsTo(ChecklistCategory, { foreignKey: 'categoryId' });
    
    // Sync models (only create if not exists)
    await sequelize.sync();
    
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
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'rev-002',
        title: 'Administrative Safeguards Review',
        category: 'administrative',
        description: 'Annual review of administrative safeguards',
        dueDate: new Date('2025-08-10'),
        assignedTo: 'Jane Doe',
        priority: 'medium',
        status: 'pending'
      },
      {
        id: 'rev-003',
        title: 'LLM Compliance Audit',
        category: 'llm',
        description: 'Quarterly review of LLM implementation compliance',
        dueDate: new Date('2025-05-05'),
        assignedTo: 'Alex Johnson',
        priority: 'high',
        status: 'pending'
      },
      {
        id: 'rev-004',
        title: 'CCM Requirements Review',
        category: 'ccm',
        description: 'Initial assessment of CCM compliance requirements',
        dueDate: new Date('2025-04-01'),
        assignedTo: 'Lisa Chen',
        priority: 'medium',
        status: 'pending'
      }
    ];
    
    // Create compliance status
    console.log('Creating compliance status data...');
    for (const status of sampleComplianceStatus) {
      await ComplianceStatus.upsert(status);
      console.log(`Created compliance status for category: ${status.category}`);
    }
    
    // Create checklist categories and items
    console.log('\nCreating checklist categories and items...');
    for (const category of sampleChecklistCategories) {
      const { items, ...categoryData } = category;
      
      // Create category
      await ChecklistCategory.upsert(categoryData);
      console.log(`Created checklist category: ${category.name}`);
      
      // Create items
      for (const item of items) {
        await ChecklistItem.upsert({
          ...item,
          categoryId: category.id
        });
        console.log(`  Created checklist item: ${item.label}`);
      }
    }
    
    // Create upcoming reviews
    console.log('\nCreating upcoming reviews...');
    for (const review of sampleUpcomingReviews) {
      await Review.upsert(review);
      console.log(`Created review: ${review.title}`);
    }
    
    console.log('\nSample data created successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();