# Chatter (Brukerstotte)

Dette dokumentet er laget for brukerstotte og beskriver hvordan chatten brukes,
hva som er vanlig feilsoking, og hvilke driftsgrep som trengs ved feil.

## Kort om prosjektet
- Sanntids chat med rom: general, team, random
- Socket.IO server + Vite klient
- Meldingsgrense: 200 tegn
- Historikk: siste 50 meldinger per rom

## Slik bruker du chatten
1) Aapne nettsiden i nettleser.
2) Skriv inn navn i feltet "Navn".
3) Velg rom i toppen (Felles/Team/Random).
4) Skriv melding og trykk "Send".

Statusindikator oppe til hoyre:
- "kobler til..." = forsoker a koble seg pa
- "tilkoblet" = alt ok
- "frakoblet" eller "feil ved tilkobling" = sjekk nett / last inn pa nytt

## Brukerstotte: vanlige problemer
- Kan ikke sende melding
  - Sjekk at status viser "tilkoblet"
  - Sjekk at meldingen er under 200 tegn
  - Sjekk at du har skrevet navn
- Ser ikke meldinger
  - Sjekk at alle er i samme rom
  - Oppdater siden (F5)
- Ingen tilkobling
  - Nettverk kan blokkere WebSocket
  - Proev igjen senere eller fra annet nett

## Hva du kan be brukeren om
- Skjermbilde av statusindikatoren
- Tidspunkt for feilen
- Hvilket rom de var i
- Om de bruker mobil eller PC

## Drift/administrator
### Sjekk at tjenesten kjore
```bash
docker compose ps
```

### Se logger
```bash
docker compose logs -f
```

### Restart
```bash
docker compose down
docker compose up -d --build
```

### Konfigurasjon
- `PORT` (server, default: 3001)
- `CLIENT_ORIGIN` (CORS, f.eks. https://ditt-domene.no)
- `VITE_SOCKET_URL` (valgfri i klient, brukes mest i dev)

## Teknisk oversikt (kort)
- Server: `server/index.js`
- Klient: `src/main.js`
- Nginx: `nginx.conf`
- Docker: `Dockerfile.server`, `Dockerfile.nginx`, `docker-compose.yml`

## Kontakt
Legg inn kontaktinfo her (epost eller Slack-kanal).
