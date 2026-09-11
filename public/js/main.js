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

// Mobile Project Modals Logic (with X close button)
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
        const projectItems = document.querySelectorAll('.hover-style-c');
        projectItems.forEach(item => {
            const popupContent = item.querySelector('.popup-content');
            if (popupContent) {
                // Create close X button
                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = 'position: absolute; top: 10px; right: 15px; font-size: 2rem; color: white; cursor: pointer; line-height: 1; z-index: 999999;';
                popupContent.style.position = 'relative';
                popupContent.appendChild(closeBtn);

                item.addEventListener('click', (e) => {
                    // If clicking the close button
                    if (e.target === closeBtn) {
                        e.preventDefault();
                        e.stopPropagation();
                        item.classList.remove('modal-active');
                        return;
                    }
                    
                    // If it's a link and it's NOT active yet, prevent default and show modal
                    if (!item.classList.contains('modal-active')) {
                        e.preventDefault();
                        // Close others
                        document.querySelectorAll('.hover-style-c.modal-active').forEach(activeItem => {
                            activeItem.classList.remove('modal-active');
                        });
                        item.classList.add('modal-active');
                    } else {
                        // It IS active. If they clicked outside the popup-content (the dark overlay), close it!
                        if (!e.target.closest('.popup-content')) {
                            e.preventDefault();
                            item.classList.remove('modal-active');
                        }
                        // Otherwise (they clicked inside popup content, e.g. the CTA), let the normal navigation happen!
                    }
                });
            }
        });
    }
});
