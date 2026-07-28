const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'contatti' AND type = 'htmlRaw' ORDER BY order_index ASC LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            const oldText = `<p style="margin: 0; max-width: 850px;">Siamo sempre <strong>in cerca di realtà con le quali collaborare</strong> per mettere gratuitamente a loro disposizione competenze, tempo e denaro per dar vita a progetti con finalità di solidarietà sociale a favore dei più svantaggiati.</p>`;
            
            const newText = `<p style="margin: 0; max-width: 850px;">Ogni contributo può fare la differenza.<br><br>Siamo sempre alla ricerca di persone, realtà e organizzazioni con cui condividere il nostro impegno a favore dei più svantaggiati.<br><br>Chiunque voglia sostenere i nostri progetti può farlo attraverso <strong>una donazione, il volontariato, una collaborazione o una nuova proposta di partnership</strong>.<br><br><strong>Contattaci per scoprire tutti i modi in cui puoi contribuire</strong> a dare vita a nuove iniziative di solidarietà sociale.</p>`;

            html = html.replace(oldText, newText);

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated contatti top text`);
            });
        }
    });
});
