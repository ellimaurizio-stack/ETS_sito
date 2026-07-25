const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
  db.get("SELECT content FROM blocks WHERE project_id = 1 AND type = 'projectHeroDoubleLogo'", (err, row) => {
    if (row) {
      let content = JSON.parse(row.content);
      content.bg_image = "uploads/bullone-hero.jpg";
      db.run("UPDATE blocks SET content = ? WHERE project_id = 1 AND type = 'projectHeroDoubleLogo'", [JSON.stringify(content)], () => {
        console.log("Updated bg_image");
        db.close();
      });
    }
  });
});
