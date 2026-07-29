const fs = require('fs');

const data = require('./parsed_modello_progetti.json');
const cabina = data.find(d => d.Nome_Progetto === 'Cabina Rosa');

if (cabina) {
    // 1. Add header image
    cabina.Immagine_Header = "cabina-header.jpg";
    
    // 2. Change wrong title
    cabina.Titolo_Blocco_Testo_1 = "Un simbolo potente contro la violenza";
    
    // 3. Add missing period
    if (!cabina.Testo_Intro_Affianco_Al_Titolo.endsWith('.')) {
        cabina.Testo_Intro_Affianco_Al_Titolo += '.';
    }
    
    // 4. Fix excessive spacing (replace 3+ newlines with 2)
    const fixSpacing = (text) => text ? text.replace(/(\r?\n){3,}/g, '\n\n') : text;
    cabina.Testo_Blocco_1 = fixSpacing(cabina.Testo_Blocco_1);
    cabina.Testo_Blocco_2 = fixSpacing(cabina.Testo_Blocco_2);
    cabina.Testo_Blocco_2_1 = fixSpacing(cabina.Testo_Blocco_2_1);
    
    // 5. Make the three subtitles blue and bold
    cabina.Testo_Blocco_2_1 = cabina.Testo_Blocco_2_1.replace(
        "Il silenzio che squilla.",
        '<strong style="color: var(--color-light-blue); font-weight: 700; display: block; margin-top: 1.5rem;">Il silenzio che squilla.</strong>'
    );
    cabina.Testo_Blocco_2_1 = cabina.Testo_Blocco_2_1.replace(
        "Passala.",
        '<strong style="color: var(--color-light-blue); font-weight: 700; display: block; margin-top: 1.5rem;">Passala.</strong>'
    );
    // Remove the previous bold applied to "Cabina Rosa" to apply it to the whole line
    cabina.Testo_Blocco_2_1 = cabina.Testo_Blocco_2_1.replace(
        /<strong[^>]*>Cabina Rosa<\/strong>:\s*l’installazione urbana\./,
        '<strong style="color: var(--color-light-blue); font-weight: 700; display: block; margin-top: 1.5rem;">Cabina Rosa: l’installazione urbana.</strong>'
    );

    // Write back
    fs.writeFileSync('parsed_modello_progetti.json', JSON.stringify(data, null, 2));
    console.log("Cabina Rosa fixed.");
} else {
    console.log("Cabina Rosa not found.");
}
