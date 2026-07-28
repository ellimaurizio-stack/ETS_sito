const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'sostienici' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            const logosHtml = `
            <div class="partners-grid" style="margin-bottom: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%;">
                <img src="img/progetto-1.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-2.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-1.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-2.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-1.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-2.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-1.png" style="width: 100%; max-height: 100px; object-fit: contain;">
                <img src="img/progetto-2.png" style="width: 100%; max-height: 100px; object-fit: contain;">
            </div>`;

            // Insert logosHtml right before the button
            content.html = content.html.replace(
                /<a href="progetti.html" class="btn" style="background-color: var\(--color-light-blue\); color: white;">SCOPRI I PROGETTI<\/a>/,
                logosHtml + '\n            <a href="progetti.html" class="btn" style="background-color: var(--color-light-blue); color: white;">SCOPRI I PROGETTI</a>'
            );
            
            // Adjust margin of the paragraph before it
            content.html = content.html.replace(
                /<p style="margin-bottom: 2rem; color: white;">Unirsi a noi significa/g,
                '<p style="margin-bottom: 4rem; color: white;">Unirsi a noi significa'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Added logos to sostienici final block`);
            });
        }
    });
});
