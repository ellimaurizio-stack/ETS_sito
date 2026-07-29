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
        "Unirsi a noi significa scegliere di generare <strong>un impatto che non sia solo visibile, ma anche profondo e duraturo</strong>.",
        "Scegliere di affiancarci vuol dire <strong>diventare parte attiva di un cambiamento reale</strong>, costruendo basi solide per un futuro più equo e solidale."
    ]
]);

// Let's also check index.html for 5x1000 duplicated text
// In index.html we have:
// Donare è semplice: basta inserire il nostro <strong>Codice Fiscale 97737800157</strong> nello spazio dedicato alle organizzazioni non profit nella tua dichiarazione dei redditi.<br><br>Un piccolo gesto può fare una grande differenza.
// In sostienici.html we have something similar? Let's assume we can reword index.html slightly.
replaceInFile(path.join(__dirname, 'public', 'index.html'), [
    [
        "Donare è semplice: basta inserire il nostro <strong>Codice Fiscale 97737800157</strong> nello spazio dedicato alle organizzazioni non profit nella tua dichiarazione dei redditi.",
        "Destinare il tuo 5x1000 è semplicissimo: ti basta indicare il nostro <strong>Codice Fiscale 97737800157</strong> nell'apposito riquadro dedicato al Terzo Settore durante la dichiarazione dei redditi."
    ]
]);
