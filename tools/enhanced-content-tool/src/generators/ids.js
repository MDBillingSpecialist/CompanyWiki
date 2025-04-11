/**
 * ID generation utilities for content documents
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Generate the next available SOP ID for a department
 * @param {string} department - Department name (engineering, operations, compliance)
 * @returns {string} - Next available SOP ID (e.g., ENG-001)
 */
async function getNextSopId(department) {
  const prefix = getDepartmentPrefix(department);
  const sopDir = path.join(process.cwd(), 'content', 'sop', department);
  
  // If directory doesn't exist, start with ID 001
  if (!fs.existsSync(sopDir)) {
    return `${prefix}-001`;
  }
  
  // Find all existing SOP IDs with this prefix
  const existingIds = [];
  
  try {
    const files = fs.readdirSync(sopDir).filter(f => f.endsWith('.md') && f !== 'index.md');
    
    for (const file of files) {
      const filePath = path.join(sopDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      
      if (data.sop_id && data.sop_id.startsWith(prefix)) {
        existingIds.push(data.sop_id);
      }
    }
  } catch (error) {
    console.error(`Error reading SOP directory: ${error.message}`);
    // If there's an error, start with ID 001
    return `${prefix}-001`;
  }
  
  // Find the highest number
  let highestNum = 0;
  for (const id of existingIds) {
    const match = id.match(new RegExp(`${prefix}-(\\d+)`));
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num > highestNum) {
        highestNum = num;
      }
    }
  }
  
  // Format the next number with leading zeros
  const nextNum = highestNum + 1;
  const paddedNum = nextNum.toString().padStart(3, '0');
  
  return `${prefix}-${paddedNum}`;
}

/**
 * Get department prefix for SOP IDs
 * @param {string} department - Department name
 * @returns {string} - Department prefix (e.g., ENG, OPS, COM)
 */
function getDepartmentPrefix(department) {
  const prefixMap = {
    'engineering': 'ENG',
    'operations': 'OPS',
    'compliance': 'COM'
  };
  
  return prefixMap[department.toLowerCase()] || department.toUpperCase().substring(0, 3);
}

module.exports = {
  getNextSopId
};
