# Vanzameteo

Sito meteo di Vanza (Trambileno, TN): condizioni attuali, grafico delle prossime 24 ore,
previsioni a 7 giorni e webcam live. Applicazione Angular statica, pensata per essere
pubblicata su [vanzameteo.altervista.org](https://vanzameteo.altervista.org).

I dati attuali e lo storico arrivano dalla stazione di Vanza su MeteoNetwork, tramite il
backend PHP già presente sul sito (`backend.php/weatherData` e `backend.php/getTemps`). Le
previsioni arrivano da [Open-Meteo](https://open-meteo.com/) (gratuito, senza chiave API, licenza
CC BY 4.0), che fa anche da riserva se la stazione non risponde. L'immagine di sfondo cambia in base al tempo (sole, nuvoloso, pioggia, neve).

## Requisiti

- Node.js ≥ 22.22.3 (consigliato 24, vedi `.nvmrc`)
- npm

## Sviluppo

```bash
npm install
npm start          # http://localhost:4200 (backend.php inoltrato al sito vero, vedi proxy.conf.json)
npm run test:ci    # test unitari (Vitest)
npm run build      # build di produzione in dist/vanzameteo-angular/browser
```

## Configurazione

Tutto ciò che riguarda la stazione sta in [`public/config.json`](public/config.json), letto
dall'app all'avvio. Si può modificare anche direttamente sul server, senza ricompilare:

| Campo                   | Descrizione                                               |
| ----------------------- | --------------------------------------------------------- |
| `stationName`           | Nome mostrato nella barra di navigazione                  |
| `location`              | Nome località, latitudine, longitudine e fuso orario      |
| `weatherRefreshMinutes` | Ogni quanti minuti ricaricare le previsioni (0 = mai)     |
| `station.apiUrl`        | Indirizzo di `backend.php` (vuoto = solo Open-Meteo)      |
| `station.refreshMinutes`| Ogni quanti minuti rileggere la stazione (0 = mai)        |
| `station.infoUrl`       | Pagina della stazione su MeteoNetwork                     |
| `webcam.url`            | Indirizzo dell'immagine della webcam                      |
| `webcam.refreshSeconds` | Ogni quanti secondi ricaricare la webcam (0 = mai)        |

## Struttura

```
src/app/
  core/config/       configurazione runtime (config.json)
  core/weather/      servizio Open-Meteo, modelli, codici meteo WMO → descrizione/immagine
  layout/navbar/     barra di navigazione
  features/dashboard pagina principale (meteo attuale, grafico, previsioni, webcam)
  features/about     pagina Info
public/              file copiati così come sono nella build (immagini, config.json, .htaccess)
```

## Deploy su Altervista

La build è una cartella di file statici (`dist/vanzameteo-angular/browser`), incluso un
`.htaccess` che fa funzionare gli indirizzi dell'app (es. `/info`) senza toccare le cartelle
già presenti sul server (es. `/foicam`).

### Manuale (FTP)

1. `npm run build`
2. Carica **il contenuto** di `dist/vanzameteo-angular/browser/` nella cartella principale del
   sito con un client FTP (es. FileZilla, host `ftp.vanzameteo.altervista.org`). Assicurati che
   il client mostri/carichi anche i file nascosti (`.htaccess`).

Per pubblicarla in una sottocartella (es. `/nuovo/`) compila con
`npm run build -- --base-href /nuovo/` e carica i file in quella cartella.

### Automatico (GitHub Actions)

Il workflow [`deploy.yml`](.github/workflows/deploy.yml) compila, esegue i test e carica i file
via FTP. Su GitHub, in *Settings → Secrets and variables → Actions*, imposta:

- **Secrets**: `FTP_SERVER` (`ftp.vanzameteo.altervista.org`), `FTP_USERNAME`, `FTP_PASSWORD`
- **Variables** (facoltative): `FTP_SERVER_DIR` (default `./`), `BASE_HREF` (default `/`),
  `DEPLOY_ON_PUSH` = `true` per pubblicare a ogni push su `dev/angular`

Il deploy si avvia a mano da *Actions → Deploy su Altervista → Run workflow*, scegliendo la
destinazione:

- **prova** (predefinita): sottocartella `/prova/`, visibile su
  https://vanzameteo.altervista.org/prova/ senza toccare il sito attuale;
- **principale**: cartella principale del sito.

Con `DEPLOY_ON_PUSH` = `true` ogni push su `dev/angular` pubblica anche nella principale.
L'azione cancella sul server solo i file che ha caricato lei stessa nei deploy precedenti,
quindi le altre cartelle del sito restano intatte.

> **Nota Altervista**: l'FTP accetta solo le nazioni consentite nel pannello di controllo. I
> server di GitHub sono di solito negli Stati Uniti: se il deploy fallisce con
> `530 Autenticazione fallita ... aggiungi la nazione`, aggiungi gli Stati Uniti tra le nazioni
> consentite per l'FTP.
