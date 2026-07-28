const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    let gridHtml = `
        <div class="projects-grid" style="margin-bottom: 0;">`;
    for (let i = 20; i >= 1; i--) {
        gridHtml += `
            <a href="progetto-${i}.html" class="project-grid-item">
                <img src="img/progetto-${i}.jpg" alt="Progetto ${i}">
                <div class="project-grid-overlay"></div>
            </a>`;
    }
    gridHtml += `
        </div>`;

    const cleanHtml = `<header style="width: 100%; position: relative;">
        <img src="img/progetti-hero.jpg" alt="I Nostri Progetti" style="width: 100%; height: auto; display: block;">
    </header>

    <main>

        <section class="flex-section text-left" style="background: white; margin-top: 5rem; max-width: 1500px; margin-left: auto; margin-right: auto; padding: 0 5% 6rem 5%; color: var(--color-dark-blue);">
            <div style="flex: 1;">
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var(--color-text);">I nostri</h2>
                    <h2 style="font-weight: 700; font-size: 4.5rem; letter-spacing: 30px; color: var(--color-light-blue); margin-top: 10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">PROGETTI</h2>
                </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; margin-top: 9rem; font-size: 1.1rem; padding-bottom: 10px; color: var(--color-text);">
                <p style="margin: 0; font-weight: 300; line-height: 1.8; max-width: 700px;">Fino a oggi, abbiamo incontrato persone fantastiche con le quali abbiamo sviluppato bei progetti, ricchi di emozione e <strong style="color: var(--color-light-blue); font-weight: 700;">gioia</strong> nel farli. Abbiamo toccato il tema dell'integrazione, del primo soccorso pediatrico, dei bimbi dal "cuore matto" per passare alla prevenzione. Ma non finisce qui! Ancora tanto vogliamo fare perché come recita un vecchio detto popolare siciliano: "<strong style="color: var(--color-light-blue); font-weight: 700;">Fai del bene e scordatelo</strong>".</p>
            </div>
        </section>
        ${gridHtml}
    </main>`;

    db.get("SELECT id, content FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            content.html = cleanHtml;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log("Cleaned and updated progetti page HTML.");
            });
        }
    });
});
