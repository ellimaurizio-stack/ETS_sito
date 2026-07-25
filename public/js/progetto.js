document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        fetchProject(id);
    } else {
        document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding: 5rem;">Nessun progetto selezionato</h2>';
    }
});

async function fetchProject(id) {
    try {
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) throw new Error('Progetto non trovato');
        
        const project = await response.json();
        
        // Popola l'intestazione
        const heroSection = document.getElementById('hero_section');
        if (project.hero_image) {
            heroSection.style.backgroundImage = `url('${project.hero_image}')`;
        }
        
        if (project.partner_logo) {
            document.getElementById('partner_logo').src = project.partner_logo;
        } else {
            document.getElementById('partner_logo').style.display = 'none';
        }

        document.getElementById('partner_name').textContent = project.partner_name;
        document.getElementById('project_name').textContent = project.project_name;
        document.getElementById('intro_text').innerHTML = project.intro_text.replace(/\n/g, '<br>');
        document.getElementById('main_content').innerHTML = project.main_content; // Questo è HTML vero e proprio

        // Popola le gallerie
        // Dividiamo le immagini: le prime 3 sopra, le successive sotto (massimo 3 per riga in questo design)
        const images = project.images || [];
        const galleryTop = document.getElementById('gallery_top');
        const galleryBottom = document.getElementById('gallery_bottom');

        images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            if (index < 3) {
                galleryTop.appendChild(img);
            } else if (index < 6) {
                galleryBottom.appendChild(img);
            }
        });

    } catch (error) {
        console.error(error);
        document.querySelector('main').innerHTML = '<h2 style="text-align:center; padding: 5rem;">Errore caricamento progetto</h2>';
    }
}
