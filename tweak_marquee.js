const fs = require('fs');
const path = require('path');

// 1. Update style.css
const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// We replace the marquee CSS block using regex
css = css.replace(/\/\* Marquee Styles \*\/[\s\S]*?@keyframes marquee-reverse \{[\s\S]*?\}/, `/* Marquee Styles */
.marquee-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
}
.marquee-content {
    display: inline-block;
    animation: marquee 50s linear infinite;
    width: max-content;
}
.marquee-content.reverse {
    animation: marquee-reverse 50s linear infinite;
}
.marquee-content img {
    height: 220px;
    margin: 0 6rem;
    vertical-align: middle;
    object-fit: contain;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.marquee-content img:hover {
    transform: scale(1.15);
}
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
@keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}`);

fs.writeFileSync(cssPath, css);

// 2. Fix the HTML in index.html and sostienici.html
function fixHtml(filePath) {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Change first row to .reverse (scroll right) and second to normal (scroll left)
    // Change margin-top to 6rem for distinct separation
    html = html.replace(/<div class="marquee-content">([\s\S]*?)<\/div>\s*<\/div>\s*<div class="marquee-container" style="margin-top: 2rem;">\s*<div class="marquee-content reverse">/, 
    `<div class="marquee-content reverse">$1</div>
    </div>
    <div class="marquee-container" style="margin-top: 6rem;">
        <div class="marquee-content">`);
        
    fs.writeFileSync(filePath, html);
}

fixHtml(path.join(__dirname, 'public', 'index.html'));
fixHtml(path.join(__dirname, 'public', 'sostienici.html'));

console.log("Marquee adjusted.");
