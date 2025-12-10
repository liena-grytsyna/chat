import { createServer } from 'http'
import { Server } from 'socket.io'
import { randomUUID } from 'crypto'

// На каком порту запустить сервер (можно задать через переменную окружения)
const PORT = process.env.PORT ?? 3001

// Какому фронтенду (сайту) разрешаем подключаться
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173'

// Сколько последних сообщений хранить в истории
const MAX_HISTORY = 50

// Массив для хранения сообщений
const history = []

// Создаём обычный HTTP-сервер
const httpServer = createServer()

// Создаём Socket.io-сервер и "вешаем" его на HTTP-сервер
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
  },
})

// Когда новый клиент подключился
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  // Отправляем ему историю сообщений
  socket.emit('chat:history', history)

  // Когда клиент прислал сообщение
  socket.on('chat:message', (payload) => {
    const user = String(payload?.user || 'Guest').slice(0, 24)
    const text = String(payload?.text || '').trim()

    // Пустые сообщения игнорируем
    if (!text) return

    // Собираем объект сообщения
    const message = {
      id: randomUUID(),
      user,
      text,
      timestamp: Date.now(),
    }

    // Кладём в историю
    history.push(message)

    // Если сообщений больше, чем MAX_HISTORY — обрезаем старые
    if (history.length > MAX_HISTORY) {
      history.splice(0, history.length - MAX_HISTORY)
    }

    // Отправляем это сообщение всем подключённым клиентам
    io.emit('chat:message', message)
  })

  // Когда клиент отключился
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Запускаем сервер
httpServer.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`)
  console.log(`Allowing client origin: ${CLIENT_ORIGIN}`)
})
