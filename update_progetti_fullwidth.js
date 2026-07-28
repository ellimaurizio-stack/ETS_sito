const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

// Add override for projects-grid items
const cssPath = path.join(__dirname, 'public/css/style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.projects-grid .project-grid-item')) {
    cssContent += `
.projects-grid .project-grid-item {
    border-radius: 0;
    box-shadow: none;
    aspect-ratio: auto;
    height: 400px; /* Or whatever height looks good for a 3-column full-width grid. Let's rely on aspect-ratio or height */
}
@media (min-width: 1200px) {
    .projects-grid .project-grid-item {
        height: 35vw;
    }
}
@media (max-width: 1199px) {
    .projects-grid .project-grid-item {
        height: 50vw;
    }
}
@media (max-width: 768px) {
    .projects-grid .project-grid-item {
        height: 100vw;
    }
}
`;
    fs.writeFileSync(cssPath, cssContent);
}

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            const regexToRemove = /<div class="projects-grid" style=".*?">[\s\S]*?<\/div>/;
            
            // We use the CSS class .projects-grid which has gap:0, width:100%, etc.
            let gridHtml = `
        <div class="projects-grid" style="margin-bottom: 0;">
`;
            for (let i = 20; i >= 1; i--) {
                gridHtml += `
            <a href="progetto-${i}.html" class="project-grid-item">
                <img src="img/progetto-${i}.jpg" alt="Progetto ${i}">
                <div class="project-grid-overlay"></div>
            </a>
`;
            }
            gridHtml += `        </div>`;

            html = html.replace(regexToRemove, gridHtml);
            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log("Updated progetti page gallery to use original CSS classes (full width).");
            });
        }
    });
});
