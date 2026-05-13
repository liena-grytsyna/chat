# Chatter

Chatter is a real-time chat application built with a Vite frontend and a Socket.IO server. Users can choose a chat room, enter a display name, and send short messages in real time.

## Live Preview

[Live demo](https://chat.it4.iktim.no/)

## Technologies Used

- HTML
- SCSS
- JavaScript
- Vite
- Node.js
- Socket.IO
- ESLint
- Docker
- Nginx

## Getting Started

Clone the repository:

```bash
git clone https://github.com/liena-grytsyna/socket_chat.git
cd socket_chat
```

Install dependencies:

```bash
npm install
```

Run the project locally:

```bash
npm run dev
```

The Vite client runs on:

```bash
http://localhost:5173
```

The Socket.IO server runs on:

```bash
http://localhost:3001
```

## Environment Variables

Client:

```bash
VITE_SOCKET_URL=http://localhost:3001
```

Server:

```bash
PORT=3001
CLIENT_ORIGIN=http://localhost:5173
```

For deployment, set `VITE_SOCKET_URL` to the public URL of the deployed Socket.IO server and set `CLIENT_ORIGIN` to the public frontend URL.

## Available Scripts

```bash
npm run dev
```

Runs the frontend and backend together in development mode.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the production frontend build locally.

```bash
npm run lint
```

Runs ESLint checks.

```bash
npm start
```

Starts only the Socket.IO server.

## Features

- Real-time messaging with Socket.IO
- Multiple chat rooms: Felles, Team, and Random
- Display name input
- Connection status indicator
- Message length limit of 200 characters
- Latest 50 messages stored per room during server runtime
- Responsive layout for mobile and desktop screens

## Docker

Build and run the project with Docker Compose:

```bash
docker compose up -d --build
```

Stop the containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```
