const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cms.db');

db.serialize(() => {
    db.get("SELECT content, id FROM blocks WHERE page_slug = 'chi-siamo' AND type = 'htmlRaw' ORDER BY order_index LIMIT 1", (err, row) => {
        if (row) {
            let content = JSON.parse(row.content);
            let html = content.html;

            // Block 1 (White bold)
            html = html.replace('progetti capaci di generare un impatto sociale autentico', '<strong>progetti capaci di generare un impatto sociale autentico</strong>');
            html = html.replace('iniziative che promuovano inclusione, equità, dignità e solidarietà', '<strong>iniziative che promuovano inclusione, equità, dignità e solidarietà</strong>');
            html = html.replace("un'impronta che non sia solo visibile, ma anche significativa e duratura", "<strong>un'impronta che non sia solo visibile, ma anche significativa e duratura</strong>");

            // Manifesto intro
            html = html.replace('i valori che ci guidano ogni giorno.', '<strong>i valori che ci guidano ogni giorno.</strong>');

            // Manifesto items (White bold)
            html = html.replace('Nel valore di ogni persona e nella cura del suo benessere.', 'Nel <strong>valore di ogni persona</strong> e nella cura del suo <strong>benessere</strong>.');
            html = html.replace("Che l'inclusione sia una forza capace di unire e far crescere l'intera comunità.", "Che l'<strong>inclusione</strong> sia una forza capace di unire e far crescere l'intera <strong>comunità</strong>.");
            html = html.replace('Che innovazione e qualità siano strumenti per fare il bene in modo sostenibile.', 'Che <strong>innovazione e qualità</strong> siano strumenti per fare il <strong>bene</strong> in modo sostenibile.');
            html = html.replace('Che la solidarietà e la beneficenza possano trasformare vite e creare futuro.', 'Che la <strong>solidarietà</strong> e la <strong>beneficenza</strong> possano <strong>trasformare vite e creare futuro</strong>.');
            html = html.replace('Nel lavoro di squadra e nella collaborazione come chiave di ogni risultato.', 'Nel <strong>lavoro di squadra</strong> e nella <strong>collaborazione</strong> come chiave di ogni <strong>risultato</strong>.');
            html = html.replace("Nell'onestà, nella trasparenza e nell'integrità come basi di ogni relazione.", "Nell'<strong>onestà</strong>, nella <strong>trasparenza</strong> e nell'<strong>integrità</strong> come basi di ogni <strong>relazione</strong>.");
            html = html.replace("Che il rispetto delle persone, dei diritti e dell'ambiente sia un dovere.", "Che il <strong>rispetto</strong> delle persone, dei diritti e dell'ambiente sia un <strong>dovere</strong>.");
            html = html.replace('Che migliorarsi continuamente significhi anche migliorare il mondo attorno a noi.', 'Che <strong>migliorarsi continuamente</strong> significhi anche <strong>migliorare il mondo</strong> attorno a noi.');

            // Governance (Blue bold)
            const blueBold = '<strong style="color: var(--color-light-blue); font-weight: 700;">$1</strong>';
            
            html = html.replace(/(A-Tono the world in your hand ETS \(Codice Fiscale 97737800157\))/g, blueBold);
            html = html.replace(/(Organizzazione Non Governativa \(ONG\))/g, blueBold);
            html = html.replace(/(Organizzazioni della Società Civile)/g, blueBold);
            html = html.replace(/(RUNTS)/g, blueBold);

            content.html = html;

            db.run("UPDATE blocks SET content = ? WHERE id = ?", [JSON.stringify(content), row.id], () => {
                console.log(`Updated chi-siamo bold text`);
            });
        }
    });
});
