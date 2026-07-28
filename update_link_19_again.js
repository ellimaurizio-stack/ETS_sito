const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT id, content FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            // Update the link for progetto-19
            html = html.replace(
                /<a href="progetto-19\.html" class="project-grid-item">([\s\S]*?)<\/a>/,
                '<a href="progetto-bullone.html" class="project-grid-item">$1</a>'
            );

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log("Updated progetti page HTML to link progetto-19 to bullone.");
            });
        }
    });
});
