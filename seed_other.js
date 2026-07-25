const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

const pagesToSeed = ['chi-siamo', 'progetti', 'sostienici', 'contatti'];

db.serialize(() => {
    pagesToSeed.forEach(slug => {
        const filePath = `./public/${slug}.html`;
        if (fs.existsSync(filePath)) {
            const html = fs.readFileSync(filePath, 'utf8');
            
            // Extract everything between </nav> and <footer>
            const navEnd = html.indexOf('</nav>');
            const footerStart = html.indexOf('<footer>');
            
            if (navEnd > -1 && footerStart > -1) {
                const content = html.substring(navEnd + 6, footerStart).trim();
                
                db.run(`DELETE FROM blocks WHERE page_slug = ?`, [slug]);
                
                const stmt = db.prepare(`INSERT INTO blocks (page_slug, type, content, order_index) VALUES (?, ?, ?, ?)`);
                stmt.run(slug, 'htmlRaw', JSON.stringify({ html: content }), 0);
                stmt.finalize();
                console.log(`Seeded ${slug}`);
            }
        }
    });
});

setTimeout(() => db.close(), 1000);
