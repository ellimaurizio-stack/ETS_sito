const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');
const { generatePage } = require('./ssg.js');

db.serialize(() => {
    db.all(`SELECT * FROM projects`, [], (err, projects) => {
        if (err) throw err;
        
        projects.forEach(p => {
            db.run(`DELETE FROM blocks WHERE project_id = ?`, [p.id]);
            
            const stmt = db.prepare(`INSERT INTO blocks (project_id, type, content, order_index) VALUES (?, ?, ?, ?)`);
            
            // Hero Block
            stmt.run(p.id, 'hero', JSON.stringify({
                title_top: p.partner_name, title_top_span: "",
                title_bottom: p.project_name, title_bottom_span: "",
                description: p.intro_text
            }), 0);
            
            // Main text Block
            stmt.run(p.id, 'imageText', JSON.stringify({
                title: "Il Progetto", text: p.main_content, image_url: p.hero_image, reverse: false
            }), 1);
            
            // Gallery (htmlRaw for now)
            let imgs = [];
            try { imgs = JSON.parse(p.images) || []; } catch(e){}
            let imgTags = imgs.map(url => `<img src="${url}" style="width:100%; aspect-ratio:1; object-fit:cover;">`).join('');
            
            stmt.run(p.id, 'htmlRaw', JSON.stringify({
                html: `<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; max-width:1200px; margin: 4rem auto; padding:0 5%;">${imgTags}</div>`
            }), 2);
            
            stmt.finalize();
            
            // Generate SSG
            generatePage(p.id, true).then(() => console.log(`Migrated & Generated progetto-${p.id}.html`)).catch(e => console.error(e));
        });
    });
});

setTimeout(() => db.close(), 3000);
