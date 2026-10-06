# Vanzameteo

App Angular (Node ≥ 22.22.3) pubblicata via FTP su vanzameteo.altervista.org.

## Deploy

- Ogni nuova versione va pubblicata **prima nella cartella `/test/`** (workflow `deploy.yml`,
  destinazione `test`). La destinazione `principale` si usa solo dopo che il proprietario ha
  verificato `/test/` e chiede esplicitamente di pubblicare sul sito principale.
- Il backend PHP (`backend.php`, `config.php`) e `/foicam` stanno sul server, non in questo repo:
  non vanno sovrascritti.

## Comandi

- `npm run test:ci` — test unitari
- `npm run build` — build in `dist/vanzameteo-angular/browser`
