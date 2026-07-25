let currentSlug = null;
let currentProjectId = null;
let blocks = [];
let cropper = null;
let activeImageCallback = null;

const blockTemplates = {
    hero: { title_top: "", title_top_span: "", title_bottom: "", title_bottom_span: "", description: "" },
    textSplit: { title_top: "", title_bottom: "", text_right: "", button_text: "", button_link: "" },
    imageText: { image_url: "", title: "", text: "", reverse: false },
    partnersGrid: { title_top: "", title_bottom: "", description: "", button_text: "", button_link: "", logos: [] },
    htmlRaw: { html: "" },
    projectHeroDoubleLogo: { bg_image: "", logo_left: "", logo_right: "" },
    projectIntro: { title_thin: "", title_bold: "", description: "" },
    imageGallery3: { images: [], align: "center" },
    textBlock: { title: "", text: "" }
};

let contactsData = [];

document.addEventListener('DOMContentLoaded', () => {
    loadPages();
    loadProjects();
    loadDashboard();
    
    document.getElementById('download-csv-btn').addEventListener('click', downloadCSV);
    
    document.getElementById('save-page-btn').addEventListener('click', savePage);
    document.getElementById('add-block-btn').addEventListener('click', () => {
        const type = prompt("Che tipo di blocco vuoi aggiungere? (hero, textSplit, imageText, partnersGrid, htmlRaw)");
        if (blockTemplates[type]) {
            blocks.push({ type, content: { ...blockTemplates[type] }, order_index: blocks.length });
            renderBlocks();
        } else {
            alert("Tipo non valido");
        }
    });

    document.getElementById('create-project-btn').addEventListener('click', async () => {
        const projectName = prompt("Nome del Progetto (es. IL BULLONE):");
        if (!projectName) return;
        const partnerName = prompt("Nome del Partner (es. Fondazione X):");
        
        const formData = new FormData();
        formData.append('project_name', projectName);
        formData.append('partner_name', partnerName || '');
        
        const res = await fetch('/api/projects', { method: 'POST', body: formData });
        if (res.ok) {
            alert('Progetto creato. Selezionalo dalla barra laterale per modificarlo.');
            loadProjects();
        }
    });

    document.getElementById('delete-project-btn').addEventListener('click', async () => {
        if (!currentProjectId) return;
        if (confirm("Sei sicuro di voler eliminare questo progetto definitivamente?")) {
            const res = await fetch(`/api/projects/${currentProjectId}`, { method: 'DELETE' });
            if (res.ok) {
                document.getElementById('current-page-title').innerText = "Seleziona una pagina";
                document.getElementById('blocks-list').innerHTML = '';
                document.getElementById('delete-project-btn').style.display = 'none';
                document.getElementById('save-page-btn').style.display = 'none';
                document.getElementById('add-block-btn').style.display = 'none';
                currentProjectId = null;
                currentSlug = null;
                loadProjects();
            }
        }
    });
    // Cropper modals
    document.getElementById('cancel-crop-btn').addEventListener('click', () => {
        document.getElementById('cropModal').style.display = 'none';
        if (cropper) cropper.destroy();
    });

    document.getElementById('save-crop-btn').addEventListener('click', () => {
        if (!cropper) return;
        cropper.getCroppedCanvas().toBlob(blob => {
            const formData = new FormData();
            formData.append('image', blob, 'cropped.jpg');
            fetch('/api/upload', { method: 'POST', body: formData })
                .then(r => r.json())
                .then(data => {
                    if (activeImageCallback) activeImageCallback(data.url);
                    document.getElementById('cropModal').style.display = 'none';
                    cropper.destroy();
                    renderBlocks();
                });
        });
    });
});
async function loadPages() {
    const res = await fetch('/api/pages');
    const pages = await res.json();
    const list = document.getElementById('pages-list');
    list.innerHTML = '';
    
    pages.forEach(p => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'page-link';
        a.innerText = p.title;
        a.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.page-link').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            currentProjectId = null;
            loadPageBlocks(p.slug, p.title);
        };
        list.appendChild(a);
    });
}

async function loadProjects() {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    
    projects.forEach(p => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'page-link';
        a.innerText = p.project_name;
        a.onclick = (e) => {
            e.preventDefault();
            document.querySelectorAll('.page-link').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            currentSlug = null;
            loadProjectBlocks(p.id, p.project_name, p.hero_image);
        };
        list.appendChild(a);
    });
}

async function loadPageBlocks(slug, title) {
    currentSlug = slug;
    document.getElementById('current-page-title').innerText = `Pagina: ${title}`;
    document.getElementById('save-page-btn').style.display = 'block';
    document.getElementById('save-page-btn').innerText = 'Salva & Genera Sito (SSG)';
    document.getElementById('add-block-btn').style.display = 'block';
    document.getElementById('delete-project-btn').style.display = 'none';
    
    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('project-settings-view').style.display = 'none';
    document.getElementById('blocks-list').style.display = 'block';

    const res = await fetch(`/api/pages/${slug}/blocks`);
    blocks = await res.json();
    parseBlocksJson();
    renderBlocks();
}

async function loadProjectBlocks(id, title, hero_image) {
    currentProjectId = id;
    document.getElementById('current-page-title').innerText = `Progetto: ${title}`;
    document.getElementById('save-page-btn').style.display = 'block';
    document.getElementById('save-page-btn').innerText = 'Salva Blocchi Progetto';
    document.getElementById('add-block-btn').style.display = 'block';
    document.getElementById('delete-project-btn').style.display = 'block';

    document.getElementById('dashboard-view').style.display = 'none';
    document.getElementById('project-settings-view').style.display = 'block';
    document.getElementById('blocks-list').style.display = 'block';
    
    const preview = document.getElementById('project-cover-preview');
    if (hero_image) {
        preview.src = hero_image;
        preview.style.display = 'block';
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }

    const res = await fetch(`/api/projects/${id}/blocks`);
    blocks = await res.json();
    
    // Se non ci sono blocchi, diamo un template di base vuoto per comodità
    if (blocks.length === 0) {
        blocks = [
            { type: 'hero', content: { ...blockTemplates.hero }, order_index: 0 },
            { type: 'imageText', content: { ...blockTemplates.imageText }, order_index: 1 }
        ];
    }
    
    parseBlocksJson();
    renderBlocks();
}

function parseBlocksJson() {
    blocks.forEach(b => {
        if (typeof b.content === 'string') {
            try { b.content = JSON.parse(b.content); } catch (e) { b.content = {}; }
        }
    });
}

function renderBlocks() {
    const container = document.getElementById('blocks-list');
    container.innerHTML = '';
    
    blocks.forEach((block, index) => {
        const card = document.createElement('div');
        card.className = 'block-card';
        
        let fieldsHtml = '';
        for (const [key, value] of Object.entries(block.content)) {
            if ((key.includes('image') || key.includes('logo')) && !Array.isArray(value)) {
                fieldsHtml += `
                <div class="block-field">
                    <label>${key}</label>
                    <input type="text" value="${value}" onchange="updateBlockContent(${index}, '${key}', this.value)">
                    <button onclick="triggerImageUpload(${index}, '${key}')" style="margin-top:5px;">Carica & Croppa</button>
                    ${value ? `<br><img src="${value}" style="max-height:100px; margin-top:5px;">` : ''}
                </div>`;
            } else if (Array.isArray(value)) {
                fieldsHtml += `
                <div class="block-field">
                    <label>${key} (Galleria Immagini)</label>
                    <button onclick="triggerArrayUpload(${index}, '${key}')" style="margin-top:5px; padding: 5px 10px; cursor: pointer;">+ Aggiungi Immagine</button>
                    <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;">
                        ${(value || []).map((imgUrl, imgIndex) => `
                            <div style="position:relative; width: 80px; height: 80px; background: #fff; border: 1px solid #ccc; display:flex; align-items:center; justify-content:center; border-radius: 4px; padding: 5px;">
                                <img src="${imgUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                                <button onclick="removeArrayImage(${index}, '${key}', ${imgIndex})" style="position:absolute; top:-8px; right:-8px; background:red; color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-weight:bold; font-size: 12px; line-height: 12px; padding: 0;">×</button>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            } else if (key === 'align') {
                fieldsHtml += `
                <div class="block-field">
                    <label>Allineamento</label>
                    <select onchange="updateBlockContent(${index}, '${key}', this.value)">
                        <option value="left" ${value === 'left' ? 'selected' : ''}>Sinistra</option>
                        <option value="center" ${value === 'center' ? 'selected' : ''}>Centro</option>
                        <option value="right" ${value === 'right' ? 'selected' : ''}>Destra</option>
                    </select>
                </div>`;
            } else if (key === 'reverse') {
                fieldsHtml += `
                <div class="block-field">
                    <label>${key} (checkbox)</label>
                    <input type="checkbox" ${value ? 'checked' : ''} onchange="updateBlockContent(${index}, '${key}', this.checked)">
                </div>`;
            } else {
                fieldsHtml += `
                <div class="block-field">
                    <label>${key}</label>
                    ${key.includes('text') || key.includes('html') || key.includes('description') 
                        ? `<textarea rows="4" onchange="updateBlockContent(${index}, '${key}', this.value)">${value}</textarea>` 
                        : `<input type="text" value="${value}" onchange="updateBlockContent(${index}, '${key}', this.value)">`
                    }
                </div>`;
            }
        }

        card.innerHTML = `
            <div class="block-header">
                <span>Blocco: ${block.type}</span>
                <div class="block-actions">
                    <button onclick="moveBlock(${index}, -1)">↑</button>
                    <button onclick="moveBlock(${index}, 1)">↓</button>
                    <button onclick="duplicateBlock(${index})">Duplica</button>
                    <button onclick="deleteBlock(${index})" style="color:red;">Elimina</button>
                </div>
            </div>
            <div class="block-body">
                ${fieldsHtml}
            </div>
        `;
        container.appendChild(card);
    });
}

window.updateBlockContent = function(index, key, value) {
    blocks[index].content[key] = value;
};

window.moveBlock = function(index, direction) {
    if (index + direction < 0 || index + direction >= blocks.length) return;
    const temp = blocks[index];
    blocks[index] = blocks[index + direction];
    blocks[index + direction] = temp;
    
    // Update order index
    blocks.forEach((b, i) => b.order_index = i);
    renderBlocks();
};

window.duplicateBlock = function(index) {
    const original = blocks[index];
    const duplicate = JSON.parse(JSON.stringify(original));
    blocks.splice(index + 1, 0, duplicate);
    blocks.forEach((b, i) => b.order_index = i);
    renderBlocks();
};

window.deleteBlock = function(index) {
    if (confirm('Sei sicuro?')) {
        blocks.splice(index, 1);
        blocks.forEach((b, i) => b.order_index = i);
        renderBlocks();
    }
};

window.removeArrayImage = function(blockIndex, key, imgIndex) {
    if (confirm('Rimuovere questa immagine?')) {
        blocks[blockIndex].content[key].splice(imgIndex, 1);
        renderBlocks();
    }
};

window.triggerArrayUpload = function(blockIndex, key) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file, file.name);
            fetch('/api/upload', { method: 'POST', body: formData })
                .then(r => r.json())
                .then(data => {
                    if (!blocks[blockIndex].content[key]) blocks[blockIndex].content[key] = [];
                    blocks[blockIndex].content[key].push(data.url);
                    renderBlocks();
                });
        }
    };
    input.click();
};

window.triggerImageUpload = function(blockIndex, key) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            document.getElementById('image-to-crop').src = url;
            document.getElementById('cropModal').style.display = 'flex';
            
            if (cropper) cropper.destroy();
            cropper = new Cropper(document.getElementById('image-to-crop'), {
                aspectRatio: NaN, // libero
                viewMode: 1
            });
            
            activeImageCallback = (uploadedUrl) => {
                blocks[blockIndex].content[key] = uploadedUrl;
                renderBlocks();
            };
        }
    };
    input.click();
};

async function savePage() {
    if (!currentSlug && !currentProjectId) return;
    document.getElementById('save-page-btn').innerText = 'Salvataggio in corso...';
    
    const endpoint = currentSlug ? `/api/pages/${currentSlug}/blocks` : `/api/projects/${currentProjectId}/blocks`;
    
    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blocks })
        });
        const data = await res.json();
        
        if (data.success) {
            alert(currentSlug ? 'Pagina salvata e rigenerata con successo! (SSG eseguito)' : 'Blocchi Progetto salvati con successo!');
        } else {
            alert('Errore: ' + data.error);
        }
    } catch (err) {
        alert('Errore di rete');
    }
    
    document.getElementById('save-page-btn').innerText = currentSlug ? 'Salva & Genera Sito (SSG)' : 'Salva Blocchi Progetto';
}

async function loadDashboard() {
    document.getElementById('current-page-title').innerText = "Dashboard - Messaggi Ricevuti";
    document.getElementById('blocks-list').style.display = 'none';
    document.getElementById('dashboard-view').style.display = 'block';
    document.getElementById('save-page-btn').style.display = 'none';
    document.getElementById('add-block-btn').style.display = 'none';
    document.getElementById('delete-project-btn').style.display = 'none';
    document.getElementById('project-settings-view').style.display = 'none';
    
    currentSlug = null;
    currentProjectId = null;
    
    document.querySelectorAll('.page-link').forEach(el => el.classList.remove('active'));

    try {
        const res = await fetch('/api/contacts');
        contactsData = await res.json();
        
        const tbody = document.getElementById('contacts-list');
        tbody.innerHTML = '';
        
        if (contactsData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="padding: 10px;">Nessun messaggio ricevuto.</td></tr>';
            return;
        }

        contactsData.forEach(c => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #e2e8f0';
            const dateStr = new Date(c.created_at).toLocaleString('it-IT');
            tr.innerHTML = `
                <td style="padding: 10px;">${dateStr}</td>
                <td style="padding: 10px;">${c.name || ''}</td>
                <td style="padding: 10px;">${c.email || ''}</td>
                <td style="padding: 10px;">${c.phone || ''}</td>
                <td style="padding: 10px;">${c.motivation || ''}</td>
                <td style="padding: 10px; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${c.message || ''}">${c.message || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

function downloadCSV() {
    if (contactsData.length === 0) return alert('Nessun dato da scaricare');
    
    const headers = ['Data', 'Nome', 'Email', 'Telefono', 'Motivo', 'Messaggio'];
    const rows = contactsData.map(c => [
        new Date(c.created_at).toLocaleString('it-IT'),
        c.name || '',
        c.email || '',
        c.phone || '',
        c.motivation || '',
        (c.message || '').replace(/\n/g, ' ')
    ]);
    
    const csvContent = [
        headers.join(','),
        ...rows.map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'contatti.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('edit-cover-btn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            document.getElementById('image-to-crop').src = url;
            document.getElementById('cropModal').style.display = 'flex';
            
            if (cropper) cropper.destroy();
            cropper = new Cropper(document.getElementById('image-to-crop'), {
                aspectRatio: 1 / 1, // Copertina quadrata!
                viewMode: 1
            });
            
            activeImageCallback = async (uploadedUrl) => {
                document.getElementById('project-cover-preview').src = uploadedUrl;
                document.getElementById('project-cover-preview').style.display = 'block';
                
                // Save it to the database
                try {
                    await fetch(`/api/projects/${currentProjectId}/cover`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ hero_image: uploadedUrl })
                    });
                    
                    // Reload projects list to update the sidebar reference
                    loadProjects();
                    
                    alert('Copertina aggiornata con successo!');
                } catch(err) {
                    console.error(err);
                    alert('Errore durante il salvataggio della copertina');
                }
            };
        }
    };
    input.click();
});
