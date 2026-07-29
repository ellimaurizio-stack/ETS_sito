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

// Split into two lines
const half = Math.ceil(logos.length / 2);
const row1 = logos.slice(0, half);
const row2 = logos.slice(half);

// We duplicate the logos in each row to create a seamless infinite loop
const row1Html = [...row1, ...row1].map(logo => `<img src="img/${logo}" alt="Partner Logo">`).join('\n');
const row2Html = [...row2, ...row2].map(logo => `<img src="img/${logo}" alt="Partner Logo">`).join('\n');

const marqueeHtml = `
<div class="partners-grid" style="margin-bottom: 4rem; width: 100vw; max-width: 100%; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow: hidden; background: transparent;">
    <div class="marquee-container">
        <div class="marquee-content">
            ${row1Html}
        </div>
    </div>
    <div class="marquee-container" style="margin-top: 2rem;">
        <div class="marquee-content reverse">
            ${row2Html}
        </div>
    </div>
</div>
`;

// Update css
const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');
if (!css.includes('.marquee-container')) {
    css += `

/* Marquee Styles */
.marquee-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}
.marquee-content {
    display: inline-block;
    animation: marquee 25s linear infinite;
    width: max-content;
}
.marquee-content.reverse {
    animation: marquee-reverse 25s linear infinite;
}
.marquee-content img {
    height: 110px;
    margin: 0 4rem;
    vertical-align: middle;
    object-fit: contain;
    filter: grayscale(100%) opacity(0.8);
    transition: filter 0.3s, transform 0.3s;
}
.marquee-content img:hover {
    filter: grayscale(0) opacity(1);
    transform: scale(1.1);
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
@keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}
`;
    fs.writeFileSync(cssPath, css);
}

// Update sostienici.html
let sostieniciPath = path.join(__dirname, 'public', 'sostienici.html');
let sostieniciHtml = fs.readFileSync(sostieniciPath, 'utf8');
sostieniciHtml = sostieniciHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>/, marqueeHtml);
fs.writeFileSync(sostieniciPath, sostieniciHtml);

// Update index.html
let indexPath = path.join(__dirname, 'public', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
// The grid in index.html has a </div> closing the grid. The regex needs to carefully replace the whole block.
// We can use the same regex we used before, assuming it's exactly the div we injected.
indexHtml = indexHtml.replace(/<div class="partners-grid"[\s\S]*?<\/div>/, marqueeHtml);
fs.writeFileSync(indexPath, indexHtml);

console.log("Marquee applied to index and sostienici.");
