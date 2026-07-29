const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const footerRegex = /<div class="footer-title">[\s\S]*?<h3>Contattaci<\/h3>[\s\S]*?<\/div>[\s\S]*?<div class="footer-col">\s*<h4>Seguici su:<\/h4>[\s\S]*?<\/div>/;

// For files that have it in one line (e.g. minified or previously replaced):
const footerRegexOneLine = /<div class="footer-title"><p>Hai bisogno di aiuto\?<\/p><h3>Contattaci<\/h3><\/div>\s*<div class="footer-col"><h4>Seguici su:<\/h4><p><img src="img\/facebook\.png"[^>]*>\s*<img src="img\/In\.png"[^>]*><\/p><\/div>/;

const replacement = `<div class="footer-col" style="margin-top: 2rem;">
                <p style="margin-bottom: 5px; font-size: 0.9rem;">Hai bisogno di aiuto?</p>
                <h3 style="margin-top: 0; font-size: 1.5rem;"><a href="contatti.html" style="color: inherit; text-decoration: none; border-bottom: 2px solid currentColor;">Contattaci</a></h3>
            </div>`;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    let matched = false;
    
    if (footerRegex.test(html)) {
        html = html.replace(footerRegex, replacement);
        matched = true;
    } else if (footerRegexOneLine.test(html)) {
        html = html.replace(footerRegexOneLine, replacement);
        matched = true;
    }
    
    if (matched) {
        fs.writeFileSync(filePath, html);
        console.log("Updated footer in", file);
    } else {
        console.log("Footer not matched in", file);
    }
});
