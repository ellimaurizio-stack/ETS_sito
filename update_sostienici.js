const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'sostienici' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // 1. "Sostienici con una DONAZIONE" -> Add line
            content.html = content.html.replace(
                /<h2 style="font-weight: 700; font-size: 3.5rem; letter-spacing: 25px; color: var\(--color-light-blue\); margin-top: -10px;">DONAZIONE<\/h2>/,
                '<h2 style="font-weight: 700; font-size: 3.5rem; letter-spacing: 25px; color: var(--color-light-blue); margin-top: -10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">DONAZIONE</h2>'
            );
            
            // Push text down to match line (replace the padding-top: 1rem with flex setup)
            content.html = content.html.replace(
                /<div style="flex: 1; font-size: 1.1rem; line-height: 1.8; color: var\(--color-text\); padding-top: 1rem;">/g,
                '<div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; margin-top: 4.5rem; font-size: 1.1rem; line-height: 1.8; color: var(--color-text);">'
            );

            // 2. "Come donare il 5x1000" -> Add line
            content.html = content.html.replace(
                /<h2 style="font-weight: 700; font-size: 4rem; letter-spacing: 40px; color: var\(--color-light-blue\); margin-top: -10px;">5x1000<\/h2>/,
                '<h2 style="font-weight: 700; font-size: 4rem; letter-spacing: 40px; color: var(--color-light-blue); margin-top: -10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">5x1000</h2>'
            );

            // 3. Final block: Add bg-gradient-blue and style button
            content.html = content.html.replace(
                /<section class="text-center" style="max-width: 100%; padding: 5rem 10%;">/g,
                '<section class="bg-gradient-blue text-center" style="max-width: 100%; padding: 5rem 10%;">'
            );
            content.html = content.html.replace(
                /<a href="progetti.html" class="btn">SCOPRI I PROGETTI<\/a>/g,
                '<a href="progetti.html" class="btn" style="background-color: var(--color-light-blue); color: white;">SCOPRI I PROGETTI</a>'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated sostienici blocks layout`);
            });
        }
    });
});
