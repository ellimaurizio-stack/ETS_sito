const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw' ORDER BY order_index ASC LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            const blueBold = '<strong style="color: var(--color-light-blue); font-weight: 700;">$1</strong>';
            
            html = html.replace(/(gioia)/g, blueBold);
            html = html.replace(/(Fai del bene e scordatelo)/g, blueBold);

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated progetti bold text`);
            });
        }
    });
});
