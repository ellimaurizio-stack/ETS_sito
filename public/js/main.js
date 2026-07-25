document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
    fetchGallery();
    
    // Hamburger menu logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});

async function fetchContent() {
    try {
        const response = await fetch('/api/content');
        const data = await response.json();
        
        // Sostituisce il testo negli elementi che hanno data-cms
        document.querySelectorAll('[data-cms]').forEach(el => {
            const key = el.getAttribute('data-cms');
            if (data[key]) {
                el.textContent = data[key];
            }
        });
    } catch (error) {
        console.error('Errore nel caricamento dei contenuti:', error);
    }
}

async function fetchGallery() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        
        const container = document.getElementById('gallery_container');
        if(!container) return; // Se non c'è il container nella pagina attuale, esci
        
        container.innerHTML = '';
        
        function createProjectCard(project) {
            const div = document.createElement('div');
            div.className = 'project-item';
            div.style.backgroundImage = `url('${project.hero_image}')`;

            const titleDiv = document.createElement('div');
            titleDiv.className = 'project-title';
            titleDiv.textContent = project.project_name || 'Progetto';

            div.appendChild(titleDiv);

            // Hover Effect Details
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'project-details';
            detailsDiv.innerHTML = `
                <h3>${project.partner_name}</h3>
                <p>${project.intro_text ? project.intro_text.substring(0, 80) + '...' : ''}</p>
                <a href="progetto-${project.id}.html" class="btn" style="background: white; color: var(--color-dark-blue);">SCOPRI DI PIÙ</a>
            `;
            div.appendChild(detailsDiv);

            return div;
        }

        projects.forEach(proj => {
            container.appendChild(createProjectCard(proj));
        });
    } catch (error) {
        console.error('Errore nel caricamento dei progetti:', error);
    }
}

// Contact form logic
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.privacy_agreed = data.privacyCheck === 'on';
            
            const motivationSelect = document.getElementById('motivationSelect');
            if(motivationSelect) {
                data.motivation = motivationSelect.value;
            }

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                if (response.ok) {
                    alert('Grazie! Il tuo messaggio è stato inviato con successo.');
                    contactForm.reset();
                } else {
                    alert('Errore: ' + result.error);
                }
            } catch (err) {
                console.error(err);
                alert('Errore durante l\'invio del messaggio.');
            }
        });
    }
});
