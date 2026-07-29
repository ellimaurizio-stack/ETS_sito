const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

const footerRegex = /<div class="footer-col" style="margin-top: 2rem;">[\s\S]*?<p style="margin-bottom: 5px; font-size: 0.9rem;">Hai bisogno di aiuto\?<\/p>[\s\S]*?<h3 style="margin-top: 0; font-size: 1.5rem;"><a href="contatti.html" style="color: inherit; text-decoration: none; border-bottom: 2px solid currentColor;">Contattaci<\/a><\/h3>[\s\S]*?<\/div>/;

const replacement = `<div class="footer-col">
                <h4 style="color: var(--color-light-blue); font-size: 1.1rem; text-transform: uppercase; margin-bottom: 8px;">Hai bisogno di aiuto?</h4>
                <p style="margin-top: 0;"><a href="contatti.html" style="color: inherit; text-decoration: none; font-weight: bold; font-size: 1.2rem; border-bottom: 2px solid currentColor;">Contattaci</a></p>
            </div>`;

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    if (footerRegex.test(html)) {
        html = html.replace(footerRegex, replacement);
        fs.writeFileSync(filePath, html);
        console.log("Updated footer in", file);
    } else {
        console.log("Footer not matched in", file);
    }
});
