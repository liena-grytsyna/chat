import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3001
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const CLIENT_ORIGINS = CLIENT_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
const DEFAULT_ROOM = 'general'
const ALLOWED_ROOMS = new Set([DEFAULT_ROOM, 'team', 'random'])
const MAX_HISTORY = 50
const MAX_MESSAGE_LENGTH = 200
const MAX_USERNAME_LENGTH = 24
const roomHistories = new Map()

const getRoom = (room) => ALLOWED_ROOMS.has(room) ? room : DEFAULT_ROOM

const getRoomHistory = (room) => {
  if (!roomHistories.has(room)) {
    roomHistories.set(room, [])
  }
  return roomHistories.get(room)
}

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGINS,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.join(DEFAULT_ROOM)
  socket.emit('chat:history', {
    room: DEFAULT_ROOM,
    history: getRoomHistory(DEFAULT_ROOM),
  })

  socket.on('chat:join', (payload) => {
    const room = getRoom(payload?.room)

    socket.rooms.forEach((joinedRoom) => {
      if (joinedRoom !== socket.id) socket.leave(joinedRoom)
    })

    socket.join(room)
    console.log(`Client ${socket.id} joined room: ${room}`)
    socket.emit('chat:history', { room, history: getRoomHistory(room) })
  })

  socket.on('chat:message', (payload) => {
    const user = (payload?.user ?? 'Guest').toString().trim().slice(0, MAX_USERNAME_LENGTH)
    const text = (payload?.text ?? '').toString().trim().slice(0, MAX_MESSAGE_LENGTH)
    const room = getRoom(payload?.room)

    if (!text) return

    const message = {
      id: randomUUID(),
      user: user || 'Guest',
      text,
      timestamp: Date.now(),
      room,
    }

    const history = getRoomHistory(room)
    history.push(message)

    if (history.length > MAX_HISTORY) {
      history.splice(0, history.length - MAX_HISTORY)
    }

    io.to(room).emit('chat:message', message)
  })

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id} (${reason})`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`)
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`)
})
