const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    ['chi-siamo', 'sostienici'].forEach(slug => {
        db.get("SELECT content, id FROM blocks WHERE page_slug = ? AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", [slug], (err, row) => {
            if (row) {
                let content = JSON.parse(row.content);
                
                // Fix the left padding to 0 and right padding to 5% (or 0)
                // We use regex to match variations of padding
                content.html = content.html.replace(/padding:\s*0\s+(?:5%|0)\s+4rem\s+5%;\s*margin-top:\s*-10rem;/g, 'padding: 0 5% 4rem 0; margin-top: -10rem;');
                
                // Increase the max-width of the image
                content.html = content.html.replace(/max-width:\s*1200px;/g, 'max-width: 1500px;');
                content.html = content.html.replace(/max-width:\s*1400px;/g, 'max-width: 1500px;');

                db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                    console.log(`Updated ${slug}`);
                });
            }
        });
    });
});
