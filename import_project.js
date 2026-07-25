const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'cms.db');
const db = new sqlite3.Database(dbPath);

const projectText = fs.readFileSync('extracted_content/SitoETS/progetti/bullone/bullone.txt', 'utf8');

const introMatch = projectText.match(/Testo introduttivo:([\s\S]*?)Testo principale:/);
const mainMatch = projectText.match(/Testo principale:([\s\S]*?)Torna ai progetti/);

const partner_name = "Fondazione";
const project_name = "IL BULLONE";
const intro_text = introMatch ? introMatch[1].trim() : "";
let main_content = mainMatch ? mainMatch[1].trim() : "";
main_content = main_content.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');

const imgDestDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(imgDestDir)) fs.mkdirSync(imgDestDir, { recursive: true });

try { fs.copyFileSync('extracted_content/SitoETS/progetti/bullone/img/bullone-hero.jpg', path.join(imgDestDir, 'bullone-hero.jpg')); } catch(e){}
try { fs.copyFileSync('extracted_content/SitoETS/progetti/bullone/img/bullone-galleria-1.jpg', path.join(imgDestDir, 'bullone-galleria-1.jpg')); } catch(e){}
try { fs.copyFileSync('extracted_content/SitoETS/progetti/bullone/img/bullone-galleria-2.jpg', path.join(imgDestDir, 'bullone-galleria-2.jpg')); } catch(e){}

const hero_image = '/uploads/bullone-hero.jpg';
const partner_logo = ''; 
const images = JSON.stringify([
    '/uploads/bullone-galleria-1.jpg',
    '/uploads/bullone-galleria-2.jpg'
]);

db.run(
    `INSERT INTO projects (partner_name, project_name, intro_text, main_content, hero_image, partner_logo, images) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [partner_name, project_name, intro_text, main_content, hero_image, partner_logo, images],
    function(err) {
        if (err) console.error(err);
        else console.log('Project inserted with ID:', this.lastID);
        db.close();
    }
);
