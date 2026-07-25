const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'cms.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.serialize(() => {
            // Tabella per testi statici
            db.run(`CREATE TABLE IF NOT EXISTS content (
                id TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )`);

            // Tabella per i Progetti (Dettaglio)
            db.run(`CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                partner_name TEXT,
                project_name TEXT,
                intro_text TEXT,
                main_content TEXT,
                hero_image TEXT,
                partner_logo TEXT,
                images JSON,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Tabella per i messaggi del modulo Contatti
            db.run(`CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                motivation TEXT,
                name TEXT,
                email TEXT,
                phone TEXT,
                message TEXT,
                privacy_agreed BOOLEAN,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            // Tabelle CMS per Page Builder
            db.run(`CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE,
                title TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS blocks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_slug TEXT,
                project_id INTEGER,
                type TEXT,
                content JSON,
                order_index INTEGER,
                FOREIGN KEY (page_slug) REFERENCES pages (slug) ON DELETE CASCADE,
                FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
            )`);
        });
    }
});

module.exports = db;
