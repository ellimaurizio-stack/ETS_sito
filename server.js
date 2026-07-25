const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- CONTENT API ---
app.get('/api/content', (req, res) => {
    db.all(`SELECT * FROM content`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const contentMap = {};
        rows.forEach(row => { contentMap[row.id] = row.value; });
        res.json(contentMap);
    });
});

app.put('/api/content/:id', (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    db.run(
        `INSERT INTO content (id, value) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET value=excluded.value`,
        [id, value],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Content updated successfully' });
        }
    );
});

// --- PROJECTS API ---
app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse JSON strings back to arrays
        rows.forEach(r => {
            try { r.images = JSON.parse(r.images); } catch(e) { r.images = []; }
        });
        res.json(rows);
    });
});

app.get('/api/projects/:id', (req, res) => {
    db.get(`SELECT * FROM projects WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Project not found' });
        try { row.images = JSON.parse(row.images); } catch(e) { row.images = []; }
        res.json(row);
    });
});

// Create a new project (Upload up to 10 images)
app.post('/api/projects', upload.array('images', 10), (req, res) => {
    const { partner_name, project_name, intro_text, main_content } = req.body;
    
    // Assumiamo che la prima immagine sia la hero, la seconda il logo, le altre per la gallery
    const filePaths = req.files.map(f => '/uploads/' + f.filename);
    const hero_image = filePaths[0] || '';
    const partner_logo = filePaths[1] || '';
    const imagesJson = JSON.stringify(filePaths.slice(2));

    db.run(
        `INSERT INTO projects (partner_name, project_name, intro_text, main_content, hero_image, partner_logo, images) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [partner_name, project_name, intro_text, main_content, hero_image, partner_logo, imagesJson],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

app.delete('/api/projects/:id', (req, res) => {
    db.run(`DELETE FROM projects WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Project deleted' });
    });
});

app.put('/api/projects/:id/cover', express.json(), (req, res) => {
    db.run(`UPDATE projects SET hero_image = ? WHERE id = ?`, [req.body.hero_image, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Cover updated' });
    });
});

// --- PAGES API (CMS) ---
app.get('/api/pages', (req, res) => {
    db.all(`SELECT * FROM pages ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/pages/:slug/blocks', (req, res) => {
    db.all(`SELECT * FROM blocks WHERE page_slug = ? ORDER BY order_index ASC`, [req.params.slug], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

const { generatePage } = require('./ssg');

app.post('/api/pages/:slug/blocks', (req, res) => {
    const slug = req.params.slug;
    const blocks = req.body.blocks || []; // [{ type, content, order_index }]

    db.serialize(() => {
        db.run(`DELETE FROM blocks WHERE page_slug = ?`, [slug], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            const stmt = db.prepare(`INSERT INTO blocks (page_slug, type, content, order_index) VALUES (?, ?, ?, ?)`);
            blocks.forEach(b => {
                stmt.run(slug, b.type, typeof b.content === 'string' ? b.content : JSON.stringify(b.content), b.order_index);
            });
            stmt.finalize();

            // Trigger SSG Generation
            generatePage(slug).then((filepath) => {
                res.json({ success: true, message: 'Blocks saved and page generated', filepath });
            }).catch(e => {
                console.error(e);
                res.status(500).json({ error: 'Blocks saved but SSG failed: ' + e });
            });
        });
    });
});

app.get('/api/projects/:id/blocks', (req, res) => {
    db.all(`SELECT * FROM blocks WHERE project_id = ? ORDER BY order_index ASC`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/projects/:id/blocks', (req, res) => {
    const projectId = req.params.id;
    const blocks = req.body.blocks || [];

    db.serialize(() => {
        db.run(`DELETE FROM blocks WHERE project_id = ?`, [projectId], function(err) {
            if (err) return res.status(500).json({ error: err.message });

            const stmt = db.prepare(`INSERT INTO blocks (project_id, type, content, order_index) VALUES (?, ?, ?, ?)`);
            blocks.forEach(b => {
                stmt.run(projectId, b.type, typeof b.content === 'string' ? b.content : JSON.stringify(b.content), b.order_index);
            });
            stmt.finalize();

            // Trigger SSG Generation per i Progetti
            generatePage(projectId, true).then((filepath) => {
                res.json({ success: true, message: 'Blocchi progetto salvati e pagina generata (SSG)', filepath });
            }).catch(e => {
                console.error(e);
                res.status(500).json({ error: 'Blocchi salvati ma SSG fallito: ' + e });
            });
        });
    });
});

// Single image upload endpoint per usare immagini isolate se necessario
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    res.json({ url: '/uploads/' + req.file.filename });
});


// Recupera tutti i contatti
app.get('/api/contacts', (req, res) => {
    db.all(`SELECT * FROM contacts ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- CONTACT FORM API ---
app.post('/api/contact', (req, res) => {
    const { motivation, name, email, phone, message, privacy_agreed } = req.body;
    
    if (!name || !email || !privacy_agreed) {
        return res.status(400).json({ error: 'Campi obbligatori mancanti o privacy non accettata.' });
    }

    db.run(
        `INSERT INTO contacts (motivation, name, email, phone, message, privacy_agreed) VALUES (?, ?, ?, ?, ?, ?)`,
        [motivation, name, email, phone, message, privacy_agreed ? 1 : 0],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'Messaggio salvato con successo!' });
        }
    );
});


app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
