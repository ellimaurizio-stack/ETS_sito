const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const publicDir = path.join(__dirname, 'public');
const files = ['index.html', 'chi-siamo.html', 'progetti.html', 'sostienici.html', 'contatti.html', 'progetto.html'];

files.forEach(file => {
    let content = fs.readFileSync(path.join(publicDir, file), 'utf8');
    
    // Sostituisci il logo testuale nella Navbar con l'immagine
    content = content.replace(
        /<div class="logo"><span style="font-style: italic;">e-ts<\/span><\/div>/g,
        `<div class="logo"><img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 40px;"></div>`
    );

    // Sostituisci il logo testuale nel Footer
    content = content.replace(
        /<div class="footer-logo"><span style="font-style: italic;">e-ts<\/span><\/div>/g,
        `<div class="footer-logo"><img src="img/ets-logo-navbar.png" alt="e-ts" style="max-height: 50px;"></div>`
    );

    // Sostituisci i testi social con le icone nel Footer
    content = content.replace(
        /<p>Facebook \| LinkedIn<\/p>/g,
        `<p><img src="img/facebook.png" alt="Facebook" style="height: 24px; margin-right: 10px;"> <img src="img/In.png" alt="LinkedIn" style="height: 24px;"></p>`
    );

    fs.writeFileSync(path.join(publicDir, file), content);
});

// Aggiungiamo i progetti statici al database così compaiono nella griglia!
const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const projectThumbs = [
    'progetto-1.png', 'progetto-2.png', 'progetto-3.png', 
    'progetto-4.png', 'progetto-5.png', 'progetto-6.png', 
    'progetto-7.png', 'progetto-8.png', 'progetto-9.png'
];

let inserted = 0;
projectThumbs.forEach((thumb, i) => {
    db.run(
        `INSERT INTO projects (partner_name, project_name, hero_image) VALUES (?, ?, ?)`,
        [`Partner ${i+1}`, `Progetto ${i+1}`, `/img/${thumb}`],
        () => {
            inserted++;
            if(inserted === projectThumbs.length) db.close();
        }
    );
});

console.log("Loghi e progetti aggiunti!");
