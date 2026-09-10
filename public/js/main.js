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

// Smart mailto logic to bypass Chrome insecure form warning
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Blocca l'invio nativo per evitare l'avviso di Chrome
            
            const name = document.querySelector('input[name="name"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const phone = document.querySelector('input[name="phone"]').value;
            const message = document.querySelector('textarea[name="message"]').value;
            
            const subject = encodeURIComponent("Nuovo messaggio dal sito ETS da " + name);
            const body = encodeURIComponent(
                "Nome: " + name + "\n" +
                "Email: " + email + "\n" +
                "Telefono: " + phone + "\n\n" +
                "Messaggio:\n" + message
            );
            
            // Lancia l'apertura della mail in modo sicuro
            window.location.href = "mailto:ets@a-tono.com?subject=" + subject + "&body=" + body;
        });
    }
});
