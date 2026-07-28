const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'chi-siamo' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // Align all text blocks to start at the line height (margin-top: 5.2rem)
            // The original string is: justify-content: flex-end; align-items: flex-start; padding-bottom: 10px;
            content.html = content.html.replace(/justify-content:\s*flex-end;\s*align-items:\s*flex-start;\s*padding-bottom:\s*10px;/g, 'justify-content: flex-start; align-items: flex-start; margin-top: 5.2rem;');
            
            // Push "STORIA" section to the right to create a staggered effect
            // Original: <section class="flex-section text-left" style="margin-top: 5rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5% 6rem 5%;">
            content.html = content.html.replace(
                /<section class="flex-section text-left" style="margin-top: 5rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5% 6rem 5%;">(\s*<div style="flex: 1;">\s*<div class="section-header" style="margin-bottom: 0;">\s*<h2 style="font-weight: 300; font-size: 3.5rem; letter-spacing: 1px; color: var\(--color-text\);">La nostra<\/h2>\s*<h2 style="font-weight: 700; font-size: 4.5rem; letter-spacing: 40px;.*STORIA<\/h2>)/,
                '<section class="flex-section text-left" style="margin-top: 5rem; max-width: 1200px; margin-left: auto; margin-right: auto; padding: 0 5% 6rem 15%;">$1'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated layout for chi-siamo`);
            });
        }
    });
});
