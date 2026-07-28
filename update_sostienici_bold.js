const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'sostienici' AND type = 'htmlRaw' ORDER BY order_index ASC LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            // 1. Top block (blue background) -> bold white
            html = html.replace(
                'in cerca di realtà con le quali collaborare',
                '<strong>in cerca di realtà con le quali collaborare</strong>'
            );

            // 2. Steps block (white background) -> bold light blue
            const blueBold = '<strong style="color: var(--color-light-blue); font-weight: 700;">$1</strong>';
            
            // N.1
            html = html.replace(/(Dichiarazione dei Redditi)/g, blueBold);
            html = html.replace(/(codice fiscale: 97737800157)/g, blueBold);
            
            // N.2
            html = html.replace(/(730 è il 7 luglio 2023)/g, blueBold);
            html = html.replace(/(UNICO)/g, blueBold);
            html = html.replace(/(dal 2 Maggio al 30 Giugno)/g, blueBold);
            html = html.replace(/(fino al 30 Settembre 2023 per via telematica)/g, blueBold);
            
            // N.3
            html = html.replace(/(5x1000)/g, blueBold);
            html = html.replace(/(non devi presentare)/g, blueBold);
            html = html.replace(/(uffici postali)/g, blueBold);
            html = html.replace(/(CAF)/g, blueBold);

            // 3. Chi fa del bene lascia un'impronta (blue background) -> bold white
            html = html.replace(
                "lasciare un'impronta",
                "<strong>lasciare un'impronta</strong>"
            );
            html = html.replace(
                "significativa e duratura",
                "<strong>significativa e duratura</strong>"
            );

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated sostienici bold text`);
            });
        }
    });
});
