const db = require('./database');

const bulloneContent = `
<div style="margin-bottom: 2rem;">
    <h3 style="color: var(--color-dark-blue); font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.4;">La penna come simbolo di rinascita</h3>
    <p style="margin: 0; font-size: 1rem; line-height: 1.6; font-weight: 300;">Per i giovani della Fondazione – i <strong>B.Livers</strong> – la scrittura è un atto catartico: raccontarsi diventa il primo passo per riconoscersi di nuovo come persone, e non solo come pazienti o ex malati.<br>
    <strong>La campagna mostra "gli effetti" che una penna può avere</strong>: alleggerire, far dimenticare la malattia e restituire la voglia di mettersi in gioco.<br>
    Protagonisti sono cinque giovani redattori del giornale Il Bullone, che con le loro parole ci invitano a un gesto concreto: abbonarsi e donare per permettere ad altri ragazzi di intraprendere lo stesso percorso.<br>
    "Abbiamo scelto di raccontare la leggerezza ritrovata", spiega Sergio Muller, Chief Communication Officer di A-Tono. "Cinque giovani e una penna, che diventa protagonista di piccoli momenti in cui si riscoprono come individui e non più solo come malati."</p>
</div>
<div style="margin-bottom: 2rem;">
    <h3 style="color: var(--color-dark-blue); font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.4;">Una strategia digital-first per amplificare il valore</h3>
    <p style="margin: 0; font-size: 1rem; line-height: 1.6; font-weight: 300;">La campagna è stata pensata con un <strong>approccio digital-first</strong>, ottimizzando ogni euro investito per massimizzare impatto e conversione. La strategia media e i contenuti sono stati progettati per parlare alle persone giuste, nel modo più empatico, diretto e sostenibile possibile.<br>
    "La collaborazione con A-Tono ETS ci permette di amplificare la voce dei nostri ragazzi e il valore del nostro modello", afferma Bill Niada, fondatore e presidente di Fondazione Il Bullone. "Crediamo che questa campagna, potente nella sua autenticità e mirata nella strategia digital, ci aiuterà a raggiungere nuovi sostenitori indispensabili per <strong>garantire un futuro ai giovani che hanno affrontato esperienze di malattia grave</strong>."</p>
</div>
<div style="margin-bottom: 2rem;">
    <h3 style="color: var(--color-dark-blue); font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.4;">Restituire valore alla società attraverso la comunicazione</h3>
    <p style="margin: 0; font-size: 1rem; line-height: 1.6; font-weight: 300;">Per A-Tono ETS, questo progetto è molto più di una campagna: è un modo per restituire valore alla società, mettendo <strong>creatività, competenza e tecnologia al servizio di chi costruisce futuro e speranza</strong>.<br>
    "Siamo onorati di affiancare Fondazione Il Bullone in questa sfida," racconta Anastasia Granata, presidente di A-Tono ETS. "Il Bullone non è solo un giornale, ma un vero laboratorio di rinascita. Il nostro obiettivo è stato tradurre la potenza emotiva di queste storie in una campagna digital efficace, capace di generare un impatto tangibile sulla vita dei B.Livers."</p>
</div>
`;

const loremContent = `
<div style="margin-bottom: 2rem;">
    <h3 style="color: var(--color-dark-blue); font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.4;">Titolo sezione fittizia</h3>
    <p style="margin: 0; font-size: 1rem; line-height: 1.6; font-weight: 300;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
`;

const bulloneIntro = "Ci sono progetti che ci ricordano perché facciamo questo mestiere.\nCollaborare con Fondazione Il Bullone è uno di questi.\nCon loro abbiamo ideato e lanciato la nuova campagna digital di raccolta fondi indirizzata alla Fondazione. Un progetto che parla di rinascita, coraggio e comunicazione come strumento di cambiamento reale.";

const loremIntro = "Questo è un testo introduttivo fittizio per un progetto di esempio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed nisi ac mi tincidunt vehicula. Nullam hendrerit diam in sem scelerisque, nec egestas nisl volutpat.";

// Definisco array di 6 immagini placeholder
const fakeImages = [
    '/img/progetto-1.png',
    '/img/progetto-2.png',
    '/img/progetto-1.png',
    '/img/progetto-2.png',
    '/img/progetto-1.png',
    '/img/progetto-2.png'
];

db.serialize(() => {
    // Svuotiamo la tabella projects e reimpostiamo l'id
    db.run(`DELETE FROM projects`);
    db.run(`DELETE FROM sqlite_sequence WHERE name='projects'`);

    const stmt = db.prepare(`INSERT INTO projects (partner_name, project_name, intro_text, main_content, hero_image, partner_logo, images) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    for (let i = 1; i <= 18; i++) {
        if (i === 5) {
            stmt.run("Fondazione", "IL BULLONE", bulloneIntro, bulloneContent, "/img/chisiamo-hero.jpg", "/img/progetto-2.png", JSON.stringify(fakeImages));
        } else {
            stmt.run(`Partner ${i}`, `PROGETTO ${i}`, loremIntro, loremContent, "/img/chisiamo-hero.jpg", "/img/progetto-1.png", JSON.stringify(fakeImages));
        }
    }

    stmt.finalize(() => {
        console.log("Database popolato con 18 progetti. Il progetto 5 è Il Bullone.");
        process.exit(0);
    });
});
