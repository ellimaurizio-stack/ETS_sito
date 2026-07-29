const fs = require('fs');
const path = require('path');

// 1. Update CSS
const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

if (!cssContent.includes('.nav-links li a.active')) {
    cssContent += `
/* Navbar active state */
.nav-links li a.active {
    position: relative;
}
.nav-links li a.active::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    background-color: var(--color-light-blue);
    border-radius: 50%;
}
`;
    fs.writeFileSync(cssPath, cssContent);
    console.log("Updated style.css");
}

// 2. Update HTML files
const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // First, clear any existing active classes (just in case)
    html = html.replace(/<a href="([^"]+)" class="active">/g, '<a href="$1">');
    
    // Determine the active page category
    let targetHref = '';
    if (file === 'index.html') targetHref = 'index.html';
    else if (file === 'chi-siamo.html') targetHref = 'chi-siamo.html';
    else if (file.startsWith('progett')) targetHref = 'progetti.html'; // covers progetti.html and progetto-*.html
    else if (file === 'sostienici.html') targetHref = 'sostienici.html';
    else if (file === 'contatti.html') targetHref = 'contatti.html';

    if (targetHref) {
        // Find the specific link and add class="active"
        const regex = new RegExp(`(<a href="${targetHref}")>`);
        if (regex.test(html)) {
            html = html.replace(regex, `$1 class="active">`);
            fs.writeFileSync(filePath, html);
            console.log("Updated active link in", file);
        }
    }
});
