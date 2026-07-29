const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let html = fs.readFileSync(filePath, 'utf8');
    for (const [oldStr, newStr] of replacements) {
        html = html.replace(oldStr, newStr);
    }
    fs.writeFileSync(filePath, html);
    console.log("Updated", path.basename(filePath));
}

// 1. chi-siamo.html
replaceInFile(path.join(__dirname, 'public', 'chi-siamo.html'), [
    [
        "lasciare <strong>un'impronta che non sia solo visibile, ma anche significativa e duratura</strong>",
        "generare <strong>un impatto che non sia solo visibile, ma anche profondo e duraturo</strong>"
    ]
]);

// 2. index.html
replaceInFile(path.join(__dirname, 'public', 'index.html'), [
    [
        "Un piccolo gesto può lasciare una grande impronta.",
        "Un piccolo gesto può fare una grande differenza."
    ]
]);

// 3. sostienici.html
replaceInFile(path.join(__dirname, 'public', 'sostienici.html'), [
    [
        "Chi fa del bene<br>lascia un'impronta",
        "Chi fa del bene<br>crea un impatto reale"
    ],
    [
        "<strong>lasciare un'impronta</strong> che non sia solo visibile, ma anche <strong>significativa e duratura</strong>",
        "<strong>generare un impatto</strong> che non sia solo visibile, ma anche <strong>profondo e duraturo</strong>"
    ]
]);
