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

// The user wants: static, large, centered, like the reference PDF.
// Using flexbox with wrap and center justification perfectly handles centering the last row.
// And we give them a large height (e.g., 100-140px).
const staticGridHtml = `
<div class="partners-grid" style="margin: 4rem auto; max-width: 1400px; padding: 0 5%; display: flex; justify-content: center; flex-wrap: wrap; gap: 4rem 6rem; align-items: center;">
    ${logos.map(logo => `<div style="flex: 0 1 auto; display: flex; justify-content: center; align-items: center;">
        <img src="img/${logo}" alt="Partner" style="height: auto; max-height: 120px; max-width: 250px; object-fit: contain;">
    </div>`).join('\n    ')}
</div>
`;

// Replace in index.html
let indexPath = path.join(__dirname, 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, staticGridHtml);
// Because the previous script might have had different closing tags, let's just do a safer regex
// The previous script produced `<div class="partners-grid" ... > <div>...</div> <div>...</div> </div>`
indexHtml = indexHtml.replace(/<div class="partners-grid"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, staticGridHtml);
// If it fails to match, let's just try matching up to the button
indexHtml = indexHtml.replace(/<div class="partners-grid"[^>]*>[\s\S]*?(?=<a href="progetti.html")/i, staticGridHtml + '\n            ');
fs.writeFileSync(indexPath, indexHtml);
console.log("Updated index.html");

// Replace in sostienici.html
let sostieniciPath = path.join(__dirname, 'public', 'sostienici.html');
let sostieniciHtml = fs.readFileSync(sostieniciPath, 'utf8');
sostieniciHtml = sostieniciHtml.replace(/<div class="partners-grid"[^>]*>[\s\S]*?(?=<a href="progetti.html")/i, staticGridHtml + '\n            ');
fs.writeFileSync(sostieniciPath, sostieniciHtml);
console.log("Updated sostienici.html");
