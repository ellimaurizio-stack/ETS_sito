const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// 1. Fix contatti.html margin issue
let contattiPath = path.join(publicDir, 'contatti.html');
let contattiHtml = fs.readFileSync(contattiPath, 'utf8');
contattiHtml = contattiHtml.replace(/margin-top: -4%; margin-bottom: -4%;/, 'margin-top: -1rem; margin-bottom: -1rem;');
fs.writeFileSync(contattiPath, contattiHtml);
console.log('Fixed margins in contatti.html');

// 2. Fix partners-grid spacing in index.html and sostienici.html
['index.html', 'sostienici.html'].forEach(file => {
    let filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    // Reduce gap from 4rem 6rem to 2rem 3rem, and margin from 4rem auto to 2rem auto
    html = html.replace(/gap: 4rem 6rem;/g, 'gap: 2rem 3rem;');
    html = html.replace(/margin: 4rem auto;/g, 'margin: 2rem auto;');
    fs.writeFileSync(filePath, html);
    console.log('Fixed partners-grid in', file);
});
