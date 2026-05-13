import { io } from 'socket.io-client'
import './styles/index.scss'

const $ = (id) => document.getElementById(id)
const statusEl = $('status')
const statusText = statusEl?.querySelector('.status__text')
const form = $('messageForm')
const messageInput = $('messageInput')
const sendButton = $('sendButton')
const usernameInput = $('usernameInput')
const messages = $('messagesContainer')
const roomSwitcher = $('roomSwitcher')
const activeRoomLabel = $('activeRoomLabel')

const DEFAULT_ROOM = 'general'
const MAX_MESSAGE_LENGTH = 200
const ROOM_LABELS = { general: 'Felles', team: 'Team', random: 'Random' }
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : window.location.origin)

let connected = false
let currentRoom = DEFAULT_ROOM
const roomHistories = new Map()

const socket = io(SOCKET_URL)

const getRoomHistory = (room) => {
  if (!roomHistories.has(room)) {
    roomHistories.set(room, [])
  }
  return roomHistories.get(room)
}

const setStatus = (state, text) => {
  if (!statusEl || !statusText) return

  statusEl.className = `status status--${state}`
  statusText.textContent = text
}

const updateMessageState = () => {
  if (!sendButton || !messageInput) return

  const message = messageInput.value.trim()
  const isTooLong = message.length > MAX_MESSAGE_LENGTH

  messageInput.classList.toggle('error', isTooLong)
  sendButton.disabled = !connected || !message || isTooLong
}

const formatTime = (timestamp) => new Date(timestamp || Date.now()).toLocaleTimeString('no-NO', {
  hour: '2-digit',
  minute: '2-digit',
})

const addMessage = ({ user, text, timestamp }) => {
  if (!messages) return

  const item = document.createElement('article')
  const meta = document.createElement('div')
  const userEl = document.createElement('span')
  const timeEl = document.createElement('time')
  const textEl = document.createElement('p')

  item.className = 'message'
  meta.className = 'message__meta'
  userEl.className = 'message__user'
  textEl.className = 'message__text'

  userEl.textContent = user || 'Guest'
  timeEl.dateTime = new Date(timestamp || Date.now()).toISOString()
  timeEl.textContent = formatTime(timestamp)
  textEl.textContent = text || ''

  meta.append(userEl, timeEl)
  item.append(meta, textEl)
  messages.appendChild(item)
  messages.scrollTop = messages.scrollHeight
}

const renderHistory = () => {
  if (!messages) return

  messages.innerHTML = ''
  getRoomHistory(currentRoom).forEach(addMessage)
}

const setRoom = (room) => {
  if (!ROOM_LABELS[room] || room === currentRoom) return

  currentRoom = room

  roomSwitcher?.querySelectorAll('.switcher__tab').forEach((tab) => {
    const isActive = tab.dataset.room === room
    tab.classList.toggle('is-active', isActive)
    tab.setAttribute('aria-selected', String(isActive))
  })

  if (activeRoomLabel) {
    activeRoomLabel.textContent = ROOM_LABELS[room]
  }

  renderHistory()
  socket.emit('chat:join', { room })
}

setStatus('connecting', 'kobler til...')
updateMessageState()

roomSwitcher?.addEventListener('click', (event) => {
  const tab = event.target.closest('.switcher__tab')
  if (tab) setRoom(tab.dataset.room)
})

socket.on('connect', () => {
  connected = true
  setStatus('connected', 'tilkoblet')
  updateMessageState()
})

socket.on('disconnect', () => {
  connected = false
  setStatus('error', 'frakoblet')
  updateMessageState()
})

socket.on('connect_error', () => {
  connected = false
  setStatus('error', 'feil ved tilkobling')
  updateMessageState()
})

socket.on('reconnect_attempt', () => {
  setStatus('connecting', 'kobler til på nytt...')
})

socket.on('chat:history', (payload = {}) => {
  const room = payload.room || DEFAULT_ROOM
  const history = Array.isArray(payload.history) ? payload.history : []

  roomHistories.set(room, history)
  if (room === currentRoom) renderHistory()
})

socket.on('chat:message', (message = {}) => {
  const room = message.room || DEFAULT_ROOM

  getRoomHistory(room).push(message)
  if (room === currentRoom) addMessage(message)
})

messageInput?.addEventListener('input', updateMessageState)

form?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!connected || !messageInput) return

  const text = messageInput.value.trim()
  if (!text || text.length > MAX_MESSAGE_LENGTH) return

  socket.emit('chat:message', {
    user: usernameInput?.value.trim() || 'Guest',
    text,
    room: currentRoom,
  })

  messageInput.value = ''
  updateMessageState()
  messageInput.focus()
})
