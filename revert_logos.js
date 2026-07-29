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

const half = Math.ceil(logos.length / 2);
const row1 = logos.slice(0, half);
const row2 = logos.slice(half);

// We use zoom: 0.65 or a max-width to ensure they are about 50% of their natural size, 
// and flex with space-evenly to distribute them across the full width.
// To ensure it occupies all horizontal space: width: 100vw etc.
const staticGridHtml = `
<div class="partners-grid" style="margin-bottom: 4rem; width: 100vw; max-width: 100%; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; padding: 2rem 5%;">
    <div style="display: flex; justify-content: space-evenly; align-items: center; margin-bottom: 4rem; flex-wrap: wrap; gap: 2rem;">
        ${row1.map(logo => `<img src="img/${logo}" alt="Partner" style="transform: scale(0.5); transform-origin: center; max-height: 150px; object-fit: contain;">`).join('\n        ')}
    </div>
    <div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap; gap: 2rem;">
        ${row2.map(logo => `<img src="img/${logo}" alt="Partner" style="transform: scale(0.5); transform-origin: center; max-height: 150px; object-fit: contain;">`).join('\n        ')}
    </div>
</div>
`;

// Replace in index.html
let indexPath = path.join(__dirname, 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
// Replace the marquee container block with the new static grid.
indexHtml = indexHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, staticGridHtml);
fs.writeFileSync(indexPath, indexHtml);
console.log("Updated index.html");

// Replace in sostienici.html
let sostieniciPath = path.join(__dirname, 'public', 'sostienici.html');
let sostieniciHtml = fs.readFileSync(sostieniciPath, 'utf8');
sostieniciHtml = sostieniciHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, staticGridHtml);
fs.writeFileSync(sostieniciPath, sostieniciHtml);
console.log("Updated sostienici.html");
