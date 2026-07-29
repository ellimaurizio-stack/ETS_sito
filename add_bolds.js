const fs = require('fs');

const data = require('./parsed_modello_progetti.json');

const keywords = [
    "A-Tono ETS",
    "Società Sportiva",
    "Partizan Bonola",
    "A-Tono Partizan",
    "Fondazione Il Bullone",
    "B.Livers",
    "MUDEC",
    "The Art of Giving",
    "Cabina Rosa",
    "Restart Romagna",
    "DropTicket",
    "Kayros",
    "Un Cuore Un Mondo",
    "Mettiamoci il Quore",
    "1522",
    "aggregazioni positive",
    "rinascita",
    "impatto sociale",
    "prevenzione",
    "violenza di genere",
    "digital-first",
    "strategia media e i contenuti",
    "creatività, competenza e tecnologia",
    "donazioni aggiuntive immediate",
    "Giornata internazionale per l’eliminazione della violenza contro le donne",
    "Protezione Civile dell'Emilia Romagna",
    "reinserimento sociale",
    "cardiopatie congenite pediatriche",
    "Ospedale del Cuore di Massa"
];

function boldText(text) {
    if (!text) return text;
    let newText = text;
    keywords.forEach(kw => {
        // Use a case-insensitive regex that ensures we don't double-bold
        const regex = new RegExp(`(?<!>)${kw}(?!<)`, 'gi');
        newText = newText.replace(regex, match => `<strong style="color: var(--color-light-blue); font-weight: 700;">${match}</strong>`);
    });
    return newText;
}

data.forEach(row => {
    row.Testo_Intro_Affianco_Al_Titolo = boldText(row.Testo_Intro_Affianco_Al_Titolo);
    row.Testo_Blocco_1 = boldText(row.Testo_Blocco_1);
    row.Testo_Blocco_2 = boldText(row.Testo_Blocco_2);
    row.Testo_Blocco_2_1 = boldText(row.Testo_Blocco_2_1);
});

fs.writeFileSync('parsed_modello_progetti.json', JSON.stringify(data, null, 2));
console.log('Bolds added successfully.');
