const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'sostienici' AND type = 'htmlRaw' ORDER BY order_index ASC LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            // Remove the bold styling added to the N. sections
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(Dichiarazione dei Redditi)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(codice fiscale: 97737800157)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(730 è il 7 luglio 2023)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(UNICO)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(dal 2 Maggio al 30 Giugno)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(fino al 30 Settembre 2023 per via telematica)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(5x1000)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(non devi presentare)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(uffici postali)<\/strong>/g, '$1');
            html = html.replace(/<strong style="color: var\(--color-light-blue\); font-weight: 700;">(CAF)<\/strong>/g, '$1');

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Reverted sostienici N. section bold text`);
            });
        }
    });
});
