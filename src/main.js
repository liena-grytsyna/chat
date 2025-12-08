import './styles/index.scss'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3001'

let username = `Guest-${Math.floor(Math.random() * 900 + 100)}`
let messages = []
let socket = null

const usernameInput = document.getElementById('usernameInput')
const messageInput = document.getElementById('messageInput')
const messageForm = document.getElementById('messageForm')
const sendButton = document.getElementById('sendButton')
const messagesContainer = document.getElementById('messagesContainer')
const statusElement = document.getElementById('status')
const statusText = statusElement.querySelector('.status__text')

usernameInput.value = username

function initSocket() {
  socket = io(SOCKET_URL, {
    autoConnect: false,
  })

  socket.on('connect', () => {
    updateStatus('connected', 'online')
  })

  socket.on('disconnect', () => {
    updateStatus('disconnected', 'disconnected')
  })

  socket.on('connect_error', () => {
    updateStatus('error', 'error')
  })

  socket.on('chat:history', (history = []) => {
    messages = history
    renderMessages()
  })

  socket.on('chat:message', (incoming) => {
    messages.push(incoming)
    renderMessages()
  })

  socket.connect()
}

function updateStatus(status, text) {
  statusElement.classList.remove('status--connected', 'status--disconnected', 'status--error', 'status--connecting')
  statusElement.classList.add(`status--${status}`)
  statusText.textContent = text
  sendButton.disabled = status !== 'connected'
}

function sendMessage(event) {
  event.preventDefault()

  const text = messageInput.value.trim()

  if (!text) return

  socket.emit('chat:message', {
    user: usernameInput.value.trim() || 'Guest',
    text,
  })

  messageInput.value = ''
  messageInput.focus()
}

function renderMessages() {
  messagesContainer.innerHTML = ''

  messages.forEach((msg) => {
    const messageEl = document.createElement('article')
    messageEl.className = 'message'

    const time = formatTime(msg.timestamp)

    messageEl.innerHTML = `
      <header class="message__meta">
        <span class="message__user">${escapeHtml(msg.user)}</span>
        <span class="message__time">${time}</span>
      </header>
      <p class="message__text">${escapeHtml(msg.text)}</p>
    `

    messagesContainer.appendChild(messageEl)
  })

  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function formatTime(timestamp) {
  if (!timestamp) return '—'

  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

usernameInput.addEventListener('change', (event) => {
  username = event.target.value || username
})

messageForm.addEventListener('submit', sendMessage)

initSocket()
