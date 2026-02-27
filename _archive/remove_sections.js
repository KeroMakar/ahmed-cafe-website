const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const startContent = '  <!-- ===================== MENU SECTION ===================== -->';
const endContent = '  <!-- ===================== CONTACT SECTION ===================== -->';
const startIndex = content.indexOf(startContent);
const endIndex = content.indexOf(endContent);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + content.substring(endIndex);
} else {
    console.log("Sections not found!");
}

content = content.replace(/<a href="[^"]*#about"[^>]*>About<\/a>\r?\n\s*/g, '');

fs.writeFileSync('index.html', content);
console.log("File modified successfully.");
