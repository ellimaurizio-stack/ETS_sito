const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'chi-siamo.html');
let html = fs.readFileSync(filePath, 'utf8');

// The N.7 block:
// <div style="display: flex; align-items: center; gap: 2rem; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 1.5rem;">
//     <div style="font-size: 6rem; font-weight: 100; line-height: 1; color: white; flex-shrink: 0;">N.7</div>

const n7Regex = /<div style="display: flex; align-items: center; gap: 2rem; border-bottom: 1px solid rgba\(255,255,255,0\.2\); padding-bottom: 1\.5rem;">(\s*<div style="font-size: 6rem; font-weight: 100; line-height: 1; color: white; flex-shrink: 0;">N\.7<\/div>)/;
html = html.replace(n7Regex, '<div style="display: flex; align-items: center; gap: 2rem; padding-bottom: 1.5rem;">$1');

const n8Regex = /<div style="display: flex; align-items: center; gap: 2rem; border-bottom: 1px solid rgba\(255,255,255,0\.2\); padding-bottom: 1\.5rem;">(\s*<div style="font-size: 6rem; font-weight: 100; line-height: 1; color: white; flex-shrink: 0;">N\.8<\/div>)/;
html = html.replace(n8Regex, '<div style="display: flex; align-items: center; gap: 2rem; padding-bottom: 1.5rem;">$1');

fs.writeFileSync(filePath, html);
console.log("Removed borders for N.7 and N.8");
