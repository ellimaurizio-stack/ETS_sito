const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'contatti' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // 1. Increase space between the two titles
            content.html = content.html.replace(
                /margin-top: -10px;/g,
                'margin-top: 10px;'
            );

            // 2. Push TEL/EMAIL list further down (from 5.2rem to 8rem)
            content.html = content.html.replace(
                /margin-top: 5\.2rem; gap: 0\.8rem;/g,
                'margin-top: 9rem; gap: 0.8rem;'
            );

            // 3. Replace the text arrow with a nice SVG Chevron
            content.html = content.html.replace(
                /<div style="position: absolute; right: 20px; top: 50%; transform: translateY\(-50%\); pointer-events: none; color: white; font-size: 1rem;">▼<\/div>/g,
                '<div style="position: absolute; right: 25px; top: 50%; transform: translateY(-50%); pointer-events: none;"><svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L8 8L14 2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'
            );
            
            // Adjust the select width (make max-width 400px to have more harmonic space) and update the CTA button width
            content.html = content.html.replace(
                /<div style="position: relative; max-width: 300px;">/g,
                '<div style="position: relative; max-width: 400px;">'
            );

            // 4. Make the CTA button full width and pad it more harmonically
            content.html = content.html.replace(
                /padding: 12px 30px; border: none; font-weight: 500; font-size: 1rem; cursor: pointer; text-transform: uppercase; margin-top: 0;"/g,
                'width: 100%; padding: 18px 30px; border: none; font-weight: 500; font-size: 1rem; cursor: pointer; text-transform: uppercase; margin-top: 0;"'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated contatti blocks refined layout`);
            });
        }
    });
});
