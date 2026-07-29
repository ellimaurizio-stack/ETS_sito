const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

['index.html', 'sostienici.html'].forEach(file => {
    let filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Define the exact regex to match the mudec block, accounting for varying whitespace
    const mudecRegex = /\s*<div style="flex: 0 1 auto; display: flex; justify-content: center; align-items: center;">\s*<img src="img\/mudec\.png"[^>]*>\s*<\/div>/g;
    
    if (mudecRegex.test(html)) {
        html = html.replace(mudecRegex, '');
        fs.writeFileSync(filePath, html);
        console.log("Removed mudec.png from", file);
    } else {
        console.log("mudec.png not found in", file);
    }
});
