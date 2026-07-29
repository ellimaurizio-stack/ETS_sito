const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('modello_progetti_anteprima.xlsx');
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

// Convert the Excel array into an object keyed by the image number.
// Row 0 is progetto-20.jpg
// Row 19 is progetto-1.jpg
const projectsMetadata = {};

data.forEach((row, index) => {
    let num = 20 - index;
    projectsMetadata[num] = {
        nome: row['Nome_Progetto'] || '',
        sottotitolo: row['Titolo_Sottile_Intro'] || '',
        titolo: row['Titolo_Grassetto_Intro'] || '',
        testo: row['Testo_Intro_Affianco_Al_Titolo'] || '',
        clickable: (row['CTA Scopri di più sul progetto'] || '').toLowerCase().includes('sì')
    };
});

fs.writeFileSync('projects.json', JSON.stringify(projectsMetadata, null, 2));
console.log('projects.json created successfully.');
