import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

// Update validation logic to toggle aria-invalid
content = content.replace("document.getElementById('reportLocation').classList.add('border-red-500');", "document.getElementById('reportLocation').classList.add('border-red-500'); document.getElementById('reportLocation').setAttribute('aria-invalid', 'true');");
content = content.replace("document.getElementById('reportLocation').classList.remove('border-red-500');", "document.getElementById('reportLocation').classList.remove('border-red-500'); document.getElementById('reportLocation').setAttribute('aria-invalid', 'false');");

content = content.replace("document.getElementById('reportType').classList.add('border-red-500');", "document.getElementById('reportType').classList.add('border-red-500'); document.getElementById('reportType').setAttribute('aria-invalid', 'true');");
content = content.replace("document.getElementById('reportType').classList.remove('border-red-500');", "document.getElementById('reportType').classList.remove('border-red-500'); document.getElementById('reportType').setAttribute('aria-invalid', 'false');");

content = content.replace("document.getElementById('reportDesc').classList.add('border-red-500');", "document.getElementById('reportDesc').classList.add('border-red-500'); document.getElementById('reportDesc').setAttribute('aria-invalid', 'true');");
content = content.replace("document.getElementById('reportDesc').classList.remove('border-red-500');", "document.getElementById('reportDesc').classList.remove('border-red-500'); document.getElementById('reportDesc').setAttribute('aria-invalid', 'false');");

fs.writeFileSync('index.html', content);
console.log('Applied ARIA invalid toggles');
