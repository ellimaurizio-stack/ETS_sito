const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

const blocks = [
  { type: 'hero', order: 0, content: { title_top: "Your", title_top_span: "hand", title_bottom: "in my", title_bottom_span: "hand", description: "L'associazione <strong>A-Tono ETS</strong> supporta e promuove<br>progetti legati al mondo sanitario, scientifico e sociale." } },
  { type: 'textSplit', order: 1, content: { title_top: "A-Tono", title_bottom: "ETS", text_right: "A-Tono ETS nasce per connettere bisogni sociali reali con soluzioni già attive e radicate nei territori, offrendo visione strategica, competenze professionali e supporto operativo alle realtà che generano cambiamento. Siamo il lato sociale e solidale del gruppo A-Tono: mettiamo persone, esperienze e know-how al servizio della comunità, rafforzando progetti esistenti attraverso reti, sinergie e sostenibilità.", button_text: "SCOPRI CHI SIAMO", button_link: "chi-siamo.html" } },
  { type: 'partnersGrid', order: 2, content: { title_top: "Le realtà che abbiamo", title_bottom: "aiutato in questi anni", description: "Fino a oggi, abbiamo incontrato persone fantastiche con le quali abbiamo sviluppato bei progetti, <strong>ricchi di emozione e gioia nel farli.</strong>", button_text: "SCOPRILE TUTTE", button_link: "progetti.html", logos: ["img/progetto-1.png","img/progetto-2.png","img/progetto-1.png","img/progetto-2.png","img/progetto-1.png","img/progetto-2.png","img/progetto-1.png","img/progetto-2.png"] } },
  { type: 'textSplit', order: 3, content: { theme: 'light', layout: 'stacked', title_top: "Sostienici con una", title_bottom: "DONAZIONE", text_right: "Anche il tuo contributo può fare la differenza. Se desideri sostenere i nostri progetti e iniziative puoi effettuare una donazione tramite bonifico bancario.<br><br><strong>IBAN: [INSERIRE IBAN]</strong><br><br>Ogni donazione, grande o piccola, ci aiuta a sviluppare nuovi progetti di valore. Grazie per il tuo sostegno e per scegliere di essere parte del cambiamento." } },
  { type: 'textSplit', order: 4, content: { theme: 'blue', layout: 'stacked', title_top: "Puoi sostenerci", title_bottom: "anche nel tuo 5x1000", text_right: "Donare è semplice: basta inserire il nostro <strong>Codice Fiscale 97737800157</strong> nello spazio dedicato alle organizzazioni non profit nella tua dichiarazione dei redditi.<br><br>Un piccolo gesto può lasciare una grande impronta.", button_text: "SCOPRI I MODI IN CUI PUOI SOSTENERCI", button_link: "sostienici.html" } }
];

db.serialize(() => {
  db.run("DELETE FROM blocks WHERE page_slug = 'home'", () => {
    const stmt = db.prepare("INSERT INTO blocks (page_slug, type, order_index, content) VALUES (?, ?, ?, ?)");
    blocks.forEach(b => {
      stmt.run('home', b.type, b.order, JSON.stringify(b.content));
    });
    stmt.finalize(() => {
      console.log('Home seeding done.');
      db.close();
    });
  });
});
