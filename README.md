# chatter med Socket.IO, Vite og Sass

To rom i ett vindu: «Felles» og «Team». Klienten er ren JavaScript (Vite) med Sass-stiler, serveren på Socket.IO med egen historikk per rom.

## Hva er bygget
- To chat-rom og bryter mellom dem, aktivt rom vises i UI.
- Historikk per rom (inntil 50 meldinger) i minnet på serveren.
- Status for tilkobling (connecting/online/error) styrer send-knapp.
- Sass-layout med gradientbakgrunn; ESLint for klient og server.

## Lokal kjøring (npm)
```bash
npm install
npm run dev        # Vite 5173 + server 3001
# eller
npm run dev:client # bare klient
npm run dev:server # bare server
npm run lint       # ESLint
npm run build      # prod-build av klient
npm start          # bare server (bruker dist fra build)
```
Åpne `http://localhost:5173`, bytt mellom «Felles»/«Team» og test i flere faner.

## Docker / Compose
- Bygg og start:
  ```bash
  docker compose up -d --build
  ```
- Miljø:
  - `CLIENT_ORIGIN` — CORS origin(er), kommaseparert. Eksempel: `http://prooveeksamen`.
  - `PORT` — port for Socket.IO-server (default 3001).
  - `VITE_SOCKET_URL` (valgfritt) — overstyrer Socket.IO-URL i klienten. Uten denne bruker klienten `window.location.origin`.
- Nginx-proxy (NPM): domenet peker til port 80, кастомный location `/socket.io/` проксирует на port 3001, WebSockets på.

## CI (GitHub Actions)
- `.github/workflows/ci.yml` kjører på push/PR til `main`: `npm ci`, `npm run lint`, `npm run build`, og тестовые `docker build` для target `server` og `nginx`.

## Struktur
```
server/index.js        # Socket.IO-server, rom, historikk
src/main.js            # Vanilla-klient med rombytte og statusvisning
src/styles/index.scss  # Basisstiler, variabler, bakgrunn
src/styles/App.scss    # Layout, bryter, chat
index.html             # Enkel HTML uten React
Dockerfile             # multi-stage build (server/nginx)
docker-compose.yml     # app (port 3001) + nginx (port 80)
docker/nginx.conf      # proxy for statikk + /socket.io/
```

## Slik virker det
- Klienten kobler til Socket.IO og starter i rommet `general` («Felles»), kan bytte til `team`.
- Serveren sender historikk og nye meldinger только i valgt rom; max 50 meldinger lagres per rom.
- UI viser status; send-knappen deaktiveres hvis ikke online.
