const fs = require('fs');

// Read the HTML file
let content = fs.readFileSync('index.html', 'utf8');

// Replace all .jpg references that don't already have images/ prefix
content = content.replace(/src="(?!images\/)([^"]*\.jpg)"/g, 'src="images/$1"');

// Write back to file
fs.writeFileSync('index.html', content);

console.log('Fixed all image paths');