const fs = require('fs');
const path = require('path');

const data = require('./parsed_modello_progetti.json');

// We will use public/progetto-19.html as the layout template
const templatePath = path.join(__dirname, 'public', 'progetto-19.html');
const templateHtml = fs.readFileSync(templatePath, 'utf8');

const mainStart = templateHtml.indexOf('<main>');
const mainEnd = templateHtml.indexOf('</main>') + 7;

let head = templateHtml.substring(0, mainStart);
head = head.replace(/<header class="project-hero"[\s\S]*?<\/header>/, '');

const tail = templateHtml.substring(mainEnd);

const projectToNum = {
    "Partizan": 20,
    "Bullone": 19,
    "MUDEC": 18,
    "Cabina Rosa": 17,
    "Restart Romagna": 16,
    "Kayros": 13,
    "Un Cuore Un Mondo": 9
};

function formatText(text) {
    if (!text) return '';
    return text.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
}

data.forEach((row, index) => {
    let num = projectToNum[row.Nome_Progetto] || (20 - index);
    
    let images = (row.Immagini_Galleria || '').split(/[,; ]+/).filter(Boolean);
    
    let blocks = [];
    if (row.Titolo_Blocco_Testo_1 || row.Testo_Blocco_1) {
        blocks.push({ t: row.Titolo_Blocco_Testo_1, c: row.Testo_Blocco_1 });
    }
    if (row.Titolo_Blocco_Testo_2 || row.Testo_Blocco_2) {
        blocks.push({ t: row.Titolo_Blocco_Testo_2, c: row.Testo_Blocco_2 });
    }
    if (row.Titolo_Blocco_Testo_2_1 || row.Testo_Blocco_2_1) {
        blocks.push({ t: row.Titolo_Blocco_Testo_2_1, c: row.Testo_Blocco_2_1 });
    }
    if (row.Titolo_Blocco_Testo_3 || row.Testo_Blocco_3) {
        blocks.push({ t: row.Titolo_Blocco_Testo_3, c: row.Testo_Blocco_3 });
    }

    let interleavedHtml = '';
    let maxLen = Math.max(blocks.length, images.length);
    
    for (let i = 0; i < maxLen; i++) {
        if (i < blocks.length) {
            interleavedHtml += `
            <div style="margin-bottom: 3rem; margin-top: 2rem;">
                ${blocks[i].t ? `<h3 style="color: var(--color-light-blue); font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">${blocks[i].t}</h3>` : ''}
                ${blocks[i].c ? `<p style="color: var(--color-text); font-size: 1.1rem; line-height: 1.8;">${formatText(blocks[i].c)}</p>` : ''}
            </div>
            `;
        }
        if (i < images.length) {
            interleavedHtml += `
            </section>
            <div style="margin-bottom: 6rem; margin-top: 6rem; width: 100%; display: flex; justify-content: ${i % 2 === 0 ? 'flex-end' : 'flex-start'};">
                <img src="img/${images[i]}" alt="Galleria" style="width: 90%; max-width: 1600px; height: auto; display: block; ${i % 2 === 0 ? 'border-radius: 8px 0 0 8px;' : 'border-radius: 0 8px 8px 0;'}">
            </div>
            <section style="max-width: 1200px; margin: 0 auto; padding: 0 5%; color: var(--color-text);">
            `;
        }
    }

    let mainHtml = `
    <main>
        <header style="width: 100%; position: relative;">
            <img src="img/${row.Immagine_Header || 'progetti-hero.jpg'}" alt="${row.Nome_Progetto}" style="width: 100%; height: auto; display: block;">
        </header>

        <section class="flex-section text-left" style="background: white; margin-top: 4rem; max-width: 1500px; margin-left: auto; margin-right: auto; padding: 0 5% 8rem 5%; color: var(--color-dark-blue); align-items: flex-start;">
            <div style="flex: 1; padding-right: 2rem;">
                <div class="section-header" style="margin-bottom: 0;">
                    ${row.Titolo_Sottile_Intro ? `<h2 style="font-weight: 300; font-size: 2.5rem; letter-spacing: 1px; color: var(--color-text); margin:0;">${row.Titolo_Sottile_Intro}</h2>` : ''}
                    <h2 style="font-weight: 700; font-size: 4rem; letter-spacing: 2px; color: var(--color-light-blue); margin-top: 10px; border-bottom: 2px solid var(--color-text); padding-bottom: 10px; display: inline-block; margin-bottom: 0;">${row.Titolo_Grassetto_Intro || ''}</h2>
                </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start; font-size: 1.1rem; color: var(--color-text); margin-top: 8rem;">
                <p style="margin: 0 0 10px 0; font-weight: 300; line-height: 1.8; max-width: 700px;">
                    ${formatText(row.Testo_Intro_Affianco_Al_Titolo)}
                </p>
            </div>
        </section>

        <section style="max-width: 1200px; margin: 0 auto; padding: 0 5%;">
            ${interleavedHtml}
            <div style="text-align: center; margin: 6rem 0 8rem 0;">
                <a href="progetti.html" class="btn-primary" style="background-color: var(--color-light-blue); color: white; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 1.2rem; border-radius: 30px; text-transform: uppercase;">Torna ai progetti</a>
            </div>
        </section>
    </main>
    `;

    let finalHtml = head + mainHtml + tail;
    // Fix active nav if any
    finalHtml = finalHtml.replace(/<title>.*?<\/title>/, `<title>${row.Nome_Progetto} | A-Tono ETS</title>`);
    
    fs.writeFileSync(path.join(__dirname, 'public', `progetto-${num}.html`), finalHtml);
    console.log(`Generated progetto-${num}.html for ${row.Nome_Progetto}`);
});
