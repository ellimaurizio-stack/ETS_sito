const fs = require('fs');
const path = require('path');

const logos = [
    "andos.png",
    "associazioneamici.png",
    "bullone.png",
    "comunitaoklahoma.png",
    "humanitas.png",
    "kayros.png",
    "libellula.png",
    "managernoprofit.png",
    "mudec.png",
    "nowalls.png",
    "paroledilulu.png",
    "progettograzia.png",
    "talitakum.png",
    "uncuoreunmondo.png",
    "unsaccodibene.png",
    "ziacaterina.png"
];

// Create grid HTML
const gridHtml = `<div class="partners-grid" style="margin-bottom: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 3rem; align-items: center; justify-items: center;">
` + logos.map(logo => `<img src="img/${logo}" alt="Partner Logo" style="max-width: 100%; max-height: 100px; object-fit: contain; filter: grayscale(100%) brightness(200%); transition: filter 0.3s;" onmouseover="this.style.filter='grayscale(0) brightness(1)'" onmouseout="this.style.filter='grayscale(100%) brightness(200%)'">`).join('\n') + `
</div>`;

// Or maybe just colored? The user didn't specify. I'll just use the normal colored logos.
const gridHtmlColored = `<div class="partners-grid" style="margin-bottom: 4rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5%; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 3rem; align-items: center; justify-items: center;">
` + logos.map(logo => `<img src="img/${logo}" alt="Partner Logo" style="max-width: 100%; max-height: 100px; object-fit: contain;">`).join('\n') + `
</div>`;

// Update sostienici.html
let sostieniciPath = path.join(__dirname, 'public', 'sostienici.html');
let sostieniciHtml = fs.readFileSync(sostieniciPath, 'utf8');

// The block is <div class="partners-grid" ... > ... </div>
// We can use regex to replace it
sostieniciHtml = sostieniciHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>/, gridHtmlColored);
fs.writeFileSync(sostieniciPath, sostieniciHtml);
console.log("Updated sostienici.html");

// Update index.html
let indexPath = path.join(__dirname, 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<div class="partners-grid"[^>]*>([\s\S]*?)(?=<a href="progetti.html"|<\/section>)/, gridHtmlColored + '\n            ');
fs.writeFileSync(indexPath, indexHtml);
console.log("Updated index.html");
