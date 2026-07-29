const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');
const projectsMetadata = require('./projects.json');

const headerHtml = `<header style="width: 100%; position: relative;">
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
`;

function generateCard(num) {
    let data = projectsMetadata[num] || { nome: '', sottotitolo: '', titolo: '', testo: '', clickable: false };
    
    let styleClass = 'hover-style-c';

    let tag = data.clickable ? 'a' : 'div';
    let href = data.clickable ? `href="progetto-${num}.html"` : '';
    
    let popupHtml = `
        <div class="project-preview-popup">
            <div class="popup-content">
                <h4 class="popup-subtitle">${data.sottotitolo}</h4>
                <h3 class="popup-title">${data.titolo}</h3>
                <div class="popup-line"></div>
                <p class="popup-text">${data.testo}</p>
                ${data.clickable ? '<span class="popup-cta">Scopri di più sul progetto &rarr;</span>' : ''}
            </div>
        </div>
    `;

    return `
    <${tag} ${href} class="project-grid-item ${styleClass}">
        <img src="img/progetto-${num}.jpg" alt="${data.nome || 'Progetto'}">
        <div class="project-grid-overlay"></div>
        ${popupHtml}
    </${tag}>
    `;
}

db.serialize(() => {
    db.get("SELECT id, content FROM blocks WHERE page_slug = 'progetti' AND type = 'htmlRaw'", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            let gridHtml = '<div class="progetti-grid-3" style="max-width: 100%; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0;">';
            for (let i = 20; i >= 1; i--) {
                gridHtml += generateCard(i);
            }
            gridHtml += '</div></main>';

            content.html = headerHtml + gridHtml;
            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log("Restored header and updated progetti page HTML in DB.");
            });
        }
    });
});
