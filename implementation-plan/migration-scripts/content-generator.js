/**
 * Content Generator
 * 
 * Generates HTML manual instructions for content to copy-paste into Wiki.js
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { program } = require('commander');

// Parse command line arguments
program
  .option('--source <path>', 'Path to the content directory', './sample-content')
  .option('--output <path>', 'Output HTML file', './wiki-content.html')
  .parse(process.argv);

const options = program.opts();

/**
 * Recursively scan directory for markdown files
 */
function scanDirectory(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      files.push(...scanDirectory(itemPath));
    } else if (item.isFile() && (item.name.endsWith('.md') || item.name.endsWith('.mdx'))) {
      files.push(itemPath);
    }
  }
  
  return files;
}

/**
 * Main function
 */
function main() {
  try {
    const contentDir = path.resolve(options.source);
    
    if (!fs.existsSync(contentDir)) {
      console.error(`Content directory not found: ${contentDir}`);
      process.exit(1);
    }
    
    console.log(`Generating content from ${contentDir} to ${options.output}`);
    
    // Scan directory for markdown files
    const files = scanDirectory(contentDir);
    console.log(`Found ${files.length} markdown files`);
    
    // Generate HTML
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Wiki.js Content</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .content { margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
        h1 { color: #333; }
        h2 { color: #444; margin-top: 30px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
        .copy-button { background: #4CAF50; color: white; border: none; padding: 10px 15px; 
                      cursor: pointer; border-radius: 4px; margin: 10px 0; }
        .copy-button:hover { background: #45a049; }
        .tag { display: inline-block; background: #e0e0e0; padding: 2px 8px; border-radius: 10px; 
              margin-right: 5px; font-size: 12px; }
        .instructions { margin: 20px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; }
      </style>
    </head>
    <body>
      <h1>Wiki.js Content Migration</h1>
      
      <div class="instructions">
        <h3>Instructions</h3>
        <p>Follow these steps to create each page in Wiki.js:</p>
        <ol>
          <li>Click the "+ New Page" button in the Wiki.js interface</li>
          <li>Enter the title as shown below</li>
          <li>Enter the path as shown below</li>
          <li>Select "Markdown" as the editor</li>
          <li>Click "Continue"</li>
          <li>Copy and paste the content from below</li>
          <li>Enter the description in the description field</li>
          <li>Add tags as shown below</li>
          <li>Click "Create"</li>
        </ol>
      </div>
    `;
    
    // Process each file
    for (const file of files) {
      console.log(`Processing: ${file}`);
      
      // Read file content
      const content = fs.readFileSync(file, 'utf8');
      
      // Parse frontmatter
      const { data, content: markdownContent } = matter(content);
      
      // Extract metadata
      const title = data.title || path.basename(file, path.extname(file));
      const description = data.description || 'No description provided';
      const tags = Array.isArray(data.tags) ? data.tags : 
                  (typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()) : []);
      
      // Create relative path for Wiki.js
      const relativePath = path.relative(contentDir, file);
      const wikijsPath = relativePath
        .replace(/index\.(md|mdx)$/, '') // Replace index.md with empty string
        .replace(/\.(md|mdx)$/, '') // Remove extension
        .replace(/\\/g, '/'); // Replace backslashes with forward slashes
      
      // Add to HTML
      html += `
        <div class="content">
          <h2>${title}</h2>
          <p><strong>Path:</strong> ${wikijsPath}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Tags:</strong> ${tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</p>
          
          <button class="copy-button" onclick="copyContent('content-${wikijsPath.replace(/[^a-zA-Z0-9]/g, '-')}')">Copy Content</button>
          <pre id="content-${wikijsPath.replace(/[^a-zA-Z0-9]/g, '-')}">${markdownContent}</pre>
        </div>
      `;
    }
    
    // Add HIPAA sample data
    html += `
      <h1>HIPAA Dashboard Data</h1>
      
      <div class="instructions">
        <h3>Instructions</h3>
        <p>After setting up the content, populate the HIPAA dashboard with sample data:</p>
        <ol>
          <li>Make sure your API layer is running at http://localhost:3100</li>
          <li>Copy and run the following curl commands to populate sample data</li>
        </ol>
      </div>
      
      <div class="content">
        <h2>Compliance Status Data</h2>
        <button class="copy-button" onclick="copyContent('status-technical')">Copy Technical Command</button>
        <pre id="status-technical">curl -X POST http://localhost:3100/api/hipaa/status -H "Content-Type: application/json" -d '{"category":"technical","status":"compliant","lastReviewed":"2025-01-15T00:00:00.000Z","nextReview":"2025-07-15T00:00:00.000Z","progress":100,"itemsTotal":25,"itemsCompleted":25}'</pre>
        
        <button class="copy-button" onclick="copyContent('status-administrative')">Copy Administrative Command</button>
        <pre id="status-administrative">curl -X POST http://localhost:3100/api/hipaa/status -H "Content-Type: application/json" -d '{"category":"administrative","status":"at-risk","lastReviewed":"2025-02-10T00:00:00.000Z","nextReview":"2025-08-10T00:00:00.000Z","progress":85,"itemsTotal":20,"itemsCompleted":17}'</pre>
        
        <button class="copy-button" onclick="copyContent('status-physical')">Copy Physical Command</button>
        <pre id="status-physical">curl -X POST http://localhost:3100/api/hipaa/status -H "Content-Type: application/json" -d '{"category":"physical","status":"at-risk","lastReviewed":"2025-01-20T00:00:00.000Z","nextReview":"2025-07-20T00:00:00.000Z","progress":80,"itemsTotal":15,"itemsCompleted":12}'</pre>
        
        <button class="copy-button" onclick="copyContent('status-llm')">Copy LLM Command</button>
        <pre id="status-llm">curl -X POST http://localhost:3100/api/hipaa/status -H "Content-Type: application/json" -d '{"category":"llm","status":"non-compliant","lastReviewed":"2025-02-05T00:00:00.000Z","nextReview":"2025-05-05T00:00:00.000Z","progress":60,"itemsTotal":10,"itemsCompleted":6}'</pre>
        
        <button class="copy-button" onclick="copyContent('status-ccm')">Copy CCM Command</button>
        <pre id="status-ccm">curl -X POST http://localhost:3100/api/hipaa/status -H "Content-Type: application/json" -d '{"category":"ccm","status":"pending-review","nextReview":"2025-04-01T00:00:00.000Z","progress":0,"itemsTotal":12,"itemsCompleted":0}'</pre>
      </div>
    `;
    
    // Close HTML
    html += `
      <script>
        function copyContent(id) {
          const el = document.getElementById(id);
          const range = document.createRange();
          range.selectNode(el);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand('copy');
          selection.removeAllRanges();
          
          const button = event.target;
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      </script>
    </body>
    </html>
    `;
    
    // Write HTML to file
    fs.writeFileSync(options.output, html);
    
    console.log(`\nHTML instructions generated at ${options.output}`);
    console.log('Open this file in a browser to view and copy content for Wiki.js');
    
  } catch (error) {
    console.error('Generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();