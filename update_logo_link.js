const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

// The regex matches the logo div in the navbar.
const logoRegex = /<div class="logo">\s*<img src="img\/ets-logo-navbar\.png" alt="e-ts" style="max-height: 40px;">\s*<\/div>/;
const replacement = `<div class="logo">
            <a href="index.html">
                <img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 40px;">
            </a>
        </div>`;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    if (logoRegex.test(html)) {
        html = html.replace(logoRegex, replacement);
        fs.writeFileSync(filePath, html);
        console.log("Updated logo link in", file);
    } else {
        console.log("Logo not matched in", file);
    }
});
