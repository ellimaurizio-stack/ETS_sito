const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    ['chi-siamo', 'sostienici'].forEach(slug => {
        db.get("SELECT content, id FROM blocks WHERE page_slug = ? AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", [slug], (err, row) => {
            if (row) {
                let content = JSON.parse(row.content);
                
                // Align text to flex-start and push it down by 5rem to align with the line
                content.html = content.html.replace('align-items: flex-end;', 'align-items: flex-start; margin-top: 5.2rem;');
                
                // Increase the text block width from 450px to 800px
                content.html = content.html.replace('max-width: 450px;', 'max-width: 850px;');

                db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                    console.log(`Updated hero text for ${slug}`);
                });
            }
        });
    });
});
