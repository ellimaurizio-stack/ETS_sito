const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    // Update the A-Tono ETS block (Block 1)
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'home' AND type = 'textSplit' AND order_index = 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            content.text_right = content.text_right.replace(
                "connettere bisogni sociali reali con soluzioni già attive e radicate",
                "<strong style=\"color: var(--color-light-blue); font-weight: 700;\">connettere bisogni sociali reali con soluzioni già attive e radicate</strong>"
            ).replace(
                "persone, esperienze e know-how al servizio della comunità",
                "<strong style=\"color: var(--color-light-blue); font-weight: 700;\">persone, esperienze e know-how al servizio della comunità</strong>"
            );
            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id]);
        }
    });

    // Update the DONAZIONE block (Block 3 - actually order 3 or 4)
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'home' AND type = 'textSplit' AND json_extract(content, '$.title_bottom') = 'DONAZIONE'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            content.text_right = content.text_right.replace(
                "<strong>IBAN: [INSERIRE IBAN]</strong>",
                "<strong style=\"color: var(--color-light-blue); font-weight: 700;\">IBAN: [INSERIRE IBAN]</strong>"
            );
            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id]);
        }
    });
});
