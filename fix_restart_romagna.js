const fs = require('fs');
const data = require('./parsed_modello_progetti.json');
const restart = data.find(d => d.Nome_Progetto === 'Restart Romagna');

if (restart) {
    restart.Titolo_Blocco_Testo_2 = "";
    restart.Testo_Blocco_2 = '<a href="https://www.youtube.com/watch?v=zkXhsGLq2-c&t=1s" target="_blank" style="color: var(--color-light-blue); font-weight: bold; text-decoration: underline; display: inline-block; margin-top: 1rem;">Scopri la case sul progetto qui</a>';

    fs.writeFileSync('parsed_modello_progetti.json', JSON.stringify(data, null, 2));
    console.log("Restart Romagna fixed.");
}
