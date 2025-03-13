/**
 * Mock data for HIPAA checklists
 * 
 * This file provides structured data for the interactive HIPAA checklists
 * based on categories defined in the HIPAA security and privacy rules.
 * 
 * #tags: hipaa, checklist, mock-data
 */

import { ChecklistCategory, ChecklistItem } from '@/components/hipaa/HipaaChecklist';

// Technical Security checklist items
const technicalSecurityItems: ChecklistItem[] = [
  {
    id: 'tech-1',
    category: 'technical',
    label: 'Implement access controls (unique user identification)',
    description: 'Ensure each user has unique credentials and appropriate access levels.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'tech-2',
    category: 'technical',
    label: 'Implement audit controls and activity logs',
    description: 'Track all access to PHI with appropriate detail for investigations.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'tech-3',
    category: 'technical',
    label: 'Enable data integrity controls to prevent improper alteration',
    description: 'Implement mechanisms to ensure that PHI is not improperly altered or destroyed.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'tech-4',
    category: 'technical',
    label: 'Use secure transmission methods for PHI',
    description: 'Implement technical measures to guard against unauthorized access to PHI transmitted over networks.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'tech-5',
    category: 'technical',
    label: 'Implement encryption for PHI at rest',
    description: 'Ensure that stored PHI is protected using industry-standard encryption methods.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'tech-6',
    category: 'technical',
    label: 'Establish automatic logoff procedures',
    description: 'Implement technical mechanisms that terminate sessions after a predetermined time of inactivity.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'tech-7',
    category: 'technical',
    label: 'Implement emergency access procedures',
    description: 'Establish procedures for obtaining necessary PHI during an emergency.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'tech-8',
    category: 'technical',
    label: 'Conduct regular system vulnerability scans',
    description: 'Perform scans at least quarterly to identify potential security vulnerabilities.',
    completed: false,
    priority: 'medium'
  }
];

// Administrative Safeguards checklist items
const administrativeItems: ChecklistItem[] = [
  {
    id: 'admin-1',
    category: 'administrative',
    label: 'Conduct security risk assessment',
    description: 'Conduct an accurate and thorough assessment of potential risks to PHI.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'admin-2',
    category: 'administrative',
    label: 'Develop and implement security policies and procedures',
    description: 'Create comprehensive written policies and procedures that address all aspects of PHI security.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'admin-3',
    category: 'administrative',
    label: 'Designate a security official',
    description: 'Appoint an individual responsible for developing and implementing security policies.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'admin-4',
    category: 'administrative',
    label: 'Establish security awareness training for all staff',
    description: 'Provide regular training for all workforce members on security policies and procedures.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'admin-5',
    category: 'administrative',
    label: 'Create incident response and reporting procedures',
    description: 'Develop procedures for identifying, responding to, and documenting security incidents.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'admin-6',
    category: 'administrative',
    label: 'Develop contingency plans for emergencies',
    description: 'Create data backup, disaster recovery, and emergency operations plans.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'admin-7',
    category: 'administrative',
    label: 'Conduct regular security evaluations',
    description: 'Perform periodic technical and non-technical evaluations of security controls.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'admin-8',
    category: 'administrative',
    label: 'Establish Business Associate Agreements where required',
    description: 'Ensure that all business associates who handle PHI have signed appropriate agreements.',
    completed: false,
    priority: 'high'
  }
];

// Physical Safeguards checklist items
const physicalItems: ChecklistItem[] = [
  {
    id: 'phys-1',
    category: 'physical',
    label: 'Implement facility access controls',
    description: 'Limit physical access to facilities where systems containing PHI are housed.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'phys-2',
    category: 'physical',
    label: 'Create policies for workstation use and security',
    description: 'Implement policies governing the proper use and positioning of workstations with access to PHI.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'phys-3',
    category: 'physical',
    label: 'Establish device and media controls',
    description: 'Implement policies for the receipt and removal of hardware and electronic media containing PHI.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'phys-4',
    category: 'physical',
    label: 'Create procedures for media disposal',
    description: 'Implement procedures for the final disposition of PHI and the hardware or electronic media it is stored on.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'phys-5',
    category: 'physical',
    label: 'Develop hardware inventory management system',
    description: 'Maintain records of the movements of hardware and electronic media containing PHI.',
    completed: false,
    priority: 'low'
  },
  {
    id: 'phys-6',
    category: 'physical',
    label: 'Implement physical security for servers and equipment',
    description: 'Ensure that servers, network equipment, and backup media are physically secured.',
    completed: false,
    priority: 'high'
  }
];

// LLM and AI-specific checklist items
const llmItems: ChecklistItem[] = [
  {
    id: 'llm-1',
    category: 'llm',
    label: 'Implement data minimization for LLM inputs containing PHI',
    description: 'Ensure that only the minimum necessary PHI is included in LLM prompts.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'llm-2',
    category: 'llm',
    label: 'Establish secure prompt engineering guidelines',
    description: 'Develop guidelines for creating prompts that minimize risk of PHI disclosure.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'llm-3',
    category: 'llm',
    label: 'Create policy for reviewing LLM outputs before use',
    description: 'Implement procedures to review LLM-generated content before incorporating it into PHI workflows.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'llm-4',
    category: 'llm',
    label: 'Conduct regular audits of LLM interactions with PHI',
    description: 'Review logs and records of LLM usage involving PHI to ensure compliance.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'llm-5',
    category: 'llm',
    label: 'Establish incident response for LLM data breaches',
    description: 'Develop specific procedures for handling incidents involving LLM misuse or breaches.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'llm-6',
    category: 'llm',
    label: 'Implement BAAs with LLM service providers',
    description: 'Ensure business associate agreements are in place with LLM providers who may process PHI.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'llm-7',
    category: 'llm',
    label: 'Train staff on appropriate LLM use with PHI',
    description: 'Provide specialized training on safe use of LLMs when dealing with PHI.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'llm-8',
    category: 'llm',
    label: 'Document LLM risk assessment',
    description: 'Complete a specific risk assessment for LLM technologies used with PHI.',
    completed: false,
    priority: 'high'
  }
];

// CCM-specific checklist items
const ccmItems: ChecklistItem[] = [
  {
    id: 'ccm-1',
    category: 'ccm',
    label: 'Implement secure time tracking for CCM services',
    description: 'Ensure time tracking systems for CCM billing are secure and HIPAA compliant.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'ccm-2',
    category: 'ccm',
    label: 'Develop protocols for secure patient communication',
    description: 'Establish secure methods for communicating with patients during CCM activities.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'ccm-3',
    category: 'ccm',
    label: 'Create secure care plan sharing procedures',
    description: 'Implement secure methods for sharing care plans with patients and other providers.',
    completed: false,
    priority: 'medium'
  },
  {
    id: 'ccm-4',
    category: 'ccm',
    label: 'Establish secure documentation of CCM activities',
    description: 'Ensure all CCM activities are documented securely in compliance with HIPAA.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'ccm-5',
    category: 'ccm',
    label: 'Implement consent management for CCM services',
    description: 'Track and manage patient consent for CCM services in a HIPAA-compliant manner.',
    completed: false,
    priority: 'high'
  },
  {
    id: 'ccm-6',
    category: 'ccm',
    label: 'Create secure process for handling screenshots',
    description: 'Establish procedures for securely capturing, storing, and transmitting screenshots.',
    completed: false,
    priority: 'high'
  }
];

// Export the complete set of checklist categories
export const hipaaChecklistCategories: ChecklistCategory[] = [
  {
    id: 'technical-security',
    name: 'Technical Security Safeguards',
    description: 'Technical measures to protect electronic protected health information (ePHI).',
    items: technicalSecurityItems
  },
  {
    id: 'administrative',
    name: 'Administrative Safeguards',
    description: 'Administrative actions, policies, and procedures to manage security measures.',
    items: administrativeItems
  },
  {
    id: 'physical',
    name: 'Physical Safeguards',
    description: 'Physical measures, policies, and procedures to protect systems and facilities.',
    items: physicalItems
  },
  {
    id: 'llm',
    name: 'LLM and AI Safeguards',
    description: 'Specific controls for using large language models and AI with PHI.',
    items: llmItems
  },
  {
    id: 'ccm',
    name: 'CCM Specific Requirements',
    description: 'Special requirements for Chronic Care Management services.',
    items: ccmItems
  }
];

// Function to get a specific checklist category by ID
export function getChecklistCategory(id: string): ChecklistCategory | undefined {
  return hipaaChecklistCategories.find(category => category.id === id);
}

// Function to get all checklist items for a specific category
export function getChecklistItemsByCategory(categoryId: string): ChecklistItem[] {
  const category = getChecklistCategory(categoryId);
  return category ? category.items : [];
}

// Function to get a filtered checklist with only certain categories
export function getFilteredChecklist(categoryIds: string[]): ChecklistCategory[] {
  return hipaaChecklistCategories.filter(category => 
    categoryIds.includes(category.id)
  );
}