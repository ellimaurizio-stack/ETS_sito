const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    const pages = [
        { slug: 'home', title: 'Home Page' },
        { slug: 'chi-siamo', title: 'Chi Siamo' },
        { slug: 'progetti', title: 'Progetti' },
        { slug: 'sostienici', title: 'Sostienici' },
        { slug: 'contatti', title: 'Contatti' }
    ];

    const stmt = db.prepare(`INSERT OR IGNORE INTO pages (slug, title) VALUES (?, ?)`);
    pages.forEach(p => stmt.run(p.slug, p.title));
    stmt.finalize();
    console.log('Pagine di base inserite o già esistenti.');
});
db.close();
