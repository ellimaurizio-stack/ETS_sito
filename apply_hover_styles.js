const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

const projectsMetadata = require('./projects.json');

// Helper to generate a card
function generateCard(num) {
    let data = projectsMetadata[num] || { nome: '', sottotitolo: '', titolo: '', testo: '', clickable: false };
    
    let styleClass = 'hover-style-c';

    let tag = data.clickable ? 'a' : 'div';
    let href = data.clickable ? `href="progetto-${num}.html"` : '';
    
    let popupHtml = `
        <div class="project-preview-popup">
            <div class="popup-content">
                <h4 class="popup-subtitle">${data.sottotitolo}</h4>
                <h3 class="popup-title">${data.titolo}</h3>
                <div class="popup-line"></div>
                <p class="popup-text">${data.testo}</p>
                ${data.clickable ? '<span class="popup-cta">Scopri di più sul progetto &rarr;</span>' : ''}
            </div>
        </div>
    `;

    return `
    <${tag} ${href} class="project-grid-item ${styleClass}">
        <img src="img/progetto-${num}.jpg" alt="${data.nome || 'Progetto'}">
        <div class="project-grid-overlay"></div>
        ${popupHtml}
    </${tag}>
    `;
}

// 1. Update progetti page in DB
db.serialize(() => {
    db.get("SELECT id, content FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            let gridHtml = '<div class="progetti-grid-3" style="max-width: 100%; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;">';
            for (let i = 20; i >= 1; i--) {
                gridHtml += generateCard(i);
            }
            gridHtml += '</div>';

            content.html = gridHtml;
            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log("Updated progetti page HTML in DB.");
            });
        }
    });
});

// 2. Update ssg.js
let ssgPath = path.join(__dirname, 'ssg.js');
let ssgCode = fs.readFileSync(ssgPath, 'utf8');

let newSsgLogic = `
                \${(content.logos || []).map(logo => {
                    let match = logo.match(/progetto-(\\d+)\\.jpg/);
                    let num = match ? parseInt(match[1]) : 0;
                    if(!num) return '';
                    
                    const projectsMetadata = require('./projects.json');
                    let data = projectsMetadata[num] || { nome: '', sottotitolo: '', titolo: '', testo: '', clickable: false };
                    
                    let styleClass = 'hover-style-c';

                    let tag = data.clickable ? 'a' : 'div';
                    let href = data.clickable ? \`href="progetto-\${num}.html"\` : '';
                    
                    let popupHtml = \`
                        <div class="project-preview-popup">
                            <div class="popup-content">
                                <h4 class="popup-subtitle">\${data.sottotitolo}</h4>
                                <h3 class="popup-title">\${data.titolo}</h3>
                                <div class="popup-line"></div>
                                <p class="popup-text">\${data.testo}</p>
                                \${data.clickable ? '<span class="popup-cta">Scopri di più sul progetto &rarr;</span>' : ''}
                            </div>
                        </div>
                    \`;

                    return \`
                    <\${tag} \${href} class="project-grid-item \${styleClass}">
                        <img src="\${logo.replace('public/', '')}" alt="\${data.nome || 'Progetto'}">
                        <div class="project-grid-overlay"></div>
                        \${popupHtml}
                    </\${tag}>
                    \`;
                }).join('')}
`;

ssgCode = ssgCode.replace(
    /\$\{\(content\.logos \|\| \[\]\)\.map\(logo => \{[\s\S]*?\}\)\.join\(''\)\}/,
    newSsgLogic.trim()
);
fs.writeFileSync(ssgPath, ssgCode);
console.log("Updated ssg.js.");
