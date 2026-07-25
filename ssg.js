const fs = require('fs');
const path = require('path');
const db = require('./database');

// Wrapper HTML
function wrapHtml(title, mainContent, activeSlug) {
    const head = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>A-Tono ETS - ${title}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav>
        <div class="logo">
            <img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 40px;">
        </div>
        <div class="menu-toggle">&#9776;</div>
        <ul class="nav-links">
            <li><a href="index.html">HOME</a></li>
            <li><a href="chi-siamo.html">CHI SIAMO</a></li>
            <li><a href="progetti.html">PROGETTI</a></li>
            <li><a href="sostienici.html">SOSTIENICI</a></li>
            <li><a href="contatti.html">CONTATTI</a></li>
        </ul>
    </nav>
    <main>`;

    const footer = `
    </main>
    <footer>
        <div class="footer-content">
            <div class="footer-title">
                <p>Hai bisogno di aiuto?</p>
                <h3>Contattaci</h3>
            </div>
            <div class="footer-col">
                <h4>Seguici su:</h4>
                <p><img src="img/facebook.png" alt="Facebook" style="height: 24px; margin-right: 10px;"> <img src="img/In.png" alt="LinkedIn" style="height: 24px;"></p>
            </div>
            <div class="footer-col">
                <h4>MILANO</h4>
                <p>Corso Buenos Aires, 77<br>20124 (MI)</p>
            </div>
            <div class="footer-col">
                <h4>A-Tono E.T.S.</h4>
                <p>ets.a-tono.com<br>Ente del terzo settore</p>
            </div>
            <div class="footer-col">
                <h4>Codice Fiscale</h4>
                <p>97737800157</p>
            </div>
            <div class="footer-logo">
                <img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 50px;">
            </div>
        </div>
        <div class="footer-bottom">
            A-Tono E.T.S. - Ente del terzo settore - Codice Fiscale 97737800157
        </div>
    </footer>
    <script src="js/main.js"></script>
</body>
</html>`;

    return head + mainContent + footer;
}

// Generatori dei Blocchi
const blockGenerators = {
    hero: (content) => `
    <header class="hero" style="min-height: 80vh; padding: 2rem 5% 5rem 5%; justify-content: flex-end; align-items: center; position: relative;">
        <div style="width: 100%; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; text-align: left;">
            <div style="font-size: 8rem; font-style: italic; font-weight: 300; line-height: 1; letter-spacing: -2px;">
                <div style="padding-right: 15rem; opacity: 0.9;">${content.title_top} <span style="font-weight: 100;">${content.title_top_span}</span></div>
                <div style="padding-left: 5rem; opacity: 0.9;">${content.title_bottom} <span style="font-weight: 100;">${content.title_bottom_span}</span></div>
            </div>
            <div style="display: flex; align-items: center; gap: 4rem; margin-top: 6rem; width: 100%; max-width: 900px;">
                <div style="flex: 1; height: 2px; background: white; opacity: 0.8;"></div>
                <div style="flex: 1; text-align: left; font-size: 1.1rem; font-weight: 300; line-height: 1.6;">
                    ${content.description}
                </div>
            </div>
        </div>
    </header>`,

    textSplit: (content) => `
    <section class="flex-section text-left" style="margin-top: 5rem; max-width: 1200px; padding: 5rem 5%; margin-left: auto; margin-right: auto;">
        <div style="flex: 1;">
            <div class="section-header" style="margin-bottom: 0;">
                <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var(--color-text);">${content.title_top}</h2>
                <h2 style="font-weight: 700; font-size: 4.5rem; letter-spacing: 40px; color: var(--color-light-blue); margin-top: -10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;">${content.title_bottom}</h2>
            </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 2rem; padding-bottom: 10px;">
            <p style="font-size: 1.1rem; line-height: 1.8; margin: 0; color: var(--color-text);">
                ${content.text_right}
            </p>
            ${content.button_text ? `<a href="${content.button_link}" class="btn" style="margin: 0; padding: 15px 40px;">${content.button_text}</a>` : ''}
        </div>
    </section>`,

    imageText: (content) => `
    <section class="flex-section text-left" style="margin-top: 2rem; max-width: 1200px; padding: 5rem 5%; margin-left: auto; margin-right: auto; ${content.reverse ? 'flex-direction: row-reverse;' : ''}">
        <div style="flex: 1;">
            ${content.image_url ? `<img src="${content.image_url}" style="width: 100%; border-radius: 8px;">` : ''}
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 2rem;">
            ${content.title ? `<h2>${content.title}</h2>` : ''}
            <p style="font-size: 1.1rem; line-height: 1.8; margin: 0; color: var(--color-text);">
                ${content.text}
            </p>
        </div>
    </section>`,

    partnersGrid: (content) => `
    <section class="bg-gradient-blue text-left" style="max-width: 100%; padding: 6rem 10% 6rem 10%;">
        <div class="flex-section">
            <div style="flex: 1;">
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white;">${content.title_top}</h2>
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white; border-bottom: 2px solid white; padding-bottom: 10px; display: inline-block;">${content.title_bottom}</h2>
                </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; padding-bottom: 10px;">
                <p style="margin: 0; font-weight: 300; font-size: 1.1rem; line-height: 1.6; max-width: 450px;">
                    ${content.description}
                </p>
            </div>
        </div>
        
        <div class="text-center" style="margin-top: 4rem; width: 100%;">
            <div class="partners-grid" style="margin-bottom: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%;">
                <!-- Placeholder grid for now, would be dynamically built -->
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
                <img src="img/progetto-1.png" style="width: 100%;"><img src="img/progetto-2.png" style="width: 100%;">
            </div>
            ${content.button_text ? `<a href="${content.button_link}" class="btn" style="padding: 15px 40px; background-color: var(--color-light-blue);">${content.button_text}</a>` : ''}
        </div>
    </section>`,

    htmlRaw: (content) => `${content.html}`
};

async function generatePage(slugOrId, isProject = false) {
    return new Promise((resolve, reject) => {
        const query = isProject ? `SELECT project_name as title FROM projects WHERE id = ?` : `SELECT title FROM pages WHERE slug = ?`;
        const blocksQuery = isProject ? `SELECT * FROM blocks WHERE project_id = ? ORDER BY order_index ASC` : `SELECT * FROM blocks WHERE page_slug = ? ORDER BY order_index ASC`;
        
        db.get(query, [slugOrId], (err, page) => {
            if (err || !page) return reject(err || 'Entity not found');

            db.all(blocksQuery, [slugOrId], (err, blocks) => {
                if (err) return reject(err);

                let htmlContent = '';
                for (const block of blocks) {
                    let parsedContent = {};
                    try { parsedContent = JSON.parse(block.content); } catch (e) {}
                    
                    if (blockGenerators[block.type]) {
                        htmlContent += blockGenerators[block.type](parsedContent);
                    } else if (block.type === 'htmlRaw') {
                        htmlContent += blockGenerators.htmlRaw(parsedContent);
                    }
                }

                const finalHtml = wrapHtml(page.title, htmlContent, slugOrId);
                const filename = isProject ? `progetto-${slugOrId}.html` : (slugOrId === 'home' ? 'index.html' : `${slugOrId}.html`);
                const filepath = path.join(__dirname, 'public', filename);
                
                fs.writeFile(filepath, finalHtml, (err) => {
                    if (err) return reject(err);
                    console.log(`[SSG] Generato: ${filename}`);
                    resolve(filepath);
                });
            });
        });
    });
}

module.exports = { generatePage };
