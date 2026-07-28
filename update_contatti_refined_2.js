const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'contatti' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // 1. Lower the TEL/EMAIL block
            content.html = content.html.replace(
                /margin-top: 9rem; gap: 0\.8rem;/g,
                'margin-top: 11rem; gap: 0.8rem;'
            );

            // 2. Fix the select wrapper and select element to center the arrow
            // First, move the margin-bottom from the select to its wrapper
            content.html = content.html.replace(
                /<div style="position: relative; max-width: 400px;">/g,
                '<div style="position: relative; max-width: 400px; margin-bottom: 2rem;">'
            );
            
            // Then remove the margin-bottom from the select itself
            content.html = content.html.replace(
                /width: 100%; outline: none; margin-bottom: 2rem;"/g,
                'width: 100%; outline: none;"'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated contatti blocks refined layout 2`);
            });
        }
    });
});
