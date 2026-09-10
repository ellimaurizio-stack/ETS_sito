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
            const a = document.createElement('a');
            a.className = 'project-item';
            a.href = `progetto-${project.id}.html`;
            a.style.backgroundImage = `url('${project.hero_image}')`;
            return a;
        }

        projects.forEach(proj => {
            container.appendChild(createProjectCard(proj));
        });
    } catch (error) {
        console.error('Errore nel caricamento dei progetti:', error);
    }
}

// Contact form logic removed since we use mailto HTML action now
