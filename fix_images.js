const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

// 1. Index.html
let indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace(
    /<img src="https:\/\/via\.placeholder\.com[^>]+>/g,
    () => `<img src="img/logo-onlus-1.png" alt="Partner 1">\n            <img src="img/logo-onlus-2.png" alt="Partner 2">`
);
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

// 2. Chi Siamo
let chiSiamoHtml = fs.readFileSync(path.join(publicDir, 'chi-siamo.html'), 'utf8');
chiSiamoHtml = chiSiamoHtml.replace(
    /<header class="hero" style="/,
    `<header class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('img/chisiamo-hero.jpg') center/cover; `
);
fs.writeFileSync(path.join(publicDir, 'chi-siamo.html'), chiSiamoHtml);

// 3. Progetti
let progettiHtml = fs.readFileSync(path.join(publicDir, 'progetti.html'), 'utf8');
progettiHtml = progettiHtml.replace(
    /<header class="hero" style="/,
    `<header class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('img/progetti-hero.jpg') center/cover; `
);
fs.writeFileSync(path.join(publicDir, 'progetti.html'), progettiHtml);

// 4. Sostienici
let sostieniciHtml = fs.readFileSync(path.join(publicDir, 'sostienici.html'), 'utf8');
sostieniciHtml = sostieniciHtml.replace(
    /<header class="hero" style="/,
    `<header class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('img/sostienici-hero.jpg') center/cover; `
);
sostieniciHtml = sostieniciHtml.replace(
    /<div style="width: 100%; max-width: 600px; height: 200px; background: #f9f9f9; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center;">Facsimile Modulo Fiscale<\/div>/,
    `<img src="img/sostienici-blocco1.png" style="width:100%; max-width:600px; object-fit:contain;" alt="Modulo Fiscale">`
);
fs.writeFileSync(path.join(publicDir, 'sostienici.html'), sostieniciHtml);

// 5. Contatti
let contattiHtml = fs.readFileSync(path.join(publicDir, 'contatti.html'), 'utf8');
contattiHtml = contattiHtml.replace(
    /<header class="hero" style="/,
    `<header class="hero" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('img/contatti-hero.jpg') center/cover; `
);
fs.writeFileSync(path.join(publicDir, 'contatti.html'), contattiHtml);

console.log("Immagini pubblicate correttamente!");
