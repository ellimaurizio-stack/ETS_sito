const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw' ORDER BY order_index ASC LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            const oldSection = `<section style="background: white; padding: 2rem 5% 4rem 5%; max-width: 1400px; margin: 0 auto; color: var(--color-dark-blue);">
            <h2 style="margin: 0; line-height: 1.1; margin-bottom: 10px; font-weight: 300; font-size: 2.5rem;">I nostri</h2>
            <div style="display: flex; align-items: flex-start;">
                <div style="font-size: 6rem; font-weight: 300; letter-spacing: 25px; border-bottom: 2px solid var(--color-light-blue); padding-bottom: 5px; line-height: 1; flex-shrink: 0;">PROG</div>
                <div style="display: flex; flex-direction: column;">
                    <div style="font-size: 6rem; font-weight: 300; letter-spacing: 25px; line-height: 1; padding-bottom: 7px;">ETTI</div>
                    <div style="font-size: 1.1rem; line-height: 1.8; max-width: 700px; margin-top: 2rem;">
                        <p style="margin: 0; font-weight: 300;">Fino a oggi, abbiamo incontrato persone fantastiche con le quali abbiamo sviluppato bei progetti, ricchi di emozione e <strong style="color: var(--color-light-blue); font-weight: 700;">gioia</strong> nel farli. Abbiamo toccato il tema dell'integrazione, del primo soccorso pediatrico, dei bimbi dal "cuore matto" per passare alla prevenzione. Ma non finisce qui! Ancora tanto vogliamo fare perché come recita un vecchio detto popolare siciliano: "<strong style="color: var(--color-light-blue); font-weight: 700;">Fai del bene e scordatelo</strong>".</p>
                    </div>
                </div>
            </div>
        </section>`;

            const newSection = `<section class="flex-section text-left" style="background: white; margin-top: 5rem; max-width: 1500px; margin-left: auto; margin-right: auto; padding: 0 5% 6rem 5%; color: var(--color-dark-blue);">
            <div style="flex: 1;">
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var(--color-text);">I nostri</h2>
                    <h2 style="font-weight: 700; font-size: 4.5rem; letter-spacing: 30px; color: var(--color-light-blue); margin-top: 10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">PROGETTI</h2>
                </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; margin-top: 9rem; font-size: 1.1rem; padding-bottom: 10px; color: var(--color-text);">
                <p style="margin: 0; font-weight: 300; line-height: 1.8; max-width: 700px;">Fino a oggi, abbiamo incontrato persone fantastiche con le quali abbiamo sviluppato bei progetti, ricchi di emozione e <strong style="color: var(--color-light-blue); font-weight: 700;">gioia</strong> nel farli. Abbiamo toccato il tema dell'integrazione, del primo soccorso pediatrico, dei bimbi dal "cuore matto" per passare alla prevenzione. Ma non finisce qui! Ancora tanto vogliamo fare perché come recita un vecchio detto popolare siciliano: "<strong style="color: var(--color-light-blue); font-weight: 700;">Fai del bene e scordatelo</strong>".</p>
            </div>
        </section>`;

            // Since the exact text might have different whitespace, I'll use regex if string replace fails, 
            // but string replace on the exact substring should work if I didn't change anything else.
            // Let's do regex for the whole section just to be safe.
            html = html.replace(/<section style="background: white; padding: 2rem 5% 4rem 5%; max-width: 1400px; margin: 0 auto; color: var\(--color-dark-blue\);">[\s\S]*?<\/section>/m, newSection);

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated progetti block layout`);
            });
        }
    });
});
