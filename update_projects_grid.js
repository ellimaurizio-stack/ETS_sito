const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

// 1. Update CSS
const cssPath = path.join(__dirname, 'public/css/style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
const newCss = `
/* Project Grid Styles */
.project-grid-item {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    display: block;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.project-grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    display: block;
}
.project-grid-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--color-light-blue);
    mix-blend-mode: color;
    opacity: 1;
    transition: opacity 0.4s ease;
    z-index: 2;
}
.project-grid-overlay::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--color-light-blue);
    opacity: 0.3;
    transition: opacity 0.4s ease;
}
.project-grid-item:hover .project-grid-overlay,
.project-grid-item:hover .project-grid-overlay::after {
    opacity: 0;
}
.project-grid-item:hover img {
    transform: scale(1.05);
}
`;
if (!cssContent.includes('.project-grid-item')) {
    fs.writeFileSync(cssPath, cssContent + newCss);
}

// 2. Generate Image Array (20 down to 1)
const newLogos = [];
for (let i = 20; i >= 1; i--) {
    newLogos.push(`public/img/progetto-${i}.jpg`);
}

// 3. Update DB
db.serialize(() => {
    db.all("SELECT id, content FROM blocks WHERE type = 'partnersGrid'", (err, rows) => {
        if (rows) {
            let pending = rows.length;
            rows.forEach(row => {
                let content = JSON.parse(row.content);
                content.logos = newLogos;
                db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                    pending--;
                    if (pending === 0) {
                        console.log("DB Updated");
                    }
                });
            });
        } else {
            console.log("No partnersGrid rows found.");
        }
    });
});
