const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

const blocks = [
  { type: 'projectHeroDoubleLogo', order: 0, content: { bg_image: "uploads/bullone-hero.jpg", logo_left: "", logo_right: "" } },
  { type: 'projectIntro', order: 1, content: { title_thin: "Fondazione", title_bold: "IL BULLONE", description: "Ci sono progetti che ci ricordano perché facciamo questo mestiere.\nCollaborare con Fondazione Il Bullone è uno di questi.\nCon loro abbiamo ideato e lanciato la nuova campagna digital di raccolta fondi indirizzata alla Fondazione. Un progetto che parla di rinascita, coraggio e comunicazione come strumento di cambiamento reale." } },
  { type: 'imageGallery3', order: 2, content: { images: ["uploads/g1-1.jpg", "uploads/g1-2.jpg", "uploads/g1-3.jpg"], align: "left" } },
  { type: 'textBlock', order: 3, content: { title: "La penna come simbolo di rinascita", text: "Per i giovani della Fondazione – i <strong>B.Livers</strong> – la scrittura è un atto catartico: raccontarsi diventa il primo passo per riconoscersi di nuovo come persone, e non solo come pazienti o ex malati.\n<strong>La campagna mostra \"gli effetti\" che una penna può avere</strong>: alleggerire, far dimenticare la malattia e restituire la voglia di mettersi in gioco.\nProtagonisti sono cinque giovani redattori del giornale Il Bullone, che con le loro parole ci invitano a un gesto concreto: abbonarsi e donare per permettere ad altri ragazzi di intraprendere lo stesso percorso.\n\"Abbiamo scelto di raccontare la leggerezza ritrovata\", spiega Sergio Muller, Chief Communication Officer di A-Tono. \"Cinque giovani e una penna, che diventa protagonista di piccoli momenti in cui si riscoprono come individui e non più solo come malati.\"" } },
  { type: 'textBlock', order: 4, content: { title: "Una strategia digital-first per amplificare il valore", text: "La campagna è stata pensata con un <strong>approccio digital-first</strong>, ottimizzando ogni euro investito per massimizzare impatto e conversione. La strategia media e i contenuti sono stati progettati per parlare alle persone giuste, nel modo più empatico, diretto e sostenibile possibile.\n\"La collaborazione con A-Tono ETS ci permette di amplificare la voce dei nostri ragazzi e il valore del nostro modello\", afferma Bill Niada, fondatore e presidente di Fondazione Il Bullone. \"Crediamo che questa campagna, potente nella sua autenticità e mirata nella strategia digital, ci aiuterà a raggiungere nuovi sostenitori indispensabili per <strong>garantire un futuro ai giovani che hanno affrontato esperienze di malattia grave</strong>.\"" } },
  { type: 'textBlock', order: 5, content: { title: "Restituire valore alla società attraverso la comunicazione", text: "Per A-Tono ETS, questo progetto è molto più di una campagna: è un modo per restituire valore alla società, mettendo <strong>creatività, competenza e tecnologia al servizio di chi costruisce futuro e speranza</strong>.\n\"Siamo onorati di affiancare Fondazione Il Bullone in questa sfida,\" racconta Anastasia Granata, presidente di A-Tono ETS. \"Il Bullone non è solo un giornale, ma un vero laboratorio di rinascita. Il nostro obiettivo è stato tradurre la potenza emotiva di queste storie in una campagna digital efficace, capace di generare un impatto tangibile sulla vita dei B.Livers.\"" } },
  { type: 'imageGallery3', order: 6, content: { images: ["uploads/g2-1.jpg", "uploads/g2-2.jpg", "uploads/g2-3.jpg"], align: "right" } }
];

db.serialize(() => {
  db.run("DELETE FROM blocks WHERE project_id = 1", () => {
    const stmt = db.prepare("INSERT INTO blocks (project_id, type, order_index, content) VALUES (?, ?, ?, ?)");
    blocks.forEach(b => {
      stmt.run(1, b.type, b.order, JSON.stringify(b.content));
    });
    stmt.finalize(() => {
      console.log('Seeding done.');
      db.close();
    });
  });
});
