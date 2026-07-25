const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

const homeBlocks = [
    {
        page_slug: 'home', type: 'hero', order_index: 0,
        content: JSON.stringify({
            title_top: "Your", title_top_span: "hand",
            title_bottom: "in my", title_bottom_span: "hand",
            description: "L'associazione <strong>A-Tono ETS</strong> supporta e promuove<br>progetti legati al mondo sanitario, scientifico e sociale."
        })
    },
    {
        page_slug: 'home', type: 'textSplit', order_index: 1,
        content: JSON.stringify({
            title_top: "A-Tono", title_bottom: "ETS",
            text_right: "A-Tono ETS nasce per connettere bisogni sociali reali con soluzioni già attive e radicate nei territori, offrendo visione strategica, competenze professionali e supporto operativo alle realtà che generano cambiamento. Siamo il lato sociale e solidale del gruppo A-Tono: mettiamo persone, esperienze e know-how al servizio della comunità, rafforzando progetti esistenti attraverso reti, sinergie e sostenibilità.",
            button_text: "SCOPRI CHI SIAMO", button_link: "chi-siamo.html"
        })
    },
    {
        page_slug: 'home', type: 'partnersGrid', order_index: 2,
        content: JSON.stringify({
            title_top: "Le realtà che abbiamo", title_bottom: "aiutato in questi anni",
            description: "Fino a oggi, abbiamo incontrato persone fantastiche con le quali abbiamo sviluppato bei progetti, <strong>ricchi di emozione e gioia nel farli.</strong>",
            button_text: "SCOPRILE TUTTE", button_link: "progetti.html"
        })
    },
    {
        page_slug: 'home', type: 'htmlRaw', order_index: 3,
        content: JSON.stringify({
            html: `
        <section class="flex-section text-left" style="max-width: 1200px; padding: 6rem 5%; margin: 0 auto;">
            <div style="flex: 1;">
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var(--color-text);">Sostienici con una</h2>
                    <h2 style="font-weight: 700; font-size: 3.5rem; letter-spacing: 25px; color: var(--color-light-blue); margin-top: -10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">DONAZIONE</h2>
                </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 1rem; padding-bottom: 10px; font-size: 1.1rem; line-height: 1.8; color: var(--color-text);">
                <p style="margin: 0;">Anche il tuo contributo può fare la differenza. Se desideri sostenere i nostri progetti e iniziative puoi effettuare una donazione tramite bonifico bancario.</p>
                <p style="margin: 0.5rem 0; color: var(--color-light-blue); font-weight: 700;">IBAN: [INSERIRE IBAN]</p>
                <p style="margin: 0;">Ogni donazione, grande o piccola, ci aiuta a sviluppare nuovi progetti di valore. <strong>Grazie per il tuo sostegno</strong> e per scegliere di essere parte del cambiamento.</p>
            </div>
        </section>`
        })
    },
    {
        page_slug: 'home', type: 'htmlRaw', order_index: 4,
        content: JSON.stringify({
            html: `
        <section class="bg-gradient-blue text-left" style="max-width: 100%; padding: 6rem 10%;">
            <div class="flex-section">
                <div style="flex: 1;">
                    <div class="section-header" style="margin-bottom: 0;">
                        <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white;">Puoi sostenerci</h2>
                        <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white; border-bottom: 2px solid white; padding-bottom: 10px; display: inline-block;">anche nel tuo 5x1000</h2>
                    </div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 1.5rem; padding-bottom: 10px;">
                    <p style="margin: 0; font-weight: 300; font-size: 1.1rem; line-height: 1.6; max-width: 450px;">Donare è semplice: basta inserire il nostro <strong>Codice Fiscale 97737800157</strong> nello spazio dedicato alle organizzazioni non profit nella tua dichiarazione dei redditi.</p>
                    <p style="margin: 0; font-weight: 300; font-size: 1.1rem; line-height: 1.6; max-width: 450px;">Un piccolo gesto può lasciare una grande impronta.</p>
                </div>
            </div>
            
            <div class="text-center" style="margin-top: 4rem; width: 100%;">
                <a href="sostienici.html" class="btn" style="padding: 15px 40px; background-color: var(--color-light-blue);">SCOPRI I MODI IN CUI PUOI SOSTENERCI</a>
            </div>
        </section>`
        })
    }
];

db.serialize(() => {
    db.run(`DELETE FROM blocks WHERE page_slug = 'home'`);
    const stmt = db.prepare(`INSERT INTO blocks (page_slug, type, content, order_index) VALUES (?, ?, ?, ?)`);
    homeBlocks.forEach(b => stmt.run(b.page_slug, b.type, b.content, b.order_index));
    stmt.finalize();
    console.log('Blocchi Home inseriti.');
});
db.close();
