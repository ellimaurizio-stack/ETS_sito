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

    textSplit: (content) => {
        const isBlue = content.theme === 'blue';
        const isStacked = content.layout === 'stacked';
        
        const sectionClass = isBlue ? "flex-section text-left bg-gradient-blue" : "flex-section text-left";
        const titleTopStyle = isBlue ? "font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white;" : "font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var(--color-text);";
        const titleBottomStyle = isBlue 
            ? "font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white; border-bottom: 2px solid white; padding-bottom: 10px; display: inline-block; margin-top: -10px;"
            : "font-weight: 700; font-size: 4.5rem; letter-spacing: 40px; color: var(--color-light-blue); margin-top: -10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block;";
        const textStyle = isBlue ? "font-size: 1.1rem; line-height: 1.8; margin: 0; color: white; " + (isStacked ? "max-width: 100%;" : "max-width: 450px;") : "font-size: 1.1rem; line-height: 1.8; margin: 0; color: var(--color-text);";
        const btnStyle = isBlue ? "margin: 0; padding: 15px 40px; background-color: var(--color-light-blue);" : "margin: 0; padding: 15px 40px;";
        
        const containerStyle = isStacked 
            ? "flex: 1; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; width: 100%; gap: 2rem;" 
            : "flex: 1; max-width: 1200px; margin: 0 auto; display: flex; width: 100%;";
            
        const textContainerStyle = isStacked
            ? "display: flex; flex-direction: column; align-items: flex-start; gap: 2rem; padding-bottom: 10px; align-self: flex-end; width: 65%;"
            : "flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; gap: 2rem; padding-bottom: 10px;";
            
        const titleContainerStyle = isStacked ? "" : "flex: 1;";
        
        return `
    <section class="${sectionClass.replace('flex-section', '')}" style="max-width: 100%; padding: 6rem 10%; display: flex;">
        <div style="${containerStyle}">
            <div style="${titleContainerStyle}">
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="${titleTopStyle}">${content.title_top}</h2>
                    <h2 style="${titleBottomStyle}">${content.title_bottom}</h2>
                </div>
            </div>
            <div style="${textContainerStyle}">
                <p style="${textStyle}">
                    ${content.text_right}
                </p>
                ${content.button_text ? `<a href="${content.button_link}" class="btn" style="${btnStyle}">${content.button_text}</a>` : ''}
            </div>
        </div>
    </section>`;
    },

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
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; width: 100%; gap: 2rem;">
            <div>
                <div class="section-header" style="margin-bottom: 0;">
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white;">${content.title_top}</h2>
                    <h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: white; border-bottom: 2px solid white; padding-bottom: 10px; display: inline-block;">${content.title_bottom}</h2>
                </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-start; padding-bottom: 10px; align-self: flex-end; width: 65%;">
                <p style="margin: 0; font-weight: 300; font-size: 1.1rem; line-height: 1.6; max-width: 100%; color: white;">
                    ${content.description}
                </p>
            </div>
        </div>
        
        <div class="text-center" style="margin-top: 4rem; width: 100%;">
            <div class="partners-grid" style="margin-bottom: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%;">
                ${(content.logos || []).map(logo => `<img src="${logo.replace('public/', '')}" style="width: 100%; max-height: 100px; object-fit: contain;">`).join('')}
            </div>
            ${content.button_text ? `<a href="${content.button_link}" class="btn" style="padding: 15px 40px; background-color: var(--color-light-blue);">${content.button_text}</a>` : ''}
        </div>
    </section>`,

    htmlRaw: (content) => `${content.html}`,

    projectHeroDoubleLogo: (content) => `
    <header class="hero" style="min-height: 70vh; padding: 2rem 5%; justify-content: center; align-items: center; position: relative; background-image: url('${(content.bg_image || '').replace('public/', '')}'); background-size: cover; background-position: center;">
        <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: rgba(0, 102, 179, 0.75);"></div>
        <div style="position: relative; z-index: 1; width: 100%; max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
            ${content.logo_left ? `<img src="${content.logo_left.replace('public/', '')}" style="max-height: 150px; max-width: 45%;">` : ''}
            ${content.logo_right ? `<img src="${content.logo_right.replace('public/', '')}" style="max-height: 150px; max-width: 45%;">` : ''}
        </div>
    </header>`,

    projectIntro: (content) => `
    <section class="flex-section text-left" style="margin-top: 4rem; max-width: 1200px; padding: 4rem 5%; margin-left: auto; margin-right: auto; align-items: flex-start;">
        <div style="flex: 1; border-bottom: 1px solid #000; padding-bottom: 2rem; margin-right: 2rem;">
            <h2 style="font-weight: 300; font-size: 3rem; letter-spacing: 1px; color: var(--color-text); margin-bottom: 0;">${content.title_thin}</h2>
            <h2 style="font-weight: 700; font-size: 3.5rem; letter-spacing: 15px; color: var(--color-light-blue); margin-top: -10px;">${content.title_bold}</h2>
        </div>
        <div style="flex: 1; font-size: 1.1rem; line-height: 1.8; color: var(--color-text); padding-top: 1rem;">
            ${(content.description || '').replace(/\n/g, '<br>')}
        </div>
    </section>`,

    imageGallery3: (content) => {
        let alignStyle = "justify-content:center; max-width:1200px; margin: 3rem auto; padding: 0 5%;";
        if (content.align === 'left') alignStyle = "justify-content:flex-start; max-width:1000px; margin: 3rem auto 3rem 0; padding: 0 5% 0 0;";
        if (content.align === 'right') alignStyle = "justify-content:flex-end; max-width:1000px; margin: 3rem 0 3rem auto; padding: 0 0 0 5%;";
        
        return `
    <section style="display:flex; gap:10px; ${alignStyle}">
        ${(content.images || []).slice(0, 3).map(img => `<img src="${img.replace('public/', '')}" style="width: calc(33.333% - 7px); object-fit: cover; aspect-ratio: 4/5;">`).join('')}
    </section>`;
    },

    textBlock: (content) => `
    <div style="max-width: 1200px; margin: 0 auto 2.5rem auto; padding: 0 5%;">
        <h3 style="color: var(--color-light-blue); font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem; line-height: 1.4;">${content.title}</h3>
        <p style="margin: 0; font-size: 1.05rem; line-height: 1.7; font-weight: 300; color: var(--color-text);">
            ${(content.text || '').replace(/\n/g, '<br>')}
        </p>
    </div>`
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

                let finalHtmlContent = htmlContent;
                if (isProject) {
                    finalHtmlContent += `
                    <div class="text-center" style="margin: 4rem 0 6rem 0;">
                        <a href="progetti.html" class="btn" style="padding: 12px 30px; font-weight: 600; letter-spacing: 1px; color: white; background-color: var(--color-light-blue);">TORNA AI PROGETTI</a>
                    </div>`;
                }

                const finalHtml = wrapHtml(page.title, finalHtmlContent, slugOrId);
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
