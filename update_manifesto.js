const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'chi-siamo' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            
            // Step 1: Replace the start of the manifesto section to add a wrapper
            content.html = content.html.replace(
                /<section class="bg-gradient-blue text-left flex-section" style="max-width: 100%; padding: 6rem 10% 6rem 10%;">/,
                '<div class="bg-gradient-blue" style="width: 100%; padding-bottom: 6rem;">\n        <section class="text-left flex-section" style="max-width: 100%; padding: 6rem 10% 6rem 10%;">'
            );
            
            // Step 2: Remove bg-gradient-blue and padding from the grid wrapper, but keep it structured
            content.html = content.html.replace(
                /<div class="bg-gradient-blue text-left" style="padding-bottom: 6rem; width: 100%;">/,
                '<div class="text-left" style="width: 100%;">'
            );
            
            // Step 3: Add the closing </div> for the new wrapper after the grid wrapper closes
            // The grid wrapper closes right before the next section
            content.html = content.html.replace(
                /<\/div>\n\n        <section class="flex-section text-left" style="max-width: 1500px;/g,
                '</div>\n        </div>\n\n        <section class="flex-section text-left" style="max-width: 1500px;'
            );

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated manifesto gradient for chi-siamo`);
            });
        }
    });
});
