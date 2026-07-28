const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'contatti' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // 1. Hero text alignment and width
            content.html = content.html.replace(
                /align-items: flex-end;"/g,
                'align-items: flex-start; margin-top: 5.2rem;"'
            );
            content.html = content.html.replace(
                /<p style="margin: 0; max-width: 450px;">/g,
                '<p style="margin: 0; max-width: 850px;">'
            );

            // 2. Hero image padding and width
            content.html = content.html.replace(
                /padding: 0 0 4rem 5%;/g,
                'padding: 0 0 4rem 0;'
            );
            content.html = content.html.replace(
                /max-width: 1400px;/g,
                'max-width: 1500px;'
            );

            // 3. First block text alignment
            content.html = content.html.replace(
                /justify-content: flex-end; gap: 0.8rem;/g,
                'justify-content: flex-start; align-items: flex-start; margin-top: 5.2rem; gap: 0.8rem;'
            );

            // 4. Select dropdown arrow
            content.html = content.html.replace(
                /<div style="position: absolute; right: 20px; top: 50%; transform: translateY\(-50%\); pointer-events: none; color: var\(--color-dark-blue\); font-weight: bold; font-size: 0.8rem;">v<\/div>/g,
                '<div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); pointer-events: none; color: white; font-size: 1rem;">▼</div>'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated contatti blocks layout`);
            });
        }
    });
});
