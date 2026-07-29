const fs = require('fs');
const data = require('./parsed_modello_progetti.json');
const cabina = data.find(d => d.Nome_Progetto === 'Cabina Rosa');

if (cabina) {
    cabina.Testo_Blocco_2_1 = `La <strong style="color: var(--color-light-blue); font-weight: 700;">Cabina Rosa</strong> è l’ultimo passo di un progetto che si è sviluppato in tre momenti:

<strong style="color: var(--color-light-blue); font-weight: 700;">Il silenzio che squilla.</strong> Un video teaser ha mostrato telefoni rossi che suonano in mezzo alla folla. Nessuno rispondeva, finché una voce, quella di un’operatrice del <strong style="color: var(--color-light-blue); font-weight: 700;">1522</strong>, rompeva il buio dello schermo. Un invito chiaro: scegliere di agire.

<strong style="color: var(--color-light-blue); font-weight: 700;">Passala.</strong> Poi è arrivato il coinvolgimento dei creator, ognuno con una cornetta rossa da collegare al telefono: un simbolo potente, quasi fisico, che li invitava a parlare, ascoltare, intervenire. E ieri molti di loro erano lì, a “passare la cornetta” anche offline.

<strong style="color: var(--color-light-blue); font-weight: 700;">Cabina Rosa: l’installazione urbana.</strong> Dal 22 al 29 novembre la cabina rimarrà in Piazza Tre Torri, accanto a pannelli informativi che mostrano come riconoscere i segnali nascosti della violenza e come poter aiutare.

“Abbiamo scelto il linguaggio più immediato che esista: una chiamata. Ascoltarla è la prima azione che invitiamo a compiere”. ha spiegato Sergio Müller, Chief Communication Officer di A-Tono.
Un gesto semplice, quasi istintivo, eppure capace di aprire conversazioni profonde e forse cambiare le cose.

<strong style="color: var(--color-light-blue); font-weight: 700; display: block; margin-top: 1.5rem; margin-bottom: 0.5rem;">Una comunità che risponde</strong>La piazza è diventata un punto di incontro spontaneo: chi ascoltava, chi faceva domande, chi restava a leggere, chi rientrava per capire meglio. Un movimento silenzioso, fatto di piccoli gesti che insieme hanno creato una comunità temporanea.

“CityLife è un luogo che vive del dialogo tra persone, spazi e idee”, ha dichiarato Roberto Russo, Amministratore Delegato di SmartCityLife. “Siamo orgogliosi di ospitare un progetto che invita la città a fermarsi, ad ascoltare e a rispondere”. È esattamente quello che è accaduto.

Grazie. Di cuore. Grazie a chi è entrato nella <strong style="color: var(--color-light-blue); font-weight: 700;">Cabina Rosa</strong>. A chi ha ascoltato fino in fondo. Ai volontari, ai creator, ai passanti diventati partecipanti. E grazie a CityLife per l’accoglienza, a Mediamond per una visibilità che ha amplificato il messaggio in tutto il quartiere, e al Comune di Milano e alla Regione Lombardia per i patrocini che sostengono una causa che riguarda tutti.`;

    fs.writeFileSync('parsed_modello_progetti.json', JSON.stringify(data, null, 2));
    console.log("Cabina Rosa fixed block 2_1.");
}
