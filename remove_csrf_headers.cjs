const fs = require('fs');
const path = require('path');

// Define the stores directory
const storesDir = path.join(__dirname, 'stores');

// Get all TypeScript files in the stores directory
const files = fs.readdirSync(storesDir).filter(file => file.endsWith('.ts'));

// Patterns to remove
const patterns = [
  /\s*'X-CSRF-TOKEN'\s*:\s*csrfToken\s*\|\|\s*'',?\s*\n/g,
  /\s*'X-CSRF-TOKEN'\s*:\s*csrfToken,?\s*\n/g,
  /\s*'X-CSRF-TOKEN'\s*:\s*csrfToken,?\s*$/gm,
  /\s*'X-CSRF-TOKEN'\s*:\s*csrfToken\s*\|\|\s*'',?\s*$/gm,
];

let totalRemoved = 0;

files.forEach(file => {
  const filePath = path.join(storesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Apply all patterns
  patterns.forEach(pattern => {
    content = content.replace(pattern, '');
  });
  
  // Count changes
  const changes = originalContent.length - content.length;
  if (changes > 0) {
    
    totalRemoved += changes;
    fs.writeFileSync(filePath, content);
  }
});

 
 