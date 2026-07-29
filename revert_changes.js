const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

// 1. Revert Logo link in all files
const aLogoRegex = /<div class="logo">\s*<a href="index\.html">\s*<img src="img\/ets-logo-navbar\.png" alt="e-ts" style="max-height: 40px;">\s*<\/a>\s*<\/div>/;
const originalLogo = `<div class="logo">
            <img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 40px;">
        </div>`;

files.forEach(file => {
    let filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    if (aLogoRegex.test(html)) {
        html = html.replace(aLogoRegex, originalLogo);
        fs.writeFileSync(filePath, html);
        console.log("Reverted logo in", file);
    }
});

// 2. Revert contatti.html margins
let contattiPath = path.join(publicDir, 'contatti.html');
let contattiHtml = fs.readFileSync(contattiPath, 'utf8');
contattiHtml = contattiHtml.replace(/margin-top: -1rem; margin-bottom: -1rem;/, 'margin-top: -4%; margin-bottom: -4%;');
fs.writeFileSync(contattiPath, contattiHtml);
console.log('Reverted margins in contatti.html');

// 3. Revert partners-grid spacing in index.html and sostienici.html
['index.html', 'sostienici.html'].forEach(file => {
    let filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    // Restore gap from 2rem 3rem to 4rem 6rem, and margin from 2rem auto to 4rem auto
    html = html.replace(/gap: 2rem 3rem;/g, 'gap: 4rem 6rem;');
    html = html.replace(/margin: 2rem auto;/g, 'margin: 4rem auto;');
    fs.writeFileSync(filePath, html);
    console.log('Reverted partners-grid in', file);
});
