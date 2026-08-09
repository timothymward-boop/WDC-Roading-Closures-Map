import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(/<i data-lucide/g, '<i aria-hidden="true" data-lucide');
fs.writeFileSync('index.html', content);
console.log('Replaced icons');
