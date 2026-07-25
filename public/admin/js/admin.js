document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    loadProjects();

    // Salva Testi Globali
    document.getElementById('text_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = ['home_title', 'about_text'];
        
        try {
            for (const field of fields) {
                const val = document.getElementById(field).value;
                await fetch(`/api/content/${field}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value: val })
                });
            }
            alert('Testi salvati con successo!');
        } catch (error) {
            alert('Errore durante il salvataggio dei testi');
        }
    });

    // Crea Nuovo Progetto
    document.getElementById('project_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('partner_name', document.getElementById('partner_name').value);
        formData.append('project_name', document.getElementById('project_name').value);
        formData.append('intro_text', document.getElementById('intro_text').value);
        formData.append('main_content', document.getElementById('main_content').value);
        
        const files = document.getElementById('project_images').files;
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                body: formData
            });
            if(res.ok) {
                document.getElementById('project_form').reset();
                loadProjects();
                alert('Progetto creato con successo!');
            } else {
                alert('Errore dal server.');
            }
        } catch (err) {
            alert('Errore di connessione.');
        }
    });
});

async function loadContent() {
    try {
        const res = await fetch('/api/content');
        const data = await res.json();
        for (const key in data) {
            const el = document.getElementById(key);
            if (el) el.value = data[key];
        }
    } catch (e) {
        console.error("Errore nel caricamento del contenuto", e);
    }
}

async function loadProjects() {
    try {
        const res = await fetch('/api/projects');
        const projects = await res.json();
        const container = document.getElementById('admin_projects_container');
        container.innerHTML = '';
        
        projects.forEach(proj => {
            const div = document.createElement('div');
            div.style.border = '1px solid #ccc';
            div.style.padding = '15px';
            div.style.marginBottom = '15px';
            div.style.borderRadius = '5px';
            div.style.background = '#fff';
            
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin-top:0;">${proj.partner_name} - ${proj.project_name}</h3>
                        <p style="font-size:0.9rem; color:#666;">ID: ${proj.id} | Creato il: ${new Date(proj.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onclick="deleteProject(${proj.id})" style="background:#dc3545;">Elimina</button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        console.error("Errore nel caricamento dei progetti", e);
    }
}

window.deleteProject = async function(id) {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
        try {
            await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            loadProjects();
        } catch (e) {
            alert('Errore eliminazione progetto');
        }
    }
}
