const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            // Remove the old gallery and button
            const regexToRemove = /<!-- Galleria Progetti Dinamica \(caricata dal CMS\) -->[\s\S]*?<a href="#" class="btn">SCOPRI LE ALTRE INIZIATIVE<\/a>\s*<\/div>/;
            
            let gridHtml = `
        <div class="partners-grid" style="margin-bottom: 6rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem;">
`;
            for (let i = 20; i >= 1; i--) {
                // Link will point to the slug format we discussed, though right now only 'bullone' exists.
                // It's a placeholder link until the pages are generated.
                let slug = 'bullone'; // or we could use `progetto-${i}`
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
                console.log("Updated progetti page gallery.");
            });
        }
    });
});
