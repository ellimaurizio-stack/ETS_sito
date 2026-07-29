const fs = require('fs');
const path = require('path');

// Update CSS to add text-shadow and ensure it displays
const cssPath = path.join(__dirname, 'public', 'css', 'style.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

// Replace the previous active state with an updated one
cssContent = cssContent.replace(/\/\* Navbar active state \*\/[\s\S]*?border-radius: 50%;\n}/, `/* Navbar active state */
.nav-links li a.active {
    position: relative;
    text-shadow: 0 0 1px currentColor; /* slight bold without width change */
}
.nav-links li a.active::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    background-color: var(--color-light-blue);
    border-radius: 50%;
}`);

fs.writeFileSync(cssPath, cssContent);
console.log("Updated style.css");

// Add cache buster to HTML files
const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // update css/style.css to css/style.css?v=2
    if (html.includes('href="css/style.css"')) {
        html = html.replace(/href="css\/style\.css"/g, 'href="css/style.css?v=2"');
        fs.writeFileSync(filePath, html);
        console.log("Added cache buster to", file);
    } else if (html.includes('href="css/style.css?v=')) {
        // Increment it if already there
        html = html.replace(/href="css\/style\.css\?v=\d+"/g, 'href="css/style.css?v=' + Date.now() + '"');
        fs.writeFileSync(filePath, html);
        console.log("Updated cache buster in", file);
    }
});
